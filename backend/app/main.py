from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_fundamentals, routes_health, routes_market, routes_news, routes_portfolio, routes_screener, routes_transactions, routes_watchlist
from app.core.config import SessionLocal
from app.scripts.seed import seed_db


# TODO (prod): remove auto-seeding before deploying with real user data.
# Replace with a one-shot CLI command (e.g. uv run python -m app.scripts.seed).
@asynccontextmanager
async def lifespan(app: FastAPI):
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
    yield


app = FastAPI(title="AssetFlow Mini API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_health.router)
app.include_router(routes_portfolio.router, prefix="/api")
app.include_router(routes_transactions.router, prefix="/api")
app.include_router(routes_market.router, prefix="/api")
app.include_router(routes_news.router, prefix="/api")
app.include_router(routes_screener.router, prefix="/api")
app.include_router(routes_fundamentals.router, prefix="/api")
