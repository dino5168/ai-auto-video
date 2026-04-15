# 工作紀錄

## 任務一：Output Control（輸出控制）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Output Control（輸出控制）」類別中的 6 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Persona.md](Persona.md) | Persona | 指定模型扮演特定角色、身份或專業背景 |
| [Audience Persona.md](Audience%20Persona.md) | Audience Persona | 描述目標受眾特徵，調整輸出的解釋深度與用詞 |
| [Output Formatter.md](Output%20Formatter.md) | Output Formatter | 明確指定輸出格式（JSON、Markdown、表格等） |
| [Style Transfer.md](Style%20Transfer.md) | Style Transfer | 要求模型模仿特定文體風格或語氣 |
| [Few-Shot Calibration.md](Few-Shot%20Calibration.md) | Few-Shot Calibration | 精心選例以校準輸出分佈與品質標準 |
| [Structured Output Contract.md](Structured%20Output%20Contract.md) | Structured Output Contract | 以 JSON Schema 或型別定義確保輸出型別安全 |

---

## 任務二：Reliability（可靠性）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Reliability（可靠性）」類別中的 6 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Fact Check.md](Fact%20Check.md) | Fact Check | 要求模型主動標示不確定資訊、區分事實與推論 |
| [Reflection.md](Reflection.md) | Reflection | 讓模型在答案後回顧推論過程，找出潛在錯誤 |
| [Critique & Revise.md](Critique%20%26%20Revise.md) | Critique & Revise | 先批評自身輸出，再根據批評修訂為更好的版本 |
| [Self-Consistency.md](Self-Consistency.md) | Self-Consistency | 多次採樣後取多數決或交集，提升答案穩定性 |
| [Calibrated Uncertainty.md](Calibrated%20Uncertainty.md) | Calibrated Uncertainty | 明確表達信心水準，標示不確定邊界，減少幻覺 |
| [Structured Output Contract.md](Structured%20Output%20Contract.md) | Structured Output Contract | 以 JSON Schema 或型別定義確保輸出型別安全（與任務一共用） |

---

## 任務三：Reasoning（推理）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Reasoning（推理）」類別中的 5 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Chain-of-Thought Control.md](Chain-of-Thought%20Control.md) | Chain-of-Thought Control | 控制推理鏈展開方式：逐步推導、零樣本 CoT、強制中間步驟 |
| [Cognitive Verifier.md](Cognitive%20Verifier.md) | Cognitive Verifier | 拆解子問題分別驗證再整合，降低單步錯誤影響 |
| [Plan-Then-Execute.md](Plan-Then-Execute.md) | Plan-Then-Execute | 先輸出執行計畫確認後，再逐步執行多步驟任務 |
| [Task Decomposition.md](Task%20Decomposition.md) | Task Decomposition | 模型主動分析問題結構並自主拆解為可執行子任務 |
| [Simulation & Counterfactual.md](Simulation%20%26%20Counterfactual.md) | Simulation / Counterfactual | 模擬假設情境或反事實推理，探索邊界條件與風險 |

---

## 任務四：Context Engineering（上下文工程）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Context Engineering（上下文工程）」類別中的 5 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Context Manager.md](Context%20Manager.md) | Context Manager | 明確控制 context window 內容：壓縮、截斷、摘要、優先序排列 |
| [Context Injection.md](Context%20Injection.md) | Context Injection | 動態將外部資訊（文件、資料、工具回傳值）注入 prompt |
| [RAG.md](RAG.md) | RAG | 從向量資料庫或搜尋引擎檢索相關片段後注入生成 |
| [Memory.md](Memory.md) | Memory | 跨會話保留重要資訊：短期工作記憶或長期外部儲存 |
| [Prompt Chaining.md](Prompt%20Chaining.md) | Prompt Chaining | 有序 prompt 序列，前一輪輸出作為下一輪結構化輸入 |

---

## 任務五：Interaction（互動）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Interaction（互動）」類別中的 4 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Flipped Interaction.md](Flipped%20Interaction.md) | Flipped Interaction | 讓模型主動向使用者提問以收集資訊，反轉提問方向 |
| [Game Play.md](Game%20Play.md) | Game Play | 設計遊戲化互動框架：角色扮演、謎題、積分機制等 |
| [Infinite Generation.md](Infinite%20Generation.md) | Infinite Generation | 設計可無限延伸的生成結構，用於持續性創作或串流輸出 |
| [Menu System.md](Menu%20System.md) | Menu System | 提供結構化選項讓使用者導航，降低輸入負擔並引導對話流程 |

---

## 任務六：Execution（執行 / Agent）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Execution（執行 / Agent）」類別中的 5 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Tool Usage.md](Tool%20Usage.md) | Tool Usage | 讓模型呼叫外部工具：搜尋、程式執行、API 呼叫、資料庫查詢 |
| [Skill Composition.md](Skill%20Composition.md) | Skill Composition | 組合多個工具或 prompt 模組以完成複合任務 |
| [Multi-Agent.md](Multi-Agent.md) | Multi-Agent | Orchestrator 分配任務，Specialist Agents 各司其職協作 |
| [State Machine.md](State%20Machine.md) | State Machine | 以狀態機建模 Agent 執行流程，定義轉移條件與終止條件 |
| [Meta-Prompting.md](Meta-Prompting.md) | Meta-Prompting | 讓模型自行生成或最佳化 prompt，是自動化 prompt 工程的基礎 |

---

## 任務七：Safety & Control（安全控制）

**執行日期：** 2026-04-14

**任務說明：**
依據 Execute.md 的指示，針對「Safety & Control（安全控制）」類別中的 4 個提示詞範式，
撰寫各自的說明文件，包含範式說明、使用時機、使用提示、提示詞範例與常見錯誤。

### 輸出檔案列表

| 檔名 | 範式 | 說明 |
|------|------|------|
| [Constraint.md](Constraint.md) | Constraint | 明確列出模型不可做的事：禁止話題、輸出限制、行為邊界 |
| [Guardrail.md](Guardrail.md) | Guardrail | 在輸出端設置獨立過濾驗證層，攔截不符規範的回應 |
| [Constitutional AI & Self-Critique Loop.md](Constitutional%20AI%20%26%20Self-Critique%20Loop.md) | Constitutional AI / Self-Critique Loop | 模型依據預設原則集對自身輸出進行審查與修正 |
| [Prompt Injection Defense.md](Prompt%20Injection%20Defense.md) | Prompt Injection Defense | 防禦惡意輸入覆蓋系統指令：輸入清洗、角色隔離、沙箱化 |

---

## 每份文件結構

各文件均包含以下章節：
1. **說明** — 範式的核心概念與定義
2. **使用時機** — 以表格列出適用情境
3. **使用提示** — 撰寫此類提示詞的實用建議
4. **提示詞範例** — 2~4 個具體可用的範例（含情境說明）
5. **常見錯誤** — 該範式常見的誤用方式
