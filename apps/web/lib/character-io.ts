// Exportar/importar fichas em JSON versionado (puro, sem dependências de UI).
import type { Character } from "@/lib/api";

export const EXPORT_FORMAT = "rpg-character";
export const EXPORT_VERSION = 1;

const OMIT = ["id", "userId", "createdAt", "updatedAt", "user"] as const;
export type ExportedCharacter = Partial<Omit<Character, (typeof OMIT)[number]>>;

export interface CharacterExport {
  format: typeof EXPORT_FORMAT;
  version: number;
  exportedAt: string;
  character: ExportedCharacter;
}

export function exportCharacter(c: Character): CharacterExport {
  const copy: Record<string, unknown> = { ...c };
  for (const k of OMIT) delete copy[k];
  return { format: EXPORT_FORMAT, version: EXPORT_VERSION, exportedAt: new Date().toISOString(), character: copy as ExportedCharacter };
}

/** Nome de arquivo seguro para o download. */
export const exportFileName = (c: Pick<Character, "name">) =>
  `${(c.name || "ficha").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "ficha"}.rpg.json`;

const ABILITY_FIELDS = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] as const;
const INT_FIELDS = [
  "level", "experience", ...ABILITY_FIELDS,
  "strengthModifier", "dexterityModifier", "constitutionModifier", "intelligenceModifier", "wisdomModifier", "charismaModifier",
  "maxHitPoints", "currentHitPoints", "temporaryHitPoints", "maxMana", "currentMana", "armorClass",
] as const;
const STRING_FIELDS = ["name", "race", "class", "background", "alignment", "notes"] as const;
const ARRAY_FIELDS = ["proficiencies", "equipment", "abilities", "inventory", "spells", "features"] as const;
const OBJECT_FIELDS = ["skills", "combatStatus", "customData"] as const;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

export type ParseResult = { ok: true; character: ExportedCharacter } | { ok: false; error: string };

/** Lê e valida o texto de um arquivo de ficha. Nunca lança. */
export function parseCharacterFile(text: string): ParseResult {
  let raw: unknown;
  try { raw = JSON.parse(text); } catch { return { ok: false, error: "O arquivo não é um JSON válido." }; }
  if (!isObj(raw) || raw.format !== EXPORT_FORMAT) return { ok: false, error: "Formato não reconhecido (esperado rpg-character)." };
  if (typeof raw.version !== "number" || !Number.isInteger(raw.version)) return { ok: false, error: "Versão do arquivo ausente ou inválida." };
  if (raw.version > EXPORT_VERSION) return { ok: false, error: `Versão ${raw.version} não suportada (máx. ${EXPORT_VERSION}).` };
  if (!isObj(raw.character)) return { ok: false, error: "Arquivo sem dados de personagem." };
  const src = raw.character;

  const out: Record<string, unknown> = {};
  if (typeof src.name !== "string" || !src.name.trim()) return { ok: false, error: "A ficha precisa ter um nome." };
  for (const f of STRING_FIELDS) {
    const v = src[f];
    if (v === undefined || v === null) continue;
    if (typeof v !== "string") return { ok: false, error: `Campo ${f} deve ser texto.` };
    out[f] = v;
  }
  for (const f of INT_FIELDS) {
    const v = src[f];
    if (v === undefined) continue;
    if (typeof v !== "number" || !Number.isInteger(v)) return { ok: false, error: `Campo ${f} deve ser um inteiro.` };
    out[f] = v;
  }
  const level = out.level as number | undefined;
  if (level !== undefined && (level < 1 || level > 20)) return { ok: false, error: "Nível deve estar entre 1 e 20." };
  for (const f of ABILITY_FIELDS) {
    const v = out[f] as number | undefined;
    if (v !== undefined && (v < 1 || v > 30)) return { ok: false, error: `Atributo ${f} deve estar entre 1 e 30.` };
  }
  for (const f of ARRAY_FIELDS) {
    const v = src[f];
    if (v === undefined || v === null) continue;
    if (!Array.isArray(v)) return { ok: false, error: `Campo ${f} deve ser uma lista.` };
    out[f] = v;
  }
  for (const f of OBJECT_FIELDS) {
    const v = src[f];
    if (v === undefined || v === null) continue;
    if (!isObj(v)) return { ok: false, error: `Campo ${f} deve ser um objeto.` };
    out[f] = v;
  }
  return { ok: true, character: out as ExportedCharacter };
}
