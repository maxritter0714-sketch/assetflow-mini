from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ScreenerStock(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    symbol: str
    name: str
    sector: str | None = None
    market_cap: float | None = None
    price: float | None = None
    pe: float | None = None
    rev_growth: float | None = None
    perf_6m: float | None = None
    beta: float | None = None
    div_yield: float | None = None
    exchange: str | None = None
    country: str | None = None


class ScreenerResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    stocks: list[ScreenerStock]
    stale: bool = False
