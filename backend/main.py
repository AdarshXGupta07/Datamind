from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import models
from routers import auth, connections, query

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DataMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
