// Classes de D&D 5e (parte B): Guerreiro, Guardião (Patrulheiro), Ladino, Mago, Monge, Paladino.
// Fonte: Livro do Jogador (PT-BR) e Resumo/Compêndio de Classes (Biblioteca Élfica).
import type { ClassDef, ClassFeature, Subclass, SpellcastingInfo } from "../types";

/** Subclasse conjuradora (terço de conjurador): espaços de magia por nível de classe. */
type SubclassSpellcasting = SpellcastingInfo & {
  /** Índice 0 = nível 1 da classe; cada item = espaços de magia de 1º ao Nº nível. */
  spellSlots: number[][];
};
type CasterSubclass = Subclass & { spellcasting: SubclassSpellcasting };

const ASI_TEXT =
  "Quando você atinge o 4º nível e novamente no 8º, 12º, 16º e 19º nível, você pode aumentar um valor de habilidade, à sua escolha, em 2 ou você pode aumentar dois valores de habilidade, à sua escolha, em 1. Como padrão, você não pode elevar um valor de habilidade acima de 20 com essa característica.";

const asi = (level: number, text: string = ASI_TEXT): ClassFeature => ({
  level,
  name: "Incremento no Valor de Habilidade",
  description: text,
});

const ASI_GUERREIRO =
  "Quando você atinge o 4º nível e novamente no 6º, 8º, 12º, 14º, 16º e 19º nível, você pode aumentar um valor de habilidade, à sua escolha, em 2 ou você pode aumentar dois valores de habilidade, à sua escolha, em 1. Como padrão, você não pode elevar um valor de habilidade acima de 20 com essa característica.";

const MANOBRAS =
  "Manobras (em ordem alfabética):\n" +
  "Aparar. Quando outra criatura causar dano a você com um ataque corpo a corpo, você pode usar sua reação e gastar um dado de superioridade para reduzir o dano pelo número rolado no dado de superioridade + seu modificador de Destreza.\n" +
  "Ataque Ameaçador. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar amedrontar o alvo. Você adiciona seu dado de superioridade à jogada de dano do ataque e o alvo deve realizar um teste de resistência de Sabedoria. Se falhar, ele ficará com medo de você até o final do seu próximo turno.\n" +
  "Ataque de Encontrão. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar empurrar o alvo para trás. Você adiciona seu dado de superioridade à jogada de dano do ataque e, se o alvo for Grande ou menor, ele deve realizar um teste de resistência de Força. Se falhar, você empurra o alvo para até 4,5 metros de você.\n" +
  "Ataque de Finta. Você pode gastar um dado de superioridade e usar uma ação bônus, no seu turno, para fintar, escolhendo uma criatura a 1,5 metro de você como alvo. Você tem vantagem na sua próxima jogada de ataque contra essa criatura, nesse turno. Se o ataque atingir, você adiciona seu dado de superioridade ao dano do ataque.\n" +
  "Ataque de Manobra. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar manobrar um de seus companheiros para uma posição mais vantajosa. Você adiciona seu dado de superioridade à jogada de dano do ataque e escolhe uma criatura amigável que possa ver ou ouvir você. Aquela criatura pode usar sua reação para se mover até metade do seu deslocamento, sem provocar ataques de oportunidade do alvo do seu ataque.\n" +
  "Ataque de Precisão. Quando você realizar uma jogada de ataque com arma contra uma criatura, você pode gastar um dado de superioridade para adicioná-lo à jogada. Você pode usar essa manobra antes ou depois de realizar a jogada de ataque, mas deve usá-la antes de qualquer efeito do ataque ser aplicado.\n" +
  "Ataque Desarmante. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar desarmar o alvo, forçando-o a derrubar um item, à sua escolha, que ele esteja empunhando. Você adiciona o dado de superioridade à jogada de dano do ataque e o alvo deve realizar um teste de resistência de Força. Se fracassar, ele derrubará o objeto escolhido. O objeto cai aos pés dele.\n" +
  "Ataque Estendido. Quando você atingir uma criatura com um ataque corpo a corpo com arma, você pode gastar um dado de superioridade para aumentar o alcance do seu ataque em 1,5 metro. Se você atingir, você adiciona o seu dado de superioridade ao dano causado pelo ataque.\n" +
  "Ataque Provocante. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar incitar o alvo a atacar você. Você adiciona seu dado de superioridade à jogada de dano do ataque e o alvo deve realizar um teste de resistência de Sabedoria. Se falhar, o alvo terá desvantagem em todas as jogadas de ataque contra alvos diferentes de você, até o fim do seu próximo turno.\n" +
  "Ataque Trespassante. Quando você atingir uma criatura com um ataque corpo a corpo com arma, você pode gastar um dado de superioridade para tentar causar dano a outra criatura com o mesmo ataque. Escolha uma criatura a 1,5 metro do alvo original e que esteja no seu alcance. Se a jogada de ataque original atingiria a segunda criatura, ela sofre dano igual ao número rolado no dado de superioridade. O dano é do mesmo tipo que o causado pelo ataque original.\n" +
  "Contra-Atacar. Quando uma criatura atacar você com um ataque corpo a corpo e errar, você pode usar sua reação e gastar um dado de superioridade para realizar um ataque corpo a corpo com arma contra essa criatura. Se você atingir, você adiciona seu dado de superioridade à jogada de dano do ataque.\n" +
  "Derrubar. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar derrubar o alvo no chão. Você adiciona seu dado de superioridade à jogada de dano do ataque e, se o alvo for Grande ou menor, ele deve realizar um teste de resistência de Força. Se falhar, o alvo ficará caído no chão.\n" +
  "Golpe Distrativo. Quando você atingir uma criatura com um ataque com arma, você pode gastar um dado de superioridade para tentar distrair a criatura, abrindo uma brecha para um de seus aliados. Você adiciona seu dado de superioridade à jogada de dano do ataque. A próxima jogada de ataque realizada contra o alvo por uma criatura diferente de você tem vantagem, se o ataque for realizado antes do começo do seu próximo turno.\n" +
  "Golpe do Comandante. Quando você realiza a ação de Ataque, no seu turno, você pode desistir de um dos seus ataques e usar uma ação bônus para direcionar o ataque de um dos seus companheiros. Quando você faz isso, escolha uma criatura amigável que possa ver ou ouvir você e gaste um dado de superioridade. Essa criatura pode, imediatamente, usar sua reação para realizar um ataque com arma, adicionando seu dado de superioridade à jogada de dano do ataque.\n" +
  "Inspirar. No seu turno, você pode usar uma ação bônus e gastar um dado de superioridade para reforçar a determinação dos seus companheiros. Quando o fizer, escolha uma criatura amigável que possa ver ou ouvir você. Essa criatura ganha uma quantidade de pontos de vida temporários igual à sua rolagem de dado de superioridade + seu modificador de Carisma.\n" +
  "Passo Evasivo. Quando você se mover, você pode gastar um dado de superioridade, rolar o dado e adicionar o número rolado à sua CA até você terminar seu deslocamento.";

const campeao: Subclass = {
  id: "campeao",
  name: "Campeão",
  level: 3,
  description:
    "O arquétipo Campeão foca no desenvolvimento da pura força física acompanhada por uma perfeição mortal. Aqueles que trilham o caminho desse arquétipo combinam rigorosos treinamentos com excelência física para desferir golpes devastadores.",
  features: [
    { level: 3, name: "Crítico Aprimorado", description: "A partir do 3º nível, seus ataques com armas adquirem uma margem de acerto crítico de 19 a 20 nas jogadas de ataque." },
    { level: 7, name: "Atletismo Extraordinário", description: "A partir do 7º nível, você adiciona metade de seu bônus de proficiência (arredondado para cima) em qualquer teste de Força, Destreza ou Constituição que você já não aplique seu bônus de proficiência.\nAlém disso, quando você fizer um salto longo com corrida, o alcance em metros que poderá saltar aumenta em 0,3 vezes o seu modificador de Força." },
    { level: 10, name: "Estilo de Luta Adicional", description: "No 10º nível, você pode escolher um segundo Estilo de Luta da sua característica de classe." },
    { level: 15, name: "Crítico Superior", description: "A partir do 15º nível, seus ataques com armas adquirem uma margem de acerto crítico de 18 a 20 nas jogadas de ataque." },
    { level: 18, name: "Sobrevivente", description: "No 18º nível, você alcança o topo da resiliência em batalha. No começo de cada um de seus turnos, você recupera uma quantidade de pontos de vida igual a 5 + seu modificador de Constituição se não estiver com mais que metade de seus pontos de vida. Você não recebe esse benefício se estiver com 0 pontos de vida." },
  ],
};

const cavaleiroArcano: CasterSubclass = {
  id: "cavaleiro-arcano",
  name: "Cavaleiro Arcano",
  level: 3,
  description:
    "O arquétipo de Cavaleiro Arcano combina a maestria marcial comum a todos os guerreiros com um cuidadoso estudo de magia. Os cavaleiros arcanos usam técnicas mágicas similares às praticadas pelos magos. Eles focam seu estudo em duas das oito escolas: abjuração e evocação. As magias de abjuração concedem proteção adicional em batalha ao Cavaleiro Arcano, e as magias de evocação causam dano a vários oponentes de uma vez, estendendo o alcance do guerreiro em combate. Esses cavaleiros aprendem, comparativamente, um pequeno número de magias, guardando-as na memória em vez de mantê-las em um grimório.",
  spellcasting: {
    ability: "int",
    kind: "third",
    preparesSpells: false,
    // Níveis 1-2 do guerreiro não conjuram (0).
    cantripsKnown: [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    spellsKnown: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13],
    spellSlots: [
      [], [],
      [2], [3], [3], [3],
      [4, 2], [4, 2], [4, 2],
      [4, 3], [4, 3], [4, 3],
      [4, 3, 2], [4, 3, 2], [4, 3, 2],
      [4, 3, 3], [4, 3, 3], [4, 3, 3],
      [4, 3, 3, 1], [4, 3, 3, 1],
    ],
  },
  features: [
    {
      level: 3,
      name: "Conjuração",
      description:
        "Quando você alcançar o 3º nível, você amplia o seu poderio marcial com a habilidade de conjurar magias. Veja o capítulo 10 para as regras gerais de conjuração e o capítulo 11 para a lista de magias de mago.\nTruques. Você aprende dois truques, à sua escolha, da lista de magias de mago. Você aprende um truque de mago adicional, à sua escolha, no 10º nível.\nEspaços de Magia. A tabela Conjuração de Cavaleiro Arcano mostra quantos espaços de magia de 1º nível e superiores você possui disponíveis para conjuração. Para conjurar uma dessas magias, você deve gastar um espaço de magia do nível da magia ou superior. Você recobra todos os espaços de magia gastos quando você completa um descanso longo. Por exemplo, se você quiser conjurar a magia de 1º nível escudo arcano e você tiver um espaço de magia de 1º nível e um de 2º nível disponíveis, você poderá conjurar escudo arcano usando qualquer dos dois espaços.\nMagias Conhecidas de 1º Nível e Superiores. Você conhece três magias de 1º nível, à sua escolha, das quais duas você deve escolher das magias de abjuração e evocação da lista de magias de mago. A coluna Magias Conhecidas na tabela mostra quando você aprende mais magias de mago, de 1º nível ou superior. Cada uma dessas magias deve ser uma magia de abjuração ou evocação, à sua escolha, de um nível a que você tenha acesso. Por exemplo, quando você alcança o 7º nível da classe, você pode aprender uma nova magia de 1º ou 2º nível. As magias que você aprende no 8º, 14º e 20º nível podem vir de qualquer escola de magia.\nAlém disso, quando você adquire um nível nessa classe, você pode escolher uma magia de mago que você conheça e substituí-la por outra magia da lista de magias de mago, que também deve ser de um nível ao qual você tenha espaços de magia e deve ser uma magia de abjuração ou evocação, exceto as magias substituídas no 8º, 14º e 20º nível.\nHabilidade de Conjuração. Sua habilidade de conjuração é Inteligência para suas magias de mago. Você usa o seu modificador de Inteligência para definir a CD dos testes de resistência para as magias de mago que você conjura e quando você realiza uma jogada de ataque com uma magia.\nCD para suas magias = 8 + bônus de proficiência + seu modificador de Inteligência.\nModificador de ataque de magia = seu bônus de proficiência + seu modificador de Inteligência.\n" +
        "Tabela Conjuração de Cavaleiro Arcano (nível de guerreiro: truques / magias conhecidas / espaços 1º-4º): 3º: 2/3/2; 4º: 2/4/3; 5º: 2/4/3; 6º: 2/4/3; 7º: 2/5/4,2; 8º: 2/6/4,2; 9º: 2/6/4,2; 10º: 3/7/4,3; 11º: 3/8/4,3; 12º: 3/8/4,3; 13º: 3/9/4,3,2; 14º: 3/10/4,3,2; 15º: 3/10/4,3,2; 16º: 3/11/4,3,3; 17º: 3/11/4,3,3; 18º: 3/11/4,3,3; 19º: 3/12/4,3,3,1; 20º: 3/13/4,3,3,1.",
    },
    { level: 3, name: "Vínculo com Arma", description: "No 3º nível, você aprende um ritual que cria um vínculo mágico entre você e uma arma. Você realiza esse ritual no curso de 1 hora, que pode ser realizada durante um descanso curto. A arma deve estar ao seu alcance ao decorrer do ritual; ao concluí-lo, você toca a arma e forja o elo.\nUma vez que você tenha vinculado uma arma a você, você não pode ser desarmado dessa arma, a menos que você esteja incapacitado. Se ela estiver no mesmo plano de existência, você pode invocar essa arma com uma ação bônus, no seu turno, fazendo-a se teletransportar instantaneamente para a sua mão.\nVocê pode ter até duas armas vinculadas, mas só pode invocar uma por vez com sua ação bônus. Se você quiser criar um elo com uma terceira arma, você deve quebrar o vínculo com uma das outras duas." },
    { level: 7, name: "Magia de Guerra", description: "A partir do 7º nível, quando você usar sua ação para conjurar um truque, você pode realizar um ataque com arma, com uma ação bônus." },
    { level: 10, name: "Golpe Místico", description: "No 10º nível, você aprende como fazer com que os seus golpes com arma penetrem a resistência de uma criatura às suas magias. Quando você atingir uma criatura com um ataque com arma, aquela criatura terá desvantagem no próximo teste de resistência que ela fizer contra uma magia que você conjurar antes do final do seu próximo turno." },
    { level: 15, name: "Investida Arcana", description: "No 15º nível, você ganha a capacidade de se teletransportar até 9 metros para um espaço desocupado que você possa ver, quando você usar seu Surto de Ação. Você pode se teletransportar antes ou depois da ação adicional." },
    { level: 18, name: "Magia de Guerra Aprimorada", description: "A partir do 18º nível, quando você usar sua ação para conjurar uma magia, você pode realizar um ataque com arma, com uma ação bônus." },
  ],
};

const mestreDeBatalha: Subclass = {
  id: "mestre-de-batalha",
  name: "Mestre de Batalha",
  level: 3,
  description:
    "Aqueles que emulam o arquétipo de Mestre de Batalha empregam técnicas marciais passadas de geração em geração. Para um Mestre de Batalha, o combate é um campo acadêmico, às vezes incluindo assuntos além da batalha, como forjaria e caligrafia. Nem todo guerreiro absorve as lições de história, teoria e arte que são refletidas no arquétipo de Mestre de Batalha, mas aqueles que conseguem tornam-se guerreiros bem-supridos de grande perícia e conhecimento.",
  features: [
    {
      level: 3,
      name: "Superioridade em Combate",
      description:
        "Quando você escolhe esse arquétipo, no 3º nível, você aprende manobras que são abastecidas com dados especiais chamados dados de superioridade.\nManobras. Você aprende três manobras, à sua escolha, que são detalhadas em \"Manobras\". Muitas manobras aprimoram um ataque de várias formas. Você só pode usar uma manobra por ataque. Você aprende duas manobras adicionais, à sua escolha, no 7º, 10º e 15º nível. A cada vez que você aprende uma nova manobra, você pode substituir uma manobra conhecida por uma diferente.\nDados de Superioridade. Você tem quatro dados de superioridade, que são d8s. Um dado de superioridade é gasto quando você o usa. Você recupera todos os dados de superioridade gastos quando terminar um descanso curto ou longo. Você adquire outro dado de superioridade no 7º nível e mais um no 15º nível.\nTeste de Resistência. Algumas das suas manobras exigem que o alvo realize um teste de resistência contra o efeito da manobra. CD para suas manobras = 8 + bônus de proficiência + seu modificador de Força ou Destreza (à sua escolha).\n" +
        MANOBRAS,
    },
    { level: 3, name: "Estudioso da Guerra", description: "No 3º nível, você ganha proficiência com um tipo de ferramenta de artesão, à sua escolha." },
    { level: 7, name: "Conheça seu Inimigo", description: "A partir do 7º nível, se você gastar, pelo menos, 1 minuto observando ou interagindo com outra criatura fora de combate, você pode aprender certas informações sobre as capacidades dela comparadas às suas. O Mestre conta a você se a criatura é igual, superior ou inferior a você a respeito de duas das seguintes características, à sua escolha: Valor de Força; Valor de Destreza; Valor de Constituição; Classe de Armadura; Pontos de Vida atuais; Nível total de classe (se possuir); Níveis da classe guerreiro (se possuir)." },
    { level: 10, name: "Superioridade em Combate Aprimorada", description: "No 10º nível, seus dados de superioridade se tornam d10s. No 18º nível, eles se tornam d12s." },
    { level: 15, name: "Implacável", description: "No 15º nível, quando você rolar iniciativa e não tiver nenhum dado de superioridade restante, você recupera um dado de superioridade." },
  ],
};

// Arquétipo do Compêndio de Classes (Guia do Aventureiro da Costa da Espada).
const dragaoPurpura: Subclass = {
  id: "cavaleiro-do-dragao-purpura",
  name: "Cavaleiro do Dragão Púrpura",
  level: 3,
  description:
    "Líder de campo que fortalece os aliados pelo exemplo em batalha. Nos Reinos Esquecidos é uma ordem de cavalaria de Cormyr; em outros cenários, use o nome genérico Marechal.",
  features: [
    { level: 3, name: "Grito Animador", description: "Ao usar Retomar o Fôlego, escolha até três aliados a até 18 metros que possam ver e ouvir você. Cada um recupera PV iguais ao seu nível de guerreiro." },
    { level: 7, name: "Emissário Real", description: "Você ganha proficiência em Persuasão; se já a tiver, escolha proficiência em Adestrar Animais, Atuação, Intimidação ou Intuição. Seu bônus de proficiência é dobrado em todo teste de habilidade com Persuasão, independentemente de qual proficiência tenha ganhado aqui." },
    { level: 10, name: "Surto de Inspiração", description: "Ao usar Surto de Ação, escolha um aliado a até 18 metros que possa ver ou ouvir você: ele pode usar a reação para fazer um ataque com arma, corpo a corpo ou à distância. A partir do 17º nível, são dois aliados." },
    { level: 15, name: "Baluarte", description: "Ao usar Indomável para repetir um teste de resistência de Inteligência, Sabedoria ou Carisma, sem estar incapacitado, escolha um aliado a até 18 metros que tenha falhado contra o mesmo efeito e possa ver ou ouvir você. Ele repete o teste e fica obrigado a usar o novo resultado." },
  ],
};

