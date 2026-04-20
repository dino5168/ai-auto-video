# Claude Code Prompt Architecture

個人專案的分層提示詞設計，適用 Claude Code CLI。

---

## 架構總覽

```
~/.claude/CLAUDE.md          ← 全域：個人技術偏好（跨所有專案）
└── {project}/CLAUDE.md      ← 專案根：地圖 + 跨層規則
    ├── {project}/ROLE-en.md ← 角色：行為守則 + 專案情境
    ├── app-backend/CLAUDE.md ← 子模組：後端技術規格
    └── app-front/CLAUDE.md  ← 子模組：前端技術規格
```

Claude Code 從當前目錄向上合併所有 CLAUDE.md，越近的優先。

---

## 各層職責

### 全域 `~/.claude/CLAUDE.md`
- 個人技術偏好（語言、工具鏈）
- 跨專案通用規則（YAGNI、type discipline、安全規則）
- **不進 git**，只有本機可見

### 專案根 `CLAUDE.md`
- 專案地圖（目錄結構、各層用途）
- 跨層規則（API contract、環境變數、啟動指令）
- 指向子模組 CLAUDE.md 與 ROLE-en.md
- **進 git**

### `ROLE-en.md`
- AI 角色定位與專案情境
- 行為守則（不重複全域已有的規則）
- **進 git**

### 子模組 `CLAUDE.md`
- 單一技術層的完整規格（Tech Stack、Commands、Project Structure、Conventions）
- 自給自足，不依賴其他層
- **進 git**

---

## Token 設計原則

1. **不重複** — 全域已有的規則（YAGNI、type hints）不在專案文件中重複
2. **職責單一** — 每層只寫該層負責的內容
3. **子模組隔離** — 在 `app-front/` 工作時不載入後端噪音（需從子目錄啟動 Claude）

---

## 行為守則來源

整合自 [Andrej Karpathy CLAUDE.md](https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md)，保留最有價值的部分：

| 守則 | 說明 |
|------|------|
| Think before coding | 明確說出假設；不清楚就問，不要默默選一個 |
| Surgical changes | 每一行改動都必須對應用戶的請求；match 現有風格 |
| No magic | 隱性行為（SSE、tool dispatch）必須在程式碼或文件中明確 |
| Fail loud | 清楚的錯誤訊息優先於靜默 fallback |

---

## 適用情境

| 情境 | 適用 |
|------|------|
| 個人專案、獨自開發 | 完整適用 |
| 團隊協作 | 需將全域規則中的關鍵項移回專案 CLAUDE.md |
