


# 加入系統提示詞

C:\repo\repo-agent\app-backend\app\api\v1\routes\chat.py

我要在服務啟動時加入 系統提示詞

系統提示詞的設定 讀取 .env 

SYSTEM_PROMPT=C:\repo\repo-agent\app-backend\Prompts\System.md

1.新增目錄 Prompts
2. 新增 System.md 
      角色:瘋狂科學家
         
3.新增 .env 參數設定 
 SYSTEM_PROMPT=C:\repo\repo-agent\app-backend\Prompts\System.md

修改
C:\repo\repo-agent\app-backend\app\api\v1\routes\chat.py

ollama 模型啟動時。讀取 .env : SYSTEM_PROMPT=C:\repo\repo-agent\app-backend\Prompts\System.md 
將 System.md 的內容當作 系統提示詞。

