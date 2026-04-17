
# 任務

在 @D:\repo-project\ai-auto-video\app-backend\app\api\v1\routes\chat.py 有設計
# 載入工具指令定義

```python
_tool_commands: set[str] = set()

if settings.SYSTEM_TOOLS:

    _tools_data = json.loads(Path(settings.SYSTEM_TOOLS).read_text(encoding="utf-8"))

    _tool_commands = {t["command"] for t in _tools_data.get("tools", [])}
```


@D:\repo-project\ai-auto-video\app-backend\system-env\tools.json

```json
{

  "tools": [

    {

      "command": "/clear",

      "description": "清除對話歷史，保留系統提示詞",

      "action": "clear_messages"

    }

  ]

}
```

# 需求
後端程式
增加一個 /webfetch [url] 可以抓取 網頁內容的功能。[url]使用者輸入。

