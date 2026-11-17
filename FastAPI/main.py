from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()


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
