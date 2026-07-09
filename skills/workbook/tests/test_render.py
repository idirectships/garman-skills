from __future__ import annotations

import datetime
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest


RENDERER = Path(__file__).resolve().parents[1] / "render.py"


@pytest.mark.parametrize(
    "topic",
    [
        "director's\\decisions\nnext",
        "</script><script>globalThis.workbookInjected=true</script>",
    ],
)
def test_adversarial_topic_is_safe_in_self_contained_workbook(tmp_path: Path, topic: str) -> None:
    spec_path = tmp_path / "spec.json"
    output_path = tmp_path / "workbook.html"
    spec_path.write_text(
        json.dumps(
            {
                "topic": topic,
                "title": "Safety workbook",
                "questions": [
                    {
                        "title": "Choose",
                        "input_type": "radio",
                        "options": [{"label": "One", "value": "one"}],
                    }
                ],
            }
        ),
        encoding="utf-8",
    )

    completed = subprocess.run(
        [sys.executable, str(RENDERER), str(spec_path), "--output", str(output_path)],
        check=False,
        capture_output=True,
        text=True,
    )

    assert completed.returncode == 0, completed.stderr
    rendered = output_path.read_text(encoding="utf-8")
    scripts = re.findall(r"<script>(.*?)</script>", rendered, flags=re.DOTALL | re.IGNORECASE)
    assert len(scripts) == 1

    storage_key = f"{topic}-{datetime.date.today().isoformat()}"
    serialized_key = (
        json.dumps(storage_key)
        .replace("<", "\\u003c")
        .replace(">", "\\u003e")
        .replace("&", "\\u0026")
    )
    assert f"var STORAGE_KEY = {serialized_key};" in scripts[0]
    assert "</script>" not in scripts[0].lower()
    assert "<script src=" not in rendered.lower()
    assert not re.search(r"<(?:link|img|iframe)\b[^>]+(?:href|src)=", rendered, re.IGNORECASE)

    script_path = tmp_path / "workbook.js"
    script_path.write_text(scripts[0], encoding="utf-8")
    syntax = subprocess.run(
        ["node", "--check", str(script_path)],
        check=False,
        capture_output=True,
        text=True,
    )
    assert syntax.returncode == 0, syntax.stderr
