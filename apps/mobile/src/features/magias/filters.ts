// Filtros e agrupamento da lista de magias (espelha o SpellBrowser do app web). Puro: sem React.
import { CLASSES, SPELLS, type Spell, type SpellSchool } from '@repo/rules';

import { parseQuery, scoreSpell } from './search';

export const SPELL_SCHOOLS: SpellSchool[] = [
  'Abjuração', 'Conjuração', 'Adivinhação', 'Encantamento',
  'Evocação', 'Ilusão', 'Necromancia', 'Transmutação',
];

export const SPELL_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Classes que têm alguma magia na lista. */
export const SPELLCASTER_CLASSES = CLASSES.filter((c) => SPELLS.some((s) => s.classes.includes(c.id))).map((c) => ({
  id: c.id,
  name: c.name,
}));

const CLASS_NAME: Record<string, string> = Object.fromEntries(CLASSES.map((c) => [c.id, c.name]));
export const className = (id: string) => CLASS_NAME[id] ?? id;

export const spellLevelLabel = (level: number) => (level === 0 ? 'Truque' : `${level}º círculo`);
export const spellLevelShort = (level: number) => (level === 0 ? 'Truque' : `${level}º`);

/** "Evocação de 3º círculo" / "Truque de evocação". */
export const spellLevelSchool = (s: Pick<Spell, 'level' | 'school'>) =>
  s.level === 0 ? `Truque de ${s.school.toLowerCase()}` : `${s.school} de ${s.level}º círculo`;

export function spellComponentsLabel(c: Spell['components']): string {
  const parts: string[] = [];
  if (c.v) parts.push('V');
  if (c.s) parts.push('S');
  if (c.m) parts.push('M');
  return parts.join(', ');
}

export interface SpellFilters {
  q: string;
  levels: ReadonlySet<number>;
  schools: ReadonlySet<SpellSchool>;
  classes: ReadonlySet<string>;
  concentration: boolean;
  ritual: boolean;
}

export const emptyFilters = (): SpellFilters => ({
  q: '', levels: new Set(), schools: new Set(), classes: new Set(), concentration: false, ritual: false,
});

export function toggleSet<T>(set: ReadonlySet<T>, v: T): Set<T> {
  const n = new Set(set);
  if (n.has(v)) n.delete(v);
  else n.add(v);
  return n;
}

export const activeFilterCount = (f: SpellFilters) =>
  f.levels.size + f.schools.size + f.classes.size + (f.concentration ? 1 : 0) + (f.ritual ? 1 : 0);

const byName = (a: Spell, b: Spell) => a.name.localeCompare(b.name, 'pt-BR');

/**
 * Aplica busca + filtros. Com palavras na busca, ordena por relevância; senão, por nome.
 * Mesmo comportamento do SpellBrowser web (classe: qualquer uma das selecionadas).
 */
export function filterSpells(spells: readonly Spell[], f: SpellFilters): Spell[] {
  const pq = parseQuery(f.q);
  const scores = new Map<string, number>();
  const list = spells.filter((s) => {
    const score = scoreSpell(s, pq);
    if (score < 0) return false;
    if (f.classes.size && !s.classes.some((c) => f.classes.has(c))) return false;
    if (f.levels.size && !f.levels.has(s.level)) return false;
    if (f.schools.size && !f.schools.has(s.school)) return false;
    if (f.concentration && !s.concentration) return false;
    if (f.ritual && !s.ritual) return false;
    scores.set(s.id, score);
    return true;
  });
  if (pq.terms.length) list.sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || byName(a, b));
  else list.sort(byName);
  return list;
}

export interface SpellSection {
  level: number;
  title: string;
  data: Spell[];
}

/** Agrupa por círculo (Truque primeiro), mantendo a ordem interna de cada grupo. */
export function groupByLevel(spells: readonly Spell[]): SpellSection[] {
  const buckets = new Map<number, Spell[]>();
  for (const s of spells) {
    const b = buckets.get(s.level);
    if (b) b.push(s);
    else buckets.set(s.level, [s]);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([level, data]) => ({ level, title: level === 0 ? 'Truques' : `${level}º círculo`, data }));
}

export const getSpellById = (id: string | undefined) => (id ? SPELLS.find((s) => s.id === id) : undefined);
