import enum
from datetime import datetime

from sqlalchemy import String, Text, Enum, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ProjectStatus(str, enum.Enum):
    planning = "planning"
    in_progress = "in_progress"
    submitted = "submitted"
    completed = "completed"
    archived = "archived"


class FacultyRole(str, enum.Enum):
    supervisor = "supervisor"
    reviewer = "reviewer"
    reader = "reader"


class ResearchProject(Base):
    __tablename__ = "research_projects"

    project_id: Mapped[int] = mapped_column(primary_key=True)
    owner_user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    course_code: Mapped[str | None] = mapped_column(String(50))
    faculty_supervisor_id: Mapped[int | None] = mapped_column(ForeignKey("users.user_id"))
    status: Mapped[ProjectStatus] = mapped_column(Enum(ProjectStatus), default=ProjectStatus.planning)
    main_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # relationships
    owner = relationship("User", back_populates="owned_projects", foreign_keys=[owner_user_id])
    supervisor = relationship("User", back_populates="supervised_projects", foreign_keys=[faculty_supervisor_id])
    faculty_members = relationship("ProjectFaculty", back_populates="project")
    tasks = relationship("Task", back_populates="project")
    conversations = relationship("Conversation", back_populates="project")


class ProjectFaculty(Base):
    __tablename__ = "project_faculty"

    project_faculty_id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("research_projects.project_id"), nullable=False)
    faculty_user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), nullable=False)
    role: Mapped[FacultyRole] = mapped_column(Enum(FacultyRole), default=FacultyRole.supervisor)

    # relationships
    project = relationship("ResearchProject", back_populates="faculty_members")
    faculty = relationship("User")