const GUERREIRO: ClassDef = {
  id: "guerreiro",
  name: "Guerreiro",
  summary:
    "Um mestre do combate, perito em uma variedade de estilos de luta e no uso de armas e armaduras. Soldados veteranos, oficiais militares, guarda-costas treinados, cavaleiros dedicados e figuras similares são guerreiros.",
  hitDie: 10,
  primaryAbilities: ["str", "dex"],
  savingThrows: ["str", "con"],
  armorProficiencies: ["Todas as armaduras", "Escudos"],
  weaponProficiencies: ["Armas simples", "Armas marciais"],
  toolProficiencies: [],
  skillChoices: {
    count: 2,
    from: ["acrobacia", "adestrarAnimais", "atletismo", "historia", "intuicao", "intimidacao", "percepcao", "sobrevivencia"],
  },
  startingEquipment: [
    "(a) cota de malha ou (b) gibão de peles, arco longo e 20 flechas",
    "(a) uma arma marcial e um escudo ou (b) duas armas marciais",
    "(a) uma besta leve e 20 virotes ou (b) dois machados de arremesso",
    "(a) um pacote de aventureiro ou (b) um pacote de explorador",
  ],
  features: [
    {
      level: 1,
      name: "Estilo de Luta",
      description:
        "Você adota um estilo de combate particular que será sua especialidade. Escolha uma das opções a seguir. Você não pode escolher o mesmo Estilo de Luta mais de uma vez, mesmo se puder escolher de novo.\nArquearia. Você ganha +2 de bônus nas jogadas de ataque realizadas com uma arma de ataque à distância.\nCombate com Armas Grandes. Quando você rolar um 1 ou um 2 num dado de dano de um ataque com arma corpo a corpo que você esteja empunhando com duas mãos, você pode rolar o dado novamente e usar a nova rolagem, mesmo que resulte em 1 ou 2. A arma deve ter a propriedade duas mãos ou versátil para ganhar esse benefício.\nCombate com Duas Armas. Quando você estiver engajado em uma luta com duas armas, você pode adicionar o seu modificador de habilidade de dano na jogada de dano de seu segundo ataque.\nDefesa. Enquanto estiver usando armadura, você ganha +1 de bônus em sua CA.\nDuelismo. Quando você empunhar uma arma de ataque corpo a corpo em uma mão e nenhuma outra arma, você ganha +2 de bônus nas jogadas de dano com essa arma.\nProteção. Quando uma criatura que você possa ver atacar um alvo que esteja a até 1,5 metro de você, você pode usar sua reação para impor desvantagem nas jogadas de ataque da criatura. Você deve estar empunhando um escudo.",
    },
    { level: 1, name: "Retomar o Fôlego", description: "Você possui uma reserva de estamina e pode usá-la para proteger a si mesmo contra danos. No seu turno, você pode usar uma ação bônus para recuperar pontos de vida igual a 1d10 + seu nível de guerreiro.\nUma vez que você use essa característica, você precisa terminar um descanso curto ou longo para usá-la de novo." },
    { level: 2, name: "Surto de Ação", description: "A partir do 2º nível, você pode forçar o seu limite para além do normal por um momento. Durante o seu turno, você pode realizar uma ação adicional juntamente com sua ação e possível ação bônus.\nUma vez que você use essa característica, você precisa terminar um descanso curto ou longo para usá-la de novo. A partir do 17º nível, você pode usá-la duas vezes antes do descanso, porém somente uma vez por turno." },
    { level: 3, name: "Arquétipo Marcial", description: "No 3º nível, você escolhe um arquétipo o qual se esforçará para seguir as técnicas e estilos de combate dele. Escolha Campeão, Cavaleiro Arcano ou Mestre de Batalha. O arquétipo confere a você características especiais no 3º nível e de novo nos 7º, 10º, 15º e 18º nível." },
    asi(4, ASI_GUERREIRO),
    { level: 5, name: "Ataque Extra", description: "A partir do 5º nível, você pode atacar duas vezes, ao invés de uma, quando usar a ação Atacar durante o seu turno.\nO número de ataques aumenta para três quando você alcançar o 11º nível de guerreiro e para quatro quando alcançar o 20º nível de guerreiro." },
    asi(6, ASI_GUERREIRO),
    asi(8, ASI_GUERREIRO),
    { level: 9, name: "Indomável", description: "A partir do 9º nível, você pode jogar de novo um teste de resistência que falhou. Se o fizer, você deve usar o novo valor e não pode usar essa característica de novo antes de terminar um descanso longo.\nVocê pode usar esta característica duas vezes entre descansos longos quando chegar no 13º nível e três vezes entre descansos longos quando chegar no 17º nível." },
    { level: 11, name: "Ataque Extra (2)", description: "Você pode atacar três vezes, ao invés de uma, quando usar a ação Atacar durante o seu turno." },
    asi(12, ASI_GUERREIRO),
    { level: 13, name: "Indomável (dois usos)", description: "Você pode usar Indomável duas vezes entre descansos longos." },
    asi(14, ASI_GUERREIRO),
    asi(16, ASI_GUERREIRO),
    { level: 17, name: "Surto de Ação (dois usos)", description: "Você pode usar Surto de Ação duas vezes antes do descanso, porém somente uma vez por turno." },
    { level: 17, name: "Indomável (três usos)", description: "Você pode usar Indomável três vezes entre descansos longos." },
    asi(19, ASI_GUERREIRO),
    { level: 20, name: "Ataque Extra (3)", description: "Você pode atacar quatro vezes, ao invés de uma, quando usar a ação Atacar durante o seu turno." },
  ],
  subclassLabel: "Arquétipo Marcial",
  subclasses: [campeao, cavaleiroArcano, mestreDeBatalha, dragaoPurpura],
  progressionColumns: [
    {
      label: "Ataques por Ação",
      values: [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4],
    },
    {
      label: "Surto de Ação",
      values: ["-", 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2],
    },
    {
      label: "Indomável",
      values: ["-", "-", "-", "-", "-", "-", "-", "-", 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
    },
  ],
};

const cacador: Subclass = {
  id: "cacador",
  name: "Caçador",
  level: 3,
  description:
    "Emular o arquétipo Caçador significa aceitar seu lugar como um baluarte entre a civilização e os terrores das terras selvagens. À medida que você trilha o caminho do Caçador, você aprende técnicas especializadas para lutar contra as ameaças que você confronta, desde ogros enfurecidos e hordas de orcs até enormes gigantes e terríveis dragões.",
  features: [
    { level: 3, name: "Presa do Caçador", description: "No 3º nível, você ganha uma das seguintes características, à sua escolha.\nAssassino de Colossos. Sua tenacidade pode derrubar os mais poderosos oponentes. Quando você atinge uma criatura com um ataque com arma, a criatura sofre 1d8 de dano extra, se ela estiver abaixo do seu máximo de pontos de vida. Você só pode causar esse dano extra uma vez por turno.\nMatador de Gigantes. Quando uma criatura Grande ou maior a até 1,5 metro de você atingir ou errar um ataque contra você, você pode usar sua reação para atacar a criatura, imediatamente após o ataque dela, considerando que você possa ver a criatura.\nDestruidor de Hordas. Uma vez em cada um dos seus turnos, quando você fizer um ataque com arma, você pode realizar outro ataque com a mesma arma contra uma criatura diferente que esteja a até 1,5 metro do alvo original e esteja no alcance da sua arma." },
    { level: 7, name: "Táticas Defensivas", description: "No 7º nível, você ganha uma das seguintes características, à sua escolha.\nEscapar da Horda. Ataques de oportunidade contra você são feitos com desvantagem.\nDefesa Contra Múltiplos Ataques. Quando uma criatura atinge você com um ataque, você recebe +4 de bônus na CA contra todos os ataques subsequentes feitos por essa criatura no resto do turno.\nVontade de Aço. Você tem vantagem em testes de resistência para evitar ser amedrontado." },
    { level: 11, name: "Ataque Múltiplo", description: "No 11º nível, você ganha uma das seguintes características, à sua escolha.\nSaraivada. Você pode usar sua ação para realizar um ataque à distância contra qualquer número de criaturas a até 3 metros de um ponto que você possa ver, no alcance da sua arma. Você deve ter munição para cada alvo, como normal, e você realiza uma jogada de ataque separada para cada alvo.\nAtaque Giratório. Você pode usar sua ação para realizar um ataque corpo a corpo contra qualquer número de criaturas a até 1,5 metro de você, realizando uma jogada de ataque separada para cada alvo." },
    { level: 15, name: "Defesa de Caçador Superior", description: "No 15º nível, você ganha uma das seguintes características, à sua escolha.\nEvasão. Você pode esquivar-se agilmente de certos efeitos em área, como o sopro de fogo de um dragão vermelho ou uma magia relâmpago. Quando você for alvo de um efeito que exige um teste de resistência de Destreza para sofrer metade do dano, você não sofre dano algum se passar, e somente metade do dano se falhar.\nManter-se Contra a Maré. Quando uma criatura hostil errar você com um ataque corpo a corpo, você pode usar sua reação para forçar a criatura a repetir o mesmo ataque contra outra criatura (que não ela mesma), à sua escolha.\nEsquiva Sobrenatural. Quando um atacante que você possa ver atinge você com um ataque, você pode usar sua reação para reduzir o dano causado pelo ataque à metade." },
  ],
};

const mestreDasBestas: Subclass = {
  id: "mestre-das-bestas",
  name: "Mestre das Bestas",
  level: 3,
  description:
    "O arquétipo Mestre das Bestas incorpora a amizade entre as raças civilizadas e as bestas do mundo. Unidos com um propósito, besta e patrulheiro trabalham como um para lutar contra inimigos monstruosos que ameaçam tanto a civilização quanto as terras selvagens. Emular o arquétipo Mestre das Bestas significa se empenhar no seu ideal, trabalhando em parceria com um animal como seu companheiro e amigo.",
  features: [
    { level: 3, name: "Companheiro de Patrulha", description: "No 3º nível, você ganha um companheiro bestial que acompanha você em suas aventuras e é treinado para lutar ao seu lado. Escolha uma besta que não seja maior que Média e tenha um nível de desafio 1/4 ou inferior (o apêndice D apresenta as estatísticas do falcão, mastim e pantera, como exemplos). Adicione seu bônus de proficiência à CA, jogadas de ataque, jogadas de dano, assim como a todos os testes de resistência e perícias em que a besta for proficiente. O máximo de pontos de vida dela será igual ao seu total normal ou a quatro vezes seu nível de patrulheiro, o que for maior. Como qualquer criatura, seu companheiro pode gastar Dados de Vida durante um descanso curto.\nA besta obedece os seus comandos da melhor forma que puder. Ela realiza o turno dela na sua iniciativa, já que ela não realiza qualquer ação até que você a comande, exceto reações. No seu turno, você pode comandar verbalmente a besta para onde ela deve se mover (sem ação necessária). Você pode usar sua ação para comandá-la verbalmente a realizar as ações de Ataque, Disparada, Desengajar, Esquivar ou Ajuda. Se você tiver a característica Ataque Extra, você pode realizar um ataque com arma quando comandar a besta a realizar a ação de Ataque. Ela age por conta própria se você estiver incapacitado ou ausente, focando-se em defender você.\nEnquanto estiver viajando através do seu terreno favorito apenas com a besta, você pode se mover furtivamente com ritmo de viagem normal.\nSe a besta morrer, você pode obter outra besta gastando 8 horas criando uma conexão mágica com outra besta que não seja hostil a você, tanto do mesmo tipo da besta anterior quanto uma diferente." },
    { level: 7, name: "Treinamento Excepcional", description: "Começando no 7º nível, em qualquer dos seus turnos, quando seu companheiro bestial não tiver atacado, você pode usar sua ação bônus para comandar a besta a realizar as ações de Disparada, Desengajar, Esquivar ou Ajuda, no seu turno." },
    { level: 11, name: "Fúria Bestial", description: "A partir do 11º nível, seu companheiro bestial pode realizar dois ataques ou realizar a ação de Ataque Múltiplo (se ele possuir essa ação) quando você o comanda a usar a ação de Ataque." },
    { level: 15, name: "Compartilhar Magias", description: "A partir do 15º nível, quando você conjurar uma magia que tenha você como alvo, você também pode afetar seu companheiro bestial com a magia, se o companheiro estiver a até 9 metros de você." },
  ],
};

const GUARDIAO: ClassDef = {
  id: "guardiao",
  name: "Patrulheiro",
  summary:
    "Um guerreiro que utiliza de poderio marcial e magia da natureza para combater as ameaças nas fronteiras da civilização. Guerreiros da natureza, os patrulheiros se especializaram em caçar monstros que ameaçam as margens da civilização (nesta tradução, o Patrulheiro é a classe também conhecida como Guardião ou Guadabosques).",
  hitDie: 10,
  primaryAbilities: ["dex", "wis"],
  savingThrows: ["str", "dex"],
  armorProficiencies: ["Armaduras leves", "Armaduras médias", "Escudos"],
  weaponProficiencies: ["Armas simples", "Armas marciais"],
  toolProficiencies: [],
  skillChoices: {
    count: 3,
    from: ["acrobacia", "adestrarAnimais", "atletismo", "furtividade", "intuicao", "investigacao", "natureza", "percepcao", "sobrevivencia"],
  },
  startingEquipment: [
    "(a) camisão de malha ou (b) armadura de couro",
    "(a) duas espadas curtas ou (b) duas armas simples corpo a corpo",
    "(a) um pacote de explorador ou (b) um pacote de aventureiro",
    "Um arco longo e uma aljava com 20 flechas",
  ],
  features: [
    { level: 1, name: "Inimigo Favorito", description: "A partir do 1º nível, você tem experiência significativa estudando, rastreando, caçando e, até mesmo, falando com certos tipos de inimigos.\nEscolha um tipo de inimigo favorito: aberrações, bestas, celestiais, constructos, corruptores, dragões, elementais, fadas, gigantes, limos, monstruosidades, mortos-vivos ou plantas. Alternativamente, você pode escolher duas raças de humanoides (como gnolls e orcs) para seus inimigos favoritos.\nVocê tem vantagem em testes de Sabedoria (Sobrevivência) para rastrear seus inimigos favoritos, assim como em testes de Inteligência para lembrar informações sobre eles.\nQuando você adquire essa característica, você também aprende um idioma, à sua escolha, que seja falado pelos seus inimigos favoritos, se eles falarem algum.\nVocê escolhe um inimigo favorito adicional, assim como um idioma associado, no 6º e 14º nível. À medida que você ganha níveis, suas escolhas deverão refletir os tipos de monstros que você encontrou nas suas aventuras." },
    { level: 1, name: "Explorador Natural", description: "Você está particularmente familiarizado com um tipo de ambiente natural e é perito em viajar e sobreviver em tais regiões. Escolha um tipo de terreno favorito: ártico, costa, deserto, floresta, montanha, pântano, planície ou subterrâneo. Quando você fizer um teste de Inteligência ou de Sabedoria relacionado ao seu terreno favorito, seu bônus de proficiência será dobrado se você estiver usando uma perícia na qual seja proficiente.\nEnquanto viajar por uma hora ou mais em seu terreno favorito, você ganha os seguintes benefícios:\n- Terreno difícil não retarda a viagem do seu grupo.\n- Seu grupo não pode se perder, exceto por meios mágicos.\n- Mesmo quando você estiver engajado em outra atividade enquanto viaja (como forragear, navegar ou rastrear), você se mantém alerta ao perigo.\n- Se você estiver viajando sozinho, você pode se mover furtivamente com seu ritmo de viagem normal.\n- Quando você forrageia, você encontra o dobro de comida que normalmente encontraria.\n- Enquanto estiver rastreando outras criaturas, você também descobre a quantidade exata delas, seus tamanhos e há quanto tempo elas passaram pela área.\nVocê escolhe um tipo de terreno favorito adicional no 6º e 10º nível." },
    { level: 2, name: "Estilo de Luta", description: "No 2º nível, você adota um estilo de combate particular que será sua especialidade. Escolha uma das opções a seguir. Você não pode escolher o mesmo Estilo de Luta mais de uma vez, mesmo se puder escolher de novo.\nArquearia. Você ganha +2 de bônus nas jogadas de ataque realizadas com uma arma de ataque à distância.\nCombate com Duas Armas. Quando você estiver engajado em uma luta com duas armas, você pode adicionar o seu modificador de habilidade na jogada de dano do seu segundo ataque.\nDefesa. Enquanto estiver usando armadura, você ganha +1 de bônus em sua CA.\nDuelismo. Quando você empunhar uma arma de ataque corpo a corpo em uma mão e nenhuma outra arma, você ganha +2 de bônus nas jogadas de dano com essa arma." },
    { level: 2, name: "Conjuração", description: "Quando você alcança o 2º nível, você aprende a usar a essência mágica da natureza para conjurar magias, como um druida faz. Veja o capítulo 10 para as regras gerais de conjuração e o capítulo 11 para a lista de magias de patrulheiro.\nEspaços de Magia. A tabela O Patrulheiro mostra quantos espaços de magia você tem para conjurar suas magias de 1º nível e superiores. Para conjurar uma dessas magias, você deve gastar um espaço de magia do nível da magia ou superior. Você recobra todos os espaços de magia gastos quando você completa um descanso longo. Por exemplo, se você quiser conjurar a magia de 1º nível amizade animal e você tiver um espaço de magia de 1º nível e um de 2º nível disponíveis, você poderá conjurar amizade animal usando qualquer dos dois espaços.\nMagias Conhecidas de 1º Nível e Superiores. Você conhece duas magias de 1º nível, à sua escolha, da lista de magias de patrulheiro. A coluna Magias Conhecidas na tabela O Patrulheiro mostra quando você aprende mais magias de patrulheiro, à sua escolha. Cada uma dessas magias deve ser de um nível a que você tenha acesso, como mostrado na tabela. Por exemplo, quando você alcança o 5º nível da classe, você pode aprender uma nova magia de 1º ou 2º nível. Além disso, quando você adquire um nível nessa classe, você pode escolher uma magia de patrulheiro que você conheça e substituí-la por outra magia da lista de magias de patrulheiro, que também deve ser de um nível ao qual você tenha espaços de magia.\nHabilidade de Conjuração. Sabedoria é a sua habilidade para conjurar suas magias de patrulheiro, já que sua magia vem da sua sintonia com a natureza. Você usa o seu modificador de Sabedoria para definir a CD dos testes de resistência para as magias de patrulheiro que você conjura e quando você realiza uma jogada de ataque com uma magia.\nCD para suas magias = 8 + bônus de proficiência + seu modificador de Sabedoria.\nModificador de ataque de magia = seu bônus de proficiência + seu modificador de Sabedoria." },
    { level: 3, name: "Arquétipo de Patrulheiro", description: "No 3º nível, você escolhe um arquétipo que você se esforça para imitar: Caçador ou Mestre das Bestas. Sua escolha lhe concede características no 3º nível e novamente no 7º, 11º e 15º nível." },
    { level: 3, name: "Prontidão Primitiva", description: "A partir do 3º nível, você pode usar sua ação e gastar um espaço de magia de patrulheiro para focar sua atenção na região a seu redor. Por 1 minuto por nível do espaço de magia gasto, você pode sentir se os seguintes tipos de criaturas estão presentes a 1,5 quilômetro de você (ou dentro de até 9 quilômetros se você estiver em seu terreno favorito): aberrações, celestiais, corruptores, dragões, elementais, fadas e mortos-vivos. Essa característica não revela a localização ou quantidade de criaturas." },
    asi(4),
    { level: 5, name: "Ataque Extra", description: "A partir do 5º nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno." },
    { level: 6, name: "Aprimoramentos de Inimigo Favorito e Explorador Natural", description: "No 6º nível, você escolhe um inimigo favorito adicional, assim como um idioma associado, e um tipo de terreno favorito adicional (veja Inimigo Favorito e Explorador Natural)." },
    asi(8),
    { level: 8, name: "Caminho da Floresta", description: "Começando no 8º nível, se mover através de terreno difícil não mágico não lhe custa deslocamento adicional. Você também pode passar através de plantas não mágicas sem ter seu deslocamento reduzido por elas e sem sofrer dano delas caso apresentem espinhos, acúleos ou perigo similar.\nAlém disso, você tem vantagem em testes de resistência contra plantas criadas ou manipuladas magicamente para impedir movimento, como as criadas pela magia constrição." },
    { level: 10, name: "Aprimoramento de Explorador Natural", description: "No 10º nível, você escolhe um tipo de terreno favorito adicional (veja Explorador Natural)." },
    { level: 10, name: "Mimetismo", description: "A partir do 10º nível, você pode gastar 1 minuto criando uma camuflagem para si mesmo. Você deve ter acesso a lama fresca, terra, plantas, fuligem e outros materiais naturalmente comuns para criar sua camuflagem.\nQuando você estiver camuflado dessa forma, você pode tentar se esconder ao se pressionar contra uma superfície sólida, como uma árvore ou muro, que seja, pelo menos, tão alto quanto você. Você recebe +10 de bônus em testes de Destreza (Furtividade) enquanto você permanecer ali parado e sem realizar ações. Quando você se mover ou realizar uma ação ou reação, você deve se camuflar novamente para ganhar esse benefício." },
    asi(12),
    { level: 14, name: "Aprimoramento de Inimigo Favorito", description: "No 14º nível, você escolhe um inimigo favorito adicional, assim como um idioma associado (veja Inimigo Favorito)." },
    { level: 14, name: "Desaparecer", description: "Começando no 14º nível, você pode usar a ação de Esconder, com uma ação bônus, no seu turno. Além disso, você não pode ser rastreado por meios não mágicos, a não ser que você decida deixar um rastro." },
    asi(16),
    { level: 18, name: "Sentidos Selvagens", description: "No 18º nível, você ganha sentidos preternaturais que o ajudam a lutar contra criaturas que você não pode ver. Quando você atacar uma criatura que você não possa ver, sua incapacidade em vê-la não impõe desvantagem nas suas jogadas de ataque contra ela.\nVocê também está ciente da localização de qualquer criatura invisível a até 9 metros de você, considerando que a criatura não esteja se escondendo de você e você não esteja cego ou surdo." },
    asi(19),
    { level: 20, name: "Matador de Inimigos", description: "No 20º nível, você se torna um caçador incomparável de inimigos. Uma vez em cada um dos seus turnos, você pode adicionar seu modificador de Sabedoria na jogada de ataque ou jogada de dano de um ataque que você faça contra um dos seus inimigos favoritos. Você pode escolher usar essa característica antes ou depois da rolagem, mas antes de qualquer efeito da jogada ser aplicado." },
  ],
  subclassLabel: "Arquétipo de Patrulheiro",
  subclasses: [cacador, mestreDasBestas],
  spellcasting: {
    ability: "wis",
    kind: "half",
    spellsKnown: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
    preparesSpells: false,
  },
  progressionColumns: [
    {
      label: "Espaços de Magia (1º ao 5º)",
      values: [
        "-", "2", "3", "3", "4/2", "4/2", "4/3", "4/3", "4/3/2", "4/3/2",
        "4/3/3", "4/3/3", "4/3/3/1", "4/3/3/1", "4/3/3/2", "4/3/3/2", "4/3/3/3/1", "4/3/3/3/1", "4/3/3/3/2", "4/3/3/3/2",
      ],
    },
    {
      label: "Inimigos Favoritos",
      values: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
    },
    {
      label: "Terrenos Favoritos",
      values: [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    },
  ],
};

const ASI_LADINO =
  "Quando você atinge o 4º nível e novamente no 8º, 10º, 12º, 16º e 19º nível, você pode aumentar um valor de habilidade, à sua escolha, em 2 ou você pode aumentar dois valores de habilidade, à sua escolha, em 1. Como padrão, você não pode elevar um valor de habilidade acima de 20 com essa característica.";

const assassino: Subclass = {
  id: "assassino",
  name: "Assassino",
  level: 3,
  description:
    "Você focou seu treinamento na macabra arte da morte. Aqueles que devotam-se a esse arquétipo são diversos: assassinos de aluguel, espiões, caçadores de recompensa e, até mesmo, padres especialmente treinados em exterminar os inimigos das suas divindades. Subterfúgio, veneno e disfarces ajudam você a eliminar seus oponentes com eficiência mortífera.",
  features: [
    { level: 3, name: "Proficiência Adicional", description: "Quando você escolhe esse arquétipo, no 3º nível, você ganha proficiência com kit de disfarce e kit de venenos." },
    { level: 3, name: "Assassinar", description: "A partir do 3º nível, você fica mais mortal quando pega seus oponentes desprevenidos. Você tem vantagem nas jogadas de ataque contra qualquer criatura que ainda não tenha chegado ao turno dela no combate. Além disso, qualquer ataque que você fizer contra essa criatura que está surpresa será um ataque crítico." },
    { level: 9, name: "Especialização em Infiltração", description: "A partir do 9º nível, você pode, infalivelmente, criar identidades falsas para si mesmo. Você deve gastar sete dias e 25 po para estabelecer o histórico, profissão e filiações para uma identidade. Você não pode estabelecer uma identidade que pertença a alguém. Por exemplo, você deveria adquirir roupas apropriadas, cartas de introdução e um certificado, aparentemente oficial, para estabelecer-se como um membro da casa de comércio de uma cidade remota, assim, você poderia introduzir-se na companhia de outros comerciantes abastados.\nPosteriormente, se você adotar a nova identidade como disfarce, outras criaturas acreditarão que você é aquela pessoa, até terem algum motivo óbvio para pensarem o contrário." },
    { level: 13, name: "Impostor", description: "No 13º nível, você adquire a habilidade de imitar a fala, escrita e comportamento de outra pessoa, infalivelmente. Você deve gastar pelo menos três horas estudando esses três componentes do comportamento de uma pessoa, ouvindo sua articulação, examinando sua escrita e observando seus maneirismos.\nSeu ardil é imperceptível para um observador casual. Se uma criatura desconfiada suspeitar que algo está errado, você tem vantagem em qualquer teste de Carisma (Enganação) que você fizer para evitar ser detectado." },
    { level: 17, name: "Golpe Letal", description: "No 17º nível, você se torna um mestre da morte instantânea. Quando você atacar e atingir uma criatura que esteja surpresa, ela deve realizar um teste de resistência de Constituição (CD 8 + seu modificador de Destreza + seu bônus de proficiência). Se ela falhar, dobre o dano do seu ataque contra a criatura." },
  ],
};

const ladrao: Subclass = {
  id: "ladrao",
  name: "Ladrão",
  level: 3,
  description:
    "Você aprimorou suas habilidades na arte do furto de pequenos itens. Gatunos, bandidos, batedores de carteira e outros criminosos geralmente seguem esse arquétipo, mas também aqueles ladinos que preferem se ver como caçadores de tesouro profissionais, exploradores de masmorras e investigadores. Além de aprimorar sua agilidade e furtividade, você aprende perícias úteis para desbravar ruínas antigas, ler idiomas incomuns e usar itens mágicos que normalmente não poderia.",
  features: [
    { level: 3, name: "Mãos Rápidas", description: "A partir do 3º nível, você pode usar a sua ação bônus concedida pela Ação Ardilosa para fazer um teste de Destreza (Prestidigitação), usar suas ferramentas de ladrão para desarmar uma armadilha ou abrir uma fechadura, ou realizar a ação de Usar um Objeto." },
    { level: 3, name: "Andarilho de Telhados", description: "No 3º nível, você adquire a habilidade de escalar mais rápido que o normal. Escalar agora não possui custo adicional de movimento para você.\nAlém disso, quando você fizer um salto com corrida, o alcance que pode saltar aumenta um número de metros igual a 0,3 vezes o seu modificador de Destreza." },
    { level: 9, name: "Furtividade Suprema", description: "A partir do 9º nível, você tem vantagem no teste de Destreza (Furtividade) se você não se mover mais do que a metade de seu deslocamento em um turno." },
    { level: 13, name: "Usar Instrumento Mágico", description: "No 13º nível, você aprende o suficiente sobre como a magia funciona e pode improvisar o uso de itens que nem mesmo foram destinados a você. Você ignora todos os requisitos de classes, raças e níveis para uso de qualquer item mágico." },
    { level: 17, name: "Reflexos de Ladrão", description: "Quando atinge o 17º nível, você se torna adepto em fazer emboscadas e fugas rápidas de situações perigosas. Você pode realizar dois turnos durante o primeiro turno de cada combate. Você realiza seu primeiro turno na sua iniciativa e o segundo na ordem de sua iniciativa menos 10.\nVocê não pode usar essa característica quando está surpreso." },
  ],
};

const trapaceiroArcano: CasterSubclass = {
  id: "trapaceiro-arcano",
  name: "Trapaceiro Arcano",
  level: 3,
  description:
    "Alguns ladinos aprimoram suas finas perícias de furtividade e agilidade com magia, aprendendo truques de encantamento e ilusão. Esses ladinos incluem não somente batedores de carteira e assaltantes, mas também trapaceiros, enganadores e um número significativo de aventureiros.",
  spellcasting: {
    ability: "int",
    kind: "third",
    preparesSpells: false,
    // Níveis 1-2 do ladino não conjuram (0).
    cantripsKnown: [0, 0, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    spellsKnown: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13],
    spellSlots: [
      [], [],
      [2], [3], [3], [3],
      [4, 2], [4, 2], [4, 2],
      [4, 3], [4, 3], [4, 3],
      [4, 3, 2], [4, 3, 2], [4, 3, 2],
      [4, 3, 3], [4, 3, 3], [4, 3, 3],
      [4, 3, 3, 1], [4, 3, 3, 1],
    ],
  },
  features: [
    {
      level: 3,
      name: "Conjuração",
      description:
        "Quando você alcançar o 3º nível, você adquire a habilidade de conjurar magias. Veja o capítulo 10 para as regras gerais de conjuração e o capítulo 11 para a lista de magias de mago.\nTruques. Você aprende três truques: mãos mágicas e outros dois truques, à sua escolha, da lista de magias de mago. Você aprende um truque de mago adicional, à sua escolha, no 10º nível.\nEspaços de Magia. A tabela Conjuração de Trapaceiro Arcano mostra quantos espaços de magia de 1º nível e superiores você possui disponíveis para conjuração. Para conjurar uma dessas magias, você deve gastar um espaço de magia do nível da magia ou superior. Você recobra todos os espaços de magia gastos quando você completa um descanso longo. Por exemplo, se você quiser conjurar a magia de 1º nível enfeitiçar pessoa e você tiver um espaço de magia de 1º nível e um de 2º nível disponíveis, você poderá conjurar enfeitiçar pessoa usando qualquer dos dois espaços.\nMagias Conhecidas de 1º Nível e Superiores. Você conhece três magias de 1º nível, à sua escolha, das quais duas você deve escolher das magias de encantamento e ilusão da lista de magias de mago. A coluna Magias Conhecidas na tabela mostra quando você aprende mais magias de mago, de 1º nível ou superior. Cada uma dessas magias deve ser uma magia de encantamento ou ilusão, à sua escolha, de um nível a que você tenha acesso. Por exemplo, quando você alcança o 7º nível da classe, você pode aprender uma nova magia de 1º ou 2º nível. As magias que você aprende no 8º, 14º e 20º nível podem vir de qualquer escola de magia.\nAlém disso, quando você adquire um nível nessa classe, você pode escolher uma magia de mago que você conheça e substituí-la por outra magia da lista de magias de mago, que também deve ser de um nível ao qual você tenha espaços de magia e deve ser uma magia de encantamento ou ilusão, exceto as magias substituídas no 8º, 14º e 20º nível.\nHabilidade de Conjuração. Sua habilidade de conjuração é Inteligência para suas magias de mago. Você usa o seu modificador de Inteligência para definir a CD dos testes de resistência para as magias de mago que você conjura e quando você realiza uma jogada de ataque com uma magia.\nCD para suas magias = 8 + bônus de proficiência + seu modificador de Inteligência.\nModificador de ataque de magia = seu bônus de proficiência + seu modificador de Inteligência.\n" +
        "Tabela Conjuração de Trapaceiro Arcano (nível de ladino: truques / magias conhecidas / espaços 1º-4º): 3º: 3/3/2; 4º: 3/4/3; 5º: 3/4/3; 6º: 3/4/3; 7º: 3/5/4,2; 8º: 3/6/4,2; 9º: 3/6/4,2; 10º: 4/7/4,3; 11º: 4/8/4,3; 12º: 4/8/4,3; 13º: 4/9/4,3,2; 14º: 4/10/4,3,2; 15º: 4/10/4,3,2; 16º: 4/11/4,3,3; 17º: 4/11/4,3,3; 18º: 4/11/4,3,3; 19º: 4/12/4,3,3,1; 20º: 4/13/4,3,3,1.",
    },
    { level: 3, name: "Mãos Mágicas Malabaristas", description: "A partir do 3º nível, quando você conjurar mãos mágicas, você pode fazer a mão espectral ficar invisível e poderá realizar as seguintes tarefas adicionais:\n- Você pode guardar um objeto que a mão estiver segurando em um recipiente vestido ou carregado por outra criatura.\n- Você pode recuperar um objeto guardado em um recipiente vestido ou carregado por outra criatura.\n- Você pode usar ferramentas de ladrão para abrir fechaduras ou desarmar armadilhas à distância.\nVocê pode realizar qualquer dessas tarefas sem ser notado por uma criatura se for bem-sucedido num teste de Destreza (Prestidigitação) resistido por um teste de Sabedoria (Percepção) da criatura.\nAlém disso, você pode usar a ação bônus concedida por sua Ação Ardilosa para controlar a mão." },
    { level: 9, name: "Emboscada Mágica", description: "A partir do 9º nível, se você estiver escondido de uma criatura quando conjurar uma magia nela, a criatura terá desvantagem em qualquer teste de resistência que ela fizer contra a magia nesse turno." },
    { level: 13, name: "Trapaceiro Versátil", description: "No 13º nível, você ganha a habilidade de distrair alvos com suas mãos mágicas. Com uma ação bônus, no seu turno, você pode designar uma criatura a até 1,5 metro da mão espectral criada por essa magia. Fazer isso lhe concede vantagem nas jogadas de ataque contra essa criatura até o final do turno." },
    { level: 17, name: "Ladrão de Magia", description: "No 17º nível, você ganha a habilidade de, magicamente, roubar o conhecimento de como conjurar uma magia de outro conjurador.\nImediatamente depois de uma criatura conjurar uma magia que tenha você como alvo ou inclua você na sua área de efeito, você pode usar sua reação para forçar a criatura a realizar um teste de resistência com o modificador de habilidade de conjuração dela. A CD é igual à CD das suas magias. Numa falha, você ignora o efeito da magia sobre você e rouba o conhecimento da magia, se ela for de, pelo menos, 1º nível e de um nível que você possa conjurar (não precisa ser uma magia de mago). Pelas próximas 8 horas, você conhece a magia e pode conjurá-la usando seus espaços de magia. A criatura não pode conjurar a magia até que 8 horas tenham se passado.\nUma vez que você tenha usado essa característica, você não pode usá-la novamente até ter terminado um descanso longo." },
  ],
};

// Arquétipos do Compêndio de Classes (Guia do Aventureiro da Costa da Espada).
const manipulador: Subclass = {
  id: "manipulador",
  name: "Manipulador",
  level: 3,
  description:
    "Especialista em pessoas, influência e segredos, comum entre espiões, cortesãos e conspiradores. Usa palavras tanto quanto lâminas.",
  features: [
    { level: 3, name: "Mestre da Intriga", description: "Você ganha proficiência com kit de disfarce, kit de falsificação e um tipo de jogo à sua escolha, e aprende dois idiomas à sua escolha. Depois de ouvir uma criatura falar por pelo menos 1 minuto, consegue imitar perfeitamente sua fala e sotaque, passando-se por nativo de uma região cujo idioma conheça." },
    { level: 3, name: "Mestre de Estratégias", description: "Você pode usar a ação de Ajudar como ação bônus. Ao ajudar um aliado a atacar, o alvo pode estar a até 9 metros de você (em vez de 1,5 metro), desde que o alvo possa ver ou ouvir você." },
    { level: 9, name: "Manipulador Perspicaz", description: "Após observar ou interagir com uma criatura por pelo menos 1 minuto fora de combate, escolha duas destas características: Inteligência, Sabedoria, Carisma ou níveis de classe (se houver). O Mestre diz se a criatura é igual, superior ou inferior a você em cada uma. A critério do Mestre, você também descobre algo da história dela ou um traço de personalidade." },
    { level: 13, name: "Desorientação", description: "Reação: quando você for alvo de um ataque e uma criatura a até 1,5 metro estiver lhe dando cobertura contra ele, o ataque passa a ter essa criatura como alvo." },
    { level: 17, name: "Alma Enganadora", description: "Telepatia e meios semelhantes só leem seus pensamentos se você permitir; você pode apresentar pensamentos falsos com um teste de Carisma (Enganação) resistido por Sabedoria (Intuição) do leitor. Magia que verifique se você diz a verdade indica sinceridade se você quiser, e magia não pode forçá-lo a dizer a verdade." },
  ],
};

const espadachim: Subclass = {
  id: "espadachim",
  name: "Espadachim",
  level: 3,
  description:
    "Duelista que combina velocidade, elegância e charme. Destaca-se em combate singular e consegue atacar com duas armas e sair de perto do inimigo em segurança.",
  features: [
    { level: 3, name: "Sapateado", description: "No seu turno, depois de fazer um ataque corpo a corpo contra uma criatura, ela não pode fazer ataques de oportunidade contra você até o fim do turno." },
    { level: 3, name: "Audácia Dissoluta", description: "Some seu modificador de Carisma às rolagens de iniciativa. Além disso, você pode usar Ataque Furtivo sem vantagem se nenhuma outra criatura além do alvo estiver a até 1,5 metro de você; as demais regras do Ataque Furtivo continuam valendo." },
    { level: 9, name: "Fanfarronada", description: "Ação: faça um teste de Carisma (Persuasão) resistido por Sabedoria (Intuição) de uma criatura que possa ouvir você e compartilhe um idioma. Se vencer contra criatura hostil: ela tem desvantagem em ataques contra outros alvos e não pode fazer ataques de oportunidade contra outros alvos, por 1 minuto ou até um companheiro seu atacá-la ou afetá-la com magia, ou até vocês ficarem a mais de 18 metros. Se vencer contra criatura não hostil: fica enfeitiçada por 1 minuto e o considera um conhecido amigável; termina se você ou seus companheiros a prejudicarem." },
    { level: 13, name: "Manobra Elegante", description: "Ação bônus no seu turno: ganha vantagem no próximo teste de Destreza (Acrobacia) ou Força (Atletismo) feito neste turno." },
    { level: 17, name: "Mestre Duelista", description: "Ao errar uma jogada de ataque, você pode rolá-la novamente com vantagem. Depois de usar, só volta após um descanso curto ou longo." },
  ],
};

const LADINO: ClassDef = {
  id: "ladino",
  name: "Ladino",
  summary:
    "Um trapaceiro que utiliza de furtividade e astúcia para superar obstáculos e inimigos. Ladinos contam com sua perícia, furtividade e as vulnerabilidades de seus inimigos para obter vantagem em qualquer situação.",
  hitDie: 8,
  primaryAbilities: ["dex"],
  savingThrows: ["dex", "int"],
  armorProficiencies: ["Armaduras leves"],
  weaponProficiencies: ["Armas simples", "Bestas de mão", "Espadas longas", "Rapieiras", "Espadas curtas"],
  toolProficiencies: ["Ferramentas de ladrão"],
  skillChoices: {
    count: 4,
    from: ["acrobacia", "atletismo", "atuacao", "enganacao", "furtividade", "intimidacao", "intuicao", "investigacao", "percepcao", "persuasao", "prestidigitacao"],
  },
  startingEquipment: [
    "(a) uma rapieira ou (b) uma espada longa",
    "(a) um arco curto e uma aljava com 20 flechas ou (b) uma espada curta",
    "(a) um pacote de assaltante ou (b) um pacote de aventureiro ou (c) um pacote de explorador",
    "Armadura de couro, duas adagas e ferramentas de ladrão",
  ],
  features: [
    { level: 1, name: "Especialização", description: "No 1º nível, você escolhe duas de suas perícias em que seja proficiente, ou uma perícia em que seja proficiente e ferramentas de ladrão. Seu bônus de proficiência é dobrado em qualquer teste de habilidade que fizer com elas.\nNo 6º nível, você pode escolher outras duas de suas proficiências (em perícias ou ferramentas de ladrão) para ganhar esse benefício." },
    { level: 1, name: "Ataque Furtivo", description: "A partir do 1º nível, você sabe como atacar sutilmente e explorar a distração de seus inimigos. Uma vez por turno, você pode adicionar 1d6 nas jogadas de dano contra qualquer criatura que acertar, desde que tenha vantagem nas jogadas de ataque. O ataque deve ser com uma arma de acuidade ou à distância.\nVocê não precisa ter vantagem nas jogadas de ataque se outro inimigo do seu alvo estiver a 1,5 metro de distância dele, desde que este inimigo não esteja incapacitado e você não tenha desvantagem nas jogadas de ataque.\nA quantidade de dano extra aumenta conforme você ganha níveis nessa classe, como mostrado na coluna Ataque Furtivo da tabela O Ladino." },
    { level: 1, name: "Gíria de Ladrão", description: "Durante seu treinamento você aprendeu as gírias de ladrão, um misto de dialeto, jargão e códigos secretos que permitem você passar mensagens secretas durante uma conversa aparentemente normal. Somente outra criatura que conheça essas gírias de ladrão entende as mensagens. Leva-se quatro vezes mais tempo para transmitir essa mensagem do que falar a mesma ideia claramente.\nAlém disso, você entende um conjunto de sinais secretos e símbolos usados para transmitir mensagens curtas e simples, como saber se uma área é perigosa ou se é território de uma guilda de ladrões, se o saque está próximo, se as pessoas na área são alvos fáceis ou até mesmo indicar lugares seguros para ladinos se esconderem." },
    { level: 2, name: "Ação Ardilosa", description: "A partir do 2º nível, seu pensamento rápido e agilidade fazem você se mover e agir rapidamente. Você pode usar uma ação bônus durante cada um de seus turnos em combate. Esta ação pode ser usada somente para Disparada, Desengajar ou Esconder." },
    { level: 3, name: "Arquétipo de Ladino", description: "No 3º nível, você escolhe um arquétipo que se esforçará para se equiparar através de exercícios de suas habilidades de ladino: Assassino, Ladrão ou Trapaceiro Arcano. Sua escolha garante a você características no 3º nível e de novo no 9º, 13º e 17º nível." },
    asi(4, ASI_LADINO),
    { level: 5, name: "Esquiva Sobrenatural", description: "A partir do 5º nível, quando um inimigo que você possa ver o acerta com um ataque, você pode usar sua reação para reduzir pela metade o dano sofrido." },
    { level: 6, name: "Especialização (2ª escolha)", description: "No 6º nível, você pode escolher outras duas de suas proficiências (em perícias ou ferramentas de ladrão) para dobrar o bônus de proficiência, conforme a característica Especialização." },
    { level: 7, name: "Evasão", description: "A partir do 7º nível, você pode esquivar-se agilmente de certos efeitos em área, como o sopro flamejante de um dragão vermelho ou uma magia tempestade de gelo. Quando você for alvo de um efeito que exige um teste de resistência de Destreza para sofrer metade do dano, você não sofre dano algum se passar, e somente metade do dano se falhar." },
    asi(8, ASI_LADINO),
    asi(10, ASI_LADINO),
    { level: 11, name: "Talento Confiável", description: "No 11º nível, você refinou suas perícias beirando a perfeição. Toda vez que você fizer um teste de habilidade no qual possa adicionar seu bônus de proficiência, você trata um resultado no d20 de 9 ou menor como um 10." },
    asi(12, ASI_LADINO),
    { level: 14, name: "Sentido Cego", description: "No 14º nível, se você for capaz de ouvir, você está ciente da localização de qualquer criatura escondida ou invisível a até 3 metros de você." },
    { level: 15, name: "Mente Escorregadia", description: "No 15º nível, você adquire uma grande força de vontade, adquirindo proficiência nos testes de resistência de Sabedoria." },
    asi(16, ASI_LADINO),
    { level: 18, name: "Elusivo", description: "A partir do 18º nível, você se torna tão sagaz que raramente alguém encosta a mão em você. Nenhuma jogada de ataque tem vantagem contra você, desde que você não esteja incapacitado." },
    asi(19, ASI_LADINO),
    { level: 20, name: "Golpe de Sorte", description: "No 20º nível, você adquire um dom incrível para ter sucesso nos momentos em que mais precisa. Se um ataque seu falhar contra um alvo ao seu alcance, você pode transformar essa falha em um acerto. Ou se falhar em um teste qualquer, você pode tratar a jogada desse mesmo teste como 20 natural.\nUma vez que você use essa característica, você não pode fazê-lo de novo até terminar um descanso curto ou longo." },
  ],
  subclassLabel: "Arquétipo de Ladino",
  subclasses: [assassino, ladrao, trapaceiroArcano, manipulador, espadachim],
  progressionColumns: [
    {
      label: "Ataque Furtivo",
      values: ["1d6", "1d6", "2d6", "2d6", "3d6", "3d6", "4d6", "4d6", "5d6", "5d6", "6d6", "6d6", "7d6", "7d6", "8d6", "8d6", "9d6", "9d6", "10d6", "10d6"],
    },
  ],
};

const instruida = (escola: string, nome: string): ClassFeature => ({
  level: 2,
  name: `${nome} Instruída`,
  description: `Quando você escolhe essa escola no 2º nível, o ouro e o tempo que você precisa gastar para copiar uma magia da escola de ${escola} em seu grimório é reduzido à metade.`,
});

const abjuracao: Subclass = {
  id: "abjuracao",
  name: "Escola de Abjuração",
  level: 2,
  description:
    "A Escola de Abjuração enfatiza magias que bloqueiam, expulsam ou protegem. Detratores dessa escola dizem que sua tradição trata de contradição, negação, ao invés de asserções positivas. Você compreende, no entanto, que terminar efeitos nocivos, proteger os fracos e banir influências malignas é tudo, menos um vazio filosófico. É uma vocação de orgulho e respeito. Chamados de abjuradores, membros dessa escola são procurados quando espíritos sinistros precisam ser exorcizados, quando locais importantes devem ser guardados contra espionagem mágica e quando portais para outros planos de existência precisam ser selados.",
  features: [
    instruida("abjuração", "Abjuração"),
    { level: 2, name: "Proteção Arcana", description: "A partir do 2º nível, você pode tecer a magia a sua volta para proteção. Quando você conjura uma magia de abjuração de 1º nível ou superior, você pode, simultaneamente, usar uma vertente do poder da magia para criar uma proteção mágica em si mesmo, que dura até você terminar um descanso longo. A proteção tem pontos de vida iguais ao dobro do seu nível de mago + seu modificador de Inteligência. Sempre que você sofrer dano, a proteção sofrerá o dano no lugar. Se o dano reduzir a proteção a 0 pontos de vida, você sofre qualquer dano remanescente.\nQuando a proteção estiver com 0 pontos de vida, ela não poderá mais absorver dano, mas a mágica permanece. Toda vez que você conjurar uma magia de abjuração de 1º nível ou superior, a proteção recupera um número de pontos de vida igual ao dobro do nível da magia.\nUma vez que você tenha criado a proteção, você não pode criá-la novamente até terminar um descanso longo." },
    { level: 6, name: "Proteção Projetada", description: "A partir do 6º nível, quando uma criatura que você possa ver a até 9 metros sofrer dano, você pode usar sua reação para fazer com que sua Proteção Arcana absorva aquele dano. Se esse dano reduzir a proteção a 0 pontos de vida, a criatura protegida sofrerá qualquer dano remanescente." },
    { level: 10, name: "Abjuração Aprimorada", description: "A partir do 10º nível, quando você conjurar uma magia de abjuração que requeira que você realize um teste de habilidade como parte da conjuração da magia (como em contramágica e dissipar magia), você adiciona seu bônus de proficiência a esse teste de habilidade." },
    { level: 14, name: "Resistência à Magia", description: "A partir do 14º nível, você tem vantagem em testes de resistência contra magia.\nAlém disso, você tem resistência contra o dano de magias." },
  ],
};

const adivinhacao: Subclass = {
  id: "adivinhacao",
  name: "Escola de Adivinhação",
  level: 2,
  description:
    "Os conselhos de um adivinho são procurados tanto pela realeza quanto pelos plebeus comuns, por todos que buscam uma compreensão mais clara do passado, presente e futuro. Como um adivinho, você se esforça para separar os véus do espaço, tempo e da consciência, de modo que você possa ver claramente. Você trabalha para dominar magias de discernimento, visão remota, conhecimento sobrenatural e previsão.",
  features: [
    instruida("adivinhação", "Adivinhação"),
    { level: 2, name: "Prodígio", description: "Começando no 2º nível, quando você escolhe essa escola, vislumbres do futuro começam a aparecer em sua consciência. Quando você termina um descanso longo, role dois d20s e anote os números rolados. Você pode substituir qualquer jogada de ataque, teste de resistência ou teste de habilidade feito por você ou por outra criatura que você possa ver por uma das rolagens de premonição. Você deve escolher fazer isso antes da rolagem e você pode substituir uma rolagem dessa forma apenas uma vez por rodada.\nCada rolagem de premonição pode ser usada apenas uma vez. Quando você termina um descanso longo, você perde qualquer rolagem de premonição que não tenha sido usada." },
    { level: 6, name: "Especialista em Adivinhação", description: "A partir do 6º nível, conjurar magias de adivinhação se tornou tão fácil para você que isso requer apenas uma fração do seu esforço de conjuração. Quando você conjura uma magia de adivinhação de 2º nível ou superior usando um espaço de magia, você recupera um espaço de magia gasto. O espaço de magia que você recupera deve ser de um nível inferior ao da magia conjurada e não pode ser maior que 5º nível." },
    { level: 10, name: "O Terceiro Olho", description: "A partir do 10º nível, você pode usar sua ação para aumentar seus poderes de percepção. Quando o fizer, escolha um dos benefícios a seguir, que dura até você ficar incapacitado ou realizar um descanso curto ou longo. Você não pode usar essa característica novamente até ter terminado um descanso longo.\nVisão no Escuro. Você adquire visão no escuro com alcance de 18 metros, como descrito no capítulo 8.\nVisão Etérea. Você pode ver no Plano Etéreo com alcance de 18 metros.\nCompreensão Maior. Você pode ler qualquer idioma.\nVer Invisibilidade. Você pode ver criaturas e objetos invisíveis a até 3 metros de você aos quais você tenha linha de visão." },
    { level: 14, name: "Prodígio Maior", description: "A partir do 14º nível, as visões em seus sonhos se intensificam e pintam um quadro mais preciso na sua mente do que está para acontecer. Você rola três d20s para a sua característica Prodígio, ao invés de dois." },
  ],
};

const conjuracao: Subclass = {
  id: "conjuracao",
  name: "Escola de Conjuração",
  level: 2,
  description:
    "Como um conjurador, você prefere magias que produzam objetos e criaturas do nada. Você pode conjurar nuvens esvoaçantes de gás mortal ou invocar criaturas de outros lugares para lutar por você. À medida que seu domínio cresce, você aprende magias de teletransportação e pode se teletransportar por vastas distâncias, até mesmo para outros planos de existência, em um instante.",
  features: [
    instruida("conjuração", "Conjuração"),
    { level: 2, name: "Conjuração Menor", description: "A partir do 2º nível, quando você escolhe essa escola, você pode usar sua ação para conjurar até um objeto inanimado em sua mão ou no chão, em um espaço desocupado que você possa ver, a até 3 metros de você. Esse objeto não pode ter mais de 90 centímetros de largura nem pesar mais de 5 quilos e sua forma deve ser de um objeto não mágico que você tenha visto. O objeto é visivelmente mágico, emanando penumbra a 1,5 metro.\nO objeto desaparece depois de 1 hora, quando você usa essa característica novamente ou se ele sofrer qualquer dano." },
    { level: 6, name: "Transposição Benigna", description: "A partir do 6º nível, você pode usar sua ação para se teletransportar até 9 metros em um espaço desocupado que você possa ver. Alternativamente, você pode escolher um espaço ao alcance que seja ocupado por uma criatura Pequena ou Média. Se essa criatura for voluntária, vocês dois se teletransportam, trocando de lugar.\nUma vez que você usa essa característica, não pode usá-la novamente até terminar um descanso longo ou até conjurar uma magia de conjuração de 1º nível ou superior." },
    { level: 10, name: "Conjuração Focada", description: "Começando no 10º nível, enquanto você estiver concentrado em uma magia de conjuração, sua concentração não pode ser interrompida como resultado de ter sofrido dano." },
    { level: 14, name: "Invocações Resistentes", description: "A partir do 14º nível, qualquer criatura que você invocar ou criar com uma magia de conjuração terá 30 pontos de vida temporários." },
  ],
};

const encantamento: Subclass = {
  id: "encantamento",
  name: "Escola de Encantamento",
  level: 2,
  description:
    "Como um membro da Escola de Encantamento, você afiou sua habilidade de entrar magicamente e seduzir outras pessoas e monstros. Alguns encantadores são pacifistas que fascinam os violentos para que larguem suas armas e enfeitiçam os cruéis para mostrar misericórdia. Outros são tiranos que dominam magicamente os involuntários, obrigando-os a servi-lo. A maioria dos encantadores está em algum lugar entre esses extremos.",
  features: [
    instruida("encantamento", "Encantamento"),
    { level: 2, name: "Olhar Hipnotizante", description: "A partir do 2º nível, quando você escolhe essa escola, suas palavras suaves e olhar encantador podem escravizar magicamente outra criatura. Com uma ação, escolha uma criatura que você possa ver a até 1,5 metro. Se o alvo puder ver ou ouvir você, ele deve ser bem-sucedido num teste de resistência de Sabedoria contra uma CD igual à das suas magias de mago, ou ficará enfeitiçado por você até o final do seu próximo turno. O deslocamento da criatura enfeitiçada cai para 0 e a criatura está incapacitada e visivelmente aturdida.\nNos turnos subsequentes, você pode usar sua ação para manter esse efeito, estendendo sua duração até o final do seu próximo turno. No entanto, o efeito termina se você se afastar mais de 1,5 metro da criatura, se a criatura não puder nem ver nem ouvir você ou se a criatura sofrer dano.\nAssim que o efeito terminar, ou se a criatura for bem-sucedida no teste de resistência inicial contra esse efeito, você não poderá usar essa característica nessa criatura novamente até terminar um descanso longo." },
    { level: 6, name: "Encanto Instintivo", description: "Começando no 6º nível, quando uma criatura que você puder ver a até 9 metros realizar uma jogada de ataque contra você, você pode usar sua reação para desviar o ataque, contanto que exista outra criatura no alcance do ataque. O atacante deve realizar um teste de resistência de Sabedoria contra uma CD igual à das suas magias de mago. Caso falhe, o atacante deve atacar a criatura mais próxima dele, excluindo você ou ele mesmo. Se existirem diversas criaturas próximas, o atacante escolhe qual deseja atacar. Em um sucesso, você não poderá usar essa característica contra o atacante novamente até terminar um descanso longo.\nVocê deve escolher usar essa característica antes de saber se o ataque atingiu ou errou. Criaturas que não podem ser enfeitiçadas são imunes a esse efeito." },
    { level: 10, name: "Dividir Encantamento", description: "A partir do 10º nível, quando você conjurar uma magia de encantamento de 1º nível ou superior que tenha uma única criatura como alvo, você pode fazer com que ela afete uma segunda criatura." },
    { level: 14, name: "Alterar Memórias", description: "No 14º nível, você ganha a habilidade de tornar uma criatura inconsciente da sua influência mágica sobre ela. Quando você conjura uma magia de encantamento para enfeitiçar uma ou mais criaturas, você pode alterar a compreensão de uma criatura para que ela continue sem saber que está sendo enfeitiçada.\nAlém disso, assim que a magia expirar, você pode usar sua ação para tentar fazer com que a criatura escolhida esqueça parte do tempo que permaneceu enfeitiçada. A criatura deve ser bem-sucedida num teste de resistência de Inteligência contra uma CD igual à das suas magias de mago ou perderá uma quantidade de horas da sua memória igual a 1 + seu modificador de Carisma (mínimo 1). Você pode fazer com que a criatura esqueça menos tempo e o total de tempo não pode exceder a duração da sua magia de encantamento." },
  ],
};

const evocacao: Subclass = {
  id: "evocacao",
  name: "Escola de Evocação",
  level: 2,
  description:
    "Você foca seu estudo para criar poderosos efeitos elementais, como um frio cortante, uma chama intensa, um trovão estrondoso, um relâmpago devastador e ácido ardente. Alguns evocadores encontram emprego nas forças militares, servindo como artilharia para explodir fileiras inimigas de longe. Outros usam seu poder espetacular para proteger os fracos, enquanto alguns buscam o ganho próprio como bandidos, aventureiros ou aspirantes a tiranos.",
  features: [
    instruida("evocação", "Evocação"),
    { level: 2, name: "Esculpir Magias", description: "A partir do 2º nível, você pode criar bolsões de segurança relativa contra os efeitos de suas magias de evocação. Quando você conjurar uma magia de evocação que afeta outras criaturas que você possa ver, você pode escolher um número delas igual a 1 + o nível da magia. As criaturas escolhidas passam automaticamente em seus testes de resistência contra a magia conjurada e elas não sofrem dano se normalmente sofreriam metade em um sucesso no teste de resistência." },
    { level: 6, name: "Truque Potente", description: "A partir do 6º nível, seus truques de dano afetam até mesmo as criaturas que evitariam a força daquele efeito. Quando uma criatura passa em um teste de resistência de seus truques, ela sofre metade do dano (se existir), mas não sofre nenhum efeito adicional." },
    { level: 10, name: "Evocação Potencializada", description: "A partir do 10º nível, você pode adicionar seu modificador de Inteligência no resultado das jogadas de dano de qualquer magia de evocação de mago que você conjurar. O bônus de dano se aplica a uma rolagem de dano da magia, não a múltiplas rolagens." },
    { level: 14, name: "Sobrecarga", description: "A partir do 14º nível, você pode aumentar o poder de suas magias mais simples. Quando você conjurar uma magia de mago de 5º nível ou inferior (exceto truques) que cause dano, a magia causa o dano máximo.\nA primeira vez que fizer isso, você não sofre qualquer efeito adverso. Porém, se usar de novo essa característica antes de terminar um descanso longo, você sofre 2d12 de dano necrótico para cada nível de magia, imediatamente após conjurá-la. Cada vez que você usar essa característica antes de terminar um descanso longo, o dano necrótico por nível da magia aumenta em 1d12. Esse dano ignora qualquer resistência ou imunidade." },
  ],
};

const ilusao: Subclass = {
  id: "ilusao",
  name: "Escola de Ilusão",
  level: 2,
  description:
    "Você focou seus estudos em magias que ofuscam os sentidos, confundem a mente e enganam até mesmo os povos mais sábios. Sua mágica é sutil, mas as ilusões criadas pela sua mente afiada fazem o impossível parecer real. Alguns ilusionistas – incluindo muitos magos gnomos – são vigaristas benignos que usam suas magias para entreter. Outros são mestres mais sinistros da enganação, usando suas ilusões para apavorar e iludir os outros para ganhos pessoais.",
  features: [
    instruida("ilusão", "Ilusão"),
    { level: 2, name: "Ilusão Menor Aprimorada", description: "A partir do 2º nível, quando você escolhe essa escola, você aprende o truque ilusão menor. Se você já conhece esse truque, você aprende um truque de mago diferente, à sua escolha. O truque não conta no número de truques que você conhece.\nQuando você conjurar ilusão menor, você pode criar tanto um som quanto uma imagem com uma única conjuração da magia." },
    { level: 6, name: "Ilusões Moldáveis", description: "A partir do 6º nível, quando você conjura uma magia de ilusão que tenha duração de 1 minuto ou maior, você pode usar sua ação para mudar a natureza da ilusão (usando os parâmetros normais da magia para a ilusão), considerando que você pode ver a ilusão." },
    { level: 10, name: "Eu Ilusório", description: "Começando no 10º nível, você pode criar uma duplicata ilusória de si mesmo em um instante, como uma reação instintiva ao perigo. Quando uma criatura realizar uma jogada de ataque contra você, você pode usar sua reação para interpor a duplicata ilusória entre o atacante e você. O ataque erra você automaticamente, e então, a ilusão se dissipa.\nUma vez que você usa essa característica, não pode usá-la novamente até terminar um descanso longo." },
    { level: 14, name: "Realidade Ilusória", description: "A partir do 14º nível, você aprendeu o segredo de como tecer magia sombria em suas ilusões para torná-las semirreais. Quando você conjura uma magia de ilusão de 1º nível ou superior, você pode escolher um objeto inanimado e não mágico que é parte da ilusão e tornar esse objeto real. Você pode fazer isso no seu turno, com uma ação bônus, enquanto a magia estiver em efeito. O objeto permanece real por 1 minuto. Por exemplo, você pode criar uma ilusão de uma ponte sobre um abismo e depois torná-la real tempo suficiente para que seus aliados a atravessem.\nO objeto não pode causar dano ou qualquer tipo de ferimento direto a ninguém." },
  ],
};

const necromancia: Subclass = {
  id: "necromancia",
  name: "Escola de Necromancia",
  level: 2,
  description:
    "A Escola de Necromancia explora as forças cósmicas da vida, morte e morte-vida. À medida que você foca seus estudos nessa tradição, você aprende a manipular a energia que anima todas as coisas vivas. Enquanto progride, você aprende a retirar a força vital de uma criatura enquanto sua magia destrói seu corpo, transformando a energia vital em poder mágico que você pode manipular. A maioria das pessoas vê necromantes como ameaças, ou até mesmo vilões, devido à sua associação íntima com a morte. Nem todos os necromantes são malignos, mas as forças que eles manipulam são consideradas tabu por diversas sociedades.",
  features: [
    instruida("necromancia", "Necromancia"),
    { level: 2, name: "Colheita Sinistra", description: "A partir do 2º nível, você ganha a habilidade de ceifar a energia vital das criaturas que você mata com suas magias. Uma vez por turno, quando você matar uma ou mais criaturas com uma magia de 1º nível ou superior, você recupera uma quantidade de pontos de vida igual ao dobro do nível da magia ou o triplo do seu nível, se a magia pertencer à Escola de Necromancia. Você não recebe esse benefício por matar constructos ou mortos-vivos." },
    { level: 6, name: "Escravos Mortos-Vivos", description: "No 6º nível, você adiciona a magia animar mortos ao seu grimório se você ainda não a possuir. Quando você conjurar animar mortos, você pode escolher um corpo ou pilha de ossos adicional, criando outro zumbi ou esqueleto, como apropriado.\nToda vez que você criar um morto-vivo através de uma magia de necromancia, ele terá benefícios adicionais:\n- O máximo de pontos de vida da criatura aumenta numa quantidade igual ao seu nível de mago.\n- A criatura adiciona seu bônus de proficiência às suas jogadas de dano." },
    { level: 10, name: "Acostumado à Morte-Vida", description: "A partir do 10º nível, você terá resistência a dano necrótico e seu máximo de pontos de vida não pode ser reduzido. Você gastou tanto tempo lidando com mortos-vivos e com as forças que os animam que você se acostumou a alguns dos seus piores efeitos." },
    { level: 14, name: "Comandar Mortos-Vivos", description: "A partir do 14º nível, você pode usar magia para trazer mortos-vivos ao seu controle, até os criados por outros magos. Com uma ação, você pode escolher um morto-vivo que você possa ver a até 18 metros. Essa criatura deve realizar um teste de resistência de Carisma com CD igual à das suas magias de mago. Se ela for bem-sucedida, você não poderá usar essa característica nela novamente. Se ela falhar, ela se tornará amistosa a você e obedecerá seus comandos até você usar essa característica novamente.\nMortos-vivos inteligentes são difíceis de controlar dessa forma. Se o alvo tiver Inteligência 8 ou superior, ele terá vantagem no teste de resistência. Se ele fracassar no teste de resistência e tiver Inteligência 12 ou superior, ele poderá repetir o teste de resistência ao final de cada hora até que obtenha sucesso e se liberte." },
  ],
};

const transmutacao: Subclass = {
  id: "transmutacao",
  name: "Escola de Transmutação",
  level: 2,
  description:
    "Você é um estudante de magias que modificam energia e matéria. Para você, o mundo não é uma coisa fixa, mas sim eminentemente mutável e você se deleita em ser um agente da mudança. Você empunha a matéria-prima da criação e aprendeu tanto formas físicas quanto qualidades mentais. Sua magia lhe dá as ferramentas para se tornar o ferreiro na forja da realidade. Alguns transmutadores são vigaristas ou brincalhões, transformando pessoas em sapos e transformando cobre em prata por diversão e lucro ocasional. Outros perseguem seus estudos mágicos com uma seriedade mórbida, buscando o poder dos deuses de criar e destruir mundos.",
  features: [
    instruida("transmutação", "Transmutação"),
    { level: 2, name: "Alquimia Menor", description: "A partir do 2º nível, quando você escolhe essa escola, você pode alterar temporariamente as propriedades físicas de um objeto não mágico, alterando-o de uma substância para outra. Você realiza um procedimento alquímico especial em um objeto composto inteiramente de madeira, pedra (mas não uma pedra preciosa), ferro, cobre ou prata, transformando-o em um material diferente dentre esses. Para cada 10 minutos que você gastar realizando esse procedimento, você pode transformar 30 centímetros cúbicos de material. Após 1 hora, ou até você perder sua concentração (como se estivesse se concentrando em uma magia), o material reverte à sua substância original." },
    { level: 6, name: "Pedra de Transmutador", description: "A partir do 6º nível, você pode gastar 8 horas criando uma pedra de transmutador que armazena magia de transmutação. Você pode se beneficiar da pedra ou dá-la para outra criatura. Uma criatura ganha um benefício, à sua escolha, enquanto a pedra estiver em sua posse. Quando você cria a pedra, escolha um benefício dentre as opções a seguir:\n- Visão no escuro com alcance de 18 metros, como descrito no capítulo 8\n- Um aumento de 3 metros no deslocamento enquanto a criatura não estiver sobrecarregada\n- Proficiência em testes de resistência de Constituição\n- Resistência a dano de ácido, frio, fogo, elétrico ou trovejante (escolhido por você quando escolhe esse benefício)\nCada vez que você conjurar uma magia de conjuração de 1º nível ou superior, você pode mudar o efeito da sua pedra, se ela estiver em sua posse.\nSe você criar uma nova pedra de transmutador, a anterior para de funcionar." },
    { level: 10, name: "Metamorfo", description: "No 10º nível, você adiciona a magia metamorfose ao seu grimório, se você ainda não a possuir. Você pode conjurar metamorfose sem gastar um espaço de magia. Quando o fizer, você só pode escolher a si mesmo como alvo e se transforma em uma besta com nível de desafio 1 ou menor.\nQuando você conjurar metamorfose dessa forma, você não poderá fazê-lo novamente até terminar um descanso curto ou longo, apesar de ainda poder conjurá-la normalmente usando espaços de magia disponíveis." },
    { level: 14, name: "Mestre Transmutador", description: "A partir do 14º nível, você pode usar sua ação para consumir a reserva de magia de transmutação armazenada dentro da sua pedra de transmutador em uma única explosão. Quando o fizer, escolha um dos seguintes efeitos. Sua pedra de transmutador é destruída e não pode ser refeita até você terminar um descanso longo.\nTransformação Maior. Você pode transmutar um objeto não mágico – não maior que 1,5 metro cúbico – em outro objeto não mágico de tamanho e massa similares e de valor igual ou inferior. Você deve gastar 10 minutos manipulando o objeto para transformá-lo.\nPanaceia. Você remove todas as maldições, doenças e venenos afetando uma criatura que você tocar com sua pedra de transmutador. A criatura também recupera todos os seus pontos de vida.\nRestaurar Vida. Você pode conjurar reviver mortos em uma criatura que você tocar com sua pedra de transmutador, sem gastar espaço de magia ou precisar ter a magia no seu grimório.\nRestaurar Juventude. Você toca a pedra de transmutador em uma criatura voluntária e a idade aparente da criatura é reduzida em 3d10 anos, para o mínimo de 13 anos. Esse efeito não estende a vida útil da criatura." },
  ],
};

// Tradição do Compêndio de Classes (Guia do Aventureiro da Costa da Espada).
const trovaDaLamina: Subclass = {
  id: "trova-da-lamina",
  name: "Trova da Lâmina",
  level: 2,
  description:
    "Magos que unem esgrima e magia arcana em uma dança de combate. Nos Reinos Esquecidos é restrita a elfos e meio-elfos, mas o Mestre pode ignorar a restrição.",
  features: [
    { level: 2, name: "Treinamento em Guerra e Canção", description: "Você ganha proficiência em armadura leve, em um tipo de arma corpo a corpo de uma mão à sua escolha e em Atuação, se ainda não a tiver." },
    { level: 2, name: "Canção da Lâmina", description: "Ação bônus, duas vezes por descanso curto ou longo, sem armadura média ou pesada nem escudo. Dura 1 minuto; termina se ficar incapacitado, vestir armadura média ou pesada ou escudo, ou atacar com arma usando as duas mãos, e você pode encerrá-la quando quiser, sem gastar ação. Enquanto ativa: CA +Inteligência (mínimo +1); deslocamento de caminhada +3 metros; vantagem em Destreza (Acrobacia); +Inteligência (mínimo +1) em testes de resistência de Constituição para manter concentração." },
    { level: 6, name: "Ataque Extra", description: "Você faz dois ataques, em vez de um, ao usar a ação de Ataque no seu turno." },
    { level: 10, name: "Canção de Defesa", description: "Com a Canção da Lâmina ativa, ao sofrer dano, use a reação e gaste um espaço de magia para reduzir o dano em 5 × o nível do espaço." },
    { level: 14, name: "Canção da Vitória", description: "Com a Canção da Lâmina ativa, some Inteligência (mínimo +1) ao dano dos seus ataques corpo a corpo com arma." },
  ],
};

const MAGO: ClassDef = {
  id: "mago",
  name: "Mago",
  summary:
    "Um usuário de magia escolado, capaz de manipular as estruturas da realidade. Os magos são usuários de magia soberanos, unidos e definidos como uma classe pelas magias que conjuram, aprendidas através de estudo e memorização.",
  hitDie: 6,
  primaryAbilities: ["int"],
  savingThrows: ["int", "wis"],
  armorProficiencies: [],
  weaponProficiencies: ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas leves"],
  toolProficiencies: [],
  skillChoices: { count: 2, from: ["arcanismo", "historia", "intuicao", "investigacao", "medicina", "religiao"] },
  startingEquipment: [
    "(a) um bordão ou (b) uma adaga",
    "(a) uma bolsa de componentes ou (b) um foco arcano",
    "(a) um pacote de estudioso ou (b) um pacote de explorador",
    "Um grimório",
  ],
  features: [
    {
      level: 1,
      name: "Conjuração",
      description:
        "Como um estudante da magia arcana, você possui um livro de magias (ou grimório) que revela os primeiros vislumbres de seu verdadeiro poder. Consulte o capítulo 10 para as regras gerais sobre conjuração de magias e o capítulo 11 para conferir a lista de magias de mago.\nTruques. A partir do 1º nível, você conhece três truques à sua escolha da lista de magias de mago. Você aprende truques adicionais conforme avança de nível, como mostra a coluna Truques Conhecidos na tabela O Mago.\nGrimório. No 1º nível, você possui um grimório contendo seis magias de mago de 1º nível, à sua escolha. Um grimório não contém truques.\nCopiar uma Magia para o Grimório. Quando você encontrar uma magia de mago de 1º nível ou superior, você pode adicioná-la em seu grimório, desde que seja de um nível que você possua espaços de magia, além de dispor de tempo para decifrá-la e copiá-la. Para cada nível da magia a ser copiada, gasta-se 2 horas e 50 po. O custo representa os componentes materiais que você gasta para experimentar a magia até dominá-la, bem como as finas tintas utilizadas para escrevê-la. Uma vez gasto o tempo e o dinheiro, você pode preparar a magia copiada como as suas outras magias.\nSubstituir o Grimório. Você pode copiar uma magia de seu grimório em outro livro. Você precisa gastar somente 1 hora e 10 po para cada nível de magia copiada. Se perder o seu grimório, você pode usar o mesmo procedimento para transcrever suas magias preparadas em um novo grimório. Preencher o restante do grimório exigirá que você encontre novas magias.\nPreparando e Conjurando Magias. A tabela O Mago mostra quantos espaços de magia você possui para conjurar suas magias de 1º nível e superiores. Para conjurar uma dessas magias, você precisa usar um espaço do nível da magia ou superior. Você recupera todos os espaços gastos quando termina um descanso longo. Você prepara uma lista de magias de mago que estarão disponíveis para serem conjuradas. Para tanto, você escolhe um número de magias de mago de seu grimório igual ao seu modificador de Inteligência + seu nível de mago (mínimo de uma magia). A magia precisa ser de um nível para o qual você possua espaços de magia. Conjurar a magia não a remove de sua lista de magias preparadas. Você pode mudar sua lista de magias preparadas quando terminar um descanso longo. Preparar uma nova lista de magias de mago requer que você gaste um tempo estudando seu grimório e memorizando as palavras e gestos: ao menos 1 minuto por nível de magia para cada magia que você quiser preparar em sua lista.\nHabilidade de Conjuração. Inteligência é a sua habilidade para você conjurar suas magias de mago, pois os magos aprendem novas magias através de estudo e memorização. Você usa o seu modificador de Inteligência para definir a CD dos testes de resistência para as magias de mago que você conjura e quando você realiza uma jogada de ataque com uma magia.\nCD para suas magias = 8 + bônus de proficiência + seu modificador de Inteligência.\nModificador de ataque de magia = seu bônus de proficiência + seu modificador de Inteligência.\nConjuração de Ritual. Você pode conjurar qualquer magia de mago como um ritual se ela possuir o descritor ritual, desde que a possua em seu grimório. Você não precisa ter essa magia preparada.\nFoco de Conjuração. Você pode usar um foco arcano como foco de conjuração das suas magias de mago.\nAprendendo Magias de 1º Nível ou Superior. A cada nível de mago adquirido, você pode adicionar duas magias de mago à sua escolha em seu grimório. Cada uma dessas magias deve ser de um nível para o qual você possua espaços de magia, conforme mostra a tabela O Mago.",
    },
    { level: 1, name: "Recuperação Arcana", description: "Você aprendeu como recuperar um pouco de sua energia mágica estudando seu grimório. Uma vez por dia, quando você terminar um descanso curto, você pode escolher espaços de magia gastos para recuperá-los. Os espaços gastos a serem recuperados podem ser de qualquer combinação de níveis de magia, desde que sejam iguais ou inferiores à metade de seu nível de mago (arredondado para cima) e nenhum deles seja de 6º ou superior.\nPor exemplo, se você é um mago de 4º nível, você pode recuperar até 2 espaços de magia gastos. Você pode recuperar o espaço de uma magia de 2º nível ou os espaços de duas magias de 1º nível." },
    { level: 2, name: "Tradição Arcana", description: "Quando alcança o 2º nível, você pode escolher uma Tradição Arcana, moldando sua prática de magia em uma das oito escolas: Abjuração, Adivinhação, Conjuração, Encantamento, Evocação, Ilusão, Necromancia e Transmutação. Sua escolha confere características no 2º nível e de novo no 6º, 10º e 14º nível." },
    asi(4),
    asi(8),
    asi(12),
    asi(16),
    { level: 18, name: "Dominar Magia", description: "No 18º nível, você alcança tamanha maestria em determinadas magias que pode conjurá-las à vontade. Você escolhe uma magia de mago de 1º nível e uma magia de mago de 2º nível de seu grimório. Você as conjura em seu nível mínimo, sem gastar espaços de magia quando as tiver preparadas. Caso queira, você pode conjurá-las com um espaço de nível superior, porém gastará espaços de magia, como normalmente se faz." },
    asi(19),
    { level: 20, name: "Assinatura Mágica", description: "Quando alcançar o 20º nível, você adquire domínio completo de duas poderosas magias e pode conjurá-las sem muito esforço. Escolha duas magias de mago de 3º nível em seu grimório como sua assinatura mágica. Você sempre tem essas magias preparadas e elas não contam como magias preparadas em sua lista, além de você poder conjurar cada uma das magias escolhidas, uma vez ao dia, como magias de 3º nível, sem gastar nenhum espaço. Quando o fizer, você não poderá fazê-lo de novo antes de terminar um descanso curto ou longo.\nSe você quiser conjurar essas magias com espaços de níveis superiores, a magia gastará espaços de magia, como normalmente se faz." },
  ],
  subclassLabel: "Tradição Arcana",
  subclasses: [abjuracao, adivinhacao, conjuracao, encantamento, evocacao, ilusao, necromancia, transmutacao, trovaDaLamina],
  spellcasting: {
    ability: "int",
    kind: "full",
    cantripsKnown: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    preparesSpells: true,
    ritualCasting: true,
    focus: "Foco arcano",
  },
  progressionColumns: [
    {
      label: "Espaços de Magia (1º ao 9º)",
      values: [
        "2", "3", "4/2", "4/3", "4/3/2", "4/3/3", "4/3/3/1", "4/3/3/2", "4/3/3/3/1", "4/3/3/3/2",
        "4/3/3/3/2/1", "4/3/3/3/2/1", "4/3/3/3/2/1/1", "4/3/3/3/2/1/1", "4/3/3/3/2/1/1/1", "4/3/3/3/2/1/1/1",
        "4/3/3/3/2/1/1/1/1", "4/3/3/3/3/1/1/1/1", "4/3/3/3/3/2/1/1/1", "4/3/3/3/3/2/2/1/1",
      ],
    },
    {
      label: "Recuperação Arcana (níveis de espaço)",
      values: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
    },
  ],
};

const maoAberta: Subclass = {
  id: "mao-aberta",
  name: "Caminho da Mão Aberta",
  level: 3,
  description:
    "Monges do Caminho da Mão Aberta são os mestres supremos das artes de combate marcial, tanto armado quanto desarmado. Eles aprendem técnicas para empurrar e derrubar seus oponentes, manipulando o chi para curar os ferimentos dos seus corpos e praticando uma meditação avançada que os protege de mazelas.",
  features: [
    { level: 3, name: "Técnica da Mão Aberta", description: "Começando quando você escolhe essa tradição, no 3º nível, você pode manipular o chi do seu inimigo quando você controla o seu. Toda vez que você atingir uma criatura com um dos seus ataques garantidos por sua Rajada de Golpes, você pode impor um dos seguintes efeitos no alvo:\n- Ele deve ser bem-sucedido num teste de resistência de Destreza ou cairá no chão.\n- Ele deve realizar um teste de resistência de Força. Se falhar, você pode empurrá-lo 4,5 metros para longe de você.\n- Ele não pode realizar reações até o final do seu próximo turno." },
    { level: 6, name: "Integridade Corporal", description: "No 6º nível, você ganha a habilidade de se curar. Com uma ação, você recupera uma quantidade de pontos de vida igual a três vezes seu nível de monge. Você deve terminar um descanso longo antes de poder usar essa característica novamente." },
    { level: 11, name: "Tranquilidade", description: "A partir do 11º nível, você pode entrar num estado especial de meditação que rodeia você com uma aura pacífica. No final de um descanso longo, você ganha o efeito da magia santuário que dura até o começo do seu próximo descanso longo (a magia pode terminar prematuramente, como normal). A CD do teste de resistência para a magia é 8 + seu modificador de Sabedoria + seu bônus de proficiência." },
    { level: 17, name: "Palma Vibrante", description: "No 17º nível, você ganha a habilidade de criar vibrações letais no corpo de alguém. Quando você atingir uma criatura com um golpe desarmado, você pode gastar 3 pontos de chi para começar essas vibrações imperceptíveis, que duram por um número de dias igual ao seu nível de monge. As vibrações são inofensivas, a não ser que você use sua ação para terminá-las. Para tanto, você e o alvo devem estar no mesmo plano de existência. Quando você usa essa ação, a criatura deve realizar um teste de resistência de Constituição. Se ela falhar, ela será reduzida a 0 pontos de vida. Se ela passar, ela sofrerá 10d10 de dano necrótico.\nVocê pode ter apenas uma criatura sob o efeito dessa característica por vez. Você pode escolher terminar as vibrações inofensivamente, sem usar uma ação." },
  ],
};

const sombra: Subclass = {
  id: "sombra",
  name: "Caminho da Sombra",
  level: 3,
  description:
    "Monges do Caminho da Sombra seguem uma tradição que valoriza furtividade e subterfúgio. Esses monges devem ser chamados de ninjas ou dançarinos das sombras e eles servem como espiões e assassinos. Às vezes, os membros de um monastério ninja são membros da mesma família, formando um clã que jurou sigilo sobre suas artes e missões. Outros monastérios parecem mais com guildas de ladrões, oferecendo seus serviços a nobres, mercadores ricos ou qualquer um que possa pagar suas taxas. Independente dos seus métodos, os líderes desses monastérios esperam obediência inquestionável de seus estudantes.",
  features: [
    { level: 3, name: "Artes Sombrias", description: "Começando quando você escolhe essa tradição, no 3º nível, você pode usar seu chi para simular o efeito de certas magias. Com uma ação, você pode gastar 2 pontos de chi para conjurar escuridão, visão no escuro, passos sem pegadas ou silêncio, sem precisar de componentes materiais. Além disso, você ganha o truque ilusão menor, se você ainda não o conhecia." },
    { level: 6, name: "Passo das Sombras", description: "No 6º nível, você ganha a habilidade de entrar em uma sombra e sair em outra. Quando você estiver sob penumbra ou na escuridão, com uma ação bônus, você pode se teletransportar a até 18 metros para um espaço desocupado que você possa ver que também esteja sob penumbra ou escuridão. Você, então, terá vantagem no primeiro ataque corpo a corpo que você fizer antes do final do seu turno." },
    { level: 11, name: "Manto de Sombras", description: "No 11º nível, você aprendeu a se tornar uno com as sombras. Quando você estiver em uma área de penumbra ou escuridão, você pode usar sua ação para se tornar invisível. Você permanece invisível até realizar um ataque, conjurar uma magia ou se for para uma área bem iluminada." },
    { level: 17, name: "Oportunista", description: "No 17º nível, você pode explorar um momento de distração de uma criatura quando ela é atingida por um ataque. Toda vez que uma criatura a até 1,5 metro de você for atingida por um ataque realizado por outra criatura diferente de você, você pode usar sua reação para realizar um ataque corpo a corpo contra essa criatura." },
  ],
};

const DISCIPLINAS_ELEMENTAIS =
  "Disciplinas Elementais (em ordem alfabética; se a disciplina tiver um nível como pré-requisito, você deve ter aquele nível na classe para aprendê-la):\n" +
  "Cavalgar o Vento (11º nível). Você pode gastar 4 pontos de chi para conjurar voo em si mesmo.\n" +
  "Chamas da Fênix (11º nível). Você pode gastar 4 pontos de chi para conjurar bola de fogo.\n" +
  "Chicote de Água. Você pode gastar 2 pontos de chi, com uma ação, para criar um chicote de água que empurra e puxa uma criatura para desequilibrá-la. Uma criatura que você possa ver a até 9 metros deve realizar um teste de resistência de Destreza. Se falhar, a criatura sofre 3d10 de dano de concussão, mais 1d10 de dano de concussão extra para cada ponto de chi adicional que você gastar e você pode tanto derrubar a criatura no chão, quanto puxá-la 7,5 metros para perto de você. Em um sucesso, a criatura sofre metade do dano e você não a puxa ou derruba.\n" +
  "Defesa Eterna da Montanha (17º nível). Você pode gastar 5 pontos de chi para conjurar pele de pedra em si mesmo.\n" +
  "Golpe de Varredura Cauterizante. Você pode gastar 2 pontos de chi para conjurar mãos flamejantes.\n" +
  "Gongo do Pico (6º nível). Você pode gastar 3 pontos de chi para conjurar despedaçar.\n" +
  "Investida dos Espíritos da Ventania. Você pode gastar 2 pontos de chi para conjurar lufada de vento.\n" +
  "Moldar o Rio Corrente. Com uma ação, você pode gastar 1 ponto de chi para escolher uma área de gelo ou água, não maior que 9 metros quadrados a até 36 metros de você. Você pode transformar água em gelo dentro da área, e vice-versa, e pode remodelar o gelo na área da maneira que desejar. Você pode levantar ou baixar a elevação do gelo, criar ou encher uma vala, erguer ou achatar uma parede ou formar um pilar. A extensão dessas mudanças não pode exceder metade da maior dimensão da área. Por exemplo, se você afetou 9 metros quadrados, você pode criar um pilar de até 4,5 metros de altura, erguer ou rebaixar a elevação do quadrado em 4,5 metros, escavar uma vala de 4,5 metros de profundidade e assim por diante. Você não pode moldar o gelo para aprisionar ou ferir uma criatura na área.\n" +
  "Onda de Pedras Rolantes (17º nível). Você pode gastar 6 pontos de chi para conjurar muralha de pedra.\n" +
  "Postura da Neblina (11º nível). Você pode gastar 4 pontos de chi para conjurar forma gasosa.\n" +
  "Presas da Serpente de Fogo. Quando você usa a ação de Ataque no seu turno, você pode gastar 1 ponto de chi para fazer com que gavinhas de chamas estiquem-se dos seus punhos e pés. Seu alcance com seus ataques desarmados aumenta em 3 metros durante essa ação e também pelo resto do seu turno. Um acerto com tal ataque causa dano de fogo, ao invés de dano de concussão e, se você gastar 1 ponto de chi quando atingir o ataque, ele também causará 1d10 de fogo adicional.\n" +
  "Punho do Ar Contínuo. Você pode criar uma explosão de ar comprimido que atinge como um poderoso soco. Com uma ação, você pode gastar 2 pontos de chi e escolher uma criatura a até 9 metros. A criatura deve realizar um teste de resistência de Força. Se falhar, a criatura sofrerá 3d10 de dano de concussão, mais 1d10 de dano de concussão extra para cada ponto de chi adicional que você gastar e você pode empurrar a criatura para até 6 metros longe de você e derrubá-la no chão. Em um sucesso, a criatura sofre metade do dano e você não a empurra ou derruba.\n" +
  "Punho dos Quatro Trovões. Você pode gastar 2 pontos de chi para conjurar onda trovejante.\n" +
  "Rio de Chamas Famintas (17º nível). Você pode gastar 5 pontos de chi para conjurar muralha de fogo.\n" +
  "Serragem do Vento do Norte (6º nível). Você pode gastar 3 pontos de chi para conjurar imobilizar pessoa.\n" +
  "Sintonia Elemental. Você pode usar sua ação para, momentaneamente, controlar as forças elementais próximas, causando um dos seguintes efeitos, à sua escolha:\n- Criar, instantaneamente, um efeito sensorial inofensivo relacionado à água, ar, fogo ou terra, como uma chuva de faíscas, um sopro de vento, uma leve rajada de névoa ou um suave estrondo de pedra.\n- Acender ou apagar, instantaneamente, uma vela, tocha ou pequena fogueira.\n- Esfriar ou esquentar 0,5 quilo de material inorgânico por até 1 hora.\n- Fazer com que terra, fogo, ar ou névoa que possa caber dentro de 30 centímetros cúbicos se molde em uma forma bruta que você esculpiu por 1 minuto.\n" +
  "Sopro do Inverno (17º nível). Você pode gastar 6 pontos de chi para conjurar cone de frio.";

const quatroElementos: Subclass = {
  id: "quatro-elementos",
  name: "Caminho dos Quatro Elementos",
  level: 3,
  description:
    "Você segue uma tradição monástica que ensina você a dominar os elementos. Quando você foca seu chi, você pode se alinhar com as forças da criação e moldar os elementos à sua vontade, usando-os como uma extensão do seu corpo. Alguns membros dessa tradição se dedicam a um único elemento, mas outros tecem os elementos juntos. Muitos monges dessa tradição tatuam seus corpos com representações dos seus poderes de chi, normalmente representadas através de dragões enrolados, mas também como fênix, peixes, plantas, montanhas e ondas coroantes.",
  features: [
    {
      level: 3,
      name: "Discípulo dos Elementos",
      description:
        "Quando você escolhe essa tradição, no 3º nível, você aprende disciplinas mágicas que manipulam o poder dos quatro elementos. Uma disciplina requer que você gaste pontos de chi cada vez que você a usa.\nVocê conhece a disciplina Sintonia Elemental e uma outra disciplina, à sua escolha. Você aprende uma disciplina adicional, à sua escolha, no 6º, 11º e 17º nível. Toda vez que você aprende uma nova disciplina elemental, você pode substituir uma disciplina elemental que você já conhecia por uma disciplina diferente.\nConjurando Magias Elementais. Algumas disciplinas elementais permitem que você conjure magias. Veja o capítulo 10 para as regras gerais de conjuração. Para conjurar uma dessas magias, você usa o tempo de conjuração da mesma e suas outras regras, mas você não precisa fornecer os componentes materiais dela.\nQuando você alcança o 5º nível nessa classe, você pode gastar pontos de chi adicionais para aumentar o nível da magia de disciplina elemental que você conjurar, considerando que a magia tenha um efeito de aprimoramento para um nível superior, como mãos flamejantes, por exemplo. O nível da magia aumenta em 1 para cada ponto de chi adicional que você gastar. Por exemplo, se você for um monge de 5º nível e usar Golpe de Varredura Cauterizante para conjurar mãos flamejantes, você pode gastar 3 pontos de chi para conjurá-la como uma magia de 2º nível (o custo base da disciplina de 2 pontos mais 1).\nO número máximo de pontos de chi que você pode gastar para conjurar uma magia dessa forma (incluindo seu custo de chi base e quaisquer pontos de chi adicionais que você gastar para elevar seu nível) é determinado pelo seu nível de monge, como mostrado na tabela Magias e Pontos de Chi: níveis 5º-8º: 3; 9º-12º: 4; 13º-16º: 5; 17º-20º: 6.\n" +
        DISCIPLINAS_ELEMENTAIS,
    },
    { level: 6, name: "Disciplina Elemental (6º nível)", description: "Você aprende uma disciplina elemental adicional, à sua escolha (veja Discípulo dos Elementos)." },
    { level: 11, name: "Disciplina Elemental (11º nível)", description: "Você aprende uma disciplina elemental adicional, à sua escolha (veja Discípulo dos Elementos)." },
    { level: 17, name: "Disciplina Elemental (17º nível)", description: "Você aprende uma disciplina elemental adicional, à sua escolha (veja Discípulo dos Elementos)." },
  ],
};

// Tradições do Compêndio de Classes (Guia do Aventureiro da Costa da Espada).
const morteAmpla: Subclass = {
  id: "morte-ampla",
  name: "Caminho da Morte Ampla",
  level: 3,
  description:
    "Monges obcecados pelos mecanismos da morte, que estudam o instante do falecimento das criaturas e aplicam esse conhecimento em um estilo de luta letal.",
  features: [
    { level: 3, name: "Toque da Morte", description: "Ao reduzir a 0 PV uma criatura a até 1,5 metro, você ganha PV temporários iguais a Sabedoria + nível de monge (mínimo 1)." },
    { level: 6, name: "Hora de Ceifar", description: "Ação: cada criatura a até 9 metros que possa ver você faz um teste de resistência de Sabedoria; se falhar, fica amedrontada por você até o fim do seu próximo turno." },
    { level: 11, name: "Maestria da Morte", description: "Ao cair a 0 PV, você pode gastar 1 ponto de chi (sem ação) para ficar com 1 PV." },
    { level: 17, name: "Toque da Morte Ampla", description: "Ação: toque uma criatura a até 1,5 metro e gaste de 1 a 10 pontos de chi. Ela faz um teste de resistência de Constituição: sofre 2d10 de dano necrótico por ponto de chi gasto se falhar, ou metade se passar." },
  ],
};

const almaSolar: Subclass = {
  id: "alma-solar",
  name: "Caminho da Alma Solar",
  level: 3,
  description:
    "Monges que canalizam a própria energia vital em rajadas de luz ardente, acreditando que a meditação libera a luz presente na alma de todo ser vivo.",
  features: [
    { level: 3, name: "Rajada Solar Radiante", description: "Você ganha um ataque à distância com magia, usável com a ação de Ataque: alcance 9 metros, com proficiência, usando Destreza no ataque e no dano. Causa dano radiante, com dado d4 que acompanha a coluna Artes Marciais. Ao atacar assim com a ação de Ataque, você pode gastar 1 ponto de chi para fazer dois ataques adicionais com ele, como ação bônus." },
    { level: 6, name: "Golpe em Arco Ardente", description: "Logo após usar a ação de Ataque, gaste 2 pontos de chi para conjurar mãos flamejantes como ação bônus. Cada ponto de chi adicional aumenta o nível da magia em 1. O total máximo de chi gasto é metade do nível de monge (arredondado para baixo)." },
    { level: 11, name: "Explosão Solar Ardente", description: "Ação: crie um orbe e lance-o em um ponto a até 45 metros. Cada criatura em uma esfera de 6 metros de raio faz um teste de resistência de Constituição ou sofre 2d6 de dano radiante; quem está atrás de cobertura total opaca não faz o teste. Cada ponto de chi gasto (máximo 3) aumenta o dano em 2d6." },
    { level: 17, name: "Escudo Solar", description: "Você emite luz plena em 9 metros de raio e penumbra por mais 9 metros; apaga ou reacende com uma ação bônus. Enquanto brilha, ao ser atingido por ataque corpo a corpo, pode usar a reação para causar ao atacante dano radiante igual a 5 + Sabedoria." },
  ],
};

const MONGE: ClassDef = {
  id: "monge",
  name: "Monge",
  summary:
    "Um mestre das artes marciais, utilizando o poder do próprio corpo, tanto para ataque quanto para defesa, canalizando a energia mística do chi.",
  hitDie: 8,
  primaryAbilities: ["dex", "wis"],
  savingThrows: ["str", "dex"],
  armorProficiencies: [],
  weaponProficiencies: ["Armas simples", "Espadas curtas"],
  toolProficiencies: ["Escolha um tipo de ferramenta de artesão ou um instrumento musical"],
  skillChoices: { count: 2, from: ["acrobacia", "atletismo", "furtividade", "historia", "intuicao", "religiao"] },
  startingEquipment: [
    "(a) uma espada curta ou (b) qualquer arma simples",
    "(a) um pacote de explorador ou (b) um pacote de aventureiro",
    "10 dardos",
  ],
  features: [
    { level: 1, name: "Defesa sem Armadura", description: "A partir do 1º nível, quando você não estiver vestindo nenhuma armadura nem empunhando um escudo, sua Classe de Armadura será 10 + seu modificador de Destreza + seu modificador de Sabedoria." },
    { level: 1, name: "Artes Marciais", description: "No 1º nível, sua prática nas artes marciais concede a você maestria nos estilos de combate que utilizam golpes desarmados e armas de monge, que são as espadas curtas e quaisquer armas simples corpo a corpo que não tenham a propriedade duas mãos ou pesada.\nVocê ganha os seguintes benefícios enquanto estiver desarmado ou empunhando uma arma de monge e não estiver vestindo nenhuma armadura ou empunhando um escudo:\n- Você pode usar Destreza ao invés de Força para as jogadas de ataque e dano dos seus golpes desarmados e de suas armas de monge.\n- Você pode rolar um d4 no lugar do dano normal dos seus golpes desarmados e armas de monge. Esse dado muda à medida que você adquire níveis de monge, como mostrado na coluna Artes Marciais na tabela O Monge.\n- Quando você usa a ação de Ataque com um golpe desarmado ou uma arma de monge no seu turno, você pode realizar um golpe desarmado com uma ação bônus. Por exemplo, se você realizar a ação de Ataque com um bastão, você também poderá realizar um golpe desarmado com uma ação bônus, assumindo que você ainda não realizou uma ação bônus nesse turno.\nDeterminados monastérios usam formas especializadas de armas de monge. Por exemplo, você pode usar uma clava feita por dois pedaços de madeira conectados por uma pequena corrente (chamado de nunchaku) ou uma foice com uma estranha lâmina fina (chamada de kama). Qualquer que seja o nome que você use para uma arma de monge, você pode usar as estatísticas de jogo mostradas para as armas no capítulo 5." },
    { level: 2, name: "Chi", description: "A partir do 2º nível, seu treinamento permitiu que você controlasse a energia mística do chi. Seu acesso a essa energia é representado por um número de pontos de chi. Seu nível de monge determina o número de pontos que você tem, como mostrado na coluna Pontos de Chi da tabela O Monge.\nVocê pode gastar esses pontos para abastecer várias características de chi. Você começa conhecendo três dessas características: Rajada de Golpes, Defesa Paciente e Passo do Vento. Você aprende mais características de chi à medida que adquire níveis nessa classe.\nQuando você gasta um ponto de chi, ele se torna indisponível até você terminar um descanso curto ou longo, no fim deste, todos os pontos de chi gastos voltam para você. Você deve gastar, pelo menos, 30 minutos do descanso meditando para recuperar seus pontos de chi.\nAlgumas das características de chi requerem que seu alvo realize um teste de resistência para resistir ao efeito da característica. A CD do teste de resistência é calculada a seguir:\nCD de resistência de Chi = 8 + bônus de proficiência + seu modificador de Sabedoria.\nRajada de Golpes. Imediatamente após você realizar a ação de Ataque no seu turno, você pode gastar 1 ponto de chi para realizar dois golpes desarmados com uma ação bônus.\nDefesa Paciente. Você pode gastar 1 ponto de chi para realizar a ação de Esquivar, com uma ação bônus, no seu turno.\nPasso do Vento. Você pode gastar 1 ponto de chi para realizar a ação de Desengajar ou Disparada, com uma ação bônus, no seu turno, e sua distância de salto é dobrada nesse turno." },
    { level: 2, name: "Movimento sem Armadura", description: "A partir do 2º nível, seu deslocamento aumenta em 3 metros enquanto você não estiver usando armadura nem empunhando um escudo. Esse bônus aumenta quando você alcança determinados níveis, como mostrado na tabela O Monge.\nNo 9º nível, você ganha a habilidade de se mover através de superfícies verticais e sobre líquidos, no seu turno, sem cair durante o movimento." },
    { level: 3, name: "Tradição Monástica", description: "Quando você alcança o 3º nível, você ingressa numa tradição monástica: o Caminho da Mão Aberta, o Caminho da Sombra ou o Caminho dos Quatro Elementos. Sua tradição concede a você características no 3º nível e novamente no 6º, 11º e 17º nível." },
    { level: 3, name: "Defletir Projéteis", description: "A partir do 3º nível, você pode usar sua reação para defletir ou apanhar o projétil quando você é atingido por um ataque de arma à distância. Quando o fizer, o dano que você sofrer do ataque é reduzido em 1d10 + seu modificador de Destreza + seu nível de monge.\nSe o dano for reduzido a 0, você pode apanhar o projétil se ele for pequeno o suficiente para ser segurado em uma mão e você tenha, pelo menos, uma mão livre. Se você apanhar um projétil dessa forma, você pode gastar 1 ponto de chi para realizar um ataque à distância com a arma ou munição que você acabou de pegar, como parte da mesma reação. Você realiza esse ataque com proficiência, independentemente das armas em que você é proficiente, e o projétil conta como uma arma de monge para o ataque. A distância do ataque do monge é de 6/18 metros." },
    asi(4),
    { level: 4, name: "Queda Lenta", description: "Começando no 4º nível, você pode usar sua reação, quando você cai, para reduzir o dano de queda sofrido por um valor igual a cinco vezes seu nível de monge." },
    { level: 5, name: "Ataque Extra", description: "A partir do 5º nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno." },
    { level: 5, name: "Ataque Atordoante", description: "A partir do 5º nível, você pode interferir no fluxo de chi do corpo de um oponente. Quando você atingir outra criatura com um ataque corpo a corpo com arma, você pode gastar 1 ponto de chi para tentar um ataque atordoante. O alvo deve ser bem-sucedido num teste de resistência de Constituição ou ficará atordoado até o final do seu próximo turno." },
    { level: 6, name: "Golpes de Chi", description: "A partir do 6º nível, seus golpes desarmados contam como armas mágicas com o propósito de ultrapassar a resistência ou imunidade a ataques e danos não mágicos." },
    { level: 7, name: "Evasão", description: "A partir do 7º nível, você pode esquivar-se agilmente de certos efeitos em área, como o sopro elétrico de um dragão azul ou uma magia bola de fogo. Quando você for alvo de um efeito que exige um teste de resistência de Destreza para sofrer metade do dano, você não sofre dano algum se passar, e somente metade do dano se falhar." },
    { level: 7, name: "Mente Tranquila", description: "A partir do 7º nível, você pode usar sua ação para terminar um efeito em si mesmo que esteja lhe enfeitiçando ou amedrontando." },
    asi(8),
    { level: 9, name: "Aprimoramento de Movimento sem Armadura", description: "No 9º nível, você ganha a habilidade de se mover através de superfícies verticais e sobre líquidos, no seu turno, sem cair durante o movimento (veja Movimento sem Armadura)." },
    { level: 10, name: "Pureza Corporal", description: "No 10º nível, sua maestria do chi flui através de você, tornando-o imune a doenças e venenos." },
    asi(12),
    { level: 13, name: "Idiomas do Sol e da Lua", description: "A partir do 13º nível, você aprende a tocar o chi de outras mentes fazendo com que você compreenda todos os idiomas falados. Além do mais, qualquer criatura que possa entender um idioma poderá entender o que você fala." },
    { level: 14, name: "Alma de Diamante", description: "A partir do 14º nível, sua maestria do chi concede a você proficiência em todos os testes de resistência.\nAlém disso, toda vez que você realizar um teste de resistência e falhar, você pode gastar 1 ponto de chi para jogar novamente e ficar com o segundo resultado." },
    { level: 15, name: "Corpo Atemporal", description: "No 15º nível, seu chi sustenta você tanto que você não sofre os efeitos da velhice e não pode envelhecer magicamente. Você ainda morrerá de velhice, no entanto. Além disso, você não precisa mais de comida ou água." },
    asi(16),
    { level: 18, name: "Corpo Vazio", description: "A partir do 18º nível, você pode usar sua ação para gastar 4 pontos de chi e ficar invisível por 1 minuto. Durante esse tempo, você também adquire resistência a todos os danos, exceto dano de energia.\nAlém disso, você pode gastar 8 pontos de chi para conjurar a magia projeção astral, sem precisar de componentes materiais. Quando o fizer, você não pode levar qualquer outra criatura com você." },
    asi(19),
    { level: 20, name: "Auto Aperfeiçoamento", description: "No 20º nível, quando você rolar iniciativa e não tiver nenhum ponto de chi restante, você recupera 4 pontos de chi." },
  ],
  subclassLabel: "Tradição Monástica",
  subclasses: [maoAberta, sombra, quatroElementos, morteAmpla, almaSolar],
  progressionColumns: [
    {
      label: "Artes Marciais",
      values: ["1d4", "1d4", "1d4", "1d4", "1d4", "1d6", "1d6", "1d6", "1d6", "1d6", "1d8", "1d8", "1d8", "1d8", "1d8", "1d8", "1d10", "1d10", "1d10", "1d10"],
    },
    {
      label: "Pontos de Chi",
      values: ["-", 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
    {
      label: "Deslocamento sem Armadura",
      values: ["-", "+3 m", "+3 m", "+3 m", "+3 m", "+4,5 m", "+4,5 m", "+4,5 m", "+4,5 m", "+6 m", "+6 m", "+6 m", "+6 m", "+7,5 m", "+7,5 m", "+7,5 m", "+7,5 m", "+9 m", "+9 m", "+9 m"],
    },
  ],
};

const expulsarProfano =
  "Uma criatura expulsa deve gastar seu turno tentando se mover para longe de você da melhor forma possível e não pode, voluntariamente, se mover para um espaço a menos de 9 metros de você. Ela também não pode realizar reações. Nas ações dela, ela só poderá realizar a ação de Disparada ou tentar escapar de um efeito que a impeça de se mover. Se não houver lugar para se mover, a criatura pode usar a ação de Esquivar.";

const devocao: Subclass = {
  id: "devocao",
  name: "Juramento de Devoção",
  level: 3,
  description:
    "O Juramento de Devoção vincula um paladino aos mais sublimes ideais de justiça, virtude e ordem. Algumas vezes chamados de campeões, cavaleiros brancos ou guerreiros sagrados, esses paladinos atendem o ideal do cavaleiro na armadura brilhante, agindo com honra em busca de justiça e do bem maior. Eles se agarram aos mais altos padrões de conduta, e alguns, para o melhor ou para o pior, consideram que o resto do mundo deve ter os mesmos padrões. Muitos dos que fazem esse juramento são devotados aos deuses da lei e do bem e usam os dogmas de seus deuses como medida de sua devoção. Eles consideram os anjos – os perfeitos servos do bem – como seus ideais e incorporam imagens de asas angelicais em seus elmos ou brasões.\nDogmas de Devoção. Honestidade: não minta nem trapaceie, deixe sua palavra ser sua garantia. Coragem: nunca tenha medo de agir, apesar de a cautela ser sensata. Compaixão: ajude os outros, proteja os fracos, puna aqueles que os ameaçarem; mostre misericórdia aos seus adversários, mas tempere isso com sabedoria. Honra: trate os outros com equidade e deixe seus feitos honoráveis serem exemplos para eles; faça o máximo de bem possível causando a menor quantidade de mazelas. Dever: seja responsável pelos seus atos e por suas consequências, proteja aqueles confiados aos seus cuidados e obedeça aqueles que tiverem autoridade sobre você.",
  features: [
    { level: 3, name: "Magias de Juramento", description: "Você ganha magias de juramento nos níveis de paladino descritos (sempre preparadas, não contam no limite de magias preparadas):\n3º nível: proteção contra o bem e mal, santuário\n5º nível: restauração menor, zona da verdade\n9º nível: sinal de esperança, dissipar magia\n13º nível: movimentação livre, guardião da fé\n17º nível: comunhão, coluna de chamas" },
    { level: 3, name: "Canalizar Divindade: Arma Sagrada", description: "Com uma ação, você pode imbuir uma arma que você esteja empunhando com energia positiva, usando seu Canalizar Divindade. Por 1 minuto, você adiciona seu modificador de Carisma às jogadas de ataque feitas com essa arma (bônus mínimo de +1). A arma também emite luz plena num raio de 6 metros e penumbra mais 6 metros além. Se a arma ainda não for mágica, ela se torna mágica por essa duração.\nVocê pode terminar o efeito no seu turno, como parte de qualquer ação. Se você não estiver mais segurando ou portando a arma, ou estiver inconsciente, esse efeito termina." },
    { level: 3, name: "Canalizar Divindade: Expulsar o Profano", description: "Com uma ação, você apresenta seu símbolo sagrado e faz uma oração censurando corruptores e mortos-vivos, usando seu Canalizar Divindade. Cada corruptor ou morto-vivo que puder ver ou ouvir você e esteja a até 9 metros deve realizar um teste de resistência de Sabedoria. Se a criatura falhar no teste de resistência, ela será expulsa por 1 minuto ou até sofrer dano.\n" + expulsarProfano },
    { level: 7, name: "Aura de Devoção", description: "A partir do 7º nível, você e as criaturas amistosas a até 3 metros não podem ser enfeitiçadas enquanto você estiver consciente.\nNo 18º nível, o alcance dessa aura aumenta para 9 metros." },
    { level: 15, name: "Pureza de Espírito", description: "A partir do 15º nível, você estará sempre sob efeito da magia proteção contra o bem e mal." },
    { level: 20, name: "Halo Sagrado", description: "No 20º nível, com uma ação, você pode emanar uma aura de luz solar. Por 1 minuto, luz plena emana de você num raio de 9 metros, penumbra brilha mais 9 metros além. Sempre que uma criatura inimiga começar seu turno na luz plena, a criatura sofrerá 10 de dano radiante. Além disso, por essa duração, você tem vantagem em testes de resistência contra magias conjuradas por corruptores ou mortos-vivos.\nUma vez que você use essa característica, não poderá fazê-lo novamente até ter terminado um descanso longo." },
  ],
};

const ancioes: Subclass = {
  id: "ancioes",
  name: "Juramento dos Anciões",
  level: 3,
  description:
    "O Juramento dos Anciões é tão antigo quanto a raça dos elfos e os rituais dos druidas. Algumas vezes chamados de cavaleiros feéricos, cavaleiros verdejantes ou cavaleiros dos chifres, paladinos que fazem esse juramento lançam sua sorte com o lado da luz na batalha cósmica contra as trevas, porque eles amam as coisas belas e vivificantes do mundo, não necessariamente porque eles acreditam em princípios de honra, coragem e justiça. Eles adornam suas armaduras e roupas com imagens de coisas que crescem – folhas, galhadas ou flores – para refletir seu comprometimento em preservar a vida e a luz no mundo.\nDogmas dos Anciões. Acenda a Luz: através dos seus atos de misericórdia, gentileza e piedade, acenda a luz da esperança no mundo, afastando o desespero. Abrigue a Luz: onde houver bem, beleza, amor e riso no mundo, mantenha-se contra a maldade que pode engolir isso; onde a vida floresce, mantenha-se contra as forças que podem torná-la estéril. Preserve Sua Própria Luz: deleite-se com música e risadas, beleza e arte; se você permitir que a luz morra em seu coração, você não poderá preservá-la no mundo. Seja a Luz: seja um glorioso guia para todos que vivem em desespero; deixe a luz da sua alegria e coragem brilhar através de todos os seus feitos.",
  features: [
    { level: 3, name: "Magias de Juramento", description: "Você ganha magias de juramento nos níveis de paladino descritos (sempre preparadas, não contam no limite de magias preparadas):\n3º nível: golpe constritor, falar com animais\n5º nível: raio lunar, passo nebuloso\n9º nível: ampliar plantas, proteção contra energia\n13º nível: tempestade de gelo, pele de pedra\n17º nível: comunhão com a natureza, caminhar em árvores" },
    { level: 3, name: "Canalizar Divindade: Fúria da Natureza", description: "Você pode usar seu Canalizar Divindade para invocar forças primitivas para enredar um oponente. Com uma ação, você pode fazer com que vinhas espectrais cresçam e alcancem uma criatura a até 3 metros de você, que você possa ver. A criatura deve ser bem-sucedida num teste de resistência de Força ou Destreza (à escolha dela) ou ficará impedida. Enquanto estiver impedida pelas vinhas, a criatura repete o teste de resistência no final de cada turno dela. Se obtiver sucesso, ela se liberta e as vinhas desaparecem." },
    { level: 3, name: "Canalizar Divindade: Expulsar os Infiéis", description: "Você pode usar seu Canalizar Divindade para pronunciar palavras antigas que são dolorosas para fadas e corruptores que as ouvem. Com uma ação, você ergue seu símbolo sagrado e cada fada ou corruptor que puder ver ou ouvir você e esteja a até 9 metros deve realizar um teste de resistência de Sabedoria. Se a criatura falhar no teste de resistência, ela será expulsa por 1 minuto ou até sofrer dano.\n" + expulsarProfano },
    { level: 7, name: "Aura de Vigilância", description: "A partir do 7º nível, a magia antiga fica tão profunda em você que ela forma uma proteção mística. Você e as criaturas amistosas a até 3 metros têm resistência ao dano de magias.\nNo 18º nível, o alcance dessa aura aumenta para 9 metros." },
    { level: 15, name: "Sentinela Imortal", description: "A partir do 15º nível, quando você for reduzido a 0 pontos de vida, mas não morrer totalmente, você pode escolher cair para 1 ponto de vida no lugar. Uma vez que você use essa característica, não poderá fazê-lo novamente até ter terminado um descanso longo.\nAlém disso, você não sofre nenhum efeito colateral por envelhecer e você não pode envelhecer magicamente." },
    { level: 20, name: "Campeão dos Anciões", description: "No 20º nível, você pode assumir a forma de uma antiga força da natureza, tomando a aparência que desejar. Por exemplo, sua pele poderia ficar verde ou adquirir uma textura de casca de árvore, seu cabelo poderia ficar com aparência de folhas ou musgo ou poderia crescer galhadas ou uma juba como a de um leão.\nUsando sua ação, você sofre uma transformação. Por 1 minuto, você ganha os seguintes benefícios:\n- No início de cada um dos seus turnos, você recupera 10 pontos de vida.\n- Sempre que você for conjurar uma magia de paladino que tiver um tempo de conjuração de 1 ação, você pode conjurá-la usando uma ação bônus, ao invés.\n- Criaturas inimigas a até 3 metros de você têm desvantagem em testes de resistência contra suas magias de paladino e as opções de Canalizar Divindade.\nUma vez que você use essa característica, não poderá fazê-lo novamente até ter terminado um descanso longo." },
  ],
};

const vinganca: Subclass = {
  id: "vinganca",
  name: "Juramento de Vingança",
  level: 3,
  description:
    "O Juramento de Vingança é um comprometimento solene de punir aqueles que cometeram pecados graves. Quando forças malignas chacinam camponeses indefesos, quando todo um povo se volta contra a vontade dos deuses, quando uma guilda de ladrões cresce e se torna violenta e poderosa, quando um dragão investe através da zona rural – em momentos como esses, paladinos surgem e fazem o Juramento de Vingança para tornar certo o que já foi errado. Para esses paladinos – algumas vezes chamados de vingadores ou de cavaleiros negros – sua própria pureza não é tão importante quanto trazer justiça.\nDogmas de Vingança. Combater o Mal Maior: entre escolher lutar contra meus inimigos jurados ou combater um mal menor, eu escolho o mal maior. Sem Misericórdia para os Malignos: inimigos comuns podem ter minha misericórdia, mas meus inimigos jurados não. A Todo Custo: meus escrúpulos não podem ficar no caminho do extermínio dos meus inimigos. Restituição: se meus inimigos causaram ruína no mundo, é porque eu falhei em detê-los; devo ajudar aqueles prejudicados pelos delitos.",
  features: [
    { level: 3, name: "Magias de Juramento", description: "Você ganha magias de juramento nos níveis de paladino descritos (sempre preparadas, não contam no limite de magias preparadas):\n3º nível: perdição, marca do caçador\n5º nível: imobilizar pessoa, passo nebuloso\n9º nível: velocidade, proteção contra energia\n13º nível: banimento, porta dimensional\n17º nível: imobilizar monstro, vidência" },
    { level: 3, name: "Canalizar Divindade: Abjurar Inimigo", description: "Com uma ação, você ergue seu símbolo sagrado e faz uma prece de condenação, usando seu Canalizar Divindade. Escolha uma criatura a até 18 metros de você que você possa ver. A criatura deve realizar um teste de resistência de Sabedoria, a não ser que seja imune a ser amedrontada. Corruptores e mortos-vivos têm desvantagem nesse teste de resistência.\nNum fracasso no teste de resistência, a criatura ficará amedrontada por 1 minuto ou até sofrer qualquer dano. Enquanto estiver amedrontada, o deslocamento da criatura será 0 e ela não pode receber qualquer bônus de deslocamento.\nEm um sucesso, o deslocamento da criatura é reduzido à metade por 1 minuto ou até que ela sofra qualquer dano." },
    { level: 3, name: "Canalizar Divindade: Voto de Inimizade", description: "Com uma ação, você pode pronunciar um voto de inimizade contra uma criatura que você possa ver a até 3 metros, usando seu Canalizar Divindade. Você ganha vantagem nas jogadas de ataque contra a criatura por 1 minuto ou até ela cair a 0 pontos de vida ou cair inconsciente." },
    { level: 7, name: "Vingador Implacável", description: "No 7º nível, seu foco sobrenatural ajuda você a impedir a fuga de um inimigo. Quando você atinge uma criatura com um ataque de oportunidade, você pode se mover até metade do seu deslocamento, imediatamente depois do ataque e como parte da mesma reação. Esse movimento não provoca ataques de oportunidade." },
    { level: 15, name: "Alma de Vingança", description: "A partir do 15º nível, a autoridade com a qual você fala seu Voto de Inimizade lhe dá maior poder sobre seu inimigo. Quando uma criatura sob efeito do seu Voto de Inimizade realizar um ataque, você pode usar sua reação para realizar um ataque corpo a corpo com arma contra essa criatura, se ela estiver ao seu alcance." },
    { level: 20, name: "Anjo Vingador", description: "No 20º nível, você pode assumir a forma de um anjo vingador. Usando sua ação, você sofre uma transformação. Por 1 hora, você ganha os seguintes benefícios:\n- Asas crescem nas suas costas e lhe concedem deslocamento de voo de 18 metros.\n- Você emana uma aura de ameaça num raio de 9 metros. A primeira vez que qualquer criatura inimiga entrar na aura ou começar seu turno nela, durante uma batalha, a criatura deve ser bem-sucedida num teste de resistência de Sabedoria ou ficará amedrontada em relação a você por 1 minuto ou até sofrer qualquer dano. Jogadas de ataque contra a criatura amedrontada têm vantagem.\nUma vez que você use essa característica, não poderá fazê-lo novamente até ter terminado um descanso longo." },
  ],
};

// Juramento do Compêndio de Classes (Guia do Aventureiro da Costa da Espada).
const coroa: Subclass = {
  id: "coroa",
  name: "Juramento da Coroa",
  level: 3,
  description:
    "Devotos da civilização, de uma nação, de um soberano ou de uma divindade da ordem, dedicados às leis justas que mantêm a sociedade unida. Dogmas: Lei, Lealdade, Coragem e Responsabilidade.",
  features: [
    { level: 3, name: "Magias de Juramento", description: "Magias concedidas por nível de paladino. 3º: comando, duelo forçado. 5º: vínculo protetor, zona da verdade. 9º: aura de vitalidade, guardiões espirituais. 13º: banimento, guardião da fé. 17º: círculo do poder, missão." },
    { level: 3, name: "Canalizar Divindade: Desafio do Campeão", description: "Cada criatura à sua escolha a até 9 metros que possa ver você faz um teste de resistência de Sabedoria. Se falhar, não pode se afastar voluntariamente a mais de 9 metros de você. O efeito termina se você ficar incapacitado ou morrer, ou se a criatura for movida para mais de 9 metros." },
    { level: 3, name: "Canalizar Divindade: Virar o Jogo", description: "Ação bônus: cada criatura à sua escolha a até 9 metros que possa ouvir você e esteja com metade ou menos do máximo de PV recupera 1d6 + Carisma (mínimo 1) PV." },
    { level: 7, name: "Obediência Divina", description: "Reação: quando uma criatura a até 1,5 metro sofrer dano, você assume esse dano no lugar dela. O dano não pode ser reduzido nem prevenido de nenhuma forma." },
    { level: 15, name: "Espírito Obstinado", description: "Você tem vantagem em testes de resistência para evitar ser paralisado ou atordoado." },
    { level: 20, name: "Campeão Enaltecido", description: "Ação, uma vez por descanso longo, por 1 hora (termina antes se ficar incapacitado ou morrer): resistência a dano de concussão, cortante e perfurante de armas não mágicas; aliados a até 9 metros têm vantagem em testes de resistência contra a morte; você e aliados a até 9 metros têm vantagem em testes de resistência de Sabedoria." },
  ],
};

const PALADINO: ClassDef = {
  id: "paladino",
  name: "Paladino",
  summary:
    "Um guerreiro divino vinculado a um juramento sagrado, que une proeza marcial a magia divina para proteger os inocentes e combater o mal.",
  hitDie: 10,
  primaryAbilities: ["str", "cha"],
  savingThrows: ["wis", "cha"],
  armorProficiencies: ["Todas as armaduras", "Escudos"],
  weaponProficiencies: ["Armas simples", "Armas marciais"],
  toolProficiencies: [],
  skillChoices: { count: 2, from: ["atletismo", "intuicao", "intimidacao", "medicina", "persuasao", "religiao"] },
  startingEquipment: [
    "(a) uma arma marcial e um escudo ou (b) duas armas marciais",
    "(a) cinco azagaias ou (b) qualquer arma simples corpo a corpo",
    "(a) um pacote de sacerdote ou (b) um pacote de aventureiro",
    "Cota de malha e um símbolo sagrado",
  ],
  features: [
    { level: 1, name: "Sentido Divino", description: "A presença de um mal poderoso é registrada nos seus sentidos como um odor nocivo e o bem poderoso badala como música celestial nos seus ouvidos. Com uma ação, você pode expandir sua consciência para detectar tais forças. Até o final do seu próximo turno, você sabe a localização de qualquer celestial, corruptor ou morto-vivo a 18 metros de você que não esteja com cobertura total. Você sabe o tipo (celestial, corruptor ou morto-vivo) de qualquer ser cuja presença você sentiu, mas não sua identidade (o vampiro Conde Strahd von Zarovich, por exemplo). Dentro do mesmo raio, você também detecta a presença de qualquer lugar ou objeto que tenha sido consagrado ou conspurcado, como pela magia consagrar.\nVocê pode usar essa característica um número de vezes igual a 1 + seu modificador de Carisma. Quando você concluir um descanso longo, você recupera todos os usos gastos." },
    { level: 1, name: "Cura pelas Mãos", description: "Seu toque abençoado pode curar ferimentos. Você tem um poço de poder curativo que se enche quando você realiza um descanso longo. Com esse poço, você pode restaurar um número total de pontos de vida igual ao seu nível de paladino x 5.\nCom uma ação, você pode tocar uma criatura e sugar poder do seu poço para restaurar um número de pontos de vida da criatura, até o máximo de pontos restantes no poço.\nAlternativamente, você pode gastar 5 pontos de cura do seu poço de cura para curar o alvo de uma doença ou neutralizar um veneno que o esteja afetando. Você pode curar múltiplas doenças e neutralizar múltiplos venenos com um único uso de Cura pelas Mãos, gastando pontos de vida separadamente para cada um.\nEssa característica não gera nenhum efeito em mortos-vivos e constructos." },
    { level: 2, name: "Estilo de Luta", description: "No 2º nível, você adota um estilo de combate particular que será sua especialidade. Escolha uma das opções a seguir. Você não pode escolher o mesmo Estilo de Luta mais de uma vez, mesmo se puder escolher de novo.\nCombate com Armas Grandes. Quando você rolar um 1 ou um 2 num dado de dano de um ataque com arma corpo a corpo que você esteja empunhando com duas mãos, você pode rolar o dado novamente e usar a nova rolagem, mesmo que resulte em 1 ou 2. A arma deve ter a propriedade duas mãos ou versátil para ganhar esse benefício.\nDefesa. Enquanto estiver usando armadura, você ganha +1 de bônus em sua CA.\nDuelismo. Quando você empunhar uma arma de ataque corpo a corpo em uma mão e nenhuma outra arma, você ganha +2 de bônus nas jogadas de dano com essa arma.\nProteção. Quando uma criatura que você possa ver atacar um alvo que esteja a até 1,5 metro de você, você pode usar sua reação para impor desvantagem nas jogadas de ataque da criatura. Você deve estar empunhando um escudo." },
    { level: 2, name: "Conjuração", description: "No 2º nível, você aprende a extrair magia divina através de meditação e oração para conjurar magias, como um clérigo faz. Veja o capítulo 10 para as regras gerais de conjuração e o capítulo 11 para a lista de magias de paladino.\nPreparando e Conjurando Magias. A tabela O Paladino mostra quantos espaços de magia você tem para conjurar suas magias de 1º nível e superiores. Para conjurar uma dessas magias, você precisa gastar um espaço do nível da magia ou superior. Você recupera todos os espaços gastos quando termina um descanso longo. Você prepara a lista de magias disponíveis selecionando-as da lista de magias de paladino. Você seleciona um número de magias igual ao seu modificador de Carisma + metade do seu nível de paladino, arredondado para baixo (mínimo de uma magia). Essas magias devem ser de níveis para os quais você possua espaços de magia. Você pode modificar a sua lista de magias preparadas quando termina um descanso longo. Preparar uma nova lista requer tempo gasto em preces e meditação: no mínimo 1 minuto por nível de magia para cada magia preparada.\nHabilidade de Conjuração. Carisma é a sua habilidade para você conjurar suas magias de paladino, já que seu poder deriva da força das suas convicções. Você usa o seu modificador de Carisma para definir a CD dos testes de resistência para as magias de paladino que você conjura e quando você realiza uma jogada de ataque com uma magia.\nCD para suas magias = 8 + bônus de proficiência + seu modificador de Carisma.\nModificador de ataque de magia = seu bônus de proficiência + seu modificador de Carisma.\nFoco de Conjuração. Você pode usar um símbolo sagrado como foco de conjuração das suas magias de paladino." },
    { level: 2, name: "Destruição Divina", description: "A partir do 2º nível, quando você atingir uma criatura com um ataque corpo a corpo com arma, você pode gastar um espaço de magia de qualquer classe para causar dano radiante no alvo, além do dano normal da arma. O dano extra é de 2d8 para um espaço de magia de 1º nível, mais 1d8 para cada espaço de magia acima do 1º, até o máximo de 5d8. O dano aumenta em 1d8 se o alvo for um corruptor ou um morto-vivo." },
    { level: 3, name: "Saúde Divina", description: "No 3º nível, a magia divina flui através de você tornando você imune a doenças." },
    { level: 3, name: "Juramento Sagrado", description: "Quando você alcança o 3º nível, você faz um juramento que o torna um paladino para sempre. Até então, você estava em um estágio preparatório, guiado pelo caminho, mas ainda não jurado a ele. Agora você escolhe o Juramento de Devoção, o Juramento dos Anciões ou o Juramento de Vingança. Sua escolha lhe confere características no 3º nível e novamente no 7º, 15º e 20º nível. Tais características incluem as magias de juramento e a característica Canalizar Divindade.\nMagias de Juramento. Cada juramento possui uma lista de magias associada a ele. Você ganha acesso a essas magias nos níveis especificados na descrição do juramento. Uma vez que você tenha ganhado acesso a uma magia de juramento, você sempre a terá preparada. Magias de juramento não contam no número de magias que você pode preparar a cada dia. Se você ganhar uma magia de juramento que não apareça na lista de magias de paladino, a magia será, no entanto, uma magia de paladino para você.\nCanalizar Divindade. Seu juramento permite que você canalize energia divina para abastecer efeitos mágicos. Cada opção de Canalizar Divindade concedida por um juramento explica como usá-la. Quando você usa o seu Canalizar Divindade, você escolhe qual opção usar. Você deve terminar um descanso curto ou longo para poder usar seu Canalizar Divindade novamente. Alguns efeitos de Canalizar Divindade requerem um teste de resistência. Quando você usar tais efeitos dessa classe, a CD será igual à CD das suas magias de paladino." },
    asi(4),
    { level: 5, name: "Ataque Extra", description: "A partir do 5º nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Atacar no seu turno." },
    { level: 6, name: "Aura de Proteção", description: "A partir do 6º nível, sempre que você ou uma criatura amigável a até 3 metros de você tiver que fazer um teste de resistência, aquela criatura ganha um bônus no seu teste de resistência igual ao seu modificador de Carisma (com um bônus mínimo de +1). Você deve estar consciente para garantir esse bônus.\nNo 18º nível, o alcance dessa aura aumenta para 9 metros." },
    asi(8),
    { level: 10, name: "Aura de Coragem", description: "Começando no 10º nível, você e as criaturas amigáveis dentro de um raio de 3 metros de você não podem ser amedrontadas enquanto você estiver consciente.\nNo 18º nível, o alcance dessa aura aumenta para 9 metros." },
    { level: 11, name: "Destruição Divina Aprimorada", description: "No 11º nível, você fica tão infundido com o poder da justiça que todos os seus ataques corpo a corpo com arma carregam poder divino neles. Sempre que você atingir uma criatura com um ataque corpo a corpo, a criatura sofre 1d8 de dano radiante extra. Se você também usar sua Destruição Divina em um ataque, você adiciona esse dano ao dano extra da sua Destruição Divina." },
    asi(12),
    { level: 14, name: "Toque Purificador", description: "A partir do 14º nível, você pode usar sua ação para terminar uma magia em si mesmo ou em uma criatura voluntária que você tocar.\nVocê pode usar essa característica um número de vezes igual ao seu modificador de Carisma (mínimo uma vez). Você recupera os usos gastos quando termina um descanso longo." },
    asi(16),
    { level: 18, name: "Aprimoramentos de Aura", description: "No 18º nível, o alcance das suas auras (Aura de Proteção e Aura de Coragem, além da aura do seu juramento) aumenta para 9 metros." },
    asi(19),
  ],
  subclassLabel: "Juramento Sagrado",
  subclasses: [devocao, ancioes, vinganca, coroa],
  spellcasting: {
    ability: "cha",
    kind: "half",
    preparesSpells: true,
    focus: "Símbolo sagrado",
  },
  progressionColumns: [
    {
      label: "Espaços de Magia (1º ao 5º)",
      values: [
        "-", "2", "3", "3", "4/2", "4/2", "4/3", "4/3", "4/3/2", "4/3/2",
        "4/3/3", "4/3/3", "4/3/3/1", "4/3/3/1", "4/3/3/2", "4/3/3/2", "4/3/3/3/1", "4/3/3/3/1", "4/3/3/3/2", "4/3/3/3/2",
      ],
    },
    {
      label: "Poço de Cura pelas Mãos (PV)",
      values: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    },
  ],
};

export const CLASSES_B: ClassDef[] = [GUERREIRO, GUARDIAO, LADINO, MAGO, MONGE, PALADINO];
