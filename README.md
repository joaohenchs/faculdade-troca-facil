# TrocaFácil

Sistema web desenvolvido para incentivar o **reaproveitamento de objetos** e **reduzir o desperdício**, promovendo uma economia circular colaborativa.

---

## Autor

**João Victor de Los Rios Henchs**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jvlhenchs)

---

## Sobre o Projeto

O TrocaFácil é uma plataforma que conecta pessoas que desejam trocar ou doar itens que não utilizam mais, transformando o excesso de um em solução para outro. O sistema promove sustentabilidade, solidariedade e consumo consciente.

### Principais Funcionalidades

- **Cadastro de Itens** - Registre itens para troca ou doação com imagens
- **Exploração** - Navegue pelos itens disponíveis na comunidade
- **Sistema de Propostas** - Envie e receba propostas de troca/doação
- **Chat em Tempo Real** - Converse com outros usuários para combinar detalhes
- **Confirmação Bilateral** - Ambas as partes confirmam a conclusão da troca
- **Dashboard Pessoal** - Gerencie seus itens e acompanhe estatísticas

---

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos

### Backend
- **Supabase** - Backend as a Service
  - Autenticação de usuários
  - Banco de dados PostgreSQL
  - Armazenamento de imagens
  - Realtime para chat
  - Row Level Security (RLS)

### DevOps
- **Railway** - Hospedagem e deploy
- **GitHub** - Controle de versão

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joaohenchs/faculdade-troca-facil.git
cd faculdade-troca-facil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

4. Execute as migrations no Supabase:
```bash
# Cole o conteúdo de setup_database_clean.sql no SQL Editor do Supabase
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Acesse: `http://localhost:5173`

---

## Estrutura do Projeto

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes reutilizáveis
├── hooks/           # Custom hooks
├── integrations/    # Integração com Supabase
└── lib/             # Utilitários

supabase/
└── migrations/      # Scripts SQL do banco
```

---

## Funcionalidades Detalhadas

### Autenticação
- Registro com email, senha e nome
- Login seguro
- Gerenciamento de sessão automático

### Gestão de Itens
- Cadastro com título, descrição, categoria e imagem
- Classificação: Troca ou Doação
- Status: Disponível ou Trocado

### Negociações
- Proposta de troca (oferece item em troca)
- Solicitação de doação (recebe gratuitamente)
- Aceitar ou recusar propostas
- Acompanhamento de status

### Chat
- Mensagens em tempo real
- Histórico completo
- Confirmação de conclusão

---

## Impacto

### Ambiental
- Redução de lixo e desperdício
- Economia de recursos naturais
- Menor pegada de carbono

### Social
- Acesso a itens sem custo
- Fortalecimento da comunidade
- Promoção da solidariedade

### Econômico
- Economia doméstica
- Valorização do desapego
- Consumo consciente

---

## Deploy

O projeto está configurado para deploy no Railway com:
- Build automático via GitHub
- Variáveis de ambiente seguras
- HTTPS habilitado

---

## Licença

Este projeto foi desenvolvido como trabalho acadêmico.

---

## Contato

**João Victor de Los Rios Henchs**

- LinkedIn: [linkedin.com/in/jvlhenchs](https://www.linkedin.com/in/jvlhenchs)
- GitHub: [github.com/joaohenchs](https://github.com/joaohenchs)

---

*"Transforme o que você não usa em algo que alguém precisa"*

**TrocaFácil - Economia Circular Colaborativa**
