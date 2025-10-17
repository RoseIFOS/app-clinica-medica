# Script para instalar ngrok no Windows
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalador Ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se já está instalado
$ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue

if ($ngrokPath) {
    Write-Host "Ngrok ja esta instalado!" -ForegroundColor Green
    Write-Host "Versao: " -NoNewline
    ngrok version
    Write-Host ""
    Write-Host "Para usar, execute:" -ForegroundColor Yellow
    Write-Host "  ngrok http 8000" -ForegroundColor Cyan
    exit 0
}

Write-Host "Ngrok nao encontrado. Instalando..." -ForegroundColor Yellow
Write-Host ""

# Verificar se Chocolatey está instalado
$chocoPath = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoPath) {
    Write-Host "Instalando via Chocolatey..." -ForegroundColor Yellow
    choco install ngrok -y
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Ngrok instalado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Proximo passo:" -ForegroundColor Yellow
        Write-Host "1. Crie conta em: https://dashboard.ngrok.com/signup" -ForegroundColor Cyan
        Write-Host "2. Copie seu authtoken" -ForegroundColor Cyan
        Write-Host "3. Execute: ngrok config add-authtoken SEU_TOKEN" -ForegroundColor Cyan
        Write-Host "4. Execute: ngrok http 8000" -ForegroundColor Cyan
    } else {
        Write-Host "Erro ao instalar ngrok" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Chocolatey nao encontrado." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opcao 1: Instalar via Chocolatey (Recomendado)" -ForegroundColor Cyan
    Write-Host "  1. Abra PowerShell como Administrador" -ForegroundColor White
    Write-Host "  2. Execute:" -ForegroundColor White
    Write-Host "     Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
    Write-Host "  3. Execute novamente este script" -ForegroundColor White
    Write-Host ""
    Write-Host "Opcao 2: Download Manual" -ForegroundColor Cyan
    Write-Host "  1. Acesse: https://ngrok.com/download" -ForegroundColor White
    Write-Host "  2. Baixe o executavel" -ForegroundColor White
    Write-Host "  3. Extraia para uma pasta" -ForegroundColor White
    Write-Host "  4. Adicione ao PATH do sistema" -ForegroundColor White
    Write-Host ""
    
    # Abrir página de download
    $response = Read-Host "Deseja abrir a pagina de download? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        Start-Process "https://ngrok.com/download"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

