FastAPI supports the Service + Repository pattern, just like you might use in Node.js (Express/NestJS).

In fact, I recommend this architecture for medium and large FastAPI applications.

The idea is to separate responsibilities:

- Router: Handles HTTP requests and responses.
- Service: Contains business logic.
- Repository: Handles database operations.
- Model: Defines database tables.
- Schema: Defines request/response validation using Pydantic.

## 1. Recommended project structure

For example, let's build a User API.

fastapi-project/

app/

main.py

Application entry point

database.py

Database connection

models/

SQLAlchemy models

schemas/

Pydantic schemas

repositories/

Database queries

services/

Business logic

routers/

API endpoints

dependencies.py

Dependency injection

## 2. How the architecture works

Router

POST /users

Service

Business logic and validation

Repository

SQLAlchemy queries

Database

PostgreSQL / MySQL / SQLite

## 3. Let's implement it

We'll use SQLAlchemy 2.x and FastAPI.

Install:

bash

```bash
pip install fastapi uvicorn sqlalchemy "psycopg[binary]"
```

### Step 1: database.py

python

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "postgresql+psycopg://postgres:password@localhost/mydb"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### Step 2: models/user.py

This represents your database table.

python

```python
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        nullable=False
    )
```

### Step 3: schemas/user.py

Pydantic handles request and response validation.

python

```python
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserCreate(BaseModel):
    name: str = Field(min_length=3, max_length=100)
    email: EmailStr


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)
```

### Step 4: repositories/user\_repository.py

Repository handles only database operations.

python

```python
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(User).all()

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(
            User.id == user_id
        ).first()

    def get_by_email(self, email: str):
        return self.db.query(User).filter(
            User.email == email
        ).first()

    def create(self, user: UserCreate):
        db_user = User(**user.model_dump())

        self.db.add(db_user)
        self.db.flush()

        return db_user
```

Notice that I used `flush()` instead of `commit()` here. We'll let the service manage the transaction.

### Step 5: services/user\_service.py

This is where business logic lives.

python

```python
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def get_all_users(self):
        return self.repository.get_all()

    def create_user(self, user: UserCreate):

        existing_user = self.repository.get_by_email(
            user.email
        )

        if existing_user:
            raise ValueError("Email already registered")

        new_user = self.repository.create(user)

        self.repository.db.commit()
        self.repository.db.refresh(new_user)

        return new_user
```

The service checks business rules before creating the user.

### Step 6: routers/user\_router.py

Router handles HTTP requests.

python

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


def get_user_service(db: Session = Depends(get_db)):
    repository = UserRepository(db)
    return UserService(repository)


@router.get("/", response_model=list[UserResponse])
def get_users(
    service: UserService = Depends(get_user_service)
):
    return service.get_all_users()


@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    service: UserService = Depends(get_user_service)
):
    try:
        return service.create_user(user)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
```

### Step 7: main.py

python

```python
from fastapi import FastAPI

from app.database import engine, Base
from app.routers.user_router import router as user_router

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(user_router)


@app.get("/health")
def health():
    return {"status": "ok"}
```

Run:

bash

```bash
uvicorn app.main:app --reload
```

Open:

`http://127.0.0.1:8000/docs`

You'll see your User APIs in Swagger.

## 4. Who is responsible for what?

| Layer | Responsibility |
| --- | --- |
| Router | HTTP, status codes, request/response |
| Schema | Input/output validation |
| Service | Business rules |
| Repository | Database queries |
| Model | Database table definition |
| Database | Connection and sessions |

## 5. How this compares to Node.js

If you're familiar with Node.js, the mapping is straightforward:

| Node.js | FastAPI |
| --- | --- |
| Express Router | FastAPI APIRouter |
| Controller | Router endpoint (or separate controller) |
| Service | Service |
| Repository | Repository |
| Sequelize/Prisma Model | SQLAlchemy Model |
| Zod/Joi | Pydantic |
| Middleware/DI | Dependencies (`Depends`) |

## 6. A few production recommendations

For a production project, I'd additionally recommend:

1. Use Alembic for database migrations instead of `create_all()`.
2. Use SQLAlchemy's `select()` API instead of the older `query()` API.
3. Keep transaction management in one layer, preferably the service or a dedicated Unit of Work.
4. Use `AsyncSession` if you're building an asynchronous database application.
5. Use FastAPI dependency injection to manage database sessions.
6. Add centralized exception handling rather than repeating `try/except` in every router.

## What I recommend learning next

Since you're learning FastAPI and coming from Node.js, the next important concept is Dependency Injection (`Depends`).

It allows you to inject:

- Database sessions
- Services
- Repositories
- Authentication services
- Configuration
- External clients such as NATS and Redis

Once you understand `Depends`, this architecture becomes much cleaner.

You can also explore [FastAPI Dependency Injection documentation](<https://fastapi.tiangolo.com/tutorial/dependencies/?utm_source=chatgpt.com>).