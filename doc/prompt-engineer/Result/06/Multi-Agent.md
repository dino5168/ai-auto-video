# Multi-Agent（多智能體協作）

## 說明

Multi-Agent 範式是指設計一個由多個 Agent 組成的協作系統，其中 Orchestrator Agent（協調者）負責理解目標、分解任務、分配工作，Specialist Agents（專家代理）各自負責特定領域的子任務，最後由協調者整合各方輸出得出最終結果。

這個範式的核心優勢在於「分工專業化」——每個 Agent 只需在自己擅長的範疇內表現，避免單一 Agent 在複雜任務中因需要同時處理太多面向而品質下降。同時，多 Agent 也支援並行處理，提升效率。

---

## 使用時機

| 情境 | 說明 |
|------|------|
| 複雜多面向任務 | 任務涉及多個專業領域，難以由單一 Agent 高品質完成 |
| 需要並行處理 | 多個子任務相互獨立，可以同時進行以節省時間 |
| 需要多角度驗證 | 不同 Agent 從不同角度審查同一輸出，提升可靠性 |
| 大型自動化工作流 | 長時間運行的複雜工作流，需要明確的責任分工 |
| 模擬多方討論 | 讓不同立場的 Agent 進行辯論或協商 |

---

## 使用提示

- 明確定義每個 Agent 的**職責邊界**，避免 Agent 之間的工作重疊或空缺
- 設計**清晰的 Agent 間通訊格式**，讓 Orchestrator 能解析各 Agent 的輸出
- Orchestrator 應負責**任務完成度的驗證**，不應盲目信任 Specialist Agent 的輸出
- 設計**衝突解決機制**：當多個 Agent 給出矛盾結論時如何處理
- 考慮**Agent 失敗的處理**：某個 Specialist Agent 無法完成任務時的降級策略

---

## 提示詞範例

### 範例 1：Orchestrator Agent 提示詞設計

```
你是一個研究報告的 Orchestrator Agent。
你的任務是協調以下 Specialist Agents 完成一份完整的市場分析報告。

可用的 Specialist Agents：
- market_analyst：分析市場規模、趨勢、成長率
- competitor_analyst：分析競爭對手、市場份額、差異化策略
- customer_researcher：分析目標客群、需求、痛點
- financial_modeler：建立財務預測模型
- risk_assessor：識別風險與不確定性

你的工作流程：
1. 接收任務後，拆解為各 Agent 的子任務
2. 以以下格式分配任務：
   <assign_task agent="agent_name">
   {"task": "...", "context": "...", "expected_output": "..."}
   </assign_task>
3. 收到各 Agent 回傳後，檢查輸出品質（是否符合 expected_output）
4. 整合所有輸出，生成最終報告

任務：分析台灣 B2B SaaS 市場的進入機會，重點聚焦在中小企業 ERP 領域。
```

---

### 範例 2：Specialist Agent 提示詞設計

```
你是 competitor_analyst，一個專門分析競爭格局的 Specialist Agent。

你的職責邊界：
✅ 負責：競爭對手識別、功能比較、定價策略、市場份額估算、差異化分析
❌ 不負責：財務預測、客戶需求分析、整體市場規模

接收格式（來自 Orchestrator）：
{"task": string, "context": string, "expected_output": string}

輸出格式（回傳給 Orchestrator）：
{
  "agent": "competitor_analyst",
  "status": "completed" | "partial" | "failed",
  "output": {
    "competitors": [...],
    "competitive_matrix": {...},
    "key_differentiators": [...],
    "market_positioning_gaps": [...]
  },
  "confidence": 0.0-1.0,
  "limitations": [...]
}

收到的任務：
{"task": "分析台灣中小企業 ERP 市場的主要競爭者", "context": "B2B SaaS 市場進入分析", "expected_output": "競爭者清單與差異化分析"}
```

---

### 範例 3：多 Agent 辯論與共識機制

```
本次任務使用三個 Agent 進行結構化辯論，以評估一項重要決策。

三個 Agent 角色：
- advocate_agent：為決策尋找支持論點，扮演「支持者」
- critic_agent：找出決策的缺陷與風險，扮演「批評者」
- mediator_agent：綜合雙方觀點，給出平衡評估，扮演「仲裁者」

辯論流程：
輪次 1：advocate_agent 提出 3 個支持論點
輪次 2：critic_agent 針對每個論點提出反駁，並補充 2 個獨立的風險點
輪次 3：advocate_agent 回應批評，強化或修正其論點
輪次 4：mediator_agent 整合雙方，給出最終建議與條件

決策：「將公司的核心業務從 B2C 轉型為 B2B 模式」

請依序模擬三個 Agent 的輸出，每個 Agent 發言前標示 [Agent 名稱]。
```

---

## 常見錯誤

- **Orchestrator 職責不清**：Orchestrator 同時執行 Specialist 工作，喪失分工意義
- **Agent 之間直接通訊**：Specialist Agents 繞過 Orchestrator 互相調用，導致流程混亂
- **缺乏輸出品質驗證**：Orchestrator 不驗證 Specialist 輸出就直接整合，錯誤被帶入最終結果
- **過度設計**：簡單任務拆成多個 Agent 只增加複雜度，單一 Agent 就能處理的不需要 Multi-Agent
- **沒有衝突解決機制**：多個 Agent 給出矛盾結論時系統不知如何處理
