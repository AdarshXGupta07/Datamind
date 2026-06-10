from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import models
from routers import auth, connections, query
import os

app = FastAPI(title="DataMind API", version="1.0.0")


@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)

# Get allowed origins from environment variable or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(connections.router)
app.include_router(query.router)

@app.get("/")
def root():
    return {"message": "DataMind API is running!"}

@app.get("/health")
def health():
    return {"status": "ok"}
