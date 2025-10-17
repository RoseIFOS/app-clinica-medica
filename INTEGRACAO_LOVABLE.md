# 🔗 Integração do Frontend Lovable com Backend FastAPI

## 📌 Visão Geral

Este guia mostra como integrar o frontend criado pelo Lovable com o backend FastAPI já existente neste repositório.

---

## 🎯 Estratégias de Integração

Você tem **3 opções** para integrar:

### Opção 1: Monorepo (Recomendado) 📦
**Trazer o frontend do Lovable para este repositório**

✅ **Vantagens:**
- Tudo em um único repositório
- Versionamento unificado
- Deploy mais simples
- Melhor para desenvolvimento

❌ **Desvantagens:**
- Repositório maior
- Histórico do Git misto

### Opção 2: Repositórios Separados 🔀
**Manter frontend e backend em repos diferentes**

✅ **Vantagens:**
- Históricos independentes
- Deploys independentes
- Times podem trabalhar separadamente

❌ **Desvantagens:**
- Configuração mais complexa
- Sincronização manual

### Opção 3: Git Submodule 🔗
**Frontend como submodule do backend**

✅ **Vantagens:**
- Mantém históricos separados
- Repos vinculados
- Versionamento específico

❌ **Desvantagens:**
- Complexidade do Git Submodule
- Curva de aprendizado

---

## 🚀 Opção 1: Monorepo (RECOMENDADO)

### Passo 1: Preparar o Repositório Atual

```bash
# Criar backup do frontend React antigo (opcional)
cd frontend
cd ..
mv frontend frontend-react-old

# Ou deletar se não precisar
# rm -rf frontend
```

### Passo 2: Clonar o Frontend Lovable Temporariamente

```bash
# Em outro diretório (fora do projeto)
cd ..
git clone [URL-DO-REPO-LOVABLE] lovable-frontend-temp
```

### Passo 3: Copiar Frontend para Este Repo

```bash
# Voltar para o projeto
cd clinica-medica-app

# Copiar frontend (ajuste o caminho conforme necessário)
cp -r ../lovable-frontend-temp/* ./frontend/

# Ou no Windows PowerShell:
# Copy-Item -Recurse -Force ..\lovable-frontend-temp\* .\frontend\
```

### Passo 4: Configurar Variáveis de Ambiente

Edite `frontend/.env` ou `frontend/.env.local`:

```env
# API Backend
VITE_API_URL=http://localhost:8000/api/v1
VITE_API_BASE_URL=http://localhost:8000

# Outras configs do Lovable (se houver)
```

### Passo 5: Atualizar Configuração da API

Encontre o arquivo de configuração da API no frontend (geralmente `src/config/api.ts` ou similar):

```typescript
// frontend/src/config/api.ts (ou onde estiver)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Passo 6: Atualizar docker-compose.yml

```yaml
services:
  # ... outros serviços ...

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"  # ou a porta que o Lovable usa
    environment:
      - VITE_API_URL=http://localhost:8000/api/v1
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    command: npm run dev
```

### Passo 7: Criar Dockerfile para o Frontend (se não tiver)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Passo 8: Testar a Integração

```bash
# Iniciar backend
cd backend
source ../venv/bin/activate  # Linux/Mac
# ou: ..\venv\Scripts\activate  # Windows
python -m uvicorn app.main:app --reload

# Em outro terminal, iniciar frontend
cd frontend
npm install
npm run dev

# Ou usar Docker Compose
docker-compose up -d
```

### Passo 9: Atualizar .gitignore

```gitignore
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env.local
frontend/.env.production

# Frontend antigo (se moveu)
frontend-react-old/
```

### Passo 10: Fazer Commit

```bash
# Adicionar frontend
git add frontend/

# Commit
git commit -m "feat: Adiciona frontend criado pelo Lovable

- Interface moderna e responsiva
- Integração com API FastAPI
- Configuração de ambiente para desenvolvimento
- Docker support"

