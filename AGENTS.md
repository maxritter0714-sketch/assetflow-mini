# AssetFlow Mini - Agent Instructions

## Project Goal

AssetFlow Mini is a full-stack portfolio dashboard with local AI-assisted analysis and quantitative analytics.

It serves two purposes:
1. **GitHub showcase** — demonstrating full-stack engineering depth and quantitative analysis skills to recruiters
2. **Personal portfolio tool** — a real working app for tracking holdings and researching stocks

It is also the foundation for a larger AssetFlow product that may go to market in the future.

This project should stay focused and avoid unnecessary complexity.

---

## Current Project State

The frontend design prototype was imported from Claude Design into:

frontend/

The visual direction should be preserved unless explicitly requested otherwise.

The backend foundation (Phase 2) is complete. Phase 3 (database) is next.

---

## Chosen Stack

### Frontend

Current frontend:
- Vite
- React
- JavaScript / JSX for now
- CSS imported from the Claude Design prototype

Planned frontend direction:
- Keep Vite React for now
- Refactor components gradually
- Later optionally migrate to TypeScript
- Use TradingView Lightweight Charts for candlestick charts later
- Keep API calls centralized in `frontend/src/lib/api.js`

### Backend

Use:
- FastAPI
- Python 3.11+
- uv (for dependency management — do NOT use pip directly)
- Pydantic
- pytest + httpx (for testing)
- SQLAlchemy + Alembic + PostgreSQL (Phase 3)
- numpy + scipy + pandas (Phase 5, for quant analytics)

### Infrastructure

- PostgreSQL via Docker Compose (local, Phase 3)
- Supabase planned for full AssetFlow product only — not AssetFlow Mini

### Data Sources

**Base URL for all FMP calls:** `https://financialmodelingprep.com/stable/`
**Auth:** `?apikey=FMP_API_KEY` on every request.
**FMP v3 is fully deprecated** (Aug 2025) — all v3 endpoints return 403. Use stable only.

| Purpose | Source | FMP endpoint | Notes |
|---|---|---|---|
| Real-time price, daily change | yfinance | `/quote` (backup) | yfinance primary |
| OHLCV chart history | yfinance | `/historical-price-eod/full` (backup) | yfinance primary |
| Company overview (sector, market cap, beta) | FMP stable `/profile` (screener only) | — | free tier; 26 calls per 2h refresh |
| Ticker fundamentals (P/E, margins, ROE, revenue, FCF, etc.) | yfinance `.info` | — | free, no key; replaces FMP to stay under 250 calls/day limit |
| Ticker / portfolio news | yfinance | `/news/stock` (paywalled) | FMP news requires paid plan |
| Global macro news | yfinance `^TNX`, `GC=F`, `CL=F`, `EURUSD=X`, `^VIX` | — | rates/bonds, gold, oil, FX, volatility |
| Stock screener | FMP stable `/profile`, curated ~26-stock universe | `/company-screener` (paywalled) | free workaround: fetch profiles individually |
| Symbol / name search | FMP stable | `/search-symbol`, `/search-name` | free tier |
| AI summaries | Ollama (Phase 9) | — | local LLM |

**FMP free tier — confirmed paywalled (402):** `/news/stock`, `/stock-list`, `/etf-list`, `/company-screener`

### AI

- Ollama via backend service (Phase 9)
- Default model: `llama3.2` — configurable via env var
- Narrative summaries only — no AI-generated scores or numbers
- AI must be grounded in backend-provided data

---

## Architecture Rules

### Backend

Backend files should follow this structure:

```
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes_health.py
│   │   ├── routes_portfolio.py
│   │   ├── routes_market.py        ← Phase 5
│   │   ├── routes_news.py          ← Phase 6
│   │   ├── routes_analytics.py     ← Phase 5/8
│   │   └── routes_ai.py            ← Phase 9
│   ├── core/
│   │   └── __init__.py
│   ├── models/
│   │   └── ...                     ← Phase 3
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── portfolio.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── portfolio_service.py
│   │   ├── market_data_service.py  ← Phase 5
│   │   ├── news_service.py         ← Phase 6
│   │   ├── analytics_service.py    ← Phase 5/8
│   │   └── ai_service.py           ← Phase 9
│   └── utils/
│       └── __init__.py
├── tests/
│   ├── test_portfolio_service.py
│   └── test_analytics_service.py   ← Phase 5/8
├── pyproject.toml
└── README.md
```

