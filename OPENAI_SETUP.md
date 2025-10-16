# 🤖 Como Configurar OpenAI GPT (Opcional)

## 📌 Importante

A integração com OpenAI é **OPCIONAL**. O sistema funciona perfeitamente sem ela, usando mensagens template profissionais.

## ✅ Quando Usar OpenAI?

Use OpenAI se você quer:
- Mensagens mais personalizadas e variadas
- Tom de comunicação adaptável ao contexto
- Mensagens que parecem "humanas"

## 🚫 Quando NÃO Usar?

Não use OpenAI se:
- Quer economizar custos (cada mensagem gera custo na API)
- Prefere mensagens padronizadas
- Não quer depender de serviços externos

---

## 🔧 Como Configurar (Se Quiser Usar)

### 1. Obter Chave da API OpenAI

1. Acesse: https://platform.openai.com/
2. Crie uma conta ou faça login
3. Vá em **API Keys** → **Create new secret key**
4. Copie a chave (formato: `sk-proj-...` ou `sk-...`)

**Custo aproximado:**
- GPT-3.5-turbo: ~$0.002 por mensagem
- 1000 mensagens = ~$2 USD

### 2. Configurar no Projeto

#### Opção A: Usando Docker Compose (Recomendado)

Edite `docker-compose.yml`:

```yaml
whatsapp-service:
  # ... outras configurações ...
  environment:
    # ... outras variáveis ...
    OPENAI_API_KEY: sk-proj-sua-chave-aqui  # ← Adicione sua chave
```

#### Opção B: Usando arquivo .env

Crie `whatsapp-service/.env`:

```env
# Copie do env.example
API_URL=http://backend:8000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=clinica_medica
DB_USER=postgres
DB_PASSWORD=postgres123

# Configure sua chave aqui
OPENAI_API_KEY=sk-proj-sua-chave-real-aqui

PORT=3001
REMINDER_CRON_SCHEDULE=0 10 * * *
CLINICA_NOME=Clínica Médica Exemplo
CLINICA_ENDERECO=Rua Exemplo, 123 - Centro
CLINICA_TELEFONE=(11) 1234-5678
```

### 3. Reiniciar o Serviço

```bash
# Parar os serviços
docker-compose down

# Reiniciar
docker-compose up -d whatsapp-service

# Verificar logs
docker-compose logs -f whatsapp-service
```

Você verá:
- **Com chave válida**: `✅ OpenAI configurado`
- **Sem chave**: `⚠️  OpenAI não configurado (usando mensagens template)`

---

## 📊 Comparação: Template vs OpenAI

### Mensagem Template (Padrão - Sem Custo)

```
Olá João Silva! 👋

Este é um lembrete da sua Consulta de Retorno:

📅 Data: 20/10/2025 (Sexta-feira)
🕐 Horário: 14:30
👨‍⚕️ Dr(a): Dra. Maria Santos
📍 Clínica Médica Exemplo
   Rua Exemplo, 123 - Centro

Por favor, confirme sua presença respondendo *SIM*.

Para remarcar, ligue: (11) 1234-5678
```

### Mensagem OpenAI GPT (Personalizada - Com Custo)

```
Olá João! 😊

Lembrando que você tem retorno com a Dra. Maria Santos 
amanhã, sexta-feira 20/10 às 14h30 na Clínica Médica 
Exemplo (Rua Exemplo, 123).

Pode confirmar sua presença? Responda SIM. 

Qualquer imprevisto: (11) 1234-5678
```

---

## 🔒 Segurança

### ⚠️ NUNCA faça:
- Commit da chave no Git (já está no `.gitignore`)
- Compartilhe a chave publicamente
- Use a mesma chave em múltiplos projetos

### ✅ Boas Práticas:
- Use variáveis de ambiente
- Rotacione a chave periodicamente
- Configure limites de uso no OpenAI Dashboard
- Monitore os custos regularmente

---

## 📈 Monitoramento de Custos

1. Acesse: https://platform.openai.com/usage
2. Veja o consumo em tempo real
3. Configure alertas de limite de gastos

---

## 🎯 Resumo

| Recurso | Template | OpenAI GPT |
|---------|----------|------------|
| **Custo** | Grátis | ~$0.002/msg |
| **Qualidade** | Profissional | Personalizada |
| **Confiabilidade** | 100% | ~99% (depende da API) |
| **Velocidade** | Instantâneo | ~1-2 segundos |
| **Configuração** | Nenhuma | Chave da API |

**Recomendação:** Comece sem OpenAI e adicione depois se sentir necessidade.

---

## 🐛 Troubleshooting

### Erro: "OpenAI não configurado"
- **Causa:** Chave não foi definida ou está inválida
- **Solução:** Sistema usa template automaticamente (não é erro!)

### Erro: "Invalid API key"
- **Causa:** Chave incorreta ou expirada
- **Solução:** Gere nova chave no OpenAI Dashboard

### Erro: "Rate limit exceeded"
- **Causa:** Muitas requisições em pouco tempo
- **Solução:** Sistema faz fallback para template automaticamente

---

## 📚 Mais Informações

- Documentação OpenAI: https://platform.openai.com/docs
- Preços: https://openai.com/pricing
- Suporte: https://help.openai.com/

