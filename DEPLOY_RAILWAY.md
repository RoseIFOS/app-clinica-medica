# 🚀 Deploy Backend no Railway (5 minutos)

## Por que Railway?

- ✅ **Grátis** (500 horas/mês)
- ✅ **PostgreSQL incluído**
- ✅ **Deploy automático do GitHub**
- ✅ **URL pública permanente**
- ✅ **Sem configuração de domínio**
- ✅ **SSL automático**

---

## 🚀 Passo a Passo

### 1️⃣ Criar Conta Railway (1 minuto)

1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Login com GitHub (recomendado)

### 2️⃣ Criar Novo Projeto (2 minutos)

1. Clique em "+ New Project"
2. Selecione "Deploy from GitHub repo"
3. Conecte sua conta GitHub se necessário
4. Selecione: **RoseIFOS/app-clinica-medica**
5. Railway vai detectar automaticamente que é Python

### 3️⃣ Configurar Variáveis de Ambiente (1 minuto)

No painel do Railway, vá em "Variables" e adicione:

```
DATABASE_URL=postgresql://usuario:senha@host:5432/db
SECRET_KEY=sua-chave-secreta-aqui-mude-isso
ALLOWED_ORIGINS=*
```

### 4️⃣ Adicionar PostgreSQL (1 minuto)

1. No projeto, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Railway cria automaticamente
4. Copie a `DATABASE_URL` gerada
5. Cole na variável de ambiente do backend

### 5️⃣ Pegar URL Pública

Após deploy:
1. Clique no serviço backend
2. Vá em "Settings" → "Generate Domain"
3. Railway gera URL tipo: `https://seu-projeto.up.railway.app`

**✅ COPIE ESTA URL!**

---

## 🔧 Arquivos Necessários (Já existem!)

Railway detecta automaticamente:
- ✅ `requirements.txt` → Instala dependências
- ✅ `Dockerfile` → Usa se existir
- ✅ Procfile → Define comando de start

Vamos criar um Procfile otimizado:

```
web: cd backend && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

## 📊 Depois do Deploy

Você terá:
- ✅ Backend rodando 24/7
- ✅ PostgreSQL gerenciado
- ✅ URL pública permanente
- ✅ SSL automático
- ✅ Logs em tempo real
- ✅ Deploy automático via GitHub

**Tempo total: ~5 minutos**

---

## 💰 Custo

**GRÁTIS** até 500 horas/mês (suficiente para MVP e testes)

Depois: $5/mês por serviço (opcional)

