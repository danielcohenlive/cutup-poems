from datetime import datetime
from typing import Annotated
from fastapi import Depends, FastAPI
from sqlmodel import Field, Session, SQLModel, create_engine, select

class PoemBase(SQLModel):
    name: str

class Poem(PoemBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime | None = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime | None = Field(default_factory=datetime.utcnow, index=True)

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Code above omitted 👆

def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

# Code below omitted 👇
app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/poems/")
def create_poem(poem: Poem, session: SessionDep) -> Poem:
    session.add(poem)
    session.commit()
    session.refresh(poem)
    return poem


