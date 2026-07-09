<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->
---
title: "workbook: turn a wall of AI questions into one interactive decision sheet"
meta_description: "workbook renders the AI's 3+ questions as one self-contained HTML decision sheet — teaching, pros/cons, a recommended pick, and paste-back capture — so complex choices get made once and don't get lost in the chat log."
slug: workbook
skill: workbook
date: 2026-07-07
tags: [ai-decision-making, human-in-the-loop, interactive-html, agent-ux, decision-capture, claude-skills]
representative_queries:
  - "how do I get an AI to ask me several questions without a wall of text"
  - "interactive decision sheet instead of a chat list of options"
  - "capture decisions from an AI planning session so they don't get lost"
  - "human-in-the-loop UI for AI agent questions"
  - "how do I compare options and tradeoffs the AI gives me"
  - "AskUserQuestion alternative for many decisions"
  - "AI keeps dumping too many questions in one message"
  - "make AI planning decisions durable and reviewable"
---

# workbook: turn a wall of AI questions into one interactive decision sheet

## Hook

Ask an AI to plan something real and it hands back seven questions, each with
three options and their tradeoffs, stacked into one unreadable message — and
whatever you decide vanishes into the chat log the moment you reply. **workbook
renders those questions as a single self-contained HTML decision sheet with a
recommended pick, per-question notes, and one-click paste-back capture.** You
decide at your own pace, and the decision becomes a durable file.

## The Problem

Good agents surface tradeoffs — that's the job. But a chat window is the wrong
container for a set of parallel decisions. When nine choices arrive as prose,
you're forced to hold all of them in your head while you read, and by the time
you reach the last option you've lost the first. The medium makes the decision
harder than the decision is.

Then it gets worse: your answer — "A, then B, skip the third, Postgres for the
store" — becomes the *only* record of what you decided. It sits in the middle of
a conversation that will be compacted, cleared, or scrolled past. Ask again next
week and there's no artifact to point to, no note on *why*. The reasoning was
done and thrown away. Inline question tools (AskUserQuestion, option lists) make
both problems worse the more decisions there are.

## How It Works

workbook converts a question-set into one instrument you fill out:

- **A YAML spec, not a chat dump.** The AI composes questions, options, per-option
  pros/cons, teaching, and a recommended pick as structured data — so nothing is
  improvised into a paragraph.
- **A self-contained HTML render.** `render.py` emits one file: no CDN, no
  network, system fonts, a warm-dark palette. Sticky table-of-contents, a
  progress meter, collapsible pros/cons, and the recommended option marked in
  amber.
- **Capture built in.** Every change is saved to `localStorage`; each question
  has its own notes field and an "ask me about this" field; a visible decision
  log tracks what you've chosen.
- **One-click paste-back.** A button generates a clean markdown summary you paste
  to the chat. The AI reads your decisions and acts.

The quotable version: **one self-contained decision sheet — every question,
tradeoff, and note captured locally and handed back as a single paste.**

## A Real Run

You ask the AI to plan a database migration. It has eight decisions to put to
you. Instead of a wall of text:

**Compose.** The AI writes a spec — eight questions: cutover strategy, rollback
plan, dual-write window, index rebuild order, and so on. Each option carries
pros/cons; "blue-green cutover" is marked recommended.

**Render.** `render.py` turns the spec into
`.workbook/db-migration-2026-07-07.html`. You open it in a browser. The left rail
lists all eight questions; the progress meter reads 0/8.

**Decide.** You work down the sheet at your own pace, expanding pros/cons where
you're unsure. You pick blue-green, set a 24-hour dual-write window, and in the
notes field on rollback you type "must be reversible without data loss —
confirm." Progress meter climbs to 8/8.

**Hand back.** One click generates the markdown summary. You paste it. The AI now
has all eight decisions *plus* your rollback constraint — and the HTML file stays
in the repo, dated, as the record of what was decided and why.

Eight decisions made once, in five minutes, and still findable next month.

## When To Use It

Reach for workbook when the choices outnumber what a chat can hold:

- Planning sessions with 3+ real decisions — migrations, architecture, launches,
  scope calls.
- Any moment you're about to render option lists or side-by-side variants for a
  human to pick from.
- Decisions that need to *survive* — where "where did we decide that?" will be
  asked later.

Skip it for a single yes/no or one quick pick — a plain chat exchange is faster;
don't render a form for a one-line answer.

## Try It

```
# Install
Copy skills/workbook/ into .claude/skills/workbook/

# Run
build me a workbook for [decision set]
# or just ask a question with 3+ decisions — it fires on its own
```

Full spec format and render options are in
[`skills/workbook/SKILL.md`](../skills/workbook/SKILL.md). The story behind it is
in [`skills/workbook/STORY.md`](../skills/workbook/STORY.md).

---

*workbook is one of a growing set of open skills we're releasing — each ships
with the story of the mistake that produced it. Built by
[Garman Unified Systems](https://idirectships.com).*
