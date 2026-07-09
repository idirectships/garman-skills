---
name: neutral-audit
description: "Perform a single-stage, bias-free code observation of a specific file, directory, or component — no bug-hunting agenda. Activate when user wants to understand code: 'what does this code do', 'explain this file', 'how does this work', 'neutral audit', 'orient me to this component', or after context compaction. Use a dedicated defect-finding workflow when the goal is to find bugs."
argument-hint: "[file, directory, or component to audit]"
allowed-tools: [Read, Grep, Glob]
context: fork
agent: Explore
---
<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# Neutral Audit — Bias-Free Code Review

Reviews code without anchoring toward a positive or negative outcome. Surfaces what is actually there, not what the prompt implies should be there.

## The Problem With Biased Prompts

| Biased prompt | Agent behavior |
|---|---|
| "Find bugs in this file" | Invents bugs to satisfy the request |
| "Is this code good?" | Confirms it's good to please you |
| "Are there security issues?" | Finds security issues even if none exist |

Neutral prompts eliminate the implicit contract to deliver a particular kind of finding.

## Execution

### Step 1: Identify Scope

If not provided, ask: "Which file, directory, or component should I audit?"

### Step 2: Perform the Audit Directly

This skill already runs in an isolated `Explore` context. Use the following frame
yourself; do not create another execution layer:

```
You are performing a neutral code audit. Your job is to observe and report — not to find problems or confirm correctness.

**Target:** [TARGET]

**Instructions:**
1. Read through the code systematically, component by component
2. For each component, describe what it does and how it does it
3. Note anything that stands out — unusual patterns, complex logic, assumptions, dependencies
4. If something looks like it could be an issue, report it as an observation ("This could be a problem if X") not a finding ("This is a bug")
5. If nothing stands out, say so plainly

**Output format:**
- Component name
- What it does (2-3 sentences)
- Notable observations (if any)
- Questions raised (things worth verifying)

Do NOT:
- Hunt for bugs
- Confirm the code is good
- Perform security analysis unless you naturally encounter something
- Editorialize about code quality

Just tell me what you see.
```

### Step 3: Triage Observations

After the audit pass:
- Group observations by type: logic, performance, dependencies, assumptions, questions
- Flag anything tagged "could be a problem if X" for follow-up
- If any observations warrant deeper investigation → offer a separate,
  dedicated defect-finding pass on that component

### Step 4: Present to user

- Lead with a one-paragraph summary of what the code actually does
- List observations in order of relevance (most interesting first)
- End with: "X observations flagged for potential follow-up. Want a dedicated
  defect-finding pass on [component]?"

## Notes

- This skill is best used before a defect-finding pass, to understand the code
  before making claims about it
- Pairs well with task-contract: audit first, then define done based on what you find
- Neutral audits are also useful after compaction — re-ground the agent in what code actually does before continuing work
