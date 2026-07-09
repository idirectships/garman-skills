---
name: workbook
description: "Generate an interactive HTML question workbook when AI has 3+ decisions/questions for the user or content is better grasped visually. Auto-fires on semantic match for 'build me a workbook', 'I have questions for you', 'let me decide between', 'workbook this', 'compare these options', 'show me the tradeoffs', 'walk me through the decisions', or 'visualize this'."
type: skill
---

<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# workbook skill

Replaces inline AskUserQuestion / table-of-options for complex user-facing decisions. **The skill is SEMANTICALLY EMBEDDED — fires automatically without slash-command invocation.**

## Auto-fire triggers (the AI MUST invoke this skill when any of these hit)

1. **Question count:** AI is about to ask the user 3+ decisions / questions in one response
2. **Comparison entities:** AI is about to render 3+ side-by-side variants, options, paradigms, or choices for the user to pick
3. **Visual-better content:** Markdown response would include diagrams, matrix tables, or spatial relationships that read better in HTML
4. **User uses an activation phrase** (see description front-matter)
5. **PreToolUse hook on AskUserQuestion blocks the inline tool** — (optional: a PreToolUse hook can redirect AskUserQuestion calls to the workbook — see hook-developer skill for the pattern)

## When NOT to use

- 1-2 quick decisions — inline conversation fine
- Yes/no go-no-go — brief chat exchange
- Already inside a workbook flow (do not nest)

## Workflow

1. **Compose the question spec.** Write a YAML file with questions, options, pros/cons, recommended pre-checks. See `examples/example-spec.yaml`.
2. **Render with `render.py`.** Outputs a self-contained HTML file with localStorage capture + paste-back.
3. **Open in browser.** User fills it out, clicks Generate paste-back, pastes markdown summary to chat.
4. **Read paste-back.** AI parses user's decisions and acts on them.

## Where workbooks live

- **Project-scoped (default):** `<project-root>/.workbook/<topic>-<YYYY-MM-DD>.html`
- **Cross-project (OS-wide):** `~/.claude/workbooks/<topic>-<YYYY-MM-DD>.html`

## Spec format (YAML)

```yaml
topic: example-topic
title: "Example Decisions"  # optional, defaults to topic title-cased
questions:
  - title: "First question"
    tag: "category-chip"
    teaching: |
      One or two paragraphs explaining what this is, why it matters, what is at stake.

      Second paragraph if needed.
    input_type: radio  # radio | checkbox | textarea
    options:
      - label: "Option A — first choice"
        value: "A"  # optional, defaults to label
        recommended: true  # at most one for radio
        pros:
          - "Pro point 1"
          - "Pro point 2"
        cons:
          - "Con point 1"
      - label: "Option B — second choice"
        pros: ["..."]
        cons: ["..."]
  # ... 6+ more questions ...
  - title: "Open response"
    input_type: textarea
    rows: 8
    placeholder: "Anything else..."
```

## Mandatory features (every rendered workbook has these — non-negotiable)

- 3+ questions (rendered as-is; 7+ recommended)
- Multi-select checkboxes where options are not mutually exclusive
- Per-question ask-back textarea ("Ask me about this:")
- Per-question free-text notes textarea
- Pros/cons in collapsible `<details>` per option
- Recommended option visually distinct (amber border + badge)
- Inline SVG diagrams where they aid understanding (caller embeds raw `svg:` field in spec)
- localStorage capture on every change
- Visible decision log panel
- Generate paste-back button — markdown summary
- Copy to clipboard button
- Clear log button
- Sticky left TOC with jump links
- Sticky header with progress meter
- Warm-dark palette (`#1C1917` base, `#F59E0B` amber)
- System fonts, no CDN, no emoji, no motion
- preventDefault on all form submits
- type="button" on all bare buttons outside forms

## Reference workbooks

See `skills/workbook/examples/example-output.html` for a rendered example.

## Origin

Created to replace inline option lists and question tables with interactive HTML workbooks. Semantically embedded so it fires automatically when 3+ decisions or comparisons arise. An optional PreToolUse hook can redirect `AskUserQuestion` calls to the workbook renderer — see the hook-developer skill for the pattern.
