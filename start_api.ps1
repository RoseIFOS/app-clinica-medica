# Script para iniciar a API FastAPI
Write-Host "========================================" -ForegroundColor Blue
Write-Host "  Iniciando API FastAPI" -ForegroundColor Blue  
Write-Host "========================================" -ForegroundColor Blue

# Ativar ambiente virtual
& ".\venv\Scripts\Activate.ps1"

# Entrar na pasta backend
Set-Location backend

# Iniciar FastAPI
Write-Host "`nIniciando servidor FastAPI..." -ForegroundColor Green
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "API Health: http://localhost:8000/" -ForegroundColor Cyan
Write-Host "`nPressione Ctrl+C para parar o servidor`n" -ForegroundColor Yellow

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

