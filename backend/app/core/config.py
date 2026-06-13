import os

from dotenv import find_dotenv, load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

load_dotenv(find_dotenv())

FMP_API_KEY: str = os.environ.get("FMP_API_KEY", "")

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://assetflow:assetflow@localhost:5432/assetflow",
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
