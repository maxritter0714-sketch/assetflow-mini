from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.schemas.market import HistoryResponse, OHLCVBar, QuoteResponse
from app.services import market_data_service

router = APIRouter(tags=["market"])


@router.get("/market/quote/{symbol}", response_model=QuoteResponse)
def get_quote(symbol: str, db: Session = Depends(get_db)):
    price, stale = market_data_service.get_current_price(symbol.upper(), db)
    if price is None:
        raise HTTPException(status_code=404, detail=f"No price data available for {symbol.upper()}")
    return QuoteResponse(symbol=symbol.upper(), price=price, stale=stale)


@router.get("/market/history/{symbol}", response_model=HistoryResponse)
def get_history(symbol: str, period: str = "1y", db: Session = Depends(get_db)):
    bars, stale = market_data_service.get_price_history(symbol.upper(), db, period)
    if bars is None:
        raise HTTPException(status_code=404, detail=f"No history data available for {symbol.upper()}")
    return HistoryResponse(
        symbol=symbol.upper(),
        period=period,
        stale=stale,
        bars=[OHLCVBar(**b) for b in bars],
    )
