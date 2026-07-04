---
name: merge-pr-stack
description: "Cascade-merge a stack of dependent PRs in topological order: detect stack, retarget ALL children to main upfront (preventing auto-close on parent branch deletion), rebase, force-with-lease push, then merge each in order. Activate when user says 'merge the stack', 'cascade merge', 'merge the PR stack', 'ship the stack', 'merge PR #X and its dependents', or when 3+ stacked PRs are open and user says 'merge them'."
---
<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

## Pre-loaded Stack Context
- Open PRs (number, title, base, head): !`gh pr list --state open --json number,title,baseRefName,headRefName,mergeable,statusCheckRollup --jq '.[] | "\(.number)\t\(.headRefName) → \(.baseRefName)\t[\(.mergeable)]\t\(.title)"' 2>/dev/null | head -20`
- Current branch: !`git branch --show-current`
- Remote main: !`git remote show origin 2>/dev/null | grep "HEAD branch" | grep -oE '[^ ]+$'`
- Local worktrees: !`git worktree list 2>/dev/null`

# Cascade-Merge a Dependent PR Stack

A "stack" is when PR B's `baseRefName` points at PR A's branch (not main/master). The cascade merges parent → child(ren) in strict topological order.

**Core invariant (encoded 2026-05-18 after a 7-PR cascade lost 3 children to auto-close):** retarget ALL non-root PRs to `main` BEFORE merging anything. Every non-leaf PR in a stack is effectively a "root" relative to its own children — deleting its branch on merge will orphan its children. Decouple first, merge second.

---

## Step 1 — Detect the Stack

```bash
# List all open PRs with their base branches
gh pr list --state open --json number,title,baseRefName,headRefName,mergeable \
  --jq '.[] | {number, title, base: .baseRefName, head: .headRefName, mergeable}'
```

Identify "stacked" PRs: any PR whose `baseRefName` is NOT main/master/trunk.

**Build the dependency graph:**
```
For each PR P:
  parent(P) = the PR whose headRefName == P.baseRefName
  root PRs = those with baseRefName == main
```

Sort topologically: roots first, leaves last. Example:
```
PR #9  (feat/foundation    → main)              ← merge first
PR #11 (feat/split         → feat/foundation)   ← merge second
PR #10 (feat/config-patch  → feat/split)        ← merge third
```

---

## Step 2 — Pre-flight Every PR

For each PR in topological order, verify before touching anything:

```bash
gh pr view <N> --json state,mergeable,statusCheckRollup \
  --jq '{state, mergeable, checks: [.statusCheckRollup[]? | "\(.name): \(.conclusion)"]}'
```

**STOP conditions:**
- `state != "OPEN"` — PR already merged or closed, rebuild the graph
- `mergeable == "CONFLICTING"` — resolve conflicts before proceeding
- Any required CI check is `FAILURE` — fix CI first
- `mergeable == "UNKNOWN"` — wait 30s and re-check; GitHub is still computing

Do not proceed past pre-flight with any STOP condition unresolved.

---

## Step 3 — Cross-PR Dry-Run Audit

Before any merge, check whether child PR diffs reference paths or configs introduced by sibling PRs:

```bash
# Get all diffs in one pass
for pr_num in <ordered list>; do
  gh pr diff $pr_num > /tmp/pr-${pr_num}.diff
done

# Cross-reference: does PR #11 add a path that PR #10's diff touches?
grep -h "^+" /tmp/pr-11.diff | grep -oP '(?<=\+\+\+ b/).*' | while read path; do
  grep -l "$path" /tmp/pr-10.diff && echo "CROSS-REF: PR #10 references $path from PR #11"
done
```

If cross-references exist, plan a fix commit for the child PR (see Step 5c). Note them now, apply them before that child's merge.

---

## Step 4 — Retarget ALL Children to `main` (full pass, before any merge)

**This is the most important step.** Skipping it causes children to auto-close when their parent's branch is deleted mid-cascade. (See: "Failure mode: branch-deletion auto-close" section at the end of this document.)

```bash
# Retarget every non-root PR's base to main
for child_pr in <every PR in the stack whose base is NOT main>; do
  gh pr edit $child_pr --base main
done
```

**Verify:**
```bash
for pr in <ALL PRs in stack>; do
  gh pr view $pr --json baseRefName --jq '"#\(.number) base=\(.baseRefName)"'
done
```
Every line must read `base=main`. Do not advance to Step 5 until this holds.

After this step, no PR depends on another's branch. Each PR's head still contains its original cumulative content (parent + own commits), which the rebase in Step 5b will untangle against the new `main` content.

---

## Step 5 — Merge in topological order

Now every PR is independent at the GitHub level. Process them parent-first so each child's rebase sees its parent's content already in `origin/main`.

For each PR (root first, then each child in topological order):

### 5a — Pre-merge sanity
```bash
gh pr view <N> --json mergeable
# must be MERGEABLE (re-check if UNKNOWN — Step 4's retarget triggers a GitHub recompute)
```

### 5b — Rebase head onto fresh `main`
```bash
git fetch origin
git checkout <head_branch_of_N>
git rebase origin/main
```

