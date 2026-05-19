from datetime import date, datetime
from pydantic import BaseModel

from app.models.streak import StreakEventType


class StreakSnapshotCreate(BaseModel):
    date: date
    did_research_activity: bool = False
    research_minutes: int | None = None


class StreakSnapshotRead(BaseModel):
    streak_id: int
    user_id: int
    date: date
    did_research_activity: bool
    research_minutes: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserStreakStatusRead(BaseModel):
    user_streak_id: int
    user_id: int
    current_streak_days: int
    longest_streak_days: int
    last_active_date: date | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class StreakEventRead(BaseModel):
    streak_event_id: int
    user_id: int
    event_type: StreakEventType
    event_date: datetime
    metadata_json: dict | None

    model_config = {"from_attributes": True}
