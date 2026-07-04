# neutral-audit

Bias-free code observation without a bug-hunting agenda.

## What it does

Performs a single-stage, neutral code audit of a file, directory, or component. Surfaces what is actually there without anchoring toward finding bugs (which causes false-positive bug invention) or confirming correctness (which causes false reassurance).

| Biased prompt | Agent behavior |
|---|---|
| "Find bugs in this file" | Invents bugs to satisfy the request |
| "Is this code good?" | Confirms it's good to please you |
| "Are there security issues?" | Finds security issues even if none exist |

Observations are framed as "this could be a problem if X", not "this is a bug."

Eliminates sycophancy-driven false findings: a biased "find bugs" prompt causes agents to invent bugs; a neutral prompt surfaces what's actually there.

## Install

Copy `skills/neutral-audit/` into `.claude/skills/neutral-audit/`

## Usage

Triggers on: `what does this code do`, `explain this file`, `how does this work`, `neutral audit`, `orient me to this component`, after context compaction.

**Argument:** `[file, directory, or component to audit]`

## Files

- `SKILL.md` — 4-step protocol with neutral subagent prompt template

## Pairs with

`bug-hunt` — run neutral-audit to understand first, then bug-hunt to investigate.

## Config

None required.

---

Built by [Garman Unified Systems](https://idirectships.com)
