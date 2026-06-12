import json
import uuid
from datetime import UTC, datetime, timedelta

import yfinance as yf
from sqlalchemy.orm import Session

from app.models.cache import MarketDataCache

_QUOTE_TTL = timedelta(minutes=5)
_HISTORY_TTL = timedelta(hours=1)


def _utcnow() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def _cache_get(db: Session, key: str) -> tuple[dict | None, bool]:
    entry = db.query(MarketDataCache).filter(MarketDataCache.cache_key == key).first()
    if entry is None:
        return None, False
    is_stale = _utcnow() > entry.expires_at
    return json.loads(entry.data), is_stale


def _cache_set(db: Session, key: str, data_type: str, data: dict, ttl: timedelta) -> None:
    now = _utcnow()
    existing = db.query(MarketDataCache).filter(MarketDataCache.cache_key == key).first()
    if existing:
        existing.data = json.dumps(data)
        existing.expires_at = now + ttl
    else:
        db.add(MarketDataCache(
            id=str(uuid.uuid4()),
            cache_key=key,
            data_type=data_type,
            data=json.dumps(data),
            expires_at=now + ttl,
        ))
    db.commit()


def get_current_price(symbol: str, db: Session) -> tuple[float | None, bool]:
    """Returns (price, is_stale). price is None only if no data exists at all."""
    key = f"quote:{symbol.upper()}"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        return float(cached["price"]), False

    try:
        ticker = yf.Ticker(symbol)
        fi = ticker.fast_info
        price = fi.last_price or fi.previous_close
        if price is not None:
            _cache_set(db, key, "quote", {"price": float(price), "symbol": symbol.upper()}, _QUOTE_TTL)
            return float(price), False
    except Exception:
        pass

    if cached is not None:
        return float(cached["price"]), True
    return None, False


def get_price_history(symbol: str, db: Session, period: str = "1y") -> tuple[list[dict] | None, bool]:
    """Returns (bars list, is_stale). None only if no data exists at all."""
    key = f"history:{symbol.upper()}:{period}"
    cached, is_stale = _cache_get(db, key)

    if cached is not None and not is_stale:
        return cached["bars"], False

    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        if not hist.empty:
            bars = [
                {
                    "date": str(idx.date()),
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"]),
                }
                for idx, row in hist.iterrows()
            ]
            _cache_set(db, key, "history", {"bars": bars, "symbol": symbol.upper(), "period": period}, _HISTORY_TTL)
            return bars, False
    except Exception:
        pass

    if cached is not None:
        return cached["bars"], True
    return None, False
