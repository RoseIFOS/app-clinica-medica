# 🎨 Guia para Criar o Frontend no Lovable

## 📋 Visão Geral

Este documento contém todas as informações necessárias para criar o frontend da **Clínica Médica App** usando o **Lovable** (ou qualquer ferramenta de IA para frontend).

---

## 🎯 Objetivo do Projeto

Criar uma aplicação web moderna para gestão de clínica médica com as seguintes funcionalidades:

- ✅ Sistema de login (Admin, Médico, Recepcionista)
- ✅ Dashboard com estatísticas
- ✅ Cadastro e gestão de pacientes
- ✅ Agendamento de consultas
- ✅ Prontuários eletrônicos
- ✅ Controle financeiro
- ✅ Gestão de lembretes WhatsApp

---

## 🔗 API Backend

### Base URL
```
http://localhost:8000
```

### Documentação Interativa
```
http://localhost:8000/docs
```

---

## 🔐 Autenticação

### Endpoint de Login
```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@clinica.com&password=admin123
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Credenciais de Teste

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin | admin@clinica.com | admin123 |
| Médico | dr.silva@clinica.com | medico123 |
| Recepcionista | recep@clinica.com | recepcionista123 |

### Uso do Token

Todas as requisições autenticadas devem incluir:
```http
Authorization: Bearer {access_token}
```

---

## 📱 Páginas e Rotas

### 1. **Login** (`/login`)
- Formulário de login (email + senha)
- Validação de credenciais
- Redirecionamento após login

### 2. **Dashboard** (`/`)
- Estatísticas gerais
- Gráficos de consultas
- Métricas financeiras
- Próximas consultas do dia

### 3. **Pacientes** (`/pacientes`)
- Listagem com paginação
- Busca por nome, CPF, telefone
- Formulário de cadastro/edição
- Visualizar histórico do paciente

### 4. **Agenda** (`/agenda`)
- Calendário de consultas
- Filtro por médico
- Agendar nova consulta
- Visualizar/editar consultas

### 5. **Prontuários** (`/prontuarios`)
- Listagem por paciente
- Editor de prontuário
- Visualização em HTML
- Templates pré-definidos

### 6. **Financeiro** (`/financeiro`)
- Listagem de pagamentos
- Filtros por status e período
- Registrar pagamento
- Relatórios e gráficos

### 7. **Lembretes** (`/lembretes`)
- Status do WhatsApp
- Histórico de lembretes enviados
- Enviar lembrete manual
- Reenviar lembretes falhados

### 8. **Configurações** (`/configuracoes`)
- Gerenciar médicos
- Configurar horários de atendimento
- Gerenciar usuários

---

## 🔌 Endpoints da API

### Autenticação

```http
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Pacientes

```http
GET    /api/v1/pacientes/              # Listar (paginado)
POST   /api/v1/pacientes/              # Criar
GET    /api/v1/pacientes/{id}          # Obter
PUT    /api/v1/pacientes/{id}          # Atualizar
DELETE /api/v1/pacientes/{id}          # Deletar
GET    /api/v1/pacientes/search?q=     # Buscar
GET    /api/v1/pacientes/{id}/historico # Histórico
```

**Exemplo de Paciente:**
```json
{
  "nome": "Maria da Silva",
  "cpf": "123.456.789-00",
  "data_nascimento": "1990-01-15",
  "telefone": "(11) 99999-9999",
  "whatsapp": "5511999999999",
  "email": "maria@email.com",
  "endereco": "Rua Exemplo, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "convenio": "Particular",
  "numero_carteirinha": null
}
```

### Consultas

```http
GET    /api/v1/consultas/                      # Listar
POST   /api/v1/consultas/                      # Agendar
GET    /api/v1/consultas/{id}                  # Obter
PUT    /api/v1/consultas/{id}                  # Atualizar
DELETE /api/v1/consultas/{id}                  # Cancelar
GET    /api/v1/consultas/horarios-disponiveis  # Horários disponíveis
GET    /api/v1/consultas/agenda/{medico_id}    # Agenda do médico
```

**Exemplo de Consulta:**
```json
{
  "paciente_id": 1,
  "medico_id": 2,
  "data_hora": "2025-10-20T14:30:00",
  "duracao": 30,
  "tipo": "primeira_consulta",
  "status": "agendada",
  "observacoes": "Paciente relata dor de cabeça"
}
```

**Tipos de Consulta:**
- `primeira_consulta`
- `retorno`
- `exame`
- `avaliacao`

