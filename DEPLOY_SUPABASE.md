# 🚀 FastAPI + PostgreSQL do Supabase (10 minutos)

## 🎯 Estratégia

- ✅ **PostgreSQL grátis** do Supabase (500MB)
- ✅ **Backend FastAPI** no Render/Railway
- ✅ **Frontend** no Lovable
- ✅ **Tudo conectado!**

---

## 📋 Passo a Passo

### 1️⃣ Criar Projeto Supabase (2 min)

1. Acesse: https://supabase.com
2. Login com GitHub
3. "New Project"
4. Configurações:
   - **Name**: `clinica-medica`
   - **Database Password**: [Crie uma senha forte]
   - **Region**: South America (São Paulo) ← Mais próximo!
   - **Pricing Plan**: Free
5. Clique "Create new project"
6. **Aguarde** ~2 minutos (criando banco)

### 2️⃣ Pegar Credenciais do PostgreSQL (1 min)

1. No projeto, vá em "Settings" (ícone engrenagem)
2. Clique em "Database"
3. Role até "Connection string"
4. Selecione "URI" (não Session mode)
5. **COPIE** a string:
   ```
   postgresql://postgres.xxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
6. **Substitua `[SUA-SENHA]`** pela senha que você criou

### 3️⃣ Criar Tabelas (3 min)

**Opção A: Via SQL Editor (Recomendado)**

1. No Supabase, vá em "SQL Editor"
2. "New query"
3. Cole seu schema SQL (vou gerar para você!)
4. Execute

**Opção B: Via Alembic Local**

```powershell
# Configure DATABASE_URL
$env:DATABASE_URL="[Cole a URL do Supabase]"

cd backend
alembic upgrade head
python seed_data.py
```

### 4️⃣ Deploy Backend no Render (4 min)

1. Acesse: https://render.com
2. Login com GitHub
3. "+ New" → "Web Service"
4. Selecione repo: `RoseIFOS/app-clinica-medica`
5. Configurações:
   - **Root Directory**: `backend`
   - **Build Command**: 
     ```
     pip install -r requirements.txt && alembic upgrade head
     ```
   - **Start Command**:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
6. **Environment Variables**:
   ```
   DATABASE_URL = [URL do Supabase PostgreSQL]
   SECRET_KEY = sua-chave-secreta-123
   ALLOWED_ORIGINS = *
   ```
7. "Create Web Service"
8. Aguarde deploy (~3 min)
9. **COPIE** a URL: `https://xxx.onrender.com`

---

## 🎯 Vantagens desta Abordagem

✅ **PostgreSQL Supabase** - Grátis, gerenciado, backups automáticos
✅ **Backend FastAPI** - Mantém todo seu código
✅ **Deploy Render** - Grátis, estável, 750h/mês
✅ **Frontend Lovable** - Interface bonita
✅ **Tudo conectado!**

---

## 📊 Arquitetura Final

```
Lovable (Frontend)
    ↓
Render (FastAPI Backend)
    ↓
Supabase (PostgreSQL)
```

**Custo Total: R$ 0,00** ✅

---

## 🔧 Configurar no Lovable

Após ter a URL do Render:

1. Editar `frontend/src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://sua-url-render.onrender.com/api/v1';
   ```

2. Sincronizar:
   ```powershell
   .\sync-to-lovable.ps1 "config: Conecta ao backend Render + Supabase"
   ```

3. **PRONTO!** Lovable agora salva no PostgreSQL do Supabase via FastAPI!

---

## 💡 Por que não usar Supabase REST API direto?

| Aspecto | FastAPI (atual) | Supabase REST |
|---------|----------------|---------------|
| Código existente | ✅ Mantém tudo | ❌ Reescrever tudo |
| Lógica complexa | ✅ Python | ⚠️ TypeScript |
| Validação | ✅ Pydantic | ⚠️ Manual |
| Autenticação | ✅ JWT custom | ⚠️ Supabase Auth |
| WhatsApp Service | ✅ Funciona | ❌ Não integra |
| Tempo para migrar | 0 min | ~10 horas |

**Decisão: Manter FastAPI + Usar PostgreSQL do Supabase = Melhor dos dois mundos!**

---

## 🚀 Próximo Passo

**Vamos fazer agora:**

1. ✅ Criar projeto Supabase (2 min)
2. ✅ Copiar URL PostgreSQL
3. ✅ Deploy Render com DATABASE_URL do Supabase
4. ✅ Configurar Lovable
5. ✅ **FUNCIONA!**

**Pronto para começar?** 🎯

