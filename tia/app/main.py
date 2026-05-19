from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import Base, engine
from app.routers import users, tia_profiles, projects, tasks, conversations, streaks, badges
from app.routers import auth

# Import all models so Base.metadata knows about every table
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup (safe to call repeatedly — skips existing tables)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(title="TIA - The Innovative Assistant", version="0.1.0", lifespan=lifespan)

app.include_router(users.router, prefix="/api")
app.include_router(tia_profiles.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(conversations.router, prefix="/api")
app.include_router(streaks.router, prefix="/api")
app.include_router(badges.router, prefix="/api")
app.include_router(auth.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
