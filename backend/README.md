# AssetFlow Mini — Backend

FastAPI backend for the AssetFlow Mini portfolio dashboard.

## Stack

- Python 3.11+
- FastAPI
- Pydantic
- uv (dependency management)
- pytest + httpx (testing)

## Setup

```bash
uv sync
```

## Run

```bash
uv run uvicorn app.main:app --reload --port 8000
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/portfolio/summary` | Portfolio summary with holdings |

API docs available at `http://localhost:8000/docs` when the server is running.

## Tests

```bash
uv run pytest -v
```

## Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app + CORS middleware
│   ├── seeds.py                 # Hardcoded sample data
│   ├── api/
│   │   ├── routes_health.py
│   │   └── routes_portfolio.py
│   ├── schemas/
│   │   └── portfolio.py         # Pydantic response models
│   ├── services/
│   │   └── portfolio_service.py # Calculation logic
│   ├── core/
│   └── utils/
└── tests/
    └── test_portfolio_service.py
```
