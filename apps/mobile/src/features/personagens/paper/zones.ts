// Zonas tocáveis da ficha de papel (coordenadas em pt, página 612x792) e o texto explicativo de cada uma.
import type { IconName } from '@/components/ui';

export type Rect = { x: number; y: number; w: number; h: number };

export type AbilityInfo = { key: string; name: string; abbr: string; score: number; mod: number; save: number; saveProficient: boolean };

/** Valores reais do personagem usados para personalizar a explicação ("No seu personagem"). */
export type ZoneCtx = {
  name: string;
  classLabel: string;
  raceLabel: string;
  background: string;
  player: string;
  alignment: string;
  xp: number;
  level: number;
  pb: number;
  ac: number;
  init: number;
  speed: string;
  hp: number;
  maxHp: number;
  tempHp: number;
  hitDice: string;
  passive: number;
  inspiration: boolean;
  deathSaves: { successes: number; failures: number };
  abilities: AbilityInfo[];
  skills: { key: string; name: string; bonus: number; proficient: boolean; expertise: boolean }[];
  attacks: { name: string; bonus: string; damage: string }[];
  equipLines: string[];
  languages: string[];
  features: string[];
  coins: { cp?: number; sp?: number; gp?: number; pp?: number };
  casterLabel: string;
  cm: number[] | null;
  cmTotal: number | null;
  slots: number[];
  slotsUsed: number[];
  spellsByLevel: Record<number, { name: string; prepared: boolean }[]>;
};

export type Zone = {
  id: string;
  page: 1 | 2;
  r: Rect;
  title: string;
  icon: IconName;
  /** O que é, em uma frase. */
  what: string;
  /** Como funciona / o que tem aqui. */
  how: string[];
  /** Dica de jogo opcional. */
  tip?: string;
  /** Linhas com os valores reais deste personagem. */
  mine?: (x: ZoneCtx) => string[];
};

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

const ABILITY_TEXT: Record<string, { what: string; how: string[]; tip: string }> = {
  str: {
    what: 'Mede a força bruta e o poder físico do personagem.',
    how: [
      'Soma-se ao ataque e ao dano de armas corpo a corpo (exceto armas com acuidade).',
      'Usada em testes de Atletismo (escalar, nadar, empurrar, agarrar) e em testes de resistência de Força.',
      'Define a carga que você consegue carregar sem sofrer penalidades.',
    ],
    tip: 'Bárbaros, guerreiros e paladinos costumam priorizá-la.',
  },
  dex: {
    what: 'Mede agilidade, reflexos e equilíbrio.',
    how: [
      'Entra na Iniciativa e na Classe de Armadura (limitada por armaduras médias e pesadas).',
      'Soma-se ao ataque e ao dano de armas à distância e armas com acuidade.',
      'Usada em Acrobacia, Furtividade, Prestidigitação e em testes de resistência de Destreza (explosões, armadilhas).',
    ],
    tip: 'Ladinos, arqueiros e monges dependem muito dela.',
  },
  con: {
    what: 'Mede saúde, vigor e resistência física.',
    how: [
      'Seu modificador é somado aos Pontos de Vida a cada nível (e retroativamente se mudar).',
      'Usada em testes de resistência de Constituição, como manter a concentração em uma magia quando você sofre dano.',
      'Ajuda a resistir a veneno, fadiga e doenças.',
    ],
    tip: 'Todo personagem se beneficia dela: mais vida e concentração mais segura.',
  },
  int: {
    what: 'Mede raciocínio, memória e conhecimento.',
    how: [
      'Usada em Arcanismo, História, Investigação, Natureza e Religião.',
      'É o atributo de conjuração de magos (e de guerreiros Cavaleiros Místicos e ladinos Trapaceiros Arcanos).',
      'Define a CD das magias e o bônus de ataque mágico de quem usa Inteligência.',
    ],
    tip: 'Essencial para magos e para quem investiga e analisa.',
  },
  wis: {
    what: 'Mede percepção, intuição e força de vontade.',
    how: [
      'Usada em Intuição, Medicina, Percepção, Sobrevivência e Lidar com Animais.',
      'É o atributo de conjuração de clérigos, druidas e patrulheiros.',
      'Define a Sabedoria Passiva (Percepção), que mostra o que você nota sem procurar ativamente.',
    ],
    tip: 'Testes de resistência de Sabedoria protegem contra encantamentos e medo.',
  },
  cha: {
    what: 'Mede presença, carisma e força de personalidade.',
    how: [
      'Usada em Atuação, Enganação, Intimidação e Persuasão.',
      'É o atributo de conjuração de bardos, bruxos, feiticeiros e paladinos.',
      'Define a CD das magias e o bônus de ataque mágico de quem conjura com Carisma.',
    ],
    tip: 'Quem negocia, lidera ou inspira depende dela.',
  },
};

