from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.schemas.portfolio import PortfolioSummary
from app.services.portfolio_service import get_portfolio_summary_db

router = APIRouter()


@router.get("/portfolio/summary", response_model=PortfolioSummary, response_model_by_alias=True)
def portfolio_summary(db: Session = Depends(get_db)):
    return get_portfolio_summary_db(db)
