## 7️⃣ Safety & Control（安全控制）

| 範式                                         | 說明                                                     |
| ------------------------------------------ | ------------------------------------------------------ |
| **Constraint**                             | 在 prompt 中明確列出模型不可做的事：禁止話題、輸出限制、行為邊界                   |
| **Guardrail**                              | 在輸出端設置過濾或驗證層，攔截不符合規範的回應（可為獨立 LLM 或規則引擎）                |
| **Constitutional AI / Self-Critique Loop** | 讓模型依據預設原則集對自身輸出進行審查與修正，不同於 Guardrail 的外部攔截             |
| **Prompt Injection Defense**               | 防禦惡意輸入覆蓋系統指令：輸入清洗、角色隔離、沙箱化，在 multi-agent 與 RAG 場景中尤為關鍵 |

1. 請依據範式產製提示詞工程的說明與使用時機與提示詞範例。輸出到 @output 目錄
2. 輸出格式使用 markdown 格式。命名方式使用 範式名稱命名。

輸出markdown 儲存的目錄架構範例
``` 
\output\Constraint.md
\output\Guardrail.md ...
```

3. 將輸出的markdown 檔名列表、 輸出一份工作紀錄檔 到 \output\log.md 