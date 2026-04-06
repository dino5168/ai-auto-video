# 後端專案安裝步驟：FastAPI + PostgreSQL + uv

## 前置確認

```bash
python --version   # 需 v3.12 以上
uv --version       # 需 v0.4 以上
```

> 尚未安裝 uv？執行：
> ```bash
> # Windows (PowerShell)
> powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
> ```

---

## Step 1：建立專案

將 `<your-app-name>` 替換為你的專案名稱：

```bash
uv init <your-app-name>
cd <your-app-name>
```

---

## Step 2：設定 Python 版本

```bash
uv python pin 3.12
```

---

## Step 3：安裝套件

```bash
uv add fastapi[standard] pydantic-settings asyncpg sqlalchemy[asyncio] alembic psycopg2-binary
uv add --dev pytest pytest-asyncio httpx
```

| 套件 | 用途 |
|------|------|
| `fastapi[standard]` | FastAPI + uvicorn + python-multipart |
| `pydantic-settings` | 環境變數設定管理 |
| `sqlalchemy[asyncio]` | ORM（async 支援） |
| `asyncpg` | PostgreSQL async driver |
| `alembic` | 資料庫 migration |
| `psycopg2-binary` | alembic CLI 需要的同步 driver |
| `pytest-asyncio` + `httpx` | 非同步測試 |

---

## Step 4：建立專案結構

```bash
mkdir -p app/api/v1/routes
mkdir -p app/core
mkdir -p app/db
mkdir -p app/models
mkdir -p app/schemas
mkdir -p tests
```

最終目錄結構：

```
<your-app-name>/
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── routes/
│   ├── core/
│   │   ├── config.py       # pydantic-settings 設定
│   │   └── database.py     # SQLAlchemy async engine
│   ├── models/             # SQLAlchemy ORM models
│   ├── schemas/            # Pydantic request/response schemas
│   └── main.py
├── tests/
├── alembic/
├── alembic.ini
├── .env
├── .env.example
└── pyproject.toml
```

---

## Step 5：建立設定檔 `app/core/config.py`

```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    APP_NAME: str = "My App"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # Database
    POSTGRES_HOST: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def DATABASE_URL_SYNC(self) -> str:
        """供 alembic 使用的同步連線字串"""
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


settings = Settings()
```

---

## Step 6：建立資料庫連線 `app/core/database.py`

```python
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

---

## Step 7：建立主程式 `app/main.py`

```python
from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    yield
    # shutdown


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan,
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": settings.APP_VERSION}
```

---

## Step 8：初始化 Alembic

```bash
uv run alembic init alembic
```

修改 `alembic/env.py`，找到並替換以下兩段：

```python
# 頂部加入
from app.core.config import settings
from app.core.database import Base

# 替換 config.set_main_option 那行
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL_SYNC)

# 替換 target_metadata
target_metadata = Base.metadata
```

---

## Step 9：產生 `.env` 與 `.env.example`

執行以下 Python script 一次性產生兩個檔案：

```bash
uv run python -c "
import os

env_content = '''APP_NAME=My App
APP_VERSION=0.1.0
DEBUG=False

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=mydb
'''

example_content = '''APP_NAME=My App
APP_VERSION=0.1.0
DEBUG=False

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=
POSTGRES_DB=mydb
'''

with open('.env', 'w', encoding='utf-8') as f:
    f.write(env_content)

with open('.env.example', 'w', encoding='utf-8') as f:
    f.write(example_content)

print('✓ .env 已建立')
print('✓ .env.example 已建立')
"
```

> ⚠️ 記得將 `.env` 加入 `.gitignore`：
> ```bash
> echo ".env" >> .gitignore
> ```

---

## Step 10：建立第一次 Migration 並套用

確認 PostgreSQL 已啟動且 DB 已建立，再執行：

```bash
uv run alembic revision --autogenerate -m "init"
uv run alembic upgrade head
```

---

## Step 11：啟動開發伺服器

```bash
uv run fastapi dev app/main.py
```

瀏覽器開啟：
- API：`http://localhost:8000`
- Swagger UI：`http://localhost:8000/docs`
- Health Check：`http://localhost:8000/health`

---

## 常見錯誤排查

| 錯誤訊息 | 解決方式 |
|----------|----------|
| `connection refused` on port 5432 | 確認 PostgreSQL 服務已啟動，port 與 `.env` 一致 |
| `ModuleNotFoundError: No module named 'app'` | 確認在專案根目錄執行，或設定 `PYTHONPATH=.` |
| `asyncpg` 連線失敗但 psycopg2 正常 | 確認 `asyncpg` 已安裝，DATABASE_URL 使用 `postgresql+asyncpg://` |
| alembic autogenerate 偵測不到 model | 確認 `alembic/env.py` 已正確 import `Base.metadata` |
| `pydantic_settings ValidationError` | 確認 `.env` 存在且 `POSTGRES_*` 欄位均已填寫 |