**Status de Consulta:**
- `agendada`
- `confirmada`
- `realizada`
- `cancelada`
- `faltou`

### Médicos

```http
GET  /api/v1/medicos/              # Listar
POST /api/v1/medicos/              # Criar
GET  /api/v1/medicos/{id}          # Obter
PUT  /api/v1/medicos/{id}          # Atualizar
GET  /api/v1/medicos/{id}/horarios # Horários
```

**Exemplo de Médico:**
```json
{
  "nome": "Dr. João Silva",
  "email": "dr.silva@clinica.com",
  "crm": "123456",
  "especialidade": "Clínico Geral",
  "role": "medico"
}
```

### Prontuários

```http
GET    /api/v1/prontuarios/                    # Listar
POST   /api/v1/prontuarios/                    # Criar
GET    /api/v1/prontuarios/{id}                # Obter
PUT    /api/v1/prontuarios/{id}                # Atualizar
DELETE /api/v1/prontuarios/{id}                # Deletar
GET    /api/v1/prontuarios/{id}/html           # Visualizar HTML
GET    /api/v1/prontuarios/paciente/{id}       # Por paciente
GET    /api/v1/prontuarios/templates           # Templates
```

**Exemplo de Prontuário:**
```json
{
  "paciente_id": 1,
  "consulta_id": 1,
  "medico_id": 2,
  "anamnese": "Paciente relata dor de cabeça há 3 dias...",
  "diagnostico": "Cefaleia tensional",
  "prescricao": "Dipirona 500mg - 1 comprimido a cada 6h",
  "exames_solicitados": "Hemograma completo",
  "observacoes": "Retorno em 15 dias"
}
```

### Financeiro

```http
GET    /api/v1/financeiro/pagamentos           # Listar pagamentos
POST   /api/v1/financeiro/pagamentos           # Registrar
PUT    /api/v1/financeiro/pagamentos/{id}      # Atualizar
DELETE /api/v1/financeiro/pagamentos/{id}      # Deletar
POST   /api/v1/financeiro/pagamentos/{id}/pagar # Marcar pago
GET    /api/v1/financeiro/relatorio            # Relatório
GET    /api/v1/financeiro/graficos             # Gráficos
```

**Exemplo de Pagamento:**
```json
{
  "paciente_id": 1,
  "consulta_id": 1,
  "valor": 150.00,
  "metodo_pagamento": "dinheiro",
  "status": "pago",
  "data_vencimento": "2025-10-20",
  "data_pagamento": "2025-10-20",
  "descricao": "Consulta particular"
}
```

**Métodos de Pagamento:**
- `dinheiro`
- `cartao_credito`
- `cartao_debito`
- `pix`
- `convenio`

**Status de Pagamento:**
- `pendente`
- `pago`
- `cancelado`
- `atrasado`

### Dashboard

```http
GET /api/v1/dashboard/estatisticas  # Estatísticas gerais
GET /api/v1/dashboard/metricas       # Métricas rápidas
```

**Resposta de Estatísticas:**
```json
{
  "total_pacientes": 150,
  "consultas_hoje": 12,
  "consultas_mes": 340,
  "receita_mes": 51000.00,
  "pacientes_novos_mes": 15,
  "taxa_comparecimento": 92.5,
  "consultas_por_tipo": {
    "primeira_consulta": 45,
    "retorno": 280,
    "exame": 15
  },
  "receita_por_mes": [
    {"mes": "Jan", "valor": 45000},
    {"mes": "Fev", "valor": 48000},
    // ...
  ]
}
```

### Lembretes WhatsApp

```http
GET    /api/v1/lembretes/                        # Listar
GET    /api/v1/lembretes/{id}                    # Obter
POST   /api/v1/lembretes/enviar/{consulta_id}    # Enviar manual
POST   /api/v1/lembretes/{id}/reenviar           # Reenviar
DELETE /api/v1/lembretes/{id}                    # Cancelar
GET    /api/v1/lembretes/consulta/{consulta_id}  # Por consulta
GET    /api/v1/lembretes/paciente/{paciente_id}  # Por paciente
```

**Status do Lembrete:**
- `pendente`
- `enviado`
- `falhou`
- `cancelado`

---

## 🎨 Design System

### Cores Principais

```css
/* Cores da Marca */
--primary: #10B981;      /* Verde principal */
--primary-dark: #059669; /* Verde escuro */
--primary-light: #D1FAE5;/* Verde claro */

/* Cores de Sistema */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;

/* Neutros */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;

/* WhatsApp */
--whatsapp: #25D366;
```

