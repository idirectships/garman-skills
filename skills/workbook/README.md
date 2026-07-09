# workbook

Render a YAML question spec into an interactive HTML workbook — decisions captured, paste-back ready.

## What it does

Generates a self-contained interactive HTML workbook with localStorage capture, a decision log, pros/cons per option, and a Generate paste-back button. Replaces inline option lists when 3+ decisions or comparisons arise.

## Metric

*"From YAML spec to interactive HTML workbook in one command. Fill it out in the browser; paste-back returns structured decisions to Claude."*

## Install

Copy `skills/workbook/` into `.claude/skills/workbook/`

## Usage

Auto-fires semantically when 3+ decisions arise. Also triggers on: `build me a workbook`, `workbook this`, `compare these options`, `show me the tradeoffs`

## Requirements

- Python 3
- `pyyaml` (`pip install pyyaml`)

## Render a workbook

```bash
python3 skills/workbook/render.py myspec.yaml --open
```

## Files

- `SKILL.md` — skill definition and workflow
- `render.py` — CLI renderer
- `lib/workbook.js` — form state + paste-back logic
- `template/workbook.html.template` — HTML template
- `examples/example-spec.yaml` — example YAML spec
- `examples/example-output.html` — rendered example

## Spec format

YAML with `topic`, `title`, and `questions[]` (radio/checkbox/textarea, pros/cons, recommended flag)

---

Built by [Garman Unified Systems](https://idirectships.com)
