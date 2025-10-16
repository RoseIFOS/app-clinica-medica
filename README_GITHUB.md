# 🏥 Clínica Médica App

Sistema completo de gestão para clínica médica com funcionalidades de cadastro de pacientes, agendamento de consultas, prontuário eletrônico, controle financeiro e **agente de IA para envio automático de lembretes via WhatsApp**.

## ✨ Funcionalidades

- ✅ **Autenticação JWT** - Sistema de login com diferentes perfis (Admin, Médico, Recepcionista)
- ✅ **Dashboard** - Visão geral com estatísticas e métricas da clínica
- ✅ **Gestão de Pacientes** - CRUD completo com busca, histórico e paginação
- ✅ **Sistema de Agendamento** - Calendário de consultas, horários disponíveis, agenda médica
- ✅ **Prontuário Eletrônico** - CRUD completo, visualização HTML e templates pré-definidos
- ✅ **Módulo Financeiro** - Controle de pagamentos, relatórios e gráficos
- ✅ **WhatsApp Bot** - Lembretes automáticos via WhatsApp com IA (OpenAI GPT)
- ✅ **API REST Completa** - Documentação interativa com Swagger/ReDoc

## 🚀 Tecnologias

### Backend
- **FastAPI** - Framework web moderno e rápido
- **PostgreSQL** - Banco de dados relacional
- **SQLAlchemy** - ORM para Python
- **Alembic** - Migrações de banco de dados
- **JWT** - Autenticação e autorização
- **Docker** - Containerização

### WhatsApp Service
- **Node.js** - Runtime JavaScript
- **whatsapp-web.js** - Integração com WhatsApp
- **OpenAI GPT** - IA para mensagens contextualizadas
- **Cron Jobs** - Agendamento automático de lembretes

## 📋 Pré-requisitos

- Docker Desktop
- Python 3.10+
- Node.js 18+ (para desenvolvimento do WhatsApp Service)

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/clinica-medica-app.git
cd clinica-medica-app
```

### 2. Configure as variáveis de ambiente
```bash
cp env.example .env
# Edite o .env com suas configurações
```

### 3. Inicie os serviços com Docker
```bash
docker-compose up -d
```

### 4. Execute as migrações do banco
```bash
docker-compose exec backend alembic upgrade head
```

### 5. (Opcional) Popule o banco com dados de teste
```bash
docker-compose exec backend python seed_data.py
```

## 🌐 Acesso

- **API Backend**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **WhatsApp Service**: http://localhost:3001

## 🔑 Credenciais de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@clinica.com | admin123 |
| Médico | dr.silva@clinica.com | medico123 |
| Recepcionista | recep@clinica.com | recepcionista123 |

## 📱 Configuração do WhatsApp

1. Certifique-se de que o serviço está rodando:
```bash
docker-compose logs -f whatsapp-service
```

2. Escaneie o QR Code que aparece nos logs com seu WhatsApp

3. A sessão ficará salva - não precisará escanear novamente!

Para mais detalhes, consulte: [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md)

## 📊 Estrutura do Projeto

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
├── whatsapp-service/       # Serviço Node.js
│   ├── src/
│   │   ├── config/         # Configurações WhatsApp
│   │   ├── services/       # Lógica de lembretes
│   │   ├── routes/         # API REST
│   │   └── scheduler/      # Cron Jobs
│   └── package.json
├── frontend/               # React (opcional)
└── docker-compose.yml
```

## 📚 Documentação

- [README.md](README.md) - Documentação completa
- [FRONTEND_LOVABLE.md](FRONTEND_LOVABLE.md) - Guia para criar frontend
- [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) - Setup do WhatsApp
- [WHATSAPP_IMPLEMENTADO.md](WHATSAPP_IMPLEMENTADO.md) - Detalhes técnicos
- [CORRECOES.md](CORRECOES.md) - Histórico de correções

## 🔌 Endpoints Principais

### Autenticação
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Usuário atual

### Pacientes
- `GET /api/v1/pacientes/` - Listar
- `POST /api/v1/pacientes/` - Criar
- `GET /api/v1/pacientes/{id}` - Obter
- `PUT /api/v1/pacientes/{id}` - Atualizar
- `DELETE /api/v1/pacientes/{id}` - Deletar

### Consultas
- `GET /api/v1/consultas/` - Listar
- `POST /api/v1/consultas/` - Agendar
- `GET /api/v1/consultas/horarios-disponiveis` - Horários disponíveis

### Prontuários
- `GET /api/v1/prontuarios/` - Listar
- `POST /api/v1/prontuarios/` - Criar
- `GET /api/v1/prontuarios/{id}/html` - Visualizar HTML

### Financeiro
- `GET /api/v1/financeiro/pagamentos` - Listar
- `POST /api/v1/financeiro/pagamentos` - Registrar
- `GET /api/v1/financeiro/relatorio` - Relatório

### Lembretes
- `GET /api/v1/lembretes/` - Listar
- `POST /api/v1/lembretes/enviar/{consulta_id}` - Enviar manual

### Dashboard
- `GET /api/v1/dashboard/estatisticas` - Estatísticas gerais

## 🐳 Comandos Docker Úteis

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f whatsapp-service

# Parar todos os serviços
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build

# Acessar o banco de dados
docker-compose exec postgres psql -U postgres -d clinica_medica
```

## 🧪 Testes

```bash
# Executar testes do backend
docker-compose exec backend pytest

# Verificar cobertura
docker-compose exec backend pytest --cov=app
```

## 🔒 Segurança

- ✅ Autenticação JWT com tokens expiráveis
- ✅ Senhas com hash bcrypt
- ✅ CORS configurado
- ✅ Validação de dados com Pydantic
- ✅ Isolamento via Docker
- ✅ Criptografia E2E do WhatsApp

## 📈 Próximos Passos

- [ ] Testes automatizados completos
- [ ] CI/CD com GitHub Actions
- [ ] Deploy em produção
- [ ] Frontend completo (em desenvolvimento no Lovable)
- [ ] Chatbot interativo para agendamento via WhatsApp
- [ ] Envio de exames/comprovantes via WhatsApp
- [ ] Dashboard de analytics avançado

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)

## ⭐ Mostre seu apoio

Dê uma ⭐️ se este projeto te ajudou!

---

**Desenvolvido com ❤️ para facilitar a gestão de clínicas médicas**

