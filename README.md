# 🏥 Sistema de Clínica Médica

Sistema completo de gerenciamento de clínica médica com interface moderna e funcionalidades avançadas.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- Python 3.11+
- Docker Desktop
- Git

### Instalação e Execução

```bash
# 1. Clonar o repositório
git clone <repo-url>
cd clinica-medica-app

# 2. Iniciar o sistema
.\run.ps1 dev
```

### Acessar o Sistema

- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **API Health**: http://localhost:8000

### Credenciais de Login

**Administrador:**
- Email: `admin@clinica.com`
- Senha: `admin123`

**Médico:**
- Email: `medico@clinica.com` 
- Senha: `medico123`

**Recepcionista:**
- Email: `recepcao@clinica.com`
- Senha: `recepcao123`

## 📋 Funcionalidades

### 👥 **Pacientes**
- Cadastro completo com dados pessoais
- Histórico médico
- Busca e filtros avançados
- Gestão de convênios

### 📅 **Agenda**
- Calendário visual interativo
- Agendamento de consultas
- Gestão de horários disponíveis
- Confirmação automática

### 📄 **Prontuários**
- Editor completo de prontuários
- Geração de PDF
- Histórico de consultas
- Prescrições médicas

### 🩺 **Médicos**
- Cadastro de profissionais
- Gestão de especialidades
- Horários de atendimento
- Controle de disponibilidade

### 💰 **Financeiro**
- Controle de pagamentos
- Relatórios financeiros
- Gráficos de receita
- Gestão de inadimplência

### 💬 **Lembretes WhatsApp**
- Envio automático de lembretes
- Mensagens personalizadas
- Histórico de comunicações
- Integração com OpenAI

### 📊 **Dashboard**
- Estatísticas em tempo real
- Próximas consultas
- Alertas importantes
- Métricas de performance

## 🛠️ Tecnologias

### Backend
- **FastAPI** - Framework web moderno
- **PostgreSQL** - Banco de dados
- **SQLAlchemy** - ORM
- **Alembic** - Migrações
- **JWT** - Autenticação
- **Celery** - Tarefas assíncronas
- **Redis** - Cache e filas

### Frontend
- **React 18** - Interface moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido
- **shadcn/ui** - Componentes
- **Tailwind CSS** - Estilização
- **React Router** - Navegação
- **React Query** - Gerenciamento de estado

### Infraestrutura
- **Docker** - Containerização
- **Node.js** - Serviço WhatsApp
- **OpenAI** - IA para mensagens

## 📁 Estrutura do Projeto

```
clinica-medica-app/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/           # Rotas da API
│   │   ├── core/          # Configurações
│   │   ├── models/        # Modelos do banco
│   │   └── schemas/       # Schemas Pydantic
│   ├── alembic/          # Migrações
│   └── requirements.txt   # Dependências Python
├── frontend/              # Interface React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários
│   │   └── contexts/      # Contextos React
│   └── package.json       # Dependências Node.js
├── whatsapp-service/       # Serviço WhatsApp
├── docker-compose.yml     # Orquestração Docker
└── run.ps1               # Script de inicialização
```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
.\run.ps1 dev          # Iniciar todos os serviços
.\run.ps1 stop         # Parar todos os serviços
.\run.ps1 status       # Verificar status
.\run.ps1 logs         # Ver logs
.\run.ps1 db           # Acessar banco de dados
```

## 🚀 Deploy

O sistema está configurado para rodar localmente. Para deploy em produção, consulte a documentação específica de cada plataforma.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API em `/docs` ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para gestão médica eficiente**