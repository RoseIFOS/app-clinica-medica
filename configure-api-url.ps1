# Script para configurar URL da API no frontend
param(
    [Parameter(Mandatory=$true)]
    [string]$NgrokUrl
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configurando API URL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Remover trailing slash se houver
$NgrokUrl = $NgrokUrl.TrimEnd('/')

Write-Host "URL do Ngrok: $NgrokUrl" -ForegroundColor Yellow
Write-Host ""

# 1. Atualizar frontend/src/lib/api.ts
Write-Host "1. Atualizando frontend/src/lib/api.ts..." -ForegroundColor Yellow

$apiFile = "frontend\src\lib\api.ts"
$content = Get-Content $apiFile -Raw

$newContent = $content -replace "const API_BASE_URL = import\.meta\.env\.VITE_API_URL \|\| 'http://localhost:8000/api/v1';", "const API_BASE_URL = import.meta.env.VITE_API_URL || '$NgrokUrl/api/v1';"

Set-Content $apiFile -Value $newContent -NoNewline

Write-Host "   Configurado para: $NgrokUrl/api/v1" -ForegroundColor Green

# 2. Atualizar CORS no backend
Write-Host ""
Write-Host "2. Atualizando CORS no backend..." -ForegroundColor Yellow

$configFile = "backend\app\core\config.py"
$content = Get-Content $configFile -Raw

# Procurar por allowed_origins e adicionar a URL do ngrok se não existir
if ($content -notmatch [regex]::Escape($NgrokUrl)) {
    # Adicionar a URL do ngrok na lista de allowed_origins
    $content = $content -replace '(allowed_origins: list = \[)', "`$1`n        `"$NgrokUrl`","
    Set-Content $configFile -Value $content -NoNewline
    Write-Host "   Adicionado $NgrokUrl ao CORS" -ForegroundColor Green
} else {
    Write-Host "   URL ja existe no CORS" -ForegroundColor Gray
}

# 3. Sincronizar com Lovable
Write-Host ""
Write-Host "3. Sincronizando com Lovable..." -ForegroundColor Yellow
.\sync-to-lovable.ps1 "config: Conecta frontend ao backend via ngrok ($NgrokUrl)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Configuracao Completa!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "1. Acesse Lovable: https://lovable.dev" -ForegroundColor White
Write-Host "2. Abra o projeto: fronty-magic" -ForegroundColor White
Write-Host "3. Force reload: Ctrl + Shift + R" -ForegroundColor White
Write-Host "4. Teste cadastrar um paciente!" -ForegroundColor White
Write-Host ""
Write-Host "O cadastro agora vai SALVAR NO BANCO!" -ForegroundColor Green
Write-Host ""

