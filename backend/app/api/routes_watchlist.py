from fastapi import APIRouter, Depends, HTTPException

from app.core.config import get_db
from app.schemas.watchlist import WatchlistItemCreate, WatchlistItemResponse, WatchlistResponse
from app.services.watchlist_service import add_to_watchlist, list_watchlist, remove_from_watchlist
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/watchlist", response_model=WatchlistResponse, response_model_by_alias=True)
def get_watchlist(db: Session = Depends(get_db)):
    items = list_watchlist(db)
    return WatchlistResponse(items=items)


@router.post("/watchlist", response_model=WatchlistItemResponse, response_model_by_alias=True, status_code=201)
def add_watchlist_item(data: WatchlistItemCreate, db: Session = Depends(get_db)):
    try:
        return add_to_watchlist(db, data)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))


@router.delete("/watchlist/{symbol}", status_code=204)
def remove_watchlist_item(symbol: str, db: Session = Depends(get_db)):
    if not remove_from_watchlist(db, symbol):
        raise HTTPException(status_code=404, detail=f"{symbol.upper()!r} not found in watchlist")
