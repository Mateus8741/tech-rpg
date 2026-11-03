// Lógica pura de derivação do wizard: nenhuma dependência de React.
import {
  ABILITIES, POINT_BUY_BUDGET, POINT_BUY_COST, SKILLS, STANDARD_ARRAY, XP_BY_LEVEL, abilityModifier,
  getBackground, getClass, getRace, spellSlotsFor, spellsForClass,
  type AbilityKey, type Background, type ClassDef, type Race, type SkillKey, type Spell,
  type SpellcastingInfo, type Subclass, type Subrace,
} from "@repo/rules";
import type { Character } from "@/lib/api";
import { emptySheet, type SheetData } from "@/lib/sheet";
import {
  applyWeapon, matchArmor, matchWeapon, norm, parseEquipLine, toItems, weaponSlot, weaponsForSlot, type Item,
} from "./equipment";
import type { AbMap, StepId, WizardState } from "./state";

export const LANGUAGES = [
  "Comum", "Anão", "Élfico", "Gigante", "Gnômico", "Goblin", "Halfling", "Orc",
  "Abissal", "Celestial", "Dracônico", "Língua Profunda", "Infernal", "Primordial", "Silvestre", "Subcomum",
];

export const ABILITY_NAME = Object.fromEntries(ABILITIES.map((a) => [a.key, a.name])) as Record<AbilityKey, string>;
export const ABILITY_ABBR = Object.fromEntries(ABILITIES.map((a) => [a.key, a.abbr])) as Record<AbilityKey, string>;
export const SKILL_NAME = Object.fromEntries(SKILLS.map((s) => [s.key, s.name])) as Record<SkillKey, string>;

// ───────────── Seletores básicos ─────────────
export const raceOf = (s: WizardState): Race | undefined => getRace(s.raceId);
export const subraceOf = (s: WizardState): Subrace | undefined => raceOf(s)?.subraces.find((x) => x.id === s.subraceId);
export const classOf = (s: WizardState): ClassDef | undefined => getClass(s.classId);
export const subclassOf = (s: WizardState): Subclass | undefined =>
  classOf(s)?.subclasses.find((x) => x.id === s.subclassId);
export const backgroundOf = (s: WizardState): Background | undefined => getBackground(s.backgroundId);

/** Nível em que a classe escolhe a subclasse (undefined se não tem). */
export const subclassLevel = (c?: ClassDef) => (c?.subclasses.length ? Math.min(...c.subclasses.map((x) => x.level)) : undefined);
export const subclassRequired = (s: WizardState) => {
  const lv = subclassLevel(classOf(s));
  return lv !== undefined && s.level >= lv;
};

export function extraLanguageCount(race?: Race, sub?: Subrace) {
  const subExtra = sub?.traits.some((t) => /idioma adicional/i.test(t.name + " " + t.description) && /idioma/i.test(t.name)) ? 1 : 0;
  return (race?.extraLanguages ?? 0) + subExtra;
}
export const raceSkillPickCount = (race?: Race) => (race?.id === "meio-elfo" ? 2 : 0);

export function racialBonuses(s: WizardState): Partial<Record<AbilityKey, number>> {
  const race = raceOf(s), sub = subraceOf(s);
  const out: Partial<Record<AbilityKey, number>> = {};
  const add = (k: AbilityKey, n: number) => { out[k] = (out[k] ?? 0) + n; };
  for (const [k, n] of Object.entries(race?.abilityBonuses ?? {})) add(k as AbilityKey, n as number);
  for (const [k, n] of Object.entries(sub?.abilityBonuses ?? {})) add(k as AbilityKey, n as number);
  if (race?.abilityChoice) for (const k of s.racialPicks.slice(0, race.abilityChoice.count)) add(k, race.abilityChoice.amount);
  return out;
}

// ───────────── Atributos ─────────────
export const pointBuySpent = (pb: AbMap<number>) => ABILITIES.reduce((n, a) => n + (POINT_BUY_COST[pb[a.key]] ?? 0), 0);
export const rollTotal = (dice: number[]) => dice.reduce((a, b) => a + b, 0) - Math.min(...dice);

