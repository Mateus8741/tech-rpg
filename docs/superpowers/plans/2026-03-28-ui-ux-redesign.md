# UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the RPG character manager web app from plain CSS Modules to Tailwind CSS + shadcn/ui with a dark modern design — 60px icon sidebar, tabbed character form, violet accent.

**Architecture:** Install Tailwind v4 + shadcn/ui in `apps/web`. Create a `(app)` Next.js route group to scope the sidebar shell to authenticated pages (login stays standalone). Migrate all pages and components, deleting CSS Modules as each is replaced. `CombatTracker` becomes the "Combate" tab inside `CharacterForm` via new optional props.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide React, Sonner (toasts)

**Spec:** `docs/superpowers/specs/2026-03-28-ui-ux-redesign.md`

---

## File Map

| Action | Path |
|---|---|
| **Create** | `apps/web/app/(app)/layout.tsx` |
| **Create** | `apps/web/components/Sidebar.tsx` |
| **Create** | `apps/web/postcss.config.mjs` |
| **Create** | `apps/web/components/ui/` (shadcn auto-generated) |
| **Create** | `apps/web/lib/utils.ts` (shadcn auto-generated) |
| **Move** | `apps/web/app/characters/` → `apps/web/app/(app)/characters/` |
| **Modify** | `apps/web/package.json` |
| **Modify** | `apps/web/app/layout.tsx` |
| **Modify** | `apps/web/app/globals.css` |
| **Modify** | `apps/web/app/page.tsx` |
| **Modify** | `apps/web/app/(app)/characters/page.tsx` |
| **Modify** | `apps/web/app/(app)/characters/new/page.tsx` |
| **Modify** | `apps/web/app/(app)/characters/[id]/page.tsx` |
| **Modify** | `apps/web/components/CharacterForm.tsx` |
| **Modify** | `apps/web/components/CombatTracker.tsx` |
| **Delete** | `apps/web/app/page.module.css` |
| **Delete** | `apps/web/app/characters/page.module.css` |
| **Delete** | `apps/web/components/CharacterForm.module.css` |
| **Delete** | `apps/web/components/CombatTracker.module.css` |

---

## Task 1: Install Tailwind CSS v4 + shadcn/ui

