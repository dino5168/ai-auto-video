import json
from collections.abc import AsyncIterator
from pathlib import Path

import httpx
import ollama
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.config import settings
from app.tools.doc_markdown import save_markdown

router = APIRouter(prefix="/chat", tags=["chat"])

_client = ollama.AsyncClient(host=settings.OLLAMA_HOST)

_system_prompt: str | None = None
if settings.SYSTEM_PROMPT:
    _system_prompt = Path(settings.SYSTEM_PROMPT).read_text(encoding="utf-8")

# 載入工具指令定義
_tool_commands: set[str] = set()
if settings.SYSTEM_TOOLS:
    _tools_data = json.loads(Path(settings.SYSTEM_TOOLS).read_text(encoding="utf-8"))
    _tool_commands = {t["command"] for t in _tools_data.get("tools", [])}


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str


def _build_messages(req: ChatRequest) -> list[dict]:
    messages = [m.model_dump() for m in req.messages]
    if _system_prompt:
        messages = [{"role": "system", "content": _system_prompt}] + messages
    return messages


def _detect_clear(messages: list[dict]) -> bool:
    """最後一則 user 訊息是否為 /clear 指令。"""
    user_msgs = [m for m in messages if m["role"] == "user"]
    if not user_msgs:
        return False
    return user_msgs[-1]["content"].strip() == "/clear"


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        messages = _build_messages(req)

        if _detect_clear(messages):
            return ChatResponse(content="對話已清除。")

        response = await _client.chat(
            model=settings.OLLAMA_MODEL,
            messages=messages,
        )
        reply = response.message.content
        save_markdown(messages, reply)
        return ChatResponse(content=reply)
    except ollama.ResponseError as e:
        raise HTTPException(status_code=e.status_code, detail=e.error) from e
    except httpx.ConnectError as e:
        raise HTTPException(status_code=502, detail="Ollama service unavailable") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """Stream Ollama replies as server-sent events."""

    async def event_generator() -> AsyncIterator[str]:
        messages = _build_messages(req)

        if _detect_clear(messages):
            yield f"data: {json.dumps({'content': '對話已清除。'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        collected: list[str] = []
        try:
            async for chunk in await _client.chat(
                model=settings.OLLAMA_MODEL,
                messages=messages,
                stream=True,
            ):
                content = chunk.message.content
                if content:
                    collected.append(content)
                    yield f"data: {json.dumps({'content': content})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            if collected:
                # Save full assembled reply after stream completes
                save_markdown(messages, "".join(collected))
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
