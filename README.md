# Clínica Médica App

Sistema completo de gestão para clínica médica com funcionalidades de cadastro de pacientes, agendamento de consultas, prontuário eletrônico, controle financeiro e agente de IA para envio automático de lembretes via WhatsApp.

## 🚀 Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migrações de banco de dados
- **JWT** - Autenticação e autorização
- **Celery + Redis** - Tarefas assíncronas
- **Docker** - Containerização

### Frontend
- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado do servidor

### WhatsApp Service
- **Node.js** - Runtime JavaScript
- **whatsapp-web.js** - Integração com WhatsApp
- **OpenAI** - IA para mensagens contextualizadas

## 📋 Funcionalidades

- ✅ **Autenticação e Autorização** - Sistema de login com diferentes perfis (Admin, Médico, Recepcionista)
- ✅ **Dashboard** - Visão geral com estatísticas da clínica
- ✅ **Cadastro de Pacientes** - CRUD completo com busca e histórico
- ✅ **Sistema de Agendamento** - Calendário de consultas, horários disponíveis, agenda médica
- ✅ **Prontuário Eletrônico** - CRUD completo, visualização e templates
- ✅ **Módulo Financeiro** - Controle de pagamentos, relatórios e gráficos
- ✅ **WhatsApp Bot** - Lembretes automáticos via WhatsApp com IA (OpenAI GPT)
- ✅ **API Completa** - Documentação interativa com Swagger/ReDoc
- ✅ **Relatórios e Métricas** - Estatísticas gerenciais completas

## 🛠️ Instalação e Execução

### Pré-requisitos
- Docker Desktop (OBRIGATÓRIO - deve estar rodando)
- Python 3.10+
- Node.js 18+ (opcional, para desenvolvimento do frontend)

### ⚠️ IMPORTANTE - Windows
**No Windows, sempre use PowerShell (não CMD ou Git Bash). Execute o `run.ps1`, NÃO o `run.sh`**

### Instalação Automática
```powershell
# Windows PowerShell - Execute como Administrador (recomendado)
.\install.ps1

# Ou pular instalação do Node.js
.\install.ps1 -SkipNode
```

### Instalação Manual

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd clinica-medica-app
   ```

2. **Configure o ambiente Python**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale dependências Python**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Inicie os serviços Docker**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Execute migrações**
   ```bash
   cd backend
   alembic upgrade head
   ```

6. **Instale dependências Node.js** (opcional)
   ```bash
   cd frontend
   npm install
   ```

### Execução

```powershell
# Iniciar todos os serviços
.\run.ps1 dev

# Ver status dos serviços
.\run.ps1 status

# Acessar banco de dados
.\run.ps1 db

# Parar todos os serviços
.\run.ps1 stop
```

## 🌐 URLs da Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs
- **Banco de Dados**: localhost:5432

## 🔑 Credenciais de Teste

- **Admin**: admin@clinica.com / admin123
- **Médico**: dr.silva@clinica.com / medico123
- **Recepcionista**: recepcionista@clinica.com / recepcionista123

## 📊 Dados de Teste

O sistema vem com dados de exemplo incluindo:
- 5 pacientes cadastrados
- 3 médicos com especialidades diferentes
- 5 consultas agendadas
- 2 prontuários de exemplo
- 3 pagamentos (2 pagos, 1 pendente)
- 15 horários disponíveis
- 2 lembretes WhatsApp programados

## 🏗️ Estrutura do Projeto

```
clinica-medica-app/
├── backend/                 # FastAPI
│   ├── app/
│   │   ├── api/            # Rotas da API
│   │   ├── core/           # Configurações
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Lógica de negócio
│   ├── alembic/            # Migrations
│   └── requirements.txt
├── frontend/               # React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços da API
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── whatsapp-service/       # Serviço Node.js
├── docker-compose.yml      # Orquestração de serviços
├── run.ps1                 # Script de execução
└── install.ps1             # Script de instalação
```

## 🔧 Desenvolvimento

### Backend
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

### Banco de Dados
```bash
# Acessar PostgreSQL
docker exec -it clinica-medica-app-postgres-1 psql -U postgres -d clinica_medica

# Executar migrações
cd backend
alembic upgrade head

# Criar nova migração
alembic revision --autogenerate -m "Descrição da mudança"
```

## 📝 Próximos Passos

1. **CRUD de Pacientes** - Implementar funcionalidades completas
2. **Sistema de Agendamento** - Calendário interativo
3. **Prontuário Eletrônico** - Editor rico e geração de PDF
4. **Módulo Financeiro** - Controle de pagamentos e relatórios
5. **WhatsApp Bot** - Integração com WhatsApp para lembretes
6. **Dashboard Avançado** - Gráficos e métricas detalhadas
7. **Testes** - Cobertura de testes unitários e integração
8. **Deploy** - Configuração para produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
