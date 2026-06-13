# ADR-009 — News Relevance Filter: Keyword Baseline with Planned Score Evolution

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 009 project: assetflow-mini date: 2026-06-13 status: accepted tags: decision, assetflow-mini

## Context

Yahoo Finance's news API loosely associates articles with multiple tickers at once. A search for NVDA news returns articles about XRP, Social Security policy, and generic market commentary alongside genuine NVIDIA content. The ticker-news and portfolio-news endpoints were surfacing clearly irrelevant articles to the user.

Additionally, GDELT (used for macro news) was rate-limited at 1 req/5 seconds and produced mixed-quality results. yfinance macro instrument tickers (`^TNX`, `GC=F`, `CL=F`, `EURUSD=X`, `^VIX`) were adopted as the macro news source instead (see ADR-002 amendment).

## Decision

Implement a two-layer approach:

**Now (MVP):** Binary keyword filter — `_is_relevant(symbol, title, summary) -> bool`
- Checks for literal symbol match in article text (for tickers ≥ 3 chars)
- Falls back to a manually maintained `_TICKER_HINTS` dict mapping each ticker to company name, product, and executive keywords
- Unknown tickers (not in hints dict) pass through unfiltered
- Applied in `get_ticker_news` and `get_portfolio_news`; deliberately NOT applied to macro news

**Future (planned):** Replace with a float scoring function — `relevance_score(...) -> float`
- Returns 0.0–1.0; articles sorted by score, top N returned
- Tiered hint weights: primary (company name, CEO) > secondary (products) > sector fallback (GPU, semiconductor)
- Title position weighting: keyword in first 3 words scores higher
- Source credibility multiplier: wire services > aggregators
- Negative signals: explicit competitor names in title reduce score
- Hard zero retained for completely off-topic articles (score 0.0 = filtered out)

## Reasoning

- A binary filter shipping now immediately removes the worst offenders (XRP articles in NVDA feed) without requiring a full algorithm design session
- The hint dict is a natural fit for a curated 26-stock universe — maintenance burden is bounded
- Building toward a scoring function preserves the keyword foundation while enabling ranked results instead of hard pass/fail — this allows borderline-relevant sector articles to appear at lower rank rather than disappearing entirely
- No external NLP dependencies needed: the algorithm is pure Python string operations, fully testable, no rate limits

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| No filter (raw Yahoo Finance feed) | Too noisy — clearly off-topic articles appear for every ticker |
| ML classifier / embedding similarity | Requires external model or API; overkill for a 26-stock curated universe at this stage |
| Switch to a different news source | NewsAPI free tier has 100 req/day; other sources either paywalled or lower quality for US equities |
| Filter by Yahoo Finance's own ticker tags | Yahoo's tagging is the problem — it's already what produces the irrelevant results |

## Consequences

- `_TICKER_HINTS` must be updated when adding new tickers to the screener universe
- The scoring function migration is self-contained: same function signature, same call sites — no schema or route changes needed
- Macro news feed intentionally bypasses the filter (macro instruments aren't equities; their news is expected to be macro-themed)
- Test coverage for `relevance_score()` should be written before deployment — the function is pure and easily unit-tested

---

_Supersede by creating a new ADR that references this one._
