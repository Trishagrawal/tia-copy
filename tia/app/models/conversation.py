from datetime import datetime

from sqlalchemy import String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    conversation_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("research_projects.project_id"))
    tia_profile_id: Mapped[int | None] = mapped_column(ForeignKey("tia_profiles.tia_profile_id"))
    title: Mapped[str | None] = mapped_column(String(300))
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    user = relationship("User", back_populates="conversations")
    project = relationship("ResearchProject", back_populates="conversations")
    tia_profile = relationship("TiaProfile", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")
