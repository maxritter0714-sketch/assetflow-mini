import json
import logging
import time
import uuid
from datetime import UTC, datetime, timedelta

import httpx
import yfinance as yf
from sqlalchemy.orm import Session

from app.core.config import FMP_API_KEY
from app.models.cache import MarketDataCache

_SCREENER_TTL = timedelta(hours=2)
_FMP_BASE = "https://financialmodelingprep.com/stable"

logger = logging.getLogger(__name__)

# Sector name normalisation — FMP uses verbose names, UI filter uses short names
_SECTOR_MAP = {
    "Consumer Cyclical": "Consumer",
    "Consumer Defensive": "Consumer",
    "Financial Services": "Finance",
    "Financial": "Finance",
    "Communication Services": "Technology",
    "Industrials": "Industrial",
    "Basic Materials": "Energy",
    "Real Estate": "Finance",
    "Utilities": "Energy",
}

# Fixed universe: covers every sector in the filter bar
_SCREENER_UNIVERSE = [
    # Technology
    "AAPL", "MSFT", "NVDA", "GOOGL", "META", "TSLA", "AMD", "AVGO",
    # Finance
    "JPM", "BAC", "V", "MA", "GS",
    # Healthcare
    "JNJ", "UNH", "LLY", "ABBV", "MRK",
    # Consumer
    "AMZN", "WMT", "COST", "HD", "MCD",
    # Energy
    "XOM", "CVX", "COP",
]


def _utcnow() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _cache_get(db: Session, key: str) -> tuple[dict | None, bool]:
    entry = db.query(MarketDataCache).filter(MarketDataCache.cache_key == key).first()
    if entry is None:
        return None, False
    is_stale = _utcnow() > entry.expires_at
    return json.loads(entry.data), is_stale


def _cache_set(db: Session, key: str, data: dict) -> None:
    now = _utcnow()
    existing = db.query(MarketDataCache).filter(MarketDataCache.cache_key == key).first()
    if existing:
        existing.data = json.dumps(data)
        existing.expires_at = now + _SCREENER_TTL
    else:
        db.add(MarketDataCache(
            id=str(uuid.uuid4()),
            cache_key=key,
            data_type="screener",
            data=json.dumps(data),
            expires_at=now + _SCREENER_TTL,
        ))
    db.commit()


def _fmp_get(client: httpx.Client, endpoint: str, symbol: str, extra: dict | None = None) -> list | dict | None:
    params = {"symbol": symbol, "apikey": FMP_API_KEY}
    if extra:
        params.update(extra)
    try:
        resp = client.get(f"{_FMP_BASE}/{endpoint}", params=params)
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        logger.warning("FMP %s failed for %s: %s", endpoint, symbol, exc)
        return None


def _fetch_universe() -> list[dict]:
    stocks: list[dict] = []
    ratios: dict[str, dict] = {}

    with httpx.Client(timeout=8.0) as client:
        # Pass 1 — profile
        for symbol in _SCREENER_UNIVERSE:
            data = _fmp_get(client, "profile", symbol)
            if isinstance(data, list) and data:
                item = data[0]
                raw_sector = item.get("sector") or ""
                sector = _SECTOR_MAP.get(raw_sector, raw_sector)
                price = item.get("price") or 0
                last_div = item.get("lastDividend") or 0
                div_yield = round((last_div / price) * 100, 2) if price > 0 else 0
                stocks.append({
                    "symbol": item.get("symbol", symbol),
                    "name": item.get("companyName", ""),
                    "sector": sector,
                    "market_cap": item.get("marketCap"),
                    "price": price,
                    "beta": item.get("beta"),
                    "div_yield": div_yield,
                    "exchange": item.get("exchange"),
                    "country": item.get("country"),
                    "pe": None,
                    "rev_growth": None,
                    "perf_6m": None,
                })
            time.sleep(0.05)

        # Pass 2 — ratios-ttm for P/E and rev growth
        for symbol in _SCREENER_UNIVERSE:
            raw = _fmp_get(client, "ratios-ttm", symbol)
            r: dict = {}
            if isinstance(raw, list) and raw:
                r = raw[0]
            elif isinstance(raw, dict):
                r = raw
            if r:
                ratios[symbol] = r
            time.sleep(0.05)

    # Merge ratios into stocks
    stocks_by_sym = {s["symbol"]: s for s in stocks}
    for symbol, r in ratios.items():
        if symbol not in stocks_by_sym:
            continue
        pe = r.get("priceToEarningsRatioTTM")
        stocks_by_sym[symbol]["pe"] = round(pe, 1) if pe and pe > 0 else None

    # yfinance fallback for symbols where FMP ratios-ttm returned 402 / rate-limited
    missing_pe = [sym for sym in _SCREENER_UNIVERSE if sym in stocks_by_sym and stocks_by_sym[sym]["pe"] is None]
    if missing_pe:
        logger.info("yfinance P/E fallback for %d symbols: %s", len(missing_pe), missing_pe)
        for sym in missing_pe:
            try:
                info = yf.Ticker(sym).info
                pe = info.get("trailingPE")
                stocks_by_sym[sym]["pe"] = round(pe, 1) if pe else None
                rg = info.get("revenueGrowth")
                stocks_by_sym[sym]["rev_growth"] = round(rg * 100, 1) if rg is not None else None
            except Exception as exc:
                logger.warning("yfinance fallback failed for %s: %s", sym, exc)

    # 6M price performance — single yfinance batch call
    try:
        hist = yf.download(
            _SCREENER_UNIVERSE,
            period="6mo",
            interval="1d",
            progress=False,
            auto_adjust=True,
        )
        close = hist["Close"]  # sub-DataFrame with tickers as columns (MultiIndex result)
        for sym in _SCREENER_UNIVERSE:
            if sym in stocks_by_sym and sym in close.columns:
                prices = close[sym].dropna()
                if len(prices) >= 2:
                    perf = round((float(prices.iloc[-1]) / float(prices.iloc[0]) - 1) * 100, 1)
                    stocks_by_sym[sym]["perf_6m"] = perf
    except Exception as exc:
        logger.warning("yfinance 6M perf failed: %s", exc)

    return list(stocks_by_sym.values())


def get_screener_results(
    db: Session,
    sector: str | None = None,
    market_cap_min: float | None = None,
    limit: int = 50,
) -> tuple[list[dict], bool]:
    key = "screener:universe"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        stocks = cached["stocks"]
    else:
        try:
            stocks = _fetch_universe()
            if stocks:
                _cache_set(db, key, {"stocks": stocks})
            elif cached is not None:
                return cached["stocks"], True
            else:
                return [], False
        except Exception as exc:
            logger.warning("screener fetch failed: %s", exc)
            if cached is not None:
                return cached["stocks"], True
            return [], False

    # Apply filters server-side
    if sector:
        stocks = [s for s in stocks if s.get("sector") == sector]
    if market_cap_min is not None:
        stocks = [s for s in stocks if (s.get("market_cap") or 0) >= market_cap_min]

    return stocks[:limit], is_stale if cached is not None else False
