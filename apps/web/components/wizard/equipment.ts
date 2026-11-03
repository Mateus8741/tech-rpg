import { ARMOR, WEAPONS, type ArmorItem, type Weapon } from "@repo/rules";

export interface EquipLine {
  /** Opções "(a) ... ou (b) ..."; null quando a linha é fixa. */
  options: string[] | null;
  fixed: string;
}

export interface Item { name: string; quantity: number }

export const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function parseEquipLine(line: string): EquipLine {
  if (!/^\s*\(a\)/i.test(line)) return { options: null, fixed: line };
  const parts = line.split(/\(([a-z])\)\s*/i).slice(1);
  const options: string[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    options.push((parts[i] ?? "").replace(/\s*(,|;|\bou)\s*$/i, "").replace(/\.$/, "").trim());
  }
  return { options, fixed: "" };
}

const WEAPON_SLOT = /qualquer (?:outra )?arma (simples|marcial)(?: corpo a corpo)?|qualquer arma corpo a corpo (simples|marcial)/i;

export interface WeaponSlot { category: Weapon["category"]; melee: boolean }

export function weaponSlot(text: string): WeaponSlot | null {
  const m = text.match(WEAPON_SLOT);
  if (!m) return null;
  const cat = (m[1] ?? m[2] ?? "").toLowerCase();
  return { category: cat === "simples" ? "Simples" : "Marcial", melee: /corpo a corpo/i.test(m[0]) };
}

export const weaponsForSlot = (slot: WeaponSlot) =>
  WEAPONS.filter((w) => w.category === slot.category && (!slot.melee || w.kind === "Corpo a corpo"));

export function applyWeapon(text: string, weaponName: string): string {
  return text.replace(WEAPON_SLOT, weaponName);
}

const NUMBER_WORDS: Record<string, number> = {
  um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10,
};

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function toItems(text: string, splitAnd = true): Item[] {
  const clean = text.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  const chunks = splitAnd ? clean.split(/\s+e\s+|,\s*/) : [clean];
  return chunks
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const digits = c.match(/^(\d+)\s+(.+)/);
      if (digits) return { name: cap(digits[2] ?? ""), quantity: Number(digits[1]) };
      const w = c.match(/^(\S+)\s+(.+)/);
      const q = w ? NUMBER_WORDS[norm(w[1] ?? "")] : undefined;
      if (w && q) return { name: cap(w[2] ?? ""), quantity: q };
      return { name: cap(c), quantity: 1 };
    });
}

export function matchArmor(name: string): ArmorItem | undefined {
  const n = norm(name);
  return ARMOR.find((a) => {
    const an = norm(a.name);
    return n === an || n === `armadura de ${an}` || n === `armadura ${an}`;
  });
}

export function matchWeapon(name: string): Weapon | undefined {
  const n = norm(name);
  return WEAPONS.find((w) => {
    const wn = norm(w.name);
    return n === wn || n === `${wn}s` || n === wn.replace(/a$/, "as") || n === wn.replace(/o$/, "os");
  });
}
