# Script PowerShell para executar a aplicacao de clinica medica
# Uso: .\run.ps1 [comando]
# Comandos disponiveis: dev, stop, logs, db, status, help

param(
    [string]$Command = "dev"
)

# Funcao para imprimir mensagens coloridas
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    Write-Host "================================" -ForegroundColor Blue
    Write-Host "  Clinica Medica App" -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
}

# Funcao para verificar se Docker esta rodando
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Funcao para verificar se o ambiente virtual esta ativo
function Test-VirtualEnv {
    if ($env:VIRTUAL_ENV) {
        return $true
    }
    
    if (Test-Path "venv") {
        Write-Warning "Ambiente virtual nao detectado. Ativando..."
        & "venv\Scripts\Activate.ps1"
        return $true
    }
    
    Write-Error "Ambiente virtual nao encontrado. Execute: python -m venv venv"
    return $false
}

# Funcao para iniciar servicos de desenvolvimento
function Start-Dev {
    Write-Header
    Write-Info "Iniciando servicos de desenvolvimento..."
    
    # Verificar Docker
    if (-not (Test-Docker)) {
        Write-Error "Docker nao esta rodando. Por favor, inicie o Docker Desktop."
        exit 1
    }
    
    # Iniciar PostgreSQL e Redis
    Write-Info "Iniciando PostgreSQL e Redis..."
    docker-compose up -d postgres redis
    
    # Aguardar servicos ficarem prontos
    Write-Info "Aguardando servicos ficarem prontos..."
    Start-Sleep -Seconds 5
    
    # Verificar se o banco esta pronto
    Write-Info "Verificando conexao com o banco..."
    Set-Location backend
    try {
        python -c "from app.core.database import SessionLocal; from sqlalchemy import text; db = SessionLocal(); db.execute(text('SELECT 1')); print('Banco de dados conectado!'); db.close()"
        Write-Info "Banco de dados conectado!"
    }
    catch {
        Write-Error "Erro ao conectar com o banco de dados"
        Set-Location ..
        exit 1
    }
    
    # Iniciar FastAPI
    Write-Info "Iniciando FastAPI (porta 8000)..."
    
    # Criar script temporario para iniciar FastAPI
    $projectRoot = Get-Location
    $scriptContent = @"
Set-Location '$projectRoot\backend'
& '$projectRoot\venv\Scripts\python.exe' -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"@
    $scriptPath = Join-Path $projectRoot "start_fastapi.ps1"
    $scriptContent | Out-File -FilePath $scriptPath -Encoding UTF8
    
    # Iniciar em uma nova janela do PowerShell
    Start-Process powershell -ArgumentList "-NoExit", "-File", $scriptPath
    
    # Aguardar FastAPI ficar pronto
    Write-Info "Aguardando FastAPI iniciar..."
    Start-Sleep -Seconds 8
    
    # Verificar se FastAPI esta rodando
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 5
        Write-Info "FastAPI rodando em http://localhost:8000"
        Write-Info "Documentacao da API: http://localhost:8000/docs"
    }
    catch {
        Write-Warning "FastAPI pode nao estar rodando corretamente"
    }
    
    # Voltar para o diretorio raiz
    Set-Location ..
    
    # Verificar se frontend existe
    if (Test-Path "frontend") {
        Write-Info "Iniciando React (porta 3000)..."
        
        # Criar script temporario para iniciar React
        $reactScriptContent = @"
Set-Location '$projectRoot\frontend'
npm run dev
"@
        $reactScriptPath = Join-Path $projectRoot "start_react.ps1"
        $reactScriptContent | Out-File -FilePath $reactScriptPath -Encoding UTF8
        
        # Iniciar em uma nova janela do PowerShell
        Start-Process powershell -ArgumentList "-NoExit", "-File", $reactScriptPath
        
        Start-Sleep -Seconds 3
        Write-Info "React rodando em http://localhost:3000"
    }
    else {
        Write-Warning "Frontend nao encontrado (OK - frontend sera renderizado no Lovable)"
    }
    
    Write-Info "========================================="
    Write-Info "Aplicacao iniciada com sucesso!"
    Write-Info "========================================="
    Write-Info "API Docs: http://localhost:8000/docs"
    Write-Info "API Health: http://localhost:8000/"
    Write-Info "Banco de dados: PostgreSQL na porta 5432"
    Write-Info "Redis: porta 6379"
    Write-Info ""
    Write-Info "Os servicos estao rodando em janelas separadas."
    Write-Info "Para parar os servicos, execute: .\run.ps1 stop"
    Write-Info "Para ver o status, execute: .\run.ps1 status"
    Write-Info ""
    Write-Info "Pressione qualquer tecla para continuar ou Ctrl+C para sair..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Funcao para parar servicos
