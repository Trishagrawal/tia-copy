import enum
from datetime import datetime

from sqlalchemy import String, Text, Enum, ForeignKey, DateTime, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class CriteriaType(str, enum.Enum):
    streak_days = "streak_days"
    tasks_completed = "tasks_completed"
    projects_completed = "projects_completed"
    custom = "custom"


class Badge(Base):
    __tablename__ = "badges"

    badge_id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    icon_url: Mapped[str | None] = mapped_column(String(500))
    criteria_type: Mapped[CriteriaType] = mapped_column(Enum(CriteriaType), nullable=False)
    criteria_value: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # relationships
    user_badges = relationship("UserBadge", back_populates="badge")


class UserBadge(Base):
    __tablename__ = "user_badges"

    user_badge_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    badge_id: Mapped[int] = mapped_column(ForeignKey("badges.badge_id"), nullable=False)
    earned_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    metadata_json: Mapped[dict | None] = mapped_column("metadata", JSON)

    # relationships
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge", back_populates="user_badges")
