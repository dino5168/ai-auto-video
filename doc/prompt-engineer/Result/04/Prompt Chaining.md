# Prompt Chaining（提示詞串聯）

## 說明

Prompt Chaining 範式是指將一個複雜任務拆解為有序的 prompt 序列，每一輪的輸出作為下一輪的結構化輸入，形成一個可組合的處理管線（Pipeline）。

這個範式屬於 **orchestration 層**的設計——它不只是告訴模型「怎麼做」，而是定義了一套跨越多個模型呼叫的工作流程，讓每一步都有明確的輸入、處理邏輯與輸出。

與 Plan-Then-Execute 的差異：Plan-Then-Execute 是**在同一個對話**中先規劃後執行；Prompt Chaining 是**跨多個獨立 API 呼叫**的串聯，通常由程式碼負責協調。

---

## 使用時機

| 情境 | 說明 |
|------|------|
| 長文處理 Pipeline | 分段摘要 → 整合摘要 → 重點萃取 |
| 資料萃取與轉換 | 提取 → 清洗 → 格式化 → 驗證 |
| 多階段內容生成 | 大綱 → 初稿 → 潤稿 → 格式化 |
| 多步驟分析 | 資料分析 → 洞察生成 → 建議制定 |
| Agent 工作流 | 規劃 → 工具呼叫 → 結果整合 → 輸出 |

---

## 使用提示

- 每個 prompt 節點應有**明確定義的輸入 schema 與輸出 schema**
- 節點輸出盡量使用**結構化格式**（JSON），方便程式化傳遞到下一節點
- 設計**錯誤處理機制**：某一節點輸出不符預期時如何處理
- 適度在節點之間加入**人工審核點**（Human-in-the-Loop）
- 避免設計過長的 chain：每增加一個節點都會累積錯誤傳播風險

---

## 提示詞範例

### 範例 1：長文摘要 Pipeline（三節點）

**節點 1：分段摘要**
```
以下是一篇長文的第 {section_number} 段（共 {total_sections} 段）。
請將這段內容摘要為 3-5 個重點，以 JSON 陣列格式輸出。
只輸出 JSON，不要有其他文字。

輸出格式：
{"section": {section_number}, "key_points": ["重點1", "重點2", ...]}

段落內容：
{section_content}
```

**節點 2：整合摘要**
```
以下是一篇文章各段落的重點摘要，格式為 JSON 陣列。
請整合所有段落的重點，生成一份 200 字以內的全文摘要。
以 JSON 格式輸出。

輸出格式：
{"summary": "整合後的摘要文字", "total_sections": {n}}

各段重點：
{sections_json}
```

**節點 3：行動項目萃取**
```
以下是一篇文章的摘要。
請從中識別所有「需要採取行動」的項目，
以 JSON 陣列格式輸出，每個項目包含行動描述與優先級。

輸出格式：
{"action_items": [{"action": "...", "priority": "high|medium|low"}]}

文章摘要：
{summary}
```

---

### 範例 2：履歷篩選 Pipeline（四節點）

**節點 1：資訊提取**
```
請從以下履歷文字中提取結構化資訊。只輸出 JSON。

輸出 Schema：
{
  "name": string,
  "years_of_experience": number,
  "skills": string[],
  "education_level": "高中" | "大學" | "碩士" | "博士",
  "current_title": string
}

履歷內容：{resume_text}
```

**節點 2：需求符合度評分**
```
以下是應徵者的結構化資料與職位需求，
請評估每個需求的符合度，輸出評分 JSON。

職位需求：{job_requirements_json}
應徵者資料：{candidate_json}

輸出格式：
{
  "scores": {"requirement_key": score_0_to_10},
  "overall_score": number,
  "critical_gaps": string[]
}
```

**節點 3：篩選決策**
```
根據以下評分結果，判斷是否進入下一輪面試。
overall_score >= 7 且 critical_gaps 為空：建議進入
overall_score >= 5 且 critical_gaps <= 1 項：建議保留
其餘：不建議

輸出格式：{"decision": "進入" | "保留" | "不建議", "reason": string}

評分結果：{scores_json}
```

---

### 範例 3：內容生成 Pipeline（三節點）

**節點 1：大綱生成**
```
請為以下主題生成一份部落格文章大綱。
只輸出 JSON，不要有其他文字。

輸出格式：
{
  "title": "文章標題",
  "sections": [
    {"heading": "章節標題", "key_points": ["重點1", "重點2"]}
  ]
}

主題：{topic}
目標字數：{word_count}
目標受眾：{audience}
```

**節點 2：逐節展開**
```
以下是文章大綱中的一個章節。
請將這個章節展開為完整的段落（約 {target_words} 字）。
只輸出段落文字，不要包含標題。

章節資訊：{section_json}
文章整體脈絡：{article_context}
```

**節點 3：全文潤稿**
```
以下是一篇文章的初稿（各節已分別生成）。
請進行全文潤稿，確保：
1. 各節之間的語氣與風格一致
2. 段落之間有適當的銜接語
3. 修正任何重複或矛盾的內容

保持原文的核心內容，只調整表達方式。輸出完整的修改後全文。

初稿：{draft_text}
```

---

## 常見錯誤

- **節點間格式不一致**：前一節點的輸出格式與後一節點期望的輸入格式不符，導致 pipeline 中斷
- **錯誤未被捕捉就傳遞**：某節點產生了不正確的輸出，但沒有驗證就傳入下一節點，導致錯誤累積放大
- **節點太多**：超過 5~6 個節點後，錯誤傳播風險大幅上升，建議合併相關節點
- **缺乏 Human-in-the-Loop**：對高風險的中間結果沒有設置人工確認點
- **把 Prompt Chaining 用在簡單任務**：單一 prompt 能解決的問題不需要 chain，增加延遲與成本
