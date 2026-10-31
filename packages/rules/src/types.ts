// Tipos das regras de D&D 5e (PT-BR). Fonte: PDFs em ~/Library/Mobile Documents/com~apple~CloudDocs/D&D
// Todo texto de regra fica em português, exatamente como nos livros.

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type SkillKey =
  | "acrobacia" | "adestrarAnimais" | "arcanismo" | "atletismo" | "atuacao"
  | "enganacao" | "furtividade" | "historia" | "intimidacao" | "intuicao"
  | "investigacao" | "medicina" | "natureza" | "percepcao" | "persuasao"
  | "prestidigitacao" | "religiao" | "sobrevivencia";

export type Size = "Miúdo" | "Pequeno" | "Médio" | "Grande";

export interface Trait {
  name: string;
  description: string;
}

export interface Race {
  id: string;              // slug: "anao", "elfo", "meio-orc"...
  name: string;            // "Anão"
  summary: string;         // 1-2 frases
  abilityBonuses: Partial<Record<AbilityKey, number>>;
  /** Quando a raça dá "+1 em dois atributos à escolha" etc. */
  abilityChoice?: { count: number; amount: number; exclude?: AbilityKey[] };
  age: string;
  alignment: string;
  size: Size;
  sizeNote: string;        // altura/peso
  speed: number;           // metros (ex.: 9)
  languages: string[];
  extraLanguages?: number;
  traits: Trait[];
  /** Perícias/armas/ferramentas fixas concedidas */
  proficiencies?: { skills?: SkillKey[]; weapons?: string[]; armor?: string[]; tools?: string[] };
  subraces: Subrace[];
}

export interface Subrace {
  id: string;
  name: string;
  abilityBonuses: Partial<Record<AbilityKey, number>>;
  traits: Trait[];
  speed?: number;          // sobrescreve a da raça se definido
  proficiencies?: Race["proficiencies"];
}

export interface ClassFeature {
  level: number;
  name: string;
  description: string;
}

export interface Subclass {
  id: string;
  name: string;            // "Campeão"
  level: number;           // nível em que é escolhida
  description: string;
  features: ClassFeature[];
}

export interface SpellcastingInfo {
  ability: AbilityKey;
  kind: "full" | "half" | "third" | "pact";
  /** Truques conhecidos por nível (índice 0 = nível 1). Omitir se não tem. */
  cantripsKnown?: number[];
  /** Magias conhecidas por nível (classes "conhecidas": bardo, feiticeiro...). */
  spellsKnown?: number[];
  /** true se prepara magias da lista (clérigo, druida, mago, paladino). */
  preparesSpells: boolean;
  ritualCasting?: boolean;
  focus?: string;
}

export interface ClassDef {
  id: string;              // "guerreiro"
  name: string;            // "Guerreiro"
  summary: string;
  hitDie: 6 | 8 | 10 | 12;
  primaryAbilities: AbilityKey[];
  savingThrows: AbilityKey[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  skillChoices: { count: number; from: SkillKey[] | "any" };
  startingEquipment: string[];   // linhas de texto
  features: ClassFeature[];      // todos os níveis 1-20
  subclassLabel: string;         // "Arquétipo Marcial"
  subclasses: Subclass[];
  spellcasting?: SpellcastingInfo;
  /** Colunas extras da tabela de progressão (ex.: "Fúria", "Dano de Fúria", "Pontos de Ki"). */
  progressionColumns?: { label: string; values: (string | number)[] }[];
}

export interface Background {
  id: string;
  name: string;            // "Acólito"
  summary: string;
  skills: SkillKey[];
  tools: string[];
  languages: number;       // idiomas à escolha
  equipment: string[];
  feature: Trait;          // característica do antecedente
  personality: { traits: string[]; ideals: string[]; bonds: string[]; flaws: string[] };
}

export type SpellSchool =
  | "Abjuração" | "Conjuração" | "Adivinhação" | "Encantamento"
  | "Evocação" | "Ilusão" | "Necromancia" | "Transmutação";

export interface Spell {
  id: string;              // slug
  name: string;
  level: number;           // 0 = truque
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: { v: boolean; s: boolean; m?: string };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  classes: string[];       // ids de classe: ["mago","feiticeiro"]
  description: string;
  atHigherLevels?: string;
  source?: string;
}

export interface Weapon {
  name: string;
  category: "Simples" | "Marcial";
  kind: "Corpo a corpo" | "À distância";
  damage: string;          // "1d8 cortante"
  cost: string;
  weight: string;
  properties: string[];
}

export interface ArmorItem {
  name: string;
  category: "Leve" | "Média" | "Pesada" | "Escudo";
  ac: string;              // "11 + Des"
  strengthReq?: number;
  stealthDisadvantage: boolean;
  cost: string;
  weight: string;
}

export interface Condition {
  id: string;
  name: string;
  description: string[];
}
