from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class NewsItem(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    title: str
    url: str
    published_at: str
    source: str
    ticker: str | None = None
    summary: str | None = None


class NewsResponse(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

    items: list[NewsItem]
    stale: bool = False
