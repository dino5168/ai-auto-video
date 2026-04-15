# 指令使用範例

## `/clear` — 清除對話歷史

### 說明

輸入 `/clear` 可清除目前的對話歷史，伺服器會丟棄所有 user / assistant 訊息，**保留系統提示詞（system prompt）**，讓對話從乾淨的狀態重新開始。

---

### 使用方式

在對話中，將 `/clear` 作為獨立一則訊息送出：

```json
POST /api/v1/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "你好，請幫我寫一首詩。" },
    { "role": "assistant", "content": "好的，以下是一首詩..." },
    { "role": "user", "content": "/clear" }
  ]
}
```

### 回應

```json
{
  "role": "assistant",
  "content": "對話已清除。"
}
```

---

### 串流版本（`/stream`）

```json
POST /api/v1/chat/stream
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "之前說了很多話..." },
    { "role": "user", "content": "/clear" }
  ]
}
```

SSE 回應：
```
data: {"content": "對話已清除。"}

data: [DONE]
```

---

### 注意事項

| 項目 | 說明 |
|------|------|
| 觸發條件 | 最後一則 user 訊息內容**完全等於** `/clear`（前後空白會自動忽略） |
| 系統提示詞 | 不會被清除，下一輪對話仍會套用 |
| 不送 Ollama | 觸發 `/clear` 時，伺服器直接回應，不呼叫 LLM |
| 前端責任 | 收到 `"對話已清除。"` 後，前端應將本地 `messages` 陣列重置（只保留 system prompt，若有） |

---

### 前端整合範例（TypeScript）

```typescript
async function sendMessage(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("/api/v1/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();

  if (data.content === "對話已清除。") {
    // 重置本地對話歷史
    messages.length = 0;
  }

  return data.content;
}
```
