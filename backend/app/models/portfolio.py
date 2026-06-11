from datetime import UTC, date, datetime

from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import relationship

from app.models.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    transactions = relationship("Transaction", back_populates="portfolio")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True)
    portfolio_id = Column(String(36), ForeignKey("portfolios.id"), nullable=False)
    symbol = Column(String(10), nullable=False)
    name = Column(String(200), nullable=False)
    transaction_type = Column(String(4), nullable=False)
    shares = Column(Float, nullable=False)
    price_per_share = Column(Float, nullable=False)
    sector = Column(String(100), nullable=False, default="")
    transaction_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))

    portfolio = relationship("Portfolio", back_populates="transactions")
