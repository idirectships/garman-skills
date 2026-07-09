<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->
---
title: "test-driven-development: make an AI write the test first — and watch it fail"
meta_description: "AI agents fake TDD by writing tests after the code, so they always pass and prove nothing. This skill enforces red-green-refactor with the Iron Law — no production code without a failing test you watched fail first."
slug: test-driven-development
skill: test-driven-development
date: 2026-07-07
tags: [tdd, red-green-refactor, ai-coding, test-first, software-quality, claude-skills]
representative_queries:
  - "how do I make an AI actually do TDD instead of faking it"
  - "why do AI-written tests always pass and catch nothing"
  - "red green refactor with a coding agent"
  - "test-first development for AI-generated code"
  - "how to enforce writing tests before implementation"
  - "AI wrote tests after the code — is that still TDD"
  - "the iron law of TDD no production code without a failing test"
  - "stop an agent from writing tests that only mirror the code"
---

# test-driven-development: make an AI write the test first — and watch it fail

## Hook

Ask a coding agent to "use TDD" and it will happily write the code, then write a
test, then report green — the artifacts of TDD with the value reversed out.
**This skill enforces the one rule that makes TDD mean anything: no production
code without a failing test you watched fail first.** RED, verify RED, GREEN,
refactor — in that order, every time.

## The Problem

A test written after the code always passes on the first run. That green tells
you nothing: you never saw it fail, so you can't know whether it tests the
behavior you care about or just describes whatever the code already does. Agents
fall into this constantly — an assertion that `result.length === 3` against a
function that returns three items for unrelated reasons, a "retry path" test
whose mock resolves on the first call so the retry never runs. All green. All
meaningless.

The trap is that it's socially rewarded. "Tests pass" is the phrase everyone
wants, and the easiest way to produce a passing test is to write it last, against
code you already know works. So an agent optimizing to please writes a mirror,
not a test — and the practice gets hollowed out while every surface signal says
it's healthy.

## How It Works

This skill makes the order mechanical and non-negotiable:

- **RED — write one failing test.** One behavior, a clear name, real code over
  mocks. It describes what *should* happen, before it can.
- **Verify RED — watch it fail, for the right reason.** Mandatory, never skipped.
  A test that passes here is testing existing behavior; a test that errors has a
  typo. Only a clean, expected failure proves the test measures the thing you
  think it does.
- **GREEN — minimal code to pass.** Just enough. No speculative options, no
  gold-plating.
- **Refactor — clean up under a green bar.** Now that behavior is pinned, improve
  structure without changing it.

The quotable version — the **Iron Law: no production code without a failing test
first.** Wrote code before the test? Delete it and re-derive it from the test.
Not "keep it as reference." Delete means delete.

## A Real Run

You ask for a `retryOperation` helper that retries three times.

**RED.** The skill writes the test first: an operation that throws twice then
succeeds, asserting the result is `success` and that it took exactly three
attempts. `retryOperation` doesn't exist yet.

**Verify RED.** Run it. It fails — `retryOperation is not defined`. Good: it
fails because the feature is missing, not because of a typo. That failure is the
proof the test is wired to real behavior.

**GREEN.** Now the minimal implementation: a three-iteration loop that returns on
success and rethrows on the final attempt. Run again — green. This green means
something, because you saw the red it replaced.

**Refactor.** Tidy the loop, keep the bar green.

Contrast the faked version: implementation first, then a test using a mock that
resolves immediately. It passes on run one — and it never actually exercised a
retry. Same green light, zero coverage of the behavior you asked for.

## When To Use It

Reach for this whenever correctness is the point:

- New features and bug fixes — write the failing test that reproduces the bug
  first, then fix it.
- Refactors and behavior changes, where a real red-green cycle guards against
  silent regressions.
- Any time an agent is about to hand you "implemented with tests, all passing" —
  make it prove the tests were red first.

Skip it for throwaway prototypes, generated code, and config files — but decide
that on purpose, not because "just this once" felt faster.

## Try It

```
# Install
Copy skills/test-driven-development/ into .claude/skills/test-driven-development/

# Run
TDD this: [feature or bug]
```

The full red-green-refactor protocol and the Iron Law are in
[`skills/test-driven-development/SKILL.md`](../skills/test-driven-development/SKILL.md).
The story behind it is in
[`skills/test-driven-development/STORY.md`](../skills/test-driven-development/STORY.md).

---

*test-driven-development is one of a growing set of open skills we're releasing —
each ships with the story of the mistake that produced it. Built by
[Garman Unified Systems](https://idirectships.com).*