**Files:**
- Modify: `apps/web/package.json`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/components.json` (shadcn config)
- Create: `apps/web/lib/utils.ts`

- [ ] **Step 1: Install Tailwind v4 and PostCSS plugin**

```bash
cd apps/web
pnpm add tailwindcss @tailwindcss/postcss
```

- [ ] **Step 2: Create PostCSS config**

Create `apps/web/postcss.config.mjs`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 3: Run shadcn init**

```bash
cd apps/web
pnpm dlx shadcn@latest init --defaults -y
```

When prompted (or edit `components.json` after):
- Style: `default`
- Base color: `violet`
- CSS variables: `yes`

After init, `components.json` should be:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "violet",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 4: Install shadcn components**

```bash
cd apps/web
pnpm dlx shadcn@latest add button input select tabs table badge separator card alert-dialog sonner
```

Expected: Creates `apps/web/components/ui/` with each component file.

- [ ] **Step 5: Verify dev server starts**

```bash
cd apps/web
pnpm dev
```

Expected: Server starts on port 3000 without errors. The page may look unstyled — that's fine, globals.css gets replaced in the next task.

- [ ] **Step 6: Commit**

```bash
cd apps/web
git add package.json postcss.config.mjs components.json lib/utils.ts components/ui/
git commit -m "chore(web): install Tailwind v4 + shadcn/ui with violet theme"
```

---

## Task 2: Configure Dark Theme in globals.css

**Files:**
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Replace globals.css content**

Replace the entire content of `apps/web/app/globals.css`:
```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 228 27% 8%;
    --foreground: 213 32% 91%;
    --card: 234 22% 10%;
    --card-foreground: 213 32% 91%;
    --popover: 234 22% 10%;
    --popover-foreground: 213 32% 91%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
    --secondary: 234 22% 13%;
    --secondary-foreground: 213 32% 91%;
    --muted: 234 22% 13%;
    --muted-foreground: 215 20% 50%;
    --accent: 239 84% 67%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 234 28% 16%;
    --input: 234 28% 16%;
    --ring: 239 84% 67%;
    --radius: 0.75rem;
    --sidebar: 228 35% 6%;
    --sidebar-foreground: 213 32% 91%;
    --sidebar-border: 234 28% 16%;
  }

  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: #0f1117;
    color: #e2e8f0;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
  }
}
```

- [ ] **Step 2: Verify theme loads**

```bash
pnpm dev
```

Expected: App still renders (may be plain HTML), body background is `#0f1117` (very dark navy).

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "chore(web): configure dark violet theme for shadcn"
```

---

## Task 3: Create Route Group + Sidebar

**Files:**
- Create: `apps/web/app/(app)/layout.tsx`
- Create: `apps/web/components/Sidebar.tsx`
- Move: `apps/web/app/characters/` → `apps/web/app/(app)/characters/`

- [ ] **Step 1: Create the (app) directory and move characters**

```bash
cd apps/web
mkdir -p app/\(app\)
cp -r app/characters app/\(app\)/characters
rm -rf app/characters
```

Verify: `apps/web/app/(app)/characters/` exists with `page.tsx`, `new/page.tsx`, `[id]/page.tsx`.

- [ ] **Step 2: Create the Sidebar component**

Create `apps/web/components/Sidebar.tsx`:
```tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/characters', icon: Users, label: 'Personagens' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [initial, setInitial] = useState('?');

  useEffect(() => {
    const username = localStorage.getItem('rpg_username') || '?';
    setInitial(username[0].toUpperCase());
  }, []);

  return (
    <aside className="w-[60px] bg-[#0a0c14] border-r border-[#1e2035] flex flex-col items-center py-4 gap-1 flex-shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="w-9 h-9 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-5 flex-shrink-0">
        <Swords className="w-4 h-4 text-white" />
      </div>

      {/* Nav items */}
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              isActive
                ? 'bg-[#6366f1]/15 border border-[#6366f1]/30'
                : 'hover:bg-white/5'
            )}
          >
            <Icon
              className={cn(
                'w-[18px] h-[18px]',
                isActive ? 'text-[#a78bfa]' : 'text-[#64748b]'
              )}
            />
          </Link>
        );
      })}

      <div className="flex-1" />

      {/* User avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 flex-shrink-0">
        {initial}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create the (app) layout**

Create `apps/web/app/(app)/layout.tsx`:
```tsx
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0f1117] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Verify routes still work**

```bash
pnpm dev
```

Open `http://localhost:3000/characters`. Expected: sidebar appears on the left with the sword icon and Users nav item. Login page at `/` has NO sidebar.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/ components/Sidebar.tsx
git commit -m "feat(web): add route group shell with icon sidebar"
```

---

## Task 4: Redesign Login Page

**Files:**
- Modify: `apps/web/app/page.tsx`
- Delete: `apps/web/app/page.module.css`

- [ ] **Step 1: Replace login page**

Replace the content of `apps/web/app/page.tsx`:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swords } from 'lucide-react';
import { login } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('rpg_username');
    if (saved) setUsername(saved);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, insira um nome de usuário');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim(), role);
      localStorage.setItem('rpg_username', username.trim());
      localStorage.setItem('rpg_role', role);
      router.push('/characters');
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#13151f] border border-[#1e2035] rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-2xl flex items-center justify-center mb-4">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">Sistema de Fichas RPG</h1>
          <p className="text-sm text-[#64748b] mt-1">Gerenciamento de Personagens D&D</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
              Nome de Usuário
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome"
              disabled={loading}
              className="bg-[#0f1117] border-[#2d2f45] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#6366f1]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
              Tipo de Usuário
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as 'PLAYER' | 'MASTER')} disabled={loading}>
              <SelectTrigger className="bg-[#0f1117] border-[#2d2f45] text-[#e2e8f0] focus:ring-[#6366f1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#13151f] border-[#2d2f45]">
                <SelectItem value="PLAYER" className="text-[#e2e8f0] focus:bg-[#6366f1]/20">Jogador</SelectItem>
                <SelectItem value="MASTER" className="text-[#e2e8f0] focus:bg-[#6366f1]/20">Mestre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-0 font-semibold mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#1e2035] space-y-1.5">
          <p className="text-xs text-[#475569]">
            <span className="text-[#94a3b8] font-medium">Jogador</span> — acessa apenas suas próprias fichas
          </p>
          <p className="text-xs text-[#475569]">
            <span className="text-[#94a3b8] font-medium">Mestre</span> — acessa todas as fichas dos jogadores
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete old CSS module**

```bash
rm apps/web/app/page.module.css
```

- [ ] **Step 3: Verify login works**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected: dark card centered, gradient logo, styled inputs. Enter a username and log in — should redirect to `/characters`.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git rm app/page.module.css
git commit -m "feat(web): redesign login page with dark modern UI"
```

---

## Task 5: Redesign Characters List Page

**Files:**
- Modify: `apps/web/app/(app)/characters/page.tsx`
- Delete: `apps/web/app/(app)/characters/page.module.css`

- [ ] **Step 1: Replace characters list page**

Replace `apps/web/app/(app)/characters/page.tsx`:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, LogOut, Trash2, Pencil, Users } from 'lucide-react';
import { getCharacters, deleteCharacter, type Character } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    const savedRole = localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER';
    if (!savedUsername) { router.push('/'); return; }
    setUsername(savedUsername);
    setUserRole(savedRole || 'PLAYER');
    loadCharacters(savedUsername);
  }, [router]);

  const loadCharacters = async (user: string) => {
    try {
      setLoading(true);
      const data = await getCharacters(user);
      setCharacters(data);
    } catch {
      toast.error('Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCharacter(deleteId, username);
      await loadCharacters(username);
      toast.success('Personagem excluído');
    } catch {
      toast.error('Erro ao excluir personagem');
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rpg_username');
    localStorage.removeItem('rpg_role');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#64748b]">
        Carregando...
      </div>
    );
  }

  return (
    <>
      {/* Top bar */}
      <div className="h-[52px] border-b border-[#1e2035] px-6 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-sm font-semibold text-[#e2e8f0]">Personagens</p>
          <p className="text-xs text-[#475569]">{characters.length} personagen{characters.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sair
          </Button>
          <Link href="/characters/new">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Novo Personagem
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-[#6366f1]/60" />
            </div>
            <p className="text-[#475569]">Nenhum personagem criado ainda.</p>
            <Link href="/characters/new">
              <Button className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white border-0">
                <Plus className="w-4 h-4 mr-1.5" />
                Criar Primeiro Personagem
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                userRole={userRole}
                onDelete={() => setDeleteId(character.id)}
              />
            ))}
            {/* Add new card */}
            <Link href="/characters/new" className="group">
              <div className="h-full min-h-[160px] border-2 border-dashed border-[#1e2035] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-[#6366f1]/40">
                <div className="w-8 h-8 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors">
                  <Plus className="w-4 h-4 text-[#6366f1]/70" />
                </div>
                <span className="text-xs text-[#475569]">Criar personagem</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#13151f] border-[#2d2f45]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#e2e8f0]">Excluir personagem?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#64748b]">
              Esta ação não pode ser desfeita. O personagem será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#2d2f45] text-[#94a3b8] hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CharacterCard({
  character,
  userRole,
  onDelete,
}: {
  character: Character;
  userRole: 'PLAYER' | 'MASTER';
  onDelete: () => void;
}) {
  return (
    <div className="bg-[#13151f] border border-[#1e2035] rounded-xl overflow-hidden hover:border-[#2d2f45] transition-colors">
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3 mt-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#e2e8f0] truncate">{character.name}</p>
            <p className="text-xs text-[#64748b] truncate">{character.race} • {character.class}</p>
          </div>
          <Badge
            variant="outline"
            className="ml-2 border-[#6366f1]/30 text-[#a78bfa] bg-[#6366f1]/10 text-[10px] flex-shrink-0"
          >
            Nv {character.level}
          </Badge>
        </div>

        {userRole === 'MASTER' && character.user && (
          <p className="text-[10px] text-[#475569] mb-2">
            👤 {character.user.username}
          </p>
        )}

        {/* Stats row */}
        <div className="flex gap-1.5 mb-3">
          {[
            { label: 'HP', value: `${character.currentHitPoints}`, color: 'text-[#f87171] bg-red-500/10 border-red-500/20' },
            { label: 'CA', value: `${character.armorClass}`, color: 'text-[#94a3b8] bg-white/5 border-[#1e2035]' },
            { label: 'MP', value: `${character.currentMana}`, color: 'text-[#818cf8] bg-[#818cf8]/10 border-[#818cf8]/20' },
          ].map(({ label, value, color }) => (
            <div key={label} className={cn('flex-1 rounded-lg border px-2 py-1.5 text-center', color)}>
              <p className="text-[13px] font-bold leading-none">{value}</p>
              <p className="text-[9px] uppercase tracking-wide mt-0.5 opacity-60">{label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <Link href={`/characters/${character.id}`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-[11px] border-[#6366f1]/20 text-[#a78bfa] bg-[#6366f1]/8 hover:bg-[#6366f1]/15 hover:border-[#6366f1]/40"
            >
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="flex-1 h-7 text-[11px] border-red-500/20 text-red-400 bg-red-500/8 hover:bg-red-500/15 hover:border-red-500/40"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete old CSS module**

```bash
rm apps/web/app/\(app\)/characters/page.module.css
```

- [ ] **Step 3: Add Toaster to root layout**

In `apps/web/app/layout.tsx`, add Sonner's Toaster:
```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Sistema de Fichas RPG - D&D",
  description: "Sistema completo de gerenciamento de fichas de personagens D&D",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Toaster theme="dark" richColors position="bottom-right" />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify characters list**

```bash
pnpm dev
```

Log in and go to `/characters`. Expected: grid of character cards with gradient top bar, HP/CA/MP stat pills, Editar/Excluir buttons. Deleting shows AlertDialog. Toast appears on delete.

- [ ] **Step 5: Commit**

```bash
git add app/\(app\)/characters/page.tsx app/layout.tsx
git rm app/\(app\)/characters/page.module.css
git commit -m "feat(web): redesign characters list with card grid and alert dialog"
```

---

## Task 6: CharacterForm — Shell + Tabs Structure

This task adds the tabbed layout to `CharacterForm`. The content of each tab is filled in Tasks 7, 8, and 9. The existing form logic (state, handlers) is preserved unchanged.

**Files:**
- Modify: `apps/web/components/CharacterForm.tsx`

- [ ] **Step 1: Update CharacterForm interface and imports**

At the top of `apps/web/components/CharacterForm.tsx`, replace the imports and interface:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Character, type Ability, type Equipment, type InventoryItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import CombatTracker from '@/components/CombatTracker';

interface CharacterFormProps {
  character?: Character;
  onSubmit: (data: Partial<Character>) => Promise<void>;
  // Required on edit page for the Combate tab:
  username?: string;
  userRole?: 'PLAYER' | 'MASTER';
  onCombatUpdate?: () => void;
}
```

Keep all existing state declarations and handler functions unchanged (lines with `useState`, `calculateModifier`, `handleChange`, `handleAbilityChange`, etc.).

- [ ] **Step 2: Add tab state**

After the `setSaving` state declaration, add:
```tsx
const [activeTab, setActiveTab] = useState('info');
const router = useRouter();
```

- [ ] **Step 3: Replace the return JSX with the tabbed shell**

Replace the entire `return (...)` block with:
```tsx
return (
  <form onSubmit={handleSubmit} className="flex flex-col">
    {/* Sticky header */}
    <div className="sticky top-0 z-10 bg-[#0a0c14] border-b border-[#1e2035] px-6 pb-0 pt-4">
      {/* Name + back + save row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/characters')}
            className="text-[#64748b] hover:text-[#e2e8f0] text-xs flex items-center gap-1 transition-colors"
          >
            ← Voltar
          </button>
          <div>
            <p className="text-base font-bold text-[#e2e8f0] leading-none">
              {formData.name || 'Novo Personagem'}
            </p>
            {character && (
              <p className="text-xs text-[#64748b] mt-0.5">
                {formData.race} • {formData.class} • Nível {formData.level}
              </p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={saving}
          size="sm"
          className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-0 font-semibold"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>

      {/* Stat pills */}
      {character && (
        <div className="flex gap-2 mb-3 flex-wrap">
          <StatPill label="HP" value={`${formData.currentHitPoints} / ${formData.maxHitPoints}`} colorClass="text-[#f87171] bg-red-500/10 border-red-500/20" />
          <StatPill label="CA" value={`${formData.armorClass}`} colorClass="text-[#94a3b8] bg-white/5 border-[#1e2035]" />
          <StatPill label="Mana" value={`${formData.currentMana} / ${formData.maxMana}`} colorClass="text-[#818cf8] bg-[#818cf8]/10 border-[#818cf8]/20" />
          <StatPill label="XP" value={`${formData.experience}`} colorClass="text-[#fbbf24] bg-amber-500/10 border-amber-500/20" />
        </div>
      )}

      {/* Tab bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b-0 gap-0 h-auto p-0 rounded-none">
          {[
            { value: 'info', label: 'Info' },
            { value: 'atributos', label: 'Atributos' },
            { value: 'habilidades', label: 'Habilidades' },
            { value: 'inventario', label: 'Inventário' },
            ...(character ? [{ value: 'combate', label: 'Combate' }] : []),
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs font-medium transition-colors data-[state=active]:border-[#8b5cf6] data-[state=active]:text-[#a78bfa] data-[state=inactive]:text-[#64748b] hover:text-[#94a3b8] bg-transparent shadow-none',
                tab.value === 'combate' && 'data-[state=active]:border-red-500 data-[state=active]:text-red-400'
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab content lives in the scrollable area below */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <TabsContent value="info" className="mt-0">
            {/* Info tab — filled in Task 7 */}
            <div className="text-[#64748b] text-sm">Info tab (Task 7)</div>
          </TabsContent>
          <TabsContent value="atributos" className="mt-0">
            {/* Atributos tab — filled in Task 7 */}
            <div className="text-[#64748b] text-sm">Atributos tab (Task 7)</div>
          </TabsContent>
          <TabsContent value="habilidades" className="mt-0">
            {/* Habilidades tab — filled in Task 8 */}
            <div className="text-[#64748b] text-sm">Habilidades tab (Task 8)</div>
          </TabsContent>
          <TabsContent value="inventario" className="mt-0">
            {/* Inventário tab — filled in Task 8 */}
            <div className="text-[#64748b] text-sm">Inventário tab (Task 8)</div>
          </TabsContent>
          {character && (
            <TabsContent value="combate" className="mt-0">
              {/* Combate tab — filled in Task 9 */}
              <div className="text-[#64748b] text-sm">Combate tab (Task 9)</div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  </form>
);
```

Also add this helper component at the bottom of the file (outside `CharacterForm`):
```tsx
function StatPill({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className={cn('flex items-center gap-2 border rounded-lg px-3 py-1.5', colorClass)}>
      <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
```

- [ ] **Step 4: Remove old CSS module import**

Remove this line from the top of `CharacterForm.tsx`:
```tsx
import styles from './CharacterForm.module.css';
```

- [ ] **Step 5: Verify tabs render**

```bash
pnpm dev
```

Open a character edit page. Expected: sticky header with stat pills, 5 tabs visible, clicking tabs changes the URL `?tab=`. Each tab shows a placeholder message (real content added in Tasks 7–9).

- [ ] **Step 6: Commit**

```bash
git add components/CharacterForm.tsx
git commit -m "feat(web): add tabbed shell to CharacterForm with sticky header"
```

---

## Task 7: CharacterForm — Info + Atributos Tabs

**Files:**
- Modify: `apps/web/components/CharacterForm.tsx`

- [ ] **Step 1: Replace Info tab content**

Find `<TabsContent value="info"` and replace the placeholder div with:
```tsx
<TabsContent value="info" className="mt-0">
  <div className="grid grid-cols-2 gap-4">
    <FormField label="Nome do Personagem">
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className={inputClass}
        placeholder="Ex: Thorin Ferropunho"
      />
    </FormField>
    <FormField label="Raça">
      <Select name="race" value={formData.race} onValueChange={(v) => setFormData(p => ({ ...p, race: v }))}>
        <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
        <SelectContent className="bg-[#13151f] border-[#2d2f45]">
          {['Humano','Elfo','Anão','Halfling','Meio-Elfo','Meio-Orc','Tiefling','Dragonborn','Gnomo'].map(r => (
            <SelectItem key={r} value={r} className="text-[#e2e8f0] focus:bg-[#6366f1]/20">{r}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
    <FormField label="Classe">
      <Select name="class" value={formData.class} onValueChange={(v) => setFormData(p => ({ ...p, class: v }))}>
        <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
        <SelectContent className="bg-[#13151f] border-[#2d2f45]">
          {['Guerreiro','Mago','Ladino','Clérigo','Ranger','Paladino','Bárbaro','Bardo','Druida','Monge','Bruxo','Feiticeiro'].map(c => (
            <SelectItem key={c} value={c} className="text-[#e2e8f0] focus:bg-[#6366f1]/20">{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
    <FormField label="Nível">
      <Input type="number" name="level" value={formData.level} onChange={handleChange} min="1" max="20" className={inputClass} />
    </FormField>
    <FormField label="Antecedente">
      <Input name="background" value={formData.background} onChange={handleChange} placeholder="Ex: Soldado, Erudito..." className={inputClass} />
    </FormField>
    <FormField label="Alinhamento">
      <Select name="alignment" value={formData.alignment || ''} onValueChange={(v) => setFormData(p => ({ ...p, alignment: v }))}>
        <SelectTrigger className={inputClass}><SelectValue placeholder="-" /></SelectTrigger>
        <SelectContent className="bg-[#13151f] border-[#2d2f45]">
          {['Leal e Bom','Neutro e Bom','Caótico e Bom','Leal e Neutro','Neutro','Caótico e Neutro','Leal e Mau','Neutro e Mau','Caótico e Mau'].map(a => (
            <SelectItem key={a} value={a} className="text-[#e2e8f0] focus:bg-[#6366f1]/20">{a}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
    <FormField label="Experiência">
      <Input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" className={inputClass} />
    </FormField>
  </div>
</TabsContent>
```

Add these constants near the top of the `CharacterForm` function body:
```tsx
const inputClass = "bg-[#0f1117] border-[#2d2f45] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#6366f1]";
```

Add these helper components at the bottom of the file (alongside `StatPill`):
```tsx
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#13151f] border border-[#1e2035] rounded-xl p-5">
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-4">{title}</p>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Replace Atributos tab content**

Find `<TabsContent value="atributos"` and replace the placeholder with:
```tsx
<TabsContent value="atributos" className="mt-0 space-y-4">
  {/* Attribute grid */}
  <SectionCard title="Atributos">
    <div className="grid grid-cols-6 gap-3">
      {[
        { key: 'strength', abbr: 'FOR' },
        { key: 'dexterity', abbr: 'DES' },
        { key: 'constitution', abbr: 'CON' },
        { key: 'intelligence', abbr: 'INT' },
        { key: 'wisdom', abbr: 'SAB' },
        { key: 'charisma', abbr: 'CAR' },
      ].map(({ key, abbr }) => {
        const val = formData[key as keyof typeof formData] as number;
        const mod = calculateModifier(val);
        const modColor = mod > 0 ? 'text-[#a78bfa] bg-[#6366f1]/15' : mod < 0 ? 'text-[#f87171] bg-red-500/10' : 'text-[#64748b] bg-white/5';
        return (
          <div key={key} className="bg-[#0f1117] border border-[#2d2f45] rounded-xl p-3 text-center">
            <p className="text-[9px] font-semibold text-[#475569] uppercase tracking-widest mb-2">{abbr}</p>
            <input
              type="number"
              name={key}
              value={val}
              onChange={handleChange}
              min="1"
              max="30"
              className="bg-transparent w-full text-center text-lg font-bold text-[#e2e8f0] outline-none border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className={cn('mt-2 rounded-full py-0.5 text-xs font-semibold', modColor)}>
              {mod >= 0 ? '+' : ''}{mod}
            </div>
          </div>
        );
      })}
    </div>
  </SectionCard>

  {/* HP + Mana */}
  <div className="grid grid-cols-2 gap-4">
    <SectionCard title="Pontos de Vida">
      <div className="grid grid-cols-3 gap-3">
        <FormField label="Máximo">
          <Input type="number" name="maxHitPoints" value={formData.maxHitPoints} onChange={handleChange} min="1" className={inputClass} />
        </FormField>
        <FormField label="Atual">
          <Input type="number" name="currentHitPoints" value={formData.currentHitPoints} onChange={handleChange} min="0" className="bg-[#0f1117] border-red-500/30 text-[#f87171] focus-visible:ring-red-500" />
        </FormField>
        <FormField label="Temporário">
          <Input type="number" name="temporaryHitPoints" value={formData.temporaryHitPoints} onChange={handleChange} min="0" className={inputClass} />
        </FormField>
      </div>
    </SectionCard>
    <SectionCard title="Mana + Armadura">
      <div className="grid grid-cols-3 gap-3">
        <FormField label="Mana Máx">
          <Input type="number" name="maxMana" value={formData.maxMana} onChange={handleChange} min="0" className={inputClass} />
        </FormField>
        <FormField label="Mana Atual">
          <Input type="number" name="currentMana" value={formData.currentMana} onChange={handleChange} min="0" className="bg-[#0f1117] border-[#818cf8]/30 text-[#818cf8] focus-visible:ring-[#818cf8]" />
        </FormField>
        <FormField label="CA">
          <Input type="number" name="armorClass" value={formData.armorClass} onChange={handleChange} min="0" className={inputClass} />
        </FormField>
      </div>
    </SectionCard>
  </div>
</TabsContent>
```

- [ ] **Step 3: Verify Info and Atributos tabs**

```bash
pnpm dev
```

Open a character edit page and click "Info" and "Atributos" tabs. Expected: Info shows 2-column form with selects; Atributos shows 6-column attribute grid with colored modifier badges, HP/Mana cards below.

- [ ] **Step 4: Commit**

```bash
git add components/CharacterForm.tsx
git commit -m "feat(web): implement Info and Atributos tabs in CharacterForm"
```

---

## Task 8: CharacterForm — Habilidades + Inventário Tabs

**Files:**
- Modify: `apps/web/components/CharacterForm.tsx`

- [ ] **Step 1: Replace Habilidades tab content**

Find `<TabsContent value="habilidades"` and replace with:
```tsx
<TabsContent value="habilidades" className="mt-0">
  <SectionCard title="Habilidades">
    <div className="space-y-3 mb-4">
      {abilities.map((ability, index) => (
        <div key={index} className="bg-[#0f1117] border border-[#2d2f45] rounded-xl p-4">
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="col-span-2">
              <FormField label="Nome da Habilidade">
                <Input
                  value={ability.name}
                  onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                  placeholder="Ex: Bola de Fogo"
                  className={inputClass}
                />
              </FormField>
            </div>
            <FormField label="Nível">
              <Input type="number" value={ability.level} onChange={(e) => handleAbilityChange(index, 'level', parseInt(e.target.value) || 1)} min="1" max="20" className={inputClass} />
            </FormField>
            <FormField label="Custo Mana">
              <Input type="number" value={ability.cost} onChange={(e) => handleAbilityChange(index, 'cost', parseInt(e.target.value) || 0)} min="0" className={inputClass} />
            </FormField>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <FormField label="Rolagem de Dano">
                <Input value={ability.damage} onChange={(e) => handleAbilityChange(index, 'damage', e.target.value)} placeholder="Ex: 1d6+3, 2d8" className={inputClass} />
              </FormField>
            </div>
            <Button type="button" onClick={() => removeAbility(index)} variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-9">
              Remover
            </Button>
          </div>
        </div>
      ))}
    </div>
    <Button type="button" onClick={addAbility} variant="outline" className="w-full border-dashed border-[#2d2f45] text-[#64748b] hover:text-[#a78bfa] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5">
      + Adicionar Habilidade
    </Button>
  </SectionCard>
</TabsContent>
```

- [ ] **Step 2: Replace Inventário tab content**

Find `<TabsContent value="inventario"` and replace with:
```tsx
<TabsContent value="inventario" className="mt-0 space-y-4">
  {/* Equipment */}
  <SectionCard title="Equipamentos">
    <div className="space-y-3 mb-4">
      {equipment.map((item, index) => (
        <div key={index} className="bg-[#0f1117] border border-[#2d2f45] rounded-xl p-4">
          <div className="grid grid-cols-4 gap-3 items-end">
            <div className="col-span-2">
              <FormField label="Nome do Item">
                <Input value={item.name} onChange={(e) => handleEquipmentChange(index, 'name', e.target.value)} placeholder="Ex: Espada Longa" className={inputClass} />
              </FormField>
            </div>
            <FormField label="Defesa">
              <Input type="number" value={item.defense || 0} onChange={(e) => handleEquipmentChange(index, 'defense', parseInt(e.target.value) || 0)} min="0" className={inputClass} />
            </FormField>
            <FormField label="Ataque">
              <Input type="number" value={item.attack || 0} onChange={(e) => handleEquipmentChange(index, 'attack', parseInt(e.target.value) || 0)} min="0" className={inputClass} />
            </FormField>
          </div>
          <div className="flex justify-end mt-3">
            <Button type="button" onClick={() => removeEquipment(index)} variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
              Remover
            </Button>
          </div>
        </div>
      ))}
    </div>
    <Button type="button" onClick={addEquipment} variant="outline" className="w-full border-dashed border-[#2d2f45] text-[#64748b] hover:text-[#a78bfa] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5">
      + Adicionar Equipamento
    </Button>
  </SectionCard>

  {/* Inventory table */}
  <SectionCard title="Inventário">
    {inventory.length > 0 && (
      <table className="w-full mb-4 text-sm">
        <thead>
          <tr className="border-b border-[#1e2035]">
            <th className="text-left py-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Item</th>
            <th className="text-center py-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest w-20">Qtd</th>
            <th className="text-center py-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest w-20">Máx</th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index} className="border-b border-[#1e2035]/50">
              <td className="py-2 pr-3">
                <Input value={item.name} onChange={(e) => handleInventoryChange(index, 'name', e.target.value)} placeholder="Nome do item" className={cn(inputClass, 'h-8 text-sm')} />
              </td>
              <td className="py-2 px-1">
                <Input type="number" value={item.quantity} onChange={(e) => handleInventoryChange(index, 'quantity', e.target.value)} min="0" max={item.max} className={cn(inputClass, 'h-8 text-sm text-center')} />
              </td>
              <td className="py-2 px-1">
                <Input type="number" value={item.max} onChange={(e) => handleInventoryChange(index, 'max', e.target.value)} min="0" className={cn(inputClass, 'h-8 text-sm text-center')} />
              </td>
              <td className="py-2 pl-1">
                <Button type="button" onClick={() => removeInventoryItem(index)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#475569] hover:text-red-400 hover:bg-red-500/10">
                  ×
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <Button type="button" onClick={addInventoryItem} variant="outline" className="w-full border-dashed border-[#2d2f45] text-[#64748b] hover:text-[#a78bfa] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5">
      + Adicionar Item
    </Button>
  </SectionCard>

  {/* Notes */}
  <SectionCard title="Anotações">
    <textarea
      name="notes"
      value={formData.notes}
      onChange={handleChange}
      rows={6}
      placeholder="Anotações sobre o personagem, história, características especiais..."
      className={cn(inputClass, 'w-full rounded-md border px-3 py-2 text-sm resize-none')}
    />
  </SectionCard>
</TabsContent>
```

- [ ] **Step 3: Verify Habilidades and Inventário tabs**

```bash
pnpm dev
```

Open a character with abilities/inventory. Click "Habilidades" — should show list of abilities with remove buttons and add button. Click "Inventário" — should show equipment list and inventory table.

- [ ] **Step 4: Commit**

```bash
git add components/CharacterForm.tsx
git commit -m "feat(web): implement Habilidades and Inventário tabs in CharacterForm"
```

---

## Task 9: CombatTracker — Combate Tab

**Files:**
- Modify: `apps/web/components/CombatTracker.tsx`
- Modify: `apps/web/components/CharacterForm.tsx` (wire up Combate tab)

- [ ] **Step 1: Replace CombatTracker with Tailwind styles**

Replace the entire `apps/web/components/CombatTracker.tsx`:
```tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { type Character, type CombatStatus, updateCharacter } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CombatTrackerProps {
  character: Character;
  username: string;
  userRole: 'PLAYER' | 'MASTER';
  onUpdate: () => void;
}

export default function CombatTracker({ character, username, userRole, onUpdate }: CombatTrackerProps) {
  const [damage, setDamage] = useState<number>(character.combatStatus?.damage || 0);
  const [debuff, setDebuff] = useState<number>(character.combatStatus?.debuff || 0);
  const [turns, setTurns] = useState<number>(character.combatStatus?.turns || 0);
  const [currentTurn, setCurrentTurn] = useState<number>(character.combatStatus?.currentTurn || 1);
  const debuffTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const turnsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentHP = character.currentHitPoints;
  const defense = character.armorClass;
  const defensiveDamage = damage > 0 ? Math.max(0, currentHP - Math.max(0, damage - defense)) : currentHP;
  const directDamage = damage > 0 ? Math.max(0, currentHP - damage) : currentHP;
  const damageWithDebuff = damage > 0 && debuff > 0
    ? Math.max(0, currentHP - (damage + debuff))
    : damage > 0 ? directDamage : currentHP;

  useEffect(() => {
    const status = character.combatStatus || {};
    setDamage(status.damage || 0);
    setDebuff(status.debuff || 0);
    setTurns(status.turns || 0);
    setCurrentTurn(status.currentTurn || 1);
  }, [character]);

  useEffect(() => {
    return () => {
      if (debuffTimeoutRef.current) clearTimeout(debuffTimeoutRef.current);
      if (turnsTimeoutRef.current) clearTimeout(turnsTimeoutRef.current);
    };
  }, []);

  const applyDefensiveDamage = async () => {
    if (damage <= 0) return;
    const newHP = Math.max(0, currentHP - Math.max(0, damage - defense));
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : turns;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage: 0, debuff: newDebuff, turns: newTurns, currentTurn };
    try {
      await updateCharacter(character.id, username, { currentHitPoints: newHP, combatStatus });
      setDamage(0); setTurns(newTurns); setDebuff(newDebuff); onUpdate();
    } catch (error) { console.error('Erro ao aplicar dano defensível:', error); }
  };

  const applyDirectDamage = async () => {
    if (damage <= 0) return;
    const newHP = Math.max(0, currentHP - damage);
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : turns;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage: 0, debuff: newDebuff, turns: newTurns, currentTurn };
    try {
      await updateCharacter(character.id, username, { currentHitPoints: newHP, combatStatus });
      setDamage(0); setTurns(newTurns); setDebuff(newDebuff); onUpdate();
    } catch (error) { console.error('Erro ao aplicar dano direto:', error); }
  };

  const applyDamageWithDebuff = async () => {
    if (damage <= 0 || debuff <= 0) return;
    const newHP = Math.max(0, currentHP - (damage + debuff));
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : turns;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage: 0, debuff: newDebuff, turns: newTurns, currentTurn };
    try {
      await updateCharacter(character.id, username, { currentHitPoints: newHP, combatStatus });
      setDamage(0); setTurns(newTurns); setDebuff(newDebuff); onUpdate();
    } catch (error) { console.error('Erro ao aplicar dano com debuff:', error); }
  };

  const handleDebuffChange = (newDebuff: number) => {
    setDebuff(newDebuff);
    const newTurns = newDebuff > 0 ? (turns || 1) : 0;
    setTurns(newTurns);
    if (debuffTimeoutRef.current) clearTimeout(debuffTimeoutRef.current);
    debuffTimeoutRef.current = setTimeout(async () => {
      try {
        await updateCharacter(character.id, username, { combatStatus: { damage, debuff: newDebuff, turns: newTurns, currentTurn } });
      } catch (error) { console.error('Erro ao atualizar debuff:', error); }
    }, 800);
  };

  const handleTurnsChange = (newTurns: number) => {
    setTurns(newTurns);
    const newDebuff = newTurns === 0 ? 0 : debuff;
    if (newDebuff !== debuff) setDebuff(newDebuff);
    if (turnsTimeoutRef.current) clearTimeout(turnsTimeoutRef.current);
    turnsTimeoutRef.current = setTimeout(async () => {
      try {
        await updateCharacter(character.id, username, { combatStatus: { damage, debuff: newDebuff, turns: newTurns, currentTurn } });
      } catch (error) { console.error('Erro ao atualizar turnos:', error); }
    }, 800);
  };

  const passTurn = async () => {
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : 0;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage, debuff: newDebuff, turns: newTurns, currentTurn: currentTurn + 1 };
    try {
      await updateCharacter(character.id, username, { combatStatus });
      setTurns(newTurns); setDebuff(newDebuff); setCurrentTurn(currentTurn + 1); onUpdate();
    } catch (error) { console.error('Erro ao passar turno:', error); }
  };

  const clearCombat = async () => {
    const combatStatus: CombatStatus = { damage: 0, debuff: 0, turns: 0, currentTurn: 1 };
    try {
      await updateCharacter(character.id, username, { combatStatus });
      setDamage(0); setDebuff(0); setTurns(0); setCurrentTurn(1); onUpdate();
    } catch (error) { console.error('Erro ao limpar combate:', error); }
  };

  return (
    <div className="space-y-4">
      {/* Turn badge */}
      {turns > 0 && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-lg px-4 py-2.5">
          <span className="text-amber-400 font-semibold text-sm">⚡ Turno {currentTurn}</span>
          <span className="text-amber-600 text-xs">— Debuff ativo por {turns} turno{turns !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Damage calculator */}
      <div className="bg-[#13151f] border border-[#1e2035] rounded-xl p-5">
        <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest mb-4">Calculadora de Dano</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <CombatInput label="Dano" value={damage} onChange={(v) => setDamage(v)} colorClass="border-red-500/40 text-[#f87171]" />
          <CombatInput label="Debuff" value={debuff} onChange={handleDebuffChange} colorClass="border-[#2d2f45] text-[#94a3b8]" />
          <CombatInput label="Turnos" value={turns} onChange={handleTurnsChange} colorClass="border-[#2d2f45] text-[#94a3b8]" />
        </div>

        {/* Calculated results */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Defensivo', value: defensiveDamage, formula: 'HP − (dmg − def)', color: 'text-[#a78bfa] border-[#6366f1]/20' },
            { label: 'Direto', value: directDamage, formula: 'HP − dmg', color: 'text-[#a78bfa] border-[#6366f1]/20' },
            { label: 'c/ Debuff', value: damageWithDebuff, formula: 'HP − (dmg + deb)', color: 'text-[#f87171] border-red-500/20' },
          ].map(({ label, value, formula, color }) => (
            <div key={label} className={cn('bg-[#0f1117] border rounded-lg p-3 text-center', color)}>
              <p className="text-[#475569] text-[10px] mb-1.5">{label}</p>
              <p className={cn('text-lg font-bold', color.split(' ')[0])}>{value}</p>
              <p className="text-[#374151] text-[9px] mt-1">{formula}</p>
            </div>
          ))}
        </div>

        {/* Apply buttons */}
        {damage > 0 && (
          <div className="flex gap-2">
            <Button type="button" onClick={applyDefensiveDamage} variant="outline" size="sm" className="flex-1 border-[#6366f1]/25 text-[#a78bfa] hover:bg-[#6366f1]/10">
              Aplicar Defensivo
            </Button>
            <Button type="button" onClick={applyDirectDamage} variant="outline" size="sm" className="flex-1 border-[#6366f1]/25 text-[#a78bfa] hover:bg-[#6366f1]/10">
              Aplicar Direto
            </Button>
            {debuff > 0 && (
              <Button type="button" onClick={applyDamageWithDebuff} variant="outline" size="sm" className="flex-1 border-red-500/25 text-[#f87171] hover:bg-red-500/10">
                Aplicar c/ Debuff
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-[#13151f] border border-[#1e2035] rounded-xl p-5">
        <p className="text-[10px] font-semibold text-[#475569] uppercase tracking-widest mb-3">Ações</p>
        <div className="flex gap-2">
          {userRole === 'MASTER' && (
            <Button type="button" onClick={passTurn} variant="outline" className="flex-1 border-[#6366f1]/20 text-[#a78bfa] hover:bg-[#6366f1]/10">
              ⚡ Passar Turno
            </Button>
          )}
          <Button type="button" onClick={clearCombat} variant="outline" className="flex-1 border-[#1e2035] text-[#64748b] hover:bg-white/5">
            Limpar Combate
          </Button>
        </div>
      </div>
    </div>
  );
}

function CombatInput({ label, value, onChange, colorClass }: { label: string; value: number; onChange: (v: number) => void; colorClass: string }) {
  return (
    <div>
      <p className="text-[#475569] text-[10px] uppercase tracking-wide mb-1.5">{label}</p>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min="0"
        className={cn(
          'w-full bg-[#0f1117] border rounded-lg text-center text-xl font-bold py-2 outline-none focus:ring-1 focus:ring-[#6366f1] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          colorClass
        )}
      />
    </div>
  );
}
```

- [ ] **Step 2: Wire CombatTracker into the Combate tab**

In `CharacterForm.tsx`, find `<TabsContent value="combate"` and replace the placeholder with:
```tsx
{character && (
  <TabsContent value="combate" className="mt-0">
    {username && userRole && onCombatUpdate ? (
      <CombatTracker
        character={character}
        username={username}
        userRole={userRole}
        onUpdate={onCombatUpdate}
      />
    ) : (
      <p className="text-[#64748b] text-sm">Combate disponível apenas no modo de edição.</p>
    )}
  </TabsContent>
)}
```

- [ ] **Step 3: Delete old CombatTracker CSS module**

```bash
rm apps/web/components/CombatTracker.module.css
```

- [ ] **Step 4: Verify Combate tab**

```bash
pnpm dev
```

Open an existing character and click "Combate" tab. Expected: damage calculator with 3 inputs, 3 result boxes, apply buttons. Pass Turn (Master only) and Limpar Combate buttons visible.

- [ ] **Step 5: Commit**

```bash
git add components/CombatTracker.tsx components/CharacterForm.tsx
git rm components/CombatTracker.module.css
git commit -m "feat(web): migrate CombatTracker as Combate tab with dark modern styles"
```

---

## Task 10: Update Edit + New Character Pages

**Files:**
- Modify: `apps/web/app/(app)/characters/[id]/page.tsx`
- Modify: `apps/web/app/(app)/characters/new/page.tsx`

- [ ] **Step 1: Update edit page to pass new props + toast**

Replace `apps/web/app/(app)/characters/[id]/page.tsx`:
```tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, updateCharacter, type Character } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';
import { toast } from 'sonner';

export default function EditCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    const savedRole = localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER';
    if (!savedUsername) { router.push('/'); return; }
    setUsername(savedUsername);
    setUserRole(savedRole || 'PLAYER');
    loadCharacter(savedUsername);
  }, [router, params.id]);

  const loadCharacter = async (user: string) => {
    try {
      setLoading(true);
      const data = await getCharacter(params.id as string, user);
      setCharacter(data);
    } catch {
      toast.error('Erro ao carregar personagem. Verifique suas permissões.');
      router.push('/characters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (characterData: Partial<Character>) => {
    try {
      await updateCharacter(params.id as string, username, characterData);
      toast.success('Personagem salvo!');
      router.push('/characters');
    } catch {
      toast.error('Erro ao salvar personagem. Tente novamente.');
    }
  };

  const handleCombatUpdate = async () => {
    try {
      const data = await getCharacter(params.id as string, username);
      setCharacter(data);
    } catch {
      console.error('Erro ao recarregar personagem');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-[#64748b]">Carregando...</div>;
  }

  if (!character) {
    return <div className="flex items-center justify-center h-full text-[#64748b]">Personagem não encontrado</div>;
  }

  return (
    <CharacterForm
      character={character}
      onSubmit={handleSubmit}
      username={username}
      userRole={userRole}
      onCombatUpdate={handleCombatUpdate}
    />
  );
}
```

- [ ] **Step 2: Update new character page**

Replace `apps/web/app/(app)/characters/new/page.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter, type Character } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';
import { toast } from 'sonner';

export default function NewCharacterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rpg_username');
    if (!saved) { router.push('/'); return; }
    setUsername(saved);
  }, [router]);

  const handleSubmit = async (characterData: Partial<Character>) => {
    try {
      await createCharacter(username, characterData);
      toast.success('Personagem criado!');
      router.push('/characters');
    } catch {
      toast.error('Erro ao criar personagem. Tente novamente.');
    }
  };

  if (!username) return null;

  return <CharacterForm onSubmit={handleSubmit} />;
}
```

- [ ] **Step 3: Verify create and edit flows**

```bash
pnpm dev
```

1. Create a new character → toast "Personagem criado!" appears
2. Edit a character → form with tabs, save → toast "Personagem salvo!" appears
3. Combate tab only visible on edit page, not on create page

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/characters/\[id\]/page.tsx app/\(app\)/characters/new/page.tsx
git commit -m "feat(web): update edit and new pages with toast feedback"
```

---

## Task 11: Delete Remaining CSS Modules + Final Cleanup

**Files:**
- Delete: `apps/web/components/CharacterForm.module.css`

- [ ] **Step 1: Delete CharacterForm CSS module**

```bash
rm apps/web/components/CharacterForm.module.css
```

- [ ] **Step 2: Verify no remaining CSS module imports**

```bash
grep -r "module.css" apps/web/
```

Expected: No output (zero results).

- [ ] **Step 3: Run full dev check**

```bash
pnpm dev
```

Walk through the full app:
1. Login page — dark card, gradient button
2. `/characters` — sidebar visible, character cards with stats
3. Create character — tabs: Info, Atributos, Habilidades, Inventário (no Combate tab)
4. Edit character — all 5 tabs including Combate
5. Delete character — AlertDialog appears, toast on confirm
6. Save character — toast "Personagem salvo!"

- [ ] **Step 4: Check for TypeScript errors**

```bash
pnpm typecheck
```

Expected: No TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git rm components/CharacterForm.module.css
git commit -m "chore(web): remove all legacy CSS module files"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] `pnpm dev` starts without errors
- [ ] Login page has no sidebar, renders dark card with gradient logo and button
- [ ] `/characters` shows sidebar with sword logo + Users icon
- [ ] Character cards show HP/CA/MP stat pills and gradient top bar
- [ ] Delete character shows AlertDialog (not `window.confirm`)
- [ ] Delete and save actions show toast notifications
- [ ] Character form has sticky header with stat pills visible on all tabs
- [ ] Info tab: 2-column form with selects for race/class/alignment
- [ ] Atributos tab: 6-column attribute grid with colored modifier badges
- [ ] Habilidades tab: ability list with add/remove
- [ ] Inventário tab: equipment list + inventory table + notes
- [ ] Combate tab: only on edit page, damage calculator works correctly
- [ ] URL `?tab=atributos` persists the active tab on page refresh
- [ ] `pnpm typecheck` passes with zero errors
- [ ] Zero `module.css` imports remain in the codebase
