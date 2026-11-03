import type { AbilityKey, SkillKey } from "./types";

export const ABILITIES: { key: AbilityKey; name: string; abbr: string }[] = [
  { key: "str", name: "Força", abbr: "FOR" },
  { key: "dex", name: "Destreza", abbr: "DES" },
  { key: "con", name: "Constituição", abbr: "CON" },
  { key: "int", name: "Inteligência", abbr: "INT" },
  { key: "wis", name: "Sabedoria", abbr: "SAB" },
  { key: "cha", name: "Carisma", abbr: "CAR" },
];

export const SKILLS: { key: SkillKey; name: string; ability: AbilityKey }[] = [
  { key: "acrobacia", name: "Acrobacia", ability: "dex" },
  { key: "adestrarAnimais", name: "Adestrar Animais", ability: "wis" },
  { key: "arcanismo", name: "Arcanismo", ability: "int" },
  { key: "atletismo", name: "Atletismo", ability: "str" },
  { key: "atuacao", name: "Atuação", ability: "cha" },
  { key: "enganacao", name: "Enganação", ability: "cha" },
  { key: "furtividade", name: "Furtividade", ability: "dex" },
  { key: "historia", name: "História", ability: "int" },
  { key: "intimidacao", name: "Intimidação", ability: "cha" },
  { key: "intuicao", name: "Intuição", ability: "wis" },
  { key: "investigacao", name: "Investigação", ability: "int" },
  { key: "medicina", name: "Medicina", ability: "wis" },
  { key: "natureza", name: "Natureza", ability: "int" },
  { key: "percepcao", name: "Percepção", ability: "wis" },
  { key: "persuasao", name: "Persuasão", ability: "cha" },
  { key: "prestidigitacao", name: "Prestidigitação", ability: "dex" },
  { key: "religiao", name: "Religião", ability: "int" },
  { key: "sobrevivencia", name: "Sobrevivência", ability: "wis" },
];

export const ALIGNMENTS = [
  "Leal e Bom", "Neutro e Bom", "Caótico e Bom",
  "Leal e Neutro", "Neutro", "Caótico e Neutro",
  "Leal e Mau", "Neutro e Mau", "Caótico e Mau",
] as const;

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;
export const POINT_BUY_BUDGET = 27;
export const POINT_BUY_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

export const abilityModifier = (score: number) => Math.floor((score - 10) / 2);
export const proficiencyBonus = (level: number) => Math.ceil(level / 4) + 1;
export const formatModifier = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

/** Tabela de espaços de magia (conjurador completo), índice = nível do personagem - 1, cada linha = espaços dos níveis 1..9. */
export const FULL_CASTER_SLOTS: number[][] = [
  [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2],
  [4, 3, 3, 3, 1], [4, 3, 3, 3, 2], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

export function spellSlotsFor(kind: "full" | "half" | "third" | "pact", level: number): number[] {
  if (kind === "pact") return [];
  const eff = kind === "full" ? level : kind === "half" ? Math.ceil(level / 2) : Math.ceil(level / 3);
  if (kind !== "full" && level < (kind === "half" ? 2 : 3)) return [];
  return FULL_CASTER_SLOTS[Math.min(Math.max(eff, 1), 20) - 1] ?? [];
}

export const XP_BY_LEVEL = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000];
export const levelForXp = (xp: number) => XP_BY_LEVEL.reduce((lv, min, i) => (xp >= min ? i + 1 : lv), 1);

export function rollDice(expr: string): { total: number; rolls: number[]; bonus: number } | null {
  const m = expr.trim().match(/^(\d*)d(\d+)\s*([+-]\s*\d+)?$/i);
  if (!m) return null;
  const n = Number(m[1] || 1), sides = Number(m[2]), bonus = m[3] ? Number(m[3].replace(/\s/g, "")) : 0;
  const rolls = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * sides));
  return { total: rolls.reduce((a, b) => a + b, 0) + bonus, rolls, bonus };
}
