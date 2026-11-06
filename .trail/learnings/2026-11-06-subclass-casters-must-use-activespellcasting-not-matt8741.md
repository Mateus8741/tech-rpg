---
title: "Subclass casters must use activeSpellcasting, not cls.spellcasting"
author: Matt8741
date: 2026-11-06
branch: feat/action-cards-smart-search
cost: { minutes: 20, tokens: 273623 }
touches:
  - packages/rules/src/combat-actions.ts
  - packages/rules/src/index.ts
  - apps/web/lib/sheet.ts
  - apps/web/components/sheet/SpellsTab.tsx
  - apps/web/components/entries/types.ts
  - apps/web/components/entries/resolve.ts
  - apps/web/components/entries/EntryDrawer.tsx
  - apps/web/components/entries/EntryProvider.tsx
  - apps/web/components/entries/index.ts
  - apps/web/app/(app)/layout.tsx
---

## Decided
- Spellcasting granted by a subclass (trapaceiro-arcano, cavaleiro-arcano) must be read through `activeSpellcasting` in `apps/web/lib/sheet.ts`, never `cls.spellcasting` directly: reading the class alone made Ladino show as a non-caster in `SpellsTab.tsx` and `derivedStats`. These archetypes use the mago list, via `spellListClassId`.
- `featureActionCost` in `packages/rules/src/combat-actions.ts` must be called with the feature name: the regex misclassifies some features, so `FEATURE_COST_OVERRIDES` corrects them by name.
## Watch out
- Test the UI against a mock API, because `apps/api/.env` may point at a real database. Text in `packages/rules/src/data` added from the PDFs is written in our own words, not copied.
