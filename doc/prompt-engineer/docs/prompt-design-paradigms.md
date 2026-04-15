# 提示詞設計範式（Prompt Design Paradigms）

---

## 1️⃣ Output Control（輸出控制）

| 範式 | 說明 |
|------|------|
| **Persona** | 指定模型扮演特定角色、身份或專業背景，影響語氣與知識框架 |
| **Audience Persona** | 描述目標受眾特徵，讓模型調整解釋深度、用詞與假設前提 |
| **Output Formatter** | 明確指定輸出格式：JSON、Markdown、表格、條列、程式碼區塊等 |
| **Style Transfer** | 要求模型模仿特定文體風格：正式、口語、學術、特定作者風格等 |
| **Few-Shot Calibration** | 精心挑選示例以校準輸出分佈，策略性選例而非單純示範 |
| **Structured Output Contract** | 以 JSON Schema 或型別定義作為 prompt 與 completion 之間的契約，確保輸出型別安全 |

---

## 2️⃣ Reliability（可靠性）

| 範式 | 說明 |
|------|------|
| **Fact Check** | 要求模型主動標示不確定資訊、引用來源或區分事實與推論 |
| **Reflection** | 讓模型在給出答案後回顧自身推論過程，找出潛在錯誤 |
| **Critique & Revise** | 要求模型先批評自己的輸出，再根據批評修訂為更好的版本 |
| **Self-Consistency** | 多次採樣相同問題後取多數決或交集，提升答案穩定性 |
| **Calibrated Uncertainty** | 要求模型明確表達信心水準，標示不確定邊界，主動減少幻覺 |

---

## 3️⃣ Reasoning（推理）

| 範式 | 說明 |
|------|------|
| **Chain-of-Thought Control** | 控制模型推理鏈的展開方式：逐步推導、零樣本 CoT、強制中間步驟等 |
| **Cognitive Verifier** | 將複雜問題拆解為子問題，分別驗證再整合，降低單步錯誤的影響 |
| **Plan-Then-Execute** | 先讓模型輸出執行計畫，確認後再逐步執行，適用於多步驟任務 |
| **Task Decomposition** | 要求模型主動分析問題結構並自主拆解，不同於 Plan-Then-Execute 的差異在於拆解本身由模型發起 |
| **Simulation / Counterfactual** | 模擬假設情境或反事實推理：「如果 X 改變，結果會是？」，用於探索邊界條件與風險 |

---

## 4️⃣ Context Engineering（上下文）

| 範式 | 說明 |
|------|------|
| **Context Manager** | 明確控制放入 context window 的內容：壓縮、截斷、摘要、優先序排列 |
| **Context Injection** | 動態將外部資訊（文件、資料、工具回傳值）注入 prompt |
| **RAG** | Retrieval-Augmented Generation：從向量資料庫或搜尋引擎檢索相關片段後注入 |
| **Memory** | 跨會話保留重要資訊：短期工作記憶（in-context）或長期外部儲存 |
| **Prompt Chaining** | 將複雜任務拆解為有序的 prompt 序列，前一輪輸出作為下一輪的結構化輸入，屬於 orchestration 層 |

---

## 5️⃣ Interaction（互動）

| 範式 | 說明 |
|------|------|
| **Flipped Interaction** | 讓模型主動向使用者提問以收集資訊，反轉提問方向 |
| **Game Play** | 設計遊戲化互動框架：角色扮演、謎題、積分機制等 |
| **Infinite Generation** | 設計可無限延伸的生成結構，常用於持續性創作或串流輸出 |
| **Menu System** | 提供結構化選項讓使用者導航，降低輸入負擔並引導對話流程 |

---

## 6️⃣ Execution（執行 / Agent）

| 範式 | 說明 |
|------|------|
| **Tool Usage** | 讓模型呼叫外部工具：搜尋、程式執行、API 呼叫、資料庫查詢等 |
| **Skill Composition** | 組合多個工具或 prompt 模組以完成複合任務 |
| **Multi-Agent** | 多個 agent 協作：orchestrator 分配任務，specialist agent 各司其職 |
| **State Machine** | 以狀態機建模 agent 的執行流程，定義狀態轉移條件與終止條件 |
| **Meta-Prompting** | 讓模型自行生成或最佳化 prompt，prompt 生成 prompt，是自動化 prompt 工程的基礎（參見 DSPy） |

---

## 7️⃣ Safety & Control（安全控制）

| 範式 | 說明 |
|------|------|
| **Constraint** | 在 prompt 中明確列出模型不可做的事：禁止話題、輸出限制、行為邊界 |
| **Guardrail** | 在輸出端設置過濾或驗證層，攔截不符合規範的回應（可為獨立 LLM 或規則引擎） |
| **Constitutional AI / Self-Critique Loop** | 讓模型依據預設原則集對自身輸出進行審查與修正，不同於 Guardrail 的外部攔截 |
| **Prompt Injection Defense** | 防禦惡意輸入覆蓋系統指令：輸入清洗、角色隔離、沙箱化，在 multi-agent 與 RAG 場景中尤為關鍵 |

---

## 範式補充說明

### 新增範式與原始框架的差異

| 新增範式 | 歸屬分類 | 與既有範式的差異 |
|----------|----------|-----------------|
| Few-Shot Calibration | Output Control | 不只是 few-shot 示範，強調策略性選例以校準輸出分佈 |
| Structured Output Contract | Output Control | 比 Output Formatter 更偏向型別安全，以 schema 作為系統邊界契約 |
| Calibrated Uncertainty | Reliability | 比 Fact Check 更主動，要求模型量化自身信心水準 |
| Task Decomposition | Reasoning | 模型主動發起拆解，有別於 Plan-Then-Execute 由 prompt 驅動的計畫 |
| Simulation / Counterfactual | Reasoning | 專注於假設情境與邊界條件探索 |
| Prompt Chaining | Context Engineering | 處理任務序列編排，不同於 RAG/Memory 的 context 管理 |
| Meta-Prompting | Execution | prompt 的自動生成與最佳化，DSPy 框架的核心概念 |
| Constitutional AI / Self-Critique Loop | Safety & Control | 輸出端的原則審查，有別於 Guardrail 的規則過濾 |
| Prompt Injection Defense | Safety & Control | 輸入端的注入防禦，Guardrail 偏向輸出端 |
