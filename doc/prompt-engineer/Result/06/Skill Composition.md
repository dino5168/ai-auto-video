# Skill Composition（技能組合）

## 說明

Skill Composition 範式是指將多個獨立的工具、prompt 模組或專門化能力（Skill）組合起來，協同完成一個單一技能無法獨立處理的複合任務。

每個 Skill 是一個定義明確的能力單元——輸入、處理邏輯、輸出都有規範——透過組合與串接這些單元，可以構建出能夠處理複雜多步驟任務的 Agent 能力集。這個範式是構建可維護、可測試、可重用 Agent 架構的基礎。

---

## 使用時機

| 情境 | 說明 |
|------|------|
| 複合型任務處理 | 任務需要搜尋 + 分析 + 撰寫等多種能力組合 |
| Agent 能力擴展 | 透過組合已有 Skill 快速擴展 Agent 的任務範圍 |
| 可重用模組設計 | 將常用能力封裝為獨立 Skill，供不同 Agent 複用 |
| 複雜工作流自動化 | 不同階段需要不同專業能力的自動化 Pipeline |
| 能力測試與調試 | 分別測試每個 Skill 後再測試組合行為 |

---

## 使用提示

- 每個 Skill 應有**明確的輸入/輸出 Schema**，確保 Skill 之間的介面相容
- 在 prompt 中**明確描述每個可用 Skill 的功能邊界**，避免 Skill 之間功能重疊
- 模型應在**選擇使用哪個 Skill 前說明理由**，確保 Skill 選擇的可解釋性
- 設計**Skill 組合的順序邏輯**，明確哪些 Skill 必須在其他 Skill 之前執行
- 考慮**Skill 失敗時的降級策略**（某個 Skill 不可用時如何繼續）

---

## 提示詞範例

### 範例 1：研究報告生成 Agent

```
你是一個研究報告生成 Agent，可以組合使用以下 Skills：

可用 Skills：
┌─────────────────────────────────────────────────────┐
│ Skill: web_search                                   │
│ 輸入: query (string)                                │
│ 輸出: search_results [{title, url, snippet}]        │
│ 用途: 搜尋最新資訊                                   │
├─────────────────────────────────────────────────────┤
│ Skill: content_extractor                            │
│ 輸入: url (string)                                  │
│ 輸出: full_text (string), metadata {title, date}    │
│ 用途: 提取網頁完整內容                               │
├─────────────────────────────────────────────────────┤
│ Skill: summarizer                                   │
│ 輸入: text (string), max_length (number)            │
│ 輸出: summary (string), key_points [string]         │
│ 用途: 摘要長文內容                                   │
├─────────────────────────────────────────────────────┤
│ Skill: report_writer                               │
│ 輸入: topic (string), sources [{summary, metadata}] │
│ 輸出: report (markdown string)                      │
│ 用途: 基於摘要生成結構化報告                          │
└─────────────────────────────────────────────────────┘

任務：生成一份關於「2026 年生成式 AI 在醫療領域應用」的研究報告。

請規劃 Skill 的組合順序，說明每一步的理由，然後逐步執行。
```

---

### 範例 2：客戶工單自動處理 Agent

```
你是一個客戶服務 Agent，透過組合 Skills 處理客戶工單。

可用 Skills：
- classify_intent(text) → {intent: string, confidence: float, entities: object}
- lookup_customer(customer_id) → {profile: object, order_history: object[]}
- check_order_status(order_id) → {status: string, timeline: object[]}
- process_refund(order_id, reason) → {refund_id: string, amount: number, eta: string}
- send_notification(customer_id, message, channel) → {sent: boolean}
- escalate_to_human(ticket_id, reason, priority) → {agent_id: string, eta: string}

處理規則：
1. 先用 classify_intent 理解意圖
2. 根據意圖組合對應 Skills
3. 若信心度 < 0.7，直接 escalate_to_human
4. 每個 Skill 呼叫前說明選擇理由

工單內容：
客戶 ID: C-9987
訊息：「我三天前下的訂單（#ORD-20260411-442）還沒到，我要退款！」
```

---

### 範例 3：程式碼審查 Agent

```
你是一個程式碼審查 Agent，組合使用以下專門化 Skills：

Skills：
- static_analyzer(code, language) → {issues: [{line, severity, rule, message}]}
  分析程式碼的靜態問題（語法、潛在 Bug）
  
- security_scanner(code) → {vulnerabilities: [{type, line, risk_level, description}]}
  掃描安全漏洞（SQL injection、XSS 等）
  
- complexity_analyzer(code) → {cyclomatic_complexity: number, hotspots: [{function, score}]}
  分析程式複雜度
  
- doc_checker(code) → {missing_docs: string[], coverage: float}
  檢查文件覆蓋率
  
- suggestion_generator(issues) → {suggestions: [{issue_ref, recommended_fix, example}]}
  根據發現的問題生成修改建議

請對以下程式碼執行完整審查：
1. 並行執行所有分析 Skills
2. 整合所有發現的問題
3. 依嚴重性排序
4. 呼叫 suggestion_generator 生成修改建議
5. 輸出結構化審查報告

程式碼：
[貼上程式碼]
```

---

## 常見錯誤

- **Skill 介面不一致**：不同 Skill 的輸入/輸出格式各異，導致 Skill 之間難以串接
- **Skill 功能重疊**：多個 Skill 做同樣的事，Agent 選擇時產生混淆
- **忽略 Skill 依賴順序**：後一個 Skill 的輸入依賴前一個 Skill 的輸出，但並行執行導致失敗
- **過度分割 Skill**：將一個簡單操作拆成多個 Skill，增加協調成本但沒有帶來彈性
- **沒有降級策略**：某個核心 Skill 失敗時整個任務停擺，未設計備案