# Push
git push origin main
```

### Passo 11: Limpar Repo Temporário

```bash
# Deletar clone temporário
cd ..
rm -rf lovable-frontend-temp
```

---

## 🔀 Opção 2: Repositórios Separados

### Configuração

**Repo Backend (este):**
```yaml
# docker-compose.yml
services:
  backend:
    # ... configuração atual ...
    environment:
      - CORS_ORIGINS=http://localhost:5173,https://seu-frontend.vercel.app
```

**Repo Frontend (Lovable):**
```env
# .env
VITE_API_URL=http://localhost:8000/api/v1

# Para produção
VITE_API_URL=https://sua-api-backend.com/api/v1
```

### Deploy Separado

- **Backend**: Railway, Render, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, GitHub Pages

---

## 🔗 Opção 3: Git Submodule

### Adicionar Frontend como Submodule

```bash
# Remover frontend atual (se houver)
rm -rf frontend

# Adicionar como submodule
git submodule add [URL-DO-REPO-LOVABLE] frontend

# Commit
git commit -m "feat: Adiciona frontend Lovable como submodule"
git push
```

### Clonar Projeto com Submodule

```bash
# Clone recursivo
git clone --recursive [URL-DESTE-REPO]

# Ou se já clonou
git submodule update --init --recursive
```

### Atualizar Submodule

```bash
# Atualizar frontend
cd frontend
git pull origin main

# Voltar e commitar a atualização
cd ..
git add frontend
git commit -m "chore: Atualiza frontend submodule"
git push
```

---

## 🔧 Configurações Importantes

### CORS no Backend

Verifique `backend/app/core/config.py`:

```python
class Settings(BaseSettings):
    # ... outras configs ...
    
    # Adicionar URL do frontend Lovable
    allowed_origins: list = [
        "http://localhost:5173",  # Vite dev
        "http://localhost:3000",  # Caso use outra porta
        "https://seu-frontend.vercel.app",  # Produção
        "*"  # Durante desenvolvimento (remover em produção!)
    ]
```

### Autenticação JWT

Certifique-se que o frontend está enviando o token corretamente:

```typescript
// frontend/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📋 Checklist de Integração

### Backend ✅
- [ ] CORS configurado com URL do frontend
- [ ] API endpoints testados e funcionando
- [ ] Documentação Swagger acessível
- [ ] Seed data carregado

### Frontend ✅
- [ ] Variáveis de ambiente configuradas
- [ ] API client configurado
- [ ] Interceptors JWT implementados
- [ ] Tratamento de erros 401/403
- [ ] Build funcionando sem erros

### Integração ✅
- [ ] Login funcionando
- [ ] Requisições autenticadas funcionando
- [ ] Rotas protegidas funcionando
- [ ] Logout funcionando
- [ ] Refresh token (se implementado)

### Docker ✅
- [ ] docker-compose.yml atualizado
- [ ] Dockerfile frontend criado
- [ ] Networks configuradas
- [ ] Volumes mapeados
- [ ] Portas expostas

---

## 🐛 Troubleshooting

### Erro: CORS Policy

**Problema:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solução:**
```python
# backend/app/core/config.py
allowed_origins: list = ["http://localhost:5173", "*"]
```

### Erro: 401 Unauthorized

**Problema:** Token não está sendo enviado

**Solução:**
```typescript
// Verificar se o token está no localStorage
console.log(localStorage.getItem('access_token'));

// Verificar headers da requisição
console.log(config.headers);
```

### Erro: Connection Refused

**Problema:** Backend não está rodando ou porta errada

**Solução:**
```bash
# Verificar se backend está rodando
curl http://localhost:8000/api/v1/docs

# Verificar variável de ambiente
echo $VITE_API_URL
```

### Erro: Module not found

**Problema:** Dependências não instaladas

**Solução:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Próximos Passos

1. **Escolha a estratégia** (recomendo Opção 1: Monorepo)
2. **Me informe a URL do repositório Lovable**
3. **Vou te ajudar a fazer a integração passo a passo**
4. **Testar a integração**
5. **Fazer commit e push**

---

## 📚 Recursos

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Git Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 💡 Dica

**Para desenvolvimento rápido, use Opção 1 (Monorepo)**. É mais simples e você tem tudo em um lugar só!

