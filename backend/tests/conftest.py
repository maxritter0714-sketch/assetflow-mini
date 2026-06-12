from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_db
from app.main import app
from app.models.base import Base
from app.scripts.seed import seed_db

_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
_SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)

Base.metadata.create_all(bind=_engine)
_db = _SessionLocal()
seed_db(_db)
_db.close()


def _override_get_db():
    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture
def db():
    session = _SessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture(autouse=True)
def _mock_yfinance():
    """Block live yfinance network calls in all tests. Override per-test with patch()."""
    mock_info = MagicMock()
    mock_info.last_price = None

    mock_hist = MagicMock()
    mock_hist.empty = True

    mock_ticker = MagicMock()
    mock_ticker.fast_info = mock_info
    mock_ticker.history.return_value = mock_hist

    with patch("yfinance.Ticker", return_value=mock_ticker):
        yield
