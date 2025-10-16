# Correções Realizadas no Projeto

## Problema Identificado
O projeto estava travando ao tentar executar o `run.sh` no Windows.

## Causa Raiz
Vários problemas foram identificados e corrigidos:

### 1. **Script Bash no Windows**
- **Problema**: O usuário tentou executar `run.sh` (script Bash) no Windows
- **Solução**: Usar o script PowerShell `run.ps1` no Windows

### 2. **Função `authenticate_user` Ausente**
- **Problema**: `ImportError: cannot import name 'authenticate_user' from 'app.core.security'`
- **Arquivo**: `backend/app/core/security.py`
- **Solução**: Adicionada a função:
```python
def authenticate_user(db, email: str, password: str):
    """Autentica um usuário"""
    from app.models.user import User
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.senha):
        return False
    return user
```

### 3. **Validator no Schema Incorreto**
- **Problema**: `PydanticUserError: Decorators defined with incorrect fields: app.schemas.consulta.ConsultaListResumo`
- **Arquivo**: `backend/app/schemas/consulta.py`
- **Solução**: Removido o validator `data_hora` da classe `ConsultaListResumo` (estava na classe errada)

### 4. **Problema com Jobs em Background no PowerShell**
- **Problema**: Jobs do PowerShell não mantinham o contexto correto (caminhos, variáveis)
- **Solução**: Criado script dedicado `start_api.ps1` que é executado em uma nova janela

## Correções Aplicadas

### Arquivo: `backend/app/core/security.py`
✅ Adicionada função `authenticate_user`

### Arquivo: `backend/app/schemas/consulta.py`
✅ Removido validator incorreto da classe `ConsultaListResumo`

### Arquivo: `start_api.ps1` (NOVO)
✅ Criado script simplificado para iniciar a API em uma janela separada

### Arquivo: `run.ps1`
✅ Atualizado para usar scripts temporários com caminhos absolutos

### Arquivo: `.gitignore`
✅ Adicionados scripts temporários PowerShell

## Como Executar Agora

### Opção 1: Script PowerShell Completo (Recomendado)
```powershell
.\run.ps1 dev
```

### Opção 2: Script Simplificado (Apenas API)
```powershell
.\start_api.ps1
```

### Opção 3: Manual
```powershell
# 1. Iniciar Docker (PostgreSQL e Redis)
docker-compose up -d postgres redis

# 2. Ativar ambiente virtual
.\venv\Scripts\Activate.ps1

# 3. Iniciar FastAPI
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Verificação

### API Funcionando
✅ **URL**: http://localhost:8000/
✅ **Docs**: http://localhost:8000/docs
✅ **Status**: 200 OK

### Serviços
✅ **PostgreSQL**: Porta 5432
✅ **Redis**: Porta 6379
✅ **FastAPI**: Porta 8000

## Próximos Passos

1. ✅ API rodando e funcionando
2. ⏳ Testar todos os endpoints
3. ⏳ Configurar serviço WhatsApp (whatsapp-web.js)
4. ⏳ Implementar agente de IA
5. ⏳ Adicionar testes automatizados
6. ⏳ Preparar para deploy

## Comandos Úteis

```powershell
# Verificar status dos serviços
.\run.ps1 status

# Parar todos os serviços
.\run.ps1 stop

# Ver logs do Docker
.\run.ps1 logs

# Acessar banco de dados
.\run.ps1 db
```

## Observações

- No Windows, sempre use PowerShell (não CMD)
- Certifique-se de que o Docker Desktop está rodando
- O ambiente virtual deve estar ativo
- As janelas do PowerShell que abrem com os serviços não devem ser fechadas

