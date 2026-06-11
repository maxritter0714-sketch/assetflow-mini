from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class TransactionCreate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "portfolioId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
                "symbol": "NVDA",
                "name": "NVIDIA Corporation",
                "transactionType": "buy",
                "shares": 10,
                "pricePerShare": 480.0,
                "sector": "Technology",
                "transactionDate": "2024-01-15",
            }
        },
    )

    portfolio_id: str
    symbol: str
    name: str
    transaction_type: Literal["buy", "sell"]
    shares: float = Field(gt=0)
    price_per_share: float = Field(gt=0)
    sector: str = ""
    transaction_date: date


class TransactionResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )

    id: str
    portfolio_id: str
    symbol: str
    name: str
    transaction_type: str
    shares: float
    price_per_share: float
    sector: str
    transaction_date: date
    created_at: datetime
