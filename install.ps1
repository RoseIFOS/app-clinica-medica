# Script de instalação para Clínica Médica App
# Uso: .\install.ps1

param(
    [switch]$SkipNode = $false
)

# Cores para output
$Green = "Green"
$Yellow = "Yellow"
$Red = "Red"
$Blue = "Blue"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Header {
    Write-Host "========================================" -ForegroundColor $Blue
    Write-Host "  Clínica Médica App - Instalação" -ForegroundColor $Blue
    Write-Host "========================================" -ForegroundColor $Blue
}

Write-Header

# Verificar se Docker está instalado
Write-Info "Verificando Docker..."
try {
    docker --version | Out-Null
    Write-Info "✅ Docker encontrado"
}
catch {
    Write-Error "❌ Docker não encontrado. Por favor, instale o Docker Desktop."
    exit 1
}

# Verificar se Python está instalado
Write-Info "Verificando Python..."
try {
    python --version | Out-Null
    Write-Info "✅ Python encontrado"
}
catch {
    Write-Error "❌ Python não encontrado. Por favor, instale o Python 3.10+."
    exit 1
}

# Verificar se Node.js está instalado (se não pular)
if (-not $SkipNode) {
    Write-Info "Verificando Node.js..."
    try {
        node --version | Out-Null
        npm --version | Out-Null
        Write-Info "✅ Node.js encontrado"
    }
    catch {
        Write-Warning "⚠️  Node.js não encontrado. Instalando..."
        
        # Tentar instalar via winget
        try {
            winget install OpenJS.NodeJS
            Write-Info "✅ Node.js instalado via winget"
        }
        catch {
            Write-Error "❌ Falha ao instalar Node.js. Por favor, instale manualmente de https://nodejs.org/"
            exit 1
        }
    }
}

# Configurar ambiente virtual Python
Write-Info "Configurando ambiente virtual Python..."
if (Test-Path "venv") {
    Write-Warning "Ambiente virtual já existe. Removendo..."
    Remove-Item -Recurse -Force "venv"
}

python -m venv venv
& "venv\Scripts\Activate.ps1"

# Instalar dependências Python
Write-Info "Instalando dependências Python..."
Set-Location backend
pip install -r requirements.txt
Set-Location ..

# Iniciar serviços Docker
Write-Info "Iniciando serviços Docker..."
docker-compose up -d postgres redis

# Aguardar serviços ficarem prontos
Write-Info "Aguardando serviços ficarem prontos..."
Start-Sleep -Seconds 10

# Executar migrações
Write-Info "Executando migrações do banco de dados..."
Set-Location backend
alembic upgrade head
Set-Location ..

# Instalar dependências Node.js (se não pular)
if (-not $SkipNode) {
    Write-Info "Instalando dependências Node.js..."
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Info "🎉 Instalação concluída com sucesso!"
Write-Info ""
Write-Info "Para iniciar a aplicação, execute:"
Write-Info "  .\run.ps1 dev"
Write-Info ""
Write-Info "Ou use os comandos individuais:"
Write-Info "  .\run.ps1 status  - Ver status dos serviços"
Write-Info "  .\run.ps1 db      - Acessar banco de dados"
Write-Info "  .\run.ps1 stop    - Parar todos os serviços"
Write-Info ""
Write-Info "URLs da aplicação:"
Write-Info "  Frontend: http://localhost:3000"
Write-Info "  Backend API: http://localhost:8000"
Write-Info "  Documentação API: http://localhost:8000/docs"
Write-Info ""
Write-Info "Credenciais de teste:"
Write-Info "  Admin: admin@clinica.com / admin123"
Write-Info "  Médico: dr.silva@clinica.com / medico123"
Write-Info "  Recepcionista: recepcionista@clinica.com / recepcionista123"
