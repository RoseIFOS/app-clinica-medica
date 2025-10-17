#!/bin/bash
# Script de inicialização para Railway

echo "🚀 Iniciando aplicação..."
echo "PORT: $PORT"

# Executar migrações
echo "📦 Executando migrações..."
alembic upgrade head

# Iniciar servidor
echo "🌐 Iniciando servidor na porta $PORT..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

