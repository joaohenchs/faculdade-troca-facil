# TrocaFácil - Sistema Web de Economia Circular

## Apresentação

**TrocaFácil** é um sistema web desenvolvido para incentivar o **reaproveitamento de objetos** e **reduzir o desperdício**, promovendo uma economia circular colaborativa. A plataforma conecta pessoas que desejam trocar ou doar itens que não utilizam mais, transformando o excesso de um em solução para outro.

---

## O Problema

Vivemos em uma sociedade de consumo onde:
- Milhões de objetos em bom estado são descartados diariamente
- Recursos naturais são desperdiçados na produção de novos itens
- Pessoas compram novos produtos enquanto outras têm itens parados em casa
- O acúmulo de lixo em aterros sanitários cresce exponencialmente
- Falta conexão entre quem tem e quem precisa

---

## A Solução: TrocaFácil

Uma plataforma digital que permite:

### 1. Trocar Objetos
Ofereça um item que você não usa mais em troca de algo que você precisa. Economia sem gastar dinheiro.

### 2. Doar com Propósito
Doe itens para quem realmente precisa, promovendo a solidariedade e reduzindo o desperdício.

### 3. Conectar Pessoas
Chat integrado para combinar detalhes da troca/doação com segurança e praticidade.

---

## Funcionalidades Principais

### Autenticação Segura
- Cadastro com email, senha e nome completo
- Login seguro com criptografia
- Perfil de usuário vinculado automaticamente
- Controle de acesso por políticas de segurança (RLS)

### Gestão de Itens
- Cadastro de itens com título, descrição e categoria
- Upload de imagens (armazenamento próprio ou URL externa)
- Classificação: **Troca** ou **Doação**
- 8 categorias: Eletrônicos, Móveis, Roupas, Livros, Jogos, Esportes, Decoração, Outros
- Dashboard pessoal com estatísticas

### Exploração e Busca
- Listagem de itens disponíveis na comunidade
- Busca por título ou categoria em tempo real
- Filtros por tipo (Trocas, Doações ou Todos)
- Visualização detalhada de cada item

### Sistema de Negociação
- Proposta de troca (oferece um item seu em troca)
- Solicitação de doação (recebe gratuitamente)
- Status de acompanhamento: Pendente → Aceita → Confirmada
- Aceitar ou recusar propostas recebidas

### Chat em Tempo Real
- Mensagens instantâneas entre usuários
- Histórico completo da conversa
- Combinação de local e horário de encontro
- Confirmação bilateral (ambos confirmam a conclusão)

### Confirmação de Troca
- Cada usuário confirma separadamente
- Após ambos confirmarem: itens marcados como "trocados"
- Transparência e segurança na finalização

---

## Fluxo do Usuário

```
1. CADASTRO/LOGIN
   └─> Cria conta ou acessa com credenciais

2. DASHBOARD PESSOAL
   ├─> Visualiza seus itens cadastrados
   ├─> Vê estatísticas (total, disponíveis, trocas, doações)
   └─> Adiciona novos itens

3. EXPLORAR COMUNIDADE
   ├─> Navega pelos itens disponíveis
   ├─> Busca e filtra por categoria/tipo
   └─> Encontra itens de interesse

4. PROPOR TROCA/DOAÇÃO
   ├─> Seleciona item de interesse
   ├─> Oferece item próprio (troca) ou solicita (doação)
   └─> Envia proposta

5. GERENCIAR NEGOCIAÇÕES
   ├─> Recebe propostas de outros usuários
   ├─> Aceita ou recusa
   └─> Acompanha status

6. CHAT E COMBINAÇÃO
   ├─> Conversa com o outro usuário
   ├─> Combina detalhes do encontro
   └─> Confirma a conclusão

7. FINALIZAÇÃO
   └─> Ambos confirmam → Troca concluída!
```

---

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript para maior segurança
- **Vite** - Build tool moderna e rápida
- **React Router v6** - Navegação SPA (Single Page Application)

### UI/UX
- **Tailwind CSS** - Framework CSS utility-first
- **Shadcn/ui** - Componentes acessíveis e customizáveis
- **Lucide React** - Biblioteca de ícones modernos
- **Sonner** - Sistema de notificações toast
- **Animações CSS** - Transições suaves e efeitos visuais

