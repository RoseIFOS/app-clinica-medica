# 🔄 Workflow: Editar Localmente → Visualizar no Lovable

## 🎯 Objetivo

Editar o código do frontend **localmente** (VS Code/Cursor) e visualizar as mudanças **no Lovable** com preview automática.

---

## 📋 Fluxo de Trabalho

```
1. Editar código localmente (VS Code/Cursor)
   ↓
2. Rodar script de sincronização
   ↓
3. Mudanças vão para GitHub (fronty-magic)
   ↓
4. Lovable detecta mudanças automaticamente
   ↓
5. Preview atualizada no Lovable
```

---

## 🚀 Como Usar

### 1️⃣ Edite o Código Localmente

Edite qualquer arquivo do frontend:

```
clinica-medica-app/
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.tsx    ← Edite aqui
    │   │   ├── Pacientes.tsx    ← Edite aqui
    │   │   └── ...
    │   ├── components/
    │   │   └── ...               ← Edite aqui
    │   └── lib/
    │       └── api.ts            ← Edite aqui
    └── ...
```

**Exemplo: Editar Dashboard**

```typescript
// frontend/src/pages/Dashboard.tsx
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard Atualizado! 🎉</h1>
      {/* Suas mudanças aqui */}
    </div>
  );
}
```

### 2️⃣ Sincronize com o Lovable

**Opção A: Script PowerShell (Recomendado)**

```powershell
# Com mensagem personalizada
.\sync-to-lovable.ps1 "Atualiza página de Dashboard"

# Ou sem mensagem (usa padrão)
.\sync-to-lovable.ps1
```

**Opção B: Comandos Manuais**

```bash
cd frontend
git add .
git commit -m "Suas mudanças"
git push lovable HEAD:main
cd ..
```

### 3️⃣ Visualize no Lovable

1. Acesse: https://lovable.dev
2. Faça login com sua conta
3. Abra o projeto: **fronty-magic**
4. A preview será atualizada automaticamente! 🎨

---

## 🎨 Exemplo Completo

### Cenário: Adicionar novo componente

**1. Criar componente localmente**

```typescript
// frontend/src/components/WelcomeCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function WelcomeCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bem-vindo à Clínica Médica! 🏥</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Sistema de gestão completo para sua clínica.</p>
      </CardContent>
    </Card>
  );
}
```

**2. Usar no Dashboard**

```typescript
// frontend/src/pages/Dashboard.tsx
import { WelcomeCard } from "@/components/WelcomeCard";

export default function Dashboard() {
  return (
    <div className="p-6">
      <WelcomeCard />
      {/* Resto do dashboard */}
    </div>
  );
}
```

**3. Sincronizar**

```powershell
.\sync-to-lovable.ps1 "Adiciona WelcomeCard ao Dashboard"
```

**4. Ver no Lovable**
- Abra https://lovable.dev
- Veja o WelcomeCard renderizado!

---

## 🔧 Configurações Importantes

### API Backend

Para ver dados reais no Lovable, você tem 2 opções:

#### Opção 1: Usar Dados Mock (Padrão)
```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'http://localhost:8000/api/v1'; // Mock no Lovable
```

#### Opção 2: Expor Backend com Ngrok

```bash
# Terminal 1: Iniciar backend
cd backend
python -m uvicorn app.main:app --reload

# Terminal 2: Expor com ngrok
ngrok http 8000
```

Copie a URL pública e configure:

```typescript
// frontend/src/lib/api.ts
const API_BASE_URL = 'https://abc123.ngrok.io/api/v1';
```

Depois sincronize:
```powershell
.\sync-to-lovable.ps1 "Configura API com ngrok"
```

**Não esqueça de adicionar no CORS:**
```python
# backend/app/core/config.py
allowed_origins: list = [
    "http://localhost:5173",
    "https://abc123.ngrok.io",
    "https://fronty-magic.lovable.app",  # URL do Lovable
    "*"
]
```

---

## 📊 Vantagens deste Workflow

