// Dados de exemplo coerentes com as regras reais de @repo/rules (D&D 5e PT-BR).
// Puro (sem Prisma): usado por seed.ts e verificável isoladamente.
import {
  ABILITIES, ARMOR, BACKGROUNDS, CLASSES, RACES, SPELLS, WEAPONS, abilityModifier, getSpell, proficiencyBonus,
  spellSlotsFor, type AbilityKey, type SkillKey,
} from "@repo/rules";

type Scores = Record<AbilityKey, number>;

interface Spec {
  id: string;
  owner: "jogador1" | "jogador2";
  name: string;
  raceId: string; subraceId?: string; classId: string; subclassId?: string; backgroundId: string;
  level: number;
  alignment: string;
  baseScores: Scores;            // antes dos bônus raciais (já com aumentos de atributo de nível)
  skills: SkillKey[];            // escolhas de classe (as do antecedente/raça são somadas)
  expertise?: SkillKey[];
  extraLanguages?: string[];
  chosenFeatures: string[];
  weaponNames: string[];
  armorName?: string; shield?: boolean;
  acBonus?: number; hpBonusPerLevel?: number;
  inventory: { name: string; quantity: number; max: number }[];
  cantrips?: string[]; known?: string[]; prepared?: string[];
  racialSpells?: string[];
  damageBonusAbility?: AbilityKey;
  currentHpLoss?: number;
  personality: { traits: string; ideals: string; bonds: string; flaws: string };
  appearance: string; backstory: string; notes: string;
}

