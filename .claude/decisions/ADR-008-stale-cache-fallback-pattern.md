# ADR-008 — Stale-Cache Fallback Pattern for External API Calls

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 008 project: assetflow-mini date: 2026-06-12 status: accepted tags: decision, assetflow-mini

## Context

AssetFlow Mini caches all external API responses in a `market_data_cache` table (see ADR-001). When a cache entry exists but is expired (stale), and the upstream API call fails or returns no data, the service must decide: return an error to the caller, or return the stale data with a signal that it may be outdated?

This situation occurs regularly: yfinance returns `None` outside US market hours, APIs go down temporarily, or rate limits are hit. An error response would break the frontend KPI cards on every market close, which is unacceptable for a dashboard.

## Decision

When an upstream API call fails and a stale cache entry exists, return the stale data accompanied by a `stale: true` flag rather than raising an error. If no cache entry exists at all and the upstream call fails, return `None` / 404.

All service functions that fetch external data follow this contract:
```python
def get_current_price(symbol, db) -> tuple[float | None, bool]:
    # returns (price, is_stale)
```

All API response schemas expose the flag to the frontend:
```json
{ "symbol": "AAPL", "price": 189.5, "stale": true }
```

## Reasoning

- Dashboard KPIs must render at all times, including outside market hours and during brief API outages. A hard error would leave the UI broken.
- The stale flag lets the frontend choose how to surface the issue (e.g. a subtle indicator) without forcing it — current implementation silently uses the value, which is acceptable for a personal tool.
- Stale data is almost always better than no data for a portfolio dashboard. A price that is a few hours old is still useful for understanding portfolio composition.
- This pattern is consistent and predictable: every external data service in the codebase follows the same two-return-value contract.

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| Raise HTTP 503 on upstream failure | Breaks frontend rendering on every market close — yfinance returns `None` for `last_price` when market is closed |
| Return stale data silently (no flag) | Frontend cannot distinguish live from stale; impossible to add a "prices delayed" indicator later |
| Retry with exponential backoff on failure | Adds latency to every request during outages; doesn't help if the market is simply closed |
| Separate "freshness" endpoint | Extra round-trip per symbol; overengineered for MVP |

## Consequences

- Every new external data service added in Phase 6+ (FMP news, GDELT, fundamentals) must follow the same `(data, is_stale)` return contract.
- Response schemas for all external-data endpoints must include a `stale` boolean field.
- The frontend should eventually surface a visible indicator when `stale: true` — currently it silently uses the value (acceptable for now, tracked in backlog).

---

_Supersede by creating a new ADR that references this one._
