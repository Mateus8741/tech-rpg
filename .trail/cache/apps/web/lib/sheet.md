# apps/web/lib/sheet.ts

- ResourceDef · interface · L10-L16 — interface ResourceDef
- Coins · interface · L18-L18 — interface Coins
- SheetData · interface · L20-L49 — interface SheetData
- emptySheet · function · L51-L62 — emptySheet = (): SheetData
- getSheet · function · L64-L65 — getSheet = (c: Pick<Character, "customData">): SheetData
- scoreOf · function · L70-L70 — scoreOf = (c: Character, k: AbilityKey)
- activeSpellcasting · function · L77-L82 — function activeSpellcasting(sheet: Pick<SheetData, "classId" | "subclassId">, level: number): SpellcastingInfo | undefined
- spellListClassId · function · L85-L86 — spellListClassId = (sheet: Pick<SheetData, "classId">)
- derivedStats · function · L88-L112 — function derivedStats(c: Character)
- mod · function · L91-L91 — mod = (k: AbilityKey)
