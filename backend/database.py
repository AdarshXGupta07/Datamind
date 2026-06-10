import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import sys
from pathlib import Path

# Load environment variables from .env file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

DATABASE_URL = os.getenv("DATABASE_URL")

# Ensure DATABASE_URL is set
if not DATABASE_URL:
    print(f"ERROR: DATABASE_URL not found!", file=sys.stderr)
    print(f"Looking for .env at: {env_path}", file=sys.stderr)
    print(f".env exists: {env_path.exists()}", file=sys.stderr)
    print(f"Current dir: {os.getcwd()}", file=sys.stderr)
    # For local development, use default if not set
    DATABASE_URL = "postgresql://postgres:Dhoni%4028@localhost:1108/DataMind"
    print(f"Using default DATABASE_URL for local development", file=sys.stderr)

# Railway PostgreSQL URLs sometimes need adjustment for SQLAlchemy
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
