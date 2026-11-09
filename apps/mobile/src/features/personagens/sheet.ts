// Porte enxuto de apps/web/lib/sheet.ts: dados de ficha em Character.customData.sheet
// e estatísticas derivadas. Conjuração SEMPRE via activeSpellcasting (subclasses conjuradoras).
import {
  ABILITIES, SKILLS, CLASSES, abilityModifier, getClass, getRace, getSpell, proficiencyBonus, spellSlotsFor,
  type AbilityKey, type SkillKey, type Spell, type SpellcastingInfo, type Subclass,
} from '@repo/rules';

import type { Character } from '@/lib/api';

export interface SheetData {
  raceId: string;
  subraceId?: string;
  classId: string;
  subclassId?: string;
  backgroundId: string;
  skillProficiencies: SkillKey[];
  skillExpertise: SkillKey[];
  savingThrowProficiencies: AbilityKey[];
  spellsKnown: string[];
  spellsPrepared: string[];
  spellSlotsUsed: number[];
  chosenFeatures: string[];
  personality: { traits: string; ideals: string; bonds: string; flaws: string };
  appearance: string;
  backstory: string;
  [key: string]: unknown;
}

export const emptySheet = (): SheetData => ({
  raceId: '', classId: '', backgroundId: '',
  skillProficiencies: [], skillExpertise: [], savingThrowProficiencies: [],
  spellsKnown: [], spellsPrepared: [], spellSlotsUsed: [], chosenFeatures: [],
  personality: { traits: '', ideals: '', bonds: '', flaws: '' },
  appearance: '', backstory: '',
});

export const getSheet = (c: Pick<Character, 'customData'>): SheetData =>
  ({ ...emptySheet(), ...((c.customData as { sheet?: Partial<SheetData> } | undefined)?.sheet ?? {}) }) as SheetData;

/** Patch de colunas que atualiza campos de customData.sheet preservando o resto. */
export function sheetPatch(c: Character, partial: Partial<SheetData>): Partial<Character> {
  return { customData: { ...(c.customData ?? {}), sheet: { ...getSheet(c), ...partial } } };
}

export const SCORE_FIELDS: Record<AbilityKey, 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'> = {
  str: 'strength', dex: 'dexterity', con: 'constitution', int: 'intelligence', wis: 'wisdom', cha: 'charisma',
};
export const scoreOf = (c: Character, k: AbilityKey) => c[SCORE_FIELDS[k]] ?? 10;

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Id da classe: da ficha nova ou, em fichas antigas, casando pelo nome. */
export function classIdOf(c: Character): string {
  const sid = getSheet(c).classId;
  if (sid) return sid;
  return CLASSES.find((k) => norm(k.name) === norm(c.class || ''))?.id ?? '';
}

/**
 * Conjuração ativa: da classe ou da subclasse (Trapaceiro Arcano e Cavaleiro Arcano
 * ganham conjuração pelo arquétipo, a partir do nível dele). Nunca ler cls.spellcasting direto.
 */
export function activeSpellcasting(sheet: Pick<SheetData, 'classId' | 'subclassId'>, level: number): SpellcastingInfo | undefined {
  const cls = getClass(sheet.classId);
  if (cls?.spellcasting) return cls.spellcasting;
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId) as (Subclass & { spellcasting?: SpellcastingInfo }) | undefined;
  return sub?.spellcasting && level >= sub.level ? sub.spellcasting : undefined;
}

/** Bruxo: magia de pacto. */
export function pactSlots(level: number): number[] {
  const count = level === 1 ? 1 : level < 11 ? 2 : level < 17 ? 3 : 4;
  const slotLevel = Math.min(5, Math.ceil(level / 2));
  const arr: number[] = Array(slotLevel).fill(0);
  arr[slotLevel - 1] = count;
  return arr;
}

