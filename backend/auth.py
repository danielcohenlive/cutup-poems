# auth.py
import uuid
from fastapi_users.authentication import AuthenticationBackend, JWTStrategy
from fastapi_users import FastAPIUsers
from database import get_user_db
from models.users import User
from fastapi_users.authentication import BearerTransport

SECRET = "super-secret-key"

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=BearerTransport(tokenUrl="auth/jwt/login"),
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_db,  # your dependency to get a session + User DB
    [auth_backend],
)

current_active_user = fastapi_users.current_user(active=True)