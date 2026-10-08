#!/usr/bin/env python3
"""Export every AI conversation log for the Park Finder take-home into this folder.

Sources:
  * Claude Code sessions: every top-level *.jsonl in ~/.claude/projects/-Users-tom-park-finder/,
    plus each session's <id>/subagents/*.jsonl and <id>/tool-results/*.txt.
  * Codex sessions: every *.jsonl under ~/.codex/sessions/ whose session_meta cwd is this repo.

Outputs (regenerated from scratch on every run):
  transcript-N.md   readable rendering of one Claude Code session, in file order, nothing cut
  codex-M.md        readable rendering of one Codex session
  raw/transcript-N/ the original session file and its subagents/ and tool-results/ folders
  raw/codex/        the original Codex rollout files
  README.md         an index of everything above

Standard library only. Run from anywhere: python3 docs/transcripts/export-transcripts.py
"""

from __future__ import annotations

import json
import re
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
RAW = HERE / "raw"
CLAUDE_DIR = Path.home() / ".claude" / "projects" / "-Users-tom-park-finder"
CODEX_DIR = Path.home() / ".codex" / "sessions"
REPO_CWD = "/Users/tom/park-finder"
NY = ZoneInfo("America/New_York")

README_INTRO = """# AI transcripts

This folder holds the full, unredacted AI conversation logs for the Park Finder take-home, as the brief requires. Nothing has been edited, shortened, or selected. Each `transcript-N.md` is a readable rendering of one Claude Code session (every prompt, every reply, the model's thinking, every tool call and tool result, and the transcripts of any subagents that session delegated to). Each `codex-M.md` is a Codex session rendered the same way. The `raw/` folder holds the original log files exactly as the tools wrote them; the Markdown is generated from them by `export-transcripts.py`.

To regenerate after a new session: `python3 docs/transcripts/export-transcripts.py` from the repo root. The last session (the wrap-up that produced this export) is re-exported after it ends so its transcript is complete.
"""


# ---------------------------------------------------------------- helpers


def read_lines(path: Path) -> list[tuple[Any, str]]:
    """Every line of a JSONL file as (parsed object or None, original text)."""
    out: list[tuple[Any, str]] = []
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.rstrip("\n")
            if not line.strip():
                continue
            try:
                out.append((json.loads(line), line))
            except json.JSONDecodeError:
                out.append((None, line))
    return out


def fence(text: str, lang: str = "") -> str:
    """Fenced block whose fence is longer than any backtick run inside the text."""
    longest = max((len(m.group(0)) for m in re.finditer(r"`+", text)), default=0)
    ticks = "`" * max(3, longest + 1)
    if text and not text.endswith("\n"):
        text += "\n"
    return f"{ticks}{lang}\n{text}{ticks}\n"


def pretty(obj: Any) -> str:
    return json.dumps(obj, indent=2, ensure_ascii=False, sort_keys=False)


