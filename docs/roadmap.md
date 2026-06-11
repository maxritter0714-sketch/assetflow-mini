# AssetFlow Mini Roadmap

## MVP Goal

AssetFlow Mini is a full-stack portfolio dashboard and quantitative analysis tool.

It serves two purposes:
1. **GitHub showcase** — demonstrating full-stack engineering depth and quantitative analysis skills to recruiters
2. **Personal portfolio tool** — a real working app for tracking holdings and researching stocks

It is also the foundation for a larger AssetFlow product that may go to market in the future.

The MVP should deliver:

- Real portfolio tracking (manual transaction entry)
- Live market data (prices, charts, fundamentals)
- Stock screener
- Three-tab news (global macro, portfolio, ticker)
- Quantitative analytics (Sharpe, VaR, Monte Carlo, Efficient Frontier)
- AI narrative summaries via Ollama

It is not a trading app, financial advisor, broker connector, or AI agent platform.

## Current Status

```text
Phase 2: Backend Foundation — complete
Phase 3: Database & Models — next
```

Already present:

- React/Vite frontend prototype with mock data
- FastAPI backend
- `GET /health`
- `GET /api/portfolio/summary`
- Backend seed data (2 portfolios, 6 holdings)
- Portfolio calculation service (Decimal precision)
- Pydantic response schemas with camelCase JSON
- Backend tests (13 passing)

Not present yet:

- PostgreSQL + Docker Compose
- SQLAlchemy models + Alembic
- Transaction entry
- yfinance integration
- FMP integration
- GDELT integration
- Quantitative analytics service
- Analytics screen (Monte Carlo, Efficient Frontier)
- Ollama integration
- Frontend wired to backend

## Canonical Demo Dataset

The backend seed is the canonical dataset for development until the database is live.

```text
US Tech:     NVDA, AAPL, MSFT
Global Div:  JNJ, VZ, KO
```

Watchlist seed (Phase 3+):

```text
GOOGL, AMZN, META, TSLA, JPM, UNH
```

When the frontend is wired to the backend, replace mock data in `frontend/src/data.jsx` with real API calls. Do not maintain two parallel data universes.

## API Contract Rule

The frontend expects camelCase JSON. Preserve this response shape when replacing seed data with database data. The frontend must not know whether data came from seeds, PostgreSQL, yfinance, or FMP.

## Build Phases

### Phase 0: MVP Scope

Status: complete.

- MVP goals frozen.
- Showcase + personal tool purpose defined.
- Advanced AI infrastructure excluded.

### Phase 1: Monorepo Setup

Status: complete.

- `frontend/`, `backend/`, `docs/` structure established.

### Phase 2: Backend Foundation

Status: complete.

- `GET /health` works.
- `GET /api/portfolio/summary` returns camelCase JSON.
- Portfolio math uses Decimal precision.
- 13 backend tests passing.
- CORS scoped to local frontend origins.

### Phase 3: Database And Models

Next phase.

Tasks:

- Add `docker-compose.yml` for local PostgreSQL.
- Add `DATABASE_URL` to backend config (`backend/app/core/`).
- Add SQLAlchemy database session setup.
- Add models: `portfolios`, `holdings`, `transactions`, `watchlist_items`, `market_data_cache`.
- Add Alembic and first migration.
- Add seed script using canonical demo dataset.
- Keep `GET /api/portfolio/summary` response shape unchanged.

Key model notes:
- `transactions` is the source of truth for holdings — holdings are derived from transaction history.
- `market_data_cache` stores external API responses with `symbol`, `data_type`, `payload` (JSON), `fetched_at` for DB-backed caching.

Do not add yfinance, FMP, GDELT, AI, auth, or broker import in this phase.

### Phase 4: Portfolio API

Tasks:

- Read holdings from PostgreSQL (derived from transactions).
- Add transaction entry endpoints (buy/sell).
- Add CRUD for watchlist items.
- Preserve existing summary endpoint contract.
- Add empty portfolio handling.
- Add database-backed tests.

Endpoints:

```text
GET  /api/portfolio/summary
GET  /api/portfolio/holdings
GET  /api/transactions
POST /api/transactions
GET  /api/watchlist
POST /api/watchlist
DELETE /api/watchlist/{id}
```

CSV import is a later addition — manual transaction entry ships first.

### Phase 5: Market Data Service

Tasks:

- Add yfinance wrapper service (`market_data_service.py`).
- Add FMP wrapper for screener (`routes_market.py`).
- Add quote endpoint.
- Add history endpoint.
- Add fundamentals endpoint.
- Add screener endpoint (FMP).
- Implement `market_data_cache` table for DB-backed caching with TTLs.
- Add `numpy`, `scipy`, `pandas` dependencies.
- Add `analytics_service.py` with quant calculations.
- Add `routes_analytics.py`.
- Normalize chart data for frontend use.

