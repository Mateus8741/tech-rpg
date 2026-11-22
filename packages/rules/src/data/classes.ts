import type { ClassDef } from "../types";
import { CLASSES_A } from "./classes-a";
import { CLASSES_B } from "./classes-b";
import { CLASSES_EXTRA } from "./classes-extra";
import { SUBCLASSES_EXTRA } from "./subclasses-extra";

export const CLASSES: ClassDef[] = [...CLASSES_A, ...CLASSES_B, ...CLASSES_EXTRA]
  .map((c) => {
    const extra = SUBCLASSES_EXTRA[c.id];
    if (!extra) return c;
    const have = new Set(c.subclasses.map((s) => s.id));
    return { ...c, subclasses: [...c.subclasses, ...extra.filter((s) => !have.has(s.id))] };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
export const getClass = (id: string) => CLASSES.find((c) => c.id === id);
