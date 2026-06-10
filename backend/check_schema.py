from sqlalchemy import create_engine, text
from urllib.parse import quote_plus

pw = 'Dhoni@28'
engine = create_engine('postgresql://postgres:' + quote_plus(pw) + '@localhost:1108/Sample')

with engine.connect() as conn:
    tables = conn.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")).fetchall()
    for t in tables:
        cols = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='" + t[0] + "' AND table_schema='public' ORDER BY ordinal_position")).fetchall()
        print('Table: ' + t[0])
        for c in cols:
            print('  ' + c[0] + ' (' + c[1] + ')')
        print()
