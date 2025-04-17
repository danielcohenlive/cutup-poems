from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from pydantic import ConfigDict
from sqlalchemy import UUID
from fastapi_users import schemas
from pydantic_core import core_schema
from sqlalchemy.orm import DeclarativeBase



class Base(DeclarativeBase):
    pass

# Custom handling for SQLAlchemy's UUID type
def sqlalchemy_uuid_get_pydantic_core_schema(_type: UUID, handler):
    return core_schema.uuid_schema()

UUID.__get_pydantic_core_schema__ = sqlalchemy_uuid_get_pydantic_core_schema

class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "user"
    model_config = ConfigDict(arbitrary_types_allowed=True)

class UserCreate(schemas.BaseUserCreate):
    pass

class UserRead(schemas.BaseUser[UUID]):
    model_config = ConfigDict(arbitrary_types_allowed=True)

class UserUpdate(schemas.BaseUserUpdate):
    pass