# ADR-006 — Conventional Commits for all commit messages

<!-- ARCHITECTURAL DECISION RECORD Written by Claude Code when a significant decision is made. Claude checks this folder before suggesting architectural changes. Never contradict an ADR without explicitly superseding it. -->

---

## adr: 006 project: assetflow-mini date: 2026-06-11 status: accepted tags: decision, assetflow-mini

## Context

As the project grows across multiple phases and contributors (human + AI), commit history needs to be readable and machine-parseable. Without a standard, commit messages vary in style and signal, making it hard to understand what changed and why at a glance.

## Decision

All commits must follow the Conventional Commits specification (https://www.conventionalcommits.org/en/v1.0.0/).

Format: `type(scope): description`

Allowed types: `feat`, `fix`, `test`, `chore`, `refactor`, `docs`, `style`, `perf`

Examples:
- `feat(backend): add transaction CRUD endpoints`
- `fix(backend): replace deprecated datetime.utcnow with timezone-aware UTC`
- `docs(claude): add conventional commits rule to git guidelines`

## Reasoning

Conventional Commits gives the project:
- A readable, scannable git history with clear intent per commit
- A foundation for automated changelog generation if needed later
- Consistency regardless of whether Claude Code or a human author writes the commit
- Industry-standard practice recognisable to any external code reviewer

## Alternatives Considered

| Option | Why Rejected |
|--------|-------------|
| Free-form commit messages | Inconsistent style, harder to scan history, less professional for a showcase project |
| GitHub squash-merge only with PR titles | Loses per-commit granularity during development; PR titles alone are not enough signal |

## Consequences

- Every commit — whether authored by a human or Claude Code — must use the conventional format
- Claude Code will always use conventional commits when asked to commit, as enforced in CLAUDE.md
- PR titles should also follow the format for consistency in the merge commit

---

_Supersede by creating a new ADR that references this one._
