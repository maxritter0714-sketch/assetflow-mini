import json
from datetime import UTC, datetime, timedelta
from unittest.mock import MagicMock, patch

import pytest

from app.models.cache import MarketDataCache
from app.services.market_data_service import get_current_price, get_price_history


def _make_ticker(price=None, previous_close=None, hist_empty=True, hist_bars=None):
    mock_info = MagicMock()
    mock_info.last_price = price
    mock_info.previous_close = previous_close

    mock_hist = MagicMock()
    mock_hist.empty = hist_empty
    if not hist_empty and hist_bars is not None:
        mock_hist.iterrows.return_value = iter(hist_bars)

    mock_ticker = MagicMock()
    mock_ticker.fast_info = mock_info
    mock_ticker.history.return_value = mock_hist
    return mock_ticker


def _insert_cache(db, key, data, expired=False):
    now = datetime.now(UTC).replace(tzinfo=None)
    expires_at = now - timedelta(minutes=1) if expired else now + timedelta(hours=1)
    entry = MarketDataCache(
        id="test-id-" + key[:20],
        cache_key=key,
        data_type="quote",
        data=json.dumps(data),
        expires_at=expires_at,
    )
    db.add(entry)
    db.commit()


# --- get_current_price ---

def test_quote_cache_miss_fetches_and_stores(db):
    with patch("yfinance.Ticker", return_value=_make_ticker(price=480.0)):
        price, stale = get_current_price("NVDA", db)

    assert price == 480.0
    assert stale is False
    entry = db.query(MarketDataCache).filter_by(cache_key="quote:NVDA").first()
    assert entry is not None
    assert json.loads(entry.data)["price"] == 480.0


def test_quote_cache_hit_returns_cached(db):
    _insert_cache(db, "quote:AAPL", {"price": 185.0, "symbol": "AAPL"})

    with patch("yfinance.Ticker") as mock_cls:
        price, stale = get_current_price("AAPL", db)
        mock_cls.assert_not_called()

    assert price == 185.0
    assert stale is False


def test_quote_stale_cache_yfinance_success_updates(db):
    _insert_cache(db, "quote:MSFT", {"price": 300.0, "symbol": "MSFT"}, expired=True)

    with patch("yfinance.Ticker", return_value=_make_ticker(price=420.0)):
        price, stale = get_current_price("MSFT", db)

    assert price == 420.0
    assert stale is False
    entry = db.query(MarketDataCache).filter_by(cache_key="quote:MSFT").first()
    assert json.loads(entry.data)["price"] == 420.0


def test_quote_stale_cache_yfinance_fails_returns_stale(db):
    _insert_cache(db, "quote:JNJ", {"price": 148.0, "symbol": "JNJ"}, expired=True)

    with patch("yfinance.Ticker", return_value=_make_ticker(price=None)):
        price, stale = get_current_price("JNJ", db)

    assert price == 148.0
    assert stale is True


def test_quote_no_cache_yfinance_fails_returns_none(db):
    with patch("yfinance.Ticker", return_value=_make_ticker(price=None)):
        price, stale = get_current_price("UNKNOWN", db)

    assert price is None
    assert stale is False


def test_quote_falls_back_to_previous_close(db):
    with patch("yfinance.Ticker", return_value=_make_ticker(price=None, previous_close=479.5)):
        price, stale = get_current_price("TSLA", db)

    assert price == 479.5
    assert stale is False


def test_quote_symbol_uppercased(db):
    with patch("yfinance.Ticker", return_value=_make_ticker(price=65.0)):
        price, _ = get_current_price("ko", db)

    assert price == 65.0
    entry = db.query(MarketDataCache).filter_by(cache_key="quote:KO").first()
    assert entry is not None


def test_quote_yfinance_exception_falls_back_to_stale(db):
    _insert_cache(db, "quote:VZ", {"price": 38.0, "symbol": "VZ"}, expired=True)

    def raise_on_ticker(symbol):
        raise RuntimeError("network error")

    with patch("yfinance.Ticker", side_effect=raise_on_ticker):
        price, stale = get_current_price("VZ", db)

    assert price == 38.0
    assert stale is True


# --- get_price_history ---

def _fake_bars():
    import pandas as pd
    idx = pd.Timestamp("2024-01-02")
    row = {"Open": 495.22, "High": 502.15, "Low": 492.33, "Close": 498.0, "Volume": 12345678}
    return [(idx, row)]


def test_history_cache_miss_fetches_and_stores(db):
    mock_ticker = _make_ticker(hist_empty=False, hist_bars=_fake_bars())
    with patch("yfinance.Ticker", return_value=mock_ticker):
        bars, stale = get_price_history("NVDA", db, "1y")

    assert bars is not None
    assert len(bars) == 1
    assert bars[0]["close"] == 498.0
    assert stale is False
    entry = db.query(MarketDataCache).filter_by(cache_key="history:NVDA:1y").first()
    assert entry is not None


def test_history_cache_hit_returns_cached(db):
    cached_bars = [{"date": "2024-01-02", "open": 495.22, "high": 502.15,
                    "low": 492.33, "close": 498.0, "volume": 12345678}]
    _insert_cache(db, "history:AAPL:1y", {"bars": cached_bars, "symbol": "AAPL", "period": "1y"})

    with patch("yfinance.Ticker") as mock_cls:
        bars, stale = get_price_history("AAPL", db, "1y")
        mock_cls.assert_not_called()

    assert bars == cached_bars
    assert stale is False


def test_history_stale_cache_yfinance_fails_returns_stale(db):
    cached_bars = [{"date": "2024-01-02", "open": 1.0, "high": 1.0,
                    "low": 1.0, "close": 1.0, "volume": 1}]
    _insert_cache(db, "history:MSFT:1y", {"bars": cached_bars, "symbol": "MSFT", "period": "1y"}, expired=True)

    with patch("yfinance.Ticker", return_value=_make_ticker(hist_empty=True)):
        bars, stale = get_price_history("MSFT", db, "1y")

    assert bars == cached_bars
    assert stale is True


def test_history_no_cache_yfinance_fails_returns_none(db):
    with patch("yfinance.Ticker", return_value=_make_ticker(hist_empty=True)):
        bars, stale = get_price_history("UNKNOWN", db, "1y")

    assert bars is None
    assert stale is False
