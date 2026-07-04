# merge-pr-stack

Cascade-merge a stack of dependent PRs in topological order — without orphaning child PRs.

## What it does

Detects the dependency graph, retargets ALL child PRs to main upfront (preventing auto-close on parent branch deletion), rebases each PR, force-with-lease pushes, then merges in strict topological order.

## Metric

*"Prevents the 3-of-7-PRs-auto-closed failure mode: by retargeting all children to main before any merge, branch deletion cannot orphan sibling PRs."*

## Install

Copy `skills/merge-pr-stack/` into `.claude/skills/merge-pr-stack/`

## Usage

Triggers on: `merge the stack`, `cascade merge`, `merge the PR stack`, `ship the stack`, `merge PR #X and its dependents`, or when 3+ stacked PRs are open

## Requirements

- `gh` CLI
- `git` with rebase support

## Files

- `SKILL.md` — 6-step SOP with cross-PR audit, retarget protocol, safeguards table, anti-patterns, cheat sheet

## Config

None required.

---

Built by [Garman Unified Systems](https://idirectships.com)
