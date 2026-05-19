import enum
from datetime import date, datetime

from sqlalchemy import Enum, ForeignKey, DateTime, Date, Boolean, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class StreakEventType(str, enum.Enum):
    streak_started = "streak_started"
    streak_extended = "streak_extended"
    streak_broken = "streak_broken"
    badge_earned = "badge_earned"


class StreakSnapshot(Base):
    __tablename__ = "streak_snapshots"

    streak_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    did_research_activity: Mapped[bool] = mapped_column(Boolean, default=False)
    research_minutes: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # relationships
    user = relationship("User", back_populates="streak_snapshots")


class UserStreakStatus(Base):
    __tablename__ = "user_streak_status"

    user_streak_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), unique=True, nullable=False)
    current_streak_days: Mapped[int] = mapped_column(Integer, default=0)
    longest_streak_days: Mapped[int] = mapped_column(Integer, default=0)
    last_active_date: Mapped[date | None] = mapped_column(Date)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    user = relationship("User", back_populates="streak_status")


class StreakEvent(Base):
    __tablename__ = "streak_events"

    streak_event_id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    event_type: Mapped[StreakEventType] = mapped_column(Enum(StreakEventType), nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    metadata_json: Mapped[dict | None] = mapped_column("metadata", JSON)

    # relationships
    user = relationship("User", back_populates="streak_events")
