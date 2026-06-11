import uuid
from datetime import date

from sqlalchemy.orm import Session

from app.models.portfolio import Portfolio, Transaction

_PORTFOLIO_US_TECH_ID = "f47ac10b-58cc-4372-a567-0e02b2c3d479"
_PORTFOLIO_GLOBAL_DIV_ID = "9a8b7c6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4"

_PORTFOLIOS = [
    {"id": _PORTFOLIO_US_TECH_ID, "name": "US Tech", "currency": "USD"},
    {"id": _PORTFOLIO_GLOBAL_DIV_ID, "name": "Global Dividend", "currency": "USD"},
]

_TRANSACTIONS = [
    {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "shares": 10.0,
        "price_per_share": 400.0,
        "sector": "Technology",
        "portfolio_id": _PORTFOLIO_US_TECH_ID,
    },
    {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "shares": 20.0,
        "price_per_share": 170.0,
        "sector": "Technology",
        "portfolio_id": _PORTFOLIO_US_TECH_ID,
    },
    {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "shares": 15.0,
        "price_per_share": 380.0,
        "sector": "Technology",
        "portfolio_id": _PORTFOLIO_US_TECH_ID,
    },
    {
        "symbol": "JNJ",
        "name": "Johnson & Johnson",
        "shares": 25.0,
        "price_per_share": 155.0,
        "sector": "Healthcare",
        "portfolio_id": _PORTFOLIO_GLOBAL_DIV_ID,
    },
    {
        "symbol": "VZ",
        "name": "Verizon Communications",
        "shares": 40.0,
        "price_per_share": 42.0,
        "sector": "Communication Services",
        "portfolio_id": _PORTFOLIO_GLOBAL_DIV_ID,
    },
    {
        "symbol": "KO",
        "name": "The Coca-Cola Company",
        "shares": 30.0,
        "price_per_share": 60.0,
        "sector": "Consumer Staples",
        "portfolio_id": _PORTFOLIO_GLOBAL_DIV_ID,
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
