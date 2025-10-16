<!-- ea10098b-7c4a-4b3a-85b1-4d7094182f61 934aa525-5351-4386-93ba-fe97c37b1fcc -->
# Planejamento - Sistema de Gerenciamento de Clínica Médica

## Visão Geral

Sistema web completo para gestão de clínica médica com funcionalidades de cadastro de pacientes, agendamento de consultas, prontuário eletrônico, controle financeiro e agente de IA para envio automático de lembretes via WhatsApp.

## Arquitetura do Sistema

### Stack Tecnológica

- **Backend**: FastAPI (Python 3.10+)
- **Frontend**: React (Vite + TypeScript)
- **Banco de Dados**: PostgreSQL
- **ORM**: SQLAlchemy
- **Autenticação**: JWT
- **WhatsApp**: whatsapp-web.js (Node.js service)
- **Agendamento de Tarefas**: Celery + Redis
- **IA/NLP**: OpenAI GPT ou modelo local para processamento de contexto

### Estrutura de Diretórios

```
clinica-medica-app/
├── backend/                 # FastAPI
│   ├── app/
│   │   ├── api/            # Rotas da API
│   │   ├── core/           # Configurações
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Lógica de negócio
│   │   └── tasks/          # Tarefas Celery
│   ├── alembic/            # Migrations
│   └── requirements.txt
├── frontend/               # React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   └── package.json
├── whatsapp-service/       # Serviço Node.js
│   ├── src/
│   │   ├── bot.js
│   │   └── scheduler.js
│   └── package.json
└── docker-compose.yml
```

## Banco de Dados - Modelo Relacional

### Tabelas Principais

**users** (Funcionários/Médicos)

- id, email, hashed_password, nome, role (admin/medico/recepcionista), crm, especialidade, created_at

**pacientes**

- id, nome, cpf, data_nascimento, telefone, whatsapp, email, endereco, cidade, estado, cep, convenio, numero_carteirinha, created_at, updated_at

**consultas**

- id, paciente_id, medico_id, data_hora, duracao, tipo (primeira_consulta/retorno/exame), status (agendada/confirmada/realizada/cancelada), observacoes, created_at

**prontuarios**

- id, paciente_id, consulta_id, medico_id, data, anamnese, diagnostico, prescricao, exames_solicitados, observacoes, created_at

**pagamentos**

- id, paciente_id, consulta_id, valor, metodo_pagamento, status (pendente/pago/cancelado), data_vencimento, data_pagamento, created_at

**lembretes_whatsapp**

- id, paciente_id, consulta_id, mensagem, data_envio_programada, data_enviado, status (pendente/enviado/falhou/cancelado), tentativas

**horarios_disponiveis**

- id, medico_id, dia_semana, hora_inicio, hora_fim, ativo

## API Backend - Rotas FastAPI

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Pacientes

- `GET /api/pacientes` - Listar pacientes (com filtros e paginação)
- `POST /api/pacientes` - Criar novo paciente
- `GET /api/pacientes/{id}` - Detalhes do paciente
- `PUT /api/pacientes/{id}` - Atualizar paciente
- `DELETE /api/pacientes/{id}` - Desativar paciente
- `GET /api/pacientes/{id}/historico` - Histórico completo do paciente

### Consultas

- `GET /api/consultas` - Listar consultas (filtros: data, médico, status)
- `POST /api/consultas` - Agendar nova consulta
- `GET /api/consultas/{id}` - Detalhes da consulta
- `PUT /api/consultas/{id}` - Atualizar consulta
- `DELETE /api/consultas/{id}` - Cancelar consulta
- `GET /api/consultas/agenda/{medico_id}` - Agenda do médico
- `GET /api/consultas/horarios-disponiveis` - Horários disponíveis para agendamento

### Prontuários

- `GET /api/prontuarios/paciente/{paciente_id}` - Listar prontuários do paciente
- `POST /api/prontuarios` - Criar novo prontuário
- `GET /api/prontuarios/{id}` - Visualizar prontuário
- `PUT /api/prontuarios/{id}` - Atualizar prontuário
- `GET /api/prontuarios/{id}/pdf` - Gerar PDF do prontuário

### Médicos

- `GET /api/medicos` - Listar médicos
- `POST /api/medicos` - Cadastrar médico
- `GET /api/medicos/{id}` - Detalhes do médico
- `PUT /api/medicos/{id}` - Atualizar médico
- `GET /api/medicos/{id}/horarios` - Horários de atendimento
- `PUT /api/medicos/{id}/horarios` - Atualizar horários

### Financeiro

- `GET /api/pagamentos` - Listar pagamentos (filtros: status, período)
- `POST /api/pagamentos` - Registrar pagamento
- `GET /api/pagamentos/{id}` - Detalhes do pagamento
- `PUT /api/pagamentos/{id}` - Atualizar pagamento
- `GET /api/financeiro/relatorio` - Relatório financeiro (período, resumo)
- `GET /api/financeiro/inadimplencia` - Pagamentos pendentes

### Dashboard/Relatórios

- `GET /api/dashboard/estatisticas` - Estatísticas gerais
- `GET /api/relatorios/consultas` - Relatório de consultas
- `GET /api/relatorios/pacientes` - Relatório de pacientes
- `GET /api/relatorios/financeiro` - Relatório financeiro

### WhatsApp/Lembretes

- `GET /api/lembretes` - Listar lembretes
- `POST /api/lembretes/enviar/{consulta_id}` - Enviar lembrete manual
- `GET /api/lembretes/status` - Status do serviço WhatsApp
- `PUT /api/lembretes/{id}/reenviar` - Reenviar lembrete

