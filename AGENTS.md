# AssetFlow Mini - Agent Instructions

## Project Goal

AssetFlow Mini is a portfolio dashboard with local AI-assisted analysis.

The goal is to build a clean, understandable, GitHub-quality MVP with:
- portfolio overview
- watchlist
- stock charts
- stock/portfolio news
- basic portfolio calculations
- later: local AI summaries using Ollama

This project should stay focused and avoid unnecessary complexity.

---

## Current Project State

The frontend design prototype was imported from Claude Design into:

frontend/

The visual direction should be preserved unless explicitly requested otherwise.

The backend is not fully implemented yet and should be created inside:

backend/

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
- Keep API calls centralized

### Backend

Use:
- FastAPI
- Python 3.11+
- uv (for dependency management — do NOT use pip directly)
- Pydantic
- pytest + httpx (for testing)

Later:
- SQLAlchemy
- Alembic
- PostgreSQL

Do not add the database in the first backend milestone.

### Data Sources

Use later:
- yfinance for market data
- GDELT for news

### AI

Use later:
- Ollama via backend service
- local LLM for portfolio summaries

Do not add AI in the first backend milestone.

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
│   │   └── routes_portfolio.py
│   ├── core/
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── portfolio.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── portfolio_service.py
│   └── utils/
│       └── __init__.py
├── tests/
│   └── test_portfolio_service.py
├── pyproject.toml
└── README.md
```

Rules:
- Routes go in backend/app/api.
- Business logic goes in backend/app/services.
- Pydantic schemas go in backend/app/schemas.
- Config belongs in backend/app/core.
- Reusable calculations can go in backend/app/utils.
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
- Centralize backend API calls later in frontend/src/lib/api.js.
- Keep chart/data/portfolio logic separate from presentational components where possible.
- Avoid large unnecessary rewrites.

---

## MVP Scope

The MVP should include:

1. Frontend dashboard running locally
2. Backend health endpoint
3. Portfolio summary endpoint with seeded data
4. Basic portfolio calculation service
5. Basic backend tests
6. Later: yfinance stock history endpoint
7. Later: frontend connected to backend
8. Later: GDELT news endpoint
9. Later: Ollama AI summary endpoint

---

## Things Not To Add Yet

Do not add these unless explicitly requested:

- Hermes Agent
- MCP server
- LangGraph
- Celery
- Redis
- Supabase
- Firebase
- Kubernetes
- broker APIs
- real trading functionality
- paid finance APIs
- full authentication system
- complex RAG/vector database
- microservices
- SQLAlchemy / Alembic / PostgreSQL (first milestone)
- AI / Ollama (first milestone)

These may be useful later, but they are not part of the MVP foundation.

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

---

## Review Checklist

Before accepting changes, check:

- Does the change match the chosen stack?
- Did it avoid unnecessary dependencies?
- Are backend routes and services separated?
- Are calculations testable?
- Are errors handled reasonably?
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
