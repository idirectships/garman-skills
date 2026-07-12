<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->
<!--
  ┌─────────────────────────────────────────────────────────────────────┐
  │  EXEMPLAR TEMPLATE — every garman-skills launch post follows this.   │
  │  Sections are fixed: Hook / The Problem / How It Works / A Real Run  │
  │  / When To Use It / Try It. Replace each {{PLACEHOLDER}} and the     │
  │  frontmatter, keep the section order and the voice: concrete,        │
  │  first-person "we built", no marketing filler, one quotable metric.  │
  └─────────────────────────────────────────────────────────────────────┘
-->
---
title: "bug-hunt: three agents that argue about your code so you don't ship the bug"
meta_description: "bug-hunt runs adversarial 3-agent triangulation — a Hunter that over-claims, fresh-context Skeptics that refute, and an Opus Referee — to catch real bugs before you ship without the false-positive noise of single-pass AI review."
slug: bug-hunt
skill: bug-hunt
date: 2026-07-05
tags: [ai-code-review, bug-detection, agents, pre-production, security-review]
representative_queries:
  - "how do I find bugs with AI before I ship"
  - "why does AI code review give so many false positives"
  - "adversarial multi-agent code review"
  - "AI security review for a pull request"
  - "catch bugs in a diff before production"
  - "reduce false positives in automated code review"
  - "3-agent bug triangulation"
  - "what could go wrong with this code review AI"
---

# bug-hunt: three agents that argue about your code so you don't ship the bug

## Hook

Ask one AI agent "what's wrong with this code?" and it will always find
something — plausible, confidently worded, and often wrong. **bug-hunt runs
three adversarial agents instead of one: a Hunter that over-claims, Skeptics
that refute, and a Referee that decides. Only bugs that survive the argument
come back.**

<!-- TEMPLATE {{HOOK}}: 2-3 sentences. Name the pain, then the skill's one-line
     mechanism in bold. End on the payoff, not the feature. -->

## The Problem

Single-pass AI review has a structural flaw: the agent is rewarded for agreeing
with your premise. You asked it to find bugs, so it finds bugs — whether or not
they exist. The output *reads* like diligence. You get a "race condition" on a
path that's already serialized, a "null deref" on a value the caller
guarantees, an "injection risk" on a string that never touches a query. Each is
individually believable, which is exactly why they cost you: you spend real
hours disproving findings the model never verified. The tool measured its own
eagerness to please, not your code.

<!-- TEMPLATE {{PROBLEM}}: describe the failure mode the skill exists to fix.
     Be specific about *why* the naive approach breaks, with concrete examples. -->

## How It Works

bug-hunt turns one biased pass into a controlled argument between three roles:

- **Hunters (over-claim on purpose).** Parallel agents each work a single lens —
  correctness, security, data-integrity, boundaries — and are told false
  positives are cheap and missed bugs are not. They surface a deliberately
  wide superset of candidates, each with a concrete trigger.
- **Skeptics (refute by default).** Every candidate goes to a *fresh-context*
  agent that never saw the Hunter's confidence. It's scored to disprove: it must
  independently construct the failing input, or the finding dies. A skeptic that
  starts blank can't inherit the hunter's bias.
- **Referee (decides).** Only survivors reach an Opus arbiter that reads the code
  cold and issues a final verdict with a fix direction and true severity.

The quotable version: **3-agent triangulation — a wide net, an adversarial
filter, and a final judge — so confirmed findings come back with the false
positives already suppressed.**

<!-- TEMPLATE {{HOW_IT_WORKS}}: 3-5 bullets naming each stage/role and its bias
     or constraint. Close with the ONE quotable metric/phrase for this skill. -->

## A Real Run

Point it at a target — a file, a component, or a diff:

```
bug sweep the checkout module, focus on security
```

**Stage 1 — Hunt.** Four lens-agents fan out and return, say, 14 raw
candidates: some real, several speculative, a couple duplicated across lenses.
Duplicates are merged by location.

**Stage 2 — Verify.** Each candidate gets its own fresh Skeptic. The "race
condition" is refuted — the Skeptic traces the code and shows the mutex already
serializes the path — and drops out. A quietly-swallowed error in the payment
retry survives: the Skeptic tries to prove it's harmless and can't.

**Stage 3 — Referee.** Survivors reach Opus. It confirms the swallowed error as
**critical** (a failed charge silently reports success) with a fix direction,
and downgrades a flagged edge case to **low**.

You get back the funnel — `14 candidates → 3 confirmed (1 critical)` — and a
severity-ranked list. Not fourteen maybes. Three real ones.

<!-- TEMPLATE {{A_REAL_RUN}}: walk the SAME stages the skill actually runs, in
     order, with a believable before/after. Show one thing that got filtered
     OUT and one that survived. End on a concrete outcome number. -->

## When To Use It

Reach for bug-hunt when thoroughness matters more than speed:

- Pre-production review of a risky diff or a new module.
- PR review where you want confirmed findings, not a wall of maybes.
- Security passes on auth flows, config parsing, concurrency, and API
  boundaries — where plausible-but-wrong findings waste the most time.

Skip it for a live incident with a known symptom — reach for a focused
debugger there. bug-hunt is for *what could go wrong*, not *what just did*.

<!-- TEMPLATE {{WHEN_TO_USE}}: 3 bullets of ideal fit + 1 explicit "skip it
     when" line pointing to the better tool. Honesty here builds trust. -->

## Try It

```
# Install
Copy skills/bug-hunt/ into .claude/skills/bug-hunt/

# Run
bug sweep [path-or-component] [optional focus: security | performance | logic]
```

Full protocol and prompt templates are in
[`skills/bug-hunt/SKILL.md`](../skills/bug-hunt/SKILL.md). The story behind it
is in [`skills/bug-hunt/STORY.md`](../skills/bug-hunt/STORY.md).

<!-- TEMPLATE {{TRY_IT}}: install block + run block + links to SKILL.md and
     STORY.md. Keep it copy-pasteable. -->

---

*bug-hunt is the first of a growing set of open skills we're releasing — each
one ships with the story of the mistake that produced it. Built by
[Garman Unified Systems](https://idirectships.com).*
