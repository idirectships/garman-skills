# bug-hunt

3-agent triangulation system for noise-filtered bug detection: Hunter → Skeptic → Referee.

## What it does

Exploits LLM sycophancy directionally. Each agent is maximally biased in a different direction — finding everything, disproving everything, arbitrating — and truth emerges from the triangulation.

```
Hunter  → overclaims (superset of all possible bugs)
Skeptic → aggressively disproves (filters to confident real bugs)
Referee → arbitrates with fake ground-truth pressure (final verdicts)
```

3-agent triangulation: reduces false positives vs. single-pass review by forcing adversarial disproof before any finding is confirmed.

## Install

Copy `skills/bug-hunt/` into `.claude/skills/bug-hunt/`

## Usage

Triggers on: `bug sweep`, `find bugs`, `code audit`, `security review`, `what could go wrong`, `scan for vulnerabilities`. Also fires as Stage 3 of debugger pipeline.

**Argument:** `[path-or-component] [optional: focus area e.g. security, performance, logic]`

## Files

- `SKILL.md` — complete protocol with 3-agent prompt templates and scoring system

## Config

Requires `Agent` tool access. Each of the 3 sub-agents requires a fresh context (no shared state).

---

Built by [Garman Unified Systems](https://idirectships.com)
