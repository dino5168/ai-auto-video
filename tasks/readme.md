
# 如何管理 git 

```bash
# Load Angular CLI autocompletion.
source <(ng completion script)
# 測試使用　hello 
test-hello() {
  echo "Hello, $1"
}
# 開始新任務：同步主線並開啟沙盒分支
start-task() {
    if [ -z "$1" ]; then
        echo "❌ 錯誤：請提供任務名稱 (例如: start-task add-video-processor)"
        return 1
    fi
    local branch_name="task/$1"
    echo "正在切換回 main 並拉取最新代碼..."
    git checkout main && git pull
    echo "正在建立並切換至新分支: $branch_name"
    git checkout -b "$branch_name"
    echo "🚀 沙盒環境已就緒，現在可以叫 Claude Code 開始工作了！"
}

# 回復並清理失敗的任務
abort-task() {

    local branch_name=$(git rev-parse --abbrev-ref HEAD)

    if [ "$branch_name" = "main" ]; then
        echo "⚠️ 你已經在 main 分支了。"
        return
    fi
    echo "正在放棄分支: $branch_name 並回到 main..."
    git checkout main
    git branch -D "$branch_name"
    echo "✅ 已回復乾淨狀態。"
}

# 提交並結算任務
commit-task() {
    # 1. 取得當前分支名稱
    local branch_name=$(git rev-parse --abbrev-ref HEAD)
    if [ "$branch_name" = "main" ]; then
        echo "⚠️ 錯誤：你正在 main 分支，請在任務分支執行。"
        return 1
    fi
    echo "🔍 步驟 1: 列出所有修改過的檔案..."
    git status --short
    echo "🧪 步驟 2: 執行測試 (npm test)..."
    # 這裡可以根據你的專案換成 pytest, go test 等
    if npm test; then
        echo "✅ 測試通過！"
    else
        echo "❌ 測試失敗！請修正後再提交，或執行 abort-task 放棄。"
        return 1
    fi
    # 3. 提示輸入 Commit Message
    echo "📝 請輸入 Commit 訊息 (例如: 實作影片處理器):"
    read commit_msg
    if [ -z "$commit_msg" ]; then

        commit_msg="Complete $branch_name"

    fi

    # 4. 執行提交
    git add .
    git commit -m "$commit_msg"
    echo "🎉 任務 '$branch_name' 已成功本地提交！"
    echo "💡 提示：現在你可以執行 'git push' 或合併回 main。"
}
```
### .bashrc 檔案 寫 function


### .claude/settings.json 設定路徑

```json
  "env": {
    "BASH_ENV": "/c/Users/DINO/.bashrc"
  }

```

### 列出 .bashrc 的自訂義命令

```bash
# 列出所有命令
!source ~/.bashrc && declare -F 
# 列出自訂意命令
!source ~/.bashrc && declare -F | grep -v '^declare -f _'
```

