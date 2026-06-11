# ADR-004 — Quantitative Analytics Scope

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 004 project: assetflow-mini date: 2026-06-09 status: accepted tags: decision, assetflow-mini

## Context

AssetFlow Mini is partly a showcase of quantitative analysis skills. The question is which quant methods to implement — too few and it's unimpressive, too many and it becomes unfinishable or academically shallow.

## Decision

Three tiers:

**Basics (implement):** Sharpe ratio, annualised volatility, max drawdown, correlation matrix, beta.

**Mid-tier (implement):** Monte Carlo simulation (portfolio projection with confidence intervals), Value at Risk (VaR, 95%), beta calculation.

**Strong — one capstone piece (implement):** Efficient Frontier / mean-variance optimization (Markowitz).

**Advanced (deferred to full AssetFlow product):** Black-Litterman, CVaR, regime detection.

## Reasoning

Basics + mid-tier + one strong piece is the right balance for a showcase: recognizable to finance professionals, non-trivial to implement correctly, and visualizes well in the frontend. The Efficient Frontier is the capstone because it's the most visually compelling and demonstrates understanding of modern portfolio theory. Advanced methods are deferred because they require more data infrastructure and add complexity without proportional showcase value at this stage.

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| Basics only | Unimpressive for a quant showcase |
| All advanced methods | Scope creep; risk of shallow implementation |
| No quant analytics | Misses a core differentiator of this project |

## Consequences

- `analytics_service.py` must be implemented with numpy/scipy/pandas (Phase 5).
- Tests for analytics_service must include statistical validation, not just happy-path checks.
- Advanced methods (Black-Litterman, CVaR, regime detection) are explicitly out of scope for AssetFlow Mini.

---

_Supersede by creating a new ADR that references this one._
