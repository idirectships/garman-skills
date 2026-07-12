# describe_pr

Generate comprehensive PR descriptions from diff, commit history, and your project PR template.

## What it does

Analyzes changes thoroughly, runs verification commands where possible, and publishes to GitHub via `gh pr edit`. Includes an "Approaches Tried" section showing the journey, not just the destination.

## Metric

*"From raw diff to published PR description in one command — runs verification checks and marks them in the description automatically."*

## Install

Copy `skills/describe_pr/` into `.claude/skills/describe_pr/`

## Setup

Create `.claude/pr_template.md` in your project with your PR description template. Generated descriptions save to `.claude/prs/{number}_description.md`.

## Usage

Triggers on: `write the PR description`, `fill out the PR body`, `describe the PR`, `update the PR`, `summarize this PR`

## Requirements

- `gh` CLI
- Project PR template at `.claude/pr_template.md`

## Files

- `SKILL.md` — 9-step workflow

## Config

PR template path: `.claude/pr_template.md` (customizable by editing the skill)

---

Built by [Garman Unified Systems](https://idirectships.com)
