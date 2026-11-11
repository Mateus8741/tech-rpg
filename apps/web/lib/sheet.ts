// Contrato dos dados de ficha guardados em Character.customData.sheet (JSON).
// Colunas fixas do Prisma continuam valendo: name, race, class, level, background, alignment,
// strength..charisma (valores base + racial já aplicados), maxHitPoints, currentHitPoints, armorClass etc.
import {
  ABILITIES, SKILLS, abilityModifier, proficiencyBonus, getClass, getRace, spellSlotsFor,
  type AbilityKey, type SkillKey, type SpellcastingInfo, type Subclass,
} from "@repo/rules";
import type { Character } from "@/lib/api";

export interface ResourceDef {
  id: string;
  name: string;                                 // "Fúria", "Pontos de Ki"...
  max: number;
  used: number;
  recharge: "short" | "long" | "manual";        // quando volta no descanso
}

export interface Coins { pp: number; gp: number; ep: number; sp: number; cp: number }

export interface SheetData {
  raceId: string;
  subraceId?: string;
  classId: string;
  subclassId?: string;
  backgroundId: string;
  baseScores: Record<AbilityKey, number>;       // antes dos bônus raciais
  skillProficiencies: SkillKey[];
  skillExpertise: SkillKey[];
  savingThrowProficiencies: AbilityKey[];
  languages: string[];
  toolProficiencies: string[];
  inspiration: boolean;
  deathSaves: { successes: number; failures: number };
  hitDiceUsed: number;
  spellsKnown: string[];                        // ids de magia (inclui truques)
  spellsPrepared: string[];
  spellSlotsUsed: number[];                     // índice 0 = nível 1
  personality: { traits: string; ideals: string; bonds: string; flaws: string };
  appearance: string;
  backstory: string;
  chosenFeatures: string[];                     // escolhas livres (estilo de luta, etc.)
  concentratingOn: string | null;               // id da magia em concentração
  conditions: string[];                         // ids de CONDITIONS de @repo/rules
  exhaustion: number;                           // 0-6
  resources: ResourceDef[];                     // fúria, ki, usos por descanso...
  coins: Coins;
  spellsFavorite: string[];                     // ids de magia favoritas
  cm?: number[];                                // C.M da ficha de papel: parcelas da soma (ex.: [10, 1, 3, 1])
}

export const emptySheet = (): SheetData => ({
  raceId: "", classId: "", backgroundId: "",
  baseScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
  skillProficiencies: [], skillExpertise: [], savingThrowProficiencies: [],
  languages: [], toolProficiencies: [], inspiration: false,
  deathSaves: { successes: 0, failures: 0 }, hitDiceUsed: 0,
  spellsKnown: [], spellsPrepared: [], spellSlotsUsed: [],
  personality: { traits: "", ideals: "", bonds: "", flaws: "" },
  appearance: "", backstory: "", chosenFeatures: [],
  concentratingOn: null, conditions: [], exhaustion: 0, resources: [],
  coins: { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 }, spellsFavorite: [],
});

export const getSheet = (c: Pick<Character, "customData">): SheetData =>
  ({ ...emptySheet(), ...((c.customData as { sheet?: Partial<SheetData> } | undefined)?.sheet ?? {}) });

const SCORE_FIELD: Record<AbilityKey, "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma"> = {
  str: "strength", dex: "dexterity", con: "constitution", int: "intelligence", wis: "wisdom", cha: "charisma",
};
export const scoreOf = (c: Character, k: AbilityKey) => c[SCORE_FIELD[k]];
export const SCORE_FIELDS = SCORE_FIELD;

/**
 * Conjuração ativa do personagem: da classe ou da subclasse (Trapaceiro Arcano e Cavaleiro Arcano
 * ganham conjuração pelo arquétipo, a partir do nível dele).
 */
export function activeSpellcasting(sheet: Pick<SheetData, "classId" | "subclassId">, level: number): SpellcastingInfo | undefined {
  const cls = getClass(sheet.classId);
  if (cls?.spellcasting) return cls.spellcasting;
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId) as (Subclass & { spellcasting?: SpellcastingInfo }) | undefined;
  return sub?.spellcasting && level >= sub.level ? sub.spellcasting : undefined;
}

/** Lista de magias usada: arquétipos conjuradores usam a lista de mago. */
export const spellListClassId = (sheet: Pick<SheetData, "classId">) =>
  getClass(sheet.classId)?.spellcasting ? sheet.classId : "mago";

export function derivedStats(c: Character) {
  const sheet = getSheet(c);
  const pb = proficiencyBonus(c.level);
  const mod = (k: AbilityKey) => abilityModifier(scoreOf(c, k));
  const saves = ABILITIES.map((a) => ({
    ...a, proficient: sheet.savingThrowProficiencies.includes(a.key),
    bonus: mod(a.key) + (sheet.savingThrowProficiencies.includes(a.key) ? pb : 0),
  }));
  const skills = SKILLS.map((s) => {
    const prof = sheet.skillProficiencies.includes(s.key), exp = sheet.skillExpertise.includes(s.key);
    return { ...s, proficient: prof, expertise: exp, bonus: mod(s.ability) + (exp ? pb * 2 : prof ? pb : 0) };
  });
  const cls = getClass(sheet.classId);
  const race = getRace(sheet.raceId);
  const sc = activeSpellcasting(sheet, c.level);
  const spell = sc ? {
    ability: sc.ability, dc: 8 + pb + mod(sc.ability), attack: pb + mod(sc.ability),
    slots: spellSlotsFor(sc.kind, c.level),
  } : null;
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  return {
    pb, initiative: mod("dex"), passivePerception: 10 + (skills.find((s) => s.key === "percepcao")?.bonus ?? 0),
    speed: subrace?.speed ?? race?.speed ?? 9, saves, skills, spell, hitDie: cls?.hitDie ?? 8,
  };
}
