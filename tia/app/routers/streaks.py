from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_active_user
from app.database import get_db
from app.models.streak import StreakEvent, StreakSnapshot, UserStreakStatus
from app.models.user import User, UserRole
from app.schemas.streak import StreakSnapshotCreate, StreakSnapshotRead, UserStreakStatusRead, StreakEventRead

router = APIRouter(prefix="/users/{user_id}/streaks", tags=["Streaks"])


def _authorize_user_access(user_id: int, current_user: User) -> None:
    if current_user.role != UserRole.admin and current_user.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's streak data")


@router.post("/snapshots", response_model=StreakSnapshotRead, status_code=201)
async def create_streak_snapshot(user_id: int,payload: StreakSnapshotCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user),
):
    _authorize_user_access(user_id, current_user)

    result = await db.execute(select(StreakSnapshot).where(StreakSnapshot.user_id == user_id, StreakSnapshot.date == payload.date))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Streak snapshot already exists for this date")

    streak_snapshot = StreakSnapshot(
        user_id=user_id,
        date=payload.date,
        did_research_activity=payload.did_research_activity,
        research_minutes=payload.research_minutes,
    )
    db.add(streak_snapshot)
    await db.commit()
    await db.refresh(streak_snapshot)
    return streak_snapshot


@router.get("/snapshots", response_model=list[StreakSnapshotRead])
async def list_streak_snapshots(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user),
):
    _authorize_user_access(user_id, current_user)
    result = await db.execute(select(StreakSnapshot).where(StreakSnapshot.user_id == user_id))
    return result.scalars().all()


@router.get("/status", response_model=UserStreakStatusRead)
async def get_streak_status(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user),
):
    _authorize_user_access(user_id, current_user)
    result = await db.execute(select(UserStreakStatus).where(UserStreakStatus.user_id == user_id))
    latest_status = result.scalar_one_or_none()
    if latest_status is None:
        return UserStreakStatusRead(
            user_streak_id=0,
            user_id=user_id,
            current_streak_days=0,
            longest_streak_days=0,
            last_active_date=None,
            updated_at=datetime.now(),
        )
    return latest_status


@router.get("/events", response_model=list[StreakEventRead])
async def list_streak_events(user_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_active_user),
):
    _authorize_user_access(user_id, current_user)
    result = await db.execute(select(StreakEvent).where(StreakEvent.user_id == user_id).order_by(StreakEvent.event_date.desc()))
    return result.scalars().all()

