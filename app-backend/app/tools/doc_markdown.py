from datetime import datetime
from pathlib import Path

from app.core.config import settings

_MARKDOWN_DIR = Path(settings.DOC_OUTPUT_DIR)


def save_markdown(messages: list[dict], assistant_reply: str) -> None:
    """Persist a completed LLM conversation turn to a timestamped Markdown file.

    Args:
        messages: The full message list sent to the model (may include system prompt).
        assistant_reply: The complete assistant response text.
    """
    _MARKDOWN_DIR.mkdir(parents=True, exist_ok=True)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filepath = _MARKDOWN_DIR / f"chat_{ts}.md"

    lines: list[str] = [f"# Chat — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"]

    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "system":
            lines.append(f"## System\n\n{content}\n")
        elif role == "user":
            lines.append(f"## User\n\n{content}\n")
        elif role == "assistant":
            lines.append(f"## Assistant\n\n{content}\n")

    lines.append(f"## Assistant\n\n{assistant_reply}\n")

    filepath.write_text("\n".join(lines), encoding="utf-8")
