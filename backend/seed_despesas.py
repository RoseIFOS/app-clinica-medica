from app.core.database import SessionLocal
from app.models.despesa import Despesa, CategoriaDespesa, StatusDespesa
from datetime import date, datetime

db = SessionLocal()

# Criar despesas de exemplo
despesas_exemplo = [
    {
        'descricao': 'Aluguel do consultório',
        'categoria': CategoriaDespesa.ALUGUEL,
        'valor': 2500.00,
        'data_vencimento': date(2025, 11, 5),
        'status': StatusDespesa.PAGO,
        'fornecedor': 'Imobiliária Central',
        'observacoes': 'Aluguel mensal do consultório'
    },
    {
        'descricao': 'Salário da recepcionista',
        'categoria': CategoriaDespesa.SALARIOS,
        'valor': 1800.00,
        'data_vencimento': date(2025, 11, 1),
        'status': StatusDespesa.PAGO,
        'fornecedor': 'Funcionária Maria Silva',
        'observacoes': 'Salário mensal'
    },
    {
        'descricao': 'Equipamento médico',
        'categoria': CategoriaDespesa.EQUIPAMENTOS,
        'valor': 1200.00,
        'data_vencimento': date(2025, 10, 15),
        'status': StatusDespesa.PAGO,
        'fornecedor': 'MedEquip Ltda',
        'observacoes': 'Estetoscópio digital'
    },
    {
        'descricao': 'Conta de energia',
        'categoria': CategoriaDespesa.ENERGIA,
        'valor': 180.50,
        'data_vencimento': date(2025, 11, 10),
        'status': StatusDespesa.PENDENTE,
        'fornecedor': 'Enel',
        'observacoes': 'Conta de outubro'
    },
    {
        'descricao': 'Material de limpeza',
        'categoria': CategoriaDespesa.LIMPEZA,
        'valor': 150.00,
        'data_vencimento': date(2025, 10, 20),
        'status': StatusDespesa.PAGO,
        'fornecedor': 'Limpeza Total',
        'observacoes': 'Produtos de limpeza mensal'
    },
    {
        'descricao': 'Internet e telefone',
        'categoria': CategoriaDespesa.INTERNET,
        'valor': 120.00,
        'data_vencimento': date(2025, 11, 8),
        'status': StatusDespesa.PENDENTE,
        'fornecedor': 'Vivo',
        'observacoes': 'Plano empresarial'
    }
]

for despesa_data in despesas_exemplo:
    despesa = Despesa(**despesa_data)
    db.add(despesa)

db.commit()
print('Despesas de exemplo criadas com sucesso!')

# Verificar despesas criadas
despesas = db.query(Despesa).all()
print(f'Total de despesas: {len(despesas)}')
for d in despesas:
    print(f'ID: {d.id}, Descrição: {d.descricao}, Valor: R$ {d.valor}, Status: {d.status}')

db.close()