export function derivedStats(c: Character) {
  const sheet = getSheet(c);
  const pb = proficiencyBonus(c.level);
  const mod = (k: AbilityKey) => abilityModifier(scoreOf(c, k));
  const abilities = ABILITIES.map((a) => ({ ...a, score: scoreOf(c, a.key), mod: mod(a.key) }));
  const saves = ABILITIES.map((a) => {
    const proficient = sheet.savingThrowProficiencies.includes(a.key);
    return { ...a, proficient, bonus: mod(a.key) + (proficient ? pb : 0) };
  });
  const skills = SKILLS.map((s) => {
    const proficient = sheet.skillProficiencies.includes(s.key);
    const expertise = sheet.skillExpertise.includes(s.key);
    return { ...s, proficient, expertise, bonus: mod(s.ability) + (expertise ? pb * 2 : proficient ? pb : 0) };
  });
  const sc = activeSpellcasting(sheet, c.level);
  const spell = sc
    ? {
        ability: sc.ability,
        dc: 8 + pb + mod(sc.ability),
        attack: pb + mod(sc.ability),
        pact: sc.kind === 'pact',
        slots: sc.kind === 'pact' ? pactSlots(c.level) : spellSlotsFor(sc.kind, c.level),
      }
    : null;
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  return {
    pb,
    initiative: mod('dex'),
    passivePerception: 10 + (skills.find((s) => s.key === 'percepcao')?.bonus ?? 0),
    speed: subrace?.speed ?? race?.speed ?? 9,
    abilities,
    saves,
    skills,
    spell,
  };
}

/** Magias do personagem: ids da ficha nova + entradas antigas em c.spells (ids ou objetos). */
export function knownSpells(c: Character): { id: string; name: string; level: number; spell?: Spell; prepared: boolean }[] {
  const sheet = getSheet(c);
  const ids = new Set<string>([...sheet.spellsKnown]);
  for (const s of Array.isArray(c.spells) ? c.spells : []) {
    if (typeof s === 'string') ids.add(s);
  }
  const out: { id: string; name: string; level: number; spell?: Spell; prepared: boolean }[] = [];
  for (const id of ids) {
    const spell = getSpell(id);
    out.push({ id, name: spell?.name ?? id, level: spell?.level ?? 0, spell, prepared: sheet.spellsPrepared.includes(id) });
  }
  for (const s of Array.isArray(c.spells) ? c.spells : []) {
    if (s && typeof s === 'object' && typeof s.name === 'string') {
      out.push({ id: `custom-${s.name}`, name: s.name, level: Number(s.level) || 0, prepared: false });
    }
  }
  return out.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'pt-BR'));
}

/** Características: classe/subclasse/raça até o nível atual + entradas livres. */
export function featureGroups(c: Character): { title: string; items: { name: string; description: string; tag?: string }[] }[] {
  const sheet = getSheet(c);
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  const cls = getClass(sheet.classId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  const extra = (Array.isArray(c.features) ? c.features : [])
    .filter((f): f is { name: string; description?: string } => !!f && typeof f === 'object' && typeof f.name === 'string')
    .map((f) => ({ name: f.name, description: f.description ?? '' }));
  return [
    { title: `Raça${race ? ` · ${race.name}` : ''}`, items: [...(race?.traits ?? []), ...(subrace?.traits ?? [])] },
    {
      title: `Classe${cls ? ` · ${cls.name}` : ''}`,
      items: (cls?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, tag: `Nv ${f.level}` })),
    },
    {
      title: `Subclasse${sub ? ` · ${sub.name}` : ''}`,
      items: (sub?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, tag: `Nv ${f.level}` })),
    },
    {
      title: 'Outras características',
      items: [...sheet.chosenFeatures.map((n) => ({ name: n, description: 'Escolha registrada na criação do personagem.' })), ...extra],
    },
  ].filter((g) => g.items.length > 0);
}

/** Cor da barra de PV conforme a porcentagem. */
export function hpTone(current: number, max: number): 'success' | 'gold' | 'danger' {
  const pct = max > 0 ? current / max : 0;
  return pct > 0.5 ? 'success' : pct > 0.25 ? 'gold' : 'danger';
}
