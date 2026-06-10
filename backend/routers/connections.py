from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text
from urllib.parse import quote_plus
import sys
sys.path.append("..")
from database import get_db
from models.models import Connection, User
from schemas.schemas import ConnectionCreate, ConnectionUpdate, ConnectionOut, TestConnectionRequest
from routers.auth import get_current_user

router = APIRouter(prefix="/connections", tags=["Connections"])


def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


@router.post("/", response_model=ConnectionOut, status_code=201)
def create_connection(
    data: ConnectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    # Validate credentials before saving
    try:
        _test_db_connection(data.host, data.port, data.db_name, data.username, data.password)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cannot connect to database: {str(e)}")

    conn = Connection(
        workspace_id=current_user.workspace_id,
        name=data.name,
        host=data.host,
        port=data.port,
        db_name=data.db_name,
        username=data.username,
        password_enc=data.password
    )
    db.add(conn)
    db.commit()
    db.refresh(conn)
    return conn


@router.get("/", response_model=list[ConnectionOut])
def list_connections(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Connection).filter(
        Connection.workspace_id == current_user.workspace_id
    ).all()


@router.get("/{connection_id}", response_model=ConnectionOut)
def get_connection(
    connection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conn = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.workspace_id == current_user.workspace_id
    ).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    return conn


@router.put("/{connection_id}", response_model=ConnectionOut)
def update_connection(
    connection_id: int,
    data: ConnectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    conn = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.workspace_id == current_user.workspace_id
    ).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")

    # Apply updates
    if data.name is not None:
        conn.name = data.name
    if data.host is not None:
        conn.host = data.host
    if data.port is not None:
        conn.port = data.port
    if data.db_name is not None:
        conn.db_name = data.db_name
    if data.username is not None:
        conn.username = data.username
    if data.password is not None:
        conn.password_enc = data.password

    # Re-validate if any connection params changed
    if any(v is not None for v in [data.host, data.port, data.db_name, data.username, data.password]):
        host = data.host or conn.host
        port = data.port or conn.port
        db_name = data.db_name or conn.db_name
        username = data.username or conn.username
        password = data.password or conn.password_enc
        try:
            _test_db_connection(host, port, db_name, username, password)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Cannot connect to database: {str(e)}")

    db.commit()
    db.refresh(conn)
    return conn


@router.delete("/{connection_id}", status_code=204)
def delete_connection(
    connection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    conn = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.workspace_id == current_user.workspace_id
    ).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(conn)
    db.commit()


@router.post("/test", status_code=200)
def test_connection(data: TestConnectionRequest):
    """Test a database connection without saving it."""
    try:
        _test_db_connection(data.host, data.port, data.db_name, data.username, data.password)
        return {"success": True, "message": "Connection successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")


@router.post("/{connection_id}/test", status_code=200)
def test_saved_connection(
    connection_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Test an existing saved connection."""
    conn = db.query(Connection).filter(
        Connection.id == connection_id,
        Connection.workspace_id == current_user.workspace_id
    ).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")

    try:
        _test_db_connection(conn.host, conn.port, conn.db_name, conn.username, conn.password_enc)
        return {"success": True, "message": "Connection is healthy"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")


def _test_db_connection(host: str, port: int, db_name: str, username: str, password: str):
    """Internal helper to test a PostgreSQL connection."""
    encoded_password = quote_plus(password)
    url = f"postgresql://{username}:{encoded_password}@{host}:{port}/{db_name}"
    engine = create_engine(url, connect_args={"connect_timeout": 5})
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    finally:
        engine.dispose()
