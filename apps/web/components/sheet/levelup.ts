// Lógica pura do assistente de level up (sem React): calcula ganhos e monta o patch final.
import {
  ABILITIES, abilityModifier, getClass, proficiencyBonus, spellSlotsFor,
  type AbilityKey, type ClassFeature, type Spell, type Subclass,
} from '@repo/rules';
import type { Character } from '@/lib/api';
import { SCORE_FIELDS, getSheet, scoreOf, type SheetData } from '@/lib/sheet';
import { spellPlan, type SpellPlan } from '../wizard/build';
import { initialState } from '../wizard/state';
import { hitDieAverage, pactSlots } from './logic';

export type HpMode = 'average' | 'roll';
export type AsiMode = 'plus2' | 'plus1' | 'feat';

export interface AsiChoice { mode: AsiMode; a: AbilityKey | ''; b: AbilityKey | ''; feat: string }

export interface LevelUpDraft {
  hpMode: HpMode;
  /** Resultado do dado de vida rolado (null = ainda não rolou). */
  hpRoll: number | null;
  subclassId: string;
  asi: AsiChoice;
  cantrips: string[];
  spells: string[];
}

export const emptyDraft = (): LevelUpDraft => ({
  hpMode: 'average', hpRoll: null, subclassId: '',
  asi: { mode: 'plus2', a: '', b: '', feat: '' }, cantrips: [], spells: [],
});

const MOD_FIELDS = {
  str: 'strengthModifier', dex: 'dexterityModifier', con: 'constitutionModifier',
  int: 'intelligenceModifier', wis: 'wisdomModifier', cha: 'charismaModifier',
} as const;

/** Níveis com aumento de atributo/talento (guerreiro e ladino ganham extras). */
export function asiLevels(classId: string): number[] {
  const extra = classId === 'guerreiro' ? [6, 14] : classId === 'ladino' ? [10] : [];
  return [4, 8, 12, 16, 19, ...extra].sort((x, y) => x - y);
}
export const grantsAsi = (classId: string, level: number) => asiLevels(classId).includes(level);

/** Nível em que a classe escolhe subclasse. */
export const classSubclassLevel = (subs: Subclass[]) => (subs.length ? Math.min(...subs.map((s) => s.level)) : undefined);

/** Incrementos de atributo da escolha (sem validar o teto). */
export function asiIncrements(asi: AsiChoice): Partial<Record<AbilityKey, number>> {
  if (asi.mode === 'feat') return {};
  if (asi.mode === 'plus2') return asi.a ? { [asi.a]: 2 } : {};
  const out: Partial<Record<AbilityKey, number>> = {};
  if (asi.a) out[asi.a] = 1;
  if (asi.b && asi.b !== asi.a) out[asi.b] = (out[asi.b] ?? 0) + 1;
  return out;
}

/** Escolha completa e que não ultrapassa 20. */
export function asiValid(scores: Record<AbilityKey, number>, asi: AsiChoice): boolean {
  if (asi.mode === 'feat') return asi.feat.trim().length > 0;
  const inc = asiIncrements(asi);
  const total = Object.values(inc).reduce((n, v) => n + (v ?? 0), 0);
  if (total !== 2) return false;
  return (Object.entries(inc) as [AbilityKey, number][]).every(([k, v]) => scores[k] + v <= 20);
}

export function scoresOf(c: Character): Record<AbilityKey, number> {
  return Object.fromEntries(ABILITIES.map((a) => [a.key, scoreOf(c, a.key)])) as Record<AbilityKey, number>;
}

/** Plano de magias reaproveitando spellPlan do wizard, com um estado sintético. */
function planFor(classId: string, subclassId: string, level: number, scores: Record<AbilityKey, number>): SpellPlan | null {
  return spellPlan({ ...initialState(), classId, subclassId, level, abilityMode: 'manual', manual: scores });
}

export const slotsFor = (plan: SpellPlan | null, level: number): number[] =>
  !plan ? [] : plan.sc.kind === 'pact' ? pactSlots(level) : spellSlotsFor(plan.sc.kind, level);

export interface SpellChoices {
  oldPlan: SpellPlan | null;
  newPlan: SpellPlan | null;
  oldSlots: number[];
  newSlots: number[];
  needCantrips: number;
  needSpells: number;
  cantripPool: Spell[];
  spellPool: Spell[];
}

export function spellChoices(c: Character, draft: LevelUpDraft): SpellChoices {
  const sheet = getSheet(c);
  const newLevel = c.level + 1;
  const before = scoresOf(c);
  const after = applyScores(before, draft, newLevel, sheet.classId);
  const subclassId = sheet.subclassId || draft.subclassId;
  const oldPlan = planFor(sheet.classId, sheet.subclassId ?? '', c.level, before);
  const newPlan = planFor(sheet.classId, subclassId, newLevel, after);
  const owned = new Set(sheet.spellsKnown);
  const delta = (k: 'cantrips' | 'known' | 'prepared') => Math.max(0, (newPlan?.[k] ?? 0) - (oldPlan?.[k] ?? 0));
  const spellKey = newPlan?.mode === 'prepared' ? 'prepared' : 'known';
  const cantripPool = (newPlan?.cantripList ?? []).filter((s) => !owned.has(s.id));
  const spellPool = (newPlan?.spellList ?? []).filter((s) => !owned.has(s.id));
  return {
    oldPlan, newPlan,
    oldSlots: slotsFor(oldPlan, c.level), newSlots: slotsFor(newPlan, newLevel),
    needCantrips: Math.min(delta('cantrips'), cantripPool.length),
    needSpells: Math.min(delta(spellKey), spellPool.length),
    cantripPool, spellPool,
  };
}

