from datetime import datetime
from pydantic import BaseModel

from app.models.message import SenderType, MessageRole


class MessageCreate(BaseModel):
    conversation_id: int
    sender_type: SenderType
    sender_user_id: int | None = None
    content: str
    message_role: MessageRole
    parent_message_id: int | None = None
    is_visible_to_user: bool = True
    metadata_json: dict | None = None


class MessageRead(BaseModel):
    message_id: int
    conversation_id: int
    sender_type: SenderType
    sender_user_id: int | None
    content: str
    message_role: MessageRole
    parent_message_id: int | None
    is_visible_to_user: bool
    metadata_json: dict | None
    created_at: datetime

    model_config = {"from_attributes": True}
