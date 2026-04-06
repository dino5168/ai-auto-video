## ⚠️ Guardrails
1. 每完成一個 Step，輸出 "STEP N DONE: [做了什麼]" 再繼續
2. 遇到不確定的決策點，停下來問，不要猜
3. 任何超出 Scope 的發現，記錄到 `log/observations.md`，不要自行處理
4. 完成後執行 `git diff --stat` 確認變更範圍