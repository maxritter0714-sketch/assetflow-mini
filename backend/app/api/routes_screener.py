from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.schemas.screener import ScreenerResponse, ScreenerStock
from app.services import screener_service

router = APIRouter(tags=["screener"])


@router.get("/screener", response_model=ScreenerResponse)
def get_screener(
    sector: str | None = Query(default=None, description="Filter by sector (e.g. Technology)"),
    market_cap_min: float | None = Query(default=None, description="Minimum market cap in USD"),
    limit: int = Query(default=50, le=100),
    db: Session = Depends(get_db),
):
    stocks, stale = screener_service.get_screener_results(db, sector, market_cap_min, limit)
    return ScreenerResponse(stocks=[ScreenerStock(**s) for s in stocks], stale=stale)