export function baseScores(s: WizardState): AbMap<number> {
  const out = {} as AbMap<number>;
  for (const a of ABILITIES) {
    let v: number | null | undefined;
    if (s.abilityMode === "standard") v = s.standard[a.key];
    else if (s.abilityMode === "pointbuy") v = s.pointBuy[a.key];
    else { const i = s.rollAssign[a.key]; v = i == null || !s.rolls[i] ? null : rollTotal(s.rolls[i]); }
    out[a.key] = v ?? 10;
  }
  return out;
}

export function finalScores(s: WizardState): AbMap<number> {
  const base = baseScores(s), bonus = racialBonuses(s), out = {} as AbMap<number>;
  for (const a of ABILITIES) out[a.key] = Math.min(20, base[a.key] + (bonus[a.key] ?? 0));
  return out;
}

export function abilitiesComplete(s: WizardState): boolean {
  if (s.abilityMode === "standard") {
    const vals = ABILITIES.map((a) => s.standard[a.key]);
    return vals.every((v) => v != null) && new Set(vals).size === STANDARD_ARRAY.length;
  }
  if (s.abilityMode === "pointbuy") return pointBuySpent(s.pointBuy) <= POINT_BUY_BUDGET;
  const idx = ABILITIES.map((a) => s.rollAssign[a.key]);
  return s.rolls.length === 6 && idx.every((i) => i != null) && new Set(idx).size === 6;
}

// ───────────── Perícias, idiomas, ferramentas ─────────────
export function fixedSkills(s: WizardState): SkillKey[] {
  const race = raceOf(s), sub = subraceOf(s), bg = backgroundOf(s);
  return [...new Set<SkillKey>([
    ...(race?.proficiencies?.skills ?? []), ...(sub?.proficiencies?.skills ?? []), ...(bg?.skills ?? []),
  ])];
}
export function allSkills(s: WizardState): SkillKey[] {
  const cls = classOf(s);
  return [...new Set<SkillKey>([
    ...fixedSkills(s), ...s.raceSkills.slice(0, raceSkillPickCount(raceOf(s))),
    ...s.classSkills.slice(0, cls?.skillChoices.count ?? 0),
  ])];
}
/** Perícias que não podem ser escolhidas numa fonte, por já virem de outra. */
export function skillsTakenOutside(s: WizardState, source: "race" | "class"): SkillKey[] {
  return [...fixedSkills(s), ...(source === "race" ? s.classSkills : s.raceSkills)];
}

export function allLanguages(s: WizardState): string[] {
  const race = raceOf(s);
  return [...new Set([...(race?.languages ?? []), ...s.raceLanguages, ...s.bgLanguages])];
}

export function allTools(s: WizardState): string[] {
  return [...new Set([
    ...(classOf(s)?.toolProficiencies ?? []), ...(backgroundOf(s)?.tools ?? []),
    ...(raceOf(s)?.proficiencies?.tools ?? []), ...(subraceOf(s)?.proficiencies?.tools ?? []),
  ])];
}

// ───────────── Magias ─────────────
export interface SpellPlan {
  sc: SpellcastingInfo;
  mode: "known" | "prepared" | "book";
  cantrips: number;
  /** nº de magias de 1º nível+ a conhecer (known/book) */
  known: number;
  /** nº de magias a preparar (prepared/book) */
  prepared: number;
  maxLevel: number;
  cantripList: Spell[];
  spellList: Spell[];
}

export function spellPlan(s: WizardState): SpellPlan | null {
  const cls = classOf(s);
  if (!cls) return null;
  const sub = subclassOf(s) as (Subclass & { spellcasting?: SpellcastingInfo }) | undefined;
  const sc = cls.spellcasting ?? (sub && s.level >= sub.level ? sub.spellcasting : undefined);
  if (!sc) return null;
  const lvl = s.level;
  const mod = abilityModifier(finalScores(s)[sc.ability]);
  const cantrips = sc.cantripsKnown?.[lvl - 1] ?? 0;
  const maxLevel = sc.kind === "pact" ? Math.min(5, Math.ceil(lvl / 2)) : spellSlotsFor(sc.kind, lvl).length;
  let mode: SpellPlan["mode"] = "known", known = 0, prepared = 0;
  if (sc.preparesSpells) {
    if (cls.id === "mago") { mode = "book"; known = 6 + 2 * (lvl - 1); prepared = Math.max(1, lvl + mod); }
    else { mode = "prepared"; prepared = Math.max(1, (sc.kind === "half" ? Math.floor(lvl / 2) : lvl) + mod); }
  } else known = sc.spellsKnown?.[lvl - 1] ?? 0;
  if (maxLevel === 0) { known = 0; prepared = 0; }
  if (cantrips === 0 && known === 0 && prepared === 0) return null;
  const list = spellsForClass(sc.kind === "third" ? "mago" : cls.id, maxLevel);
  return {
    sc, mode, cantrips, known, prepared, maxLevel,
    cantripList: list.filter((x) => x.level === 0),
    spellList: list.filter((x) => x.level >= 1),
  };
}

