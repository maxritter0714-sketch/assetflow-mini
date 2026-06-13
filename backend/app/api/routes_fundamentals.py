from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.schemas.fundamentals import FundamentalsResponse
from app.services import fundamentals_service

router = APIRouter(tags=["fundamentals"])


@router.get("/fundamentals/{symbol}", response_model=FundamentalsResponse)
def get_fundamentals(symbol: str, db: Session = Depends(get_db)):
    data, stale = fundamentals_service.get_fundamentals(symbol.upper(), db)
    return FundamentalsResponse(**data, stale=stale)
