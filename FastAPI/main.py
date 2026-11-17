from fastapi import FastAPI, Request
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://your-production-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define custom HTTP middleware
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    # Code executed BEFORE the request reaches the endpoint
    print(f"Incoming request: {request.method} {request.url.path}")
    start_time = time.time()

    # Pass the request to the next middleware or endpoint
    response = await call_next(request)

    # Code executed AFTER the endpoint processes the request
    process_time = time.time() - start_time
    print(f"Completed in {process_time:.4f}s | Status: {response.status_code}")

    return response
class User(BaseModel):
    name: str = Field(min_length=1, max_length=20)


USERS = [
    {"id": 1, "name": "mohan"},
    {"id": 2, "name": "Sohan"},
    {"id": 3, "name": "Rohan"},
]


@app.get("/")
async def get_home():
    return USERS


@app.post("/")
async def create_user(user: User):
    new_user = {
        "id": len(USERS) + 1,
        **user.model_dump()
    }

    USERS.append(new_user)

    return new_user
