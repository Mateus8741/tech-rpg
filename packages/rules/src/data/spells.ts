import type { Spell } from "../types";
import { SPELLS_A } from "./spells-a";
import { SPELLS_B } from "./spells-b";

export const SPELLS: Spell[] = [...SPELLS_A, ...SPELLS_B];
export const getSpell = (id: string) => SPELLS.find((s) => s.id === id);
export const spellsForClass = (classId: string, maxLevel = 9) =>
  SPELLS.filter((s) => s.classes.includes(classId) && s.level <= maxLevel);
