# ✅ Guia de Teste - Lovable com Mock

## 🎯 Objetivo

Testar a interface no Lovable usando dados mock (sem precisar do backend rodando).

---

## 📋 Checklist de Testes

### ✅ 1. Login

1. **Acesse o Lovable:**
   - URL: https://lovable.dev
   - Faça login na sua conta
   - Abra o projeto: **fronty-magic**

2. **Teste a Tela de Login:**
   - Você deve ver a página de login bonita
   - Veja os cards de credenciais de teste

3. **Teste Login com Credenciais:**

   **Teste Admin:**
   - Email: `admin@clinica.com`
   - Senha: `admin123`
   - Clique em "Entrar"
   - **✅ Deve:** Mostrar toast de sucesso e redirecionar para Dashboard

   **Teste Médico:**
   - Faça logout (se estiver logado)
   - Email: `dr.silva@clinica.com`
   - Senha: `medico123`
   - **✅ Deve:** Login bem-sucedido

   **Teste Recepcionista:**
   - Email: `recep@clinica.com`
   - Senha: `recepcionista123`
   - **✅ Deve:** Login bem-sucedido

4. **Teste Credenciais Erradas:**
   - Email: `teste@teste.com`
   - Senha: `senha_errada`
   - **✅ Deve:** Mostrar erro "Credenciais inválidas"

---

### ✅ 2. Dashboard

Após login, você deve ver:

- ✅ Sidebar à esquerda com menu
- ✅ Header no topo com nome do usuário
- ✅ Cards de estatísticas
- ✅ Gráficos (se implementado)
- ✅ Botão de logout funcionando

**Teste Navegação:**
- Clique em cada item do menu
- Verifique se as páginas carregam

---

### ✅ 3. Página Pacientes

1. **Acesse:** Clique em "Pacientes" no menu

2. **Verifique Elementos:**
   - ✅ Campo de busca no topo
   - ✅ **Botão "Novo Paciente" verde** (deve estar visível)
   - ✅ 3 cards de estatísticas (Total, Novos, Consultas)
   - ✅ Tabela com 3 pacientes mock

3. **Teste Busca:**
   - Digite "Maria" no campo de busca
   - **✅ Deve:** Filtrar e mostrar apenas "Maria da Silva"
   - Limpe a busca
   - Digite "123.456"
   - **✅ Deve:** Filtrar por CPF

4. **Teste Botão Novo Paciente:**
   - Clique no botão **"Novo Paciente"**
   - **✅ Deve:** Abrir um modal/dialog bonito
   - **✅ Deve:** Ver formulário com campos:
     - Nome Completo *
     - CPF *
     - Data de Nascimento
     - Telefone *
     - WhatsApp
     - Email
     - Convênio
     - Endereço
   - **✅ Deve:** Ver botões "Cancelar" e "Cadastrar Paciente"

5. **Teste Formulário - Validação:**
   - Clique em "Cadastrar Paciente" sem preencher
   - **✅ Deve:** Navegador mostrar erro nos campos obrigatórios

6. **Teste Formulário - Cadastro:**
   - Preencha os campos obrigatórios:
     - Nome: `João da Silva Teste`
     - CPF: `111.222.333-44`
     - Telefone: `(11) 99999-8888`
   - Clique em "Cadastrar Paciente"
   - **✅ Deve:** Mostrar toast verde "Paciente cadastrado com sucesso!"
   - **✅ Deve:** Modal fechar automaticamente
   - **✅ Deve:** Formulário resetar (campos vazios se abrir novamente)

7. **Teste Botão Cancelar:**
   - Clique em "Novo Paciente" novamente
   - Preencha alguns campos
   - Clique em "Cancelar"
   - **✅ Deve:** Modal fechar sem salvar

8. **Teste Botões de Ação na Tabela:**
   - Clique no ícone de olho (ver) - pode não fazer nada ainda
   - Clique no ícone de editar - pode não fazer nada ainda
   - Clique no ícone de lixeira (deletar) - pode não fazer nada ainda

---

### ✅ 4. Outras Páginas

**Teste navegação em:**

1. **Agenda** (`/agenda`)
   - ✅ Deve carregar sem erros
   - Veja se há calendário ou lista de consultas

2. **Prontuários** (`/prontuarios`)
   - ✅ Deve carregar sem erros

