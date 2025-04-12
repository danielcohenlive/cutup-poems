# backend/poem.py
from fastapi import FastAPI, HTTPException
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

# backend/poem.py
from fastapi.middleware.cors import CORSMiddleware

# --- Database Setup ---
sqlite_file_name = "database.db"
DATABASE_URL = f"sqlite:///{sqlite_file_name}"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True logs SQL queries

# --- Models ---

class Word(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    text: str
    kind: str  # "available" or "poem"
    poem_id: str = Field(foreign_key="poem.id")

class Poem(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# --- Pydantic-like response models ---
class WordOut(SQLModel):
    id: str
    text: str
    kind: str

class PoemOut(SQLModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    available_words: List[WordOut]
    words: List[WordOut]

class PoemSummary(SQLModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime


# --- FastAPI App ---
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# --- Helper to get a database session ---
def get_session():
    with Session(engine) as session:
        yield session

# --- Endpoints ---

@app.get("/poems/", response_model=List[PoemSummary])
def list_poems():
    with Session(engine) as session:
        poems = session.exec(select(Poem)).all()
        return poems

@app.get("/poems/{poem_id}", response_model=PoemOut)
def get_poem(poem_id: str):
    with Session(engine) as session:
        poem = session.get(Poem, poem_id)
        if not poem:
            raise HTTPException(status_code=404, detail="Poem not found")
        
        words = session.exec(select(Word).where(Word.poem_id == poem_id)).all()
        available_words = [WordOut(id=w.id, text=w.text, kind=w.kind) for w in words if w.kind == "available"]
        poem_words = [WordOut(id=w.id, text=w.text, kind=w.kind) for w in words if w.kind == "poem"]

        return PoemOut(
            id=poem.id,
            name=poem.name,
            created_at=poem.created_at,
            updated_at=poem.updated_at,
            available_words=available_words,
            words=poem_words,
        )

@app.post("/poems/", response_model=PoemOut)
def create_poem(poem: PoemOut):
    with Session(engine) as session:
        db_poem = Poem(
            id=poem.id,
            name=poem.name,
            created_at=poem.created_at,
            updated_at=poem.updated_at,
        )
        session.add(db_poem)
        for word in poem.available_words + poem.words:
            session.add(Word(
                id=word.id,
                text=word.text,
                kind=word.kind,
                poem_id=poem.id,
            ))
        session.commit()
        return poem

@app.put("/poems/{poem_id}", response_model=PoemOut)
def update_poem(poem_id: str, updated_poem: PoemOut):
    with Session(engine) as session:
        poem = session.get(Poem, poem_id)
        if not poem:
            raise HTTPException(status_code=404, detail="Poem not found")
        
        poem.name = updated_poem.name
        poem.updated_at = updated_poem.updated_at

        # Delete old words
        session.exec(select(Word).where(Word.poem_id == poem_id)).delete()

        # Add new words
        for word in updated_poem.available_words + updated_poem.words:
            session.add(Word(
                id=word.id,
                text=word.text,
                kind=word.kind,
                poem_id=poem_id,
            ))
        session.commit()

        return updated_poem
