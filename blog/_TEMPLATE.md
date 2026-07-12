<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->
<!--
  garman-skills LAUNCH POST TEMPLATE
  ==================================
  Copy this file to blog/YYYY-MM-DD-<skill>-launch.md and fill every {{...}}.
  The exemplar this is derived from: blog/2026-07-05-bug-hunt-launch.md — read
  it before writing your first post.

  RULES (what makes a garman-skills post):
  1. Keep the six sections, in this order: Hook / The Problem / How It Works /
     A Real Run / When To Use It / Try It. Do not add or reorder sections.
  2. Voice: first-person "we built", concrete, no marketing filler. Every claim
     is a mechanism or an example, never an adjective.
  3. Each post earns exactly ONE quotable metric or phrase (bold it in How It
     Works). bug-hunt's is "3-agent triangulation".
  4. A Real Run walks the SAME stages the skill actually executes — show one
     thing filtered out and one that survived.
  5. When To Use It ends with an honest "skip it when → use <other tool>" line.
  6. Length target ~600-900 words. If a section needs more, the skill is doing
     too much — split it.

  SEO/AEO: fill the frontmatter title, meta_description (~150 chars, lead with
  the mechanism + payoff), and 5-8 representative_queries phrased the way a
  developer would actually search or ask an assistant.
-->
---
title: "{{SKILL}}: {{ONE-LINE PROMISE — mechanism + payoff}}"
meta_description: "{{~150 chars. What it does + how (the mechanism) + the payoff. Front-load keywords a developer would search.}}"
slug: {{skill-slug}}
skill: {{skill-name}}
date: {{YYYY-MM-DD}}
tags: [{{5-6 lowercase topical tags}}]
representative_queries:
  - "{{a natural-language question a developer would ask an AI assistant}}"
  - "{{a keyword-style search query}}"
  - "{{the pain, phrased as a search}}"
  - "{{the category/technique name}}"
  - "{{a 'how do I...' variant}}"
  # 5-8 total
---

# {{SKILL}}: {{ONE-LINE PROMISE}}

## Hook
{{2-3 sentences. Name the pain, then the skill's one-line mechanism in bold.
End on the payoff, not the feature.}}

## The Problem
{{Describe the failure mode the skill exists to fix. Be specific about WHY the
naive approach breaks, with concrete examples the reader recognizes.}}

## How It Works
{{3-5 bullets naming each stage/role and its bias or constraint.}}
{{Close with the ONE bold quotable metric or phrase for this skill.}}

## A Real Run
{{Walk the SAME stages the skill actually runs, in order, with a believable
before/after. Show one thing filtered OUT and one that survived. End on a
concrete outcome number.}}

## When To Use It
{{3 bullets of ideal fit.}}
{{One explicit "skip it when → use <better tool>" line.}}

## Try It
```
# Install
Copy skills/{{skill}}/ into .claude/skills/{{skill}}/

# Run
{{trigger phrase or command}}
```
{{Links to skills/{{skill}}/SKILL.md and skills/{{skill}}/STORY.md.}}

---

*{{skill}} is one of a growing set of open skills we're releasing — each ships
with the story of the mistake that produced it. Built by
[Garman Unified Systems](https://idirectships.com).*
