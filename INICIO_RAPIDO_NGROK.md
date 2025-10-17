# 🚀 Início Rápido - Conectar Lovable ao Backend

## ⚡ 3 Passos Rápidos

### 1️⃣ Instalar Ngrok (5 minutos)

**Download direto:**
1. Acesse: https://ngrok.com/download
2. Clique em "Download for Windows"
3. Extraia o ZIP para `C:\ngrok`
4. Adicione ao PATH:
   ```powershell
   $env:Path += ";C:\ngrok"
   ```

**Ou via Chocolatey (se tiver):**
```powershell
choco install ngrok -y
```

### 2️⃣ Configurar Ngrok (2 minutos)

1. Criar conta gratuita: https://dashboard.ngrok.com/signup
2. Copiar authtoken do dashboard
3. Executar:
   ```bash
   ngrok config add-authtoken SEU_TOKEN_AQUI
   ```

### 3️⃣ Expor Backend (1 minuto)

**Abra um novo PowerShell e execute:**
```bash
ngrok http 8000
```

Você verá:
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:8000
```

**📋 COPIE ESTA URL! Vou precisar dela.**

---

## ⚙️ Alternativa: Sem Ngrok (Desenvolvimento Local)

Se preferir não usar ngrok agora, posso configurar para:
1. ✅ Testar localmente (localhost:8000)
2. ✅ Salvar no banco local
3. ⚠️ Mas não vai funcionar no Lovable (só localmente)

---

## 🎯 O Que Vou Fazer Depois

Quando você me passar a URL do ngrok, eu vou:

1. ✅ Configurar `frontend/src/lib/api.ts` com sua URL
2. ✅ Atualizar CORS no backend
3. ✅ Sincronizar com Lovable
4. ✅ Testar cadastro de paciente salvando no PostgreSQL

---

## 💡 Escolha Agora:

**A) Instalar Ngrok e expor backend** (RECOMENDADO)
- ✅ Lovable funciona com banco real
- ✅ Todos os botões funcionam
- ⏱️ 10 minutos de setup

**B) Testar só localmente primeiro**
- ✅ Mais rápido para começar
- ❌ Lovable não vai salvar no banco (só mock)
- ⏱️ 2 minutos

**O que prefere? A ou B?**