3. **Financeiro** (`/financeiro`)
   - ✅ Deve carregar sem erros

4. **Lembretes** (`/lembretes`)
   - ✅ Deve carregar sem erros

5. **Configurações** (`/configuracoes`)
   - ✅ Deve carregar sem erros

---

### ✅ 5. Responsividade

**Teste em diferentes tamanhos:**

1. **Desktop** (padrão do Lovable)
   - ✅ Sidebar visível
   - ✅ Layout em 2 colunas

2. **Tablet** (use o seletor de dispositivo do Lovable)
   - ✅ Layout deve se adaptar
   - ✅ Sidebar pode virar hambúrguer menu

3. **Mobile**
   - ✅ Uma coluna
   - ✅ Menu hambúrguer
   - ✅ Cards empilhados

---

### ✅ 6. Logout

1. **Teste Logout:**
   - Clique no botão de logout (geralmente no header ou sidebar)
   - **✅ Deve:** Mostrar toast "Logout realizado com sucesso!"
   - **✅ Deve:** Redirecionar para `/login`
   - **✅ Deve:** Não conseguir acessar páginas protegidas sem login

---

## 🐛 Problemas Comuns

### Botão "Novo Paciente" não abre modal

**Causa:** Sincronização pendente

**Solução:**
1. Verifique se última sincronização foi bem-sucedida
2. No Lovable, force reload: `Ctrl + Shift + R`
3. Limpe cache: DevTools → Application → Clear Storage

### Login não funciona

**Causa:** AuthContext não carregado

**Solução:**
1. Abra DevTools (F12) no Lovable
2. Veja erros no Console
3. Verifique se aparece "API auth failed, falling back to mock auth"
4. Se sim, está funcionando corretamente!

### Página em branco

**Causa:** Erro de JavaScript

**Solução:**
1. Abra Console (F12)
2. Veja o erro
3. Me avise do erro específico

### Toast não aparece

**Causa:** Componente Toaster não incluído

**Solução:**
1. Verifique se `App.tsx` tem `<Toaster />`
2. Se não, adicione ao layout

---

## 📸 Capturas Esperadas

### Tela de Login
- Design moderno com degradê
- Cards de credenciais à direita
- Logo e funcionalidades à esquerda

### Dashboard
- Sidebar azul/roxo
- Cards de métricas
- Gráficos (se implementado)

### Pacientes
- **Botão verde "Novo Paciente" bem visível**
- 3 cards de estatísticas (150, 15, 42)
- Tabela com avatares coloridos
- Badges de convênio

### Modal Novo Paciente
- **Dialog centralizado**
- Formulário em grid 2 colunas
- Campos com labels claros
- Campos obrigatórios marcados com *
- Botões estilizados no rodapé

---

## ✅ Resultado Esperado

Se tudo estiver funcionando:

- ✅ Login com mock funciona
- ✅ Navegação entre páginas funciona
- ✅ **Botão "Novo Paciente" abre modal**
- ✅ **Formulário valida e salva (console.log)**
- ✅ Toast notifications funcionam
- ✅ Responsividade funciona
- ✅ Logout funciona

**Todos os testes passaram? Perfeito! 🎉**

---

## 🚀 Próximos Passos

Após confirmar que tudo funciona no mock:

1. **Implementar outras funcionalidades:**
   - Editar paciente
   - Deletar paciente
   - Ver detalhes do paciente
   - Implementar páginas de Agenda, Prontuários, etc.

2. **Conectar com API real (Opção B):**
   - Instalar ngrok
   - Expor backend
   - Configurar URL real
   - Testar com dados do PostgreSQL

3. **Deploy:**
   - Frontend no Vercel/Netlify
   - Backend no Railway/Render
   - Banco de dados em produção

---

## 📝 Reporte de Bugs

Se encontrar algum problema, me avise com:

1. **O que você tentou fazer**
2. **O que aconteceu**
3. **Mensagem de erro (se houver)**
4. **Screenshot (se possível)**

Vou corrigir imediatamente! 🛠️

---

## 🎯 Agora é com você!

**Acesse agora:**
1. https://lovable.dev
2. Abra projeto: **fronty-magic**
3. Siga este guia de testes
4. Me reporte os resultados!

**Boa sorte! 🚀**

