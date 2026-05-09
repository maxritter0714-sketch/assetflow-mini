from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_health, routes_portfolio

app = FastAPI(title="AssetFlow Mini API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes_health.router)
app.include_router(routes_portfolio.router, prefix="/api")
