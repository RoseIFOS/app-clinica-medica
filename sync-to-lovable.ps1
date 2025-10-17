# Script para sincronizar mudanças do frontend local para o Lovable
# Uso: .\sync-to-lovable.ps1 "mensagem do commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$Message = "Update from local development"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sync Frontend → Lovable" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Erro: Execute este script da raiz do projeto" -ForegroundColor Red
    exit 1
}

# Entrar no diretório frontend
Set-Location frontend

Write-Host "📦 Adicionando mudanças..." -ForegroundColor Yellow
git add .

Write-Host "💾 Fazendo commit local..." -ForegroundColor Yellow
git commit -m "$Message" 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nenhuma mudança para commitar" -ForegroundColor Yellow
} else {
    Write-Host "✅ Commit criado: $Message" -ForegroundColor Green
}

Write-Host "🚀 Enviando para Lovable (fronty-magic)..." -ForegroundColor Yellow

# Puxar últimas mudanças do Lovable primeiro
Write-Host "⬇️  Puxando mudanças do Lovable..." -ForegroundColor Yellow
git pull lovable main --rebase 2>$null

# Enviar para o Lovable
git push lovable HEAD:main -f

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ Sincronização completa!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Acesse o Lovable para ver as mudanças:" -ForegroundColor Cyan
    Write-Host "   https://lovable.dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📂 Repositório GitHub:" -ForegroundColor Cyan
    Write-Host "   https://github.com/RoseIFOS/fronty-magic" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao enviar para o Lovable" -ForegroundColor Red
    Write-Host "   Tente resolver conflitos manualmente" -ForegroundColor Yellow
}

# Voltar ao diretório raiz
Set-Location ..

