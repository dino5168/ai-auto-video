
### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Chain-of-Thought Control.md](Chain-of-Thought%20Control.md) | Chain-of-Thought Control | 控制推理鏈展開方式：逐步推導、零樣本 CoT、強制中間步驟 |
| [Cognitive Verifier.md](Cognitive%20Verifier.md) | Cognitive Verifier | 拆解子問題分別驗證再整合，降低單步錯誤影響 |
| [Plan-Then-Execute.md](Plan-Then-Execute.md) | Plan-Then-Execute | 先輸出執行計畫確認後，再逐步執行多步驟任務 |
| [Task Decomposition.md](Task%20Decomposition.md) | Task Decomposition | 模型主動分析問題結構並自主拆解為可執行子任務 |
| [Simulation & Counterfactual.md](Simulation%20%26%20Counterfactual.md) | Simulation / Counterfactual | 模擬假設情境或反事實推理，探索邊界條件與風險 |

---

## 每份文件結構

各文件均包含以下章節：
1. **說明** — 範式的核心概念與定義
2. **使用時機** — 以表格列出適用情境
3. **使用提示** — 撰寫此類提示詞的實用建議
4. **提示詞範例** — 2~4 個具體可用的範例（含情境說明）
5. **常見錯誤** — 該範式常見的誤用方式