const SPECS: Spec[] = [
  {
    id: "00000000-0000-0000-0000-000000000001", owner: "jogador1", name: "Brunor Martelo-de-Pedra",
    raceId: "anao", subraceId: "anao-da-colina", classId: "clerigo", subclassId: "vida", backgroundId: "acolito",
    level: 3, alignment: "Leal e Bom",
    baseScores: { str: 13, dex: 10, con: 14, int: 8, wis: 15, cha: 12 },
    skills: ["medicina", "persuasao"], extraLanguages: ["Élfico", "Celestial"],
    chosenFeatures: ["Domínio da Vida"],
    weaponNames: ["Maça", "Besta Leve"], armorName: "Cota de Malha", shield: true,
    inventory: [
      { name: "Símbolo sagrado", quantity: 1, max: 1 }, { name: "Livro de preces", quantity: 1, max: 1 },
      { name: "Incenso (varetas)", quantity: 5, max: 10 }, { name: "Mochila de aventureiro", quantity: 1, max: 1 },
      { name: "Virotes de besta", quantity: 20, max: 20 }, { name: "Ração de viagem (dias)", quantity: 5, max: 10 },
    ],
    cantrips: ["chama-sagrada", "guia", "taumaturgia"],
    prepared: ["bencao", "curar-ferimentos", "palavra-de-cura", "escudo-de-fe", "ajuda", "arma-espiritual"],
    personality: {
      traits: "Idolatro um herói da minha fé e cito suas histórias o tempo todo.",
      ideals: "Caridade. Sempre ajudo os necessitados, não importa o custo.",
      bonds: "Daria a vida para proteger o templo onde fui treinado.",
      flaws: "Confio demais em quem ocupa posição de autoridade.",
    },
    appearance: "Anão robusto de barba trançada cor de cobre, com um símbolo sagrado forjado no peitoral.",
    backstory: "Criado no templo de uma colina anã, Brunor deixou as montanhas para levar a cura aos viajantes.",
    notes: "Clérigo da Vida: cura em dobro nos aliados feridos.",
  },
  {
    id: "00000000-0000-0000-0000-000000000002", owner: "jogador2", name: "Elara Estrela-da-Tarde",
    raceId: "elfo", subraceId: "alto-elfo", classId: "mago", subclassId: "evocacao", backgroundId: "sabio",
    level: 5, alignment: "Neutro e Bom",
    baseScores: { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 },
    skills: ["investigacao", "intuicao"], extraLanguages: ["Dracônico", "Anão"],
    chosenFeatures: ["Tradição Arcana: Escola de Evocação", "Truque de alto elfo: Raio de Fogo"],
    weaponNames: ["Bordão", "Adaga"],
    inventory: [
      { name: "Grimório", quantity: 1, max: 1 }, { name: "Bolsa de componentes", quantity: 1, max: 1 },
      { name: "Tinta e pena", quantity: 1, max: 1 }, { name: "Pergaminho", quantity: 6, max: 10 },
      { name: "Poção de cura", quantity: 2, max: 5 },
    ],
    cantrips: ["luz", "mensagem", "maos-magicas", "prestidigitacao"],
    racialSpells: ["raio-de-fogo"],
    known: [
      "misseis-magicos", "escudo-arcano", "detectar-magia", "sono", "maos-flamejantes", "armadura-arcana",
      "invisibilidade", "teia", "levitacao", "bola-de-fogo", "contramagica", "voo", "relampago", "dissipar-magia",
    ],
    prepared: ["misseis-magicos", "escudo-arcano", "detectar-magia", "armadura-arcana", "teia", "bola-de-fogo", "contramagica", "voo"],
    personality: {
      traits: "Uso palavras longas para parecer ainda mais erudita.",
      ideals: "Conhecimento. O caminho para o poder e o autoaperfeiçoamento é o saber.",
      bonds: "Tenho um texto antigo que contém um terrível segredo e que não pode cair em mãos erradas.",
      flaws: "Fico tão absorta nos estudos que ignoro o perigo ao redor.",
    },
    appearance: "Elfa esguia de cabelos prateados, olhos cor de âmbar e vestes bordadas com constelações.",
    backstory: "Passou décadas na biblioteca de uma torre élfica antes de partir em busca de magias perdidas.",
    notes: "Escola de Evocação: Esculpir Magias protege aliados das próprias explosões.",
  },
  {
    id: "00000000-0000-0000-0000-000000000003", owner: "jogador1", name: "Gorak Punho-de-Ferro",
    raceId: "meio-orc", classId: "barbaro", subclassId: "furioso", backgroundId: "forasteiro",
    level: 4, alignment: "Caótico e Neutro",
    // Nível 4: Incremento no Valor de Habilidade (+2 FOR) já somado à base.
    baseScores: { str: 17, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
    skills: ["atletismo", "percepcao"], extraLanguages: ["Anão"],
    chosenFeatures: ["Caminho Primitivo: Furioso", "Incremento no Valor de Habilidade (nível 4): +2 Força"],
    weaponNames: ["Machado Grande", "Machadinha", "Azagaia"], shield: false,
    inventory: [
      { name: "Mochila de aventureiro", quantity: 1, max: 1 }, { name: "Machadinha de arremesso", quantity: 2, max: 4 },
      { name: "Azagaia", quantity: 4, max: 6 }, { name: "Troféu de caça (presa)", quantity: 1, max: 1 },
      { name: "Ração de viagem (dias)", quantity: 6, max: 10 },
    ],
    personality: {
      traits: "Sempre tenho uma história sobre a vez em que quase morri.",
      ideals: "Natureza. O mundo natural é mais importante que as cidades.",
      bonds: "Minha família, meu clã, é o que importa; devo vingar o que foi tirado de nós.",
      flaws: "Sou lento para confiar em membros de outras raças.",
    },
    appearance: "Meio-orc imenso, pele acinzentada, presas curtas e cicatrizes de garras no peito.",
    backstory: "Rejeitado por orcs e humanos, Gorak sobreviveu nas terras selvagens até encontrar um grupo que o aceitou.",
    notes: "Usa Fúria quando o combate esquenta.",
  },
  {
    id: "00000000-0000-0000-0000-000000000004", owner: "jogador1", name: "Pip Passo-Leve",
    raceId: "halfling", subraceId: "pes-leves", classId: "ladino", subclassId: "ladrao", backgroundId: "criminoso",
    level: 3, alignment: "Caótico e Neutro",
    baseScores: { str: 8, dex: 15, con: 14, int: 12, wis: 10, cha: 13 },
    skills: ["acrobacia", "percepcao", "prestidigitacao", "investigacao"],
    expertise: ["furtividade", "prestidigitacao"],
    chosenFeatures: ["Arquétipo de Ladino: Ladrão", "Especialização: Furtividade e Prestidigitação"],
    weaponNames: ["Rapieira", "Arco Curto", "Adaga"], armorName: "Couro",
    inventory: [
      { name: "Ferramentas de ladrão", quantity: 1, max: 1 }, { name: "Pé de cabra", quantity: 1, max: 1 },
      { name: "Capuz escuro", quantity: 1, max: 1 }, { name: "Flechas", quantity: 20, max: 20 },
      { name: "Bolsa com moedas", quantity: 1, max: 1 }, { name: "Adaga de reserva", quantity: 2, max: 3 },
    ],
    currentHpLoss: 4,
    personality: {
      traits: "Sempre tenho um plano para quando as coisas dão errado.",
      ideals: "Liberdade. As correntes existem para serem quebradas.",
      bonds: "Estou juntando dinheiro para pagar uma antiga dívida.",
      flaws: "Quando vejo algo valioso, não consigo pensar em outra coisa.",
    },
    appearance: "Halfling miúdo de olhos vivos, cabelo cacheado e dedos ágeis.",
    backstory: "Cresceu nas ruas de um porto e aprendeu cedo que bolsos mal guardados são convites.",
    notes: "Ataque Furtivo 2d6.",
  },
  {
    id: "00000000-0000-0000-0000-000000000005", owner: "jogador2", name: "Vesper Cinzas",
    raceId: "tiefling", classId: "bruxo", subclassId: "corruptor", backgroundId: "charlatao",
    level: 3, alignment: "Caótico e Bom",
    baseScores: { str: 8, dex: 13, con: 14, int: 10, wis: 12, cha: 15 },
    skills: ["arcanismo", "intimidacao"],
    chosenFeatures: ["Patrono: O Corruptor", "Dádiva do Pacto: Pacto da Lâmina", "Invocações Místicas: Armadura de Sombras, Visão do Diabo"],
    weaponNames: ["Rapieira", "Adaga"], armorName: "Couro",
    inventory: [
      { name: "Foco arcano (cajado)", quantity: 1, max: 1 }, { name: "Kit de disfarce", quantity: 1, max: 1 },
      { name: "Roupas finas", quantity: 1, max: 1 }, { name: "Bolsa de componentes", quantity: 1, max: 1 },
    ],
    cantrips: ["rajada-mistica", "toque-macabro"],
    known: ["bruxaria", "armadura-de-agathys", "escuridao", "imobilizar-pessoa"],
    racialSpells: ["taumaturgia", "repreensao-infernal"],
    personality: {
      traits: "Sou bom em descobrir o que as pessoas querem e ofereço exatamente isso.",
      ideals: "Independência. Não sou o brinquedo de ninguém, nem de patronos.",
      bonds: "Preciso quitar um pacto antes que ele me custe tudo.",
      flaws: "Não resisto a um bom golpe quando há dinheiro envolvido.",
    },
    appearance: "Tiefling de pele avermelhada, chifres curvos e olhos totalmente negros.",
    backstory: "Aplicou golpes em feiras até firmar um pacto com um poder infernal para escapar de uma dívida.",
    notes: "Espaços de Pacto: 2 de 2º nível, recuperados em descanso curto.",
  },
  {
    id: "00000000-0000-0000-0000-000000000006", owner: "jogador2", name: "Sir Aldric Valente",
    raceId: "humano", classId: "guerreiro", subclassId: "campeao", backgroundId: "soldado",
    level: 5, alignment: "Leal e Bom",
    // Nível 4: Incremento no Valor de Habilidade (+2 FOR) já somado à base.
    baseScores: { str: 17, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
    skills: ["percepcao", "sobrevivencia"], extraLanguages: ["Anão"],
    chosenFeatures: ["Estilo de Luta: Defesa", "Arquétipo Marcial: Campeão", "Incremento no Valor de Habilidade (nível 4): +2 Força"],
    weaponNames: ["Espada Longa", "Besta Leve", "Azagaia"], armorName: "Cota de Malha", shield: true, acBonus: 1,
    inventory: [
      { name: "Insígnia de patente", quantity: 1, max: 1 }, { name: "Jogo de dados", quantity: 1, max: 1 },
      { name: "Mochila de aventureiro", quantity: 1, max: 1 }, { name: "Poção de cura", quantity: 2, max: 5 },
      { name: "Virotes de besta", quantity: 20, max: 20 },
    ],
    personality: {
      traits: "Sou sempre educado e respeitoso.",
      ideals: "Responsabilidade. Faço o que devo e obedeço à autoridade justa.",
      bonds: "Ainda daria a vida pelas pessoas com quem servi.",
      flaws: "Tenho pouca paciência com quem não sabe seguir ordens.",
    },
    appearance: "Humano de ombros largos, cabelo curto grisalho e postura de veterano.",
    backstory: "Ex-capitão de uma guarnição de fronteira, deixou o exército para proteger quem o exército esquecera.",
    notes: "Campeão: Crítico Aprimorado (19-20).",
  },
];

const assertSpell = (id: string) => { if (!getSpell(id)) throw new Error(`Magia inexistente em @repo/rules: ${id}`); return id; };

export function buildCharacters() {
  return SPECS.map((s) => {
    const race = RACES.find((r) => r.id === s.raceId); if (!race) throw new Error(`raça ${s.raceId}`);
    const sub = race.subraces.find((x) => x.id === s.subraceId);
    const cls = CLASSES.find((c) => c.id === s.classId); if (!cls) throw new Error(`classe ${s.classId}`);
    const subclass = cls.subclasses.find((x) => x.id === s.subclassId);
    const bg = BACKGROUNDS.find((b) => b.id === s.backgroundId); if (!bg) throw new Error(`antecedente ${s.backgroundId}`);

    const final = {} as Scores;
    for (const a of ABILITIES) {
      final[a.key] = s.baseScores[a.key] + (race.abilityBonuses[a.key] ?? 0) + (sub?.abilityBonuses[a.key] ?? 0);
    }
    const mod = (k: AbilityKey) => abilityModifier(final[k]);
    const pb = proficiencyBonus(s.level);

    // PV: máximo no nível 1, média nos demais; Tenacidade Anã dá +1 por nível.
    const perLevel = cls.hitDie / 2 + 1;
    const hpExtra = s.subraceId === "anao-da-colina" ? s.level : 0;
    const maxHp = cls.hitDie + mod("con") + (s.level - 1) * (perLevel + mod("con")) + hpExtra;

    // CA
    let ac = 10 + mod("dex");
    if (s.armorName) {
      const armor = ARMOR.find((a) => a.name === s.armorName); if (!armor) throw new Error(`armadura ${s.armorName}`);
      const base = parseInt(armor.ac, 10);
      ac = armor.category === "Leve" ? base + mod("dex") : armor.category === "Média" ? base + Math.min(2, mod("dex")) : base;
    } else if (s.classId === "barbaro") {
      ac = 10 + mod("dex") + mod("con");
    }
    if (s.shield) ac += 2;
    ac += s.acBonus ?? 0;

    const skillSet = new Set<SkillKey>([...s.skills, ...bg.skills, ...(race.proficiencies?.skills ?? []), ...(sub?.proficiencies?.skills ?? [])]);
    const skillProficiencies = [...skillSet];
    const languages = [...new Set([...race.languages, ...(s.extraLanguages ?? [])])];
    const toolProficiencies = [...new Set([...cls.toolProficiencies, ...bg.tools.filter((t) => !t.startsWith("Um tipo")), ...(race.proficiencies?.tools ?? [])])];

    const features = [
      ...race.traits.filter((t) => !["Idiomas", "Deslocamento", "Traços Raciais Alternativos"].includes(t.name) && !t.name.startsWith("Variação")).map((t) => t.name),
      ...(sub?.traits.map((t) => t.name).filter((n) => n !== "Observação do Mestre") ?? []),
      ...cls.features.filter((f) => f.level <= s.level && f.name !== "Incremento no Valor de Habilidade").map((f) => f.name),
      ...(subclass?.features.filter((f) => f.level <= s.level).map((f) => f.name) ?? []),
      `${bg.name}: ${bg.feature.name}`,
    ];

    // Ataque/dano
    const weaponStat = (name: string) => {
      const w = WEAPONS.find((x) => x.name === name); if (!w) throw new Error(`arma ${name}`);
      const finesse = w.properties.includes("Acuidade");
      const ranged = w.kind === "À distância";
      const useDex = ranged || (finesse && mod("dex") > mod("str"));
      const m = useDex ? mod("dex") : mod("str");
      const dmg = w.damage.split(" ")[0] ?? "1d4";
      return { name, attack: pb + m, defense: 0, damage: m === 0 ? dmg : `${dmg}${m > 0 ? "+" : ""}${m}` };
    };
    const weapons = s.weaponNames.map(weaponStat);
    const equipment = [
      ...weapons.map(({ name, attack }) => ({ name, attack, defense: 0 })),
      ...(s.armorName ? [{ name: s.armorName, attack: 0, defense: parseInt(ARMOR.find((a) => a.name === s.armorName)!.ac, 10) }] : []),
      ...(s.shield ? [{ name: "Escudo", attack: 0, defense: 2 }] : []),
    ];
    const abilities = weapons.map((w) => ({ name: w.name, level: 0, cost: 0, damage: w.damage }));

    // Magias
    const cantrips = (s.cantrips ?? []).map(assertSpell);
    const known = (s.known ?? []).map(assertSpell);
    const racial = (s.racialSpells ?? []).map(assertSpell);
    const prepared = (s.prepared ?? []).map(assertSpell);
    const spellsKnown = [...new Set([...cantrips, ...racial, ...known, ...prepared])];
    const spellsPrepared = prepared;
    const sc = cls.spellcasting;
    const slots = sc ? spellSlotsFor(sc.kind, s.level) : [];
    const spellNames = spellsKnown.map((id) => getSpell(id)!.name);

    const xp = [0, 300, 900, 2700, 6500][s.level - 1] ?? 0;
    const sheet = {
      raceId: s.raceId, subraceId: s.subraceId, classId: s.classId, subclassId: s.subclassId, backgroundId: s.backgroundId,
      baseScores: s.baseScores,
      skillProficiencies, skillExpertise: s.expertise ?? [],
      savingThrowProficiencies: cls.savingThrows,
      languages, toolProficiencies,
      inspiration: false, deathSaves: { successes: 0, failures: 0 }, hitDiceUsed: 0,
      spellsKnown, spellsPrepared, spellSlotsUsed: slots.map(() => 0),
      personality: s.personality, appearance: s.appearance, backstory: s.backstory,
      chosenFeatures: s.chosenFeatures,
    };

    const skillsJson = Object.fromEntries(skillProficiencies.map((k) => [k, true]));
    return {
      id: s.id, owner: s.owner,
      data: {
        name: s.name, race: sub ? `${race.name} (${sub.name})` : race.name, class: cls.name, level: s.level,
        background: bg.name, alignment: s.alignment, experience: xp,
        strength: final.str, dexterity: final.dex, constitution: final.con,
        intelligence: final.int, wisdom: final.wis, charisma: final.cha,
        strengthModifier: mod("str"), dexterityModifier: mod("dex"), constitutionModifier: mod("con"),
        intelligenceModifier: mod("int"), wisdomModifier: mod("wis"), charismaModifier: mod("cha"),
        maxHitPoints: maxHp, currentHitPoints: maxHp - (s.currentHpLoss ?? 0), temporaryHitPoints: 0,
        maxMana: 0, currentMana: 0, armorClass: ac,
        skills: skillsJson,
        proficiencies: [...cls.armorProficiencies, ...cls.weaponProficiencies, ...(race.proficiencies?.weapons ?? []), ...(sub?.proficiencies?.weapons ?? [])],
        equipment, abilities, inventory: s.inventory,
        spells: spellNames, features,
        notes: s.notes,
        customData: { sheet },
      },
    };
  });
}
