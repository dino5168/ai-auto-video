# Frontend — app-front/

## Tech Stack
- **Bundler**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Components**: shadcn/ui (Radix-based)
- **Icons**: `lucide-react`, `@radix-ui/react-icons`
- **State**: Zustand
- **Routing**: `react-router-dom` v7 (`BrowserRouter` in `main.tsx`)
- **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`

## Commands
```bash
npm run dev        # http://localhost:5173
npm run build
npx shadcn@latest add <component>
```

## Key Config
- Path alias `@/` → `./src/` — set in both `vite.config.ts` and `tsconfig.app.json`
- Tailwind: `@import "tailwindcss"` in `src/index.css` (no config file)
- shadcn init: `npx shadcn@latest init -t vite` (must include `-t vite`)
- Backend URL: `import.meta.env.VITE_API_BASE_URL` (set in `app-front/.env`)

## Project Structure
```
app-front/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── nav-config.ts     # NavItem/NavGroup types + ICON_MAP
│   │   │   ├── NavItem.tsx       # Recursive nav item (link / toggle)
│   │   │   └── Sidebar.tsx       # Desktop + mobile sidebar
│   │   ├── members/
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

## Routing
| Path | Component | Description |
|------|-----------|-------------|
| `/analytics` | `AnalyticsPage` | Members table with sort + pagination |
| `*` | Chat UI (inline in App.tsx) | Streaming chat interface |

## Nav Menu Architecture
選單資料由後端 `GET /api/v1/menu` 提供：

```
backend menu.py (_NAV_GROUPS)
  └─ GET /api/v1/menu → NavGroupSchema[] (icon: string)
       └─ useNavGroups hook
            ├─ fetch API
            ├─ resolve icon string → LucideIcon via ICON_MAP
            └─ return { navGroups, loading, error }
                 └─ Sidebar.tsx renders nav tree
```

> 新增或修改選單：只需編輯 `app-backend/app/api/v1/routes/menu.py` 的 `_NAV_GROUPS`。

## Environment Variables (`app-front/.env`)
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```
> `.env` is git-ignored. Use `.env.example` as reference.

## Common Pitfalls
| Issue | Fix |
|-------|-----|
| Tailwind classes have no effect | Check `index.css` has `@import "tailwindcss"` and is imported in `main.tsx` |
| Path alias `@/` not resolved | Add `baseUrl`/`paths` to `tsconfig.app.json` (not `tsconfig.json`) |
| `Cannot find module 'path'` | `npm install -D @types/node` |
| shadcn init fails | Use `npx shadcn@latest init -t vite` with `-t vite` flag |
| API URL hardcoded | Use `import.meta.env.VITE_API_BASE_URL`; set in `app-front/.env` |
