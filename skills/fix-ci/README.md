# fix-ci

On-demand GitHub Actions CI diagnosis — from `fix ci` to green in one command.

## What it does

Checks recent GitHub Actions runs, fetches failure logs, diagnoses common failure patterns (TypeScript errors, lint violations, missing modules, permission errors), and either fixes locally or spawns a debug agent for deep investigation.

## Metric

*"From `fix ci` to green in one command — pre-loads recent run state and failure logs automatically."*

## Install

Copy `skills/fix-ci/` into `.claude/skills/fix-ci/`

## Usage

Triggers on: `CI is failing`, `build is broken`, `tests failed in CI`, `GitHub Actions is red`, `checks are failing`

## Requirements

- `gh` CLI installed and authenticated (`gh auth status`)

## Files

- `SKILL.md` — complete workflow with quick command table and failure pattern guide

## Config

None required.

---

Built by [Garman Unified Systems](https://idirectships.com)
