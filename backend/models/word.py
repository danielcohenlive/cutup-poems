# backend/models/word.py
from enum import Enum
from sqlmodel import SQLModel, Field
from uuid import uuid4

class WordKind(str, Enum):
    available = "available"
    poem = "poem"

class Word(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    text: str
    kind: str  # "available" or "poem"
    poem_id: str = Field(foreign_key="poem.id")

class WordOut(SQLModel):
    id: str
    text: str
    kind: WordKind
