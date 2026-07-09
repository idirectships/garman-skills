# workbook.html.template

Canonical HTML scaffold for interactive question workbooks.

## Placeholders

| Placeholder | Filled by | Content |
|---|---|---|
| `{{WORKBOOK_TITLE}}` | render.py | HTML-escaped title from spec |
| `{{STORAGE_KEY}}` | render.py | `<topic>-<YYYY-MM-DD>` for localStorage |
| `{{TOC_ITEMS}}` | render.py | `<a>` tags for left TOC |
| `{{QUESTIONS}}` | render.py | Rendered `<section>` blocks |
| `{{QUESTION_COUNT}}` | render.py | Integer count for progress meter |
| `{{WORKBOOK_JS}}` | render.py | Contents of lib/workbook.js |

## Do not edit placeholders manually

Run `render.py <spec.yaml>` to produce a complete workbook. The template
is project-agnostic; all content comes from the YAML spec.

## Features already wired in template

- Sticky header with amber progress meter
- Left sidebar TOC with active-link and done-state
- localStorage capture on every radio/checkbox/textarea change
- Decision log panel (last 12 entries)
- Generate paste-back + copy to clipboard
- Clear log
- Form submit interception (no backend navigation)
- IntersectionObserver TOC highlight
- Warm-dark palette (#1C1917 base, #F59E0B amber)
- System fonts, no CDN, no emoji
