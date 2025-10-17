# 🌐 Conectar Lovable à API Backend Local

## 🎯 Objetivo

Permitir que o Lovable acesse sua API FastAPI rodando localmente usando **ngrok**.

---

## 📋 Pré-requisitos

1. ✅ Backend FastAPI rodando localmente
2. ✅ Ngrok instalado
3. ✅ Conta Lovable ativa

---

## 🚀 Passo a Passo

### 1️⃣ Instalar Ngrok

**Windows (PowerShell como Administrador):**
```powershell
# Via Chocolatey
choco install ngrok

# Ou baixar manualmente
# https://ngrok.com/download
```

**Mac:**
```bash
brew install ngrok
```

**Linux:**
```bash
snap install ngrok
```

### 2️⃣ Criar Conta no Ngrok (Grátis)

1. Acesse: https://dashboard.ngrok.com/signup
2. Crie conta gratuita
3. Copie seu **authtoken**

### 3️⃣ Configurar Authtoken

```bash
ngrok config add-authtoken SEU_TOKEN_AQUI
```

### 4️⃣ Iniciar Backend

**Terminal 1: Backend**
```powershell
cd backend
..\venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Aguarde até ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 5️⃣ Expor com Ngrok

**Terminal 2: Ngrok**
```bash
ngrok http 8000
```

Você verá algo assim:
```
Session Status                online
Account                       seu@email.com
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**📋 COPIE A URL PÚBLICA:**
```
https://abc123def456.ngrok-free.app
```

### 6️⃣ Configurar CORS no Backend

Edite `backend/app/core/config.py`:

```python
class Settings(BaseSettings):
    # ... outras configs ...
    
    allowed_origins: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://abc123def456.ngrok-free.app",  # ← Adicione sua URL do ngrok
        "https://fronty-magic.lovable.app",      # ← URL do Lovable
        "*"  # Durante desenvolvimento
    ]
```

**Salve e o FastAPI recarregará automaticamente** (se estiver com `--reload`).

### 7️⃣ Atualizar Frontend para Usar Ngrok

Edite `frontend/src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://abc123def456.ngrok-free.app/api/v1';
```

**Substitua pela SUA URL do ngrok!**

### 8️⃣ Sincronizar com Lovable

```powershell
.\sync-to-lovable.ps1 "Config: Conecta frontend com backend via ngrok"
```

### 9️⃣ Testar no Lovable

1. Acesse: https://lovable.dev
2. Abra seu projeto: **fronty-magic**
3. Vá para `/login`
4. Teste login com:
   - Email: `admin@clinica.com`
   - Senha: `admin123`

**Deve funcionar! 🎉**

---

## 🔍 Verificar se Está Funcionando

### Teste 1: Acessar API pelo Ngrok

No navegador, abra:
```
https://sua-url-ngrok.ngrok-free.app/docs
```

Você deve ver o **Swagger da API FastAPI**.

### Teste 2: Console do Lovable

No Lovable, abra o **Console do DevTools** (F12):
- Se aparecerem requisições para `ngrok-free.app` → ✅ Funcionando
- Se aparecerem erros CORS → ❌ Configurar CORS no backend

### Teste 3: Login no Lovable

Tente fazer login:
- Login bem-sucedido → ✅ API conectada
- Erro de rede → ❌ Verificar ngrok e CORS

---

## 🐛 Troubleshooting

### Erro: "This site can't be reached"

**Problema:** Backend não está rodando ou ngrok não iniciou

**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:8000/api/v1/docs

# Reiniciar ngrok
ngrok http 8000
```

### Erro: CORS Policy

**Problema:** URL do ngrok não está no CORS

**Solução:**
```python
# backend/app/core/config.py
allowed_origins: list = [
    "https://sua-url-ngrok.ngrok-free.app",  # Copie a URL EXATA
    "*"  # Temporário durante desenvolvimento
]
```

### Erro: "Invalid Host Header"

**Problema:** FastAPI não aceita o host do ngrok

**Solução:** Adicione `--host 0.0.0.0` ao iniciar o backend:
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Ngrok: "Session Expired"

**Problema:** Plano gratuito tem tempo limite (2 horas)

**Solução:**
1. Reinicie o ngrok: `ngrok http 8000`
2. Copie a NOVA URL
3. Atualize `frontend/src/lib/api.ts`
4. Sincronize: `.\sync-to-lovable.ps1`

### Lovable não vê mudanças

**Problema:** Cache do navegador

**Solução:**
1. No Lovable, pressione `Ctrl + Shift + R` (hard reload)
2. Limpe cache: DevTools → Application → Clear Storage

---

## 💡 Dicas Profissionais

### 1. URL Fixa do Ngrok (Plano Pago)

Plano grátis gera URL diferente a cada vez. Para URL fixa:
```bash
# Plano pago ($8/mês)
ngrok http 8000 --domain=seu-dominio.ngrok-free.app
```

### 2. Monitorar Requisições

Acesse o dashboard do ngrok:
```
http://localhost:4040
```

Veja todas as requisições em tempo real!

### 3. Variável de Ambiente Condicional

Para não precisar mudar toda hora:

```typescript
// frontend/src/lib/api.ts
const isDevelopment = window.location.hostname === 'lovable.app';

const API_BASE_URL = isDevelopment
  ? 'https://sua-url-ngrok.ngrok-free.app/api/v1'
  : import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
```

### 4. Script Automático

Crie `start-dev-with-ngrok.ps1`:

```powershell
# Iniciar backend em background
Start-Process powershell -ArgumentList "cd backend; ..\venv\Scripts\activate; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Aguardar backend iniciar
Start-Sleep -Seconds 5

# Iniciar ngrok
Start-Process powershell -ArgumentList "ngrok http 8000"

Write-Host "Backend e Ngrok iniciados!"
Write-Host "Acesse http://localhost:4040 para ver a URL do ngrok"
```

Uso:
```powershell
.\start-dev-with-ngrok.ps1
```

---

## 📊 Comparação: Com vs Sem Ngrok

| Recurso | Sem Ngrok | Com Ngrok |
|---------|-----------|-----------|
| **Login** | Mock apenas | API real ✅ |
| **Cadastro** | Não salva | Salva no DB ✅ |
| **Dados** | Hardcoded | Do PostgreSQL ✅ |
| **WhatsApp** | Não funciona | Funciona ✅ |
| **Relatórios** | Mock | Dados reais ✅ |
| **Upload** | Não funciona | Funciona ✅ |

---

## ⚠️ Limitações Plano Grátis Ngrok

- ⏱️ **Sessão expira** em 2 horas
- 🔄 **URL muda** a cada reinício
- 📊 **40 conexões/minuto**
- 🌐 **1 túnel simultâneo**

**Para produção, considere:**
- Railway (https://railway.app)
- Render (https://render.com)
- DigitalOcean App Platform
- AWS / Azure / GCP

---

## 🎯 Status Após Configuração

Com ngrok configurado:

✅ Lovable → Ngrok → Backend Local → PostgreSQL
✅ Login funcional com dados reais
✅ CRUD de pacientes salvando no banco
✅ WhatsApp enviando mensagens reais
✅ Todas as features funcionando

---

## 🚀 Próximo Passo

Execute agora:

1. **Abra Terminal 1:**
   ```powershell
   cd backend
   ..\venv\Scripts\activate
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Abra Terminal 2:**
   ```bash
   ngrok http 8000
   ```

3. **Copie a URL do ngrok**

4. **Vou configurar o frontend para você!**

**Me avise quando o ngrok estiver rodando e me passe a URL! 🎉**

