import enum
from datetime import datetime

from sqlalchemy import String, Text, Boolean, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Tone(str, enum.Enum):
    formal = "formal"
    casual = "casual"
    encouraging = "encouraging"
    critical = "critical"
    humorous = "humorous"


class TiaProfile(Base):
    __tablename__ = "tia_profiles"

    tia_profile_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    tone: Mapped[Tone] = mapped_column(Enum(Tone), nullable=False, default=Tone.encouraging)
    expertise_area: Mapped[str | None] = mapped_column(String(150))
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    user = relationship("User", back_populates="tia_profiles")
    conversations = relationship("Conversation", back_populates="tia_profile")
