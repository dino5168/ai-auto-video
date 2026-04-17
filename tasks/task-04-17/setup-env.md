
# 問題描述
@app-front/src/App.tsx
  
 async function sendMessage() 這個函數
...
const res = await fetch('http://127.0.0.1:8000/api/v1/chat/stream', {
...

目前的 fetch url 使用 硬編碼寫在 App.tsx 

# 問題解決方案
使用 .env 設定環境變數、將硬編碼的部分移至
.env

# 解決方案評估
列出解決步驟

# 執行方式

依據 問題描述、評估解決方案、列出解決步驟。詢問使用者是否依據解決步驟執行。