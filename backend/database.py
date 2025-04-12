# backend/database.py
from sqlmodel import create_engine, SQLModel

# --- Database Setup ---
sqlite_file_name = "database.db"
DATABASE_URL = f"sqlite:///{sqlite_file_name}"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
