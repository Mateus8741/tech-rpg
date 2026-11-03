# Sistema de Fichas RPG - D&D

Sistema completo de gerenciamento de fichas de personagens baseado em D&D, construído com Next.js, Prisma e PostgreSQL.

## 🎯 Funcionalidades

- ✅ Sistema de autenticação por nome de usuário
- ✅ Roles: Jogador e Mestre
- ✅ Fichas de personagem completas e editáveis
- ✅ Atributos, pontos de vida, classe de armadura
- ✅ Sistema de permissões (jogadores veem apenas suas fichas, mestres veem todas)
- ✅ Interface moderna e responsiva

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL
- pnpm 9.0.0

## 🚀 Configuração

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar banco de dados

1. Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE rpg_db;
```

2. Configure a variável de ambiente no `apps/api/.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/rpg_db?schema=public"
```

### 3. Configurar Prisma

```bash
cd apps/api
pnpm db:generate
pnpm db:push
```

### 4. Configurar API URL no frontend

Crie o arquivo `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎮 Como Usar

### Iniciar os servidores

No diretório raiz:

```bash
pnpm dev
```

Isso iniciará:
- Frontend (web): http://localhost:3000
- Backend (API): http://localhost:3001

### Primeiro Acesso

1. Acesse http://localhost:3000
2. Digite um nome de usuário
3. Selecione "Jogador" ou "Mestre"
4. Clique em "Entrar"

### Criar Personagem

1. Após fazer login, clique em "Novo Personagem"
2. Preencha as informações básicas (nome, raça, classe, etc.)
3. Configure os atributos (Força, Destreza, etc.)
4. Ajuste pontos de vida e classe de armadura
5. Adicione anotações se desejar
6. Clique em "Salvar Personagem"

### Editar Personagem

1. Na lista de personagens, clique em "Editar"
2. Modifique os campos desejados
3. Clique em "Salvar Personagem"

### Permissões

- **Jogador**: Pode criar, editar e deletar apenas seus próprios personagens
- **Mestre**: Pode ver, editar e deletar todos os personagens de todos os jogadores

## 📚 Regras e Compêndio

O sistema segue as regras de D&D 5e em PT-BR, centralizadas no pacote `packages/rules` (`@repo/rules`):

- Dados: `RACES`, `CLASSES`, `BACKGROUNDS`, `SPELLS`, armas/armaduras, condições e seções de regras.
- Helpers: `abilityModifier`, `proficiencyBonus`, `spellSlotsFor`, `levelForXp`, `rollDice`, `getRace/getClass/getBackground/getSpell`.
- A ficha estruturada fica em `Character.customData.sheet` (contrato em `apps/web/lib/sheet.ts`); as colunas fixas do Prisma guardam atributos finais, PV, CA etc.

Rotas do frontend:

| Rota | Conteúdo |
| --- | --- |
| `/compendio` | Raças, classes, antecedentes, equipamento |
| `/magias` | Busca e filtro de magias (classe, nível, escola) |
| `/regras` | Regras básicas e condições |
| `/dados` | Rolador de dados |
| Wizard de criação | Criação guiada de personagem (raça, classe, antecedente, atributos, magias) |

A API valida personagens (nível 1–20, atributos 1–30) e o `PUT /api/characters/:id` aceita apenas campos conhecidos do modelo (incluindo `customData`). O seed (`pnpm --filter api db:seed`) cria 6 personagens de exemplo calculados a partir do `@repo/rules`.

## 📁 Estrutura do Projeto

```
rpg/
├── apps/
│   ├── api/              # Backend (Next.js API Routes)
│   │   ├── app/api/      # Rotas da API
│   │   ├── lib/          # Utilitários (Prisma client)
│   │   └── prisma/       # Schema do Prisma
│   └── web/              # Frontend (Next.js)
│       ├── app/          # Páginas e rotas
│       ├── components/   # Componentes React
│       └── lib/          # Utilitários (API client)
└── packages/             # Pacotes compartilhados
```

## 🗄️ Modelo de Dados

### User
- `id`: ID único
- `username`: Nome de usuário (único)
- `role`: PLAYER ou MASTER
- `characters`: Lista de personagens

### Character
- Informações básicas: nome, raça, classe, nível, antecedente, alinhamento
- Atributos: Força, Destreza, Constituição, Inteligência, Sabedoria, Carisma
- Pontos de vida: máximo, atual, temporários
- Classe de Armadura (CA)
- Perícias, proficiências, equipamentos, magias (JSON)
- Anotações do jogador

## 🛠️ Scripts Disponíveis

### API (apps/api)
- `pnpm dev`: Inicia servidor de desenvolvimento
- `pnpm db:generate`: Gera Prisma Client
- `pnpm db:push`: Aplica mudanças no schema ao banco
- `pnpm db:migrate`: Cria e aplica migrações
- `pnpm db:studio`: Abre Prisma Studio

### Web (apps/web)
- `pnpm dev`: Inicia servidor de desenvolvimento

### Raiz
- `pnpm dev`: Inicia todos os apps em desenvolvimento
- `pnpm build`: Builda todos os apps
- `pnpm lint`: Executa linter em todos os apps

## 🔧 Tecnologias

- **Next.js 16**: Framework React
- **Prisma**: ORM para PostgreSQL
- **PostgreSQL**: Banco de dados
- **TypeScript**: Tipagem estática
- **Turborepo**: Monorepo management

## 📝 Notas

- O sistema usa autenticação simples baseada em nome de usuário (sem senha)
- Os dados são armazenados localmente no navegador (localStorage) para manter a sessão
- O mestre tem acesso total a todas as fichas
- Os modificadores de atributos são calculados automaticamente: `(valor - 10) / 2`

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
- Verifique se o PostgreSQL está rodando
- Confirme que a `DATABASE_URL` está correta no `.env`
- Certifique-se de que o banco de dados foi criado

### Erro ao acessar API
- Verifique se o servidor da API está rodando na porta 3001
- Confirme que `NEXT_PUBLIC_API_URL` está configurado no frontend

### Erro de permissão
- Jogadores só podem acessar suas próprias fichas
- Mestres podem acessar todas as fichas

## 📄 Licença

Este projeto é de uso livre.
