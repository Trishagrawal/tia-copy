import enum
from datetime import datetime

from sqlalchemy import String, Text, Enum, ForeignKey, DateTime, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TaskType(str, enum.Enum):
    reading = "reading"
    writing = "writing"
    analysis = "analysis"
    meeting = "meeting"
    admin = "admin"
    other = "other"


class TaskStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    done = "done"
    overdue = "overdue"


class TaskPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Task(Base):
    __tablename__ = "tasks"

    task_id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("research_projects.project_id"), nullable=False)
    created_by_user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    type: Mapped[TaskType] = mapped_column(Enum(TaskType), default=TaskType.other)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.not_started)
    priority: Mapped[TaskPriority] = mapped_column(Enum(TaskPriority), default=TaskPriority.medium)
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    estimated_minutes: Mapped[int | None] = mapped_column(Integer)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    project = relationship("ResearchProject", back_populates="tasks")
    creator = relationship("User", back_populates="tasks")
