## ⚠️ Guardrails
1. 每完成一個 Step，輸出 "STEP N DONE: [做了什麼]" 再繼續
2. 遇到不確定的決策點，停下來問，不要猜
3. 任何超出 Scope 的發現，記錄到 `log/observations.md`，不要自行處理
4. 完成後執行 `git diff --stat` 確認變更範圍


# 目標
請根據 Layout-Sider-Bar.png 實作 Sidebar 元件。

### Layout-Sider-Bar 

![Dashboard](/tasks/asserts/Layout-Sider-Bar.png)

技術棧：React + TypeScript + shadcn/ui + Tailwind CSS
檔案位置：src/components/layout/Sidebar.tsx

## 規格

### 視覺設計
- 深色主題背景：#1E1B3A，Logo 區塊：#2A2550
- 寬度：240px（展開）/ 60px（收合），transition-[width] duration-200
- Active NavItem：bg #7F77DD，文字白色，圓角 8px
- 一般 NavItem：文字 #AFA9EC，hover bg #2A2550
- NavGroup 標籤：文字 #534AB7，font-size 10px，letter-spacing

### 結構（由上到下）
1. Logo 區：icon 圓形 + 品牌名稱 + 副標題（收合時只顯示 icon）
2. NavGroup × 4：OVERVIEW / COMMERCE / APPS / SYSTEM
   - 每組有 separator line 分隔
   - 每個 NavItem：左側 icon（16×16 圓角方塊）+ label + 右側可選 Badge
3. Collapse toggle button（底部固定）
4. User widget：Avatar（圓形縮寫）+ 姓名 + 角色 + ⋯ 選單

### NavItem 資料（hardcode 初版即可）
OVERVIEW: Dashboard(badge:3), Analytics, eCommerce, CRM, SaaS
COMMERCE: Orders(badge:12), Products, Customers, Invoices
APPS: Mail, Chat, Files, Kanban, Calendar, Forms
SYSTEM: Users, Notifications(badge:3), Settings, Help & Support

### 行為
- useLocation() 判斷 active state，不要 hardcode
- 收合時 NavItem 只顯示 icon，搭配 shadcn Tooltip 顯示 label
- Collapse toggle 點擊切換，狀態存 useState（之後可升級 zustand）
- User widget 點 ⋯ 開 shadcn DropdownMenu（Profile / Settings / Logout）
- RWD：lg 以下改為 shadcn Sheet drawer，由外層 layout 控制開關

### 輸出檔案
- src/components/layout/Sidebar.tsx（主元件）
- src/components/layout/NavItem.tsx（單一 item）
- src/components/layout/nav-config.ts（路由資料設定）