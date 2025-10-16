#!/bin/bash

# Script para executar a aplicação de clínica médica
# Uso: ./run.sh [comando]
# Comandos disponíveis: dev, build, stop, logs, db

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Clínica Médica App${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker não está rodando. Por favor, inicie o Docker Desktop."
        exit 1
    fi
}

# Função para verificar se o ambiente virtual está ativo
check_venv() {
    if [[ "$VIRTUAL_ENV" == "" ]]; then
        print_warning "Ambiente virtual não detectado. Ativando..."
        if [ -d "venv" ]; then
            source venv/Scripts/activate 2>/dev/null || source venv/bin/activate
        else
            print_error "Ambiente virtual não encontrado. Execute: python -m venv venv"
            exit 1
        fi
    fi
}

# Função para iniciar serviços de desenvolvimento
start_dev() {
    print_header
    print_message "Iniciando serviços de desenvolvimento..."
    
    # Verificar Docker
    check_docker
    
    # Iniciar PostgreSQL e Redis
    print_message "Iniciando PostgreSQL e Redis..."
    docker-compose up -d postgres redis
    
    # Aguardar serviços ficarem prontos
    print_message "Aguardando serviços ficarem prontos..."
    sleep 5
    
    # Verificar se o banco está pronto
    print_message "Verificando conexão com o banco..."
    cd backend
    python -c "
from app.core.database import SessionLocal
try:
    db = SessionLocal()
    db.execute('SELECT 1')
    print('✅ Banco de dados conectado!')
    db.close()
except Exception as e:
    print(f'❌ Erro ao conectar com o banco: {e}')
    exit(1)
"
    
    # Iniciar FastAPI
    print_message "Iniciando FastAPI (porta 8000)..."
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
    FASTAPI_PID=$!
    
    # Aguardar FastAPI ficar pronto
    sleep 3
    
    # Verificar se FastAPI está rodando
    if curl -s http://localhost:8000/ > /dev/null; then
        print_message "✅ FastAPI rodando em http://localhost:8000"
        print_message "📚 Documentação da API: http://localhost:8000/docs"
    else
        print_warning "FastAPI pode não estar rodando corretamente"
    fi
    
    # Voltar para o diretório raiz
    cd ..
    
    # Verificar se frontend existe
    if [ -d "frontend" ]; then
        print_message "Iniciando React (porta 3000)..."
        cd frontend
        npm run dev &
        REACT_PID=$!
        cd ..
        
        sleep 3
        print_message "✅ React rodando em http://localhost:3000"
    else
        print_warning "Frontend não encontrado. Execute: npm create vite@latest frontend -- --template react-ts"
    fi
    
    print_message "🎉 Aplicação iniciada com sucesso!"
    print_message "📊 Dashboard: http://localhost:3000"
    print_message "🔧 API Docs: http://localhost:8000/docs"
    print_message "🗄️  Banco de dados: PostgreSQL na porta 5432"
    print_message "📱 Redis: porta 6379"
    
    # Manter script rodando
    print_message "Pressione Ctrl+C para parar todos os serviços"
    wait
}

# Função para parar serviços
stop_services() {
    print_header
    print_message "Parando todos os serviços..."
    
    # Parar processos Python
    pkill -f "uvicorn app.main:app" 2>/dev/null || true
    
    # Parar processos Node
    pkill -f "vite" 2>/dev/null || true
    
    # Parar containers Docker
    docker-compose down
    
    print_message "✅ Todos os serviços foram parados"
}

# Função para visualizar logs
show_logs() {
    print_header
    print_message "Visualizando logs dos serviços..."
    docker-compose logs -f
}

# Função para acessar banco de dados
access_db() {
    print_header
    print_message "Acessando banco de dados PostgreSQL..."
    
    # Verificar se PostgreSQL está rodando
    if ! docker ps | grep -q "postgres"; then
        print_message "Iniciando PostgreSQL..."
        docker-compose up -d postgres
        sleep 5
    fi
    
    print_message "Conectando ao banco de dados..."
    print_message "Credenciais: postgres / postgres123"
    print_message "Banco: clinica_medica"
    
    docker exec -it clinica-medica-app-postgres-1 psql -U postgres -d clinica_medica
}

# Função para mostrar status
show_status() {
    print_header
    print_message "Status dos serviços:"
    
    # Verificar Docker
    if docker info > /dev/null 2>&1; then
        print_message "✅ Docker: Rodando"
    else
        print_error "❌ Docker: Não está rodando"
    fi
    
    # Verificar PostgreSQL
    if docker ps | grep -q "postgres"; then
        print_message "✅ PostgreSQL: Rodando"
    else
        print_warning "⚠️  PostgreSQL: Parado"
    fi
    
    # Verificar Redis
    if docker ps | grep -q "redis"; then
        print_message "✅ Redis: Rodando"
    else
        print_warning "⚠️  Redis: Parado"
    fi
    
    # Verificar FastAPI
    if curl -s http://localhost:8000/ > /dev/null 2>&1; then
        print_message "✅ FastAPI: Rodando (http://localhost:8000)"
    else
        print_warning "⚠️  FastAPI: Parado"
    fi
    
    # Verificar React
    if curl -s http://localhost:3000/ > /dev/null 2>&1; then
        print_message "✅ React: Rodando (http://localhost:3000)"
    else
        print_warning "⚠️  React: Parado"
    fi
}

# Função para mostrar ajuda
show_help() {
    print_header
    echo "Comandos disponíveis:"
    echo "  dev     - Iniciar todos os serviços de desenvolvimento"
    echo "  stop    - Parar todos os serviços"
    echo "  logs    - Visualizar logs dos serviços"
    echo "  db      - Acessar banco de dados PostgreSQL"
    echo "  status  - Mostrar status dos serviços"
    echo "  help    - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./run.sh dev"
    echo "  ./run.sh stop"
    echo "  ./run.sh db"
}

# Main
case "${1:-dev}" in
    "dev")
        start_dev
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        show_logs
        ;;
    "db")
        access_db
        ;;
    "status")
        show_status
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        show_help
        exit 1
        ;;
esac
