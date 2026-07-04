# hook-developer

Complete reference for all Claude Code hook types — schemas, templates, and debugging.

## What it does

A single-file reference for every Claude Code hook type: PreToolUse, PostToolUse, UserPromptSubmit, PermissionRequest, SessionStart, SessionEnd, Stop, SubagentStop, PreCompact, and Notification.

Covers exact input/output schemas, exit code behavior, TypeScript and Python templates, registration patterns, and a debugging checklist.

## Metric

*"A single-file reference for every hook schema — no more trial-and-error debugging malformed JSON output."*

## Install

Copy `skills/hook-developer/` into `.claude/skills/hook-developer/`

## Usage

Triggers on: `write a hook`, `create a hook`, `how do I block a tool call`, `inject context into a prompt`, `hook input/output format`

## Files

- `SKILL.md` — complete reference with templates and testing commands

## Config

No config required. All patterns use standard `$CLAUDE_PROJECT_DIR` and `$HOME/.claude/hooks`

## Key patterns included

- Block dangerous files (PreToolUse)
- Auto-format on write (PostToolUse)
- Inject git context (UserPromptSubmit)
- Force test verification on stop (Stop)

---

Built by [Garman Unified Systems](https://idirectships.com)
