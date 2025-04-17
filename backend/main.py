# backend/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import create_db_and_tables
from routes.poems import router as poems_router
from fastapi.middleware.cors import CORSMiddleware
from auth import auth_backend, fastapi_users as auth_fastapi_users
from models.users import UserRead, UserCreate, UserUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# Add CORS if you call from React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poems_router)

app.include_router(
    auth_fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)
app.include_router(
    auth_fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    auth_fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