/** Escolhas de magia válidas e dentro dos limites. */
export function resolvedSpells(s: WizardState) {
  const plan = spellPlan(s);
  if (!plan) return { cantrips: [] as string[], spells: [] as string[], prepared: [] as string[], plan };
  const okC = new Set(plan.cantripList.map((x) => x.id)), okS = new Set(plan.spellList.map((x) => x.id));
  const cantrips = s.cantrips.filter((id) => okC.has(id)).slice(0, plan.cantrips);
  const spells = s.spells.filter((id) => okS.has(id)).slice(0, plan.mode === "prepared" ? plan.prepared : plan.known);
  const prepared = plan.mode === "book" ? s.prepared.filter((id) => spells.includes(id)).slice(0, plan.prepared) : [];
  return { cantrips, spells, prepared, plan };
}

// ───────────── Equipamento ─────────────
export interface ResolvedLine { index: number; text: string; slot: ReturnType<typeof weaponSlot> }

export function classEquipmentLines(s: WizardState): ResolvedLine[] {
  const cls = classOf(s);
  if (!cls) return [];
  return cls.startingEquipment.map((line, index) => {
    const p = parseEquipLine(line);
    const text = p.options ? p.options[Math.min(s.equipChoices[index] ?? 0, p.options.length - 1)] ?? "" : p.fixed;
    const slot = weaponSlot(text);
    return { index, text: slot ? applyWeapon(text, s.equipWeapons[index] ?? weaponsForSlot(slot)[0]?.name ?? "arma") : text, slot };
  });
}

export function startingItems(s: WizardState): Item[] {
  const items: Item[] = [];
  for (const l of classEquipmentLines(s)) items.push(...toItems(l.text));
  for (const e of backgroundOf(s)?.equipment ?? []) items.push(...toItems(e, false));
  const merged = new Map<string, Item>();
  for (const it of items) {
    const prev = merged.get(norm(it.name));
    if (prev) prev.quantity += it.quantity; else merged.set(norm(it.name), { ...it });
  }
  return [...merged.values()];
}

function computeArmorClass(s: WizardState, items: Item[], scores: AbMap<number>): number {
  const dex = abilityModifier(scores.dex);
  let armor: ReturnType<typeof matchArmor>;
  let shield = false;
  for (const it of items) {
    const a = matchArmor(it.name);
    if (!a) continue;
    if (a.category === "Escudo") shield = true;
    else if (!armor) armor = a;
  }
  let ac = 10 + dex;
  if (armor) {
    const base = parseInt(armor.ac, 10);
    ac = armor.category === "Leve" ? base + dex : armor.category === "Média" ? base + Math.min(dex, 2) : base;
  } else if (s.classId === "barbaro") ac = 10 + dex + abilityModifier(scores.con);
  else if (s.classId === "monge" && !shield) ac = 10 + dex + abilityModifier(scores.wis);
  return ac + (shield ? 2 : 0);
}

// ───────────── Pontos de vida ─────────────
export function hitPointsFor(s: WizardState, scores: AbMap<number>): number {
  const cls = classOf(s);
  const hd = cls?.hitDie ?? 8, con = abilityModifier(scores.con);
  let hp = Math.max(1, hd + con);
  for (let l = 2; l <= s.level; l++) hp += Math.max(1, Math.floor(hd / 2) + 1 + con);
  if (subraceOf(s)?.id === "anao-da-colina") hp += s.level;
  return hp;
}

// ───────────── Características ─────────────
export interface FeatureOut { name: string; description: string; source: string }

