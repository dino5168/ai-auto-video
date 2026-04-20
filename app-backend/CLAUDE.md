# Backend — app-backend/

## Tech Stack
- **Runtime**: Python 3.12, uv
- **Framework**: FastAPI + uvicorn
- **ORM**: SQLAlchemy (async) + asyncpg
- **Migrations**: Alembic + psycopg2-binary (sync driver for CLI)
- **Config**: pydantic-settings (`.env`)
- **Testing**: pytest + pytest-asyncio + httpx

## Commands
```bash
uv run uvicorn app.main:app --reload

uv run alembic revision --autogenerate -m "<message>"
uv run alembic upgrade head
uv run alembic stamp head   # baseline existing DB — prevents DROP TABLE on first autogenerate

uv run pytest
```

> Do NOT use `fastapi dev` on Windows — emoji encoding bug. Use `uvicorn` directly.

## Project Structure
```
app-backend/
├── app/
│   ├── api/v1/routes/        # One APIRouter file per resource
│   │   ├── chat.py
│   │   ├── codes.py
│   │   └── menu.py           # GET /api/v1/menu — sidebar nav config
│   ├── core/
│   │   ├── config.py         # pydantic-settings
│   │   └── database.py       # Async engine, session, Base
│   ├── models/               # SQLAlchemy ORM models
│   ├── schemas/              # Pydantic request/response schemas
│   │   ├── code.py
│   │   └── menu.py           # NavItemSchema, NavGroupSchema
│   ├── tools/
│   │   └── doc_markdown.py   # Save chat history as Markdown
│   └── main.py               # include_router only
├── system-env/
│   ├── tools.json            # Tool command definitions (command → action)
│   └── system-prompt.md      # System prompt (path via .env)
├── alembic/
├── alembic.ini
├── .env                      # Not committed
└── pyproject.toml
```

## Conventions
- Routes: `app/api/v1/routes/<resource>.py` with `APIRouter(prefix="/<resource>", tags=["<resource>"])`
- Register in `main.py`: `app.include_router(router, prefix="/api/v1")`
- Schemas: `<Resource>Create` (input) + `<Resource>Response(Create)` (output, `from_attributes=True`)
- `get_db()` auto commit/rollback — use `db.flush()` + `db.refresh()` in POST handlers

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/menu` | Sidebar nav groups (NavGroupSchema[]) |
| POST | `/api/v1/chat/stream` | Streaming chat (SSE) |

## Tool Command Dispatch
前端輸入 `/[command]` 時後端處理，**不呼叫 Ollama**：

```
user input "/webfetch https://..."
  └─ _dispatch_command()
       ├─ split(" ", 1) → cmd="/webfetch", args="https://..."
       ├─ _tool_registry[cmd] → action="web_fetch"   # from tools.json
       └─ _ACTION_HANDLERS[action](args) → result
```

**新增指令步驟：**
1. `system-env/tools.json` 加入 `{"command": "/xxx", "action": "do_xxx"}`
2. `chat.py` `_ACTION_HANDLERS` 加入 `"do_xxx": _handle_xxx`
3. 實作 `async def _handle_xxx(args: str) -> str`

**現有指令：**
| Command | Action | 說明 |
|---------|--------|------|
| `/clear` | `clear_messages` | 清除對話歷史 |
| `/webfetch [url]` | `web_fetch` | 抓取 URL 前 3000 字元送 Ollama |

**前端 `/clear`：** `App.tsx` finally 偵測回應為 `"對話已清除。"` 時執行 `setMessages([])`。

## Environment Variables (`.env`)
```
APP_NAME=AI Video Generator
APP_VERSION=0.1.0
DEBUG=False
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<dbname>
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma4:e2b
SYSTEM_PROMPT=D:\repo-project\ai-auto-video\app-backend\system-env\system-prompt.md
SYSTEM_TOOLS=D:\repo-project\ai-auto-video\app-backend\system-env\tools.json
```