function applyScores(base: Record<AbilityKey, number>, draft: LevelUpDraft, newLevel: number, classId: string) {
  const out = { ...base };
  if (!grantsAsi(classId, newLevel) || !asiValid(base, draft.asi)) return out;
  for (const [k, v] of Object.entries(asiIncrements(draft.asi)) as [AbilityKey, number][]) out[k] = Math.min(20, out[k] + v);
  return out;
}

export interface LevelUpResult {
  newLevel: number;
  hitDie: number;
  hpBase: number;
  hpGain: number;
  /** PV retroativos por aumento de Constituição. */
  hpRetro: number;
  pbOld: number;
  pbNew: number;
  scoresBefore: Record<AbilityKey, number>;
  scoresAfter: Record<AbilityKey, number>;
  features: ClassFeature[];
  subclassNeeded: boolean;
  subclasses: Subclass[];
  asiAvailable: boolean;
  spell: SpellChoices;
  /** Pendências que impedem confirmar (vazio = pronto). */
  errors: string[];
  columns: Partial<Character>;
  sheet: Partial<SheetData>;
}

export function computeLevelUp(c: Character, draft: LevelUpDraft): LevelUpResult {
  const sheet = getSheet(c);
  const cls = getClass(sheet.classId);
  const newLevel = Math.min(20, c.level + 1);
  const die = cls?.hitDie ?? 8;
  const before = scoresOf(c);
  const asiAvailable = grantsAsi(sheet.classId, newLevel);
  const asiOk = !asiAvailable || asiValid(before, draft.asi);
  const after = applyScores(before, draft, newLevel, sheet.classId);

  // PV: dado (média ou rolado) + mod. de Con novo; aumento de Con vale retroativamente.
  const hpBase = draft.hpMode === 'roll' ? (draft.hpRoll ?? 0) : hitDieAverage(die);
  const conOld = abilityModifier(before.con), conNew = abilityModifier(after.con);
  const hpRetro = (conNew - conOld) * c.level;
  const hpGain = Math.max(1, hpBase + conNew) + hpRetro;

  const subs = cls?.subclasses ?? [];
  const subLv = classSubclassLevel(subs);
  const subclassNeeded = !sheet.subclassId && subLv !== undefined && newLevel >= subLv;
  const subclassId = sheet.subclassId || draft.subclassId;
  const sub = subs.find((s) => s.id === subclassId);
  const features = [
    ...(cls?.features ?? []).filter((f) => f.level === newLevel),
    ...(sub?.features ?? []).filter((f) => f.level === newLevel || (!sheet.subclassId && f.level <= newLevel)),
  ];

  const spell = spellChoices(c, draft);
  const errors: string[] = [];
  if (c.level >= 20) errors.push('Nível máximo atingido.');
  if (draft.hpMode === 'roll' && draft.hpRoll == null) errors.push('Role o dado de vida ou escolha a média.');
  if (subclassNeeded && !draft.subclassId) errors.push(`Escolha ${cls?.subclassLabel.toLowerCase() ?? 'a subclasse'}.`);
  if (!asiOk) errors.push('Conclua o aumento de atributo ou talento (máx. 20).');
  const cant = draft.cantrips.filter((id) => spell.cantripPool.some((s) => s.id === id));
  const sp = draft.spells.filter((id) => spell.spellPool.some((s) => s.id === id));
  if (cant.length < spell.needCantrips) errors.push(`Escolha ${spell.needCantrips - cant.length} truque(s).`);
  if (sp.length < spell.needSpells) errors.push(`Escolha ${spell.needSpells - sp.length} magia(s).`);

  // Patch consolidado
  const columns: Partial<Character> = {
    level: newLevel,
    maxHitPoints: c.maxHitPoints + hpGain,
    currentHitPoints: c.currentHitPoints + hpGain,
  };
  const baseScores = { ...sheet.baseScores };
  for (const a of ABILITIES) {
    const diff = after[a.key] - before[a.key];
    if (diff > 0) {
      (columns as Record<string, unknown>)[SCORE_FIELDS[a.key]] = after[a.key];
      (columns as Record<string, unknown>)[MOD_FIELDS[a.key]] = abilityModifier(after[a.key]);
      baseScores[a.key] = Math.min(20, baseScores[a.key] + diff);
    }
  }
  const known = [...sheet.spellsKnown, ...cant, ...sp];
  if (cant.length || sp.length) columns.spells = [...new Set([...(c.spells ?? []), ...cant, ...sp])];
  const chosen = [...sheet.chosenFeatures];
  if (asiAvailable && asiOk) {
    if (draft.asi.mode === 'feat') chosen.push(`Nv ${newLevel}: Talento — ${draft.asi.feat.trim()}`);
    else chosen.push(`Nv ${newLevel}: ${Object.entries(asiIncrements(draft.asi)).map(([k, v]) => `+${v} ${ABILITIES.find((a) => a.key === k)?.name}`).join(', ')}`);
  }
  const used = [...sheet.spellSlotsUsed];
  while (used.length < spell.newSlots.length) used.push(0);
  const sheetPatch: Partial<SheetData> = {
    baseScores,
    spellsKnown: known,
    spellsPrepared: spell.newPlan?.mode === 'prepared' ? [...sheet.spellsPrepared, ...sp] : sheet.spellsPrepared,
    spellSlotsUsed: used,
    chosenFeatures: chosen,
    ...(subclassId ? { subclassId } : {}),
  };

  return {
    newLevel, hitDie: die, hpBase, hpGain, hpRetro,
    pbOld: proficiencyBonus(c.level), pbNew: proficiencyBonus(newLevel),
    scoresBefore: before, scoresAfter: after, features, subclassNeeded, subclasses: subs,
    asiAvailable, spell, errors, columns, sheet: sheetPatch,
  };
}
