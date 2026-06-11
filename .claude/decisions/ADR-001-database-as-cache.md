# ADR-001 — Database-As-Cache For External API Responses

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 001 project: assetflow-mini date: 2026-06-09 status: accepted tags: decision, assetflow-mini

## Context

The backend needs to cache responses from yfinance and FMP to avoid rate limits (FMP free tier: 250 calls/day) and slow repeated lookups. Three options existed: in-memory dict with TTL, Redis, or storing responses in the database.

## Decision

Use a `market_data_cache` table in PostgreSQL to cache all external API responses. Fields: `symbol`, `data_type`, `payload` (JSON), `fetched_at`. Check this table before calling any external API; refresh on TTL expiry.

Error handling rule: if cache is stale and external API fails, return stale data with a `"stale": true` flag. If no cache exists and API fails, return a proper error.

## Reasoning

Database cache persists across server restarts (unlike in-memory), requires no extra infrastructure (unlike Redis), and the pattern transitions cleanly to production — Redis just becomes an L1 layer in front of the same DB cache when traffic demands it. For a local personal tool, this is the right trade-off.

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| In-memory dict with TTL | Lost on server restart; not production-aware |
| Redis | Extra infrastructure to manage locally; overkill for personal tool |

## Consequences

- `market_data_cache` table must be added in Phase 3 alongside other models.
- All external API calls must go through the cache layer (market_data_service.py).
- `"stale": true` flag must be respected by the frontend (show "data may be delayed" indicator).
- Redis is the planned upgrade path for the full AssetFlow product.

---

_Supersede by creating a new ADR that references this one._
