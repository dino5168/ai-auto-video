from datetime import datetime

from sqlalchemy import Boolean, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Code(Base):
    __tablename__ = "code"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    code: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int | None] = mapped_column(Integer, server_default="0")
    is_active: Mapped[bool | None] = mapped_column(Boolean, server_default="true")
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime | None] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(server_default=func.now())
