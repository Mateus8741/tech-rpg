---
title: "Action card icons come from game-icons.net, not Baldur's Gate 3"
author: Matt8741
date: 2026-11-08
branch: main
cost: { minutes: 4, tokens: 94208 }
touches:
  - apps/web/components/sheet/ActionIcon.tsx
  - apps/web/components/sheet/ActionsTab.tsx
---

## Decided
- Card icons in `apps/web/components/sheet/ActionIcon.tsx` use game-icons.net SVGs (CC BY 3.0, Lorc/Delapouite/sbed), inlined as path strings in `action-icon-paths.ts`. The BG3 look comes from the frame: section-colored border, dark radial glow and a cream-to-color gradient fill.
- `iconFor(card)` picks by entry kind: COMBAT_ICONS by action id, WEAPON_ICONS/SPELL_ICONS by regex over normalized name/description, FEATURE_ICONS by normalized feature name, else `beveled-star`.
## Tried and ruled out
- The real Baldur's Gate 3 action icons, which the user asked for first: they are Larian's copyrighted art and the repo is public on GitHub, so shipping them is redistribution.
## Watch out
- To add an icon, take the SVG from github.com/game-icons/icons, drop the `M0 0h512v512H0z` background path and add the remaining `d` to `ICON_PATHS`.
