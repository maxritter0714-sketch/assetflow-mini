from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, String

from app.models.base import Base


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(String(36), primary_key=True)
    symbol = Column(String(10), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    added_at = Column(DateTime, default=lambda: datetime.now(UTC).replace(tzinfo=None))
