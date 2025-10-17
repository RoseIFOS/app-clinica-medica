# 🚀 Alternativas de Deploy (Escolha a Melhor)

## Comparação Rápida

| Serviço | Setup | Grátis | PostgreSQL | SSL | Recomendação |
|---------|-------|--------|------------|-----|--------------|
| **Railway** | 5min | ✅ 500h | ✅ Incluso | ✅ Auto | ⭐⭐⭐⭐⭐ |
| **Render** | 7min | ✅ 750h | ✅ Incluso | ✅ Auto | ⭐⭐⭐⭐ |
| **Fly.io** | 10min | ✅ Limitado | ⚠️ Extra | ✅ Auto | ⭐⭐⭐ |
| **Heroku** | 10min | ❌ Pago | ❌ Pago | ✅ Auto | ⭐⭐ |

---

## 🥇 Opção 1: Railway (MAIS FÁCIL)

### Vantagens:
- ✅ Deploy mais simples
- ✅ PostgreSQL grátis incluído
- ✅ UI bonita e intuitiva
- ✅ Deploy via GitHub automático
- ✅ 500 horas/mês grátis

### Como fazer:
1. Acesse: https://railway.app
2. Login com GitHub
3. "New Project" → "Deploy from GitHub"
4. Selecione: `RoseIFOS/app-clinica-medica`
5. Adicione PostgreSQL
6. Gere domínio público
7. **PRONTO!**

📖 Guia completo: `DEPLOY_RAILWAY.md`

---

## 🥈 Opção 2: Render

### Vantagens:
- ✅ 750 horas/mês grátis
- ✅ PostgreSQL grátis (90 dias)
- ✅ Muito estável
- ✅ Boa documentação

### Como fazer:
1. Acesse: https://render.com
2. Login com GitHub
3. "New" → "Web Service"
4. Conecte repo: `RoseIFOS/app-clinica-medica`
5. Configure:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Adicione PostgreSQL
7. **PRONTO!**

---

## 🥉 Opção 3: Fly.io

### Vantagens:
- ✅ Grátis para projetos pequenos
- ✅ Muito rápido
- ✅ Global (múltiplas regiões)

### Desvantagens:
- ⚠️ Requer CLI
- ⚠️ Configuração mais técnica

### Como fazer:
1. Instale CLI: `powershell -c "iwr https://fly.io/install.ps1 -useb | iex"`
2. Login: `fly auth login`
3. Deploy: `fly launch`
4. Adicione PostgreSQL: `fly postgres create`
5. Conecte: `fly postgres attach`

---

## 💡 Minha Recomendação Profissional

### Para MVP e Lovable: **Railway** 🚀

**Por quê?**
1. ✅ Mais rápido (5 minutos)
2. ✅ PostgreSQL incluído
3. ✅ URL permanente
4. ✅ SSL automático
5. ✅ Deploy automático via Git
6. ✅ Sem necessidade de CLI
7. ✅ Interface visual ótima

### Passo a Passo Rápido:

```bash
1. https://railway.app → Login GitHub
2. New Project → Deploy from GitHub
3. Selecionar: app-clinica-medica
4. Add Database → PostgreSQL
5. Settings → Generate Domain
6. Copiar URL
7. Configurar no Lovable
```

**Tempo: 5 minutos**
**Custo: R$ 0,00**
**Resultado: Backend + PostgreSQL rodando 24/7 com URL pública**

---

## 🔧 Depois do Deploy

### 1. Pegar URL do Railway
Exemplo: `https://app-clinica-medica-production.up.railway.app`

### 2. Atualizar Frontend

Editar `frontend/src/lib/api.ts`:
```typescript
const API_BASE_URL = 'https://SUA-URL-RAILWAY.up.railway.app/api/v1';
```

### 3. Sincronizar Lovable
```powershell
.\sync-to-lovable.ps1 "config: Conecta ao backend Railway"
```

### 4. Atualizar CORS

O backend já aceita `*` durante desenvolvimento, mas em produção:

`backend/app/core/config.py`:
```python
allowed_origins: list = [
    "https://fronty-magic.lovable.app",
    "https://SUA-URL-RAILWAY.up.railway.app",
    "*"
]
```

---

## 📊 Custos Comparados

| Serviço | Grátis | Após Limite | PostgreSQL |
|---------|--------|-------------|------------|
| Railway | 500h/mês | $5/mês | Incluído |
| Render | 750h/mês | $7/mês | $7/mês (após 90 dias) |
| Fly.io | 160h/mês | $1.94/mês | $1.60/mês |
| Ngrok | 2h/sessão | $8/mês | Não inclui |

**Railway = Melhor custo-benefício para MVP**

---

## 🎯 Decisão Agora

**Você tem 3 opções:**

### A) Railway (RECOMENDO) ⭐
- ✅ Mais fácil e rápido
- ⏱️ 5 minutos de setup
- 💰 Grátis com PostgreSQL
- 🔗 URL permanente

### B) Render
- ✅ Mais horas grátis (750h)
- ⏱️ 7 minutos de setup
- 💰 PostgreSQL grátis 90 dias

### C) Continuar tentando Ngrok
- ⚠️ Problemas de configuração
- ⚠️ URL muda sempre
- ⚠️ Limite de 2 horas por sessão
- ❌ Não é profissional para MVP

---

## 🚀 Ação Imediata

**Vou fazer Railway deploy para você?**

Posso te guiar passo a passo ou você pode seguir o `DEPLOY_RAILWAY.md` sozinho.

**Me diga: Vamos de Railway?** 🎯

