# 📱 Guia de Configuração do WhatsApp Service

## 🎯 Visão Geral

O WhatsApp Service é responsável por enviar lembretes automáticos de consultas para os pacientes via WhatsApp.

## 🚀 Como Iniciar

### 1. Configurar Variáveis de Ambiente (Opcional)

Se quiser usar mensagens personalizadas com IA, configure sua chave da OpenAI:

```bash
cd whatsapp-service
cp env.example .env
```

Edite o `.env` e adicione sua chave OpenAI:
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**Nota**: Se não configurar OpenAI, o sistema usará mensagens template (funciona perfeitamente!).

### 2. Iniciar o Serviço

#### Opção A: Com Docker (Recomendado)

```powershell
# Iniciar todos os serviços incluindo WhatsApp
docker-compose up -d

# Ver logs do WhatsApp Service
docker-compose logs -f whatsapp-service
```

#### Opção B: Manual (Desenvolvimento)

```powershell
cd whatsapp-service
npm install
npm start
```

### 3. Conectar WhatsApp

Quando o serviço iniciar pela primeira vez:

1. **QR Code aparecerá no console/logs**
2. **Abra seu WhatsApp** no celular
3. **Vá em**: Configurações → Aparelhos conectados
4. **Clique em**: Conectar aparelho
5. **Escaneie o QR Code** que apareceu no console
6. **Aguarde** a mensagem "✅ WhatsApp Web está pronto!"

**A sessão ficará salva!** Não precisará escanear novamente.

## 📊 Verificar Status

### Via API
```powershell
# Verificar se WhatsApp está conectado
curl http://localhost:3001/api/whatsapp/status
```

### Via Logs
```powershell
docker-compose logs whatsapp-service
```

Procure por:
- ✅ `WhatsApp Web está pronto!` → Conectado
- ❌ `WhatsApp desconectado` → Precisa reconectar

## 🔄 Como Funciona

### Envio Automático

Por padrão, o sistema:
1. **Executa diariamente às 10:00 AM**
2. **Busca** consultas agendadas para as próximas 24 horas
3. **Verifica** se o paciente tem WhatsApp cadastrado
4. **Envia** lembrete personalizado
5. **Registra** no banco de dados

### Envio Manual

Você pode enviar lembretes manualmente via API:

```powershell
# Enviar lembretes agora (todas as consultas elegíveis)
curl -X POST http://localhost:3001/api/lembretes/enviar

# Ou via API do backend (com autenticação)
curl -X POST http://localhost:8000/api/v1/lembretes/enviar/123 \
  -H "Authorization: Bearer seu_token_jwt"
```

## 📱 Exemplo de Mensagem

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

## ⚙️ Configurações Avançadas

### Alterar Horário do Envio Automático

Edite `docker-compose.yml`:

```yaml
whatsapp-service:
  environment:
    # Formato: minuto hora * * *
    - REMINDER_CRON_SCHEDULE=0 10 * * *  # 10:00 AM (padrão)
    # - REMINDER_CRON_SCHEDULE=0 14 * * *  # 14:00 (2 PM)
    # - REMINDER_CRON_SCHEDULE=0 9,15 * * * # 09:00 e 15:00
```

### Personalizar Informações da Clínica

Edite `docker-compose.yml`:

```yaml
whatsapp-service:
  environment:
    - CLINICA_NOME=Minha Clínica
    - CLINICA_ENDERECO=Rua Exemplo, 123 - Centro
    - CLINICA_TELEFONE=(11) 1234-5678
```

## 🔍 Monitoramento

### Ver Lembretes Enviados

```powershell
# Via API do backend
curl http://localhost:8000/api/v1/lembretes/ \
  -H "Authorization: Bearer seu_token_jwt"
```

### Ver Status de Envio

No banco de dados, tabela `lembretes_whatsapp`:
- `status = 'enviado'` → Sucesso
- `status = 'falhou'` → Erro no envio
- `status = 'pendente'` → Aguardando envio
- `status = 'cancelado'` → Cancelado

## 🐛 Resolução de Problemas

### Problema: QR Code não aparece

**Solução**:
```powershell
# Parar e reiniciar o serviço
docker-compose restart whatsapp-service

# Ver logs
docker-compose logs -f whatsapp-service
```

