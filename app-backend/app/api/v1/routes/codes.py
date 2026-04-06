from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.code import Code
from app.schemas.code import CodeCreate, CodeResponse

router = APIRouter(prefix="/codes", tags=["codes"])


@router.get("", response_model=list[CodeResponse])
async def get_codes(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(Code).order_by(Code.sort_order, Code.id))
    return result.scalars().all()


@router.post("", response_model=CodeResponse, status_code=201)
async def create_code(payload: CodeCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    code = Code(**payload.model_dump())
    db.add(code)
    await db.flush()
    await db.refresh(code)
    return code
