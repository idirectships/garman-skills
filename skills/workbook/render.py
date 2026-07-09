#!/usr/bin/env python3
# MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com
"""Render a YAML question spec into an interactive HTML workbook.

Usage:
  python3 render.py examples/example-spec.yaml
  python3 render.py myspec.yaml --output /path/to/out.html --open

Dependencies: pyyaml (pip3 install pyyaml)
"""

import argparse
import datetime
import html
import json
import pathlib
import subprocess
import sys

try:
    import yaml
except ImportError:
    print("pyyaml is required: pip3 install pyyaml", file=sys.stderr)
    sys.exit(1)

SKILL_DIR = pathlib.Path(__file__).parent
TEMPLATE_PATH = SKILL_DIR / "template" / "workbook.html.template"
JS_PATH = SKILL_DIR / "lib" / "workbook.js"


# ---------------------------------------------------------------------------
# Rendering helpers
# ---------------------------------------------------------------------------

def paragraphs(text):
    """Convert double-newline-separated text into <p> blocks."""
    parts = [p.strip() for p in str(text).split("\n\n") if p.strip()]
    return "\n".join("<p>" + html.escape(p) + "</p>" for p in parts)


def javascript_string(value):
    """Serialize a string for an inline script without allowing HTML tag breaks."""
    return (
        json.dumps(value)
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
    )


def render_pros_cons(option):
    pros = option.get("pros", [])
    cons = option.get("cons", [])
    if not pros and not cons:
        return ""
    pro_items = "".join("<li>" + html.escape(str(p)) + "</li>" for p in pros)
    con_items = "".join("<li>" + html.escape(str(c)) + "</li>" for c in cons)
    return (
        "<details><summary>Pros / Cons</summary>"
        '<div class="pros-cons">'
        '<div class="pros"><h4>Pros</h4><ul class="pros">' + pro_items + "</ul></div>"
        '<div class="cons"><h4>Cons</h4><ul class="cons">' + con_items + "</ul></div>"
        "</div></details>"
    )


def render_radio_option(idx, opt, input_name):
    recommended = opt.get("recommended", False)
    value = html.escape(str(opt.get("value", opt.get("label", ""))))
    label = html.escape(str(opt.get("label", "")))
    desc = html.escape(str(opt.get("desc", "")))
    badge = '<span class="rec-badge">Recommended</span>' if recommended else ""
    cls = 'option-item recommended' if recommended else 'option-item'
    checked = " checked" if recommended else ""
    pc = render_pros_cons(opt)
    rec_attr = ' data-recommended="1"' if recommended else ""
    return (
        '<label class="' + cls + '">'
        '<input type="radio" name="' + html.escape(input_name) + '" value="' + value + '"' + checked + rec_attr + ">"
        '<div class="option-label-wrap">'
        '<div class="option-dot"></div>'
        '<div class="option-text">'
        '<div class="option-title">' + label + badge + "</div>"
        + ('<div class="option-desc">' + desc + "</div>" if desc else "")
        + pc
        + "</div></div></label>"
    )


def render_checkbox_option(idx, opt, input_name):
    recommended = opt.get("recommended", False)
    value = html.escape(str(opt.get("value", opt.get("label", ""))))
    label = html.escape(str(opt.get("label", "")))
    desc = html.escape(str(opt.get("desc", "")))
    badge = '<span class="rec-badge">Rec</span>' if recommended else ""
    cls = 'checkbox-item recommended' if recommended else 'checkbox-item'
    checked = " checked" if recommended else ""
    pc = render_pros_cons(opt)
    return (
        '<label class="' + cls + '">'
        '<input type="checkbox" name="' + html.escape(input_name) + '" value="' + value + '"' + checked + ">"
        '<div class="check-box"></div>'
        '<div class="check-content">'
        '<div class="check-label">' + label + badge + "</div>"
        + ('<div class="check-desc">' + desc + "</div>" if desc else "")
        + pc
        + "</div></label>"
    )


