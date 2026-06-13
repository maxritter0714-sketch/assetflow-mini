from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.schemas.news import NewsItem, NewsResponse
from app.services import news_service
from app.services.portfolio_service import get_portfolio_tickers

router = APIRouter(tags=["news"])


@router.get("/news/portfolio", response_model=NewsResponse)
def get_portfolio_news(db: Session = Depends(get_db)):
    tickers = get_portfolio_tickers(db)
    items, stale = news_service.get_portfolio_news(tickers, db)
    return NewsResponse(items=[NewsItem(**i) for i in items], stale=stale)


@router.get("/news/ticker/{symbol}", response_model=NewsResponse)
def get_ticker_news(symbol: str, db: Session = Depends(get_db)):
    items, stale = news_service.get_ticker_news(symbol.upper(), db)
    return NewsResponse(items=[NewsItem(**i) for i in items], stale=stale)


@router.get("/news/macro", response_model=NewsResponse)
def get_macro_news(db: Session = Depends(get_db)):
    items, stale = news_service.get_macro_news(db)
    return NewsResponse(items=[NewsItem(**i) for i in items], stale=stale)
