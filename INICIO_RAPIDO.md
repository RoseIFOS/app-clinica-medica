# 🚀 Início Rápido - Clínica Médica App

## ✅ Pré-requisitos
1. **Docker Desktop** - DEVE estar rodando
2. **PowerShell** - Use SEMPRE PowerShell no Windows
3. **Ambiente Virtual** - Criado e configurado

## 🎯 Como Iniciar (3 passos)

### 1. Abra o PowerShell na pasta do projeto
```powershell
cd C:\Users\rose_\Documents\Projects\clinica-medica-app
```

### 2. Execute o script de inicialização
```powershell
.\start_api.ps1
```

Isso irá:
- Ativar o ambiente virtual Python
- Iniciar o servidor FastAPI
- Abrir em uma janela separada

### 3. Acesse a API
Aguarde cerca de 5-10 segundos e acesse:
- **Documentação Interativa**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/
- **Alternativa ReDoc**: http://localhost:8000/redoc

## 📊 Serviços Disponíveis

| Serviço | URL | Status |
|---------|-----|--------|
| FastAPI | http://localhost:8000 | ✅ Rodando |
| PostgreSQL | localhost:5432 | ✅ Rodando |
| Redis | localhost:6379 | ✅ Rodando |
| Frontend | http://localhost:3000 | ⏸️ Opcional |

## 🔑 Credenciais de Teste

### Admin
- **Email**: admin@clinica.com
- **Senha**: admin123

### Médico
- **Email**: dr.silva@clinica.com
- **Senha**: medico123

### Recepcionista
- **Email**: recep@clinica.com
- **Senha**: recepcionista123

## 🛑 Como Parar

### Opção 1: Parar apenas a API
Pressione `Ctrl+C` na janela onde a API está rodando

### Opção 2: Parar todos os serviços
```powershell
.\run.ps1 stop
```

## 🔍 Verificar Status

```powershell
# Ver status de todos os serviços
.\run.ps1 status

# Ver logs do Docker
.\run.ps1 logs

# Acessar banco de dados PostgreSQL
.\run.ps1 db
```

## 🐛 Resolução de Problemas

### A API não inicia
1. Verifique se o Docker Desktop está rodando
2. Verifique se o ambiente virtual está ativo:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. Tente iniciar manualmente:
   ```powershell
   cd backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Erro: "Impossível conectar-se ao servidor remoto"
- Aguarde mais tempo (a API pode levar 10-15 segundos para iniciar)
- Verifique se a porta 8000 não está sendo usada:
  ```powershell
  netstat -ano | findstr :8000
  ```

### Erro: "Docker não está rodando"
- Abra o Docker Desktop
- Aguarde até que o ícone fique verde
- Execute novamente o script

### Erro de importação (ImportError)
- Certifique-se de que está no ambiente virtual
- Reinstale as dependências:
  ```powershell
  cd backend
  pip install -r requirements.txt
  ```

## 📚 Próximos Passos

1. ✅ API funcionando - **CONCLUÍDO**
2. 🎯 Testar os endpoints na documentação: http://localhost:8000/docs
3. 🔄 Fazer login com as credenciais de teste
4. 🔄 Cadastrar um paciente
5. 🔄 Agendar uma consulta
6. 🔄 Visualizar no dashboard

## 📖 Documentação Completa

- **README.md** - Documentação completa do projeto
- **CORRECOES.md** - Histórico de correções e problemas resolvidos
- **clinica-me.plan.md** - Planejamento detalhado do projeto

## 💡 Dicas

- Mantenha a janela do PowerShell com a API aberta
- Use `Ctrl+C` para parar a API quando necessário
- Sempre use `.\run.ps1 stop` para parar todos os serviços de forma limpa
- Os dados do banco são persistentes (mesmo após parar o Docker)

## 🆘 Suporte

Se continuar com problemas:
1. Leia o arquivo **CORRECOES.md**
2. Verifique os logs da API na janela do PowerShell
3. Execute `.\run.ps1 status` para ver o status dos serviços

