# 🔄 Desenvolvimento Híbrido: Lovable + Backend Local

## 📌 Estratégia Recomendada

Manter **dois ambientes de desenvolvimento**:

1. **Lovable** (https://lovable.dev) - Para desenvolvimento visual do frontend
2. **Local** (este repo) - Para integração backend + frontend

---

## 🎨 Desenvolvimento no Lovable

### Vantagens
- ✅ Preview instantânea das mudanças
- ✅ Hot reload automático
- ✅ Deploy preview para cada commit
- ✅ Colaboração visual
- ✅ Não precisa configurar ambiente local

### Como Trabalhar

1. **Acesse o projeto no Lovable**
   - URL: https://lovable.dev (faça login)
   - Projeto: fronty-magic

2. **Faça alterações visuais**
   - Edite componentes
   - Teste responsividade
   - Ajuste estilos
   - Veja preview em tempo real

3. **Commit no Lovable**
   - Lovable faz commit automático
   - Ou faça commit manual
   - Mudanças vão para: https://github.com/RoseIFOS/fronty-magic

### ⚠️ Importante: API Mock no Lovable

O Lovable usa dados mock. Para testar com API real, você precisa:

**Opção A: Configurar API remota**
```typescript
// No Lovable, edite src/lib/api.ts
const API_BASE_URL = 'https://sua-api-backend.com/api/v1';
// Ou use ngrok para expor localhost
```

**Opção B: Apenas desenvolvimento visual**
- Desenvolva UI/UX no Lovable
- Teste integração localmente depois

---

## 💻 Desenvolvimento Local (Integração Completa)

### Quando Usar
- ✅ Testar integração com API real
- ✅ Testar autenticação JWT
- ✅ Testar fluxo completo
- ✅ Debug de problemas de integração

### Como Trabalhar

1. **Iniciar Backend**
   ```bash
   cd backend
   source ../venv/bin/activate  # Linux/Mac
   # ou: ..\venv\Scripts\activate  # Windows
   python -m uvicorn app.main:app --reload
   ```

2. **Iniciar Frontend Local**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Acessar**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

---

## 🔄 Fluxo de Trabalho Híbrido

### Ciclo de Desenvolvimento

```
1. Design/UI no Lovable
   ↓
2. Commit automático → GitHub (fronty-magic)
   ↓
3. Puxar mudanças para local
   ↓
4. Testar integração com backend
   ↓
5. Ajustes de integração localmente
   ↓
6. Commit → GitHub (clinica-medica-app)
```

### Script de Sincronização

Crie um script para sincronizar os repos:

**Windows PowerShell:**
```powershell
# sync-frontend.ps1
param(
    [string]$Source = "..\fronty-magic",
    [string]$Target = ".\frontend"
)

Write-Host "🔄 Sincronizando frontend do Lovable..."

# Puxar últimas mudanças do Lovable
Set-Location $Source
git pull origin main

# Voltar e copiar arquivos
Set-Location -
Copy-Item -Path "$Source\src\*" -Destination "$Target\src\" -Recurse -Force

Write-Host "✅ Frontend sincronizado!"
```

**Linux/Mac:**
```bash
#!/bin/bash
# sync-frontend.sh

SOURCE="../fronty-magic"
TARGET="./frontend"

echo "🔄 Sincronizando frontend do Lovable..."

# Puxar últimas mudanças
cd $SOURCE
git pull origin main

# Voltar e copiar
cd -
cp -r $SOURCE/src/* $TARGET/src/

echo "✅ Frontend sincronizado!"
```

---

## 🌐 Opção: Expor Backend Local para Lovable

Se quiser testar a API real no Lovable:

### Usando Ngrok

1. **Instalar ngrok**
   ```bash
   # Windows (via Chocolatey)
   choco install ngrok
   
   # Mac
   brew install ngrok
   
   # Linux
   snap install ngrok
   ```

2. **Expor backend**
   ```bash
   # Iniciar backend
   cd backend
   python -m uvicorn app.main:app --reload
   
   # Em outro terminal
   ngrok http 8000
   ```

3. **Copiar URL pública**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:8000
   ```

4. **Configurar no Lovable**
   ```typescript
   // src/lib/api.ts (no Lovable)
   const API_BASE_URL = 'https://abc123.ngrok.io/api/v1';
   ```

### ⚠️ Cuidado com CORS

Adicione a URL do Lovable no backend:

```python
# backend/app/core/config.py
allowed_origins: list = [
    "http://localhost:5173",
    "https://abc123.ngrok.io",
    "https://seu-projeto.lovable.app",  # URL do preview Lovable
    "*"  # Temporário para desenvolvimento
]
```

---

## 📊 Comparação dos Ambientes

| Aspecto | Lovable | Local (Este Repo) |
|---------|---------|-------------------|
| **Preview** | Instantâneo | Manual (npm run dev) |
| **API Real** | Não (mock) | Sim |
| **Autenticação** | Mock | JWT real |
| **Setup** | Zero | Requer instalação |
| **Colaboração** | Fácil | Git workflow |
| **Deploy Preview** | Automático | Manual |
| **Debug** | Limitado | Console completo |
| **Integração** | Não | Backend + Frontend |

---

## 🎯 Recomendação Final

### Para Desenvolvimento UI/UX
**Use Lovable** 🎨
- Design de páginas
- Ajustes de layout
- Componentes visuais
- Responsividade
- Protótipos rápidos

### Para Desenvolvimento Funcional
**Use Local** 💻
- Integração com API
- Autenticação real
- Fluxos completos
- Validações
- Debug profundo
- Testes end-to-end

---

## 🔧 Minha Sugestão

**Mantenha os dois ambientes:**

1. **Lovable (fronty-magic)** - Para desenvolvimento visual rápido
2. **Local (clinica-medica-app)** - Para integração e testes completos

**Sincronize periodicamente:**
- Diariamente ou quando terminar uma feature
- Use o script de sincronização
- Teste localmente antes de commitar

**Vantagens:**
- ✅ Melhor dos dois mundos
- ✅ Preview rápida no Lovable
- ✅ Integração real localmente
- ✅ Flexibilidade total

---

## 🚀 Próximos Passos

Você prefere:

### A) Manter como está (Frontend integrado aqui)
- Frontend Lovable já está copiado para `frontend/`
- Desenvolve tudo localmente
- Sem preview do Lovable

### B) Reverter e usar dois repos
- Desfazer integração
- Manter `fronty-magic` separado
- Sincronizar manualmente quando necessário

### C) Híbrido (Recomendado)
- Manter frontend integrado aqui
- Continuar desenvolvendo no Lovable
- Sincronizar periodicamente

**Qual você prefere?**

