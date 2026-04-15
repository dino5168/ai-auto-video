# 目標增加 AI 代理可以使用外部工具。

### 提示詞設定

步驟 1 :
.env,.env.example 加入
SYSTEM_TOOLS = C:\repo\repo-agent\app-backend\system-env\tools.json

步驟 2 : 
設定 tools.json 使用 json 格式定義工具 。
新增一個 clear 命令 : 可以清除 C:\repo\repo-agent\app-backend\app\api\v1\routes\chat.py
我輸入 /clear 時 可以清除
程式內的 messages 注意: 不要清除  messages = [{"role": "system", "content": _system_prompt}] 
設定的 系統提示詞

步驟3 : 
增加 一個 可以使用 /clear 的 範例提示詞 到 C:\repo\repo-agent\app-backend\docs\command-use-example.md 

執行步驟時請讓我確認。 步驟2: 如果有疑問的時候要問我。






