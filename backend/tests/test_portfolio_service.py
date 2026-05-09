import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.portfolio_service import (
    calculate_gain_loss,
    calculate_gain_loss_pct,
    calculate_market_value,
    get_portfolio_summary,
)

client = TestClient(app)


def test_market_value():
    assert calculate_market_value(10.0, 480.0) == 4800.0
    assert calculate_market_value(20.0, 185.0) == 3700.0
    assert calculate_market_value(0.0, 100.0) == 0.0


def test_gain_loss():
    # NVDA: 10 shares @ avg 400, market value 4800 → gain 800
    assert calculate_gain_loss(4800.0, 10.0, 400.0) == 800.0
    # JNJ: 25 shares @ avg 155, market value 3700 → loss -175
    assert calculate_gain_loss(3700.0, 25.0, 155.0) == -175.0


def test_gain_loss_pct():
    assert calculate_gain_loss_pct(800.0, 4000.0) == 20.0
    assert calculate_gain_loss_pct(-175.0, 3875.0) == round((-175.0 / 3875.0) * 100, 2)
    assert calculate_gain_loss_pct(0.0, 0.0) == 0.0


def test_unrealized_pl():
    summary = get_portfolio_summary()
    assert summary.unrealized_pl == round(summary.total_value - summary.total_cost, 2)


def test_unrealized_pl_pct():
    summary = get_portfolio_summary()
    expected = round((summary.unrealized_pl / summary.total_cost) * 100, 2)
    assert summary.unrealized_pl_pct == expected


def test_health_returns_200():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_portfolio_summary_status():
    response = client.get("/api/portfolio/summary")
    assert response.status_code == 200


def test_portfolio_summary_top_level_fields():
    data = client.get("/api/portfolio/summary").json()
    for field in ["totalValue", "totalCost", "unrealizedPl", "unrealizedPlPct", "portfolios", "holdings"]:
        assert field in data
    assert len(data["portfolios"]) > 0
    assert len(data["holdings"]) > 0


def test_portfolio_summary_holding_fields():
    holding = client.get("/api/portfolio/summary").json()["holdings"][0]
    for field in ["symbol", "name", "shares", "avgPrice", "currentPrice",
                  "marketValue", "gainLoss", "gainLossPct", "sector", "portfolioId"]:
        assert field in holding


def test_portfolio_summary_portfolio_fields():
    portfolio = client.get("/api/portfolio/summary").json()["portfolios"][0]
    for field in ["id", "name", "value", "cost", "gainLoss", "gainLossPct",
                  "holdings", "currency"]:
        assert field in portfolio


def test_holding_market_value_equals_shares_times_price():
    holdings = client.get("/api/portfolio/summary").json()["holdings"]
    for h in holdings:
        expected = round(h["shares"] * h["currentPrice"], 2)
        assert h["marketValue"] == expected


# --- Precision tests ---

def test_rounding_half_up_market_value():
    # 1.0 share @ $1.005: decimal value is exactly $1.005 → should round UP to $1.01
    # With raw float: 1.0 * 1.005 = 1.0049999... → round() gives $1.00 (wrong)
    assert calculate_market_value(1.0, 1.005) == 1.01


def test_rounding_half_up_gain_loss_pct():
    # gain $12.345 on cost $100.00 → exactly 12.345%
    # With raw float: 12.345 is stored as 12.34499... → round() gives 12.34 (wrong)
    assert calculate_gain_loss_pct(12.345, 100.0) == 12.35


def test_fractional_shares_market_value():
    # 10.333 shares @ $234.567 = $2423.780811 → rounds to $2423.78
    assert calculate_market_value(10.333, 234.567) == 2423.78


def test_fractional_shares_gain_loss():
    # market_value $2423.78 (rounded), avg_price $200.00
    # cost basis = 10.333 * $200.00 = $2066.60
    # gain = $2423.78 - $2066.60 = $357.18
    assert calculate_gain_loss(2423.78, 10.333, 200.0) == 357.18


def test_zero_cost_gain_loss_pct():
    assert calculate_gain_loss_pct(100.0, 0.0) == 0.0
