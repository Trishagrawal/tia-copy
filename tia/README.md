# TIA - The Innovative Assistant

A research assistant backend for the Liberal Arts department. TIA helps students organize research projects, manage tasks with auto-generated deadlines, and communicate with faculty — all through a customizable AI personality.

## Core Features

- **Customizable AI Personality** — Each user creates TIA profiles (tone, expertise, system prompt) to shape how TIA interacts with them
- **Research Project Management** — Track projects with status, deadlines, and faculty supervisors
- **Task Breakdown** — Sub-tasks and milestones tied to a project's main deadline
- **Student ↔ TIA ↔ Professor Messaging** — Student asks TIA → TIA asks professor → professor replies to TIA → TIA replies to student
- **Daily Streaks & Badges** — Duolingo-style engagement tracking with streak snapshots and achievement badges

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 (async) |
| Database | Neon Postgres |
| Driver | asyncpg |
| Migrations | Alembic |
| Validation | Pydantic v2 |

---

## Project Structure

```
tia/
├── .env.example                  # Template for environment variables
├── .gitignore
├── requirements.txt
├── alembic.ini                   # Alembic migration config
├── alembic/
│   ├── env.py                    # Async-aware migration runner
│   ├── script.py.mako            # Migration file template
│   └── versions/                 # Auto-generated migration files
└── app/
    ├── config.py                 # Reads DATABASE_URL from .env
    ├── database.py               # Async engine, session factory, get_db dependency
    ├── main.py                   # FastAPI app entry point, mounts all routers
    ├── models/                   # SQLAlchemy ORM models
    ├── schemas/                  # Pydantic request/response schemas
    └── routers/                  # API route stubs (no logic yet)
```

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd tia
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and replace with your Neon credentials:

```
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
DATABASE_URL_SYNC=postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
```

- `DATABASE_URL` — used by the app (async driver)
- `DATABASE_URL_SYNC` — used by Alembic migrations

