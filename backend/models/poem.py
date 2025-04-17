# backend/models/poem.py
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import List, Optional
from uuid import uuid4
from models.word import WordOut

class Poem(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[str] = Field(default=None)

class PoemSummary(SQLModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime

class PoemOut(SQLModel):
    id: str
    name: str
    created_at: datetime
    updated_at: datetime
    available_words: List[WordOut]
    words: List[WordOut]
