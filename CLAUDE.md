# AssetFlow Mini - Claude Code Instructions

## Step 0: Read AGENTS.md First

Before making any implementation decision, read the AGENTS.md file in the project root using the file read tool.
AGENTS.md is the single source of truth for architecture, stack decisions, and MVP scope.
Do not rely on memory of previous sessions — always re-read it.

---

## Rules (always apply)

- Do NOT modify the frontend unless explicitly asked.
- Do NOT add: Hermes, MCP, LangGraph, Celery, Redis, Supabase, Firebase.
- Do NOT implement real trading or broker integration.
- Keep changes small and easy to review.
- Do not commit to main or dev directly.
- Do not create git commits unless explicitly asked to do so.

## Phase Gates (not permanent — add when the roadmap phase is reached)

- **Database (Phase 3):** PostgreSQL + SQLAlchemy + Alembic. Do not add before Phase 3.
- **Authentication (Phase TBD):** No auth system yet. Add only if explicitly scoped.
- **AI / Ollama (Phase 9):** Local LLM summaries via Ollama. Do not add before Phase 9.
- **yfinance / market data (Phase 5):** Do not add before Phase 5.
- **GDELT / news (Phase 6):** Do not add before Phase 6.

---

## Role

You are the local implementation agent for AssetFlow Mini.

Your job is to make small, clean, reviewable code changes that follow the project architecture in AGENTS.md.

---

## Main Goal

Build AssetFlow Mini as a clean portfolio dashboard with local AI-assisted analysis.

Current priority:
Create a minimal backend foundation without touching the existing frontend design.

---

## Important Current Context

The frontend design was imported from Claude Design and lives in:

frontend/

The current frontend should not be rewritten or redesigned during backend work.

The backend folder exists but still needs the initial FastAPI foundation.

---

## Development Rules

- Keep changes small and easy to review.
- Explain the plan before making large edits.
- Do not add unnecessary dependencies.
- Do not overengineer the MVP.

---

## Backend Project Setup (first run only)

When setting up the backend from scratch, run these commands in order:

```bash
cd backend
uv init
uv add fastapi "uvicorn[standard]" pydantic
uv add --dev pytest httpx
```

Do NOT use pip. Always use uv for dependency management.
Python version: 3.11+

---

## Backend Structure

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
- Routes should be thin — they call service functions, nothing more.
- Portfolio calculations must live in services, not in route files.
- Pydantic response models must live in schemas.
- Tests must cover portfolio calculation logic in services.
- Keep seeded sample data simple and realistic.
- Do not add PostgreSQL, SQLAlchemy, or Alembic.

---

## First Backend Milestone

Implement only this:

1. FastAPI backend project inside backend/
2. uv project setup
3. GET /health endpoint
4. GET /api/portfolio/summary endpoint
5. Seeded sample portfolio data (fake but realistic)
6. Portfolio summary service with calculation logic
7. Basic pytest tests for portfolio calculations

The portfolio summary endpoint should return realistic but fake data.

Example response shape:

```json
{
  "total_value": 24500.0,
  "daily_change": 320.0,
  "daily_change_percent": 1.32,
  "positions": 6,
  "top_holding": "NVDA",
  "holdings": [],
  "sector_allocation": [],
  "country_allocation": []
}
```

The exact fields can be improved, but keep the endpoint simple and useful for the future frontend.

---

## Test Style

Use pytest. Tests should be plain functions — no class wrappers needed.

```python
# Example
def test_calculate_total_value():
    holdings = [{"value": 1000.0}, {"value": 500.0}]
    result = calculate_total_value(holdings)
    assert result == 1500.0
```

Place tests in: `backend/tests/test_portfolio_service.py`
Test pure calculation functions from `portfolio_service.py` — not HTTP endpoints.

---

## Commands

```bash
# Install dependencies
uv sync

# Run backend
uv run uvicorn app.main:app --reload

# Run tests
uv run pytest
```

If commands differ from these, explain clearly why.

---

## Git Rules

- Work on a feature branch: `feature/backend-foundation`
- Do not commit directly to `main` or `dev`.
- Do not create git commits unless explicitly asked.
- Branch flow: `feature/...` → PR → `dev` → PR → `main`

---

## After Implementation

After making changes, always summarize:

1. What files were created or changed
2. What endpoints exist and their response shapes
3. How to run the backend
4. How to run the tests
5. What the next recommended step is

Do not make unrelated improvements. Do not summarize things that were not changed.
