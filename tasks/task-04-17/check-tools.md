
# 檢核
 檢核 @D:\repo-project\ai-auto-video\app-backend\app\api\v1\routes\chat.py

### 檢核區塊
 ```python
 # 載入工具指令定義

_tool_commands: set[str] = set()

if settings.SYSTEM_TOOLS:

    _tools_data = json.loads(Path(settings.SYSTEM_TOOLS).read_text(encoding="utf-8"))

    _tool_commands = {t["command"] for t in _tools_data.get("tools", [])}
 ```

# Bug 偵錯

1. 檢核 前端輸入 /clear 時、後端是否有 清除 上下文只保留 system prompt?

# 執行方式

1. 先檢核程式是否有 Bug.
2. 如果有 列出 bug 與造成的原因。 列出處理 bug 的步驟。詢問使用者是否依據處理 bug 的步驟執行。
3. 如果沒有 回應 OK。
