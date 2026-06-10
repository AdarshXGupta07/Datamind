from sqlalchemy import create_engine, text
from typing import Optional

def get_schema_from_connection(host: str, port: int, db_name: str, username: str, password: str) -> str:
    url = f"postgresql://{username}:{password}@{host}:{port}/{db_name}"
    engine = create_engine(url)
    schema_lines = []
    with engine.connect() as conn:
        tables = conn.execute(text("""
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        """)).fetchall()
        for (table_name,) in tables:
            columns = conn.execute(text(f"""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = :tname AND table_schema = 'public'
                ORDER BY ordinal_position
            """), {"tname": table_name}).fetchall()
            col_defs = ", ".join([f"{col} ({dtype})" for col, dtype in columns])
            schema_lines.append(f"Table: {table_name} | Columns: {col_defs}")
    engine.dispose()
    return "\n".join(schema_lines)
