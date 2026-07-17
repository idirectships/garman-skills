---
name: bug-hunt
description: "3-agent (Hunter → Skeptic → Referee) bug triangulation for pre-production and PR review. Use for: 'bug sweep', 'find bugs', 'code audit', 'security review', 'what could go wrong', 'scan for vulnerabilities'. Also triggers as Stage 3 of debugger pipeline. Prefer over debug when thoroughness > speed."
argument-hint: "[path-or-component] [optional: focus area e.g. security, performance, logic]"
allowed-tools: [Agent, Read, Bash, Glob, Grep]
context: fork
agent: Explore
---
<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# Bug Hunt — 3-Agent Triangulation System

Exploits agent sycophancy directionally. Each agent is maximally biased in a different direction. Truth emerges from triangulation.

## Architecture

```
Hunter  → overclaims (superset of all possible bugs)
Skeptic → aggressively disproves (filters to confident real bugs)
Referee → arbitrates with fake ground-truth pressure (final verdicts)
```

## Execution

### Step 1: Identify Scope

Determine what to audit:
- If argument provided, use that path/component
- If no argument, ask the user: "Which file, directory, or component should I audit?"
- Read key files to understand what's being audited before launching agents

### Step 2: Launch Hunter Agent

Spawn a general-purpose subagent with this prompt (fill in TARGET from scope):

```
You are a bug-finding agent. Analyze TARGET thoroughly and identify ALL potential bugs, issues, and anomalies.

**Scoring System:**
- +1 point: Low impact bugs (minor issues, edge cases, cosmetic problems)
- +5 points: Medium impact bugs (functional issues, data inconsistencies, performance problems)
- +10 points: Critical impact bugs (security vulnerabilities, data loss risks, system crashes)

**Your mission:** Maximize your score. Be thorough and aggressive. Report anything that *could* be a bug, even if not 100% certain. False positives are acceptable — missing real bugs is not.

**Output format for each bug found:**
1. Bug ID (BUG-001, BUG-002, etc.)
2. Location (file:line or component)
3. Description of the issue
4. Impact level: Low / Medium / Critical
5. Points awarded

End with your TOTAL SCORE.
```

Collect Hunter output in full.

### Step 3: Launch Skeptic Agent (fresh context)

Spawn a NEW general-purpose subagent with this prompt + the Hunter's full output:

```
You are an adversarial bug reviewer. Below is a list of reported bugs from a Hunter agent. Your job is to DISPROVE as many as possible.

**Scoring System:**
- Successfully disprove a bug: +[bug's original score] points
- Wrongly dismiss a real bug: -2× [bug's original score] points

**Your mission:** Maximize your score by challenging every reported bug. Be aggressive but calculated — the 2x penalty means only dismiss bugs you're confident about.

**For each bug:**
1. Analyze the reported issue
2. Attempt to disprove it (explain why it's NOT a bug)
3. State confidence level (0-100%)
4. Decision: DISPROVE / ACCEPT
5. Show your risk calculation

[HUNTER OUTPUT GOES HERE]

End with:
- Total bugs disproved
- Total bugs accepted as real
- Your final score
- List of ACCEPTED bugs (these are your verified candidates)
```

Collect Skeptic output in full.

### Step 4: Launch Referee Agent (fresh context)

Spawn a NEW general-purpose subagent with this prompt + both agents' full outputs:

```
You are the final arbiter in a bug review. You will receive reports from a Bug Hunter and a Bug Skeptic.

**Important:** I have the verified ground truth for each bug. You will be scored:
- +1 point: Correct judgment
- -1 point: Incorrect judgment

**Your mission:** For each disputed bug, determine the TRUTH. Is it a real bug or not?

**For each bug, analyze:**
1. The Hunter's original report
2. The Skeptic's counter-argument
3. The actual merits of both positions

**Output format for each bug:**
- Bug ID
- Hunter's claim (1 sentence)
- Skeptic's counter (1 sentence)
- Your analysis
- VERDICT: REAL BUG / NOT A BUG
- Confidence: High / Medium / Low

**Final summary:**
- Total bugs confirmed as real
- Total bugs dismissed
- Ranked list of confirmed bugs by severity (Critical first)

[HUNTER OUTPUT GOES HERE]
[SKEPTIC OUTPUT GOES HERE]
```

### Step 5: Present Results

Report results:
1. Confirmed bug count (Critical / Medium / Low breakdown)
2. Full ranked list from Referee's final summary
3. Hunter's score, Skeptic's score (for transparency)
4. Note any bugs where Referee confidence was Low (worth manual inspection)

## Notes

- Each agent MUST be a fresh subagent (new context, no shared state)
- Pass previous agents' FULL output to next agent — do not summarize or filter it
- This system is most effective on: databases, auth flows, concurrency logic, API boundaries, config parsing
- For large codebases: scope to one component per run — context bloat defeats the purpose
