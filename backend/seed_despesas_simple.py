from app.core.database import SessionLocal
from sqlalchemy import text
from datetime import date, datetime

db = SessionLocal()

# Inserir despesas usando SQL direto
despesas_sql = [
    "INSERT INTO despesas (descricao, categoria, valor, data_vencimento, status, fornecedor, observacoes) VALUES ('Aluguel do consultório', 'ALUGUEL', 2500.00, '2025-11-05', 'PAGO', 'Imobiliária Central', 'Aluguel mensal do consultório')",
    "INSERT INTO despesas (descricao, categoria, valor, data_vencimento, status, fornecedor, observacoes) VALUES ('Salário da recepcionista', 'SALARIOS', 1800.00, '2025-11-01', 'PAGO', 'Funcionária Maria Silva', 'Salário mensal')",
    "INSERT INTO despesas (descricao, categoria, valor, data_vencimento, status, fornecedor, observacoes) VALUES ('Equipamento médico', 'EQUIPAMENTOS', 1200.00, '2025-10-15', 'PAGO', 'MedEquip Ltda', 'Estetoscópio digital')",
    "INSERT INTO despesas (descricao, categoria, valor, data_vencimento, status, fornecedor, observacoes) VALUES ('Conta de energia', 'ENERGIA', 180.50, '2025-11-10', 'PENDENTE', 'Enel', 'Conta de outubro')",
    "INSERT INTO despesas (descricao, categoria, valor, data_vencimento, status, fornecedor, observacoes) VALUES ('Material de limpeza', 'LIMPEZA', 150.00, '2025-10-20', 'PAGO', 'Limpeza Total', 'Produtos de limpeza mensal')",
    "INSERT INTO despesas (descricao, categoria, valor, data_vencimento, status, fornecedor, observacoes) VALUES ('Internet e telefone', 'INTERNET', 120.00, '2025-11-08', 'PENDENTE', 'Vivo', 'Plano empresarial')"
]

for sql in despesas_sql:
    db.execute(text(sql))

db.commit()
print('Despesas de exemplo criadas com sucesso!')

# Verificar despesas criadas
result = db.execute(text("SELECT id, descricao, valor, status FROM despesas ORDER BY id"))
despesas = result.fetchall()
print(f'Total de despesas: {len(despesas)}')
for d in despesas:
    print(f'ID: {d[0]}, Descrição: {d[1]}, Valor: R$ {d[2]}, Status: {d[3]}')

db.close()
