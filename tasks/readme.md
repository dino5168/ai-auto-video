
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
# 提交並結算任務
commit-task() {
    local branch_name
    branch_name=$(_assert_on_task_branch) || return 1

    local commit_msg="${1:-Complete $branch_name}"

    echo "🔍 修改的檔案："
    git status --short

    if git diff-index --quiet HEAD -- && [ -z "$(git ls-files --others --exclude-standard)" ]; then
        echo "⚠️  沒有任何變更可以提交。"
        return 1
    fi

    if [ -f "package.json" ]; then
        echo "🧪 執行測試 (npm test)..."
        if npm test; then
            echo "✅ 測試通過！"
        else
            echo "❌ 測試失敗！請修正後再提交，或執行 abort-task 放棄。"
            return 1
        fi
    fi

    git add .
    git commit -m "$commit_msg" || return 1

    echo "🚀 推送至遠端..."
    git push -u origin "$branch_name" || return 1

    echo ""
    echo "🎉 任務 [$branch_name] 已提交並推送！"
    echo "   訊息: $commit_msg"
    echo "   PR: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]//;s/\.git$//')/pull/new/$branch_name"

    unset CURRENT_TASK
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