## Frontend React - Páginas e Componentes

### Páginas Principais

1. **Login** - Autenticação
2. **Dashboard** - Visão geral (próximas consultas, estatísticas)
3. **Pacientes** - Listagem e CRUD
4. **Agenda** - Calendário de consultas
5. **Prontuários** - Visualização e edição
6. **Financeiro** - Controle de pagamentos
7. **Configurações** - Gerenciar médicos, horários, usuários

### Componentes Reutilizáveis

- FormularioPaciente, TabelaPacientes, CardPaciente
- CalendarioConsultas, FormularioConsulta
- EditorProntuario, VisualizadorProntuario
- TabelaFinanceira, GraficoFinanceiro
- Sidebar, Header, Modal

## Agente de IA - WhatsApp Service

### Funcionalidades do Agente

1. **Lembrete Automático de Consulta**: Enviar mensagem 24h antes da consulta
2. **Sugestão de Retorno**: Após consulta realizada, sugerir agendamento de retorno (se necessário)
3. **Confirmação de Presença**: Permitir confirmação via resposta simples
4. **Mensagens Personalizadas**: Incluir nome do paciente, médico, data/hora

### Fluxo de Lembretes

1. Task do Celery executa diariamente
2. Busca consultas nas próximas 24h com status "agendada"
3. Gera mensagem personalizada com IA
4. Envia via whatsapp-web.js
5. Registra na tabela lembretes_whatsapp
6. Atualiza status baseado na resposta

### Mensagem Template

```
Olá [Nome do Paciente]! 👋

Este é um lembrete da sua consulta:
📅 Data: [Data]
🕐 Horário: [Hora]
👨‍⚕️ Dr(a): [Nome do Médico]
📍 Local: [Endereço da Clínica]

Por favor, confirme sua presença respondendo SIM.

Para remarcar, entre em contato: [Telefone]
```

## Implementação por Etapas

### Fase 1: Configuração Inicial

- Estrutura de pastas
- Configuração Docker (PostgreSQL, Redis)
- Setup FastAPI com autenticação JWT
- Setup React com Vite e TypeScript
- Migrations do banco de dados

### Fase 2: CRUD Básico

- Modelos e schemas (pacientes, consultas, usuários)
- APIs de pacientes e usuários
- Telas de cadastro no frontend
- Autenticação e rotas protegidas

### Fase 3: Agendamento

- Sistema de agenda
- Horários disponíveis
- CRUD de consultas
- Calendário no frontend

### Fase 4: Prontuário Eletrônico

- Modelo de prontuário
- API de prontuários
- Editor de prontuário
- Geração de PDF

### Fase 5: Financeiro

- Modelo de pagamentos
- API financeira
- Telas de controle financeiro
- Relatórios e gráficos

### Fase 6: Integração WhatsApp

- Setup whatsapp-web.js (Node.js service)
- Configuração Celery para tarefas agendadas
- Sistema de lembretes
- Integração com IA para mensagens contextualizadas

### Fase 7: Dashboard e Relatórios

- Estatísticas gerais
- Gráficos e métricas
- Relatórios exportáveis

### Fase 8: Testes e Deploy

- Testes unitários e integração
- Documentação da API
- Deploy (Docker Compose)

## Considerações de Segurança

- HTTPS obrigatório
- Senhas com hash bcrypt
- JWT com expiração curta
- CORS configurado
- Validação de dados (Pydantic)
- LGPD: Consentimento para uso de dados e WhatsApp
- Backup automático do banco de dados
- Logs de auditoria (acesso a prontuários)

## Dependências Principais

**Backend (requirements.txt)**

```
fastapi
uvicorn
sqlalchemy
psycopg2-binary
alembic
python-jose[cryptography]
passlib[bcrypt]
python-multipart
celery
redis
pydantic
pydantic-settings
openai (ou alternativa)
```

**Frontend (package.json)**

```
react
react-router-dom
axios
@tanstack/react-query
tailwindcss
shadcn/ui
react-hook-form
zod
date-fns
recharts
```

**WhatsApp Service (package.json)**

```
whatsapp-web.js
qrcode-terminal
axios
node-cron
```

### To-dos

- [x] Configurar estrutura inicial do projeto (pastas, Docker Compose, PostgreSQL, Redis)
- [x] Implementar base do FastAPI (configuração, autenticação JWT, modelos de dados)
- [x] Configurar PostgreSQL, executar migrações e criar seed com dados iniciais
- [x] ~~Configurar React com Vite, TypeScript, Tailwind e estrutura de componentes~~ (CANCELADO - Frontend será no Lovable)
- [x] Implementar CRUD completo de pacientes (backend + API)
- [x] Implementar API de consultas (agendamento, calendário, horários disponíveis)
- [x] Implementar API de médicos e horários de atendimento
- [x] Implementar API de prontuários eletrônicos
- [x] Implementar API do módulo financeiro
- [x] Implementar API de dashboard e relatórios gerenciais
- [x] Refatorar API para compatibilidade com Lovable (CORS, schemas, validações)
- [x] Configurar serviço Node.js com whatsapp-web.js e sistema de lembretes
- [x] Implementar agente de IA para mensagens contextualizadas (OpenAI GPT)
- [x] Configurar agendamento automático com Cron Jobs (substituindo Celery)
- [x] Criar API de lembretes no FastAPI para gerenciamento completo
- [ ] Adicionar testes, documentação da API e preparar para deploy