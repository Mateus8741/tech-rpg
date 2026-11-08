# apps/web/lib/sheet.ts

- ResourceDef · interface · L10-L16 — interface ResourceDef
- Coins · interface · L18-L18 — interface Coins
- SheetData · interface · L20-L48 — interface SheetData
- emptySheet · function · L50-L61 — emptySheet = (): SheetData
- getSheet · function · L63-L64 — getSheet = (c: Pick<Character, "customData">): SheetData
- scoreOf · function · L69-L69 — scoreOf = (c: Character, k: AbilityKey)
- activeSpellcasting · function · L76-L81 — function activeSpellcasting(sheet: Pick<SheetData, "classId" | "subclassId">, level: number): SpellcastingInfo | undefined
- spellListClassId · function · L84-L85 — spellListClassId = (sheet: Pick<SheetData, "classId">)
- derivedStats · function · L87-L111 — function derivedStats(c: Character)
- mod · function · L90-L90 — mod = (k: AbilityKey)
