# mutation-testing

Set up mutation testing to verify your tests exercise correctness claims, not just pass.

## What it does

Covers falsifier identification, test segregation, tool setup (Python/JS/Rust/Go/.NET), baseline scoring, and CI gate configuration across a 6-phase workflow.

## Metric

*"A production classifier with 36 passing tests had a mutation score of 0.363 — tests were passing while the decision boundary was untested. Mutation testing found it. Coverage metrics did not."*

## Install

Copy `skills/mutation-testing/` into `.claude/skills/mutation-testing/`

## Usage

Triggers on: `set up mutation testing`, `mutation score`, `test the tests`, `is this code falsifiable`, `add mutation gate`, `verify the tests actually work`

## Requirements

Language-specific:
- Python: `mutmut`
- JS/TS: Stryker
- Rust: `cargo-mutants`
- Java: PIT
- .NET: Stryker.NET

## Files

- `SKILL.md` — 6-phase workflow, falsifier checklist, threshold table, anti-patterns, CI YAML template

## Config

None required. Tool and path configured per-project during setup.

---

Built by [Garman Unified Systems](https://idirectships.com)
