# UI/UX Redesign — RPG Character Manager

**Date:** 2026-03-28
**Status:** Approved

---

## Context

The current web app (`apps/web`) uses plain CSS Modules with no component library. The visual design is functional but dated — inconsistent spacing, heavy emoji usage, a very long scrollable character form, and no real design language. The user wants a full modern redesign: dark, premium, comparable to Steam or Discord in aesthetic quality.

All designs were approved interactively via visual mockups.

---

## Design Decisions

| Topic | Decision |
|---|---|
| Aesthetic | Dark & Modern — `#0f1117` background, violet/indigo accent (`#6366f1` → `#8b5cf6`) |
| Navigation | Sidebar 60px with SVG icons (Lucide), always visible |
| Character form | Tabbed layout: Info, Atributos, Habilidades, Inventário, Combate |
| Tech stack | Migrate to **Tailwind CSS + shadcn/ui** (replaces all CSS Modules) |
| Icons | **Lucide React** (bundled with shadcn) — replaces emoji usage |
| Feedback | Toast notifications (shadcn `<Sonner>`) for save/error states |

---

## Color Tokens

```
Background root:    #0f1117
Background card:    #13151f
Background subtle:  #0a0c14
Border default:     #1e2035
Border strong:      #2d2f45

Accent primary:     #6366f1 (indigo)
Accent secondary:   #8b5cf6 (violet)
Accent gradient:    linear-gradient(135deg, #6366f1, #8b5cf6)

Text primary:       #e2e8f0
Text secondary:     #94a3b8
Text muted:         #475569
Text disabled:      #64748b

HP / danger:        #f87171 (bg: rgba(239,68,68,0.12), border: rgba(239,68,68,0.25))
Mana / info:        #818cf8 (bg: rgba(129,140,248,0.12))
XP / warning:       #fbbf24 (bg: rgba(251,191,36,0.12))
CA / neutral:       #94a3b8
```

---

## App Shell

**Route structure (Next.js App Router groups):**
```
app/
  layout.tsx           → minimal root (html/body, fonts, Toaster)
  page.tsx             → Login (no sidebar)
  (app)/
    layout.tsx         → Shell layout WITH sidebar (wraps authenticated pages)
    characters/
      page.tsx
      new/page.tsx
      [id]/page.tsx
```

The sidebar lives in `app/(app)/layout.tsx` so login stays standalone.

**Sidebar (`app/(app)/layout.tsx`):**
- `w-[60px]`, fixed left, `bg-[#0a0c14]`, `border-r border-[#1e2035]`
- Contains: logo icon (gradient square), nav icon buttons, user avatar at bottom
- Active nav item: `bg-accent/15 border border-accent/30 rounded-xl`
- Main area: `flex-1 flex flex-col`
- Top bar per page: `h-[52px] border-b`, page title + primary action button

**Nav items (sidebar):**
- Personagens → `Users` icon (Lucide)
- (future) Combate rápido → `Swords` icon

---

## Login Page

**File:** `apps/web/app/page.tsx` + `page.module.css` → migrate to Tailwind

- Full-screen centered card (`max-w-sm`)
- Dark card: `bg-[#13151f] border border-[#1e2035] rounded-2xl`
- Logo: gradient icon `⚔️` or Lucide `Sword`
- Inputs: shadcn `<Input>` with dark variant
- Role select: shadcn `<Select>`
- Submit: gradient button full-width
- No sidebar on login page (standalone)

---

## Characters List Page

**File:** `apps/web/app/characters/page.tsx`

- Grid layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Each character card (`bg-[#13151f] border border-[#1e2035] rounded-xl`):
  - Colored top accent bar (3px, gradient) — same color for all initially, can vary by class later
  - Character name + race/class subtitle
  - Level badge: `bg-accent/15 text-accent border border-accent/30 rounded-full`
  - Stats row: HP, CA, Mana — each in a mini pill `bg-[#0f1117] border rounded-lg`
  - Action buttons: "Editar" (ghost violet) + "Excluir" (ghost red)
- Empty state: dashed border card with `+` icon + "Criar personagem"
- Master view: shows owner badge on cards belonging to other players
- Top bar: page title + "Novo Personagem" button (gradient)

---

## Character Form — Tabbed

**File:** `apps/web/components/CharacterForm.tsx` + `CharacterForm.module.css` → migrate

