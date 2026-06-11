import uuid
from datetime import date

from sqlalchemy.orm import Session

from app.models.portfolio import Portfolio, Transaction

_PORTFOLIOS = [
    {"id": "port-1", "name": "US Tech", "currency": "USD"},
    {"id": "port-2", "name": "Global Dividend", "currency": "USD"},
]

_TRANSACTIONS = [
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "shares": 10.0,
        "price_per_share": 400.0,
        "sector": "Technology",
        "portfolio_id": "port-1",
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "shares": 20.0,
        "price_per_share": 170.0,
        "sector": "Technology",
        "portfolio_id": "port-1",
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "shares": 15.0,
        "price_per_share": 380.0,
        "sector": "Technology",
        "portfolio_id": "port-1",
    },
    {
        "symbol": "JNJ",
        "name": "Johnson & Johnson",
        "shares": 25.0,
        "price_per_share": 155.0,
        "sector": "Healthcare",
        "portfolio_id": "port-2",
    },
    {
        "symbol": "VZ",
        "name": "Verizon Communications",
        "shares": 40.0,
        "price_per_share": 42.0,
        "sector": "Communication Services",
        "portfolio_id": "port-2",
    },
    {
        "symbol": "KO",
        "name": "The Coca-Cola Company",
        "shares": 30.0,
        "price_per_share": 60.0,
        "sector": "Consumer Staples",
        "portfolio_id": "port-2",
    },
]


def seed_db(db: Session) -> None:
    if db.query(Portfolio).count() > 0:
        return

    for p in _PORTFOLIOS:
        db.add(Portfolio(**p))

    for t in _TRANSACTIONS:
        db.add(Transaction(
            id=str(uuid.uuid4()),
            transaction_type="buy",
            transaction_date=date(2024, 1, 15),
            **t,
        ))

    db.commit()
