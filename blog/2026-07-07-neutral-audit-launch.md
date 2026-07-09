<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->
---
title: "neutral-audit: understand code with an AI without the prompt inventing problems"
meta_description: "Ask an AI 'find the bugs' and it invents them; ask 'is this good?' and it flatters you. neutral-audit removes the leading question — the agent observes and reports what the code actually does, so you understand it before you judge it."
slug: neutral-audit
skill: neutral-audit
date: 2026-07-07
tags: [code-comprehension, ai-code-review, prompt-bias, code-explanation, onboarding, claude-skills]
representative_queries:
  - "how do I get an AI to explain what code does without hallucinating bugs"
  - "why does AI code review invent problems that aren't there"
  - "understand a file or component before reviewing it"
  - "unbiased AI code audit"
  - "explain this code neutrally"
  - "how to onboard to a codebase with an AI assistant"
  - "re-ground an AI on what code does after context compaction"
  - "AI keeps finding fake bugs when I ask it to review code"
---

# neutral-audit: understand code with an AI without the prompt inventing problems

## Hook

Ask an agent "find the bugs in this file" and it finds bugs — even in clean code
— because "no bugs" reads as failing to deliver. The question decides the answer
before it reads a line. **neutral-audit removes the leading question: the agent
observes and reports what the code actually does, with no agenda to find fault or
confirm quality.** Understand it first; judge it later.

## The Problem

Every review prompt carries an implicit contract about what a good answer looks
like. "Find the bugs" contracts for bugs. "Is this secure?" contracts for
vulnerabilities. "Is this well written?" contracts for praise. Run the same
boring, correct file through all three and you get three different verdicts — the
code didn't change, the phrasing did.

An agent asked to find problems treats an empty result as a failure, so it
manufactures a plausible concern to satisfy the shape of the request. Now you're
disproving a problem that your own prompt authored. This is upstream of most bad
AI code review: a lot of the noise isn't found in the code, it's created at the
prompt by asking a leading question of a model that reads leading questions as
instructions.

## How It Works

neutral-audit strips the lens off the request:

- **One neutral instruction.** The agent is told to observe and report — not to
  find problems, not to confirm correctness. It reads the target component by
  component.
- **Describe, don't editorialize.** For each part: what it does, how it does it,
  and anything that genuinely stands out — dependencies, assumptions, unusual
  patterns.
- **Observations, not findings.** If something could be an issue, it's reported
  as "this could break if X," never "this is a bug." The difference keeps
  speculation honest.
- **"Nothing stands out" is a valid answer.** There's no quota to fill and no
  premise to satisfy, so a clean file is allowed to come back clean.

The quotable version: **a neutral prompt has no contract to fulfill — so you get
what the code *is*, not what the question implied it should be.**

## A Real Run

You point it at a payments module you've never seen:

**Scope.** You name the target — `src/payments/`.

**Observe.** The agent walks it file by file and reports plainly: "`charge.ts`
builds a request and posts it to the provider; retries are handled by the caller,
not here. `webhook.ts` verifies a signature before parsing — signature check runs
first. `refund.ts` assumes the original charge exists; it does not re-validate."

**Triage.** Nothing is dressed up as a bug. But two observations are flagged for
follow-up: the refund assumption, and a config value read without a default. The
audit ends with: "2 observations flagged. Want a dedicated defect-finding pass
on `refund.ts`?"

You now *understand the module* — and you have a precise, honest starting point
for a real investigation, instead of a pile of invented concerns to clear first.

## When To Use It

Reach for neutral-audit when comprehension comes before judgment:

- Orienting to an unfamiliar file, directory, or component before you change it.
- The step *before* a defect-finding pass — observe the code cold, then decide
  whether it's worth the adversarial pass.
- Re-grounding after a long session or context compaction, when the agent needs
  to re-learn what the code actually does before continuing.

Skip it when you already have a specific symptom to chase — reach for a focused
an adversarial defect finder. And when you *want* a hunt for real bugs, use that
dedicated workflow; neutral-audit is the map, not the sweep.

## Try It

```
# Install
Copy skills/neutral-audit/ into .claude/skills/neutral-audit/

# Run
neutral audit [file, directory, or component]
```

The full agent prompt and triage flow are in
[`skills/neutral-audit/SKILL.md`](../skills/neutral-audit/SKILL.md). The story
behind it is in
[`skills/neutral-audit/STORY.md`](../skills/neutral-audit/STORY.md).

---

*neutral-audit is one of a growing set of open skills we're releasing — each
ships with the story of the mistake that produced it. Built by
[Garman Unified Systems](https://idirectships.com).*
