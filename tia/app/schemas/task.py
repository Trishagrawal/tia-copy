from datetime import datetime
from pydantic import BaseModel

from app.models.task import TaskType, TaskStatus, TaskPriority


class TaskCreate(BaseModel):
    project_id: int
    title: str
    description: str | None = None
    type: TaskType = TaskType.other
    due_date: datetime | None = None
    priority: TaskPriority = TaskPriority.medium
    order_index: int = 0
    estimated_minutes: int | None = None


class TaskRead(BaseModel):
    task_id: int
    project_id: int
    created_by_user_id: int
    title: str
    description: str | None
    type: TaskType
    due_date: datetime | None
    status: TaskStatus
    priority: TaskPriority
    order_index: int
    estimated_minutes: int | None
    completed_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    type: TaskType | None = None
    due_date: datetime | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    order_index: int | None = None
    estimated_minutes: int | None = None
