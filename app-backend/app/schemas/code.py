from datetime import datetime

from pydantic import BaseModel


class CodeCreate(BaseModel):
    category: str
    code: str
    name: str
    sort_order: int = 0
    is_active: bool = True
    description: str | None = None


class CodeResponse(CodeCreate):
    model_config = {"from_attributes": True}

    id: int
    created_at: datetime | None
    updated_at: datetime | None
