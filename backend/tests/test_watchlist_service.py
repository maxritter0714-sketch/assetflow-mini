import pytest

from app.models.watchlist import WatchlistItem
from app.schemas.watchlist import WatchlistItemCreate
from app.services.watchlist_service import add_to_watchlist, list_watchlist, remove_from_watchlist


@pytest.fixture(autouse=True)
def _clean(db):
    db.query(WatchlistItem).delete()
    db.commit()
    yield


def _make(symbol="AAPL", name="Apple Inc."):
    return WatchlistItemCreate(symbol=symbol, name=name)


def test_add_to_watchlist(db):
    item = add_to_watchlist(db, _make())
    assert item.symbol == "AAPL"
    assert item.name == "Apple Inc."
    assert item.id is not None


def test_add_uppercases_symbol(db):
    item = add_to_watchlist(db, _make(symbol="nvda", name="NVIDIA"))
    assert item.symbol == "NVDA"


def test_add_duplicate_raises(db):
    add_to_watchlist(db, _make())
    with pytest.raises(ValueError, match="already on the watchlist"):
        add_to_watchlist(db, _make())


def test_list_watchlist(db):
    add_to_watchlist(db, _make("AAPL", "Apple"))
    add_to_watchlist(db, _make("MSFT", "Microsoft"))
    items = list_watchlist(db)
    symbols = [i.symbol for i in items]
    assert "AAPL" in symbols
    assert "MSFT" in symbols


def test_remove_returns_true(db):
    add_to_watchlist(db, _make())
    assert remove_from_watchlist(db, "AAPL") is True


def test_remove_returns_false_if_missing(db):
    assert remove_from_watchlist(db, "ZZZZZ") is False


def test_remove_clears_item(db):
    add_to_watchlist(db, _make())
    remove_from_watchlist(db, "AAPL")
    items = list_watchlist(db)
    assert all(i.symbol != "AAPL" for i in items)
