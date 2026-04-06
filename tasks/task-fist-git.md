# Task: First Git Push to GitHub

## Goal
Initialize git repository and push all source code to https://github.com/dino5168/ai-auto-video

## Steps

### Step 1: Verify .gitignore exists
Check that `.gitignore` exists at project root. If not, create it with standard rules for:
- Python `.venv/`, `__pycache__/`, `*.pyc`
- Node `node_modules/`, `dist/`
- `.env` files (keep `.env.example`)
- `output/`, `log/` directories
- `.claude/settings.local.json`
- `tasks/.obsidian/`

### Step 2: Initialize git (if not already done)
```bash
git init
git remote add origin https://github.com/dino5168/ai-auto-video.git
```

### Step 3: Verify what will be committed
```bash
git status
git add .
git status
```
Review the staged files. Confirm that `.venv/`, `node_modules/`, `.env`, `output/`, `log/` are NOT staged.

### Step 4: Commit and push
```bash
git commit -m "feat: initial project setup

- app-backend: FastAPI + SQLAlchemy + Alembic (Python 3.12, uv)
- app-frontend: React + TypeScript + Vite
- Project documentation and task templates"

git branch -M main
git push -u origin main
```

### Step 5: Verify
Confirm push succeeded and check https://github.com/dino5168/ai-auto-video shows the correct files.

## Safety Checks
- NEVER commit `.env` (contains API keys)
- NEVER commit `.venv/` or `node_modules/` (regenerable)  
- NEVER commit `output/` (generated video/audio files)
- NEVER commit `.claude/settings.local.json` (local machine config)