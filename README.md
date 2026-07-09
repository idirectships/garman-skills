# garman-skills

Operational Claude skills from Garman Unified Systems. Each published skill ships with the skill package and its origin story so readers can see the operating lesson that produced it.

## Current Inventory

- **Published packages:** Skills present on `main` are public and installable from this repository.
- **Incoming packages:** Skills linked to open pull requests remain candidates until they merge.
- **Local custom library:** `~/.claude/skills/` is the private working library, not the public publication source.

`main` is the source of truth for published packages. Pull requests are the
review surface for incoming packages; an open branch is not a published skill.

## PR-Backed Public Skills

| Skill | Status |
|---|---|
| [`test-driven-development`](skills/test-driven-development/) | Published on `main` |
| [`bug-hunt`](https://github.com/idirectships/garman-skills/pull/2) | Scrubbed skill PR open; origin-story PR open |
| [`neutral-audit`](skills/neutral-audit/) | Published on `main` |
| [`hook-developer`](https://github.com/idirectships/garman-skills/pull/4) | Scrubbed skill PR open |
| [`mutation-testing`](https://github.com/idirectships/garman-skills/pull/5) | Scrubbed skill PR open |
| [`merge-pr-stack`](https://github.com/idirectships/garman-skills/pull/7) | Scrubbed skill PR open |
| [`workbook`](skills/workbook/) | Published on `main` |
| [`describe_pr`](https://github.com/idirectships/garman-skills/pull/9) | Scrubbed skill PR open |
| [`fix-ci`](https://github.com/idirectships/garman-skills/pull/10) | Scrubbed skill PR open |

`skeptic-panel` remains a local-library candidate. It is not part of the public
launch set until a scrubbed public branch and PR exist.

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

The first wave—`workbook`, `test-driven-development`, and `neutral-audit`—is
published with origin stories and launch posts. Remaining skills stay gated on
the same story, SEO/AEO, and independent publish review. This README reports
repository state; it does not certify an unmerged pull request.
