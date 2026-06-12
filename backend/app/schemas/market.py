from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class QuoteResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    symbol: str
    price: float | None
    stale: bool = False


class OHLCVBar(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class HistoryResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    symbol: str
    period: str
    stale: bool = False
    bars: list[OHLCVBar]
