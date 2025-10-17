# 🚀 Deploy na Vercel (5 minutos)

## Por que Vercel?

- ✅ **Grátis** ilimitado para hobby
- ✅ **Deploy automático** do GitHub
- ✅ **SSL automático**
- ✅ **Muito rápido**
- ✅ **Zero configuração**
- ✅ **URL permanente**

⚠️ **Importante**: Vercel é serverless, então precisamos de banco externo (usaremos Neon PostgreSQL grátis)

---

## 🚀 Passo a Passo

### 1️⃣ Criar Conta Vercel (1 minuto)

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Login com GitHub (recomendado)
4. Autorize Vercel

### 2️⃣ Criar Banco PostgreSQL Grátis no Neon (2 minutos)

1. Acesse: https://neon.tech
2. Login com GitHub
3. Clique em "Create Project"
4. Nome: `clinica-medica-db`
5. Região: escolha a mais próxima
6. **COPIE** a `Connection String`:
   ```
   postgresql://user:password@host.neon.tech/clinica_medica?sslmode=require
   ```

### 3️⃣ Deploy no Vercel (2 minutos)

1. No Vercel, clique em "+ New Project"
2. Selecione "Import Git Repository"
3. Escolha: `RoseIFOS/app-clinica-medica`
4. **Configure Variáveis de Ambiente**:
   
   Clique em "Environment Variables" e adicione:

   ```
   DATABASE_URL = [Cole a URL do Neon PostgreSQL]
   SECRET_KEY = mude-isso-para-algo-secreto-123456
   ALLOWED_ORIGINS = *
   ```

5. Clique em "Deploy"
6. Aguarde ~2 minutos

### 4️⃣ Pegar URL do Deploy

Após deploy:
- Vercel gera URL tipo: `https://app-clinica-medica.vercel.app`
- **COPIE ESTA URL!**

### 5️⃣ Executar Migrações

Como é serverless, execute migrações localmente:

```powershell
# Configure DATABASE_URL local
$env:DATABASE_URL="[Cole a URL do Neon]"

# Execute migrações
cd backend
alembic upgrade head

# Execute seed
python seed_data.py
```

---

## ✅ Pronto!

Seu backend está rodando em:
```
https://app-clinica-medica.vercel.app
```

API docs em:
```
https://app-clinica-medica.vercel.app/docs
```

---

## 🔧 Troubleshooting

### Erro: "Module not found"

Vercel precisa do `requirements.txt` na raiz. Já está configurado!

### Erro: "Database connection"

Verifique se a `DATABASE_URL` do Neon está correta nas variáveis de ambiente.

### Deploy falhou

Veja os logs no Vercel Dashboard para detalhes específicos.

---

## 💰 Custo

- **Vercel**: Grátis (hobby)
- **Neon PostgreSQL**: Grátis (500MB, suficiente para MVP)
- **Total**: R$ 0,00

---

## 🎯 Próximo Passo

Após obter a URL do Vercel, me passe para eu configurar o frontend!

