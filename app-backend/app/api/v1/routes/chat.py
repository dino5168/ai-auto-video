import json
from collections.abc import AsyncIterator

import ollama
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter(prefix="/chat", tags=["chat"])

_client = ollama.AsyncClient(host=settings.OLLAMA_HOST)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str


@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        response = await _client.chat(
            model=settings.OLLAMA_MODEL,
            messages=[m.model_dump() for m in req.messages],
        )
        return ChatResponse(content=response.message.content)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e


@router.post("/stream")
async def chat_stream(req: ChatRequest):
    """Stream Ollama replies as server-sent events."""

    async def event_generator() -> AsyncIterator[str]:
        try:
            async for chunk in await _client.chat(
                model=settings.OLLAMA_MODEL,
                messages=[m.model_dump() for m in req.messages],
                stream=True,
            ):
                content = chunk.message.content
                if content:
                    yield f"data: {json.dumps({'content': content})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
