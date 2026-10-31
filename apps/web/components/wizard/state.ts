import type { AbilityKey, SkillKey } from "@repo/rules";

export type AbilityMode = "standard" | "pointbuy" | "roll";
export type AbMap<T> = Record<AbilityKey, T>;
export type StepId = "race" | "class" | "background" | "abilities" | "spells" | "details";

export interface WizardState {
  // 1. Raça
  raceId: string;
  subraceId: string;
  racialPicks: AbilityKey[];
  raceLanguages: string[];
  raceSkills: SkillKey[];
  // 2. Classe
  classId: string;
  level: number;
  subclassId: string;
  classSkills: SkillKey[];
  equipChoices: Record<number, number>;
  equipWeapons: Record<number, string>;
  // 3. Antecedente
  backgroundId: string;
  bgLanguages: string[];
  personality: { traits: string; ideals: string; bonds: string; flaws: string };
  // 4. Atributos
  abilityMode: AbilityMode;
  standard: AbMap<number | null>;
  pointBuy: AbMap<number>;
  rolls: number[][]; // 6 conjuntos de 4 dados
  rollAssign: AbMap<number | null>; // índice do conjunto
  // 5. Magias
  cantrips: string[];
  spells: string[];
  prepared: string[];
  // 6. Detalhes
  name: string;
  alignment: string;
  appearance: string;
  backstory: string;
}

const nulls = (): AbMap<null> => ({ str: null, dex: null, con: null, int: null, wis: null, cha: null });

export const initialState = (): WizardState => ({
  raceId: "", subraceId: "", racialPicks: [], raceLanguages: [], raceSkills: [],
  classId: "", level: 1, subclassId: "", classSkills: [], equipChoices: {}, equipWeapons: {},
  backgroundId: "", bgLanguages: [], personality: { traits: "", ideals: "", bonds: "", flaws: "" },
  abilityMode: "standard", standard: nulls(),
  pointBuy: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 },
  rolls: [], rollAssign: nulls(),
  cantrips: [], spells: [], prepared: [],
  name: "", alignment: "", appearance: "", backstory: "",
});

export const resetClassPatch = (): Partial<WizardState> => ({
  subclassId: "", classSkills: [], equipChoices: {}, equipWeapons: {}, cantrips: [], spells: [], prepared: [],
});

export const resetRacePatch = (): Partial<WizardState> => ({
  subraceId: "", racialPicks: [], raceLanguages: [], raceSkills: [],
});

export const STEP_LABELS: Record<StepId, string> = {
  race: "Raça", class: "Classe", background: "Antecedente",
  abilities: "Atributos", spells: "Magias", details: "Detalhes",
};
