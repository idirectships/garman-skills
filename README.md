# garman-skills

Operational Claude skills from Garman Unified Systems. Each published skill ships with the skill package and its origin story so readers can see the operating lesson that produced it.

## Current Inventory

- **Local custom library:** 88 top-level custom skills in `~/.claude/skills/`, excluding archived, draft, and system folders.
- **Public publishing cascade:** 9 open scrubbed skill PRs, plus 1 open origin-story/content PR.
- **Public-bound launch set:** 10 skills selected for publication when the `skeptic-panel` repo-state discrepancy is resolved.

`main` is intentionally sparse while the scrubbed cascade is reviewed. The current checkout's `origin/main` contains only repo scaffolding; the open skill PRs are the source of truth for the incoming public packages.

## Public-Bound Skills

| Skill | Status |
|---|---|
| [`test-driven-development`](https://github.com/idirectships/garman-skills/pull/1) | Scrubbed skill PR open |
| [`bug-hunt`](https://github.com/idirectships/garman-skills/pull/2) | Scrubbed skill PR open; origin-story PR open |
| [`neutral-audit`](https://github.com/idirectships/garman-skills/pull/3) | Scrubbed skill PR open |
| [`hook-developer`](https://github.com/idirectships/garman-skills/pull/4) | Scrubbed skill PR open |
| [`mutation-testing`](https://github.com/idirectships/garman-skills/pull/5) | Scrubbed skill PR open |
| [`merge-pr-stack`](https://github.com/idirectships/garman-skills/pull/7) | Scrubbed skill PR open |
| [`workbook`](https://github.com/idirectships/garman-skills/pull/8) | Scrubbed skill PR open |
| [`describe_pr`](https://github.com/idirectships/garman-skills/pull/9) | Scrubbed skill PR open |
| [`fix-ci`](https://github.com/idirectships/garman-skills/pull/10) | Scrubbed skill PR open |
| `skeptic-panel` | Public-bound skill in the local library; not present on this checkout's `origin/main` yet |

## What Makes These Different

Most public Claude skill collections are prompt libraries: useful reminders, reusable personas, or generic workflows. These skills are closer to operating procedures with mechanical rails.

- **They encode triggers, not just advice.** Skills such as `workbook`, `fix-ci`, and `describe_pr` define activation phrases, preloaded context, required inputs, and stop conditions so the agent knows when to invoke the workflow.
- **They produce local artifacts.** `workbook` renders a YAML spec into a self-contained HTML decision workbook with localStorage capture, progress tracking, and paste-back output instead of leaving multi-question decisions in chat.
- **They use adversarial multi-pass review.** `bug-hunt` separates Hunter, Skeptic, and Referee roles into fresh contexts so findings are over-generated, aggressively disproved, and then arbitrated before being shown as confirmed.
- **They account for LLM bias directly.** `neutral-audit` is designed to observe code without anchoring the agent toward "find bugs" or "confirm this is good," reducing sycophancy-driven false positives.
- **They enforce evidence before claims.** `test-driven-development` encodes the Iron Law: no production code without a failing test first. `mutation-testing` goes further by testing whether tests actually falsify the code's correctness claims.
- **They target high-leverage failure modes.** `mutation-testing` prioritizes falsifier code and requires slow integration tests to be split from fast unit tests before mutation runs. `merge-pr-stack` encodes the retarget-all-children-first invariant learned from branch-deletion auto-closing stacked PRs.
- **They integrate with real developer surfaces.** `hook-developer` documents Claude hook schemas, blocking outputs, manual hook tests, wrapper patterns, and common implementation traps. `fix-ci`, `describe_pr`, and `merge-pr-stack` integrate with `gh`, GitHub Actions, PR templates, branch graphs, and verification checklists.
- **They ship with stories.** The GUS:Skills publishing model pairs each public skill with an origin story and launch content so the skill is not only reusable, but also legible as proof of an operating system.

## Publishing Status

The scrubbed skill PRs are awaiting story/SEO/AEO completion and Director publish approval before merge or public launch. This README documents the cascade; it does not publish, merge, or certify any PR.
