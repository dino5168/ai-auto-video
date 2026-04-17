
# 將 app-front 前端的 Menu 設定移動至 App-backend

# 問題描述

目前的 D:\repo-project\ai-auto-video\app-front\src\components\layout\nav-config.ts
是 NavItem.tsx 顯示 NavItem 的設定

# 解決方案

 將  D:\repo-project\ai-auto-video\app-front\src\components\layout\nav-config.ts
 export const navGroups: NavGroup[] = [....]
 的設定移動到由後端 App-backend 使用 api 讀取

App-backend 新增一個 router /app/api/vi/routes/menu.py
依據前端的 
```typescript
export interface NavItem {

  label: string

  href: string

  icon: LucideIcon

  badge?: number

  children?: NavItem[]

}

  

export interface NavGroup {

  title: string

  items: NavItem[]

}
```
設計 python 的資料結構。
NavGroup 的內容由 後端 api 取得。
後端 api 的 url 由 .env 設定不要硬編碼。
# 評估解決方案

依據問題描述、評估解決方案、列出解決步驟。詢問使用者是否依據解決步驟執行。
