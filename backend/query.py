from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text
from pydantic import BaseModel
from typing import Any
import sys
sys.path.append("..")
from database import get_db
from models.models import Connection, Query, User
from services.ai_service import generate_sql, suggest_chart_type
from services.schema_service import get_schema_from_connection
from routers.auth import get_current_user

router = APIRouter(prefix="/query", tags=["Query"])

class QueryRequest(BaseModel):
    connection_id: int
    question: str

class QueryResponse(BaseModel):
    question: str
    sql: str
    columns: list[str]
    rows: list[list[Any]]
    chart_type: str
    row_count: int

@router.post("/", response_model=QueryResponse)
def run_query(data: QueryRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conn = db.query(Connection).filter(
        Connection.id == data.connection_id,
        Connection.workspace_id == current_user.workspace_id
    ).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")

    try:
        schema = get_schema_from_connection(
            host=conn.host,
            port=conn.port,
            db_name=conn.db_name,
            username=conn.username,
            password=conn.password_enc
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not connect to database: {str(e)}")

    try:
        sql = generate_sql(schema=schema, question=data.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    try:
        user_engine = create_engine(
            f"postgresql://{conn.username}:{conn.password_enc}@{conn.host}:{conn.port}/{conn.db_name}"
        )
        with user_engine.connect() as user_conn:
            result = user_conn.execute(text(sql))
            columns = list(result.keys())
            rows = [list(row) for row in result.fetchall()]
        user_engine.dispose()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"SQL execution failed: {str(e)}")

    query_log = Query(
        user_id=current_user.id,
        connection_id=conn.id,
        natural_language=data.question,
        generated_sql=sql
    )
    db.add(query_log)
    db.commit()

    chart_type = suggest_chart_type(columns, len(rows))

    return QueryResponse(
        question=data.question,
        sql=sql,
        columns=columns,
        rows=rows,
        chart_type=chart_type,
        row_count=len(rows)
    )

@router.get("/history")
def get_query_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    queries = db.query(Query).filter(Query.user_id == current_user.id).order_by(Query.executed_at.desc()).limit(20).all()
    return [{"id": q.id, "question": q.natural_language, "sql": q.generated_sql, "executed_at": q.executed_at} for q in queries]