const ABILITY_ORDER = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
const ABILITY_NAMES: Record<string, string> = { str: 'Força', dex: 'Destreza', con: 'Constituição', int: 'Inteligência', wis: 'Sabedoria', cha: 'Carisma' };

const abilityZones: Zone[] = ABILITY_ORDER.map((key, i) => ({
  id: `ab-${key}`,
  page: 1,
  r: { x: 30, y: 146 + 71.8 * i, w: 56, h: 66 },
  title: ABILITY_NAMES[key]!,
  icon: 'barbell-outline',
  what: ABILITY_TEXT[key]!.what,
  how: [
    'O número grande é o modificador (o que você soma aos dados); o número oval é o valor do atributo.',
    'Modificador = (valor − 10) ÷ 2, arredondado para baixo. Valor 10–11 dá +0; 14–15 dá +2; 8–9 dá −1.',
    ...ABILITY_TEXT[key]!.how,
  ],
  tip: ABILITY_TEXT[key]!.tip,
  mine: (x) => {
    const a = x.abilities.find((e) => e.key === key);
    return a ? [`${a.name}: valor ${a.score}, modificador ${sign(a.mod)}.`, `Teste de resistência: ${sign(a.save)}${a.saveProficient ? ' (proficiente)' : ''}.`] : [];
  },
}));

