# apps/web/components/sheet/action-cards.ts

- CardSection · type · L14-L14 — type CardSection = 'acao' | 'bonus' | 'reacao' | 'truque' | 'outro';
- TurnSlot · type · L16-L16 — type TurnSlot = 'acao' | 'bonus' | 'reacao';
- DamageRoll · interface · L26-L26 — interface DamageRoll
- ActionCard · interface · L28-L41 — interface ActionCard
- asSlot · function · L43-L43 — asSlot = (cost: ActionCost): TurnSlot | null
- turnSlot · function · L44-L44 — turnSlot = (card: ActionCard)
- sectionOf · function · L46-L46 — sectionOf = (cost: ActionCost): CardSection
- firstSentence · function · L49-L54 — function firstSentence(text: string, max = 120): string
- fmtMod · function · L61-L61 — fmtMod = (n: number)
- weaponCard · function · L65-L92 — function weaponCard(c: Character, sheet: SheetData, w: Weapon, attackBonus: number, key: string): ActionCard
- cantripTier · function · L101-L101 — cantripTier = (level: number)
- spellDamage · function · L103-L110 — function spellDamage(s: Spell, level: number): DamageRoll | null
- spellCard · function · L112-L137 — function spellCard(c: Character, s: Spell): ActionCard
- buildActionCards · function · L141-L190 — function buildActionCards(c: Character): ActionCard[]
- pushTrait · function · L151-L158 — pushTrait = (key: string, name: string, description: string, source: string, entry: EntryRef)
- cardScore · function · L196-L202 — function cardScore(card: ActionCard, pq: ParsedQuery): number
- attackDisadvantage · function · L205-L211 — function attackDisadvantage(sheet: SheetData): string[]
- lowestSlot · function · L214-L220 — function lowestSlot(spellLevel: number, slots: number[], used: number[]): number | null
