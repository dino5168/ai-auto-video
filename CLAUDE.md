# AI Auto Video — Project Root

> Role & working style: see [ROLE-en.md](./ROLE-en.md)
> Backend specs: see [app-backend/CLAUDE.md](./app-backend/CLAUDE.md)
> Frontend specs: see [app-front/CLAUDE.md](./app-front/CLAUDE.md)

---

## Project Overview

Full-stack AI Video Generator with a streaming chat interface powered by a local Ollama LLM.

| Layer | Directory | Stack |
|-------|-----------|-------|
| Backend API | `app-backend/` | FastAPI + PostgreSQL + Ollama |
| Frontend UI | `app-front/` | Vite + React + TypeScript + Tailwind v4 |

---

## Monorepo Layout
```
ai-auto-video/
├── app-backend/       # Python API (uv)
├── app-front/         # React SPA (npm)
├── tasks/             # Work planning docs
├── CLAUDE.md          # ← you are here (project map)
└── ROLE-en.md         # AI persona & working principles
```

---

## Cross-Cutting Rules

### API Contract (shared between layers)
- Backend base URL exposed to frontend via `VITE_API_BASE_URL` env var
- All API routes are versioned under `/api/v1/`
- SSE streaming endpoint: `POST /api/v1/chat/stream`
- Menu data source of truth: `app-backend/app/api/v1/routes/menu.py` → `_NAV_GROUPS`

### Security
- No secrets in source — all credentials from `.env` files
- `.env` files are git-ignored; `.env.example` is committed as reference

### Environment Bootstrap
```bash
# Backend
cd app-backend && cp .env.example .env   # fill credentials
uv run alembic upgrade head
uv run uvicorn app.main:app --reload

# Frontend
cd app-front && cp .env.example .env     # set VITE_API_BASE_URL
npm install && npm run dev
```
