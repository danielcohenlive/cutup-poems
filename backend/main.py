# backend/main.py
from fastapi import FastAPI
from database import create_db_and_tables
from routes.poems import router as poems_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Add CORS if you call from React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poems_router)
