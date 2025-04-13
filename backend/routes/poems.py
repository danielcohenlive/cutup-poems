# backend/routes/poems.py
from fastapi import APIRouter, HTTPException
from sqlalchemy import delete
from sqlmodel import Session, select
from models.poem import Poem, PoemSummary, PoemOut
from models.word import Word, WordOut
from database import engine

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/poems/", response_model=list[PoemSummary])
def list_poems():
    with Session(engine) as session:
        poems = session.exec(select(Poem)).all()
        return poems

@router.get("/poems/{poem_id}", response_model=PoemOut)
def get_poem(poem_id: str):
    with Session(engine) as session:
        poem = session.get(Poem, poem_id)
        if not poem:
            raise HTTPException(status_code=404, detail="Poem not found")

        words = session.exec(select(Word).where(Word.poem_id == poem_id)).all()
        available_words = [WordOut(id=w.id, text=w.text, kind=w.kind) for w in words if w.kind == "available"]
        poem_words = [WordOut(id=w.id, text=w.text, kind=w.kind) for w in words if w.kind in ("poem", "newline")]

        return PoemOut(
            id=poem.id,
            name=poem.name,
            created_at=poem.created_at,
            updated_at=poem.updated_at,
            available_words=available_words,
            words=poem_words
        )

@router.post("/poems/", response_model=PoemOut)
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

@router.put("/poems/{poem_id}", response_model=PoemOut)
def update_poem(poem_id: str, updated_poem: PoemOut):
    with Session(engine) as session:
        poem = session.get(Poem, poem_id)
        if not poem:
            raise HTTPException(status_code=404, detail="Poem not found")

        poem.name = updated_poem.name
        poem.updated_at = updated_poem.updated_at

        session.exec(delete(Word).where(Word.poem_id == poem_id))
        session.bulk_save_objects([
            Word(
                id=word.id,
                text=word.text,
                kind=word.kind,
                poem_id=poem_id,
            )
            for word in updated_poem.available_words + updated_poem.words
        ])
        session.commit()

        return updated_poem
