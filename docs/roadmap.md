# AssetFlow Mini Roadmap

## MVP Goal

AssetFlow Mini should become a clean full-stack portfolio dashboard that is easy to understand, run, and extend.

The MVP should show:

- Demo portfolio summary
- Portfolio holdings
- Watchlist
- Stock detail view
- News cards
- AI summary section later

The first version is a GitHub portfolio project and a foundation for a larger AssetFlow product. It is not a trading app, financial advisor, broker connector, or AI agent platform.

## Current Status

Current stage:

```text
Phase 2: Backend Foundation
```

Already present:

- React/Vite frontend prototype with mock data
- FastAPI backend
- `GET /health`
- `GET /api/portfolio/summary`
- Backend seed data
- Portfolio calculation service
- Pydantic response schemas with frontend-friendly camelCase JSON
- Backend tests for endpoints and calculations

Not present yet:

- PostgreSQL
- SQLAlchemy models
- Alembic migrations
- Docker Compose
- yfinance integration
- GDELT integration
- Ollama integration
- Authentication

## Product Scope

### Included In MVP

Dashboard:

- Total portfolio value
- Daily portfolio change once market data exists
- Portfolio cards
- Allocation overview
- Top holdings or top movers
- Latest relevant news once news exists
- AI summary placeholder, then AI summary later

Portfolio:

- Holdings table
- Symbol
- Company name
- Shares
- Average buy price
- Current price
- Current value
- Unrealized gain/loss
- Position weight
- Sector allocation
- Country allocation once data exists

Stock detail:

- Symbol and company name
- Chart
- Volume
- Basic metrics
- Recent news
- Simple AI explanation later

Watchlist:

- View watchlist items
- Add symbol
- Remove symbol
- Optional target price
- Recent price movement once market data exists

AI MVP:

- Portfolio summary
- Stock explanation
- News summary

AI output must be grounded in backend-provided data. The model should not invent prices, financial metrics, news, ratings, or recommendations.

### Excluded From MVP

- Real broker import
- User authentication
- Multiple user accounts
- Paid APIs
- Payment/subscription system
- Mobile app
- Advanced RAG
- MCP server
- Hermes Agent
- LangGraph workflows
- pgvector memory
- LiteLLM provider switching
- Complex portfolio optimization
- Real trading functionality

## Canonical Demo Dataset

The current Phase 2 backend seed is the canonical dataset for API and database work.

Portfolios:

```text
US Tech:
- NVDA
- AAPL
- MSFT

Global Dividend:
- JNJ
- VZ
- KO
```

The frontend still has richer imported mock data from the visual prototype. When frontend/backend wiring begins, reconcile the frontend to the backend contract instead of letting two demo universes drift.

If the canonical demo dataset changes, update these together:

- `backend/app/seeds.py`
- `docs/architecture.md`
- `docs/roadmap.md`
- `frontend/src/data.jsx` or the frontend API adapter replacing it

Future watchlist seed, once `watchlist_items` exists:

```text
GOOGL
AMZN
META
TSLA
JPM
UNH
```

## API Contract Rule

Preserve the current portfolio summary response shape while replacing internals.

Important fields:

```text
totalValue
totalCost
unrealizedPl
unrealizedPlPct
portfolios[].holdings
holdings[].avgPrice
holdings[].currentPrice
holdings[].marketValue
holdings[].gainLoss
holdings[].gainLossPct
holdings[].portfolioId
```

The frontend should not need to know whether data came from seed files, PostgreSQL, yfinance, or another backend service.

## Build Phases

### Phase 0: MVP Scope

Status: complete enough.

- Freeze MVP goals.
- Exclude advanced AI layers.
- Keep single-user/demo assumptions.

### Phase 1: Monorepo Setup

Status: complete enough.

- Keep `frontend/`, `backend/`, and `docs/`.
- Keep root README simple.

### Phase 2: Backend Foundation

Status: current phase.

Acceptance:

- `GET /health` works.
- `GET /api/portfolio/summary` works.
- Portfolio response uses frontend-friendly camelCase JSON.
- Portfolio math uses exact decimal handling internally.
- Backend tests pass.
- CORS is scoped to local frontend origins.

### Phase 3: Database And Models

Next phase.

Tasks:

- Add `docker-compose.yml` for local PostgreSQL.
- Add `DATABASE_URL` configuration.
- Add SQLAlchemy database/session setup.
- Add holdings model.
- Add watchlist model.
- Add Alembic.
- Create first migration.
- Add seed script using the canonical demo dataset.
- Keep `/api/portfolio/summary` response shape unchanged.

Do not add yfinance, news, AI, auth, broker import, MCP, Hermes Agent, or LangGraph in this phase.

### Phase 4: Portfolio API

Tasks:

- Read holdings from PostgreSQL.
- Add create/update/delete holdings endpoints if needed.
- Preserve the existing summary endpoint contract.
- Add empty portfolio handling.
- Add database-backed tests.

Potential endpoints:

```text
GET /api/portfolio/summary
GET /api/portfolio/holdings
POST /api/portfolio/holdings
PUT /api/portfolio/holdings/{id}
DELETE /api/portfolio/holdings/{id}
```

### Phase 5: Market Data Service

Tasks:

- Add yfinance wrapper service.
- Add quote endpoint.
- Add history endpoint.
- Normalize chart data for frontend use.
- Add simple cache.
- Mock yfinance in tests.

Potential endpoints:

```text
GET /api/stocks/{symbol}/quote
GET /api/stocks/{symbol}/history
```

### Phase 6: News Service

Tasks:

- Add GDELT wrapper service.
- Add portfolio-level news endpoint.
- Add symbol-level news endpoint.
- Normalize and deduplicate articles.
- Handle empty results and external request failures.

Potential endpoints:

```text
GET /api/news
GET /api/news/{symbol}
```

### Phase 7: Frontend API Wiring

Tasks:

- Add one central frontend API client.
- Replace portfolio mock data with backend data.
- Add loading states.
- Add empty states.
- Add error states.
- Keep visual polish from the current prototype.

### Phase 8: Portfolio Calculations

Tasks:

- Add allocation percentages.
- Add sector allocation.
- Add country allocation once data exists.
- Add daily change once market data exists.
- Add top movers once market data exists.

### Phase 9: AI MVP

Only after portfolio, market data, and news are stable.

Tasks:

- Add Ollama service wrapper.
- Build grounded prompts from backend data.
- Add portfolio summary endpoint.
- Add stock explanation endpoint.
- Add news summary endpoint.
- Add AI unavailable fallback.

Potential endpoints:

```text
POST /api/ai/portfolio-summary
POST /api/ai/stock-explanation
POST /api/ai/news-summary
```

### Phase 10: Reliability And Docs

Tasks:

- Add broader backend tests.
- Add frontend smoke tests if useful.
- Add screenshots or demo GIF.
- Update README setup steps.
- Keep architecture and roadmap aligned with the real code.

### Later Evaluation

Only evaluate these after the MVP is useful end to end:

- Broker import
- Authentication
- MCP server
- Hermes Agent
- LangGraph
- pgvector
- LiteLLM

## Development Rules

1. Preserve the public API contract unless there is a deliberate migration.
2. Keep routes thin and services responsible for logic.
3. Keep external data access inside the backend.
4. Keep the frontend dependent on one API client.
5. Use the canonical demo dataset until database seeding replaces it.
6. Add tests for calculations and important endpoints.
7. Add loading, empty, and error states before final polish.
8. Avoid advanced AI infrastructure until the core dashboard works end to end.