Cache TTLs:

| Data type | TTL |
|---|---|
| Stock quote | 5 minutes |
| Historical OHLCV | 1 hour |
| Fundamentals | 24 hours |
| Screener results | 1 hour |

Caching rule: if cache is stale and external API fails, return stale data with `"stale": true`. If no cache exists and API fails, return a proper error.

Endpoints:

```text
GET /api/stocks/{symbol}/quote
GET /api/stocks/{symbol}/history
GET /api/stocks/{symbol}/fundamentals
GET /api/screener
GET /api/analytics/portfolio/{portfolio_id}
GET /api/analytics/efficient-frontier/{portfolio_id}
GET /api/analytics/monte-carlo/{portfolio_id}
```

Quant analytics (basics + mid + strong):
- Sharpe ratio, annualised volatility, max drawdown, beta, correlation matrix
- Monte Carlo simulation (projection + confidence intervals)
- Value at Risk (VaR, 95%)
- Efficient Frontier (mean-variance optimization, Markowitz)

Testing: option 2 (happy path + edge cases) for all services. Option 3 (statistical validation) for `analytics_service.py` specifically.

### Phase 6: News Service

Tasks:

- Add GDELT wrapper for global macro/economy news (`news_service.py`).
- Add FMP news wrapper for portfolio and ticker news.
- Add three news endpoints.
- Normalize and deduplicate articles.
- Handle empty results and external request failures.

News sources:

| Tab | Source | Reason |
|---|---|---|
| Global macro | GDELT | Free, unlimited, filtered to ECON/BUSINESS themes |
| Portfolio news | FMP | Ticker-specific, batched for holdings |
| Ticker news | FMP | Ticker-specific |

Cache TTL for news: 15 minutes.

Endpoints:

```text
GET /api/news/global
GET /api/news/portfolio/{portfolio_id}
GET /api/news/ticker/{symbol}
```

### Phase 7: Frontend API Wiring

Tasks:

- Add one central frontend API client (`frontend/src/lib/api.js`).
- Replace all mock data in `data.jsx` with real backend calls.
- Add loading states, empty states, error states.
- Add "data may be delayed" indicator for stale cache responses.
- Add transaction entry form (buy/sell).
- Add Analytics screen with Monte Carlo, Efficient Frontier, VaR.
- Wire news tabs: global, portfolio, ticker.
- Keep visual polish from the current prototype.

### Phase 8: Advanced Portfolio Calculations

Tasks:

- Add sector allocation with drift detection.
- Add country allocation.
- Add daily change (requires live quotes).
- Add top movers.
- Add quant metrics to Portfolio Detail screen (Sharpe, volatility, drawdown, beta, correlation heatmap).
- Add Efficient Frontier chart to Analytics screen.

### Phase 9: AI MVP

Only after portfolio, market data, and news are stable.

Tasks:

- Add Ollama service wrapper (`ai_service.py`).
- Default model: `llama3.2` — configurable via `OLLAMA_MODEL` env var.
- Build grounded prompts from backend data (never let the model invent data).
- Narrative summaries only — no AI-generated scores or numbers.
- Add portfolio summary narrative endpoint.
- Add stock research note endpoint.
- Add news digest endpoint.
- Add Ollama unavailable fallback.

Endpoints:

```text
POST /api/ai/portfolio-summary
POST /api/ai/stock-note
POST /api/ai/news-digest
```

### Phase 10: Reliability And Docs

Tasks:

- Broaden backend test coverage.
- Add frontend smoke tests if useful.
- Add screenshots and demo GIF to README.
- Update README with clean 3-command setup.
- Add architecture diagram to README.
- Align all docs with real code.
- Remove any TODO comments or WIP code.

### Later Evaluation (Full AssetFlow Product)

Only after AssetFlow Mini MVP is complete and working:

- Supabase (replaces local PostgreSQL)
- Authentication
- CSV broker import
- Black-Litterman, CVaR, regime detection (advanced quant)
- Redis (L1 cache in front of DB cache)
- MCP server
- Hermes Agent
- LangGraph
- pgvector
- Mobile app

## Development Rules

1. Preserve the public API contract unless there is a deliberate migration.
2. Keep routes thin — services own logic.
3. Keep external data access inside the backend.
4. Keep the frontend dependent on one API client.
5. Use the canonical demo dataset until database seeding replaces it.
6. Add tests for all calculations — statistical validation for quant service.
7. Add loading, empty, and error states before final polish.
8. Cache all external API responses in `market_data_cache`.
9. Return stale data with `"stale": true` flag before returning errors.
10. AI output must be grounded — never invent data.
