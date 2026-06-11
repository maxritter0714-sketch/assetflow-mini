# ADR-002 — Data Sources: yfinance + FMP + GDELT

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 002 project: assetflow-mini date: 2026-06-09 status: accepted tags: decision, assetflow-mini

## Context

The app needs four types of external data: market prices/history/fundamentals, a stock screener, portfolio/ticker news, and global macro/economy news. No single free source covers all four well.

## Decision

Use three sources:
- **yfinance** — stock prices, historical OHLCV, fundamentals (free, no API key)
- **FMP free tier** — stock screener + portfolio/ticker-specific news (250 calls/day, API key via `.env`)
- **GDELT** — global macro/economy news tab only (free, unlimited, filtered to ECON/BUSINESS themes)

## Reasoning

yfinance is the standard free source for price/history data. FMP's free tier has a proper screener API (yfinance has no reliable bulk screening) and ticker-specific news. GDELT is used only for the global macro tab where its breadth is an advantage — filtering by economic themes and major outlets (Bloomberg, FT, Reuters) produces relevant headlines. Using FMP for the global tab would burn the 250 call/day limit too fast.

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| FMP for all three news tabs | Would burn 250 call/day limit on a personal tool |
| GDELT for ticker/portfolio news | Not ticker-specific; too noisy for stock-level news |
| yfinance screener | Unreliable, limited compared to FMP's dedicated screener endpoint |
| Single paid API (e.g. Polygon) | Paid; violates free-tier constraint for MVP |

## Consequences

- Backend needs two API integrations: yfinance (no key) and FMP (key in `.env`).
- GDELT requires filtering by theme codes (ECON, BUSINESS) and outlet filtering.
- FMP call budget must be managed via `market_data_cache` — see ADR-001.
- A `.env.example` must document the `FMP_API_KEY` variable.

---

_Supersede by creating a new ADR that references this one._