function Stop-Services {
    Write-Header
    Write-Info "Parando todos os servicos..."
    
    # Parar todos os jobs em background
    Get-Job | Stop-Job -PassThru | Remove-Job -ErrorAction SilentlyContinue
    
    # Parar processos Python (uvicorn)
    taskkill /F /IM python.exe 2>$null
    
    # Parar processos Node (npm/vite)
    taskkill /F /IM node.exe 2>$null
    
    # Parar containers Docker
    docker-compose down
    
    # Remover scripts temporarios
    Remove-Item "start_fastapi.ps1" -ErrorAction SilentlyContinue
    Remove-Item "start_react.ps1" -ErrorAction SilentlyContinue
    
    Write-Info "Todos os servicos foram parados"
}

# Funcao para visualizar logs
function Show-Logs {
    Write-Header
    Write-Info "Visualizando logs dos servicos..."
    docker-compose logs -f
}

# Funcao para acessar banco de dados
function Access-Database {
    Write-Header
    Write-Info "Acessando banco de dados PostgreSQL..."
    
    # Verificar se PostgreSQL esta rodando
    if (-not (docker ps | Select-String "postgres")) {
        Write-Info "Iniciando PostgreSQL..."
        docker-compose up -d postgres
        Start-Sleep -Seconds 5
    }
    
    Write-Info "Conectando ao banco de dados..."
    Write-Info "Credenciais: postgres / postgres123"
    Write-Info "Banco: clinica_medica"
    
    docker exec -it clinica-medica-app-postgres-1 psql -U postgres -d clinica_medica
}

# Funcao para mostrar status
function Show-Status {
    Write-Header
    Write-Info "Status dos servicos:"
    
    # Verificar Docker
    if (Test-Docker) {
        Write-Info "Docker: Rodando"
    }
    else {
        Write-Error "Docker: Nao esta rodando"
    }
    
    # Verificar PostgreSQL
    if (docker ps | Select-String "postgres") {
        Write-Info "PostgreSQL: Rodando"
    }
    else {
        Write-Warning "PostgreSQL: Parado"
    }
    
    # Verificar Redis
    if (docker ps | Select-String "redis") {
        Write-Info "Redis: Rodando"
    }
    else {
        Write-Warning "Redis: Parado"
    }
    
    # Verificar FastAPI
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/" -UseBasicParsing -TimeoutSec 2
        Write-Info "FastAPI: Rodando (http://localhost:8000)"
    }
    catch {
        Write-Warning "FastAPI: Parado"
    }
    
    # Verificar React
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 2
        Write-Info "React: Rodando (http://localhost:3000)"
    }
    catch {
        Write-Warning "React: Parado"
    }
}

# Funcao para mostrar ajuda
function Show-Help {
    Write-Header
    Write-Host "Comandos disponiveis:"
    Write-Host "  dev     - Iniciar todos os servicos de desenvolvimento"
    Write-Host "  stop    - Parar todos os servicos"
    Write-Host "  logs    - Visualizar logs dos servicos"
    Write-Host "  db      - Acessar banco de dados PostgreSQL"
    Write-Host "  status  - Mostrar status dos servicos"
    Write-Host "  help    - Mostrar esta ajuda"
    Write-Host ""
    Write-Host "Exemplos:"
    Write-Host "  .\run.ps1 dev"
    Write-Host "  .\run.ps1 stop"
    Write-Host "  .\run.ps1 db"
}

# Main
switch ($Command) {
    "dev" {
        Start-Dev
    }
    "stop" {
        Stop-Services
    }
    "logs" {
        Show-Logs
    }
    "db" {
        Access-Database
    }
    "status" {
        Show-Status
    }
    { $_ -in @("help", "-h", "--help") } {
        Show-Help
    }
    default {
        Write-Error "Comando desconhecido: $Command"
        Show-Help
        exit 1
    }
}