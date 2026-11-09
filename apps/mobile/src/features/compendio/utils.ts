import { ABILITIES, SKILLS, type AbilityKey } from '@repo/rules';

/** Normaliza para busca sem acentos e sem diferenciar maiúsculas. */
export function norm(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** true se `query` (normalizada) aparece em algum dos textos. */
export function matches(query: string, ...texts: (string | undefined)[]): boolean {
  const q = norm(query);
  if (!q) return true;
  return norm(texts.filter(Boolean).join(' ')).includes(q);
}

export const abilityAbbr = (k: AbilityKey) => ABILITIES.find((a) => a.key === k)?.abbr ?? k;
export const abilityName = (k: AbilityKey) => ABILITIES.find((a) => a.key === k)?.name ?? k;
export const skillName = (k: string) => SKILLS.find((s) => s.key === k)?.name ?? k;

export function bonusLabels(b: Partial<Record<AbilityKey, number>>): string[] {
  return Object.entries(b).map(([k, v]) => `${abilityAbbr(k as AbilityKey)} ${v! >= 0 ? '+' : ''}${v}`);
}

export const SPELLCASTING_KIND: Record<string, string> = {
  full: 'Completo',
  half: 'Meio-conjurador',
  third: 'Um terço',
  pact: 'Pacto',
};
