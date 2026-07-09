from __future__ import annotations

import re
import shutil
from pathlib import Path

import yaml


SKILL_ROOT = Path(__file__).resolve().parents[1]


def _load_skill(path: Path) -> tuple[dict[str, object], str]:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"\A---\n(.*?)\n---\n(.*)\Z", text, flags=re.DOTALL)
    assert match is not None
    return yaml.safe_load(match.group(1)), match.group(2)


def test_clean_install_has_one_direct_execution_boundary(tmp_path: Path) -> None:
    installed = tmp_path / ".claude" / "skills" / "neutral-audit"
    shutil.copytree(SKILL_ROOT, installed)

    frontmatter, instructions = _load_skill(installed / "SKILL.md")

    assert frontmatter["name"] == "neutral-audit"
    assert frontmatter["context"] == "fork"
    assert frontmatter["agent"] == "Explore"
    assert "Agent" not in frontmatter["allowed-tools"]
    assert "neutral audit" in str(frontmatter["description"]).lower()
    assert "perform the audit directly" in instructions.lower()
    assert not re.search(r"\bspawn\b|general-purpose subagent", instructions, re.IGNORECASE)
    assert "debugger" not in (str(frontmatter["description"]) + instructions).lower()
    assert not re.search(
        r"\bbug-hunt\b",
        str(frontmatter["description"]) + instructions,
        re.IGNORECASE,
    )
