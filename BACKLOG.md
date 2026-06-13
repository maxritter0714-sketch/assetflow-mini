# Backlog

Items deferred from active development. Not roadmap phases — just ideas worth revisiting.

---

## Market Data

### Pre/post-market prices
Show extended-hours prices on quote and portfolio summary endpoints.

**Why it was deferred:** `ticker.info` (the only reliable yfinance source for pre/post prices) is ~1-2s per symbol. With 6+ holdings that makes the portfolio summary unacceptably slow without a dedicated slow-path or background refresh.

**When to revisit:** After frontend is wired up and a background price-refresh job is a natural addition. An `?extended_hours=true` query param on `GET /api/market/quote/{symbol}` would be the right interface.

**Frontend complement:** Add a "market closed" indicator next to prices outside regular hours (9:30am–4pm ET) so stale close prices are clearly labelled rather than silently shown as current.

---

## Code Review Findings — Phase 6 + Watchlist (2026-06-13)

8 confirmed bugs and 2 plausible issues from automated code review. Ranked by severity.

### BUG-1: Empty filtered news result never cached (news_service.py:138)
When all fetched articles fail `_is_relevant()`, `items=[]` and the `if items:` guard skips `_cache_set`. The stale cache is never refreshed with the empty result, so every subsequent request re-fetches from yfinance indefinitely. Same pattern at line 170 (portfolio news) and line 200 (macro news).

**Fix:** Cache the empty result too — remove the `if items:` guard and always call `_cache_set`.

### BUG-2: Screener returns is_stale=True alongside fresh data (screener_service.py:208)
`is_stale` is set from the pre-fetch cache check and never reset to `False` after a successful `_fetch_universe()` call. The return expression `is_stale if cached is not None else False` evaluates the stale flag even when fresh data was just written.

**Fix:** Set `is_stale = False` after a successful fetch and cache write, or restructure the return to track whether fresh data was actually fetched.

### BUG-3: Invalid ticker returns 200 all-null instead of 404 (routes_fundamentals.py:14)
`get_fundamentals` returns `({}, False)` for unknown tickers. The route unpacks the empty dict into `FundamentalsResponse(**{})` which succeeds (all fields are Optional) and returns HTTP 200 with every field null.

**Fix:** Check for empty dict in the route and return 404, or have the service raise an exception for unknown tickers.

### BUG-4: Falsy-zero guard on P/E and beta (fundamentals_service.py:76,78)
`if pe` and `if info.get("beta")` treat `0.0` as missing, returning `None` instead of `0.0` for loss-making companies (P/E=0) or low-beta stocks.

**Fix:** Replace with explicit `if pe is not None` and `if info.get("beta") is not None`.

### BUG-5: _is_relevant passes all articles for unknown tickers (news_service.py:114)
Line 115: `return symbol.upper() not in _TICKER_HINTS` means any ticker not in the hardcoded dict passes every article through unfiltered. User-added watchlist tickers like INTC, NFLX, DIS are not in the dict.

**Fix:** Either default to the 3-char symbol match for unknown tickers (no pass-through), or expand `_TICKER_HINTS` to cover more tickers. See also ADR-009 for the planned score-based replacement.

### BUG-6: Watchlist name has no max_length constraint (schemas/watchlist.py:11)
`WatchlistItemCreate.name: str` has no `max_length`, but the DB column is `String(200)`. A name >200 chars passes Pydantic and causes an unhandled database error (500).

**Fix:** Add `name: str = Field(max_length=200)`.

### BUG-7: rev_growth always None for FMP-P/E-success symbols (screener_service.py:141)
`rev_growth` is only populated in the yfinance P/E fallback loop, which only runs for symbols where FMP returned no P/E. Symbols that do get P/E from FMP never get `rev_growth` populated.

**Fix:** Populate `rev_growth` from yfinance for all symbols in a separate pass, or fetch it from the FMP ratios-ttm response alongside P/E.

### BUG-8: Basic Materials mapped to Energy in sector map (screener_service.py:27)
`_SECTOR_MAP` maps `"Basic Materials"` → `"Energy"`. Currently dormant (no Basic Materials stocks in the universe), but wrong — mining/chemicals would appear in the Energy filter.

**Fix:** Map `"Basic Materials"` to `"Materials"` and add "Materials" as a filter option in the frontend, or drop it from the map so it passes through as-is.

### PLAUSIBLE-1: hist["Close"] MultiIndex assumption (screener_service.py:163)
`yf.download` returns a flat DataFrame (not MultiIndex) when called with a single ticker. If `_SCREENER_UNIVERSE` is ever reduced to one ticker, `hist["Close"]` raises and all `perf_6m` stay `None` silently.

**Fix:** Add a guard: `if isinstance(close, pd.Series): close = close.to_frame(sym)` or handle the single-ticker case explicitly.

### PLAUSIBLE-2: pubDate sorted as raw string (news_service.py:168)
Portfolio and macro news are sorted by `published_at` as a raw yfinance string with no normalization. Inconsistent date formats across tickers could produce wrong chronological ordering.

**Fix:** Normalize `published_at` to a Unix timestamp or ISO string during parsing in `_parse_yf_item`.

