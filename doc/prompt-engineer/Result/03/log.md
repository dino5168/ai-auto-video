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

## 每份文件結構

各文件均包含以下章節：
1. **說明** — 範式的核心概念與定義
2. **使用時機** — 以表格列出適用情境
3. **使用提示** — 撰寫此類提示詞的實用建議
4. **提示詞範例** — 2~4 個具體可用的範例（含情境說明）
5. **常見錯誤** — 該範式常見的誤用方式
