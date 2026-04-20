
## 任務七：Safety & Control（安全控制）


| 檔名                                                                                               | 範式                                     | 說明                         |
| ------------------------------------------------------------------------------------------------ | -------------------------------------- | -------------------------- |
| [Constraint.md](Constraint.md)                                                                   | Constraint                             | 明確列出模型不可做的事：禁止話題、輸出限制、行為邊界 |
| [Guardrail.md](Guardrail.md)                                                                     | Guardrail                              | 在輸出端設置獨立過濾驗證層，攔截不符規範的回應    |
| [Constitutional AI & Self-Critique Loop.md](Constitutional%20AI%20%26%20Self-Critique%20Loop.md) | Constitutional AI / Self-Critique Loop | 模型依據預設原則集對自身輸出進行審查與修正      |
| [Prompt Injection Defense.md](Prompt%20Injection%20Defense.md)                                   | Prompt Injection Defense               | 防禦惡意輸入覆蓋系統指令：輸入清洗、角色隔離、沙箱化 |

---

## 每份文件結構

各文件均包含以下章節：
1. **說明** — 範式的核心概念與定義
2. **使用時機** — 以表格列出適用情境
3. **使用提示** — 撰寫此類提示詞的實用建議
4. **提示詞範例** — 2~4 個具體可用的範例（含情境說明）
5. **常見錯誤** — 該範式常見的誤用方式
