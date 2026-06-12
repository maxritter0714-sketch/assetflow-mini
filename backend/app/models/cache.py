from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, Index, String, Text

from app.models.base import Base


class MarketDataCache(Base):
    __tablename__ = "market_data_cache"

    id = Column(String(36), primary_key=True)
    cache_key = Column(String(255), nullable=False, unique=True)
    data_type = Column(String(50), nullable=False)
    data = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC).replace(tzinfo=None))

    __table_args__ = (
        Index("ix_market_data_cache_key", "cache_key"),
        Index("ix_market_data_cache_expires_at", "expires_at"),
    )
