# Fichas RPG — app mobile

App Expo (SDK 58) do monorepo, com expo-router, navegação por abas inferiores e Tailwind v4 via [Uniwind](https://uniwind.dev).

## Rodando

```bash
pnpm install          # na raiz do monorepo
pnpm --filter mobile dev
```

Abra no Expo Go (QR code), no simulador iOS (`i`) ou no emulador Android (`a`).

A API (`apps/api`) precisa estar rodando. Sem `EXPO_PUBLIC_API_URL`, o app usa o IP da máquina do Metro na porta 3001, então funciona em aparelho físico na mesma rede. Para apontar para outra API, copie `.env.example` para `.env.local`.

## Estrutura

```
src/
  app/                    rotas (expo-router)
    _layout.tsx           fontes, sessão, tema; login ↔ abas via Stack.Protected
    login.tsx
    (tabs)/               abas inferiores: personagens, magias, compendio, dados, perfil
      <aba>/_layout.tsx   Stack de cada aba (a tab bar continua visível nos detalhes)
  features/<aba>/         componentes e lógica de cada aba
  components/ui/          kit de UI compartilhado (Card, Button, Badge, SearchBar…)
  lib/                    api.ts (mesmo contrato do web), session.tsx, nav-theme.ts
  global.css              tokens de cor (claro/escuro), os mesmos do apps/web
```

## Estilo

Use `className` com os tokens do `global.css` (`bg-surface`, `text-ink`, `text-gold-ink`, `border-line`, `font-display`…). As variantes `dark:` não são necessárias: os tokens já mudam com o tema. Para cores em props que não aceitam `className` (ícones, navegação), use `useThemeColor('--color-…')`.

`pnpm check-types` gera os tipos do Uniwind (`src/uniwind-types.d.ts`) antes de rodar o `tsc`.
