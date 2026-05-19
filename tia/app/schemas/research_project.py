from datetime import datetime
from pydantic import BaseModel

from app.models.research_project import ProjectStatus, FacultyRole


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    course_code: str | None = None
    faculty_supervisor_id: int | None = None
    status: ProjectStatus = ProjectStatus.planning
    main_deadline: datetime | None = None


class ProjectRead(BaseModel):
    project_id: int
    owner_user_id: int
    title: str
    description: str | None
    course_code: str | None
    faculty_supervisor_id: int | None
    status: ProjectStatus
    main_deadline: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    course_code: str | None = None
    faculty_supervisor_id: int | None = None
    status: ProjectStatus | None = None
    main_deadline: datetime | None = None


class ProjectFacultyCreate(BaseModel):
    faculty_user_id: int
    role: FacultyRole = FacultyRole.supervisor


class ProjectFacultyRead(BaseModel):
    project_faculty_id: int
    project_id: int
    faculty_user_id: int
    role: FacultyRole

    model_config = {"from_attributes": True}
