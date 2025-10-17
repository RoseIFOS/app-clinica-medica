# Script para iniciar ngrok
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Ngrok" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Verificando se backend esta rodando..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/docs" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend rodando na porta 8000!" -ForegroundColor Green
} catch {
    Write-Host "AVISO: Backend nao esta respondendo em localhost:8000" -ForegroundColor Yellow
    Write-Host "Certifique-se de que o Docker esta rodando:" -ForegroundColor Yellow
    Write-Host "  docker ps" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "Iniciando ngrok..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Aguarde a URL aparecer e COPIE a URL publica!" -ForegroundColor Cyan
Write-Host "(Exemplo: https://abc123.ngrok-free.app)" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar ngrok
ngrok http 8000

