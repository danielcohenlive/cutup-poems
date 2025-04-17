# backend/database.py
from collections.abc import AsyncGenerator
from fastapi import Depends
from sqlmodel import create_engine, SQLModel
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import AsyncSession
from models.users import Base, User
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Database Setup ---
sqlite_file_name = "database.db"
DATABASE_URL = f"sqlite+aiosqlite:///{sqlite_file_name}"

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)


async def create_db_and_tables():
    async with engine.begin() as conn:
        logger.info("Creating tables from Base.metadata...")
        await conn.run_sync(Base.metadata.create_all)
        logger.info("Creating tables from SQLModel.metadata...")
        await conn.run_sync(SQLModel.metadata.create_all)
        logger.info("Tables created successfully.")

user_db = SQLAlchemyUserDatabase(User, AsyncSession)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)