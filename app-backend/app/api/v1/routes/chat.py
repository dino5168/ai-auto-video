import json
from collections.abc import AsyncIterator, Awaitable, Callable
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

# 載入工具指令定義：command → action
_tool_registry: dict[str, str] = {}
if settings.SYSTEM_TOOLS:
    _tools_data = json.loads(Path(settings.SYSTEM_TOOLS).read_text(encoding="utf-8"))
    _tool_registry = {t["command"]: t["action"] for t in _tools_data.get("tools", [])}

async def _handle_clear(args: str) -> str:  # noqa: ARG001
    return "對話已清除。"


async def _handle_web_fetch(args: str) -> str:
    url = args.strip()
    if not url:
        return "請提供 URL，例如：/webfetch https://example.com"
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            # 截斷避免超出 context 限制
            return resp.text[:3000]
    except httpx.HTTPStatusError as e:
        return f"HTTP 錯誤 {e.response.status_code}：{url}"
    except httpx.RequestError as e:
        return f"無法連線：{e}"


_ACTION_HANDLERS: dict[str, Callable[[str], Awaitable[str]]] = {
    "clear_messages": _handle_clear,
    "web_fetch": _handle_web_fetch,
}


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


async def _dispatch_command(messages: list[dict]) -> str | None:
    """若最後一則 user 訊息符合 tool_registry 指令，執行對應 handler 並回傳結果，否則回傳 None。"""
    user_msgs = [m for m in messages if m["role"] == "user"]
    if not user_msgs:
        return None
    parts = user_msgs[-1]["content"].strip().split(" ", 1)
    cmd, args = parts[0], parts[1] if len(parts) > 1 else ""
    action = _tool_registry.get(cmd)
    if not action:
        return None
    handler = _ACTION_HANDLERS.get(action)
    return await handler(args) if handler else None


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        messages = _build_messages(req)

        result = await _dispatch_command(messages)
        if result:
            return ChatResponse(content=result)

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

        result = await _dispatch_command(messages)
        if result:
            yield f"data: {json.dumps({'content': result})}\n\n"
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
