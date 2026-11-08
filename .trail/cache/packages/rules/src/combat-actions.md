# packages/rules/src/combat-actions.ts

- ActionCost · type · L5-L5 — type ActionCost = "acao" | "bonus" | "reacao" | "livre" | "outro" | "passivo";
- CombatAction · interface · L16-L22 — interface CombatAction
- norm · function · L43-L43 — norm = (s: string)
- spellActionCost · function · L46-L52 — function spellActionCost(spell: Pick<Spell, "castingTime">): ActionCost
- featureActionCost · function · L93-L101 — function featureActionCost(description: string, name?: string): ActionCost
