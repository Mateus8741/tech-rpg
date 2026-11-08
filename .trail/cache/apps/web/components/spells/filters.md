# apps/web/components/spells/filters.ts

- SpellComponent · type · L4-L4 — type SpellComponent = 'v' | 's' | 'm';
- SpellFilterState · interface · L6-L14 — interface SpellFilterState
- emptyFilters · function · L16-L18 — emptyFilters = (): SpellFilterState
- toggleSet · function · L20-L24 — function toggleSet<T>(set: Set<T>, v: T): Set<T>
- matchesFilters · function · L27-L38 — function matchesFilters(s: Spell, f: SpellFilterState, favorites: readonly string[]): boolean
- filtersActive · function · L40-L41 — filtersActive = (f: SpellFilterState)
- SpellRoll · interface · L45-L45 — interface SpellRoll
- spellRollFor · function · L50-L64 — function spellRollFor(s: Spell, castLevel: number): SpellRoll | null
