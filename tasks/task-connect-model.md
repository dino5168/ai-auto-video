
 我的電腦已經安裝 ollama 

### ollam 連接 model gemma4:e2b

### 範例碼
```
import ollama

def start_chat():
    model_name = 'gemma4:e2b'
    print(f"--- 正在與 {model_name} 建立連線 ---")
    print("輸入 '/exit' 即可結束對話。\n")

    # 初始化對話歷史（如果想要模型記得上文，可以把對話存入此串列）
    chat_history = []

    while True:
        # 1. 取得使用者輸入 (Request)
        user_input = input("You: ").strip()

        # 2. 判斷是否要離開
        if user_input.lower() == '/exit':
            print("再見！結束對話。")
            break
        
        if not user_input:
            continue

        # 將使用者的話加入紀錄
        chat_history.append({'role': 'user', 'content': user_input})

        print("Gemma: ", end='', flush=True)

        try:
            # 3. 發送至 LLM 並使用串流輸出 (Response)
            stream = ollama.chat(
                model=model_name,
                messages=chat_history,
                stream=True,
            )

            full_response = ""
            for chunk in stream:
                content = chunk['message']['content']
                print(content, end='', flush=True)
                full_response += content
            
            print("\n" + "-"*30) # 分隔線

            # 將 LLM 的回答也存入歷史，這樣它才能「記得」你剛才說過的話
            chat_history.append({'role': 'assistant', 'content': full_response})

        except Exception as e:
            print(f"\n發生錯誤：{e}")
            break

if __name__ == "__main__":
    start_chat()
```

### 工作目標

1. 後端程式 App-backend fast api 建立一個 router 可以與 ollama 對話。
2. 將 model  的參數讀取 .env 取得。
3. 優化範例碼。