Expect many "becoming empty" commits when a child's head still contains parent commits that are now squash-merged into `main`. Use:
```bash
git rebase --skip            # for each empty commit, OR
git rebase --empty=drop origin/main   # modern git, drops them in one pass
```

**Fallback if rebase fights you (10+ conflict rounds OR ambiguous merges):**
```bash
git rebase --abort
git log --oneline <fork_point>..<head_branch>   # commits unique to this PR
git checkout -B <head_branch>-cascade origin/main
git cherry-pick <only the PR's own commits>     # skip parent carry-overs
git push --force-with-lease origin <head_branch>-cascade:<head_branch>
```

### 5c — Apply cross-PR fix commit (if Step 3 flagged a reference)
```bash
# edit the cross-referenced file
git add <file>
git commit -m "fix: update <path> reference after merging <sibling-PR-title>"
```

### 5d — Push rebased branch
```bash
git push --force-with-lease origin <head_branch>
```

### 5e — Verify CI (if configured)
```bash
gh pr checks <N>
```
Do not merge until required checks pass.

### 5f — Merge with `--delete-branch` (now safe — no sibling depends on this branch)
```bash
gh pr merge <N> --squash --delete-branch
```

### 5g — Verify landed before advancing
```bash
git fetch origin
git log origin/main --oneline -3
```
Confirm the squash commit is on `main` before moving to the next PR.

---

## Step 6 — Cleanup

After all PRs in the stack are merged:

```bash
git checkout main
git pull origin main

# Remove any lingering worktrees used for parallel work
git worktree list
git worktree remove <path>   # for each stale worktree

# Delete merged local branches
git branch --merged main | grep -v "^\*\|main\|master" | xargs git branch -d

# Prune remote tracking refs
git fetch --prune

# Verify clean state
git branch -vv
```

---

## Safeguards (non-negotiable)

| Rule | Why |
|------|-----|
| **Step 4 always runs to completion before any Step 5 merge** | Prevents children from being auto-closed when a parent branch is deleted |
| `--force-with-lease` only, never `--force` | Lease fails if remote moved since last fetch — prevents clobbering someone else's push |
| Never `--no-verify` | Hooks exist for a reason; skip = skip the safety net |
| Never skip required CI checks | A red check on main is worse than a delayed merge |
| Never `--admin` override | Override bypasses required reviews + status checks |
| Squash-merge each PR separately | Preserves bisect-ability; one squash per feature, not one mega-commit |
| Pre-flight every PR (Step 2) before Step 4 retarget | Avoid retargeting a PR that turns out to be already-merged or conflicting |
| ABORT on ambiguous conflict resolution during rebase | Cherry-pick fallback (Step 5b) is safer than improvised conflict resolution |

---

## Anti-Patterns

**Per-child retarget (the 2026-05-18 failure mode):**
```bash
# WRONG: retarget then immediately merge — sibling N+1 still depends on N's branch
gh pr edit #3 --base main
gh pr merge #3 --squash --delete-branch    # #3's branch deleted
# #4 had baseRefName = #3's-head-branch — now ORPHANED + auto-closed by GitHub
```
Result: #4 closes without merging; content is preserved on the head branch but the PR is dead. Recovery requires opening a replacement PR via cherry-pick.
Fix: Step 4's full retarget pass runs upfront, decoupling all PRs before any merge.

**Merge child before parent:**
```bash
# WRONG: merge child of #9 first
gh pr merge #11    # #11's base is feat/foundation (#9's head) — merges into a feature branch, not main
```
Result: #11's changes land on the wrong base.

**Rebase without fetching first:**
```bash
git rebase origin/main   # without git fetch — rebases onto stale main
git push --force-with-lease   # pushes onto stale remote
```
Result: next PR's rebase conflicts with changes you didn't know existed.

**Skip cross-PR audit (Step 3):**
If PR #10 uses a `tests_dir` constant that PR #11 defines, merging #10 before applying the fix commit produces a broken build on main.

---

## One-Glance Cheat Sheet

```
1. gh pr list → identify stack → build dependency graph
2. Pre-flight each PR: state=OPEN, mergeable=MERGEABLE, CI green
3. Cross-PR audit: scan for path references across diffs
4. RETARGET ALL CHILDREN TO main UPFRONT (full pass, before any merge) ← critical
5. For each PR in topological order:
   a. gh pr view --json mergeable (re-check)
   b. git fetch + git rebase origin/main (or cherry-pick fallback)
   c. apply cross-PR fix commit if needed
   d. git push --force-with-lease
   e. gh pr checks (wait for green)
   f. gh pr merge --squash --delete-branch
   g. git fetch + verify squash landed on main
6. Cleanup: worktrees, local branches, git fetch --prune
```

---

## Failure mode: branch-deletion auto-close (2026-05-18)

In a 7-PR cascade, Steps 4 and 5 were interleaved (retarget-then-merge-then-next-retarget rather than retarget-all-first). When the root PR was merged and its branch deleted, GitHub auto-closed 3 child PRs whose `baseRefName` still pointed to that branch. Recovery required opening replacement PRs via cherry-pick.

The Step 4 full-retarget-pass (retarget ALL children before ANY merge) is the prevention. It is non-negotiable.