export const ZONES: Zone[] = [
  // ---------------- Página 1: cabeçalho ----------------
  {
    id: 'nome', page: 1, r: { x: 62, y: 60, w: 138, h: 40 }, title: 'Nome do personagem', icon: 'person-outline',
    what: 'Como o seu personagem é conhecido no mundo.',
    how: ['Fica no topo da ficha para você e o mestre identificarem o personagem rapidamente.', 'O nome não tem efeito em regras: é puro roleplay.'],
    mine: (x) => [x.name],
  },
  {
    id: 'classe', page: 1, r: { x: 262, y: 46, w: 104, h: 24 }, title: 'Classe e nível', icon: 'shield-half-outline',
    what: 'Sua profissão de aventureiro e o quanto você evoluiu nela.',
    how: [
      'A classe (Bárbaro, Mago, Ladino…) define dado de vida, proficiências, características e se você conjura magias.',
      'O nível (1 a 20) vai subindo conforme você ganha experiência. Cada nível libera novas características e aumenta seus PV.',
      'O bônus de proficiência também cresce com o nível (+2 até o nível 4, +3 no 5, e assim por diante).',
    ],
    mine: (x) => [x.classLabel, `Bônus de proficiência atual: ${sign(x.pb)}.`],
  },
  {
    id: 'antecedente', page: 1, r: { x: 370, y: 46, w: 86, h: 24 }, title: 'Antecedente', icon: 'library-outline',
    what: 'O que o personagem fazia antes de virar aventureiro.',
    how: [
      'Concede duas perícias, idiomas ou ferramentas, equipamento inicial e uma característica especial.',
      'Ajuda a dar personalidade e história: pense em ideais, vínculos e defeitos ligados a ele.',
    ],
    mine: (x) => [x.background || 'Nenhum antecedente definido.'],
  },
  {
    id: 'jogador', page: 1, r: { x: 459, y: 46, w: 128, h: 24 }, title: 'Nome do jogador', icon: 'happy-outline',
    what: 'Quem joga com este personagem na mesa.',
    how: ['Serve para o mestre saber de quem é cada ficha, principalmente em grupos grandes.'],
    mine: (x) => [x.player || 'Não informado.'],
  },
  {
    id: 'raca', page: 1, r: { x: 262, y: 74, w: 104, h: 24 }, title: 'Raça', icon: 'earth-outline',
    what: 'O povo ao qual o personagem pertence (humano, elfo, anão, halfling…).',
    how: [
      'Concede aumentos de atributos, tamanho, deslocamento, visão no escuro e traços raciais (como Sorte do Halfling).',
      'Algumas raças têm sub-raças, que acrescentam traços extras entre parênteses.',
    ],
    mine: (x) => [x.raceLabel],
  },
  {
    id: 'tendencia', page: 1, r: { x: 370, y: 74, w: 86, h: 24 }, title: 'Tendência', icon: 'compass-outline',
    what: 'A bússola moral do personagem.',
    how: [
      'Combina Leal / Neutro / Caótico com Bom / Neutro / Mau (ex.: Leal e Bom, Caótico e Neutro).',
      'Não é uma regra rígida: serve de guia para interpretar decisões e motivações.',
    ],
    mine: (x) => [x.alignment || 'Não definida.'],
  },
  {
    id: 'xp', page: 1, r: { x: 459, y: 74, w: 128, h: 24 }, title: 'Pontos de experiência', icon: 'trending-up-outline',
    what: 'O total de XP acumulado pelo personagem.',
    how: [
      'Você ganha XP ao vencer combates, superar desafios ou cumprir objetivos (o mestre decide).',
      'Ao atingir certos totais (300 XP para o nível 2, 900 para o 3, 2.700 para o 4…) você sobe de nível.',
      'Algumas mesas ignoram XP e sobem de nível por marcos de história.',
    ],
    mine: (x) => [`${x.xp} XP · nível ${x.level}.`],
  },

  // ---------------- Página 1: atributos e perícias ----------------
  ...abilityZones,
  {
    id: 'inspiracao', page: 1, r: { x: 92, y: 128, w: 114, h: 24 }, title: 'Inspiração', icon: 'sparkles-outline',
    what: 'Uma recompensa do mestre por boa interpretação ou ações heroicas.',
    how: [
      'Se você tem Inspiração, pode gastá-la para jogar um d20 com vantagem em um teste de ataque, de resistência ou de perícia.',
      'Você tem ou não tem: não acumula. Marcada com ✦ quando ativa.',
    ],
    mine: (x) => [x.inspiration ? 'Você tem Inspiração agora.' : 'Você não tem Inspiração no momento.'],
  },
  {
    id: 'proficiencia', page: 1, r: { x: 92, y: 166, w: 114, h: 24 }, title: 'Bônus de proficiência', icon: 'ribbon-outline',
    what: 'Um bônus fixo que cresce com o nível e é somado a tudo em que você é treinado.',
    how: [
      'Soma-se a ataques com armas em que você é proficiente, testes de perícias treinadas, testes de resistência proficientes e à CD/ataque de magias.',
      'Vale o mesmo para qualquer coisa: +2 nos níveis 1–4, +3 nos 5–8, +4 nos 9–12, +5 nos 13–16, +6 nos 17–20.',
      'Especialização (como o Ladino tem) dobra esse bônus em perícias escolhidas.',
    ],
    mine: (x) => [`Seu bônus de proficiência é ${sign(x.pb)}.`],
  },
  {
    id: 'saves', page: 1, r: { x: 92, y: 198, w: 114, h: 104 }, title: 'Testes de resistência', icon: 'shield-checkmark-outline',
    what: 'Jogadas para evitar ou reduzir efeitos perigosos (magias, armadilhas, venenos).',
    how: [
      'Role 1d20 e some o valor ao lado do atributo pedido. A bolinha preenchida indica proficiência: você soma também o bônus de proficiência.',
      'Cada classe é proficiente em dois testes de resistência.',
      'O mestre indica o atributo: Destreza para esquivar de uma explosão, Sabedoria contra encantamentos, Constituição contra veneno, e assim por diante.',
    ],
    tip: 'Contra uma CD (Classe de Dificuldade), igualar ou superar o número significa sucesso.',
    mine: (x) => x.abilities.map((a) => `${a.name}: ${sign(a.save)}${a.saveProficient ? ' ●' : ''}`),
  },
  {
    id: 'pericias', page: 1, r: { x: 92, y: 312, w: 114, h: 258 }, title: 'Perícias', icon: 'hammer-outline',
    what: 'As 18 habilidades treinadas usadas em testes de atributo.',
    how: [
      'Para usar uma perícia, role 1d20 e some o bônus mostrado ao lado do nome. Entre parênteses está o atributo base.',
      'Bolinha preenchida = proficiente (soma o bônus de proficiência). Bolinha com anel = especialização (soma o dobro).',
      'Sem bolinha, você só soma o modificador do atributo. O mestre define a CD e quando pedir o teste.',
    ],
    tip: 'Você pode propor ao mestre qual perícia usar em uma situação.',
    mine: (x) => {
      const trained = x.skills.filter((s) => s.proficient || s.expertise).map((s) => `${s.name} ${sign(s.bonus)}${s.expertise ? ' (especialista)' : ''}`);
      return trained.length ? [`Perícias treinadas: ${trained.join(', ')}.`] : ['Nenhuma perícia treinada ainda.'];
    },
  },
  {
    id: 'passiva', page: 1, r: { x: 30, y: 584, w: 176, h: 28 }, title: 'Sabedoria passiva (Percepção)', icon: 'eye-outline',
    what: 'O quanto você nota sem procurar ativamente.',
    how: [
      'Vale 10 + seu bônus de Percepção. O mestre compara com a dificuldade para saber se você percebe uma emboscada ou porta secreta.',
      'É útil quando você não declarou que está procurando nada, para o mestre não precisar pedir um teste.',
    ],
    mine: (x) => [`Sua Percepção passiva é ${x.passive}.`],
  },

  // ---------------- Página 1: combate ----------------
  {
    id: 'ca', page: 1, r: { x: 217, y: 138, w: 44, h: 46 }, title: 'Classe de Armadura (CA)', icon: 'shield-outline',
    what: 'O quão difícil é acertar você em combate.',
    how: [
      'Um ataque inimigo acerta quando o resultado do d20 (com bônus) iguala ou supera a sua CA.',
      'Sem armadura é 10 + modificador de Destreza. Armaduras e escudos mudam esse cálculo.',
      'Alguns efeitos (como a magia Escudo Arcano ou Defesa sem Armadura) alteram a CA.',
    ],
    mine: (x) => [`Sua CA é ${x.ac}.`],
  },
  {
    id: 'cm', page: 1, r: { x: 263, y: 138, w: 40, h: 46 }, title: 'C.M (Classe de Magia)', icon: 'flame-outline',
    what: 'O valor de dificuldade das suas magias, quando você conjura.',
    how: [
      'Também chamada de CD de magia. Quando você lança uma magia que exige teste de resistência, o alvo precisa igualar ou superar este número.',
      'Fórmula: 8 + bônus de proficiência + modificador do atributo de conjuração.',
      'A página 2 mostra as parcelas somadas da conta.',
    ],
    mine: (x) => (x.cmTotal !== null ? [`Sua C.M é ${x.cmTotal}.`] : ['Este personagem não tem C.M definida (não conjura ou ainda não foi configurada).']),
  },
  {
    id: 'iniciativa', page: 1, r: { x: 304, y: 138, w: 44, h: 46 }, title: 'Iniciativa', icon: 'flash-outline',
    what: 'O bônus que define quem age primeiro no combate.',
    how: [
      'No início de cada combate, todos rolam 1d20 + Iniciativa. A ordem vai do maior para o menor resultado.',
      'Normalmente é o modificador de Destreza, mas algumas características somam bônus extras.',
    ],
    mine: (x) => [`Sua Iniciativa é ${sign(x.init)}.`],
  },
  {
    id: 'deslocamento', page: 1, r: { x: 350, y: 138, w: 46, h: 46 }, title: 'Deslocamento', icon: 'walk-outline',
    what: 'A distância que você anda em um turno.',
    how: [
      'Medido em metros (a versão em pés dividida por 3). 9 m equivalem a 30 pés.',
      'Terreno difícil custa o dobro de movimento. Você pode dividir o deslocamento antes e depois de agir.',
    ],
    mine: (x) => [`Seu deslocamento é ${x.speed}.`],
  },
  {
    id: 'pv', page: 1, r: { x: 223, y: 192, w: 166, h: 62 }, title: 'Pontos de vida (PV)', icon: 'heart-outline',
    what: 'A sua saúde: quanto dano você aguenta.',
    how: [
      'Ao receber dano, você subtrai dos PV atuais. Chegando a 0, você cai inconsciente e começa a fazer testes contra a morte.',
      'Os PV nunca passam do máximo, exceto com PV temporários. Descansos e magias de cura recuperam PV.',
      'O número da esquerda é o atual; o da direita, o máximo.',
    ],
    mine: (x) => [`PV: ${x.hp} de ${x.maxHp}.`],
  },
  {
    id: 'pvtemp', page: 1, r: { x: 223, y: 258, w: 166, h: 50 }, title: 'Pontos de vida temporários', icon: 'add-circle-outline',
    what: 'Uma camada extra de vida que absorve dano primeiro.',
    how: [
      'Vêm de magias ou habilidades. O dano reduz os PV temporários antes dos PV normais.',
      'Não se somam entre si (use o maior valor) e desaparecem após um descanso longo.',
      'Cura não os recupera.',
    ],
    mine: (x) => [x.tempHp > 0 ? `Você tem ${x.tempHp} PV temporários.` : 'Você não tem PV temporários agora.'],
  },
  {
    id: 'dadosvida', page: 1, r: { x: 223, y: 312, w: 80, h: 52 }, title: 'Dados de vida', icon: 'dice-outline',
    what: 'Um estoque de dados que você gasta para se curar em descansos curtos.',
    how: [
      'Você tem um dado de vida por nível, do tipo definido pela sua classe (d6, d8, d10 ou d12).',
      'Em um descanso curto, gaste quantos quiser: role o dado, some seu modificador de Constituição e recupere essa quantidade de PV.',
      'Após um descanso longo, você recupera até metade do total de dados gastos.',
    ],
    mine: (x) => [`Total: ${x.hitDice}.`],
  },
  {
    id: 'morte', page: 1, r: { x: 306, y: 312, w: 90, h: 52 }, title: 'Testes contra a morte', icon: 'skull-outline',
    what: 'O que acontece quando seus PV chegam a 0.',
    how: [
      'No seu turno, role 1d20 sem modificadores: 10 ou mais é um sucesso; 9 ou menos, uma falha. Um 20 natural recupera 1 PV; um 1 natural conta como duas falhas.',
      'Três sucessos estabilizam você. Três falhas significam a morte.',
      'Dano sofrido enquanto inconsciente conta como falha. Qualquer cura traz você de volta.',
    ],
    mine: (x) => [`Sucessos: ${x.deathSaves.successes}/3 · Falhas: ${x.deathSaves.failures}/3.`],
  },
  {
    id: 'ataques', page: 1, r: { x: 216, y: 382, w: 180, h: 197 }, title: 'Ataques e magias', icon: 'flash-outline',
    what: 'Sua lista de ataques com armas e magias ofensivas.',
    how: [
      'Para atacar: role 1d20 + o bônus listado. Se igualar ou superar a CA do alvo, você acerta e rola o dano indicado.',
      'O bônus soma o modificador do atributo (Força ou Destreza) e a proficiência, se houver.',
      'A coluna de dano mostra o dado e o tipo (cortante, perfurante, contundente…).',
    ],
    tip: 'Em um acerto crítico (20 natural), role os dados de dano duas vezes.',
    mine: (x) => (x.attacks.length ? x.attacks.map((a) => `${a.name}: ${a.bonus}${a.damage ? ` · ${a.damage}` : ''}`) : ['Nenhum ataque registrado.']),
  },
  {
    id: 'moedas', page: 1, r: { x: 217, y: 590, w: 48, h: 177 }, title: 'Moedas', icon: 'cash-outline',
    what: 'O dinheiro do personagem, por tipo de moeda.',
    how: [
      'PC = peça de cobre, PP = prata, PO = ouro, PL = platina.',
      'Taxas: 10 PC = 1 PP; 10 PP = 1 PO; 10 PO = 1 PL. Peças de ouro são a moeda padrão.',
      'Cada 50 moedas pesam cerca de 0,5 kg.',
    ],
    mine: (x) => [`Cobre: ${x.coins.cp ?? 0} · Prata: ${x.coins.sp ?? 0} · Ouro: ${x.coins.gp ?? 0} · Platina: ${x.coins.pp ?? 0}.`],
  },
  {
    id: 'equipamentos', page: 1, r: { x: 266, y: 590, w: 130, h: 177 }, title: 'Equipamentos', icon: 'bag-handle-outline',
    what: 'Tudo o que o personagem carrega.',
    how: [
      'Armas, armaduras, ferramentas, itens de aventura, poções e tesouros. Números à esquerda indicam a quantidade.',
      'O que você carrega tem peso; carregar demais pode reduzir seu deslocamento.',
    ],
    mine: (x) => (x.equipLines.length ? [`${x.equipLines.length} itens: ${x.equipLines.slice(0, 6).join(', ')}${x.equipLines.length > 6 ? '…' : ''}.`] : ['Nenhum item registrado.']),
  },
  {
    id: 'idiomas', page: 1, r: { x: 28, y: 623, w: 178, h: 144 }, title: 'Idiomas e outras proficiências', icon: 'language-outline',
    what: 'Línguas que você fala e armas, armaduras e ferramentas que sabe usar.',
    how: [
      'Ser proficiente permite somar o bônus de proficiência a jogadas com aquele item ou ferramenta.',
      'Sem proficiência em uma armadura você sofre penalidades; sem proficiência em uma arma, não soma o bônus ao ataque.',
      'Idiomas permitem conversar ou ler textos naquela língua.',
    ],
    mine: (x) => (x.languages.length ? [x.languages.join(', ') + '.'] : ['Nada registrado ainda.']),
  },
  {
    id: 'caracteristicas', page: 1, r: { x: 407, y: 437, w: 180, h: 330 }, title: 'Características e habilidades', icon: 'ribbon-outline',
    what: 'Tudo o que seu personagem sabe fazer de especial.',
    how: [
      'Reúne características de classe e subclasse (por nível), traços da raça, a habilidade do antecedente e talentos escolhidos.',
      'Algumas são sempre ativas; outras gastam um recurso (como usos por descanso) ou ação.',
      'Consulte o Compêndio para ler o texto completo de cada uma.',
    ],
    mine: (x) => (x.features.length ? [`${x.features.length} características: ${x.features.slice(0, 8).join(', ')}${x.features.length > 8 ? '…' : ''}.`] : ['Nenhuma característica registrada.']),
  },
  {
    id: 'retrato', page: 1, r: { x: 406, y: 127, w: 181, h: 298 }, title: 'Aparência do personagem', icon: 'image-outline',
    what: 'Espaço para o retrato ou desenho do seu herói.',
    how: ['Ajuda a imaginar o personagem e a apresentá-lo ao grupo. Não tem efeito em regras.'],
  },

  // ---------------- Página 2: magias ----------------
  {
    id: 'classe-conjurador', page: 2, r: { x: 50, y: 58, w: 220, h: 44 }, title: 'Classe de conjurador', icon: 'color-wand-outline',
    what: 'A classe cuja lista de magias você usa.',
    how: [
      'Define o atributo de conjuração (Inteligência, Sabedoria ou Carisma) e quantas magias você conhece ou prepara.',
      'Classes sem conjuração (como o Bárbaro) deixam esta página em branco.',
    ],
    mine: (x) => [x.casterLabel || 'Este personagem não conjura magias.'],
  },
  {
    id: 'cm2', page: 2, r: { x: 290, y: 58, w: 292, h: 44 }, title: 'C.M = 8 + proficiência + atributo', icon: 'calculator-outline',
    what: 'A conta da sua Classe de Magia (CD de resistência das magias).',
    how: [
      'As caixas mostram as parcelas: 8 fixos, seu bônus de proficiência e o modificador do atributo de conjuração (e outros bônus). A última caixa é o total.',
      'Alvos precisam igualar ou superar esse total em seus testes de resistência para evitar suas magias.',
      'O bônus de ataque mágico é o bônus de proficiência + o modificador do atributo de conjuração.',
    ],
    mine: (x) => (x.cm ? [`Parcelas: ${x.cm.join(' + ')} = ${x.cmTotal}.`] : ['A conta da C.M ainda não foi preenchida.']),
  },
  ...spellLevelZone(0, { x: 24, y: 142, w: 196, h: 146 }),
  ...spellLevelZone(1, { x: 24, y: 312, w: 196, h: 216 }),
  ...spellLevelZone(2, { x: 24, y: 540, w: 196, h: 232 }),
  ...spellLevelZone(3, { x: 220, y: 142, w: 182, h: 224 }),
  ...spellLevelZone(4, { x: 220, y: 367, w: 182, h: 226 }),
  ...spellLevelZone(5, { x: 220, y: 594, w: 182, h: 176 }),
  ...spellLevelZone(6, { x: 406, y: 142, w: 182, h: 170 }),
  ...spellLevelZone(7, { x: 406, y: 313, w: 182, h: 170 }),
  ...spellLevelZone(8, { x: 406, y: 483, w: 182, h: 140 }),
  ...spellLevelZone(9, { x: 406, y: 623, w: 182, h: 150 }),
];

