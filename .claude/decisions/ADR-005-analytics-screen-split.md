# ADR-005 — Analytics Feature Split Across Portfolio Detail And Dedicated Screen

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 005 project: assetflow-mini date: 2026-06-09 status: accepted tags: decision, assetflow-mini

## Context

The quant analytics features (Sharpe, VaR, Monte Carlo, Efficient Frontier) needed a home in the frontend. Options were: embed everything in Portfolio Detail, create a dedicated Analytics screen, or split between both.

## Decision

Split by complexity:

**Portfolio Detail screen (additions):** Sharpe ratio, annualised volatility, max drawdown, beta — shown as KPI cards. Correlation matrix heatmap of holdings.

**Dedicated Analytics screen (new sidebar item):** Monte Carlo simulation (projection chart + confidence intervals), Efficient Frontier (interactive chart with current portfolio plotted), VaR (single number with plain-English explanation).

## Reasoning

Quick metrics belong alongside the holdings context they describe — adding them to Portfolio Detail requires no navigation. The heavy interactive tools (Monte Carlo, Efficient Frontier) are the showcase centrepiece and deserve full-screen real estate. Burying them in Portfolio Detail would make them harder to find and harder to display well.

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| All analytics on Portfolio Detail | Heavy tools need full-screen space; clutters the holdings view |
| All analytics on dedicated screen | Quick metrics lose their portfolio context |

## Consequences

- A new Analytics screen must be added to the frontend sidebar navigation.
- Backend needs analytics endpoints: `/api/analytics/portfolio/{id}`, `/api/analytics/monte-carlo/{id}`, `/api/analytics/efficient-frontier/{id}`.
- Analytics screen is added in Phase 7 (frontend wiring).

---

_Supersede by creating a new ADR that references this one._