def parse_ts(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def fmt_both(ts: datetime | None) -> str:
    if ts is None:
        return "unknown"
    return f"{ts.astimezone(ZoneInfo('UTC')).strftime('%Y-%m-%d %H:%M:%S')} UTC / {ts.astimezone(NY).strftime('%Y-%m-%d %H:%M:%S')} New York"


def fmt_ny(ts: datetime | None) -> str:
    return ts.astimezone(NY).strftime("%Y-%m-%d %H:%M") if ts else "unknown"


def first_last_ts(records: list[tuple[Any, str]]) -> tuple[datetime | None, datetime | None]:
    """Start is the first record's timestamp (a hook attachment can carry an older one); end is the latest."""
    stamps = [parse_ts(o.get("timestamp")) for o, _ in records if isinstance(o, dict)]
    stamps = [s for s in stamps if s]
    return (stamps[0], max(stamps)) if stamps else (None, None)


def one_line(text: str, limit: int) -> str:
    text = " ".join(text.split())
    if len(text) > limit:
        text = text[:limit] + "…"
    return text.replace("|", "\\|")


# ---------------------------------------------------- Claude Code rendering


def render_claude_block(block: Any) -> str:
    if not isinstance(block, dict):
        return fence(pretty(block), "json")
    kind = block.get("type")
    if kind == "text":
        return str(block.get("text", "")) + "\n"
    if kind == "thinking":
        return "**Thinking**\n\n" + str(block.get("thinking", "")) + "\n"
    if kind == "tool_use":
        return f"**Tool call: {block.get('name')}**\n\n" + fence(pretty(block.get("input")), "json")
    if kind == "tool_result":
        label = "**Tool result**" + (" (error)" if block.get("is_error") else "")
        content = block.get("content")
        if isinstance(content, str):
            body = fence(content)
        elif isinstance(content, list):
            parts = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    parts.append(fence(str(item.get("text", ""))))
                elif isinstance(item, dict) and item.get("type") == "image":
                    src = item.get("source", {}) if isinstance(item.get("source"), dict) else {}
                    data = src.get("data", "")
                    parts.append(
                        f"[image block, {src.get('media_type', 'unknown type')}, "
                        f"{len(data) if isinstance(data, str) else 0} base64 characters; "
                        "the raw copy holds the data]\n"
                    )
                else:
                    parts.append(fence(pretty(item), "json"))
            body = "\n".join(parts)
        else:
            body = fence(pretty(content), "json")
        return label + "\n\n" + body
    if kind == "image":
        src = block.get("source", {}) if isinstance(block.get("source"), dict) else {}
        data = src.get("data", "")
        return (
            f"[image block, {src.get('media_type', 'unknown type')}, "
            f"{len(data) if isinstance(data, str) else 0} base64 characters; the raw copy holds the data]\n"
        )
    return fence(pretty(block), "json")


def render_claude_records(records: list[tuple[Any, str]], out: list[str]) -> dict[str, int]:
    counts = {"user": 0, "assistant": 0, "tool_use": 0, "tool_result": 0}
    for obj, raw in records:
        if obj is None:
            out.append("**Unparsed line**\n\n" + fence(raw))
            continue
        kind = obj.get("type")
        ts = obj.get("timestamp", "")
        if kind in ("user", "assistant", "system"):
            if kind in counts:
                counts[kind] += 1
            message = obj.get("message")
            if kind == "system" or not isinstance(message, dict):
                payload = {k: v for k, v in obj.items()}
                out.append(f"### {ts} · system ({obj.get('subtype', '')})\n\n" + fence(pretty(payload), "json"))
                continue
            role = message.get("role", kind)
            tag = " (subagent sidechain)" if obj.get("isSidechain") else ""
            out.append(f"### {ts} · {role}{tag}\n")
            content = message.get("content")
            if isinstance(content, str):
                out.append(content + "\n")
            elif isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") in counts:
                        counts[block["type"]] += 1
                    out.append(render_claude_block(block))
            else:
                out.append(fence(pretty(content), "json"))
        else:
            out.append(f"- {ts} · `{kind}` record\n")
    return counts


def first_prompt(records: list[tuple[Any, str]]) -> str:
    for obj, _ in records:
        if isinstance(obj, dict) and obj.get("type") == "user":
            message = obj.get("message", {})
            content = message.get("content") if isinstance(message, dict) else None
            if isinstance(content, str):
                return content
            if isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        return str(block.get("text", ""))
    return ""


def export_claude_session(number: int, path: Path) -> dict[str, Any]:
    records = read_lines(path)
    start, end = first_last_ts(records)
    session_id = path.stem
    side = CLAUDE_DIR / session_id
    subagents = sorted(side.glob("subagents/*.jsonl")) if side.is_dir() else []
    tool_results = sorted(side.glob("tool-results/*")) if side.is_dir() else []

    body: list[str] = []
    counts = render_claude_records(records, body)

    sub_sections: list[str] = []
    for agent_file in subagents:
        meta_path = agent_file.with_suffix(".meta.json")
        meta: dict[str, Any] = {}
        if meta_path.exists():
            try:
                meta = json.loads(meta_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                meta = {"unparsed": meta_path.read_text(encoding="utf-8")}
        sub_sections.append(
            f"\n## Subagent {agent_file.name}\n\n"
            f"- model: {meta.get('model', 'not recorded')}\n"
            f"- description: {meta.get('description', 'not recorded')}\n"
            f"- agent type: {meta.get('agentType', 'not recorded')}\n"
            f"- raw: `raw/transcript-{number}/subagents/{agent_file.name}`\n\n"
        )
        sub_body: list[str] = []
        sub_counts = render_claude_records(read_lines(agent_file), sub_body)
        sub_sections.append(
            f"user records {sub_counts['user']}, assistant records {sub_counts['assistant']}, "
            f"tool calls {sub_counts['tool_use']}, tool results {sub_counts['tool_result']}\n\n"
        )
        sub_sections.extend(sub_body)

    tool_sections: list[str] = []
    if tool_results:
        tool_sections.append("\n## Tool results stored outside the session file\n\n")
        tool_sections.append(
            "Claude Code saves a tool output over a size limit to a separate file and keeps a "
            "preview in the conversation. These are those files, in full.\n\n"
        )
        for tr in tool_results:
            text = tr.read_text(encoding="utf-8", errors="replace")
            tool_sections.append(f"### {tr.name} ({tr.stat().st_size} bytes)\n\n" + fence(text))

    header = (
        f"# Transcript {number}: Claude Code session {session_id}\n\n"
        f"- start: {fmt_both(start)}\n"
        f"- end: {fmt_both(end)}\n"
        f"- user records: {counts['user']}\n"
        f"- assistant records: {counts['assistant']}\n"
        f"- tool calls: {counts['tool_use']}\n"
        f"- tool results: {counts['tool_result']}\n"
        f"- subagent transcripts: {len(subagents)}\n"
        f"- raw copy: `raw/transcript-{number}/{path.name}`\n\n"
        "Every record of the session file follows in its original order. Bookkeeping records "
        "(attachments, titles, queue and file-history entries) are listed by type; their full "
        "payloads are in the raw copy.\n\n## Session\n\n"
    )
    (HERE / f"transcript-{number}.md").write_text(header + "\n".join(body) + "".join(sub_sections) + "".join(tool_sections), encoding="utf-8")

    dest = RAW / f"transcript-{number}"
    dest.mkdir(parents=True)
    shutil.copy2(path, dest / path.name)
    for sub in ("subagents", "tool-results"):
        if (side / sub).is_dir():
            shutil.copytree(side / sub, dest / sub)

    return {
        "number": number,
        "id": session_id,
        "start": start,
        "end": end,
        "counts": counts,
        "subagents": len(subagents),
        "first_prompt": first_prompt(records),
    }


# ---------------------------------------------------------- Codex rendering


def codex_text_blocks(content: Any) -> str:
    if isinstance(content, str):
        return content + "\n"
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict) and isinstance(item.get("text"), str):
                parts.append(item["text"] + "\n")
            else:
                parts.append(fence(pretty(item), "json"))
        return "\n".join(parts)
    return fence(pretty(content), "json")


def export_codex_session(number: int, path: Path, meta: dict[str, Any]) -> dict[str, Any]:
    records = read_lines(path)
    start, end = first_last_ts(records)
    out: list[str] = []
    count = 0
    for obj, raw in records:
        count += 1
        if obj is None:
            out.append("**Unparsed line**\n\n" + fence(raw))
            continue
        kind = obj.get("type")
        ts = obj.get("timestamp", "")
        payload = obj.get("payload") if isinstance(obj.get("payload"), dict) else {}
        ptype = payload.get("type")
        if kind == "session_meta":
            base = payload.get("base_instructions", {})
            text = base.get("text", "") if isinstance(base, dict) else str(base)
            meta_without = {k: v for k, v in payload.items() if k != "base_instructions"}
            out.append(f"### {ts} · session_meta\n\n" + fence(pretty(meta_without), "json"))
            out.append("**Base instructions (system prompt)**\n\n" + fence(text))
        elif kind == "response_item" and ptype == "message":
            out.append(f"### {ts} · {payload.get('role', 'message')}\n\n" + codex_text_blocks(payload.get("content")))
        elif kind == "response_item" and ptype == "reasoning":
            texts = []
            for key in ("summary", "content"):
                val = payload.get(key)
                if val:
                    texts.append(codex_text_blocks(val))
            extra = {k: v for k, v in payload.items() if k not in ("summary", "content", "type", "id")}
            out.append(f"### {ts} · reasoning\n\n" + ("".join(texts) if texts else "") + (fence(pretty(extra), "json") if extra else ""))
        elif kind == "response_item" and ptype == "custom_tool_call":
            inp = payload.get("input")
            out.append(f"### {ts} · tool call: {payload.get('name')}\n\n" + (fence(inp) if isinstance(inp, str) else fence(pretty(inp), "json")))
        elif kind == "response_item" and ptype == "custom_tool_call_output":
            outp = payload.get("output")
            out.append(f"### {ts} · tool output\n\n" + (fence(outp) if isinstance(outp, str) else fence(pretty(outp), "json")))
        elif kind == "response_item":
            out.append(f"### {ts} · response_item {ptype}\n\n" + fence(pretty(payload), "json"))
        elif kind == "turn_context":
            out.append(f"### {ts} · turn_context\n\n" + fence(pretty(payload), "json"))
        else:
            out.append(f"- {ts} · `{kind}`" + (f" ({ptype})" if ptype else "") + "\n")

    header = (
        f"# Codex {number}: session {meta.get('id', path.stem)}\n\n"
        f"- originator: {meta.get('originator')}\n"
        f"- cli version: {meta.get('cli_version')}\n"
        f"- model provider: {meta.get('model_provider')}\n"
        f"- cwd: {meta.get('cwd')}\n"
        f"- start: {fmt_both(start)}\n"
        f"- end: {fmt_both(end)}\n"
        f"- records: {count}\n"
        f"- raw copy: `raw/codex/{path.name}`\n\n## Session\n\n"
    )
    (HERE / f"codex-{number}.md").write_text(header + "\n".join(out), encoding="utf-8")
    (RAW / "codex").mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, RAW / "codex" / path.name)
    return {"number": number, "file": path.name, "start": start, "end": end, "records": count}


