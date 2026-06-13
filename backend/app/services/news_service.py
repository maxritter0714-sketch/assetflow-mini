import json
import logging
import uuid
from datetime import UTC, datetime, timedelta

import yfinance as yf
from sqlalchemy.orm import Session

from app.models.cache import MarketDataCache

_NEWS_TTL = timedelta(minutes=15)

logger = logging.getLogger(__name__)

# Instruments whose news feeds cover macro-economic topics rather than equity ETF commentary
_MACRO_TICKERS = ["^TNX", "GC=F", "CL=F", "EURUSD=X", "^VIX"]

# Keywords to identify ticker-relevant articles. Yahoo Finance loosely tags articles
# to multiple tickers, so we filter out articles that don't mention the company at all.
# Tickers ≤ 2 chars (V, MA, HD, GS) are too short for safe symbol matching — hints only.
_TICKER_HINTS: dict[str, list[str]] = {
    "AAPL": ["apple", "iphone", "ipad", "mac", "airpods", "tim cook"],
    "MSFT": ["microsoft", "azure", "windows", "copilot", "satya nadella"],
    "NVDA": ["nvidia", "jensen huang", "blackwell", "cuda", "geforce", "hopper"],
    "GOOGL": ["google", "alphabet", "youtube", "deepmind", "gemini", "waymo"],
    "GOOG": ["google", "alphabet", "youtube", "deepmind", "gemini"],
    "META": ["meta", "facebook", "instagram", "whatsapp", "zuckerberg", "llama"],
    "TSLA": ["tesla", "elon musk", "cybertruck", "autopilot", "supercharger"],
    "AMD": ["amd", "advanced micro", "ryzen", "radeon", "epyc", "lisa su"],
    "AVGO": ["broadcom", "avgo"],
    "JPM": ["jpmorgan", "jp morgan", "jamie dimon", "chase"],
    "BAC": ["bank of america", "bofa", "merrill"],
    "V": ["visa"],
    "MA": ["mastercard"],
    "GS": ["goldman sachs", "goldman"],
    "JNJ": ["johnson & johnson", "j&j", "johnson and johnson"],
    "UNH": ["unitedhealth", "united health", "optum"],
    "LLY": ["eli lilly", "lilly", "mounjaro", "ozempic"],
    "ABBV": ["abbvie", "humira", "skyrizi"],
    "MRK": ["merck", "keytruda"],
    "AMZN": ["amazon", "aws", "prime", "bezos", "andy jassy"],
    "WMT": ["walmart", "wal-mart", "sam's club"],
    "COST": ["costco"],
    "HD": ["home depot"],
    "MCD": ["mcdonald", "big mac"],
    "XOM": ["exxon", "exxonmobil"],
    "CVX": ["chevron"],
    "COP": ["conocophillips", "conoco"],
}


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
        existing.expires_at = now + _NEWS_TTL
    else:
        db.add(MarketDataCache(
            id=str(uuid.uuid4()),
            cache_key=key,
            data_type="news",
            data=json.dumps(data),
            expires_at=now + _NEWS_TTL,
        ))
    db.commit()


def _parse_yf_item(raw: dict, symbol: str | None) -> dict | None:
    content = raw.get("content") or {}
    title = content.get("title", "").strip()
    url = (
        (content.get("canonicalUrl") or {}).get("url")
        or (content.get("clickThroughUrl") or {}).get("url")
        or ""
    )
    if not title or not url:
        return None
    source = (content.get("provider") or {}).get("displayName", "Yahoo Finance")
    pub_date = content.get("pubDate", "")
    summary = (content.get("summary") or "")[:300] or None
    return {
        "title": title,
        "url": url,
        "published_at": pub_date,
        "source": source,
        "ticker": symbol,
        "summary": summary,
    }


def _is_relevant(symbol: str, title: str, summary: str | None) -> bool:
    """Return True if the article appears to be about this ticker."""
    text = (title + " " + (summary or "")).lower()
    # For tickers ≥ 3 chars, a literal symbol match is a strong signal
    if len(symbol) >= 3 and symbol.lower() in text:
        return True
    # Company name / product hints
    for hint in _TICKER_HINTS.get(symbol.upper(), []):
        if hint in text:
            return True
    # Unknown ticker not in hints dict — don't filter, pass through
    return symbol.upper() not in _TICKER_HINTS


def _fetch_yfinance_news(symbol: str, limit: int = 20) -> list[dict]:
    raw = yf.Ticker(symbol).news or []
    items = []
    for n in raw[:limit]:
        parsed = _parse_yf_item(n, symbol.upper())
        if parsed:
            items.append(parsed)
    return items


def get_ticker_news(symbol: str, db: Session) -> tuple[list[dict], bool]:
    key = f"news:ticker:{symbol.upper()}"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        return cached["items"], False

    try:
        raw = _fetch_yfinance_news(symbol.upper())
        items = [i for i in raw if _is_relevant(symbol.upper(), i["title"], i.get("summary"))]
        if items:
            _cache_set(db, key, {"items": items})
            return items, False
    except Exception as exc:
        logger.warning("yfinance news failed for %s: %s", symbol, exc)

    if cached is not None:
        return cached["items"], True
    return [], False


def get_portfolio_news(tickers: list[str], db: Session) -> tuple[list[dict], bool]:
    if not tickers:
        return [], False
    key = f"news:portfolio:{','.join(sorted(tickers))}"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        return cached["items"], False

    try:
        merged: list[dict] = []
        seen_urls: set[str] = set()
        for sym in tickers[:6]:
            for item in _fetch_yfinance_news(sym, limit=8):
                if not _is_relevant(sym, item["title"], item.get("summary")):
                    continue
                if item["url"] not in seen_urls:
                    seen_urls.add(item["url"])
                    merged.append(item)
        merged.sort(key=lambda x: x["published_at"], reverse=True)
        items = merged[:25]
        if items:
            _cache_set(db, key, {"items": items})
            return items, False
    except Exception as exc:
        logger.warning("yfinance portfolio news failed: %s", exc)

    if cached is not None:
        return cached["items"], True
    return [], False


def get_macro_news(db: Session) -> tuple[list[dict], bool]:
    key = "news:macro"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        return cached["items"], False

    try:
        merged: list[dict] = []
        seen_urls: set[str] = set()
        for sym in _MACRO_TICKERS:
            for item in _fetch_yfinance_news(sym, limit=8):
                item_copy = {**item, "ticker": None}
                if item_copy["url"] not in seen_urls:
                    seen_urls.add(item_copy["url"])
                    merged.append(item_copy)
        merged.sort(key=lambda x: x["published_at"], reverse=True)
        items = merged[:25]
        if items:
            _cache_set(db, key, {"items": items})
            return items, False
    except Exception as exc:
        logger.warning("yfinance macro news failed: %s", exc)

    if cached is not None:
        return cached["items"], True
    return [], False
