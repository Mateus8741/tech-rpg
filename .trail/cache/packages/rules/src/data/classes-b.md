# packages/rules/src/data/classes-b.ts

- SubclassSpellcasting · type · L6-L9 — type SubclassSpellcasting = SpellcastingInfo & { /** Índice 0 = nível 1 da classe; cada item = espaços de magia de 1º ao Nº nível. */ spellSlots: number[][]; };
- CasterSubclass · type · L10-L10 — type CasterSubclass = Subclass & { spellcasting: SubclassSpellcasting };
- asi · function · L15-L19 — asi = (level: number, text: string = ASI_TEXT): ClassFeature
- instruida · function · L449-L453 — instruida = (escola: string, nome: string): ClassFeature
