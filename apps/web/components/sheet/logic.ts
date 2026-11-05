import { ARMOR, abilityModifier, getClass, levelForXp, rollDice, type ClassDef } from '@repo/rules';
import type { Character } from '@/lib/api';
import { getSheet, type SheetData } from '@/lib/sheet';
import { isEquipped } from './equipment-logic';

export const hitDieAverage = (die: number) => Math.floor(die / 2) + 1;

/** Dados de vida restantes. */
export const hitDiceLeft = (c: Character, sheet: SheetData) => Math.max(0, c.level - sheet.hitDiceUsed);

export function canLevelUp(c: Character) {
  return c.level < 20 && levelForXp(c.experience) > c.level;
}

/** Sobe um nível: PV máximos aumentam pela média do dado de vida + mod. de Constituição. */
export function levelUpPatch(c: Character): Partial<Character> {
  const cls = getClass(getSheet(c).classId);
  const die = cls?.hitDie ?? 8;
  const gain = Math.max(1, hitDieAverage(die) + abilityModifier(c.constitution));
  return {
    level: c.level + 1,
    maxHitPoints: c.maxHitPoints + gain,
    currentHitPoints: c.currentHitPoints + gain,
  };
}

/** Aplica dano consumindo PV temporários primeiro. */
export function applyDamage(c: Character, amount: number): Partial<Character> {
  const fromTemp = Math.min(c.temporaryHitPoints, amount);
  const rest = amount - fromTemp;
  return {
    temporaryHitPoints: c.temporaryHitPoints - fromTemp,
    currentHitPoints: Math.max(0, c.currentHitPoints - rest),
  };
}

export function applyHealing(c: Character, amount: number): Partial<Character> {
  return { currentHitPoints: Math.min(c.maxHitPoints, c.currentHitPoints + amount) };
}

export function spendHitDie(c: Character, sheet: SheetData) {
  const die = getClass(sheet.classId)?.hitDie ?? 8;
  const r = rollDice(`1d${die}`);
  if (!r || hitDiceLeft(c, sheet) <= 0) return null;
  const heal = Math.max(0, r.total + abilityModifier(c.constitution));
  return { die, roll: r.total, heal, hp: Math.min(c.maxHitPoints, c.currentHitPoints + heal) };
}

export function longRestPatch(c: Character, sheet: SheetData) {
  const recovered = Math.max(1, Math.floor(c.level / 2));
  return {
    columns: { currentHitPoints: c.maxHitPoints, temporaryHitPoints: 0 } as Partial<Character>,
    sheet: {
      spellSlotsUsed: [],
      hitDiceUsed: Math.max(0, sheet.hitDiceUsed - recovered),
      deathSaves: { successes: 0, failures: 0 },
      // recursos de descanso curto/longo voltam; "manual" fica como está
      resources: sheet.resources.map((r) => (r.recharge === 'manual' ? r : { ...r, used: 0 })),
      concentratingOn: null,
      exhaustion: Math.max(0, sheet.exhaustion - 1),
    } as Partial<SheetData>,
  };
}

/** Bruxo: magia de pacto. */
export function pactSlots(level: number): number[] {
  const count = level === 1 ? 1 : level < 11 ? 2 : level < 17 ? 3 : 4;
  const slotLevel = Math.min(5, Math.ceil(level / 2));
  const arr = Array(slotLevel).fill(0);
  arr[slotLevel - 1] = count;
  return arr;
}

export function preparedLimit(cls: ClassDef | undefined, level: number, abilityMod: number) {
  const sc = cls?.spellcasting;
  if (!sc?.preparesSpells) return null;
  const base = sc.kind === 'full' ? level : Math.floor(level / 2);
  return Math.max(1, abilityMod + base);
}

export interface AcBreakdown { total: number; parts: string[] }

/** Calcula a CA com base nos itens equipados (casando nomes com a tabela de armaduras). */
export function computeArmorClass(c: Character, classId: string): AcBreakdown {
  const dex = abilityModifier(c.dexterity);
  const all = c.equipment ?? [];
  const items = all.filter((it) => isEquipped(all, it));
  const parts: string[] = [];
  let body: { name: string; base: number; dex: boolean; cap?: number } | null = null;
  let shield = 0;
  let flat = 0;

  for (const it of items) {
    const armor = ARMOR.find((a) => a.name.toLowerCase() === it.name.trim().toLowerCase());
    if (!armor) { if (it.defense) { flat += it.defense; parts.push(`${it.name} +${it.defense}`); } continue; }
    if (armor.category === 'Escudo') { shield = 2; parts.push(`${armor.name} +2`); continue; }
    const base = parseInt(armor.ac, 10);
    const cand = { name: armor.name, base, dex: armor.ac.includes('Des'), cap: armor.ac.includes('máx') ? 2 : undefined };
    if (!body || cand.base > body.base) body = cand;
  }

  let total: number;
  if (body) {
    const d = body.dex ? Math.min(dex, body.cap ?? 99) : 0;
    total = body.base + d;
    parts.unshift(`${body.name} ${body.base}${body.dex ? ` ${d >= 0 ? '+' : ''}${d} (Des)` : ''}`);
  } else if (classId === 'barbaro') {
    total = 10 + dex + abilityModifier(c.constitution);
    parts.unshift('Defesa sem armadura: 10 + Des + Con');
  } else if (classId === 'monge' && shield === 0) {
    total = 10 + dex + abilityModifier(c.wisdom);
    parts.unshift('Defesa sem armadura: 10 + Des + Sab');
  } else {
    total = 10 + dex;
    parts.unshift(`Base 10 + Des (${dex >= 0 ? '+' : ''}${dex})`);
  }
  return { total: total + shield + flat, parts };
}