function spellLevelZone(level: number, r: Rect): Zone[] {
  const isCantrip = level === 0;
  return [
    {
      id: `magias-${level}`,
      page: 2,
      r,
      title: isCantrip ? 'Truques' : `Magias de ${level}º nível`,
      icon: isCantrip ? 'sparkles-outline' : 'color-wand-outline',
      what: isCantrip
        ? 'Magias simples que você pode lançar à vontade, sem gastar espaços.'
        : `Magias de ${level}º nível, lançadas gastando espaços de magia deste nível ou superior.`,
      how: isCantrip
        ? [
            'Truques não consomem recursos e ficam mais fortes com o nível do personagem (causam mais dano ou ganham alcance).',
            'Você os conhece sempre; não precisa prepará-los.',
          ]
        : [
            'A caixa no topo mostra seus espaços de magia totais deste nível e quantos já foram usados.',
            'Cada conjuração gasta um espaço. Descanso longo recupera todos.',
            'Uma bolinha preenchida ao lado do nome indica que a magia está preparada. Conjurar em um espaço mais alto aumenta seu efeito ("Em níveis superiores").',
            'Rituais podem ser lançados sem gastar espaço, levando 10 minutos a mais.',
          ],
      tip: isCantrip ? undefined : 'Toque no nome da magia no Compêndio de Magias para ver o texto completo.',
      mine: (x) => {
        const list = x.spellsByLevel[level] ?? [];
        const lines: string[] = [];
        if (!isCantrip) lines.push(`Espaços: ${x.slots[level - 1] ?? 0} no total · ${x.slotsUsed[level - 1] ?? 0} usados.`);
        lines.push(list.length ? `Magias: ${list.map((s) => s.name + (!isCantrip && s.prepared ? ' ●' : '')).join(', ')}.` : 'Nenhuma magia neste nível.');
        return lines;
      },
    },
  ];
}