### Tipografia

```css
/* Fontes */
font-family: 'Inter', system-ui, sans-serif;

/* Tamanhos */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
```

### Componentes Sugeridos

1. **Sidebar** - Navegação lateral fixa
2. **Header** - Cabeçalho com nome do usuário e logout
3. **Cards** - Para exibir estatísticas e informações
4. **Tables** - Tabelas responsivas com paginação
5. **Forms** - Formulários validados
6. **Modal** - Para ações de confirmação
7. **Toast** - Notificações de sucesso/erro
8. **Calendar** - Para visualização de agenda
9. **Charts** - Gráficos (Line, Bar, Pie)
10. **Badges** - Para status (agendada, confirmada, etc)

---

## 📱 Layout e Estrutura

### Layout Principal

```
┌─────────────────────────────────────────────┐
│ Sidebar │ Header                            │
│         ├────────────────────────────────────┤
│ Home    │                                   │
│ Pacie...│                                   │
│ Agenda  │     CONTEÚDO DA PÁGINA            │
│ Prontu..│                                   │
│ Financ..│                                   │
│ Lembr...│                                   │
│ Config..│                                   │
│         │                                   │
│ Logout  │                                   │
└─────────────────────────────────────────────┘
```

### Sidebar - Itens de Menu

```javascript
[
  { icon: "Home", label: "Dashboard", path: "/" },
  { icon: "Users", label: "Pacientes", path: "/pacientes" },
  { icon: "Calendar", label: "Agenda", path: "/agenda" },
  { icon: "FileText", label: "Prontuários", path: "/prontuarios" },
  { icon: "DollarSign", label: "Financeiro", path: "/financeiro" },
  { icon: "MessageCircle", label: "Lembretes", path: "/lembretes" },
  { icon: "Settings", label: "Configurações", path: "/configuracoes" }
]
```

---

## 🔧 Funcionalidades Específicas

### Dashboard

**Widgets a exibir:**
- Total de pacientes cadastrados
- Consultas hoje
- Consultas do mês
- Receita do mês
- Taxa de comparecimento
- Gráfico de consultas (últimos 6 meses)
- Gráfico de receita (últimos 6 meses)
- Próximas consultas do dia (lista)
- Pacientes novos (últimos 7 dias)

### Pacientes

**Funcionalidades:**
- Listagem com paginação (10, 25, 50 por página)
- Busca em tempo real (nome, CPF, telefone)
- Botão "Novo Paciente"
- Ações: Visualizar, Editar, Deletar
- Visualizar histórico (consultas, prontuários, pagamentos)
- Export para Excel/CSV

**Validações:**
- CPF válido (formato e dígitos verificadores)
- Email válido
- Telefone no formato (XX) XXXXX-XXXX
- WhatsApp no formato internacional (5511999999999)
- Data de nascimento (não pode ser futura)

### Agenda

**Funcionalidades:**
- Visualização em calendário (mensal/semanal/diária)
- Filtro por médico
- Agendar nova consulta (modal)
- Arrastar e soltar para reagendar
- Cores por tipo de consulta
- Legenda de status
- Sincronização em tempo real

**Formulário de Agendamento:**
- Selecionar paciente (autocomplete)
- Selecionar médico
- Selecionar data/hora (verificar disponibilidade)
- Tipo de consulta
- Duração (padrão 30min)
- Observações

### Prontuários

**Editor de Prontuário:**
- Campo de texto rico (formatação)
- Seções: Anamnese, Diagnóstico, Prescrição, Exames, Observações
- Salvar automaticamente (auto-save)
- Visualizar em HTML
- Imprimir/PDF (futuro)
- Templates pré-definidos

### Financeiro

**Funcionalidades:**
- Dashboard financeiro (receitas, pendências)
- Listagem de pagamentos
- Filtros: período, status, método
- Registrar novo pagamento
- Marcar como pago
- Gráficos: receita mensal, métodos de pagamento
- Relatório de inadimplência

### Lembretes

**Funcionalidades:**
- Status do WhatsApp (conectado/desconectado)
- Histórico de lembretes enviados
- Filtro por status (enviado, falhou, pendente)
- Botão "Enviar Lembretes Agora"
- Reenviar lembretes falhados
- Visualizar mensagem enviada

---

## 🔒 Controle de Acesso

### Permissões por Perfil

