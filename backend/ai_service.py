import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def generate_sql(schema: str, question: str) -> str:
    prompt = f"""You are a SQL expert. Given the database schema below, write a single PostgreSQL query to answer the user question.

SCHEMA:
{schema}

QUESTION: {question}

RULES:
- Return ONLY the SQL query, nothing else
- No markdown, no backticks, no explanation
- Use only tables and columns that exist in the schema above
- Always use LIMIT 100 unless user specifies otherwise
- Never use DROP, DELETE, INSERT, UPDATE or any destructive statement

SQL:"""

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama3-70b-8192",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 500
        }
    )

    response.raise_for_status()
    sql = response.json()["choices"][0]["message"]["content"].strip()
    sql = re.sub(r"```sql|```", "", sql).strip()
    return sql


def suggest_chart_type(columns: list[str], row_count: int) -> str:
    columns_lower = [c.lower() for c in columns]
    has_date = any(w in " ".join(columns_lower) for w in ["date", "month", "year", "time", "day"])
    has_numeric = any(w in " ".join(columns_lower) for w in ["count", "total", "sum", "amount", "revenue", "price", "avg"])

    if len(columns) == 2 and has_date and has_numeric:
        return "line"
    elif len(columns) == 2 and has_numeric:
        return "bar"
    elif len(columns) == 2 and row_count <= 8:
        return "pie"
    else:
        return "table"
