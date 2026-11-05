import type { Spell, SpellSchool } from "@repo/rules";

export const SPELL_SCHOOLS: SpellSchool[] = [
  "Abjuração", "Conjuração", "Adivinhação", "Encantamento",
  "Evocação", "Ilusão", "Necromancia", "Transmutação",
];

export interface SchoolColor {
  /** cor principal (hex) */
  hex: string;
  /** classes Tailwind para chip/badge */
  chip: string;
}

export const SPELL_SCHOOL_COLORS: Record<SpellSchool, SchoolColor> = {
  "Abjuração": { hex: "#60a5fa", chip: "border-[#60a5fa]/40 bg-[#60a5fa]/10 text-[#93c5fd]" },
  "Conjuração": { hex: "#fbbf24", chip: "border-[#fbbf24]/40 bg-[#fbbf24]/10 text-[#fcd34d]" },
  "Adivinhação": { hex: "#22d3ee", chip: "border-[#22d3ee]/40 bg-[#22d3ee]/10 text-[#67e8f9]" },
  "Encantamento": { hex: "#f472b6", chip: "border-[#f472b6]/40 bg-[#f472b6]/10 text-[#f9a8d4]" },
  "Evocação": { hex: "#f87171", chip: "border-[#f87171]/40 bg-[#f87171]/10 text-danger-soft" },
  "Ilusão": { hex: "#a78bfa", chip: "border-[#a78bfa]/40 bg-[#a78bfa]/10 text-violet-ink-soft" },
  "Necromancia": { hex: "#4ade80", chip: "border-[#4ade80]/40 bg-[#4ade80]/10 text-[#86efac]" },
  "Transmutação": { hex: "#fb923c", chip: "border-[#fb923c]/40 bg-[#fb923c]/10 text-[#fdba74]" },
};

export const spellLevelLabel = (level: number) => (level === 0 ? "Truque" : `${level}º círculo`);

export const spellLevelShort = (level: number) => (level === 0 ? "T" : String(level));

export function spellComponentsLabel(c: Spell["components"]): string {
  const parts: string[] = [];
  if (c.v) parts.push("V");
  if (c.s) parts.push("S");
  if (c.m) parts.push("M");
  return parts.join(", ");
}

export const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Remove acentos e baixa caixa, para busca. */
export const normalizeText = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
