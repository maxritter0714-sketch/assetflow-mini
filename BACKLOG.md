# Backlog

Items deferred from active development. Not roadmap phases — just ideas worth revisiting.

---

## Market Data

### Pre/post-market prices
Show extended-hours prices on quote and portfolio summary endpoints.

**Why it was deferred:** `ticker.info` (the only reliable yfinance source for pre/post prices) is ~1-2s per symbol. With 6+ holdings that makes the portfolio summary unacceptably slow without a dedicated slow-path or background refresh.

**When to revisit:** After frontend is wired up and a background price-refresh job is a natural addition. An `?extended_hours=true` query param on `GET /api/market/quote/{symbol}` would be the right interface.

**Frontend complement:** Add a "market closed" indicator next to prices outside regular hours (9:30am–4pm ET) so stale close prices are clearly labelled rather than silently shown as current.
