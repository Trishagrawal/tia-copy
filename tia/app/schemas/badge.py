from datetime import datetime
from pydantic import BaseModel

from app.models.badge import CriteriaType


class BadgeCreate(BaseModel):
    code: str
    name: str
    description: str | None = None
    icon_url: str | None = None
    criteria_type: CriteriaType
    criteria_value: int


class BadgeRead(BaseModel):
    badge_id: int
    code: str
    name: str
    description: str | None
    icon_url: str | None
    criteria_type: CriteriaType
    criteria_value: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserBadgeRead(BaseModel):
    user_badge_id: int
    user_id: int
    badge_id: int
    earned_at: datetime
    metadata_json: dict | None

    model_config = {"from_attributes": True}