| Funcionalidade | Admin | Médico | Recepcionista |
|----------------|-------|--------|---------------|
| Dashboard | ✅ | ✅ | ✅ |
| Pacientes (Listar) | ✅ | ✅ | ✅ |
| Pacientes (Criar/Editar) | ✅ | ❌ | ✅ |
| Pacientes (Deletar) | ✅ | ❌ | ❌ |
| Agenda (Visualizar) | ✅ | ✅ | ✅ |
| Agenda (Agendar) | ✅ | ✅ | ✅ |
| Prontuários (Visualizar) | ✅ | ✅ | ❌ |
| Prontuários (Editar) | ✅ | ✅ | ❌ |
| Financeiro | ✅ | ❌ | ✅ |
| Lembretes | ✅ | ❌ | ✅ |
| Configurações | ✅ | ❌ | ❌ |

---

## 📦 Dependências Sugeridas

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0",
    "react-hot-toast": "^2.4.1",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 🚀 Início Rápido

### Passo 1: Configurar Axios

```javascript
// src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Passo 2: Context de Autenticação

```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadUser() {
    try {
      const { data } = await api.get('/api/v1/auth/me');
      setUser(data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const { data } = await api.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    localStorage.setItem('token', data.access_token);
    await loadUser();
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Passo 3: Exemplo de Hook para Pacientes

```javascript
// src/hooks/usePacientes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export function usePacientes(page = 0, limit = 10, search = '') {
  return useQuery({
    queryKey: ['pacientes', page, limit, search],
    queryFn: async () => {
      const { data } = await api.get('/api/v1/pacientes/', {
        params: { skip: page * limit, limit, q: search }
      });
      return data;
    }
  });
}

export function useCreatePaciente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paciente) => api.post('/api/v1/pacientes/', paciente),
    onSuccess: () => {
      queryClient.invalidateQueries(['pacientes']);
    }
  });
}
```

---

## 📝 Prompt Sugerido para o Lovable

```
Crie uma aplicação web moderna de gestão de clínica médica usando React, TypeScript e Tailwind CSS.

BACKEND API:
- Base URL: http://localhost:8000
- Documentação: http://localhost:8000/docs
- Autenticação: JWT via Bearer token

PÁGINAS NECESSÁRIAS:
1. Login - autenticação com email/senha
2. Dashboard - estatísticas e gráficos
3. Pacientes - CRUD completo com busca e paginação
4. Agenda - calendário de consultas
5. Prontuários - editor de prontuários médicos
6. Financeiro - controle de pagamentos
7. Lembretes - gestão de lembretes WhatsApp

DESIGN:
- Layout com sidebar fixa à esquerda
- Cores: verde (#10B981) como principal
- Componentes modernos e responsivos
- Tailwind CSS para estilização

FUNCIONALIDADES:
- Autenticação JWT
- Paginação em tabelas
- Busca em tempo real
- Validação de formulários (Zod + React Hook Form)
- Notificações toast
- Gráficos (Recharts)
- Controle de acesso por perfil

Comece pela página de login e estrutura base da aplicação.
```

---

## 🎯 Checklist de Implementação

### Fase 1: Estrutura Base
- [ ] Configurar projeto React + TypeScript + Tailwind
- [ ] Configurar React Router
- [ ] Criar layout com Sidebar + Header
- [ ] Implementar Context de Autenticação
- [ ] Criar página de Login

### Fase 2: Pacientes
- [ ] Listagem de pacientes com paginação
- [ ] Busca em tempo real
- [ ] Formulário de cadastro/edição
- [ ] Visualização de detalhes
- [ ] Histórico do paciente

### Fase 3: Agenda
- [ ] Calendário de consultas
- [ ] Formulário de agendamento
- [ ] Filtro por médico
- [ ] Visualização por dia/semana/mês

### Fase 4: Prontuários
- [ ] Listagem de prontuários
- [ ] Editor de prontuário
- [ ] Visualização HTML
- [ ] Templates

### Fase 5: Financeiro
- [ ] Dashboard financeiro
- [ ] Listagem de pagamentos
- [ ] Registrar pagamento
- [ ] Relatórios e gráficos

### Fase 6: Lembretes
- [ ] Status do WhatsApp
- [ ] Histórico de lembretes
- [ ] Enviar lembretes
- [ ] Reenviar falhados

### Fase 7: Dashboard
- [ ] Estatísticas gerais
- [ ] Gráficos de consultas
- [ ] Gráficos de receita
- [ ] Próximas consultas

---

## 📞 Suporte

Para dúvidas sobre a API:
- Documentação Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

**Boa sorte com o desenvolvimento! 🚀**

