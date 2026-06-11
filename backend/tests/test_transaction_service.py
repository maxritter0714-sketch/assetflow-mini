from datetime import date

import pytest

from app.schemas.transaction import TransactionCreate
from app.services.transaction_service import (
    create_transaction,
    delete_transaction,
    list_transactions,
)


def _txn(**kwargs) -> TransactionCreate:
    defaults = {
        "portfolio_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "symbol": "TEST",
        "name": "Test Stock",
        "transaction_type": "buy",
        "shares": 5.0,
        "price_per_share": 100.0,
        "sector": "Technology",
        "transaction_date": date(2024, 6, 1),
    }
    defaults.update(kwargs)
    return TransactionCreate(**defaults)


def test_create_transaction(db):
    txn = create_transaction(db, _txn())
    assert txn.id is not None
    assert txn.symbol == "TEST"
    assert txn.shares == 5.0
    assert txn.price_per_share == 100.0
    assert txn.transaction_type == "buy"
    delete_transaction(db, txn.id)


def test_create_transaction_uppercases_symbol(db):
    txn = create_transaction(db, _txn(symbol="tsla"))
    assert txn.symbol == "TSLA"
    delete_transaction(db, txn.id)


def test_create_transaction_unknown_portfolio_raises(db):
    with pytest.raises(ValueError, match="not found"):
        create_transaction(db, _txn(portfolio_id="nonexistent"))


def test_create_sell_transaction(db):
    txn = create_transaction(db, _txn(transaction_type="sell"))
    assert txn.transaction_type == "sell"
    delete_transaction(db, txn.id)


def test_list_transactions_returns_all_seeded(db):
    txns = list_transactions(db)
    assert len(txns) >= 6  # seed has 6 buy transactions


def test_list_transactions_filter_by_portfolio(db):
    txns = list_transactions(db, portfolio_id="f47ac10b-58cc-4372-a567-0e02b2c3d479")
    assert all(t.portfolio_id == "f47ac10b-58cc-4372-a567-0e02b2c3d479" for t in txns)
    assert len(txns) >= 3


def test_list_transactions_unknown_portfolio_returns_empty(db):
    txns = list_transactions(db, portfolio_id="nonexistent")
    assert txns == []


def test_list_transactions_ordered_by_date_desc(db):
    txns = list_transactions(db)
    dates = [t.transaction_date for t in txns]
    assert dates == sorted(dates, reverse=True)


def test_delete_transaction_returns_true(db):
    txn = create_transaction(db, _txn(symbol="DELTST"))
    assert delete_transaction(db, txn.id) is True


def test_delete_transaction_gone_after_delete(db):
    txn = create_transaction(db, _txn(symbol="GONE"))
    tid = txn.id
    delete_transaction(db, tid)
    remaining = [t.id for t in list_transactions(db)]
    assert tid not in remaining


def test_delete_transaction_returns_false_if_not_found(db):
    assert delete_transaction(db, "nonexistent-id") is False
