# Frontend — app-front/

## Tech Stack
- **Bundler**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
- **Components**: shadcn/ui (Radix-based)
- **Icons**: `lucide-react`, `@radix-ui/react-icons`
- **State**: Zustand
- **Routing**: `react-router-dom` v7 (`BrowserRouter` in `main.tsx`)
- **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **3D Rendering**: `@react-three/fiber@9` (React 19 renderer), `three`, `@react-three/drei` (OrbitControls, useGLTF, Environment, Html, Center)

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
│   │   ├── AnalyticsPage.tsx     # /analytics route
│   │   └── demo3dmodelPage.tsx   # /demo3dmodel route — R3F Canvas + GLB viewer
│   ├── App.tsx                   # Routes: /analytics | /demo3dmodel | * (chat)
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
| `/demo3dmodel` | `Demo3dModelPage` | Interactive 3D GLB model viewer (R3F) |
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

## 3D Model Page (`/demo3dmodel`)

- **模型檔案**：`public/pixellabs-glb-3347.glb`，URL 路徑為 `/pixellabs-glb-3347.glb`（不含 `public`）
- **Stack**：`<Canvas>` → `<Suspense>` → `useGLTF` + `<primitive>` + `<OrbitControls>` + `<Environment>`
- **版本規則**：`@react-three/fiber@9` 對應 React 19；勿降為 `@8`（型別衝突）
- **Canvas 高度**：父容器必須有明確高度（`height: 100vh`），否則畫布高度為 0

## Common Pitfalls
| Issue | Fix |
|-------|-----|
| Tailwind classes have no effect | Check `index.css` has `@import "tailwindcss"` and is imported in `main.tsx` |
| Path alias `@/` not resolved | Add `baseUrl`/`paths` to `tsconfig.app.json` (not `tsconfig.json`) |
| `Cannot find module 'path'` | `npm install -D @types/node` |
| shadcn init fails | Use `npx shadcn@latest init -t vite` with `-t vite` flag |
| API URL hardcoded | Use `import.meta.env.VITE_API_BASE_URL`; set in `app-front/.env` |
| R3F + React 19 型別錯誤 | 必須用 `@react-three/fiber@9`，`@8` 只支援 React 18 |
| `useGLTF` 無 `<Suspense>` 包裹 | React 19 concurrent mode 下會拋錯，一定要加 `<Suspense>` |
