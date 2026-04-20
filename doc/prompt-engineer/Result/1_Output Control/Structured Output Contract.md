# Structured Output Contract（結構化輸出契約）

## 說明

Structured Output Contract 範式是指以 JSON Schema、型別定義或嚴格的結構規格作為 prompt 與 completion 之間的「契約」，確保模型的輸出具備型別安全性與結構一致性，可直接被程式碼解析與使用。

這個範式超越了一般的「輸出 JSON」指令——它定義了每個欄位的型別、是否必填、允許的值範圍，並作為輸入與輸出之間的正式協議。

---

## 使用時機

| 情境 | 說明 |
|------|------|
| LLM 作為 API 後端 | 模型輸出需要被下游服務直接解析處理 |
| 資料萃取 Pipeline | 從非結構化文字中提取符合固定 Schema 的資料 |
| 多步驟 Agent 串接 | 每個步驟的輸出作為下一步驟的輸入 |
| 表單/資料填寫自動化 | 確保每個欄位都以正確型別填入 |
| 型別安全的 AI 整合 | 在強型別語言（TypeScript、Go）中整合 LLM 輸出 |

---

## 使用提示

- 明確標注哪些欄位是必填（required）哪些是選填
- 對列舉型別使用 enum 明確列出所有合法值
- 指定數值範圍（minimum/maximum）避免不合理的輸出
- 要求模型「只輸出 JSON，不輸出任何其他文字」
- 可搭配程式層的 Schema 驗證（如 Zod、Pydantic）做雙重保障

---

## 提示詞範例

### 範例 1：文章分析 JSON Schema 契約

```
你是一個文章分析引擎。請分析以下文章，並嚴格按照下方 JSON Schema 輸出結果。
只輸出 JSON，不要有任何額外說明。

JSON Schema：
{
  "type": "object",
  "required": ["title", "summary", "sentiment", "tags", "readingTimeMinutes"],
  "properties": {
    "title": {
      "type": "string",
      "description": "文章標題（不超過 50 字）"
    },
    "summary": {
      "type": "string",
      "description": "文章摘要（100~150 字）"
    },
    "sentiment": {
      "type": "string",
      "enum": ["positive", "negative", "neutral", "mixed"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1,
      "maxItems": 5
    },
    "readingTimeMinutes": {
      "type": "integer",
      "minimum": 1,
      "maximum": 60
    }
  }
}

文章內容：
[貼上文章]
```

---

### 範例 2：TypeScript 型別定義作為契約

```
你是一個履歷解析器。請從以下履歷文字中提取資訊，
輸出須符合下方 TypeScript 介面定義，格式為 JSON。
只輸出 JSON，不包含任何說明文字或 markdown 標記。

interface Resume {
  fullName: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    startYear: number;
    endYear: number | null;  // null 表示現職
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    graduationYear: number;
  }[];
}

履歷內容：
[貼上履歷文字]
```

---

### 範例 3：嚴格欄位驗證的訂單解析

```
請從以下訂單確認信中提取訂單資訊，並以 JSON 輸出。
輸出必須嚴格符合以下規格，不符合規格的欄位請填入 null。
只輸出 JSON。

輸出規格：
{
  "orderId": string,           // 訂單編號，格式 ORD-XXXXXXXX
  "orderDate": string,         // ISO 8601 格式 YYYY-MM-DD
  "totalAmount": number,       // 數值，不含貨幣符號
  "currency": "TWD" | "USD" | "EUR",
  "items": [
    {
      "productName": string,
      "quantity": number,      // 正整數
      "unitPrice": number
    }
  ],
  "shippingAddress": {
    "recipient": string,
    "address": string,
    "city": string,
    "postalCode": string
  }
}

訂單確認信：
[貼上信件內容]
```

---

## 常見錯誤

- **Schema 過於複雜**：巢狀層級太深或欄位太多，模型容易遺漏或填錯欄位
- **未要求純 JSON 輸出**：模型在 JSON 外加入解釋文字，導致解析失敗
- **缺少邊界條件說明**：未說明 null、空陣列等邊界情況的處理方式
- **依賴 LLM 做型別轉換**：應在程式層進行型別驗證，不應完全信任 LLM 的型別正確性
- **忽略選填欄位的預設值**：未說明選填欄位缺失時應輸出 null 還是省略該欄位
