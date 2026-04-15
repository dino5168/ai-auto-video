# chat.py — 說明文件

路徑：`app-backend/app/api/v1/routes/chat.py`

---

## 概覽

此模組實作 `/api/v1/chat` 路由，提供兩個端點：

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/v1/chat` | POST | 一次性回應（non-streaming） |
| `/api/v1/chat/stream` | POST | 串流回應（Server-Sent Events） |

後端透過 [Ollama](https://ollama.com/) 呼叫本地 LLM，並在每次對話後將內容儲存為 Markdown 檔。

---

## 模組層級初始化

```python
_client = ollama.AsyncClient(host=settings.OLLAMA_HOST)

_system_prompt: str | None = None
if settings.SYSTEM_PROMPT:
    _system_prompt = Path(settings.SYSTEM_PROMPT).read_text(encoding="utf-8")
```

- `_client`：全域共用的 Ollama 非同步客戶端，連線到 `settings.OLLAMA_HOST`。
- `_system_prompt`：從 `settings.SYSTEM_PROMPT` 指定的路徑讀取系統提示詞（若有設定）。模組載入時讀取一次，之後複用。

---

## Pydantic Schemas

### `ChatMessage`
```python
class ChatMessage(BaseModel):
    role: str      # "user" | "assistant" | "system"
    content: str
```
單一對話訊息。

### `ChatRequest`
```python
class ChatRequest(BaseModel):
    messages: list[ChatMessage]
```
請求 body，包含完整的對話歷史。

### `ChatResponse`
```python
class ChatResponse(BaseModel):
    role: str = "assistant"
    content: str
```
非串流端點的回應格式，`role` 預設為 `"assistant"`。

---

## 輔助函式

### `_build_messages(req: ChatRequest) -> list[dict]`

```python
def _build_messages(req: ChatRequest) -> list[dict]:
    messages = [m.model_dump() for m in req.messages]
    if _system_prompt:
        messages = [{"role": "system", "content": _system_prompt}] + messages
    return messages
```

將 `ChatRequest` 的訊息列表轉為 Ollama 接受的 `list[dict]` 格式，並在最前面插入系統提示詞（若有）。

---

## 端點說明

### POST `/api/v1/chat` — 一次性回應

```python
@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
```

**流程：**
1. 呼叫 `_build_messages` 組裝訊息
2. 呼叫 `_client.chat()`，等待完整回應
3. 呼叫 `save_markdown(messages, reply)` 儲存對話紀錄
4. 回傳 `ChatResponse`

**錯誤處理：**

| 例外 | HTTP 狀態碼 | 說明 |
|------|------------|------|
| `ollama.ResponseError` | `e.status_code` | Ollama 回傳錯誤 |
| `httpx.ConnectError` | 502 | 無法連線至 Ollama 服務 |
| `Exception` | 500 | 其他未預期錯誤 |

---

### POST `/api/v1/chat/stream` — 串流回應

```python
@router.post("/stream")
async def chat_stream(req: ChatRequest):
```

回傳 `StreamingResponse`，媒體類型為 `text/event-stream`（SSE）。

**內部產生器 `event_generator()`：**

```
async for chunk in _client.chat(..., stream=True):
    yield f"data: {json.dumps({'content': content})}\n\n"
```

1. 以串流模式逐 chunk 向 Ollama 取得回應
2. 每個 chunk 包裝為 SSE 格式 `data: {"content": "..."}` 後送出
3. 同時將 chunk 收集到 `collected` 列表
4. 串流結束後（`finally`），將完整內容傳入 `save_markdown` 儲存
5. 最後送出 `data: [DONE]` 表示串流結束

**錯誤格式：**
```
data: {"error": "錯誤訊息"}
```

---

## 資料流示意

```
Client
  │
  │  POST /chat  (ChatRequest)
  ▼
chat.py
  │
  ├─ _build_messages()  ← 插入 system prompt
  │
  ├─ ollama.AsyncClient.chat()
  │       │
  │       └─ Ollama (本地 LLM)
  │
  ├─ save_markdown()  ← 儲存對話至 .md 檔
  │
  └─► ChatResponse / StreamingResponse (SSE)
```

---

## 相關設定（`settings`）

| 變數 | 說明 |
|------|------|
| `OLLAMA_HOST` | Ollama 服務位址（如 `http://localhost:11434`） |
| `OLLAMA_MODEL` | 使用的模型名稱（如 `llama3`） |
| `SYSTEM_PROMPT` | 系統提示詞檔案路徑（選填） |

---

## 相依模組

- `app.core.config.settings` — 環境變數設定
- `app.tools.doc_markdown.save_markdown` — 儲存對話紀錄為 Markdown
