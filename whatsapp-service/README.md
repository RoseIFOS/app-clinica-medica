# WhatsApp Reminder Service

Serviço de envio automático de lembretes de consultas via WhatsApp para a Clínica Médica.

## 🚀 Funcionalidades

- ✅ Envio automático de lembretes 24h antes da consulta
- ✅ Mensagens personalizadas com IA (OpenAI GPT)
- ✅ Agendamento automático via Cron Jobs
- ✅ Confirmação de presença via resposta do paciente
- ✅ Reenvio de lembretes que falharam
- ✅ API REST para integração
- ✅ Sessão persistente do WhatsApp

## 📋 Pré-requisitos

- Node.js 18+
- Docker (opcional)
- WhatsApp ativo em um smartphone
- PostgreSQL (fornecido pelo docker-compose)

## 🔧 Instalação

### Com Docker (Recomendado)

```bash
# Já está configurado no docker-compose.yml principal
docker-compose up whatsapp-service
```

### Manual

```bash
cd whatsapp-service
npm install
cp env.example .env
# Configure o .env
npm start
```

## ⚙️ Configuração

Crie um arquivo `.env` baseado no `env.example`:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clinica_medica
DB_USER=postgres
DB_PASSWORD=postgres123

# OpenAI (Opcional - para mensagens com IA)
OPENAI_API_KEY=sk-your-key-here

# Configurações do serviço
PORT=3001
REMINDER_CRON_SCHEDULE=0 10 * * *

# Informações da clínica
CLINICA_NOME=Minha Clínica
CLINICA_ENDERECO=Rua Exemplo, 123
CLINICA_TELEFONE=(11) 1234-5678
```

## 📱 Autenticação WhatsApp

Na primeira execução:

1. Execute o serviço
2. Um QR Code aparecerá no console
3. Escaneie o QR Code com seu WhatsApp (WhatsApp > Configurações > Aparelhos conectados)
4. Aguarde a mensagem "WhatsApp Web está pronto!"

A sessão ficará salva e não será necessário escanear novamente.

## 🔄 Como Funciona

### Fluxo Automático

1. **Cron Job** executa diariamente às 10:00 (configurável)
2. Busca consultas agendadas para as próximas 24 horas
3. Verifica se o paciente tem WhatsApp cadastrado
4. Gera mensagem personalizada (com IA ou template)
5. Envia via WhatsApp
6. Registra no banco de dados

### Mensagem Template (sem OpenAI)

```
Olá João Silva! 👋

Este é um lembrete da sua Consulta:

📅 Data: 17/10/2025 (Sexta-feira)
🕐 Horário: 14:30
👨‍⚕️ Dr(a): Dra. Maria Santos
📍 Clínica Médica Exemplo
   Rua Exemplo, 123 - Centro

Por favor, confirme sua presença respondendo SIM.

Para remarcar, ligue: (11) 1234-5678
```

### Mensagem com IA (OpenAI)

Mensagens mais personalizadas e contextualizadas baseadas no tipo de consulta e histórico do paciente.

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```

### Status do WhatsApp
```
GET /api/whatsapp/status
```

### Enviar Lembretes Manualmente
```
POST /api/lembretes/enviar
```

### Reenviar Lembrete Específico
```
POST /api/lembretes/:id/reenviar
```

## 📊 Integração com Backend

O serviço se conecta diretamente ao PostgreSQL para:
- Buscar consultas agendadas
- Obter dados de pacientes e médicos
- Registrar lembretes enviados
- Atualizar status de envio

## 🕐 Agendamento (Cron)

Por padrão, o serviço executa:

- **Envio de lembretes**: Todos os dias às 10:00
- **Verificação de status**: A cada 5 minutos

Para alterar o horário, modifique `REMINDER_CRON_SCHEDULE` no `.env`:

```env
# Formato: minuto hora * * *
REMINDER_CRON_SCHEDULE=0 10 * * *  # 10:00 AM
REMINDER_CRON_SCHEDULE=0 14 * * *  # 14:00 (2 PM)
REMINDER_CRON_SCHEDULE=0 9,15 * * * # 09:00 e 15:00
```

## 🔐 Segurança

- ✅ Sessão WhatsApp criptografada e isolada
- ✅ Dados sensíveis via variáveis de ambiente
- ✅ Conexão segura com PostgreSQL
- ✅ Rate limiting automático entre mensagens

## 🐛 Troubleshooting

### QR Code não aparece
- Verifique se o Chromium está instalado
- No Docker, já está incluído na imagem

### Mensagens não são enviadas
- Verifique se o WhatsApp está conectado: `GET /api/whatsapp/status`
- Confirme que os números de telefone estão no formato correto
- Verifique os logs: `docker-compose logs whatsapp-service`

### Sessão perdida
- Delete a pasta `sessions/` e reconecte
- No Docker: `docker-compose down -v` e inicie novamente

## 📝 Logs

```bash
# Ver logs em tempo real
docker-compose logs -f whatsapp-service

# Ver últimas 100 linhas
docker-compose logs --tail=100 whatsapp-service
```

## 🚀 Próximas Melhorias

- [ ] Suporte a múltiplos idiomas
- [ ] Templates customizáveis por tipo de consulta
- [ ] Envio de exames via WhatsApp
- [ ] Chatbot interativo para agendamento
- [ ] Métricas e dashboard de envios
- [ ] Webhook para respostas dos pacientes

## 📄 Licença

MIT