### Problema: Mensagens não são enviadas

**Verificar**:
1. WhatsApp está conectado?
   ```powershell
   curl http://localhost:3001/api/whatsapp/status
   ```

2. Paciente tem WhatsApp cadastrado?
   - Verificar no banco: campo `pacientes.whatsapp`
   - Formato correto: `(11) 99999-9999`

3. Consulta está agendada?
   - Status deve ser `'agendada'`
   - Data deve estar nas próximas 24 horas

### Problema: Sessão perdida / Desconectado

**Solução**:
```powershell
# Remover volumes e reconectar
docker-compose down
docker volume rm clinica-medica-app_whatsapp_sessions
docker-compose up -d whatsapp-service

# Escanear QR Code novamente
docker-compose logs -f whatsapp-service
```

### Problema: Muitos lembretes duplicados

**Causa**: Cron executando múltiplas vezes

**Solução**: O sistema já previne duplicatas verificando se há lembrete enviado nas últimas 48h.

## 📝 API Endpoints do WhatsApp Service

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Informações do serviço |
| `/api/health` | GET | Health check |
| `/api/whatsapp/status` | GET | Status da conexão WhatsApp |
| `/api/lembretes/enviar` | POST | Enviar lembretes manualmente |
| `/api/lembretes/:id/reenviar` | POST | Reenviar lembrete específico |

## 📝 API Endpoints do Backend (FastAPI)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/v1/lembretes/` | GET | Listar lembretes |
| `/api/v1/lembretes/{id}` | GET | Obter lembrete específico |
| `/api/v1/lembretes/enviar/{consulta_id}` | POST | Enviar lembrete manual |
| `/api/v1/lembretes/{id}/reenviar` | POST | Reenviar lembrete |
| `/api/v1/lembretes/{id}` | DELETE | Cancelar lembrete |
| `/api/v1/lembretes/consulta/{consulta_id}` | GET | Lembretes de uma consulta |
| `/api/v1/lembretes/paciente/{paciente_id}` | GET | Lembretes de um paciente |

## 🎯 Testar o Sistema

### 1. Cadastrar Paciente com WhatsApp

Via API ou interface:
```json
{
  "nome": "João Silva",
  "whatsapp": "(11) 99999-9999",
  "email": "joao@email.com"
  // ... outros campos
}
```

### 2. Agendar Consulta para Amanhã

```json
{
  "paciente_id": 1,
  "medico_id": 1,
  "data_hora": "2025-10-17T14:30:00",
  "tipo": "primeira_consulta",
  "status": "agendada"
}
```

### 3. Enviar Lembrete Manualmente

```powershell
curl -X POST http://localhost:3001/api/lembretes/enviar
```

### 4. Verificar no WhatsApp

O paciente deve receber a mensagem!

## 💡 Dicas

- **Formato do Número**: O sistema adiciona automaticamente o código do Brasil (55)
- **Teste com Seu Número**: Cadastre uma consulta com seu WhatsApp para testar
- **Horário do Lembrete**: Por padrão, envia 24h antes da consulta
- **OpenAI Opcional**: Funciona perfeitamente sem IA, usando templates
- **Confirmação**: Paciente pode responder "SIM" para confirmar (funcionalidade básica implementada)

## 🔒 Segurança

- ✅ Sessão WhatsApp criptografada
- ✅ Dados sensíveis via environment variables
- ✅ Isolamento via Docker
- ✅ Rate limiting entre mensagens (2 segundos)
- ✅ Prevenção de spam (verificação de duplicatas)

## 📚 Próximos Passos

Após configurar o WhatsApp:

1. ✅ Testar envio manual
2. ✅ Cadastrar pacientes com WhatsApp
3. ✅ Agendar consultas de teste
4. ✅ Aguardar envio automático (10:00 AM)
5. ✅ Monitorar logs e status
6. 🔄 Integrar com frontend (opcional)

## 🆘 Suporte

Se tiver problemas:
1. Veja os logs: `docker-compose logs whatsapp-service`
2. Verifique a conexão: `curl http://localhost:3001/api/health`
3. Leia o README do serviço: `whatsapp-service/README.md`

