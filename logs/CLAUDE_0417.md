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
│   ├── core/
│   │   ├── config.py    # Settings (pydantic-settings)
│   │   └── database.py  # Async engine, session, Base
│   ├── models/          # SQLAlchemy ORM models
│   ├── schemas/         # Pydantic request/response schemas
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

---

## Frontend (`app-front/`)

### Tech Stack
- **Bundler**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Components**: shadcn/ui (Radix-based)
- **Icons**: `lucide-react`, `@radix-ui/react-icons`
- **State**: Zustand
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

### Project Structure
```
app-front/
├── src/
│   ├── components/ui/   # shadcn generated components
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css        # @import "tailwindcss"
├── vite.config.ts
├── tsconfig.app.json    # baseUrl + paths alias
└── package.json
```

### Common Pitfalls
| Issue | Fix |
|-------|-----|
| Tailwind classes have no effect | Check `index.css` has `@import "tailwindcss"` and is imported in `main.tsx` |
| Path alias `@/` not resolved | Add `baseUrl`/`paths` to `tsconfig.app.json` (not `tsconfig.json`) |
| `Cannot find module 'path'` | `npm install -D @types/node` |
| shadcn init fails | Use `npx shadcn@latest init -t vite` with `-t vite` flag |