export function featuresFor(s: WizardState): FeatureOut[] {
  const out: FeatureOut[] = [];
  const race = raceOf(s), sub = subraceOf(s), cls = classOf(s), subc = subclassOf(s), bg = backgroundOf(s);
  const skip = new Set(["Idiomas", "Deslocamento", "Aumento no Valor de Habilidade"]);
  for (const t of race?.traits ?? []) if (!skip.has(t.name)) out.push({ ...t, source: `Raça: ${race!.name}` });
  for (const t of sub?.traits ?? []) if (!skip.has(t.name)) out.push({ ...t, source: `Sub-raça: ${sub!.name}` });
  for (const f of cls?.features ?? []) if (f.level <= s.level) out.push({ name: f.name, description: f.description, source: `Classe: ${cls!.name} (nível ${f.level})` });
  if (subc && s.level >= subc.level) {
    for (const f of subc.features) if (f.level <= s.level) out.push({ name: f.name, description: f.description, source: `${cls!.subclassLabel}: ${subc.name} (nível ${f.level})` });
  }
  if (bg) out.push({ ...bg.feature, source: `Antecedente: ${bg.name}` });
  return out;
}

// ───────────── Validação por passo ─────────────
export function activeSteps(s: WizardState): StepId[] {
  const steps: StepId[] = ["race", "class", "background", "abilities"];
  if (spellPlan(s)) steps.push("spells");
  steps.push("details");
  return steps;
}

export function stepErrors(s: WizardState, step: StepId): string[] {
  const errs: string[] = [];
  const race = raceOf(s), cls = classOf(s), bg = backgroundOf(s);
  if (step === "race") {
    if (!race) return ["Escolha uma raça."];
    if (race.subraces.length && !s.subraceId) errs.push("Escolha uma sub-raça.");
    if (race.abilityChoice && s.racialPicks.length < race.abilityChoice.count)
      errs.push(`Escolha ${race.abilityChoice.count} atributos para o bônus racial.`);
    const extra = extraLanguageCount(race, subraceOf(s));
    if (s.raceLanguages.length < extra) errs.push(`Escolha ${extra} idioma(s) extra(s).`);
    const sk = raceSkillPickCount(race);
    if (s.raceSkills.length < sk) errs.push(`Escolha ${sk} perícias.`);
  } else if (step === "class") {
    if (!cls) return ["Escolha uma classe."];
    if (s.level < 1 || s.level > 20) errs.push("Nível deve estar entre 1 e 20.");
    if (s.classSkills.length < cls.skillChoices.count) errs.push(`Escolha ${cls.skillChoices.count} perícias de classe.`);
    if (subclassRequired(s) && !s.subclassId) errs.push(`Escolha ${cls.subclassLabel.toLowerCase()}.`);
  } else if (step === "background") {
    if (!bg) return ["Escolha um antecedente."];
    if (s.bgLanguages.length < bg.languages) errs.push(`Escolha ${bg.languages} idioma(s).`);
  } else if (step === "abilities") {
    if (!abilitiesComplete(s)) {
      errs.push(
        s.abilityMode === "standard" ? "Distribua todos os valores do array padrão."
          : s.abilityMode === "pointbuy" ? "Você gastou mais de 27 pontos."
          : "Role os dados e atribua os seis resultados.",
      );
    }
  } else if (step === "spells") {
    const r = resolvedSpells(s);
    if (r.plan) {
      if (r.cantrips.length < Math.min(r.plan.cantrips, r.plan.cantripList.length)) errs.push(`Escolha ${r.plan.cantrips} truque(s).`);
      const need = r.plan.mode === "prepared" ? r.plan.prepared : r.plan.known;
      if (r.spells.length < Math.min(need, r.plan.spellList.length)) errs.push(`Escolha ${need} magia(s).`);
      if (r.plan.mode === "book" && r.prepared.length < Math.min(r.plan.prepared, r.spells.length)) errs.push(`Prepare ${r.plan.prepared} magia(s) do grimório.`);
    }
  } else if (step === "details") {
    if (!s.name.trim()) errs.push("Dê um nome ao personagem.");
    if (!s.alignment) errs.push("Escolha uma tendência.");
  }
  return errs;
}

// ───────────── Payload final ─────────────
const MOD_FIELDS = {
  str: "strengthModifier", dex: "dexterityModifier", con: "constitutionModifier",
  int: "intelligenceModifier", wis: "wisdomModifier", cha: "charismaModifier",
} as const;

