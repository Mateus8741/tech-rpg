# apps/web/lib/character-io.ts

- ExportedCharacter · type · L8-L8 — type ExportedCharacter = Partial<Omit<Character, (typeof OMIT)[number]>>;
- CharacterExport · interface · L10-L15 — interface CharacterExport
- exportCharacter · function · L17-L21 — function exportCharacter(c: Character): CharacterExport
- exportFileName · function · L24-L25 — exportFileName = (c: Pick<Character, "name">)
- isObj · function · L37-L37 — isObj = (v: unknown): v is Record<string, unknown>
- ParseResult · type · L39-L39 — type ParseResult = { ok: true; character: ExportedCharacter } | { ok: false; error: string };
- parseCharacterFile · function · L42-L84 — function parseCharacterFile(text: string): ParseResult