You can find these values in your [Neon Console](https://console.neon.tech/) under your project's connection details.

### 3. Run database migrations

```bash
# Generate the initial migration from models
alembic revision --autogenerate -m "initial schema"

# Apply to Neon
alembic upgrade head
```

### 4. Start the server

```bash
uvicorn app.main:app --reload
```

The API will be live at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

---

## API Endpoints

All routes are prefixed with `/api`. Every route body is a stub (`...`) — fill in your logic.

### Users
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users/` | Create a user |
| GET | `/api/users/` | List all users |
| GET | `/api/users/{user_id}` | Get a user |
| PATCH | `/api/users/{user_id}` | Update a user |
| DELETE | `/api/users/{user_id}` | Delete a user |

### TIA Profiles
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users/{user_id}/tia-profiles/` | Create a profile |
| GET | `/api/users/{user_id}/tia-profiles/` | List user's profiles |
| GET | `/api/users/{user_id}/tia-profiles/{profile_id}` | Get a profile |
| PATCH | `/api/users/{user_id}/tia-profiles/{profile_id}` | Update a profile |
| DELETE | `/api/users/{user_id}/tia-profiles/{profile_id}` | Delete a profile |

### Research Projects
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/projects/` | Create a project |
| GET | `/api/projects/` | List projects (filter by owner) |
| GET | `/api/projects/{project_id}` | Get a project |
| PATCH | `/api/projects/{project_id}` | Update a project |
| DELETE | `/api/projects/{project_id}` | Delete a project |
| POST | `/api/projects/{project_id}/faculty` | Add faculty to project |
| GET | `/api/projects/{project_id}/faculty` | List project faculty |
| DELETE | `/api/projects/{project_id}/faculty/{id}` | Remove faculty |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/projects/{project_id}/tasks/` | Create a task |
| GET | `/api/projects/{project_id}/tasks/` | List project tasks |
| GET | `/api/projects/{project_id}/tasks/{task_id}` | Get a task |
| PATCH | `/api/projects/{project_id}/tasks/{task_id}` | Update a task |
| DELETE | `/api/projects/{project_id}/tasks/{task_id}` | Delete a task |

### Conversations & Messages
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/conversations/` | Start a conversation |
| GET | `/api/conversations/` | List conversations |
| GET | `/api/conversations/{id}` | Get a conversation |
| PATCH | `/api/conversations/{id}` | Update a conversation |
| DELETE | `/api/conversations/{id}` | Delete a conversation |
| POST | `/api/conversations/{id}/messages` | Send a message |
| GET | `/api/conversations/{id}/messages` | List messages |

### Streaks
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users/{user_id}/streaks/snapshots` | Log daily activity |
| GET | `/api/users/{user_id}/streaks/snapshots` | List streak snapshots |
| GET | `/api/users/{user_id}/streaks/status` | Get current streak |
| GET | `/api/users/{user_id}/streaks/events` | List streak events |

### Badges
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/badges/` | Create a badge definition |
| GET | `/api/badges/` | List all badges |
| GET | `/api/badges/{badge_id}` | Get a badge |
| GET | `/api/badges/users/{user_id}` | List user's earned badges |
| POST | `/api/badges/users/{user_id}/{badge_id}` | Award badge to user |

---

## Database Models

Eight entities matching the ERD:

| Model | Table | Key Fields |
|-------|-------|------------|
| `User` | `users` | email, role (student/faculty/admin), department |
| `TiaProfile` | `tia_profiles` | system_prompt, tone, expertise_area |
| `ResearchProject` | `research_projects` | owner, supervisor, status, main_deadline |
| `ProjectFaculty` | `project_faculty` | project, faculty, role (supervisor/reviewer/reader) |
| `Task` | `tasks` | project, type, due_date, status, priority |
| `Conversation` | `conversations` | user, project, tia_profile |
| `Message` | `messages` | sender_type (user/tia/professor), message_role, threading |
| `StreakSnapshot` | `streak_snapshots` | date, did_research_activity |
| `UserStreakStatus` | `user_streak_status` | current_streak_days, longest_streak_days |
| `StreakEvent` | `streak_events` | event_type (started/extended/broken/badge_earned) |
| `Badge` | `badges` | code, criteria_type, criteria_value |
| `UserBadge` | `user_badges` | user, badge, earned_at |

All relationships (foreign keys, back_populates) are pre-wired in the models.

---

## How to Add Logic

Each router file has empty route handlers. Example for creating a user:

```python
# app/routers/users.py

@router.post("/", response_model=UserRead, status_code=201)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. Hash the password
    # 2. Create a User model instance
    # 3. db.add(user) → await db.commit() → await db.refresh(user)
    # 4. Return the user
    ...
```

The pattern is the same across all routes:
1. Build a model instance from the Pydantic schema
2. Add to session, commit, refresh
3. Return the result

---

## Creating New Migrations

Whenever you change a model (add a column, rename a table, etc.):

```bash
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

Review the generated file in `alembic/versions/` before applying.

---

## Common Enums Reference

| Enum | Values |
|------|--------|
| `UserRole` | `student`, `faculty`, `admin` |
| `Tone` | `formal`, `casual`, `encouraging`, `critical`, `humorous` |
| `ProjectStatus` | `planning`, `in_progress`, `submitted`, `completed`, `archived` |
| `TaskType` | `reading`, `writing`, `analysis`, `meeting`, `admin`, `other` |
| `TaskStatus` | `not_started`, `in_progress`, `done`, `overdue` |
| `TaskPriority` | `low`, `medium`, `high` |
| `SenderType` | `user`, `tia`, `professor` |
| `MessageRole` | `user_query`, `tia_reply`, `professor_reply`, `system_note` |
| `StreakEventType` | `streak_started`, `streak_extended`, `streak_broken`, `badge_earned` |
| `CriteriaType` | `streak_days`, `tasks_completed`, `projects_completed`, `custom` |

---

## Message Flow (Student ↔ TIA ↔ Professor)

```
Student sends message
  → sender_type=user, message_role=user_query

TIA forwards to professor
  → sender_type=tia, message_role=system_note, is_visible_to_user=false

Professor replies
  → sender_type=professor, message_role=professor_reply

TIA relays answer to student
  → sender_type=tia, message_role=tia_reply, is_visible_to_user=true
```

All messages live in the same conversation, threaded via `parent_message_id`.