| Vantagem | Descrição |
|----------|-----------|
| 🎨 **Preview Profissional** | Lovable renderiza com preview bonita |
| ⚡ **Hot Reload** | Mudanças aparecem instantaneamente |
| 💻 **Editor Local** | Use VS Code/Cursor com todas as extensões |
| 🔗 **Integração Git** | Histórico completo no GitHub |
| 🌐 **Compartilhável** | Envie link do Lovable para clientes |
| 🐛 **Debug Local** | Console completo do browser |
| 📱 **Teste Responsivo** | Lovable mostra múltiplas resoluções |

---

## 🛠️ Comandos Úteis

### Ver mudanças antes de sincronizar
```bash
cd frontend
git status
git diff
```

### Desfazer última sincronização
```bash
cd frontend
git reset HEAD~1
```

### Ver histórico de commits
```bash
cd frontend
git log --oneline
```

### Forçar sincronização (cuidado!)
```bash
cd frontend
git push lovable HEAD:main --force
```

---

## 🐛 Troubleshooting

### Erro: "fatal: refusing to merge unrelated histories"

```bash
cd frontend
git pull lovable main --allow-unrelated-histories --rebase
git push lovable HEAD:main
```

### Erro: Conflitos de merge

```bash
cd frontend
# Ver arquivos em conflito
git status

# Resolver conflitos manualmente nos arquivos
# Depois:
git add .
git rebase --continue
git push lovable HEAD:main
```

### Lovable não atualiza

1. Verifique se o push foi bem-sucedido
2. Acesse https://github.com/RoseIFOS/fronty-magic
3. Confirme que os commits estão lá
4. Recarregue o Lovable (Ctrl+Shift+R)

### Erros de compilação no Lovable

- Verifique imports/exports
- Certifique-se de que todos os arquivos foram sincronizados
- Verifique console do Lovable para ver erros específicos

---

## 📁 Estrutura de Diretórios

```
clinica-medica-app/
├── backend/                    # FastAPI (não sincroniza)
├── frontend/                   # Frontend (SINCRONIZA com Lovable)
│   ├── .git/                   # Git local do frontend
│   ├── src/
│   │   ├── pages/             ✅ Edite aqui
│   │   ├── components/        ✅ Edite aqui
│   │   ├── lib/               ✅ Edite aqui
│   │   └── ...
│   └── ...
├── whatsapp-service/           # Node.js (não sincroniza)
├── sync-to-lovable.ps1         # Script de sincronização
└── WORKFLOW_LOVABLE.md         # Este arquivo
```

---

## 🎯 Resumo do Fluxo

1. **Edite** `frontend/src/...` localmente
2. **Rode** `.\sync-to-lovable.ps1 "mensagem"`
3. **Acesse** https://lovable.dev
4. **Veja** as mudanças renderizadas!

---

## 💡 Dicas Pro

### 1. Commits Frequentes
Sincronize após cada feature pequena para ver evolução

```powershell
# Após cada mudança
.\sync-to-lovable.ps1 "Adiciona botão de exportar"
.\sync-to-lovable.ps1 "Melhora estilo do card"
.\sync-to-lovable.ps1 "Fix: corrige bug no formulário"
```

### 2. Use Branches (Avançado)
```bash
cd frontend
git checkout -b feature/nova-pagina
# Faça mudanças
git push lovable feature/nova-pagina
```

### 3. Aliases PowerShell
Adicione ao seu `$PROFILE`:

```powershell
function lovable { .\sync-to-lovable.ps1 $args }
```

Depois use:
```powershell
lovable "Minha mensagem"
```

---

## 🚀 Começando Agora!

1. ✅ Edite um arquivo em `frontend/src/pages/Dashboard.tsx`
2. ✅ Rode `.\sync-to-lovable.ps1 "Teste inicial"`
3. ✅ Abra https://lovable.dev
4. ✅ Veja sua mudança renderizada!

**Pronto! Agora você pode desenvolver localmente e ver no Lovable!** 🎉

