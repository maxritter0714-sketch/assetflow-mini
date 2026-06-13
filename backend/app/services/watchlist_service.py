import uuid
from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.models.watchlist import WatchlistItem
from app.schemas.watchlist import WatchlistItemCreate


def list_watchlist(db: Session) -> list[WatchlistItem]:
    return db.query(WatchlistItem).order_by(WatchlistItem.added_at.desc()).all()


def add_to_watchlist(db: Session, data: WatchlistItemCreate) -> WatchlistItem:
    symbol = data.symbol.upper()
    existing = db.query(WatchlistItem).filter(WatchlistItem.symbol == symbol).first()
    if existing:
        raise ValueError(f"{symbol} is already on the watchlist")
    item = WatchlistItem(
        id=str(uuid.uuid4()),
        symbol=symbol,
        name=data.name,
        added_at=datetime.now(UTC).replace(tzinfo=None),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_from_watchlist(db: Session, symbol: str) -> bool:
    item = db.query(WatchlistItem).filter(WatchlistItem.symbol == symbol.upper()).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
