import uuid

from sqlalchemy.orm import Session

from app.models.portfolio import Portfolio, Transaction
from app.schemas.transaction import TransactionCreate


def create_transaction(db: Session, data: TransactionCreate) -> Transaction:
    if db.query(Portfolio).filter(Portfolio.id == data.portfolio_id).first() is None:
        raise ValueError(f"Portfolio {data.portfolio_id!r} not found")

    txn = Transaction(
        id=str(uuid.uuid4()),
        portfolio_id=data.portfolio_id,
        symbol=data.symbol.upper(),
        name=data.name,
        transaction_type=data.transaction_type,
        shares=data.shares,
        price_per_share=data.price_per_share,
        sector=data.sector,
        transaction_date=data.transaction_date,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn


def list_transactions(db: Session, portfolio_id: str | None = None) -> list[Transaction]:
    q = db.query(Transaction)
    if portfolio_id is not None:
        q = q.filter(Transaction.portfolio_id == portfolio_id)
    return q.order_by(Transaction.transaction_date.desc()).all()


def delete_transaction(db: Session, transaction_id: str) -> bool:
    txn = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if txn is None:
        return False
    db.delete(txn)
    db.commit()
    return True
