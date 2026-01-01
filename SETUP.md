# 🚀 Guia Rápido de Setup

## Passo a Passo

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Configurar PostgreSQL

Crie um banco de dados:
```sql
CREATE DATABASE rpg_db;
```

### 3. Configurar Variáveis de Ambiente

**apps/api/.env** (criar arquivo):
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/rpg_db?schema=public"
```

**apps/web/.env.local** (criar arquivo):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Configurar Banco de Dados
```bash
cd apps/api
pnpm db:generate
pnpm db:push
```

### 5. Iniciar Aplicação
```bash
# Na raiz do projeto
pnpm dev
```

Isso iniciará:
- Frontend: http://localhost:3000
- API: http://localhost:3001

### 6. Usar o Sistema

1. Acesse http://localhost:3000
2. Digite um nome de usuário
3. Escolha "Jogador" ou "Mestre"
4. Comece a criar seus personagens!

## 🎮 Dicas

- **Jogador**: Vê apenas suas próprias fichas
- **Mestre**: Vê todas as fichas de todos os jogadores
- Os modificadores de atributos são calculados automaticamente
- Todas as alterações são salvas automaticamente no banco de dados

## 🐛 Problemas Comuns

**Erro de conexão com banco:**
- Verifique se PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`

**API não responde:**
- Verifique se a API está na porta 3001
- Confirme `NEXT_PUBLIC_API_URL` no frontend

