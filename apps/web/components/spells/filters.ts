import type { Spell } from '@repo/rules';
import { normalizeText } from './spell-utils';

export type SpellComponent = 'v' | 's' | 'm';

export interface SpellFilterState {
  q: string;
  concentration: boolean;
  ritual: boolean;
  components: Set<SpellComponent>;
  schools: Set<string>;
  levels: Set<number>;
  favorites: boolean;
}

export const emptyFilters = (): SpellFilterState => ({
  q: '', concentration: false, ritual: false, components: new Set(), schools: new Set(), levels: new Set(), favorites: false,
});

export function toggleSet<T>(set: Set<T>, v: T): Set<T> {
  const n = new Set(set);
  if (n.has(v)) n.delete(v); else n.add(v);
  return n;
}

/** Aplica os filtros comuns (busca, concentração, ritual, componentes, escola, nível, favoritas). */
export function matchesFilters(s: Spell, f: SpellFilterState, favorites: readonly string[]): boolean {
  if (f.q && !normalizeText(s.name).includes(normalizeText(f.q.trim()))) return false;
  if (f.concentration && !s.concentration) return false;
  if (f.ritual && !s.ritual) return false;
  for (const c of f.components) {
    if (c === 'm' ? !s.components.m : !s.components[c]) return false;
  }
  if (f.schools.size && !f.schools.has(s.school)) return false;
  if (f.levels.size && !f.levels.has(s.level)) return false;
  if (f.favorites && !favorites.includes(s.id)) return false;
  return true;
}

export const filtersActive = (f: SpellFilterState) =>
  (f.q ? 1 : 0) + (f.concentration ? 1 : 0) + (f.ritual ? 1 : 0) + f.components.size + f.schools.size + f.levels.size + (f.favorites ? 1 : 0);

/* ---------- Dano / cura a partir da descrição ---------- */

export interface SpellRoll { expr: string; kind: 'dano' | 'cura' }

const DICE = /(\d+)d(\d+)(?:\s*\+\s*(\d+))?/i;

/** Procura a 1ª expressão de dados na descrição; em níveis superiores soma os dados extras. */
export function spellRollFor(s: Spell, castLevel: number): SpellRoll | null {
  const m = s.description.match(DICE);
  if (!m) return null;
  let n = Number(m[1]);
  const sides = Number(m[2]);
  const flat = m[3] ? Number(m[3]) : 0;
  const near = s.description.slice(Math.max(0, (m.index ?? 0) - 80), (m.index ?? 0) + 120).toLowerCase();
  const heal = /cura|recupera|pontos de vida/.test(near) && !/dano/.test(near);
  if (!heal && !/dano/.test(s.description.toLowerCase())) return null;
  if (s.level > 0 && castLevel > s.level && s.atHigherLevels) {
    const up = s.atHigherLevels.match(/(\d+)d(\d+)/i);
    if (up && Number(up[2]) === sides) n += Number(up[1]) * (castLevel - s.level);
  }
  return { expr: `${n}d${sides}${flat ? `+${flat}` : ''}`, kind: heal ? 'cura' : 'dano' };
}
