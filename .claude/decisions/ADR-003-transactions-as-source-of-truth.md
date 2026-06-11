# ADR-003 — Transactions As Source Of Truth For Holdings

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 003 project: assetflow-mini date: 2026-06-09 status: accepted tags: decision, assetflow-mini

## Context

Portfolio data needs to be entered manually (broker import excluded from MVP). The question is whether to store current holdings directly (a holdings table with shares + avg price) or derive holdings from a transaction log (buy/sell records).

## Decision

Use a `transactions` table as the source of truth. Current holdings (shares held, average cost basis) are computed from transaction history. The `transactions` table records every buy and sell event.

## Reasoning

Append-only transaction log is the correct financial data model — it preserves history, makes cost basis calculation auditable, and supports future features like realized P&L, transaction history screen, and CSV broker import. A flat holdings table would lose this history and require manual reconciliation if corrections are needed.

It also demonstrates clean backend design to recruiters — this is how real portfolio tracking systems work.

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| Flat holdings table (shares + avg price) | Loses transaction history; no realized P&L; harder to correct mistakes |
| Holdings table + separate transactions table | Two sources of truth; risk of drift; unnecessary complexity |

## Consequences

- Portfolio summary endpoint must derive holdings by aggregating transactions.
- Average cost basis is calculated as weighted average of buy transactions.
- Phase 4 must implement transaction entry endpoints (POST /api/transactions).
- CSV import (later phase) can be implemented as bulk transaction insertion.

---

_Supersede by creating a new ADR that references this one._
