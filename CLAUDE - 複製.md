# Role
  read ROLE-en.md

# Project Overview

Full-stack AI Video Generator:
- `app-backend/` — FastAPI + PostgreSQL (Python, uv)
- `app-front/` — Vite + React + TypeScript + Tailwind v4 + shadcn/ui

---

## Backend (`app-backend/`)

### Tech Stack
- **Runtime**: Python 3.12, uv
- **Framework**: FastAPI + uvicorn
- **ORM**: SQLAlchemy (async) + asyncpg
- **Migrations**: Alembic + psycopg2-binary (sync driver for CLI)
- **Config**: pydantic-settings (`.env`)
- **Testing**: pytest + pytest-asyncio + httpx

### Commands
```bash
# Start dev server
uv run uvicorn app.main:app --reload

# Create migration
uv run alembic revision --autogenerate -m "<message>"

# Apply migrations
uv run alembic upgrade head

# Stamp current DB as baseline (no model changes)
uv run alembic stamp head

# Run tests
uv run pytest
```

> Do NOT use `fastapi dev` on Windows — emoji encoding bug in the CLI output. Use `uvicorn` directly.

### Project Structure
```
app-backend/
├── app/
│   ├── api/v1/routes/   # APIRouter files (one file per resource)
│   │   ├── chat.py
│   │   ├── codes.py
│   │   └── menu.py      # GET /api/v1/menu — sidebar nav config
│   ├── core/
│   │   ├── config.py    # Settings (pydantic-settings)
│   │   └── database.py  # Async engine, session, Base
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic request/response schemas
│   │   ├── code.py
│   │   └── menu.py      # NavItemSchema, NavGroupSchema
│   └── main.py          # App entry point, include_router only
├── alembic/
├── alembic.ini
├── .env                 # Not committed
└── pyproject.toml
```

### Conventions
- Routes go in `app/api/v1/routes/<resource>.py` with `APIRouter(prefix="/<resource>", tags=["<resource>"])`
- Register routers in `main.py` via `app.include_router(router, prefix="/api/v1")`
- Schemas: define `<Resource>Create` (input) and `<Resource>Response(Create)` (output with `from_attributes=True`)
- `database.py` `get_db()` handles commit/rollback automatically — use `db.flush()` + `db.refresh()` in POST handlers
- When using an existing DB: run `alembic stamp head` before first `autogenerate` to avoid DROP TABLE migrations

### Environment Variables (`.env`)
```
APP_NAME=AI Video Generator
APP_VERSION=0.1.0
DEBUG=False
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<password>
POSTGRES_DB=<dbname>
```

### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/menu` | Sidebar nav groups (NavGroupSchema[]) |
| POST | `/api/v1/chat/stream` | Streaming chat (SSE) |

---

## Frontend (`app-front/`)

### Tech Stack
- **Bundler**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Components**: shadcn/ui (Radix-based)
- **Icons**: `lucide-react`, `@radix-ui/react-icons`
- **State**: Zustand
- **Routing**: `react-router-dom` v7 (`BrowserRouter` in `main.tsx`)
- **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`

### Commands
```bash
# Start dev server
npm run dev        # http://localhost:5173

# Build
npm run build

# Add shadcn component
npx shadcn@latest add <component>
```

### Key Config
- Path alias `@/` → `./src/` — configured in both `vite.config.ts` and `tsconfig.app.json`
- Tailwind is imported via `@import "tailwindcss"` in `src/index.css` (not a config file)
- shadcn init: `npx shadcn@latest init -t vite` (must include `-t vite`)
- Backend base URL: `import.meta.env.VITE_API_BASE_URL` (set in `app-front/.env`)

### Environment Variables (`app-front/.env`)
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```
> `.env` is git-ignored. Use `.env.example` as reference.

### Project Structure
```
app-front/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── nav-config.ts     # NavItem/NavGroup types + ICON_MAP
│   │   │   ├── NavItem.tsx       # Recursive nav item (link / toggle)
│   │   │   └── Sidebar.tsx       # Desktop + mobile sidebar
│   │   ├── members/              # Analytics page atoms
│   │   │   ├── members-data.ts   # Mock data + Member type
│   │   │   ├── MemberCell.tsx    # Avatar + name + email
│   │   │   ├── FunctionCell.tsx  # Title + dept
│   │   │   ├── StatusBadge.tsx   # Online / Offline badge
│   │   │   └── MembersTable.tsx  # Sortable table + pagination
│   │   └── ui/                   # shadcn generated components
│   ├── hooks/
│   │   └── useNavGroups.ts       # Fetches /api/v1/menu, resolves icon strings → LucideIcon
│   ├── pages/
│   │   └── AnalyticsPage.tsx     # /analytics route
│   ├── App.tsx                   # Routes: /analytics | * (chat)
│   ├── main.tsx                  # BrowserRouter entry
│   └── index.css                 # @import "tailwindcss"
├── .env                          # git-ignored
├── .env.example
├── vite.config.ts
├── tsconfig.app.json             # baseUrl + paths alias
└── package.json
```

### Routing
| Path | Component | Description |
|------|-----------|-------------|
| `/analytics` | `AnalyticsPage` | Members table with sort + pagination |
| `*` | Chat UI (inline in App.tsx) | Streaming chat interface |

### Nav Menu Architecture
選單資料由後端 `GET /api/v1/menu` 提供，前端透過 `useNavGroups` hook 取得並渲染：

```
backend menu.py (_NAV_GROUPS)
  └─ GET /api/v1/menu → NavGroupSchema[] (icon: string)
       └─ useNavGroups hook
            ├─ fetch API
            ├─ resolve icon string → LucideIcon via ICON_MAP
            └─ return { navGroups, loading, error }
                 └─ Sidebar.tsx renders nav tree
```

> 新增或修改選單項目：只需編輯 `app-backend/app/api/v1/routes/menu.py` 的 `_NAV_GROUPS`。

### Common Pitfalls
| Issue | Fix |
|-------|-----|
| Tailwind classes have no effect | Check `index.css` has `@import "tailwindcss"` and is imported in `main.tsx` |
| Path alias `@/` not resolved | Add `baseUrl`/`paths` to `tsconfig.app.json` (not `tsconfig.json`) |
| `Cannot find module 'path'` | `npm install -D @types/node` |
| shadcn init fails | Use `npx shadcn@latest init -t vite` with `-t vite` flag |
| API URL hardcoded | Use `import.meta.env.VITE_API_BASE_URL`; set in `app-front/.env` |
