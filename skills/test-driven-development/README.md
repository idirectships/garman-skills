# test-driven-development

Enforces the red-green-refactor TDD cycle via the Iron Law: no production code without a failing test first.

## What it does

Drives the complete TDD cycle: write a failing test, watch it fail, write minimal code to pass, refactor. Includes a companion `testing-anti-patterns.md` reference that flags the most common TDD violations (testing mock behavior, test-only production methods, mocking without understanding).

The Iron Law is enforced unconditionally:

> NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST

## Install

Copy `skills/test-driven-development/` into `.claude/skills/test-driven-development/`

## Usage

Triggers on: `TDD this`, `write tests first`, `test before implementing`, `red green refactor`

## Files

- `SKILL.md` — main TDD protocol with Iron Law, Red-Green-Refactor cycle, Common Rationalizations table, and Verification Checklist
- `testing-anti-patterns.md` — companion reference: mocking mistakes, test-only production methods

## Config

None required.

---

Built by [Garman Unified Systems](https://idirectships.com)