### Backend (BaaS)
- **Supabase** - Backend as a Service completo
  - **Auth**: Autenticação e gerenciamento de usuários
  - **Database**: PostgreSQL gerenciado
  - **Storage**: Armazenamento de arquivos (imagens)
  - **Realtime**: Subscriptions para chat em tempo real
  - **RLS**: Row Level Security para proteção de dados

### Banco de Dados
- **PostgreSQL** - Banco relacional robusto
- **4 tabelas principais**: profiles, items, trade_requests, messages
- **Índices otimizados** para performance
- **Triggers automáticos** para criação de perfis
- **Políticas de segurança** granulares

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade cross-browser

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  React  │  │  Vite   │  │Tailwind │        │
│  │   18    │  │  5.4    │  │  CSS    │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │         React Router v6             │       │
│  │   (SPA Navigation & Routing)        │       │
│  └─────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS/WebSocket
                       ▼
┌─────────────────────────────────────────────────┐
│                   SUPABASE                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Auth   │  │Database │  │ Storage │        │
│  │(Users)  │  │(Postgres│  │(Images) │        │
│  └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │           Realtime                   │       │
│  │    (Chat & Live Updates)            │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │      Row Level Security (RLS)       │       │
│  │   (Proteção de Dados por Usuário)  │       │
│  └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
troca-certa/
├── public/                    # Arquivos estáticos
│   ├── favicon.svg           # Ícone personalizado
│   └── placeholder.svg       # Imagem placeholder
│
├── src/                       # Código fonte
│   ├── pages/                # Páginas da aplicação
│   │   ├── Auth.tsx         # Login/Cadastro
│   │   ├── Dashboard.tsx    # Painel principal
│   │   ├── Explore.tsx      # Explorar itens
│   │   ├── NewItem.tsx      # Cadastrar item
│   │   ├── ItemDetail.tsx   # Detalhes do item
│   │   ├── NewTrade.tsx     # Nova proposta
│   │   ├── Trades.tsx       # Negociações
│   │   └── Chat.tsx         # Chat em tempo real
│   │
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Header.tsx       # Navegação
│   │   ├── ItemCard.tsx     # Card de item
│   │   ├── ImageUpload.tsx  # Upload de imagens
│   │   └── ui/              # Componentes shadcn/ui
│   │
│   ├── hooks/                # Hooks personalizados
│   │   └── useAuth.tsx      # Gerenciamento de auth
│   │
│   ├── integrations/         # Integrações externas
│   │   └── supabase/        # Cliente Supabase
│   │
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
│
├── supabase/                  # Configuração do banco
│   └── migrations/          # Migrations SQL
│
└── package.json              # Dependências
```

---

## Modelo de Dados

### Tabela: profiles (Perfis)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único (vinculado ao Auth) |
| name | TEXT | Nome do usuário |
| created_at | TIMESTAMP | Data de criação |

### Tabela: items (Itens)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| user_id | UUID | Proprietário do item |
| title | TEXT | Título do item |
| description | TEXT | Descrição detalhada |
| category | TEXT | Categoria do item |
| image_url | TEXT | URL da imagem |
| type | TEXT | "trade" ou "donation" |
| status | TEXT | "available" ou "traded" |
| created_at | TIMESTAMP | Data de cadastro |

### Tabela: trade_requests (Negociações)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| offered_item_id | UUID | Item oferecido |
| requested_item_id | UUID | Item solicitado |
| status | TEXT | Status da negociação |
| confirmed_by_requester | BOOLEAN | Confirmação do solicitante |
| confirmed_by_offerer | BOOLEAN | Confirmação do ofertante |
| created_at | TIMESTAMP | Data da proposta |

### Tabela: messages (Mensagens)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| trade_id | UUID | Negociação relacionada |
| sender_id | UUID | Quem enviou |
| content | TEXT | Conteúdo da mensagem |
| created_at | TIMESTAMP | Data/hora do envio |

---

## Segurança Implementada

### Row Level Security (RLS)
- **Profiles**: Todos podem ver, cada um edita apenas o seu
- **Items**: Visualização pública, edição restrita ao proprietário
- **Trade Requests**: Apenas participantes da negociação acessam
- **Messages**: Apenas usuários envolvidos na troca podem ler/enviar

### Autenticação
- Senhas criptografadas via Supabase Auth
- Tokens JWT para sessões seguras
- Refresh automático de tokens
- Proteção contra CSRF

### Validações
- Verificação de tipos de arquivo no upload
- Limite de tamanho de imagem (5MB)
- Sanitização de inputs
- Tratamento de erros centralizado

---

## Diferenciais do Projeto

### 1. Economia Circular Completa
Não é apenas um marketplace - é uma plataforma que promove sustentabilidade, permitindo tanto trocas quanto doações genuínas.

### 2. Chat em Tempo Real
Comunicação instantânea usando WebSockets do Supabase, permitindo negociação fluida e combinação de detalhes.

### 3. Confirmação Bilateral
Sistema de dupla confirmação garante que ambas as partes concordam com a conclusão, aumentando a confiança.

### 4. Interface Moderna e Responsiva
Design clean com gradientes, animações suaves e adaptação perfeita para mobile, tablet e desktop.

### 5. Segurança Robusta
Políticas de segurança em nível de banco de dados (RLS) garantem privacidade e integridade dos dados.

### 6. Upload Flexível
Suporta tanto upload direto de imagens quanto URLs externas, oferecendo flexibilidade ao usuário.

---

## Impacto Social e Ambiental

### Benefícios Ambientais
- **Redução de lixo**: Itens reutilizados ao invés de descartados
- **Economia de recursos**: Menos produção de novos produtos
- **Menor pegada de carbono**: Menos transporte e fabricação
- **Educação ambiental**: Conscientização sobre consumo consciente

### Benefícios Sociais
- **Acesso a itens**: Pessoas obtêm o que precisam sem custo
- **Solidariedade**: Doações conectam quem tem com quem precisa
- **Comunidade**: Fortalecimento de laços locais
- **Economia colaborativa**: Alternativa ao consumismo tradicional

### Benefícios Econômicos
- **Zero custo**: Trocas sem envolver dinheiro
- **Valor do desapego**: Transformar excesso em utilidade
- **Economia doméstica**: Itens necessários sem comprar
- **Sustentabilidade financeira**: Redução de gastos familiares

---

## Público-Alvo

- **Famílias** que acumulam itens sem uso
- **Estudantes** buscando materiais e livros
- **Ambientalistas** promovendo sustentabilidade
- **Pessoas em transição** (mudança, reforma, etc.)
- **Comunidades locais** fomentando colaboração
- **Organizações sociais** facilitando doações

---

## Escalabilidade

O projeto foi desenvolvido com arquitetura escalável:

- **Frontend**: Componentes modulares e reutilizáveis
- **Backend**: Supabase escala automaticamente
- **Database**: PostgreSQL otimizado com índices
- **CDN**: Distribuição global de assets
- **Realtime**: Suporta milhares de conexões simultâneas

---

## Próximos Passos (Roadmap)

### Versão 1.1
- [ ] Sistema de avaliações entre usuários
- [ ] Geolocalização para encontrar itens próximos
- [ ] Notificações push
- [ ] Categorias personalizadas

### Versão 2.0
- [ ] App mobile (React Native)
- [ ] Integração com redes sociais
- [ ] Sistema de gamificação (badges, pontos)
- [ ] Relatórios de impacto ambiental

### Versão 3.0
- [ ] Marketplace com moeda virtual
- [ ] Parcerias com ONGs
- [ ] API pública para integrações
- [ ] Inteligência artificial para sugestões

---

## Conclusão

O **TrocaFácil** é mais do que um sistema de trocas - é uma ferramenta de transformação social e ambiental. Ao conectar pessoas e facilitar o reaproveitamento de objetos, contribuímos para um mundo mais sustentável, solidário e consciente.

**Tecnologia a serviço do bem comum.**

---

## Informações Técnicas

- **Versão**: 1.0.0
- **Licença**: Privada
- **Desenvolvido com**: React, TypeScript, Supabase, Tailwind CSS
- **Hospedagem**: Pronto para Vercel, Netlify ou similar
- **Repositório**: Código fonte completo e documentado

---

*"Transforme o que você não usa em algo que alguém precisa"*

**TrocaFácil - Economia Circular Colaborativa**
