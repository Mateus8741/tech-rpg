# apps/web/components/sheet/action-cards.ts

- CardSection · type · L13-L13 — type CardSection = 'acao' | 'bonus' | 'reacao' | 'truque' | 'outro';
- TurnSlot · type · L15-L15 — type TurnSlot = 'acao' | 'bonus' | 'reacao';
- DamageRoll · interface · L25-L25 — interface DamageRoll
- ActionCard · interface · L27-L40 — interface ActionCard
- asSlot · function · L42-L42 — asSlot = (cost: ActionCost): TurnSlot | null
- turnSlot · function · L43-L43 — turnSlot = (card: ActionCard)
- sectionOf · function · L45-L45 — sectionOf = (cost: ActionCost): CardSection
- firstSentence · function · L48-L53 — function firstSentence(text: string, max = 120): string
- fmtMod · function · L60-L60 — fmtMod = (n: number)
- weaponCard · function · L64-L91 — function weaponCard(c: Character, sheet: SheetData, w: Weapon, attackBonus: number, key: string): ActionCard
- cantripTier · function · L100-L100 — cantripTier = (level: number)
- spellDamage · function · L102-L109 — function spellDamage(s: Spell, level: number): DamageRoll | null
- spellCard · function · L111-L136 — function spellCard(c: Character, s: Spell): ActionCard
- buildActionCards · function · L140-L189 — function buildActionCards(c: Character): ActionCard[]
- pushTrait · function · L150-L157 — pushTrait = (key: string, name: string, description: string, source: string, entry: EntryRef)
- cardMatches · function · L191-L192 — cardMatches = (card: ActionCard, q: string)
- attackDisadvantage · function · L195-L201 — function attackDisadvantage(sheet: SheetData): string[]
- lowestSlot · function · L204-L210 — function lowestSlot(spellLevel: number, slots: number[], used: number[]): number | null