**Header (always visible, sticky):**
- Character name + race/class/level subtitle
- "← Voltar" link
- Stat pills: HP current/max, CA, Mana current/max, XP
- Tab bar: Info | Atributos | Habilidades | Inventário | Combate
- "Salvar" button (gradient, top-right)

**Tab: Info**
- 2-column grid: Nome, Raça, Classe, Nível, Alinhamento, Antecedente
- All using shadcn `<Input>` and `<Select>` components

**Tab: Atributos**
- 6-column grid of attribute boxes (FOR, DES, CON, INT, SAB, CAR)
- Each box: label, number input, modifier badge (colored: violet=positive, red=negative, gray=zero)
- Below: HP card (Máximo / Atual / Temporário) + Mana card (Máximo / Atual) — 2-column grid

**Tab: Habilidades**
- List of abilities: name, mana cost, damage
- "Adicionar habilidade" button (ghost)
- Each item: inline row with delete button

**Tab: Inventário**
- Table: Item | Quantidade | Máx — shadcn `<Table>`
- Equipment sub-section: armor (name, DEF) + weapons (name, ATK) as list items
- "Adicionar" buttons for each section

**Tab: Combate** *(replaces CombatTracker component inline)*
- Only shown on edit page (`/characters/[id]`), not on create page (`/characters/new`)
- See combat section below

---

## Combat Tracker (Tab: Combate)

**File:** `apps/web/components/CombatTracker.tsx` + `CombatTracker.module.css` → migrate

Rendered as the "Combate" tab within the character form. Tab label turns red when active.

**Layout:** 2-column grid

**Damage Calculator (full-width card):**
- 3 inputs: Dano (red border), Debuff, Turnos
- 3 calculated result boxes side by side: Defensivo / Direto / c/ Debuff
  - Defensivo/Direto: violet text; c/ Debuff: red text
  - Formula shown below each value in muted text
- 3 "Aplicar" buttons matching each mode

**Active Debuffs card:**
- Shows debuff value + remaining turns badge
- Empty state: dashed card "Sem debuffs ativos"

**Actions card (Master-only for "Passar Turno"):**
- Turn badge in header (amber, `⚡ Turno N`)
- "Passar Turno" button (violet ghost) — only for MASTER role
- "Limpar Combate" button (gray ghost)

---

## Technical Migration Plan

### Dependencies to add
```bash
# Tailwind CSS
pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/typography

# shadcn/ui init (interactive)
pnpm dlx shadcn@latest init

# Components to install via shadcn CLI
# Input, Select, Button, Tabs, Table, Badge, Sonner (toast), Separator, Card
```

### Files to migrate (delete CSS Modules after)
| CSS Module | Target |
|---|---|
| `app/globals.css` | Tailwind base + custom CSS vars |
| `app/page.module.css` | Inline Tailwind classes |
| `app/characters/page.module.css` | Inline Tailwind classes |
| `components/CharacterForm.module.css` | Inline Tailwind classes |
| `components/CombatTracker.module.css` | Merged into CharacterForm tabs |

### shadcn theme config (components.json)
```json
{
  "style": "default",
  "tailwind": { "baseColor": "violet", "cssVariables": true },
  "aliases": { "components": "@/components/ui" }
}
```

---

## UX Improvements (beyond visual)

1. **Toast notifications** — replace silent saves with `toast.success("Personagem salvo!")` / `toast.error(...)`
2. **Loading state on save** — button shows spinner + "Salvando..." text, disabled during request
3. **Confirm dialog on delete** — shadcn `<AlertDialog>` before deleting a character
4. **Tab persistence** — remember last active tab per character (localStorage or URL param `?tab=atributos`)
5. **Modifier auto-calc** — modifier badge updates live as user types the attribute value (already works, keep behavior)

---

## Out of Scope

- Dark/light mode toggle (app stays dark-only)
- Mobile-specific layout (responsive grid is sufficient)
- New features (spells, skills, proficiencies tabs — not in current model)
- Animation/transitions (can be added incrementally)

---

## Verification

1. `pnpm dev` starts without errors
2. Login page renders with dark card, no CSS Module styles
3. Character list shows grid with new card design
4. Character form shows tabbed layout with sticky header
5. Each tab renders correct content
6. Combat tracker works within Combate tab (damage calculations correct)
7. Save shows toast notification
8. Delete shows confirm dialog
9. No console errors, no TypeScript errors (`pnpm typecheck`)
