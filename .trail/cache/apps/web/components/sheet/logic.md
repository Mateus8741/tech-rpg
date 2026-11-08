# apps/web/components/sheet/logic.ts

- hitDieAverage · function · L6-L6 — hitDieAverage = (die: number)
- hitDiceLeft · function · L9-L9 — hitDiceLeft = (c: Character, sheet: SheetData)
- canLevelUp · function · L11-L13 — function canLevelUp(c: Character)
- levelUpPatch · function · L16-L25 — function levelUpPatch(c: Character): Partial<Character>
- applyDamage · function · L28-L35 — function applyDamage(c: Character, amount: number): Partial<Character>
- applyHealing · function · L37-L39 — function applyHealing(c: Character, amount: number): Partial<Character>
- spendHitDie · function · L41-L47 — function spendHitDie(c: Character, sheet: SheetData)
- longRestPatch · function · L49-L63 — function longRestPatch(c: Character, sheet: SheetData)
- pactSlots · function · L66-L72 — function pactSlots(level: number): number[]
- preparedLimit · function · L74-L79 — function preparedLimit(cls: ClassDef | undefined, level: number, abilityMod: number)
- AcBreakdown · interface · L81-L81 — interface AcBreakdown
- computeArmorClass · function · L84-L118 — function computeArmorClass(c: Character, classId: string): AcBreakdown
