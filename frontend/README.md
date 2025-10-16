# Frontend - Clínica Médica

Frontend da aplicação de gestão de clínica médica desenvolvido com React, TypeScript e Tailwind CSS.

## Tecnologias

- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Formulários
- **Zod** - Validação de dados
- **Lucide React** - Ícones

## Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── pages/              # Páginas da aplicação
├── services/           # Serviços da API
├── hooks/              # Custom hooks
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
├── contexts/           # Contextos React
└── config/             # Configurações
```

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure a URL da API no arquivo `src/config/env.ts`:
   ```typescript
   export const config = {
     apiUrl: 'http://localhost:8000',
   }
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Funcionalidades

- ✅ Autenticação e autorização
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de pacientes
- 🔄 Sistema de agendamento (em desenvolvimento)
- 🔄 Prontuários eletrônicos (em desenvolvimento)
- 🔄 Módulo financeiro (em desenvolvimento)
- 🔄 Configurações do sistema (em desenvolvimento)

## Credenciais de Teste

- **Admin**: admin@clinica.com / admin123
- **Médico**: dr.silva@clinica.com / medico123
- **Recepcionista**: recepcionista@clinica.com / recepcionista123
