
| 檔名 | 範式 | 說明 |
|------|------|------|
| [Fact Check.md](Fact%20Check.md) | Fact Check | 要求模型主動標示不確定資訊、區分事實與推論 |
| [Reflection.md](Reflection.md) | Reflection | 讓模型在答案後回顧推論過程，找出潛在錯誤 |
| [Critique & Revise.md](Critique%20%26%20Revise.md) | Critique & Revise | 先批評自身輸出，再根據批評修訂為更好的版本 |
| [Self-Consistency.md](Self-Consistency.md) | Self-Consistency | 多次採樣後取多數決或交集，提升答案穩定性 |
| [Calibrated Uncertainty.md](Calibrated%20Uncertainty.md) | Calibrated Uncertainty | 明確表達信心水準，標示不確定邊界，減少幻覺 |
| [Structured Output Contract.md](Structured%20Output%20Contract.md) | Structured Output Contract | 以 JSON Schema 或型別定義確保輸出型別安全（與任務一共用） |

---

## 每份文件結構

各文件均包含以下章節：
1. **說明** — 範式的核心概念與定義
2. **使用時機** — 以表格列出適用情境
3. **使用提示** — 撰寫此類提示詞的實用建議
4. **提示詞範例** — 2~4 個具體可用的範例（含情境說明）
5. **常見錯誤** — 該範式常見的誤用方式
