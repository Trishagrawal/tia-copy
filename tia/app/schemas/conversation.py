from datetime import datetime
from pydantic import BaseModel


class ConversationCreate(BaseModel):
    project_id: int | None = None
    tia_profile_id: int | None = None
    title: str | None = None


class ConversationRead(BaseModel):
    conversation_id: int
    user_id: int
    project_id: int | None
    tia_profile_id: int | None
    title: str | None
    is_archived: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationUpdate(BaseModel):
    title: str | None = None
    is_archived: bool | None = None
