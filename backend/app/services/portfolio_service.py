from decimal import ROUND_HALF_UP, Decimal

from app.schemas.portfolio import HoldingSummary, PortfolioItem, PortfolioSummary
from app.seeds import SEED_HOLDINGS, SEED_PORTFOLIOS

_CENTS = Decimal("0.01")
_HUNDRED = Decimal("100")


def _d(value: float | int) -> Decimal:
    # Convert via str to preserve decimal representation, not binary float encoding.
    # Decimal(0.1) gives 0.1000000000000000055511...; Decimal("0.1") gives exactly 0.1.
    return Decimal(str(value))


def _quantize(value: Decimal) -> Decimal:
    return value.quantize(_CENTS, rounding=ROUND_HALF_UP)


# --- Public calculation primitives (used by tests) ---

def calculate_market_value(shares: float, current_price: float) -> float:
    return float(_quantize(_d(shares) * _d(current_price)))


def calculate_gain_loss(market_value: float, shares: float, avg_price: float) -> float:
    cost = _d(shares) * _d(avg_price)
    return float(_quantize(_d(market_value) - cost))


def calculate_gain_loss_pct(gain_loss: float, cost: float) -> float:
    if cost == 0:
        return 0.0
    return float(_quantize(_d(gain_loss) / _d(cost) * _HUNDRED))


# --- Private builders use Decimal throughout to prevent inter-step rounding drift ---

def _build_holding(raw: dict) -> HoldingSummary:
    shares = _d(raw["shares"])
    avg_price = _d(raw["avg_price"])
    current_price = _d(raw["current_price"])

    market_value = _quantize(shares * current_price)
    cost = shares * avg_price  # full precision for subtraction
    gain_loss = _quantize(market_value - cost)
    cost_rounded = _quantize(cost)
    gain_loss_pct = (
        Decimal("0") if cost_rounded == 0
        else _quantize(gain_loss / cost_rounded * _HUNDRED)
    )

    return HoldingSummary(
        symbol=raw["symbol"],
        name=raw["name"],
        shares=raw["shares"],
        avg_price=raw["avg_price"],
        current_price=raw["current_price"],
        market_value=float(market_value),
        gain_loss=float(gain_loss),
        gain_loss_pct=float(gain_loss_pct),
        sector=raw["sector"],
        portfolio_id=raw["portfolio_id"],
    )


def _build_portfolio_item(portfolio_raw: dict, holdings: list[HoldingSummary]) -> PortfolioItem:
    port_holdings = [h for h in holdings if h.portfolio_id == portfolio_raw["id"]]

    value = _quantize(sum((_d(h.market_value) for h in port_holdings), Decimal("0")))
    cost = _quantize(sum((_d(h.shares) * _d(h.avg_price) for h in port_holdings), Decimal("0")))
    gain_loss = _quantize(value - cost)
    gain_loss_pct = (
        Decimal("0") if cost == 0
        else _quantize(gain_loss / cost * _HUNDRED)
    )

    return PortfolioItem(
        id=portfolio_raw["id"],
        name=portfolio_raw["name"],
        value=float(value),
        cost=float(cost),
        gain_loss=float(gain_loss),
        gain_loss_pct=float(gain_loss_pct),
        holdings_count=len(port_holdings),
        currency=portfolio_raw["currency"],
    )


def get_portfolio_summary() -> PortfolioSummary:
    holdings = [_build_holding(h) for h in SEED_HOLDINGS]
    portfolios = [_build_portfolio_item(p, holdings) for p in SEED_PORTFOLIOS]

    total_value = _quantize(sum((_d(p.value) for p in portfolios), Decimal("0")))
    total_cost = _quantize(sum((_d(p.cost) for p in portfolios), Decimal("0")))
    unrealized_pl = _quantize(total_value - total_cost)
    unrealized_pl_pct = (
        Decimal("0") if total_cost == 0
        else _quantize(unrealized_pl / total_cost * _HUNDRED)
    )

    return PortfolioSummary(
        total_value=float(total_value),
        total_cost=float(total_cost),
        unrealized_pl=float(unrealized_pl),
        unrealized_pl_pct=float(unrealized_pl_pct),
        portfolios=portfolios,
        holdings=holdings,
    )
