---
name: fix-ci
description: "Check GitHub Actions status and fix CI failures (lint, type errors, test failures, build errors). Triggers on: 'CI is failing', 'build is broken', 'tests failed in CI', 'GitHub Actions is red', 'checks are failing'. Scope: GitHub Actions only — not local or data pipelines."
---

<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

## Current CI State (pre-loaded)
- Recent runs: !`gh run list --limit 5 --json status,conclusion,headBranch,databaseId,displayTitle 2>/dev/null || echo "No runs found"`
- Recent runs (match against HEAD): !`gh run list --limit 5 --json status,conclusion,databaseId,headSha,displayTitle 2>/dev/null || echo "No runs"`
- Current branch: !`git branch --show-current 2>/dev/null`
- Last failed run: !`gh run list --limit 1 --status failure --json databaseId,displayTitle,headBranch 2>/dev/null || echo "No failures"`
  (To see its log: `gh run view <databaseId> --log-failed 2>/dev/null | tail -30` — both `gh` and `tail` are allowlisted, so this works even when the Bash classifier is degraded. Avoid `xargs`/`$(...)`.)

# Fix CI

Debug and fix CI failures. This skill checks GitHub Actions status and spawns debug agents to fix issues.

## When to Use

- After pushing commits and CI fails
- When you want to check CI status proactively
- To investigate why a workflow failed

## Process

### 1. Check CI Status

```bash
# Get recent workflow runs
gh run list --limit 5 --json status,conclusion,headBranch,databaseId,displayTitle

# Check specific commit
gh run list --commit $(git rev-parse HEAD) --json status,conclusion,databaseId
```

### 2. If Failures Found

Get the failure logs:

```bash
# Get run ID from the list above, then:
gh run view <run_id> --log-failed
```

### 3. Analyze and Fix

Based on the failure logs:

1. **Lint/Type errors**: Run locally, fix, push
   ```bash
   pnpm lint --fix
   pnpm typecheck
   ```

2. **Test failures**: Run tests locally, debug
   ```bash
   pnpm test
   # or
   pytest -v
   ```

3. **Build failures**: Check dependencies, configs
   ```bash
   pnpm build
   ```

4. **Unknown**: Spawn debug agent for deep investigation

### 4. Verify Fix

After pushing the fix:

```bash
# Watch the new run
gh run watch
```

## Quick Commands

| Command | Purpose |
|---------|---------|
| `gh run list` | List recent workflow runs |
| `gh run view <id>` | View run details |
| `gh run view <id> --log-failed` | Get failure logs |
| `gh run watch` | Watch running workflow |
| `gh run rerun <id>` | Re-run a workflow |

## Common CI Failures

| Pattern | Likely Cause | Fix |
|---------|--------------|-----|
| `tsc error` | Type error | Run `pnpm typecheck`, fix types |
| `ESLint` | Lint violation | Run `pnpm lint --fix` |
| `ENOENT` | Missing file | Check paths, git add |
| `Module not found` | Missing dependency | Run `pnpm install` |
| `pytest` | Test failure | Run tests locally, debug |
| `Permission denied` | File permissions | Check chmod, file paths |

## Example Session

```
User: fix ci

Claude: Let me check your CI status.

[Runs gh run list]

Found 1 failure on main:
- Run #1234: Build failed (2 minutes ago)

Getting failure logs...

[Runs gh run view 1234 --log-failed]

The build failed due to a TypeScript error in src/utils.ts:
  error TS2345: Argument of type 'string' is not assignable...

Let me fix that type error.

[Edits file, commits, pushes]

Watching new CI run...

[Runs gh run watch]

CI passed! The fix was successful.
```
