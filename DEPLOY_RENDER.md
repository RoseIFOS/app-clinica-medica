# 🚀 Deploy no Render (7 minutos)

## Por que Render?

- ✅ **Mais estável** que Railway
- ✅ **PostgreSQL grátis** incluído (90 dias, depois $7/mês)
- ✅ **750 horas grátis/mês** (mais que Railway!)
- ✅ **Interface mais simples**
- ✅ **Deploy automático** do GitHub
- ✅ **SSL automático**
- ✅ **Backup automático**

---

## 🚀 Passo a Passo

### 1️⃣ Criar Conta Render (1 minuto)

1. Acesse: https://render.com
2. Clique em "Get Started"
3. Login com GitHub
4. Autorize Render

### 2️⃣ Criar PostgreSQL (2 minutos)

1. No Dashboard, clique em "+ New"
2. Selecione "PostgreSQL"
3. Configurações:
   - **Name**: `clinica-medica-db`
   - **Database**: `clinica_medica`
   - **User**: `clinica_user`
   - **Region**: Oregon (US West) - mais próximo
   - **PostgreSQL Version**: 15
   - **Plan**: Free
4. Clique em "Create Database"
5. **Aguarde** ~2 minutos (vai criar o banco)
6. Quando terminar, na aba "Connect", **COPIE**:
   - **Internal Database URL** (para o backend)
   - **External Database URL** (para acessar localmente)

### 3️⃣ Criar Web Service (3 minutos)

1. Clique em "+ New" → "Web Service"
2. Selecione "Build and deploy from a Git repository"
3. Clique em "Connect" ao lado de GitHub
4. **Se não aparecer seus repos:**
   - Clique em "Configure GitHub App"
   - Selecione "RoseIFOS/app-clinica-medica"
   - Salve
5. **De volta ao Render**, selecione o repo
6. Configurações:
   - **Name**: `clinica-medica-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend` ← **IMPORTANTE!**
   - **Runtime**: Python 3
   - **Build Command**: 
     ```
     pip install -r requirements.txt && alembic upgrade head
     ```
   - **Start Command**:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Plan**: Free

### 4️⃣ Configurar Variáveis de Ambiente (1 minuto)

Na seção "Environment Variables", adicione:

```
DATABASE_URL = [Cole a Internal Database URL do PostgreSQL]
SECRET_KEY = mude-isso-para-algo-muito-secreto-123456
ALLOWED_ORIGINS = *
PYTHONPATH = /opt/render/project/src
```

**Clique em "Create Web Service"**

### 5️⃣ Aguardar Deploy (~3 minutos)

Render vai:
1. Clonar seu repo
2. Instalar dependências
3. Executar migrações (alembic upgrade head)
4. Iniciar o servidor

Você verá os logs em tempo real!

### 6️⃣ Pegar URL Pública

Após deploy bem-sucedido:
- URL será tipo: `https://clinica-medica-backend.onrender.com`
- Acesse: `https://clinica-medica-backend.onrender.com/docs`
- Deve ver o Swagger da API!

**✅ COPIE ESTA URL E ME PASSE!**

---

## 🔧 Troubleshooting

### Erro: "Build failed"

**Verifique:**
1. Root Directory está `backend`? ✅
2. Build command correto? ✅
3. Logs mostram erro específico? (veja e me avise)

### Erro: "Health check failed"

**Solução:**
1. Vá em "Settings" → "Health Check Path"
2. Mude para: `/api/v1/dashboard/status`
3. Ou desabilite temporariamente

### Erro: "Database connection"

**Verifique:**
1. `DATABASE_URL` está correta?
2. É a **Internal** Database URL?
3. Postgres está rodando? (veja no Dashboard)

### Render não lista meus repos

**Solução:**
1. Clique em "Configure GitHub App"
2. Em "Repository access", selecione:
   - "All repositories" OU
   - "Only select repositories" → Escolha `app-clinica-medica`
3. Salve e volte ao Render

---

## 💾 Executar Seed Data

Após deploy, para popular o banco:

1. **Opção A: Via Dashboard Render**
   - Vá no serviço backend
   - Aba "Shell"
   - Execute: `python seed_data.py`

2. **Opção B: Localmente**
   ```powershell
   # Configure DATABASE_URL (use External URL)
   $env:DATABASE_URL="[External Database URL]"
   
   cd backend
   python seed_data.py
   ```

---

## ⚠️ Importante: Free Tier

- ✅ **750 horas/mês** (suficiente para 24/7)
- ⚠️ **Spin down após 15min inatividade** (primeira request demora ~30s)
- ✅ **PostgreSQL grátis 90 dias**, depois $7/mês
- 💡 **Para produção**: upgrade para $7/mês (sem spin down)

---

## 📊 Render vs Railway vs Vercel

| Recurso | Render | Railway | Vercel |
|---------|--------|---------|--------|
| Estabilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Setup | 7min | 5min | 5min |
| PostgreSQL | Incluso | Incluso | Externo |
| Horas Grátis | 750h | 500h | Ilimitado |
| GitHub Issues | Raro | Às vezes | Raro |
| Documentação | Excelente | Boa | Excelente |

**Render = Melhor para FastAPI + PostgreSQL**

---

## ✅ Checklist

- [ ] Conta Render criada
- [ ] PostgreSQL criado (Internal URL copiada)
- [ ] Web Service criado (Root Directory = `backend`)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido (logs sem erro)
- [ ] URL pública funcionando (`/docs`)
- [ ] Seed data executado (opcional)
- [ ] URL copiada e passada para configurar Lovable

---

## 🎯 Próximo Passo

**Após pegar a URL do Render, me passe que eu:**
1. Configuro o frontend automaticamente
2. Sincronizo com Lovable
3. Testo conexão completa

**Aguardando sua URL do Render!** 🚀

