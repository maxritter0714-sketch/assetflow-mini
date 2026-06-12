# ADR-007 — Session-End Documentation Health Check

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 007 project: assetflow-mini date: 2026-06-11 status: accepted tags: decision, assetflow-mini

## Context

As the project grows across multiple phases, documentation drifts silently. New endpoints get added without updating the API table, phases complete without updating the roadmap, dependencies get added without appearing in the README prerequisites. This was noticed during the Phase 4 session when the README was still a 2-line stub despite 4 phases of work being done.

The session-end skill runs at the end of every session and already handles session logs, ADRs, and global promotion. It is the natural place to enforce a documentation check.

## Decision

Add a documentation health check (Step 7a) to the session-end skill that runs at the end of every session. The check covers:

1. **README.md** — fix immediately and commit if anything is stale
2. **`docs/` folder** — flag stale files, fix one-liners immediately, defer larger updates to next session
3. **Project instruction files** (`CLAUDE.md`, `AGENTS.md`, `CONTEXT.md`, etc.) — flag if current phase, stack, or structure no longer matches reality

## Reasoning

- Documentation drift compounds across sessions — catching it per-session keeps the cost small
- The session-end skill already has full context of what changed, making it the best place to evaluate drift
- Fixing the README immediately (with a commit) keeps the public-facing showcase accurate at all times, which matters for this repo being used in job applications
- A standalone `/doc-check` skill would require remembering to run it — embedding it in session-end makes it automatic

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| Separate `/doc-check` skill | Requires conscious invocation — would be forgotten; also lacks session context about what specifically changed |
| Check documentation at session start | Too late to fix the previous session's drift cleanly; session-end has the right context |
| Leave documentation to manual discipline | Already proven not to work — README was a 2-line stub after 4 phases |

## Consequences

- Every session-end now includes a documentation scan — adds a small amount of time per session
- README is committed during session-end if stale, which may add an extra commit to the history
- The session-end skill is now global (applies to all projects), not just assetflow-mini — the check is generic enough to work across any project type

---

_Supersede by creating a new ADR that references this one._