def render_question(idx, q):
    """Render one question section."""
    q_id = "q" + str(idx)
    title = html.escape(str(q.get("title", "Question " + str(idx))))
    teaching = q.get("teaching", "")
    input_type = q.get("input_type", "radio")  # radio | checkbox | textarea

    if input_type == "checkbox":
        tag_cls = "q-tag multi"
        tag_text = "Multi-select"
    elif input_type == "textarea":
        tag_cls = "q-tag open"
        tag_text = "Open response"
    else:
        tag_cls = "q-tag radio"
        tag_text = "Single choice"

    teaching_html = ""
    if teaching:
        teaching_html = '<div class="teaching">' + paragraphs(teaching) + "</div>"

    svg_html = ""
    if q.get("svg"):
        caption = q.get("svg_caption", "")
        svg_html = (
            '<div class="svg-wrap">' + q["svg"] + "</div>"
            + ('<div class="svg-caption">' + html.escape(str(caption)) + "</div>" if caption else "")
        )

    options = q.get("options", [])
    options_html = ""
    if input_type == "radio":
        input_name = q_id + "_choice"
        items = "".join(render_radio_option(idx, o, input_name) for o in options)
        options_html = '<div class="options-list">' + items + "</div>"
    elif input_type == "checkbox":
        input_name = q_id + "_choice"
        items = "".join(render_checkbox_option(idx, o, input_name) for o in options)
        options_html = '<div class="checkbox-group"><div class="checkbox-grid">' + items + "</div></div>"
    elif input_type == "textarea":
        rows = q.get("rows", 6)
        placeholder = html.escape(str(q.get("placeholder", "Your answer...")))
        options_html = (
            '<textarea class="textarea-field" name="' + q_id + '_choice" rows="' + str(rows)
            + '" placeholder="' + placeholder + '"></textarea>'
        )

    askback_placeholder = html.escape(str(q.get("askback_placeholder", "Ask me a clarifying question about this...")))
    notes_placeholder = html.escape(str(q.get("notes_placeholder", "Notes, overrides, or context...")))

    return (
        '\n<section class="question" id="' + q_id + '">'
        + '\n  <div class="q-header">'
        + '\n    <div class="q-num">' + str(idx) + "</div>"
        + '\n    <div class="q-meta">'
        + '\n      <div class="q-title">' + title + "</div>"
        + '\n      <div class="' + tag_cls + '">' + tag_text + "</div>"
        + "\n    </div>"
        + "\n  </div>"
        + '\n  <div class="q-body">'
        + "\n    " + teaching_html
        + "\n    " + svg_html
        + "\n    " + options_html
        + '\n    <div class="notes-block">'
        + '\n      <label class="field-label" for="' + q_id + '_notes">Notes / overrides</label>'
        + '\n      <textarea class="textarea-field" id="' + q_id + '_notes" name="' + q_id + '_notes" rows="2" placeholder="' + notes_placeholder + '"></textarea>'
        + "\n    </div>"
        + '\n    <div class="askback-block">'
        + '\n      <label class="field-label askback-label" for="' + q_id + '_askback">Ask me a question about this <span class="ask-tag">Ask AI Back</span></label>'
        + '\n      <textarea class="textarea-field ask-back" id="' + q_id + '_askback" name="' + q_id + '_askback" rows="2" placeholder="' + askback_placeholder + '"></textarea>'
        + "\n    </div>"
        + "\n  </div>"
        + "\n</section>"
    )


def render_toc(questions):
    items = []
    for i, q in enumerate(questions):
        q_id = "q" + str(i + 1)
        title = str(q.get("title", "Question " + str(i + 1)))
        short = title if len(title) <= 36 else title[:34] + "..."
        items.append(
            '<a href="#' + q_id + '" id="toc-' + q_id + '">'
            + '<span class="q-num">Q' + str(i + 1) + "</span>"
            + html.escape(short)
            + "</a>"
        )
    return "\n  ".join(items)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(
        description="Render a YAML question spec into an interactive HTML workbook."
    )
    ap.add_argument("spec", help="Path to YAML spec file")
    ap.add_argument(
        "--output", "-o",
        help="Output HTML path (default: .workbook/<topic>-<date>.html)",
    )
    ap.add_argument(
        "--open", action="store_true",
        help="Open the rendered HTML in the default browser after writing",
    )
    args = ap.parse_args()

    spec_path = pathlib.Path(args.spec)
    if not spec_path.exists():
        print("spec not found: " + str(spec_path), file=sys.stderr)
        sys.exit(1)

    spec = yaml.safe_load(spec_path.read_text())
    template = TEMPLATE_PATH.read_text()
    js = JS_PATH.read_text()

    topic = spec.get("topic", "workbook")
    date = datetime.date.today().isoformat()
    storage_key = topic + "-" + date
    title = spec.get("title", topic.replace("-", " ").title())
    # Closed-loop routing metadata (optional spec fields; graceful defaults).
    # Lets a captured decision know which workbook/agent/project it came from
    # so the portal can route the answer back. Absent in legacy specs → defaults.
    workbook_id = str(spec.get("workbook_id", storage_key))
    origin = str(spec.get("origin", ""))
    classification = str(spec.get("classification", "INTERNAL"))
    questions = spec.get("questions", [])

    if not questions:
        print("spec has no questions", file=sys.stderr)
        sys.exit(1)

    questions_html = "\n".join(render_question(i + 1, q) for i, q in enumerate(questions))
    toc_html = render_toc(questions)

    js_rendered = js.replace("'{{STORAGE_KEY}}'", javascript_string(storage_key))

    output_html = (
        template
        .replace("{{WORKBOOK_TITLE}}", html.escape(title))
        .replace("{{STORAGE_KEY}}", storage_key)
        .replace("{{TOC_ITEMS}}", toc_html)
        .replace("{{QUESTIONS}}", questions_html)
        .replace("{{QUESTION_COUNT}}", str(len(questions)))
        .replace("{{WORKBOOK_JS}}", js_rendered)
        .replace(
            "<body>",
            '<body data-workbook-id="' + html.escape(workbook_id) + '"'
            + ' data-origin="' + html.escape(origin) + '"'
            + ' data-classification="' + html.escape(classification) + '">',
        )
    )

    if args.output:
        dest = pathlib.Path(args.output)
    else:
        dest = pathlib.Path(".workbook") / (topic + "-" + date + ".html")

    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(output_html, encoding="utf-8")
    print("wrote " + str(dest))

    if args.open:
        subprocess.run(["open", str(dest)], check=False)


if __name__ == "__main__":
    main()