def codex_sessions() -> list[tuple[Path, dict[str, Any]]]:
    found = []
    if not CODEX_DIR.is_dir():
        return found
    for path in sorted(CODEX_DIR.rglob("*.jsonl")):
        with path.open(encoding="utf-8") as fh:
            first = fh.readline()
        try:
            obj = json.loads(first)
        except json.JSONDecodeError:
            continue
        payload = obj.get("payload") if isinstance(obj, dict) else None
        if obj.get("type") == "session_meta" and isinstance(payload, dict) and payload.get("cwd") == REPO_CWD:
            found.append((path, payload))
    found.sort(key=lambda item: (parse_ts(item[1].get("timestamp")) or datetime.min.replace(tzinfo=ZoneInfo("UTC")), item[0].name))
    return found


# ------------------------------------------------------------------- main


def clean() -> None:
    for old in list(HERE.glob("transcript-*.md")) + list(HERE.glob("codex-*.md")) + [HERE / "README.md"]:
        if old.exists():
            old.unlink()
    if RAW.exists():
        shutil.rmtree(RAW)
    RAW.mkdir()


def main() -> None:
    clean()
    sessions = sorted(CLAUDE_DIR.glob("*.jsonl"), key=lambda p: (first_last_ts(read_lines(p))[0] or datetime.max.replace(tzinfo=ZoneInfo("UTC")), p.name))
    claude_rows = [export_claude_session(i, path) for i, path in enumerate(sessions, start=1)]
    codex_rows = [export_codex_session(i, path, meta) for i, (path, meta) in enumerate(codex_sessions(), start=1)]

    lines = [README_INTRO, "\n## Claude Code sessions\n\n"]
    lines.append("| # | Session id | Start (New York) | End (New York) | User / assistant records | Subagents | First prompt |\n")
    lines.append("| --- | --- | --- | --- | --- | --- | --- |\n")
    for row in claude_rows:
        lines.append(
            f"| [{row['number']}](transcript-{row['number']}.md) | `{row['id']}` | {fmt_ny(row['start'])} | {fmt_ny(row['end'])} "
            f"| {row['counts']['user']} / {row['counts']['assistant']} | {row['subagents']} | {one_line(row['first_prompt'], 100)} |\n"
        )
    lines.append("\n## Codex sessions\n\n")
    if codex_rows:
        lines.append("| # | File | Start (New York) | End (New York) | Records |\n| --- | --- | --- | --- | --- |\n")
        for row in codex_rows:
            lines.append(f"| [{row['number']}](codex-{row['number']}.md) | `{row['file']}` | {fmt_ny(row['start'])} | {fmt_ny(row['end'])} | {row['records']} |\n")
    else:
        lines.append("None found.\n")
    (HERE / "README.md").write_text("".join(lines), encoding="utf-8")
    print(f"exported {len(claude_rows)} Claude Code sessions and {len(codex_rows)} Codex sessions to {HERE}")


if __name__ == "__main__":
    main()
