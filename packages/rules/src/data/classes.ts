import type { ClassDef } from "../types";
import { CLASSES_A } from "./classes-a";
import { CLASSES_B } from "./classes-b";

export const CLASSES: ClassDef[] = [...CLASSES_A, ...CLASSES_B].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
export const getClass = (id: string) => CLASSES.find((c) => c.id === id);
