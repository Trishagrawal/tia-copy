from datetime import datetime
from pydantic import BaseModel

from app.models.tia_profile import Tone


class TiaProfileCreate(BaseModel):
    name: str
    description: str | None = None
    system_prompt: str
    tone: Tone = Tone.encouraging
    expertise_area: str | None = None
    is_default: bool = False


class TiaProfileRead(BaseModel):
    tia_profile_id: int
    user_id: int
    name: str
    description: str | None
    system_prompt: str
    tone: Tone
    expertise_area: str | None
    is_default: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TiaProfileUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    system_prompt: str | None = None
    tone: Tone | None = None
    expertise_area: str | None = None
    is_default: bool | None = None
