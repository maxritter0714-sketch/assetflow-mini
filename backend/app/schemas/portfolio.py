from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


class HoldingSummary(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    symbol: str
    name: str
    shares: float
    avg_price: float
    current_price: float
    market_value: float
    gain_loss: float
    gain_loss_pct: float
    sector: str
    portfolio_id: str


class PortfolioItem(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    id: str
    name: str
    value: float
    cost: float
    gain_loss: float
    gain_loss_pct: float
    holdings_count: int = Field(alias="holdings")
    currency: str


class PortfolioSummary(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    total_value: float
    total_cost: float
    unrealized_pl: float
    unrealized_pl_pct: float
    portfolios: list[PortfolioItem]
    holdings: list[HoldingSummary]