export function proficiencyStrings(s: WizardState): string[] {
  const cls = classOf(s), race = raceOf(s), sub = subraceOf(s);
  const out: string[] = [];
  for (const k of cls?.savingThrows ?? []) out.push(`Salvaguarda: ${ABILITY_NAME[k]}`);
  for (const a of cls?.armorProficiencies ?? []) out.push(`Armadura: ${a}`);
  for (const w of [...(cls?.weaponProficiencies ?? []), ...(race?.proficiencies?.weapons ?? []), ...(sub?.proficiencies?.weapons ?? [])]) out.push(`Arma: ${w}`);
  for (const a of [...(race?.proficiencies?.armor ?? []), ...(sub?.proficiencies?.armor ?? [])]) out.push(`Armadura: ${a}`);
  for (const t of allTools(s)) out.push(`Ferramenta: ${t}`);
  for (const k of allSkills(s)) out.push(`Perícia: ${SKILL_NAME[k]}`);
  for (const l of allLanguages(s)) out.push(`Idioma: ${l}`);
  return [...new Set(out)];
}

export interface BuiltCharacter extends Partial<Character> {
  customData: { sheet: SheetData };
}

export function buildCharacterPayload(s: WizardState): BuiltCharacter {
  const race = raceOf(s), sub = subraceOf(s), cls = classOf(s), bg = backgroundOf(s);
  const scores = finalScores(s);
  const items = startingItems(s);
  const hp = hitPointsFor(s, scores);
  const { cantrips, spells, prepared } = resolvedSpells(s);
  const known = [...cantrips, ...spells];

  const equipment: NonNullable<Character["equipment"]> = [];
  for (const it of items) {
    const a = matchArmor(it.name), w = matchWeapon(it.name);
    if (a) equipment.push({ name: a.name, defense: parseInt(a.ac, 10) || 0 });
    else if (w) equipment.push({ name: w.name });
  }

  const sheet: SheetData = {
    ...emptySheet(),
    raceId: s.raceId, subraceId: s.subraceId || undefined,
    classId: s.classId, subclassId: s.subclassId || undefined, backgroundId: s.backgroundId,
    baseScores: baseScores(s),
    skillProficiencies: allSkills(s),
    savingThrowProficiencies: cls?.savingThrows ?? [],
    languages: allLanguages(s), toolProficiencies: allTools(s),
    spellsKnown: known, spellsPrepared: prepared.length ? prepared : (spellPlan(s)?.mode === "prepared" ? spells : []),
    spellSlotsUsed: Array.from({ length: spellPlan(s)?.maxLevel ?? 0 }, () => 0),
    personality: { ...s.personality },
    appearance: s.appearance, backstory: s.backstory,
    chosenFeatures: race?.abilityChoice && s.racialPicks.length
      ? [`${race.name}: +${race.abilityChoice.amount} em ${s.racialPicks.map((k) => ABILITY_NAME[k]).join(", ")}`]
      : [],
  };

  const payload: BuiltCharacter = {
    name: s.name.trim(),
    race: race ? (sub ? `${race.name} (${sub.name})` : race.name) : "",
    class: cls?.name ?? "",
    level: s.level,
    background: bg?.name,
    alignment: s.alignment || undefined,
    experience: XP_BY_LEVEL[Math.min(Math.max(s.level, 1), 20) - 1] ?? 0,
    strength: scores.str, dexterity: scores.dex, constitution: scores.con,
    intelligence: scores.int, wisdom: scores.wis, charisma: scores.cha,
    strengthModifier: 0, dexterityModifier: 0, constitutionModifier: 0,
    intelligenceModifier: 0, wisdomModifier: 0, charismaModifier: 0,
    maxHitPoints: hp, currentHitPoints: hp, temporaryHitPoints: 0,
    maxMana: 0, currentMana: 0,
    armorClass: computeArmorClass(s, items, scores),
    proficiencies: proficiencyStrings(s),
    features: featuresFor(s),
    spells: known,
    equipment,
    inventory: items.map((i) => ({ name: i.name, quantity: i.quantity, max: i.quantity })),
    customData: { sheet },
  };
  for (const a of ABILITIES) (payload as unknown as Record<string, unknown>)[MOD_FIELDS[a.key]] = abilityModifier(scores[a.key]);
  return payload;
}

export const speedOf = (s: WizardState) => subraceOf(s)?.speed ?? raceOf(s)?.speed ?? 9;

export const bonusText = (b: Partial<Record<AbilityKey, number>>) =>
  Object.entries(b).map(([k, n]) => `${ABILITY_ABBR[k as AbilityKey]} ${(n as number) >= 0 ? "+" : ""}${n}`).join(", ");
