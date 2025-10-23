from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Verificar se a tabela existe
result = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_name = 'despesas';"))
tables = result.fetchall()
print('Tabelas encontradas:', tables)

# Tentar criar a tabela manualmente se não existir
if not tables:
    print('Tabela despesas não existe, criando...')
    db.execute(text('''
        CREATE TABLE despesas (
            id SERIAL PRIMARY KEY,
            descricao VARCHAR(255) NOT NULL,
            categoria VARCHAR(50) NOT NULL,
            valor NUMERIC(10, 2) NOT NULL,
            data_vencimento DATE,
            data_pagamento TIMESTAMP,
            status VARCHAR(50) DEFAULT 'pendente',
            observacoes TEXT,
            fornecedor VARCHAR(255),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP
        );
    '''))
    db.commit()
    print('Tabela despesas criada!')
else:
    print('Tabela despesas já existe!')

db.close()
