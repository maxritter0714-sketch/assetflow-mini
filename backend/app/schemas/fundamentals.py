from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class FundamentalsResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    # Key Statistics panel
    market_cap: str | None = None
    pe: float | None = None
    eps: float | None = None
    beta: float | None = None
    high_52w: float | None = None
    low_52w: float | None = None
    div_yield: str | None = None
    rev_growth: str | None = None

    # Fundamentals panel
    revenue: str | None = None
    net_income: str | None = None
    fcf: str | None = None
    roe: str | None = None
    gross_margin: str | None = None
    op_margin: str | None = None
    net_margin: str | None = None
    debt_equity: str | None = None

    # Header meta
    sector: str | None = None
    exchange: str | None = None

    stale: bool = False
