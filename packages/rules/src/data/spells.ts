import type { Spell } from "../types";
import { SPELLS_A } from "./spells-a";
import { SPELLS_B } from "./spells-b";
import { SPELLS_C } from "./spells-c";
import { SPELLS_D } from "./spells-d";
import { SPELLS_E } from "./spells-e";
import { ARTIFICE_SPELL_IDS, SPELLS_F } from "./spells-f";

// Ids duplicados entre arquivos (mesma magia com nomes PT diferentes) ou já cobertos pelo repo.
const DUPLICATE_IDS = new Set([
  "isca-relampejante", // Lightning Lure = atracao-chocante
  "palavra-de-radiancia", // Word of Radiance = mao-do-esplendor
  "aguilhao-mental", // Mind Spike = espinho-mental
  "inimigos-por-toda-parte", // Enemies Abound = inimigos-em-abundancia
  "transformacao-draconiana", // Draconic Transformation = transformacao-draconica
]);

const seen = new Set<string>();
const ARTIFICE_IDS = new Set(ARTIFICE_SPELL_IDS);
export const SPELLS: Spell[] = [...SPELLS_A, ...SPELLS_B, ...SPELLS_C, ...SPELLS_D, ...SPELLS_E, ...SPELLS_F].filter((s) => {
  if (DUPLICATE_IDS.has(s.id) || seen.has(s.id)) return false;
  seen.add(s.id);
  return true;
}).map((s) =>
  ARTIFICE_IDS.has(s.id) && !s.classes.includes("artifice") ? { ...s, classes: [...s.classes, "artifice"] } : s,
);
export const getSpell = (id: string) => SPELLS.find((s) => s.id === id);
export const spellsForClass = (classId: string, maxLevel = 9) =>
  SPELLS.filter((s) => s.classes.includes(classId) && s.level <= maxLevel);
