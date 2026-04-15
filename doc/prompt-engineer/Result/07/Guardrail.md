# Guardrail（護欄）

## 說明

Guardrail 範式是指在模型輸出端設置一個獨立的過濾或驗證層，攔截不符合規範的回應，並在回應被攔截時觸發預設的替代行為。這個驗證層可以是另一個 LLM（用於語義層面的判斷）、規則引擎（用於結構化驗證）、或兩者的組合。

與 Constraint 的根本差異在於：Constraint 是「在 prompt 中告訴模型不要做什麼」（依賴模型自律），Guardrail 是「在輸出後設置獨立的檢查機制」（不依賴模型自律，即使主模型越界，Guardrail 也能攔截）。

---

## 使用時機

| 情境 | 說明 |
|------|------|
| 高風險應用部署 | 醫療、金融、法律等領域，錯誤輸出代價極高 |
| 面向大眾的產品 | 無法預測用戶輸入，需要穩健的輸出過濾機制 |
| 合規審計需求 | 需要記錄並審計所有被攔截的輸出 |
| 多模型 Pipeline | 在 Agent 鏈中確保每個節點的輸出符合規範才進入下一節點 |
| 對抗性用戶場景 | 可能有用戶試圖誘導模型輸出不當內容 |

---

## 使用提示

- 將 Guardrail 設計為**獨立的驗證模組**，與主要生成模型解耦
- 定義清晰的**攔截條件**與**攔截後的處理邏輯**（拒絕、替換、升級人工審查）
- 使用輕量級模型或規則引擎作為 Guardrail，**降低延遲成本**
- 記錄所有攔截事件用於**監控與改善**
- 設計**分級攔截機制**：低風險輸出直接通過，中風險加上免責聲明，高風險直接攔截

---

## 提示詞範例

### 範例 1：LLM-based Guardrail 驗證提示詞

```
你是一個輸出安全審查模型，負責審查 AI 助理的回應是否符合安全規範。

審查標準：
1. 有害內容：是否包含暴力、歧視、仇恨言論（嚴重程度：高）
2. 個人資訊洩漏：是否包含可識別個人的資訊（嚴重程度：高）
3. 醫療/法律診斷：是否給出具體診斷或法律判斷（嚴重程度：中）
4. 競爭對手負面評論：是否評論或貶低競爭品牌（嚴重程度：中）
5. 格式違規：是否符合規定的輸出格式（嚴重程度：低）

待審查的回應：
<ai_response>
[待審查的模型輸出]
</ai_response>

請輸出審查結果（只輸出 JSON，不要其他文字）：
{
  "passed": true | false,
  "severity": "none" | "low" | "medium" | "high",
  "violations": [{"rule": "...", "severity": "...", "excerpt": "..."}],
  "action": "pass" | "warn" | "block",
  "safe_fallback": "若需要攔截，提供這裡的替代回應"
}
```

---

### 範例 2：輸出格式與結構驗證 Guardrail

```
你是一個 API 輸出驗證器。你需要驗證以下 JSON 輸出是否符合 Schema 規範，
並在不符合時生成修正版本。

預期 Schema：
{
  "required": ["user_id", "status", "message"],
  "properties": {
    "user_id": {"type": "string", "pattern": "^USR-[0-9]{6}$"},
    "status": {"type": "string", "enum": ["success", "error", "pending"]},
    "message": {"type": "string", "maxLength": 200},
    "data": {"type": "object", "nullable": true}
  }
}

待驗證的輸出：
[貼上模型輸出的 JSON]

請輸出：
{
  "valid": true | false,
  "errors": [{"field": "...", "issue": "...", "value": "..."}],
  "corrected_output": { ... }  // 若 valid 為 false，提供修正版本
}
```

---

### 範例 3：分級 Guardrail 系統設計

```
你是一個內容分級審查系統。請對以下輸出進行分級評估。

分級標準：
- 綠燈（PASS）：完全符合規範，直接通過
- 黃燈（WARN）：有輕微問題，加上標準免責聲明後通過
- 橙燈（MODIFY）：需要修改特定部分後才能通過，提供修改版本
- 紅燈（BLOCK）：嚴重違規，直接攔截，回傳標準拒絕訊息

待審查輸出：
<response>
[待審查內容]
</response>

用途情境：{medical_chatbot | customer_service | educational_platform}

輸出格式：
{
  "grade": "PASS" | "WARN" | "MODIFY" | "BLOCK",
  "reason": "...",
  "final_response": "最終對外輸出的內容"
}
```

---

## 常見錯誤

- **Guardrail 與主模型使用相同底層**：若主模型被繞過，同樣底層的 Guardrail 也可能被繞過
- **攔截率過高**：過於嚴格的 Guardrail 攔截大量正常輸出，嚴重影響使用者體驗
- **攔截後無替代行為**：只有「拒絕」沒有「替代回應」，讓用戶體驗中斷
- **Guardrail 延遲過高**：使用過重的模型作為 Guardrail，導致整體回應延遲不可接受
- **未記錄攔截事件**：沒有監控機制，無法發現 Guardrail 誤攔或被系統性繞過的模式
