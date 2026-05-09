from fastapi import APIRouter

from app.schemas.portfolio import PortfolioSummary
from app.services.portfolio_service import get_portfolio_summary

router = APIRouter()


@router.get("/portfolio/summary", response_model=PortfolioSummary, response_model_by_alias=True)
def portfolio_summary():
    return get_portfolio_summary()
