import json
import logging
import uuid
from datetime import UTC, datetime, timedelta

import yfinance as yf
from sqlalchemy.orm import Session

from app.models.cache import MarketDataCache

_FUNDAMENTALS_TTL = timedelta(hours=24)

logger = logging.getLogger(__name__)

_EXCHANGE_MAP = {
    "NMS": "NASDAQ", "NGM": "NASDAQ", "NNM": "NASDAQ",
    "NYQ": "NYSE", "PCX": "NYSE", "BTS": "NYSE",
}


def _utcnow() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _cache_get(db: Session, key: str) -> tuple[dict | None, bool]:
    entry = db.query(MarketDataCache).filter(MarketDataCache.cache_key == key).first()
    if entry is None:
        return None, False
    return json.loads(entry.data), _utcnow() > entry.expires_at


def _cache_set(db: Session, key: str, data: dict) -> None:
    now = _utcnow()
    existing = db.query(MarketDataCache).filter(MarketDataCache.cache_key == key).first()
    if existing:
        existing.data = json.dumps(data)
        existing.expires_at = now + _FUNDAMENTALS_TTL
    else:
        db.add(MarketDataCache(
            id=str(uuid.uuid4()),
            cache_key=key,
            data_type="fundamentals",
            data=json.dumps(data),
            expires_at=now + _FUNDAMENTALS_TTL,
        ))
    db.commit()


def _fmt_large(n: float | int | None) -> str | None:
    if n is None:
        return None
    n = float(n)
    sign, n = ("-", abs(n)) if n < 0 else ("", n)
    if n >= 1e12:
        return f"{sign}${n / 1e12:.2f}T"
    if n >= 1e9:
        return f"{sign}${n / 1e9:.1f}B"
    if n >= 1e6:
        return f"{sign}${n / 1e6:.1f}M"
    return f"{sign}${n:.0f}"


def _fetch(symbol: str) -> dict:
    info = yf.Ticker(symbol).info

    def pct(v: float | None) -> str | None:
        return f"{v * 100:.1f}%" if v is not None else None

    pe = info.get("trailingPE")
    de = info.get("debtToEquity")   # yfinance: percentage-style (6.555 = 0.066 ratio)
    dy = info.get("dividendYield")  # yfinance: already a percentage (0.49 = 0.49%)
    raw_exch = info.get("exchange", "")

    return {
        "market_cap": _fmt_large(info.get("marketCap")),
        "pe": round(pe, 1) if pe else None,
        "eps": info.get("trailingEps"),
        "beta": round(info["beta"], 2) if info.get("beta") else None,
        "high_52w": info.get("fiftyTwoWeekHigh"),
        "low_52w": info.get("fiftyTwoWeekLow"),
        "div_yield": f"{dy:.2f}%" if dy else "0.00%",
        "rev_growth": pct(info.get("revenueGrowth")),
        "revenue": _fmt_large(info.get("totalRevenue")),
        "net_income": _fmt_large(info.get("netIncomeToCommon")),
        "fcf": _fmt_large(info.get("freeCashflow")),
        "roe": pct(info.get("returnOnEquity")),
        "gross_margin": pct(info.get("grossMargins")),
        "op_margin": pct(info.get("operatingMargins")),
        "net_margin": pct(info.get("profitMargins")),
        "debt_equity": f"{de / 100:.2f}" if de is not None else None,
        "sector": info.get("sector"),
        "exchange": _EXCHANGE_MAP.get(raw_exch, raw_exch) or None,
    }


def get_fundamentals(symbol: str, db: Session) -> tuple[dict, bool]:
    key = f"fundamentals:{symbol.upper()}"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        return cached, False

    try:
        data = _fetch(symbol.upper())
        if data:
            _cache_set(db, key, data)
            return data, False
    except Exception as exc:
        logger.warning("fundamentals fetch failed for %s: %s", symbol, exc)

    if cached is not None:
        return cached, True
    return {}, False
