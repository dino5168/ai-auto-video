# State Machine（狀態機）

## 說明

State Machine 範式是指以有限狀態機（Finite State Machine）的概念建模 Agent 的執行流程，明確定義每個狀態（State）代表的含義、從一個狀態轉移到另一個狀態的條件（Transition），以及任務的終止狀態（Terminal State）。

透過狀態機，原本可能無序、難以預測的 Agent 行為被約束在一套明確定義的流程圖中，使得 Agent 的行為可預測、可測試、可調試，並且能夠在每個狀態明確知道「下一步應該做什麼」。

---

## 使用時機

| 情境 | 說明 |
|------|------|
| 多步驟審批流程 | 表單提交 → 初審 → 複審 → 核准/駁回 |
| 對話流程管理 | 問候 → 需求收集 → 方案提供 → 確認 → 結束 |
| 任務執行管線 | 每個處理階段有明確的前置條件與完成標準 |
| 錯誤重試機制 | 明確定義失敗狀態與重試的轉移條件 |
| 長時間運行的 Agent | 需要能夠暫停、恢復、從特定狀態重新開始的任務 |

---

## 使用提示

- 明確列出**所有可能的狀態**及其含義（避免模糊的「處理中」之類的狀態）
- 為每個狀態定義**進入條件**（從哪些狀態可以轉入）與**退出條件**（轉移到哪些狀態）
- 明確標示**初始狀態**與**終止狀態**（成功結束與失敗結束各有對應狀態）
- 在 prompt 中要求模型**在每次行動後顯示當前狀態**，便於追蹤與調試
- 設計**超時或異常的狀態轉移**，避免 Agent 卡死在某個狀態

---

## 提示詞範例

### 範例 1：客戶服務工單處理狀態機

```
你是一個客服 Agent，必須嚴格按照以下狀態機執行工單處理流程。

狀態定義：
┌─────────────────┬────────────────────────────────────────────────┐
│ 狀態            │ 說明                                            │
├─────────────────┼────────────────────────────────────────────────┤
│ INIT            │ 初始狀態，等待工單輸入                           │
│ CLASSIFY        │ 分類工單類型與優先級                             │
│ GATHER_INFO     │ 收集處理所需的額外資訊                           │
│ RESOLVE         │ 嘗試自動解決問題                                 │
│ ESCALATE        │ 轉交人工客服                                     │
│ CONFIRM         │ 向客戶確認問題已解決                             │
│ CLOSED_SUCCESS  │ 終止狀態：成功解決                               │
│ CLOSED_ESCALATE │ 終止狀態：已轉交人工                             │
└─────────────────┴────────────────────────────────────────────────┘

狀態轉移規則：
INIT → CLASSIFY（收到工單時）
CLASSIFY → GATHER_INFO（需要更多資訊時）
CLASSIFY → RESOLVE（資訊足夠時）
GATHER_INFO → RESOLVE（資訊收集完成時）
RESOLVE → CONFIRM（解決方案已提供時）
RESOLVE → ESCALATE（無法自動解決時）
CONFIRM → CLOSED_SUCCESS（客戶確認解決時）
CONFIRM → GATHER_INFO（客戶說問題未解決時）
ESCALATE → CLOSED_ESCALATE（已成功轉交時）

任何狀態 → ESCALATE（優先級為 CRITICAL 時）

執行要求：
- 每次行動前輸出：[當前狀態] → [下一狀態]（轉移原因）
- 到達終止狀態時，輸出完整的處理摘要

工單：「我的帳號登不進去，已經試了三個小時，明天有重要會議要用！」
```

---

### 範例 2：程式碼生成與驗證狀態機

```
你是一個程式碼生成 Agent，執行以下狀態機流程：

狀態與行為：

[ANALYZE_REQUIREMENTS]
- 行為：解析需求，識別技術要求與邊界條件
- 轉移到 DESIGN 當需求明確時
- 轉移到 CLARIFY 當需求模糊時

[CLARIFY]
- 行為：向用戶提問一個最關鍵的澄清問題
- 轉移到 ANALYZE_REQUIREMENTS 收到回答後
- 最多進行 3 次 CLARIFY，超過則帶著現有理解繼續

[DESIGN]
- 行為：輸出程式架構設計（函式簽名、資料結構、主要邏輯流）
- 轉移到 IMPLEMENT

[IMPLEMENT]
- 行為：根據設計實作完整程式碼
- 轉移到 TEST

[TEST]
- 行為：撰寫測試案例並心算執行，驗證正確性
- 轉移到 DONE 當所有測試通過時
- 轉移到 DEBUG 當測試失敗時

[DEBUG]
- 行為：識別失敗原因並修正程式碼
- 轉移到 TEST（最多重試 3 次）
- 轉移到 FAILED（超過重試次數時）

[DONE] 終止狀態：輸出最終程式碼與測試結果
[FAILED] 終止狀態：輸出目前進度與失敗原因

當前狀態：[ANALYZE_REQUIREMENTS]
需求：寫一個函式解析 CSV 字串，回傳包含標頭的字典列表，需要處理引號包裹的欄位。
```

---

### 範例 3：資料處理 Pipeline 狀態機（含恢復機制）

```
你是一個資料處理 Agent，以下狀態機支援斷點恢復。

狀態機定義：
{
  "states": {
    "IDLE": {"description": "等待任務"},
    "FETCH": {"description": "從來源擷取資料"},
    "VALIDATE": {"description": "驗證資料品質"},
    "TRANSFORM": {"description": "資料轉換與清洗"},
    "LOAD": {"description": "寫入目標系統"},
    "VERIFY": {"description": "驗證寫入結果"},
    "SUCCESS": {"description": "終止：成功", "terminal": true},
    "PARTIAL_SUCCESS": {"description": "終止：部分成功", "terminal": true},
    "FAILED": {"description": "終止：失敗", "terminal": true}
  },
  "transitions": {
    "IDLE → FETCH": "收到任務指令",
    "FETCH → VALIDATE": "資料擷取完成",
    "FETCH → FAILED": "擷取失敗且重試超過 3 次",
    "VALIDATE → TRANSFORM": "驗證通過率 >= 95%",
    "VALIDATE → PARTIAL_SUCCESS": "驗證通過率 50-94%（繼續處理有效資料）",
    "VALIDATE → FAILED": "驗證通過率 < 50%",
    "TRANSFORM → LOAD": "轉換完成",
    "LOAD → VERIFY": "寫入完成",
    "VERIFY → SUCCESS": "寫入結果正確",
    "VERIFY → LOAD": "寫入結果有誤（重試，最多 2 次）"
  }
}

當前狀態快照（斷點恢復）：
{
  "current_state": "TRANSFORM",
  "completed_steps": ["FETCH", "VALIDATE"],
  "validated_records": 9847,
  "invalid_records": 153,
  "checkpoint_data": "transform_input_20260414.parquet"
}

指令：從當前狀態繼續執行，完成剩餘流程。每個狀態轉移後更新狀態快照。
```

---

## 常見錯誤

- **狀態定義模糊**：「處理中」這類狀態沒有明確的進入/退出條件
- **缺乏終止狀態**：Agent 可能在正常流程結束後繼續執行，不知道何時停止
- **未處理異常轉移**：只定義正常流程的轉移，遇到錯誤或超時時 Agent 卡死
- **狀態過於細碎**：每個微小行動都是一個狀態，導致狀態機過度複雜難以維護
- **不顯示當前狀態**：Agent 沒有輸出當前狀態，調試時無法追蹤執行進度