Rules:
- Routes go in backend/app/api.
- Business logic goes in backend/app/services.
- Pydantic schemas go in backend/app/schemas.
- Config and DB session belong in backend/app/core.
- SQLAlchemy models go in backend/app/models.
- Tests go in backend/tests.
- Keep endpoints small. Routes should call service functions.
- Do not put business logic directly into route files unless it is trivial.

### Frontend

Frontend files currently live in:

frontend/src/

Rules:
- Preserve the imported Claude Design visuals.
- Do not randomly redesign the UI.
- Do not fetch data directly from many different components.
- Centralize backend API calls in frontend/src/lib/api.js.
- Keep chart/data/portfolio logic separate from presentational components where possible.
- Avoid large unnecessary rewrites.

### Analytics Screen

A dedicated Analytics screen lives in the sidebar alongside the existing screens.

Split:
- **Portfolio Detail screen** — Sharpe ratio, annualised volatility, max drawdown, beta, correlation matrix heatmap
- **Analytics screen** — Monte Carlo simulation (projection chart + confidence intervals), Efficient Frontier (interactive chart), VaR (95% confidence)

---

## Quantitative Analytics Scope

### Included in AssetFlow Mini

**Basics:**
- Sharpe ratio
- Annualised volatility
- Max drawdown
- Correlation matrix

**Mid-tier:**
- Monte Carlo simulation (portfolio projection)
- Value at Risk (VaR, 95%)
- Beta calculation

**Strong (capstone):**
- Efficient Frontier / mean-variance optimization (Markowitz)

### Deferred to Full AssetFlow Product

- Black-Litterman
- CVaR (Conditional Value at Risk)
- Regime detection

---

## Caching Strategy

All external API responses (yfinance, FMP) are cached in a `market_data_cache` database table.

| Data type | TTL |
|---|---|
| Stock quote | 5 minutes |
| Historical OHLCV | 1 hour |
| Fundamentals | 24 hours |
| News | 15 minutes |
| Screener results | 1 hour |

If cached data exists but is stale and the external API fails, return the stale data with a `"stale": true` flag.
If no cache exists and the external API fails, return a proper error.

Redis is planned for the full AssetFlow product as an L1 cache layer in front of this pattern.

---

## MVP Scope

1. Frontend dashboard running locally
2. Backend health endpoint
3. Portfolio summary with database-backed holdings
4. Manual transaction entry (buy/sell) — CSV import added later
5. Market data via yfinance (prices, history, fundamentals)
6. Stock screener via FMP
7. Three news tabs: global macro (yfinance macro instruments), portfolio news (yfinance), ticker news (yfinance + relevance filter)
8. Quant analytics: Sharpe, VaR, Monte Carlo, Efficient Frontier
9. AI narrative summaries via Ollama
10. Full test coverage — statistical validation for quant calculations

---

## Things Not To Add

Do not add these unless explicitly requested:

- Hermes Agent
- MCP server
- LangGraph
- Celery
- Redis (AssetFlow Mini — use DB cache instead)
- Supabase (AssetFlow Mini — PostgreSQL via Docker)
- Firebase
- Kubernetes
- Broker APIs
- Real trading functionality
- Full authentication system
- Complex RAG / vector database
- Microservices
- Black-Litterman, CVaR, regime detection (full AssetFlow only)

---

## Financial App Rules

This app may analyze portfolio data, but it must not present output as financial advice.

Use educational wording like:
- "This may indicate..."
- "A possible risk is..."
- "This is worth watching..."
- "Based on the available data..."

Avoid hard commands like:
- "Buy this stock"
- "Sell this stock"
- "You should invest in..."

AI output must be grounded in backend-provided data. The model must not invent prices, metrics, news, ratings, or recommendations.

---

## Review Checklist

Before accepting changes, check:

- Does the change match the chosen stack?
- Did it avoid unnecessary dependencies?
- Are backend routes and services separated?
- Are calculations testable?
- Are quant calculations statistically validated in tests?
- Are errors handled reasonably (stale cache flag + proper errors)?
- Did it preserve the frontend design?
- Did it avoid overengineering?
- Are files placed in the correct folders?
- Can the app or tests actually run?

---

## Git Workflow

Use branches:

- main = stable version
- dev = active development
- feature/... = feature branches

Do not work directly on main.

Recommended flow:
1. Create feature branch from dev
2. Implement small feature
3. Test locally
4. Commit
5. Push branch
6. Open PR into dev
7. Review
8. Merge into dev
