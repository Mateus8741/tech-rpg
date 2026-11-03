// Classes D&D 5e (PT-BR) - parte A: Bárbaro, Bardo, Bruxo, Clérigo, Druida, Feiticeiro.
// Fonte: Livro do Jogador (PT-BR) + Compêndio de Classes (Sword Coast Adventurer's Guide).
import type { ClassDef, ClassFeature } from "../types";

const asi = (level: number): ClassFeature => ({
  level,
  name: "Incremento no Valor de Habilidade",
  description:
    "Quando você atinge o 4° nível e novamente no 8°, 12°, 16° e 19° nível, você pode aumentar um valor de habilidade, à sua escolha, em 2 ou você pode aumentar dois valores de habilidade, à sua escolha, em 1. Como padrão, você não pode elevar um valor de habilidade acima de 20 com essa característica.",
});

const cantrips = (...v: number[]) => v;
const dash = "—";

// ---------------------------------------------------------------------------
// BÁRBARO
// ---------------------------------------------------------------------------
const BARBARO: ClassDef = {
  id: "barbaro",
  name: "Bárbaro",
  summary:
    "Um feroz guerreiro de origem primitiva que consegue entrar em fúria no combate, ganhando força e resiliência sobre-humanas.",
  hitDie: 12,
  primaryAbilities: ["str"],
  savingThrows: ["str", "con"],
  armorProficiencies: ["Armaduras leves", "Armaduras médias", "Escudos"],
  weaponProficiencies: ["Armas simples", "Armas marciais"],
  toolProficiencies: [],
  skillChoices: {
    count: 2,
    from: ["adestrarAnimais", "atletismo", "intimidacao", "natureza", "percepcao", "sobrevivencia"],
  },
  startingEquipment: [
    "(a) um machado grande ou (b) qualquer arma marcial corpo a corpo",
    "(a) dois machados de mão ou (b) qualquer arma simples",
    "Um pacote de aventureiro e quatro azagaias",
  ],
  features: [
    {
      level: 1,
      name: "Fúria",
      description:
        "Em batalha, você luta com uma ferocidade primitiva. No seu turno, você pode entrar em fúria com uma ação bônus. Enquanto estiver em fúria, você recebe os seguintes benefícios se você não estiver vestindo uma armadura pesada: você tem vantagem em testes de Força e testes de resistência de Força; quando você desferir um ataque com arma corpo a corpo usando Força, você recebe um bônus nas jogadas de dano que aumenta à medida que você adquire níveis de bárbaro, como mostrado na coluna Dano de Fúria; você possui resistência contra dano de concussão, cortante e perfurante. Se você for capaz de conjurar magias, você não poderá conjurá-las ou se concentrar nelas enquanto estiver em fúria. Sua fúria dura por 1 minuto. Ela termina prematuramente se você cair inconsciente ou se seu turno acabar e você não tiver atacado nenhuma criatura hostil desde seu último turno ou tiver sofrido dano nesse período. Você também pode terminar sua fúria no seu turno com uma ação bônus. Quando você tiver usado a quantidade de fúrias mostrada para o seu nível de bárbaro na coluna Fúrias, você precisará terminar um descanso longo antes de poder entrar em fúria novamente.",
    },
    {
      level: 1,
      name: "Defesa sem Armadura",
      description:
        "Quando você não estiver vestindo qualquer armadura, sua Classe de Armadura será 10 + seu modificador de Destreza + seu modificador de Constituição. Você pode usar um escudo e continuar a receber esse benefício.",
    },
    {
      level: 2,
      name: "Ataque Descuidado",
      description:
        "A partir do 2° nível, você pode desistir de toda preocupação com sua defesa para atacar com um desespero feroz. Quando você fizer o seu primeiro ataque no turno, você pode decidir atacar descuidadamente. Fazer isso lhe concede vantagem nas jogadas de ataque com armas corpo a corpo usando Força durante seu turno, porém, as jogadas de ataques feitas contra você possuem vantagem até o início do seu próximo turno.",
    },
    {
      level: 2,
      name: "Sentido de Perigo",
      description:
        "No 2° nível, você adquire um sentido sobrenatural de quando as coisas próximas não estão como deveriam, concedendo a você uma chance maior quando estiver evitando perigos. Você possui vantagem em testes de resistência de Destreza contra efeitos que você possa ver, como armadilhas e magias. Para receber esse benefício você não pode estar cego, surdo ou incapacitado.",
    },
    {
      level: 3,
      name: "Caminho Primitivo",
      description:
        "No 3° nível, você escolhe um caminho que molda a natureza da sua fúria: o Caminho do Furioso ou o Caminho do Guerreiro Totêmico (e, nos Reinos Esquecidos, o Caminho do Raivoso de Batalha). Sua escolha lhe concederá características no 3° nível e novamente no 6°, 10° e 14° níveis.",
    },
    asi(4),
    {
      level: 5,
      name: "Ataque Extra",
      description:
        "A partir do 5° nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno.",
    },
    {
      level: 5,
      name: "Movimento Rápido",
      description:
        "Começando no 5° nível, seu deslocamento aumenta em 3 metros enquanto você não estiver vestindo uma armadura pesada.",
    },
    {
      level: 6,
      name: "Característica de Caminho Primitivo",
      description: "Você recebe uma característica do seu Caminho Primitivo.",
    },
    {
      level: 7,
      name: "Instinto Selvagem",
      description:
        "No 7° nível, seu instinto está tão apurado que você recebe vantagem nas jogadas de iniciativa. Além disso, se você estiver surpreso no começo de um combate e não estiver incapacitado, você pode agir normalmente no seu primeiro turno, mas apenas se você entrar em fúria antes de realizar qualquer outra coisa neste turno.",
    },
    asi(8),
    {
      level: 9,
      name: "Crítico Brutal (+1 dado)",
      description:
        "A partir do 9° nível, você pode rolar um dado de dano de arma adicional quando estiver determinando o dano extra de um acerto crítico com uma arma corpo a corpo.",
    },
    {
      level: 10,
      name: "Característica de Caminho Primitivo",
      description: "Você recebe uma característica do seu Caminho Primitivo.",
    },
    {
      level: 11,
      name: "Fúria Implacável",
      description:
        "A partir do 11° nível, sua fúria pode manter você lutando independente da gravidade dos seus ferimentos. Se você cair para 0 pontos de vida enquanto estiver em fúria e não morrer, você pode realizar um teste de resistência de Constituição CD 10. Se você for bem sucedido, você volta para 1 ponto de vida ao invés disso. Cada vez que você utilizar essa característica após a primeira, a CD aumenta em 5. Assim que você terminar um descanso curto ou longo a CD volta para 10.",
    },
    asi(12),
    {
      level: 13,
      name: "Crítico Brutal (+2 dados)",
      description: "Aumenta para dois dados de dano de arma adicionais em um acerto crítico com uma arma corpo a corpo.",
    },
    {
      level: 14,
      name: "Característica de Caminho Primitivo",
      description: "Você recebe uma característica do seu Caminho Primitivo.",
    },
    {
      level: 15,
      name: "Fúria Persistente",
      description:
        "A partir do 15° nível, sua fúria é tão brutal que ela só termina prematuramente se você cair inconsciente ou se você decidir terminá-la.",
    },
    asi(16),
    {
      level: 17,
      name: "Crítico Brutal (+3 dados)",
      description: "Aumenta para três dados de dano de arma adicionais em um acerto crítico com uma arma corpo a corpo.",
    },
    {
      level: 18,
      name: "Força Indomável",
      description:
        "A partir do 18° nível, se o total de um teste de Força seu for menor que o seu valor de Força, você pode usar esse valor no lugar do resultado.",
    },
    asi(19),
    {
      level: 20,
      name: "Campeão Primitivo",
      description:
        "No 20° nível, você incorpora os poderes da natureza. Seus valores de Força e Constituição aumentam em 4. Seu máximo para esses valores agora é 24.",
    },
  ],
  subclassLabel: "Caminho Primitivo",
  subclasses: [
    {
      id: "furioso",
      name: "Caminho do Furioso",
      level: 3,
      description:
        "Para alguns bárbaros, a fúria é um meio para um fim - esse fim é a violência. O Caminho do Furioso é um caminho de fúria livre, entumecido em sangue. À medida que você entra na fúria de um furioso, você vibra no caos da batalha, despreocupado com a sua própria saúde ou bem-estar.",
      features: [
        {
          level: 3,
          name: "Frenesi",
          description:
            "Começando no momento que você escolhe esse caminho no 3° nível, você pode entrar num frenesi quando estiver em fúria. Se você desejar, pela duração da sua fúria, você pode realizar um único ataque corpo a corpo com arma, com uma ação bônus, em cada um de seus turnos após esse. Quando sua fúria acabar, você sofrerá um nível de exaustão (como descrito no apêndice A).",
        },
        {
          level: 6,
          name: "Fúria Inconsciente",
          description:
            "A partir do 6° nível, você não pode ser enfeitiçado ou amedrontado enquanto estiver em fúria. Se você estava enfeitiçado ou amedrontado quando entrou em fúria, o efeito é suspenso pela duração da fúria.",
        },
        {
          level: 10,
          name: "Presença Intimidante",
          description:
            "A partir do 10° nível, você pode usar sua ação para amedrontar alguém com sua presença intimidante. Quando o fizer, escolha uma criatura que você possa ver a 9 metros. Se a criatura puder ver ou ouvir você, ela deve ser bem sucedida num teste de resistência de Sabedoria (CD igual a 8 + seu bônus de proficiência + seu modificador de Carisma) ou ficará com medo de você até o fim do seu próximo turno. Nos turnos seguintes, você pode usar sua ação para estender a duração desse efeito na criatura amedrontada até o início do seu próximo turno. Esse efeito termina se a criatura terminar seu turno fora da sua linha de visão ou a mais de 18 metros de você. Se a criatura for bem sucedida no teste de resistência, você não poderá usar essa característica nessa criatura novamente por 24 horas.",
        },
        {
          level: 14,
          name: "Retaliação",
          description:
            "A partir do 14° nível, quando você sofrer dano de uma criatura que esteja a até 1,5 metro de você, você pode usar sua reação para realizar um ataque corpo a corpo com arma contra essa criatura.",
        },
      ],
    },
    {
      id: "guerreiro-totemico",
      name: "Caminho do Guerreiro Totêmico",
      level: 3,
      description:
        "O Caminho do Guerreiro Totêmico é uma jornada espiritual, a partir do momento que o bárbaro aceita um espírito animal como seu guia, protetor e inspiração. Em batalha, seu espírito totêmico preenche você com força sobrenatural, adicionando combustível mágico a sua fúria bárbara. Inclui as opções de Alce e Tigre do Compêndio de Classes (Sword Coast Adventurer's Guide).",
      features: [
        {
          level: 3,
          name: "Conselheiro Espiritual",
          description:
            "Seu caminho é buscar a sintonia com o mundo natural, concedendo a você uma afinidade com as bestas. A partir do 3° nível, quando você toma esse caminho, você recebe a habilidade de conjurar as magias sentido bestial e falar com animais, mas apenas na forma de rituais, como descrito no capítulo 10.",
        },
        {
          level: 3,
          name: "Totem Espiritual",
          description:
            "A partir do 3° nível, você escolhe um totem espiritual e ganha suas características. Você deve fazer ou adquirir um objeto físico como totem - um amuleto ou adorno similar - que incorpora o pelo ou penas, garras, dente ou ossos do animal totêmico. Seu totem animal deve ser um animal relacionado aos listados aqui, mas pode ser um mais apropriado a sua terra natal. Águia: quando estiver em fúria e não estiver vestindo uma armadura pesada, as outras criaturas terão desvantagem nas jogadas de ataque de oportunidade contra você e você pode usar a ação de Disparada como uma ação bônus no seu turno. Lobo: quando estiver em fúria, seus amigos têm vantagem nas jogadas de ataque corpo a corpo realizadas contra qualquer criatura a 1,5 metro de você que seja hostil a você. Urso: quando em fúria, você adquire resistência a todos os tipos de dano, exceto dano psíquico. Alce (Compêndio): enquanto você estiver em fúria, seu deslocamento de caminhada aumenta em 4,5 metros. Tigre (Compêndio): enquanto estiver em fúria, você pode adicionar 3 metros ao seu salto em distância e 90 centímetros ao seu salto em altura.",
        },
        {
          level: 6,
          name: "Aspecto da Besta",
          description:
            "No 6° nível, você adquire um benefício místico baseado no totem que você escolheu. Você pode escolher o mesmo animal que selecionou no 3° nível ou um diferente. Águia: você pode ver a até 1,6 km sem dificuldade, sendo capaz de discernir até os menores detalhes quando estiver olhando para algo a menos de 30 metros de você; além disso, penumbra não impõe desvantagem nos seus testes de Sabedoria (Percepção). Lobo: você pode rastrear outras criaturas quando estiver viajando a passo rápido e pode se mover furtivamente quando estiver viajando a passo normal. Urso: sua capacidade de carga (incluindo carga máxima e capacidade de erguer) é dobrada e você tem vantagem em testes de Força realizados para empurrar, puxar, erguer ou quebrar objetos. Alce (Compêndio): quer esteja montado ou a pé, seu ritmo de viagem é dobrado, assim como o de até dez companheiros enquanto estiverem a até 18 metros de você e não estiverem incapacitados. Tigre (Compêndio): você ganha proficiência em duas perícias da lista a seguir: Atletismo, Acrobacia, Furtividade e Sobrevivência.",
        },
        {
          level: 10,
          name: "Andarilho Espiritual",
          description:
            "No 10° nível, você pode conjurar a magia comunhão com a natureza, mas apenas como um ritual. Quando o fizer, uma versão espiritual de um dos animais que você escolheu como Totem Espiritual ou Aspecto da Besta aparece para você para transmitir a informação que você busca.",
        },
        {
          level: 14,
          name: "Sintonia Totêmica",
          description:
            "No 14° nível, você ganha um benefício mágico baseado em um totem animal, à sua escolha. Você pode escolher o mesmo animal que selecionou anteriormente ou um diferente. Águia: quando estiver em fúria, você adquire um deslocamento de voo igual ao seu deslocamento de caminhada (funciona apenas em pequenas explosões: você cai se terminar seu turno no ar e não tiver nada em que possa se agarrar). Lobo: quando estiver em fúria, você pode usar uma ação bônus no seu turno para derrubar uma criatura Grande ou menor no chão quando você atingi-la com um ataque corpo a corpo com arma. Urso: quando estiver em fúria, qualquer criatura a até 1,5 metro de você que for hostil a você terá desvantagem nas jogadas de ataque contra outros alvos além de você ou outro personagem com essa característica (um inimigo é imune a esse efeito se ele não puder ver ou ouvir você ou caso ele não possa ser amedrontado). Alce (Compêndio): enquanto estiver em fúria, você pode usar uma ação bônus durante seu movimento para atravessar o espaço de uma criatura Grande ou menor; essa criatura deve ser bem sucedida num teste de resistência de Força (CD 8 + seu bônus de Força + seu bônus de proficiência) ou cairá no chão e sofrerá dano de concussão igual a 1d12 + seu modificador de Força. Tigre (Compêndio): enquanto estiver em fúria, se você se mover pelo menos 6 metros em linha reta em direção de um alvo Grande ou menor antes de realizar um ataque corpo a corpo com arma contra ele, você pode usar sua ação bônus para realizar um ataque corpo a corpo com arma contra ele.",
        },
      ],
    },
    {
      id: "raivoso-de-batalha",
      name: "Caminho do Raivoso de Batalha",
      level: 3,
      description:
        "Conhecido como Kuldjargh (literalmente \"machado idiota\") em Anão, os raivosos de batalha são anões seguidores do deus da guerra. Eles se especializam em vestir grossas armaduras de cravos e se jogam no combate, atacando com seus próprios corpos e se entregando à fúria de batalha. Restrição: exclusivo para anões (o Mestre pode ignorar essa restrição). Fonte: Compêndio de Classes (Sword Coast Adventurer's Guide).",
      features: [
        {
          level: 3,
          name: "Armadura do Raivoso de Batalha",
          description:
            "Quando você escolhe esse caminho no 3° nível, você ganha a habilidade de usar a armadura com cravos como arma. Enquanto você estiver vestindo uma armadura com cravos e estiver em fúria, você pode usar uma ação bônus para realizar um ataque corpo a corpo com arma com sua armadura com cravos contra um alvo a até 1,5 metro de você. Se o ataque atingir, os cravos causam 1d4 de dano perfurante. Você usa seu modificador de Força para as jogadas de ataque e dano. Além disso, quando você usa a ação de Ataque para agarrar uma criatura, o alvo sofre 3 de dano perfurante se seu agarrão for bem sucedido. Armadura de Cravos: armadura média rara feita para anões (casaco de couro e caneleiras cobertos por cravos). Preço 75 po; CA 14 + modificador de Destreza (máx. 2); Furtividade: desvantagem; Peso 15 kg.",
        },
        {
          level: 6,
          name: "Abandono Descuidado",
          description:
            "A partir do 6° nível, quando você usa o Ataque Descuidado enquanto está em fúria, você também ganha pontos de vida temporários igual ao seu modificador de Constituição (mínimo 1). Eles somem se ainda sobrarem quando sua fúria terminar.",
        },
        {
          level: 10,
          name: "Investida do Raivoso de Batalha",
          description:
            "Começando no 10° nível, você pode usar a ação de Disparada com uma ação bônus enquanto estiver em fúria.",
        },
        {
          level: 14,
          name: "Retribuição Perfurante",
          description:
            "A partir do 14° nível, quando uma criatura a até 1,5 metro de você atinge você com um ataque corpo a corpo, o atacante sofre 3 de dano perfurante se você estiver em fúria, não estiver incapacitado e estiver vestindo uma armadura com cravos.",
        },
      ],
    },
  ],
  progressionColumns: [
    { label: "Fúrias", values: [2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, "Ilimitado"] },
    { label: "Dano de Fúria", values: [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4].map((n) => `+${n}`) },
  ],
};

// ---------------------------------------------------------------------------
// BARDO
// ---------------------------------------------------------------------------
const BARDO: ClassDef = {
  id: "bardo",
  name: "Bardo",
  summary:
    "Um mestre da música, da palavra e da magia que inspira aliados, desmoraliza oponentes, manipula mentes, cria ilusões e até cura ferimentos.",
  hitDie: 8,
  primaryAbilities: ["cha"],
  savingThrows: ["dex", "cha"],
  armorProficiencies: ["Armaduras leves"],
  weaponProficiencies: ["Armas simples", "Bestas de mão", "Espadas longas", "Rapieiras", "Espadas curtas"],
  toolProficiencies: ["Três instrumentos musicais, à sua escolha"],
  skillChoices: { count: 3, from: "any" },
  startingEquipment: [
    "(a) uma rapieira, (b) uma espada longa ou (c) qualquer arma simples",
    "(a) um pacote de diplomata ou (b) um pacote de artista",
    "(a) um lute ou (b) qualquer outro instrumento musical",
    "Armadura de couro e uma adaga",
  ],
  features: [
    {
      level: 1,
      name: "Conjuração",
      description:
        "Você aprendeu a desembaraçar e remodelar o tecido da realidade em harmonia com os seus desejos e música. Truques: você conhece dois truques, à sua escolha, da lista de magias de bardo, e aprende truques adicionais em níveis mais altos (coluna Truques Conhecidos). Espaços de Magia: a tabela O Bardo mostra quantos espaços de magia de 1° nível e superiores você possui; você recobra todos os espaços gastos quando completa um descanso longo. Magias Conhecidas: você conhece quatro magias de 1° nível da lista de magias de bardo; a coluna Magias Conhecidas mostra quando você aprende mais. Quando você adquire um nível na classe, pode substituir uma magia de bardo que conheça por outra da lista, de um nível ao qual você tenha espaços de magia. Habilidade de Conjuração: Carisma. CD das magias = 8 + bônus de proficiência + modificador de Carisma; modificador de ataque de magia = bônus de proficiência + modificador de Carisma. Conjuração de Ritual: você pode conjurar como ritual qualquer magia de bardo que conheça e que possua o descritor ritual. Foco de Conjuração: você pode usar um instrumento musical como foco de conjuração das suas magias de bardo.",
    },
    {
      level: 1,
      name: "Inspiração de Bardo",
      description:
        "Você pode inspirar os outros através de palavras animadoras ou música. Para tanto, você usa uma ação bônus no seu turno para escolher uma outra criatura, que não seja você mesmo, a até 18 metros de você que possa ouvi-lo. Essa criatura ganha um dado de Inspiração de Bardo, um d6. Uma vez, nos próximos 10 minutos, a criatura poderá rolar o dado e adicionar o valor rolado a um teste de habilidade, jogada de ataque ou teste de resistência que ela fizer. A criatura pode esperar até rolar o d20 antes de decidir usar o dado, mas deve decidir antes do Mestre dizer se a rolagem foi bem ou mal sucedida. Quando o dado for rolado, ele é gasto. Uma criatura pode ter apenas um dado de Inspiração de Bardo por vez. Você pode usar essa característica um número de vezes igual ao seu modificador de Carisma (no mínimo uma vez). Você recupera todos os usos quando termina um descanso longo. O dado se torna um d8 no 5° nível, um d10 no 10° nível e um d12 no 15° nível.",
    },
    {
      level: 2,
      name: "Versatilidade",
      description:
        "A partir do 2° nível, você pode adicionar metade do seu bônus de proficiência, arredondado para baixo, em qualquer teste de habilidade que você fizer que ainda não possua seu bônus de proficiência.",
    },
    {
      level: 2,
      name: "Canção de Descanso",
      description:
        "A partir do 2° nível, você pode usar música ou oração calmantes para ajudar a revitalizar seus aliados feridos durante um descanso curto. Se você ou qualquer criatura amigável que puder ouvir sua atuação recuperar pontos de vida no fim do descanso curto ao gastar um ou mais Dados de Vida, cada uma dessas criaturas recupera 1d6 pontos de vida adicionais. Os pontos de vida adicionais aumentam para 1d8 no 9° nível, 1d10 no 13° nível e 1d12 no 17° nível.",
    },
    {
      level: 3,
      name: "Colégio de Bardo",
      description:
        "No 3° nível, você investiga as técnicas avançadas de um colégio de bardo, à sua escolha: o Colégio do Conhecimento ou o Colégio da Bravura. Sua escolha lhe concede características no 3° nível e novamente no 6° e 14° nível.",
    },
    {
      level: 3,
      name: "Aptidão",
      description:
        "No 3° nível, escolha duas das perícias em que você é proficiente. Seu bônus de proficiência é dobrado em qualquer teste de habilidade que você fizer que utilize qualquer das perícias escolhidas. No 10° nível, você escolhe mais duas perícias em que é proficiente para ganhar esse benefício.",
    },
    asi(4),
    {
      level: 5,
      name: "Inspiração de Bardo (d8)",
      description: "Seu dado de Inspiração de Bardo se torna um d8.",
    },
    {
      level: 5,
      name: "Fonte de Inspiração",
      description:
        "Começando no momento em que você atinge o 5° nível, você recupera todos os usos gastos da sua Inspiração de Bardo quando você termina um descanso curto ou longo.",
    },
    {
      level: 6,
      name: "Característica de Colégio de Bardo",
      description: "Você recebe uma característica do seu Colégio de Bardo.",
    },
    {
      level: 6,
      name: "Canção de Proteção",
      description:
        "No 6° nível, você adquire a habilidade de usar notas musicais ou palavras de poder para interromper efeito de influência mental. Com uma ação, você pode começar uma atuação que dura até o fim do seu próximo turno. Durante esse tempo, você e qualquer criatura amigável a até 9 metros de você terá vantagem em testes de resistência para não ser amedrontado ou enfeitiçado. Uma criatura deve ser capaz de ouvir você para receber esse benefício. A atuação termina prematuramente se você for incapacitado ou silenciado ou se você terminá-la voluntariamente (não requer ação).",
    },
    asi(8),
    {
      level: 9,
      name: "Canção de Descanso (d8)",
      description: "Os pontos de vida adicionais da Canção de Descanso aumentam para 1d8.",
    },
    {
      level: 10,
      name: "Inspiração de Bardo (d10)",
      description: "Seu dado de Inspiração de Bardo se torna um d10.",
    },
    {
      level: 10,
      name: "Aptidão (2 perícias adicionais)",
      description:
        "Você escolhe mais duas perícias em que é proficiente para ganhar o benefício da Aptidão (bônus de proficiência dobrado).",
    },
    {
      level: 10,
      name: "Segredos Mágicos",
      description:
        "No 10° nível, você usurpou conhecimento mágico de um vasto espectro de disciplinas. Escolha duas magias de qualquer classe, incluindo essa. A magia que você escolher deve ser de um nível que você possa conjurar, como mostrado na tabela O Bardo, ou um truque. As magias escolhidas contam como magias de bardo para você e já estão incluídas no número da coluna Magias Conhecidas. Você aprende duas magias adicionais de qualquer classe no 14° nível e novamente no 18° nível.",
    },
    asi(12),
    {
      level: 13,
      name: "Canção de Descanso (d10)",
      description: "Os pontos de vida adicionais da Canção de Descanso aumentam para 1d10.",
    },
    {
      level: 14,
      name: "Característica de Colégio de Bardo",
      description: "Você recebe uma característica do seu Colégio de Bardo.",
    },
    {
      level: 14,
      name: "Segredos Mágicos (2 magias adicionais)",
      description: "Você aprende duas magias adicionais de qualquer classe (veja Segredos Mágicos, 10° nível).",
    },
    {
      level: 15,
      name: "Inspiração de Bardo (d12)",
      description: "Seu dado de Inspiração de Bardo se torna um d12.",
    },
    asi(16),
    {
      level: 17,
      name: "Canção de Descanso (d12)",
      description: "Os pontos de vida adicionais da Canção de Descanso aumentam para 1d12.",
    },
    {
      level: 18,
      name: "Segredos Mágicos (2 magias adicionais)",
      description: "Você aprende duas magias adicionais de qualquer classe (veja Segredos Mágicos, 10° nível).",
    },
    asi(19),
    {
      level: 20,
      name: "Inspiração Superior",
      description:
        "No 20° nível, quando você rolar iniciativa e não tiver nenhum uso restante de Inspiração de Bardo, você recupera um uso.",
    },
  ],
  subclassLabel: "Colégio de Bardo",
  subclasses: [
    {
      id: "colegio-do-conhecimento",
      name: "Colégio do Conhecimento",
      level: 3,
      description:
        "Bardos do Colégio do Conhecimento conhecem algo sobre a maioria das coisas, coletando pedaços de conhecimento de fontes tão diversas quanto tomos eruditos ou contos de camponeses. Sua fidelidade reside na busca pela beleza e verdade, não na lealdade a um monarca ou em seguir os dogmas de uma divindade.",
      features: [
        {
          level: 3,
          name: "Proficiência Adicional",
          description: "Quando você se junta ao Colégio do Conhecimento no 3° nível, você ganha proficiência em três perícias, à sua escolha.",
        },
        {
          level: 3,
          name: "Palavras de Interrupção",
          description:
            "Também no 3° nível, você aprende como usar sua perspicácia para distrair, confundir e, de outras formas, atrapalhar a confiança e competência de outros. Quando uma criatura que você pode ver a até 18 metros de você realizar uma jogada de ataque, um teste de habilidade ou uma jogada de dano, você pode usar sua reação para gastar um uso de Inspiração de Bardo, rolando o dado de Inspiração de Bardo e subtraindo o número rolado da rolagem da criatura. Você escolhe usar essa característica depois da criatura fazer a rolagem, mas antes do Mestre determinar se a jogada de ataque ou teste de habilidade foi bem ou mal sucedido, ou antes da criatura causar dano. A criatura será imune se não puder ouvir ou se não puder ser enfeitiçada.",
        },
        {
          level: 6,
          name: "Segredos Mágicos Adicionais",
          description:
            "No 6° nível, você aprende duas magias, à sua escolha, de qualquer classe. As magias que você escolher devem ser de um nível que você possa conjurar, como mostrado na tabela O Bardo, ou um truque. As magias escolhidas contam como magias de bardo para você, mas não contam no número de magias de bardo que você conhece.",
        },
        {
          level: 14,
          name: "Perícia Inigualável",
          description:
            "A partir do 14° nível, quando você fizer um teste de habilidade, você pode gastar um uso de Inspiração de Bardo. Role o dado de Inspiração de Bardo e adicione o número rolado ao seu teste de habilidade. Você pode escolher fazer isso depois de rolar o dado do teste de habilidade, mas antes do Mestre dizer se foi bem ou mal sucedido.",
        },
      ],
    },
    {
      id: "colegio-da-bravura",
      name: "Colégio da Bravura",
      level: 3,
      description:
        "Os bardos do Colégio da Bravura são escaldos destemidos de quem os contos mantêm viva a memória dos grandes heróis do passado, dessa forma inspirando uma nova geração de heróis. Eles viajam para testemunhar grandes eventos em primeira mão e inspiram outros a alcançar o mesmo patamar de realizações dos antigos heróis.",
      features: [
        {
          level: 3,
          name: "Proficiência Adicional",
          description: "Quando você se junta ao Colégio da Bravura no 3° nível, você adquire proficiência com armaduras médias, escudos e armas marciais.",
        },
        {
          level: 3,
          name: "Inspiração em Combate",
          description:
            "Também no 3° nível, você aprende a inspirar os outros em batalha. Uma criatura que possuir um dado de Inspiração de Bardo seu, pode rolar esse dado e adicionar o número rolado a uma jogada de dano que ele tenha acabado de fazer. Alternativamente, quando uma jogada de ataque for realizada contra essa criatura, ela pode usar sua reação para rolar o dado de Inspiração de Bardo e adicionar o número rolado a sua CA contra esse ataque, depois da rolagem ser feita, mas antes de saber se errou ou acertou.",
        },
        {
          level: 6,
          name: "Ataque Extra",
          description: "A partir do 6° nível, você pode atacar duas vezes, ao invés de uma, sempre que você realizar a ação de Ataque no seu turno.",
        },
        {
          level: 14,
          name: "Magia de Batalha",
          description:
            "No 14° nível, você dominou a arte de tecer a conjuração e usar armas em um ato harmonioso. Quando você usar sua ação para conjurar uma magia de bardo, você pode realizar um ataque com arma com uma ação bônus.",
        },
      ],
    },
  ],
  spellcasting: {
    ability: "cha",
    kind: "full",
    cantripsKnown: cantrips(2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
    spellsKnown: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
    preparesSpells: false,
    ritualCasting: true,
    focus: "Instrumento musical",
  },
  progressionColumns: [
    {
      label: "Inspiração de Bardo",
      values: ["d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12", "d12", "d12"],
    },
    {
      label: "Canção de Descanso",
      values: [dash, "d6", "d6", "d6", "d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"],
    },
  ],
};

// ---------------------------------------------------------------------------
// BRUXO
// ---------------------------------------------------------------------------
const BRUXO: ClassDef = {
  id: "bruxo",
  name: "Bruxo",
  summary:
    "Um conjurador que obtém poder através de um pacto com uma entidade transcendental, desbloqueando efeitos mágicos sutis e espetaculares.",
  hitDie: 8,
  primaryAbilities: ["cha"],
  savingThrows: ["wis", "cha"],
  armorProficiencies: ["Armaduras leves"],
  weaponProficiencies: ["Armas simples"],
  toolProficiencies: [],
  skillChoices: {
    count: 2,
    from: ["arcanismo", "enganacao", "historia", "intimidacao", "investigacao", "natureza", "religiao"],
  },
  startingEquipment: [
    "(a) uma besta leve e 20 virotes ou (b) qualquer arma simples",
    "(a) uma bolsa de componentes ou (b) um foco arcano",
    "(a) um pacote de estudioso ou (b) um pacote de explorador",
    "Armadura de couro, qualquer arma simples e duas adagas",
  ],
  features: [
    {
      level: 1,
      name: "Patrono Transcendental",
      description:
        "No 1° nível, você conclui uma barganha com um ser transcendental, à sua escolha: a Arquifada, o Corruptor ou o Grande Antigo (e, nos Reinos Esquecidos, o Imortal). Sua escolha lhe confere traços no 1° nível e novamente no 6°, 10° e 14° nível.",
    },
    {
      level: 1,
      name: "Magia de Pacto",
      description:
        "Sua pesquisa arcana e a magia outorgada a você por seu patrono lhe concedem uma gama de magias. Truques: você conhece dois truques, à sua escolha, da lista de magias de bruxo, e aprende truques adicionais em níveis mais altos (coluna Truques Conhecidos). Espaços de Magia: a tabela O Bruxo mostra quantos espaços de magia você possui e o nível deles; todos os seus espaços de magia são do mesmo nível. Você recobra todos os espaços gastos quando completa um descanso curto ou longo (por exemplo, no 5° nível você tem dois espaços de 3° nível; para conjurar a magia de 1° nível onda trovejante você gasta um deles e a conjura como uma magia de 3° nível). Magias Conhecidas: no 1° nível você conhece duas magias de 1° nível da lista de magias de bruxo; a coluna Magias Conhecidas mostra quando você aprende mais, de um nível ao qual você tenha acesso. Quando você adquire um nível na classe, pode substituir uma magia de bruxo que conheça por outra da lista. Habilidade de Conjuração: Carisma. CD das magias = 8 + bônus de proficiência + modificador de Carisma; modificador de ataque de magia = bônus de proficiência + modificador de Carisma. Foco de Conjuração: você pode usar um foco arcano como foco de conjuração das suas magias de bruxo.",
    },
    {
      level: 2,
      name: "Invocações Místicas",
      description:
        "Durante seus estudos sobre conhecimento oculto, você descobriu as invocações místicas, fragmentos de conhecimento proibido que infundiram você com habilidade mágica permanente. No 2° nível, você ganha duas invocações místicas, à sua escolha. Quando você atinge certos níveis de bruxo, você adquire novas invocações, como mostrado na coluna Invocações Conhecidas. Quando você adquire um novo nível na classe, pode substituir uma invocação que conheça por outra que possa aprender nesse nível. O pré-requisito de nível se refere ao nível de bruxo. Opções: Armadura de Sombras (conjurar armadura arcana em si mesmo, à vontade, sem espaço de magia ou componentes materiais); Correntes de Cárceri (15° nível, Pacto da Corrente: conjurar imobilizar monstro, à vontade, sem gastar espaço, tendo como alvo um celestial, corruptor ou elemental; descanso longo antes de usar na mesma criatura); Encharcar a Mente (5° nível: conjurar lentidão uma vez usando um espaço de magia de bruxo; descanso longo); Escultor de Carne (7° nível: conjurar metamorfose uma vez; descanso longo); Explosão Agonizante (truque rajada mística: adicione seu modificador de Carisma ao dano); Explosão Repulsiva (truque rajada mística: empurra a criatura até 3 metros); Idioma Bestial (falar com animais à vontade); Influência Enganadora (proficiência em Enganação e Persuasão); Lacaios do Caos (9° nível: conjurar conjurar elemental uma vez; descanso longo); Lâmina Sedenta (5° nível, Pacto da Lâmina: ataque duas vezes com a arma do pacto ao usar a ação de Ataque); Lança Mística (truque rajada mística: alcance de 90 metros); Larápio dos Cinco Destinos (conjurar perdição uma vez; descanso longo); Livro de Segredos Antigos (Pacto do Tomo: registrar rituais de 1° nível no Livro das Sombras; podem ser adicionados outros rituais de nível igual ou inferior à metade do seu nível de bruxo, a 2 horas e 50 po por nível da magia); Máscara das Muitas Faces (disfarçar-se à vontade); Mestre das Infindáveis Formas (15° nível: alterar-se à vontade); Olhar de Duas Mentes (perceber através dos sentidos de um humanoide voluntário tocado); Olhos do Guardião das Runas (ler todas as escritas); Palavra Terrível (7° nível: conjurar confusão uma vez; descanso longo); Passo Ascendente (9° nível: levitação em si mesmo, à vontade); Salto Transcendental (9° nível: salto em si mesmo, à vontade); Sinal de Mau Agouro (5° nível: rogar maldição uma vez; descanso longo); Sorvedor de Vida (12° nível, Pacto da Lâmina: dano necrótico adicional igual ao modificador de Carisma, mínimo 1, ao atingir com a arma do pacto); Sussurros da Sepultura (9° nível: falar com os mortos à vontade); Sussurros Sedutores (7° nível: conjurar compulsão uma vez; descanso longo); Uno com as Sombras (5° nível: em penumbra ou escuridão, use sua ação para ficar invisível até se mover ou realizar uma ação ou reação); Vigor Abissal (vida falsa em si mesmo, à vontade, como magia de 1° nível); Visão da Bruxa (15° nível: ver a verdadeira forma de metamorfos e criaturas ocultas por ilusão ou transmutação a até 9 metros); Visão Diabólica (enxergar normalmente na escuridão, mágica ou normal, até 36 metros); Visão Mística (detectar magia à vontade); Visões de Reinos Distantes (15° nível: olho arcano à vontade); Visões nas Brumas (imagem silenciosa à vontade, sem espaço ou componentes materiais); Voz do Mestre das Correntes (Pacto da Corrente: comunicar-se telepaticamente com seu familiar, perceber através dos sentidos dele e falar através dele).",
    },
    {
      level: 3,
      name: "Dádiva do Pacto",
      description:
        "No 3° nível, seu patrono transcendental lhe confere um dom por seus leais serviços. Você adquire uma das características a seguir, à sua escolha. Pacto da Corrente: você aprende a magia convocar familiar e pode conjurá-la como um ritual (ela não conta no número de magias que você conhece). Você pode escolher uma das formas convencionais ou uma forma especial: diabrete, pseudodragão, quasit ou sprite. Além disso, quando você realiza a ação de Ataque, pode renunciar a um dos seus ataques para permitir que seu familiar realize um ataque, com a reação dele. Pacto da Lâmina: você pode usar sua ação para criar uma arma de pacto em sua mão vazia; você escolhe a forma dessa arma corpo a corpo a cada vez que a cria, é proficiente com ela enquanto a empunhar e ela conta como mágica para ultrapassar resistência e imunidade a ataques e danos não-mágicos. A arma desaparece se estiver a mais de 1,5 metro de você por 1 minuto, se você usar a característica novamente, se você a dissipar (não requer ação) ou se você morrer. Você pode transformar uma arma mágica em sua arma de pacto com um ritual de 1 hora (que pode ser feito durante um descanso curto); pode dissipá-la num espaço extradimensional e ela reaparece sempre que você criar sua arma de pacto. Pacto do Tomo: seu patrono lhe deu um grimório chamado Livro das Sombras. Escolha três truques da lista de magias de qualquer classe; enquanto o livro estiver com você, você pode conjurá-los à vontade e eles não contam no número de truques que você conhece (são magias de bruxo para você). Se perder o livro, você pode realizar uma cerimônia de 1 hora para receber um substituto do patrono (durante um descanso curto ou longo); o livro se torna cinzas quando você morre.",
    },
    asi(4),
    {
      level: 6,
      name: "Característica de Patrono Transcendental",
      description: "Você recebe uma característica do seu Patrono Transcendental.",
    },
    asi(8),
    {
      level: 10,
      name: "Característica de Patrono Transcendental",
      description: "Você recebe uma característica do seu Patrono Transcendental.",
    },
    {
      level: 11,
      name: "Arcana Mística (6° nível)",
      description:
        "No 11° nível, seu patrono confere a você um segredo mágico conhecido como arcana. Escolha uma magia de 6° nível da lista de magias de bruxo como sua arcana. Você pode conjurar essa magia arcana uma vez sem gastar um espaço de magia. Você deve terminar um descanso longo antes de poder fazer isso novamente. Em níveis mais altos, você adquire mais magias de bruxo de sua escolha que podem ser conjuradas dessa forma: uma magia de 7° nível no 13° nível, uma de 8° nível no 15° nível e uma de 9° nível no 17° nível. Você recupera todos os usos de sua Arcana Mística quando termina um descanso longo.",
    },
    asi(12),
    {
      level: 13,
      name: "Arcana Mística (7° nível)",
      description: "Você escolhe uma magia de 7° nível da lista de magias de bruxo como arcana (veja Arcana Mística, 11° nível).",
    },
    {
      level: 14,
      name: "Característica de Patrono Transcendental",
      description: "Você recebe uma característica do seu Patrono Transcendental.",
    },
    {
      level: 15,
      name: "Arcana Mística (8° nível)",
      description: "Você escolhe uma magia de 8° nível da lista de magias de bruxo como arcana (veja Arcana Mística, 11° nível).",
    },
    asi(16),
    {
      level: 17,
      name: "Arcana Mística (9° nível)",
      description: "Você escolhe uma magia de 9° nível da lista de magias de bruxo como arcana (veja Arcana Mística, 11° nível).",
    },
    asi(19),
    {
      level: 20,
      name: "Mestre Místico",
      description:
        "No 20° nível, você pode recarregar sua reserva interior de poder místico quando suplicar ao seu patrono para recuperar espaços de magia gastos. Você pode gastar 1 minuto suplicando pela ajuda do seu patrono para recuperar todos os espaços de magia gastos da sua característica Magia de Pacto. Uma vez que você recuperou espaços de magia com essa característica, você deve terminar um descanso longo antes de fazê-lo novamente.",
    },
  ],
  subclassLabel: "Patrono Transcendental",
  subclasses: [
    {
      id: "arquifada",
      name: "A Arquifada",
      level: 1,
      description:
        "Seu patrono é um senhor ou senhora das fadas, uma criatura lendária que detém segredos que foram esquecidos antes das raças mortais nascerem. As motivações desses seres são, muitas vezes, inescrutáveis e, às vezes, excêntricas.",
      features: [
        {
          level: 1,
          name: "Lista de Magia Expandida",
          description:
            "A Arquifada permite que você escolha magias de uma lista expandida quando for aprender magias de bruxo. 1° nível: fogo das fadas, sono. 2° nível: acalmar emoções, força fantasmagórica. 3° nível: piscar, ampliar plantas. 4° nível: dominar besta, invisibilidade maior. 5° nível: dominar pessoa, similaridade.",
        },
        {
          level: 1,
          name: "Presença Feérica",
          description:
            "A partir do 1° nível, seu patrono concede a você a habilidade de projetar a sedução e temeridade da presença da fada. Com uma ação, você pode fazer com que cada criatura num cubo de 3 metros centrado em você faça um teste de resistência de Sabedoria com uma CD igual a de sua magia de bruxo. As criaturas que falharem no teste ficarão enfeitiçadas ou amedrontadas por você (à sua escolha) até o início do seu próximo turno. Depois de usar, você não poderá utilizá-la novamente antes de realizar um descanso curto ou longo.",
        },
        {
          level: 6,
          name: "Névoa de Fuga",
          description:
            "A partir do 6° nível, você pode desaparecer em uma lufada de névoa em resposta a alguma ofensa. Quando você sofrer dano, você pode usar sua reação para ficar invisível e se teletransportar a até 18 metros para um espaço desocupado que você possa ver. Você permanece invisível até o início do seu próximo turno ou até realizar um ataque ou conjurar uma magia. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.",
        },
        {
          level: 10,
          name: "Defesa Sedutora",
          description:
            "A partir do 10° nível, seu patrono ensina você como voltar as magias de efeito mental dos seus inimigos contra eles. Você não pode ser enfeitiçado e, quando outra criatura tenta enfeitiçá-lo, você pode usar sua reação para tentar reverter o encanto de volta àquela criatura. A criatura deve ser bem sucedida num teste de resistência de Sabedoria contra a CD da sua magia de bruxo ou ficará enfeitiçada por 1 minuto ou até a criatura sofrer dano.",
        },
        {
          level: 14,
          name: "Delírio Sombrio",
          description:
            "Começando no 14° nível, você pode imergir uma criatura num reino ilusório. Com uma ação, escolha uma criatura que você possa ver a até 18 metros de você. Ela deve ser bem sucedida num teste de resistência de Sabedoria contra a CD da sua magia de bruxo. Se ela falhar, ficará enfeitiçada ou amedrontada por você (à sua escolha) por 1 minuto ou até você quebrar sua concentração (como se estivesse se concentrando em uma magia). Esse efeito termina prematuramente se a criatura sofrer dano. Até que essa ilusão termine, a criatura acredita que está perdida num reino enevoado, cuja aparência fica a seu critério. A criatura só pode ver e ouvir a si mesma, a você e a sua ilusão. Você deve terminar um descanso curto ou longo antes de poder usar essa característica novamente.",
        },
      ],
    },
    {
      id: "corruptor",
      name: "O Corruptor",
      level: 1,
      description:
        "Você realizou um pacto com um corruptor dos planos de existência inferiores, um ser cujos objetivos são o mal, mesmo se você se opor a esses objetivos. Tais seres desejam corromper ou destruir todas as coisas, em última análise, até mesmo você.",
      features: [
        {
          level: 1,
          name: "Lista de Magia Expandida",
          description:
            "O Corruptor permite que você escolha magias de uma lista expandida quando for aprender magias de bruxo. 1° nível: mãos flamejantes, comando. 2° nível: cegueira/surdez, raio ardente. 3° nível: bola de fogo, névoa fétida. 4° nível: escudo de fogo, muralha de fogo. 5° nível: coluna de chamas, consagrar.",
        },
        {
          level: 1,
          name: "Bênção do Obscuro",
          description:
            "A partir do 1° nível, quando você reduzir uma criatura hostil a 0 pontos de vida, você ganha uma quantidade de pontos de vida temporários igual ao seu modificador de Carisma + seu nível de bruxo (mínimo 1).",
        },
        {
          level: 6,
          name: "Sorte do Próprio Obscuro",
          description:
            "A partir do 6° nível, você pode pedir ao seu patrono para alterar o destino em seu favor. Quando você realizar um teste de habilidade ou um teste de resistência, você pode usar essa característica para adicionar 1d10 a sua jogada. Você pode fazer isso após ver sua jogada inicial, mas antes que qualquer efeito da jogada ocorra. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.",
        },
        {
          level: 10,
          name: "Resistência Demoníaca",
          description:
            "A partir do 10° nível, você pode escolher um tipo de dano quando você terminar um descanso curto ou longo. Você adquire resistência contra esse tipo de dano até você escolher um tipo de dano diferente com essa característica. Dano causado por armas mágicas ou armas de prata ignoram essa resistência.",
        },
        {
          level: 14,
          name: "Lançar no Inferno",
          description:
            "A partir do 14° nível, quando você atingir uma criatura com um ataque, você pode usar essa característica para, instantaneamente, transportar o alvo para os planos inferiores. A criatura desaparece e é jogada para um lugar similar a um pesadelo. No final do seu turno, o alvo retorna ao lugar que ocupava anteriormente, ou para o espaço desocupado mais próximo. Se o alvo não for um corruptor, ele sofre 10d10 de dano psíquico à medida que toma conta da experiência traumática. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.",
        },
      ],
    },
    {
      id: "grande-antigo",
      name: "O Grande Antigo",
      level: 1,
      description:
        "Seu patrono é uma entidade misteriosa cuja natureza é profundamente alheia ao tecido da realidade. Ela deve ter vindo do Reino Distante, o espaço além da realidade, ou pode ser um dos deuses anciãos conhecido apenas nas lendas. Seus motivos são incompreensíveis para os mortais.",
      features: [
        {
          level: 1,
          name: "Lista de Magia Expandida",
          description:
            "O Grande Antigo permite que você escolha magias de uma lista expandida quando for aprender magias de bruxo. 1° nível: sussurros dissonantes, riso histérico de Tasha. 2° nível: detectar pensamentos, força fantasmagórica. 3° nível: clarividência, enviar mensagem. 4° nível: dominar besta, tentáculos negros de Evard. 5° nível: dominar pessoa, telecinésia.",
        },
        {
          level: 1,
          name: "Despertar a Mente",
          description:
            "A partir do 1° nível, seu conhecimento alienígena concede a você a habilidade de tocar a mente de outras criaturas. Você pode se comunicar telepaticamente com qualquer criatura que você possa ver a até 18 metros de você. Você não precisa partilhar um idioma com a criatura para compreender suas expressões telepáticas, mas a criatura deve ser capaz de compreender pelo menos um idioma.",
        },
        {
          level: 6,
          name: "Proteção Entrópica",
          description:
            "A partir do 6° nível, você aprende a se proteger magicamente contra ataques e a transformar os ataques mal sucedidos de seus inimigos em boa sorte para você. Quando uma criatura realizar uma jogada de ataque contra você, você pode usar sua reação para impor desvantagem nessa jogada. Se o ataque errar você, sua próxima jogada de ataque contra essa criatura recebe vantagem se você o fizer antes do final do seu próximo turno. Após usar essa característica, você não poderá utilizá-la novamente até terminar um descanso curto ou longo.",
        },
        {
          level: 10,
          name: "Escudo de Pensamentos",
          description:
            "A partir do 10° nível, seus pensamentos não podem ser lidos através de telepatia ou outros meios, a não ser que você permita. Você também adquire resistência a dano psíquico e, toda vez que uma criatura causar dano psíquico a você, essa criatura sofre a mesma quantidade de dano que você sofreu.",
        },
        {
          level: 14,
          name: "Criar Lacaio",
          description:
            "No 14° nível, você adquire a habilidade de infectar a mente de um humanoide com a magia alienígena do seu patrono. Você pode usar sua ação para tocar um humanoide incapacitado. Essa criatura então ficará enfeitiçada por você até que a magia remover maldição seja conjurada sobre ela, a condição enfeitiçado seja removida dela ou você use essa característica novamente. Você pode se comunicar telepaticamente com a criatura enfeitiçada contanto que ambos estejam no mesmo plano de existência.",
        },
      ],
    },
    {
      id: "imortal",
      name: "O Imortal",
      level: 1,
      description:
        "A morte não detém qualquer poder sobre seu patrono, que desvendou os segredos da vida eterna, apesar de tal dádiva - como todo poder - ter um preço. Fonte: Compêndio de Classes (Sword Coast Adventurer's Guide), nos Reinos Esquecidos.",
      features: [
        {
          level: 1,
          name: "Lista de Magia Expandida",
          description:
            "O Imortal permite que você escolha magias de uma lista expandida quando for aprender magias de bruxo. 1° nível: raio adoecente, vida falsa. 2° nível: cegueira/surdez, silêncio. 3° nível: falar com os mortos, forjar morte. 4° nível: aura de vida, proteção contra a morte. 5° nível: conhecimento lendário, praga.",
        },
        {
          level: 1,
          name: "Entre os Mortos",
          description:
            "A partir do 1° nível, você aprende o truque estabilizar, que conta como um truque de bruxo para você. Você também tem vantagem em testes de resistência contra qualquer doença. Além disso, mortos-vivos têm dificuldade em ferir você. Se um morto-vivo focar você diretamente com um ataque ou com uma magia nociva, essa criatura deve realizar um teste de resistência de Sabedoria contra a CD de suas magias (não precisa fazer essa resistência quando incluir você em uma área de efeito). Se falhar, deve escolher um novo alvo ou desistir de focar alguém ao invés de você, potencialmente desperdiçando o ataque ou a magia. Se obtiver sucesso, fica imune a esse efeito por 24 horas. Um morto-vivo também fica imune a esse efeito por 24 horas se você afetá-lo com um ataque ou com uma magia nociva.",
        },
        {
          level: 6,
          name: "Desafiar a Morte",
          description:
            "A partir do 6° nível, você pode conceder a si mesmo vitalidade quando você enganar a morte ou quando ajudar alguém a enganá-la. Você pode recuperar pontos de vida iguais a 1d8 + seu modificador de Constituição (mínimo 1 ponto de vida) quando você for bem sucedido num teste de resistência contra a morte ou quando você estabilizar uma criatura com a magia estabilizar. Quando você tiver usado essa característica, você não poderá usá-la novamente até terminar um descanso longo.",
        },
        {
          level: 10,
          name: "Natureza Imortal",
          description:
            "Começando no 10° nível, você pode prender a respiração indefinidamente e você não precisa comer, beber ou dormir, apesar de ainda precisar descansar para reduzir exaustão e ainda se beneficiar de descansos curtos e longos. Além disso, você envelhece mais devagar. Para cada 10 anos passados, seu corpo envelhece apenas 1 ano e você é imune a ser envelhecido magicamente.",
        },
        {
          level: 14,
          name: "Vida Indestrutível",
          description:
            "Quando você alcançar o 14° nível, você compartilha de uma parte dos verdadeiros segredos do Imortal. No seu turno, você pode usar uma ação bônus para recuperar pontos de vida iguais a 1d8 + seu nível de bruxo. Além disso, se você colocar uma parte decepada do seu corpo de volta no lugar quando usar essa característica, a parte se gruda novamente. Quando você tiver usado essa característica, você não poderá usá-la novamente até terminar um descanso curto ou longo.",
        },
      ],
    },
  ],
  spellcasting: {
    ability: "cha",
    kind: "pact",
    cantripsKnown: cantrips(2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
    spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    preparesSpells: false,
    ritualCasting: false,
    focus: "Foco arcano",
  },
  progressionColumns: [
    { label: "Espaços de Magia", values: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4] },
    { label: "Nível do Espaço", values: ["1°", "1°", "2°", "2°", "3°", "3°", "4°", "4°", "5°", "5°", "5°", "5°", "5°", "5°", "5°", "5°", "5°", "5°", "5°", "5°"] },
    { label: "Invocações Conhecidas", values: [dash, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8] },
  ],
};

// ---------------------------------------------------------------------------
// CLÉRIGO
// ---------------------------------------------------------------------------
const GOLPE_DIVINO: ClassFeature[] = [
  {
    level: 8,
    name: "Golpe Divino",
    description:
      "No 8° nível, você ganha a habilidade de imbuir seus ataques com poder divino. Uma vez em cada um de seus turnos, quando você acertar uma criatura com um ataque com arma, você causa 1d8 de dano radiante adicional ao alvo. Quando alcançar o 14° nível, o dano extra aumenta para 2d8.",
  },
];

const CLERIGO: ClassDef = {
  id: "clerigo",
  name: "Clérigo",
  summary:
    "Um sacerdote que serve de intermediário entre o mundo mortal e o plano dos deuses, canalizando poder divino para curar, proteger e combater.",
  hitDie: 8,
  primaryAbilities: ["wis"],
  savingThrows: ["wis", "cha"],
  armorProficiencies: ["Armaduras leves", "Armaduras médias", "Escudos"],
  weaponProficiencies: ["Todas as armas simples"],
  toolProficiencies: [],
  skillChoices: { count: 2, from: ["historia", "intuicao", "medicina", "persuasao", "religiao"] },
  startingEquipment: [
    "(a) uma maça ou (b) um martelo de guerra (se for proficiente)",
    "(a) brunea, (b) armadura de couro ou (c) cota de malha (se for proficiente)",
    "(a) uma besta leve e 20 virotes ou (b) qualquer arma simples",
    "(a) um pacote de sacerdote ou (b) um pacote de aventureiro",
    "Um escudo e um símbolo sagrado",
  ],
  features: [
    {
      level: 1,
      name: "Conjuração",
      description:
        "Como um canalizador de poder divino, você pode conjurar magias de clérigo. Truques: você conhece três truques, à sua escolha, da lista de magias de clérigo, e aprende truques adicionais em níveis mais altos (coluna Truques Conhecidos). Preparando e Conjurando Magias: a tabela O Clérigo mostra quantos espaços de magia você tem; você recupera todos os espaços gastos quando termina um descanso longo. Você prepara a lista de magias selecionando-as da lista de magias de clérigo, em número igual ao seu modificador de Sabedoria + seu nível de clérigo (mínimo de uma magia), de níveis para os quais você possua espaços de magia. Você pode modificar a lista quando termina um descanso longo; preparar uma nova lista requer no mínimo 1 minuto por nível de magia para cada magia preparada. Habilidade de Conjuração: Sabedoria. CD das magias = 8 + bônus de proficiência + modificador de Sabedoria; modificador de ataque de magia = bônus de proficiência + modificador de Sabedoria. Conjuração de Ritual: você pode conjurar como ritual qualquer magia de clérigo que possua o descritor ritual e esteja preparada. Foco de Conjuração: você pode usar um símbolo sagrado como foco de conjuração das suas magias de clérigo.",
    },
    {
      level: 1,
      name: "Domínio Divino",
      description:
        "Escolha um domínio relacionado à sua divindade: Conhecimento, Enganação, Guerra, Luz, Natureza, Tempestade, Vida (e Arcanismo, nos Reinos Esquecidos). Essa escolha, realizada no 1° nível, concede magias de domínio e outras características. Ela também concede outras formas de utilizar seu Canalizar Divindade quando você o ganha no 2° nível, bem como outros benefícios no 6°, 8° e 17° níveis. Magias de Domínio: cada domínio tem uma lista de magias que você adquire nos níveis especificados. Quando você ganha uma magia de domínio, você sempre a tem preparada, e ela não conta no número de magias que você pode preparar a cada dia. Se a magia não aparece na lista de magias de clérigo, mesmo assim é uma magia de clérigo para você.",
    },
    {
      level: 2,
      name: "Canalizar Divindade (1/descanso)",
      description:
        "No 2° nível, você se torna capaz de canalizar energia diretamente de sua divindade, utilizando-a como combustível para efeitos mágicos. Você começa com dois efeitos: Expulsar Mortos-vivos e um efeito determinado pelo seu domínio. Quando você usar seu Canalizar Divindade, você escolhe qual efeito quer criar. Você precisa terminar um descanso curto ou longo para usar a característica de novo. Alguns efeitos requerem teste de resistência; a CD é igual a das suas magias de clérigo. A partir do 6° nível, você pode Canalizar Divindade duas vezes entre descansos e, a partir do 18° nível, três vezes. Expulsar Mortos-vivos: usando uma ação, você levanta seu símbolo sagrado e murmura uma prece repreendendo os mortos-vivos. Cada morto-vivo que puder ver ou ouvir você em um raio de 9 metros deve fazer um teste de resistência de Sabedoria. Se falhar, a criatura está expulsa por 1 minuto ou até sofrer algum dano. Uma criatura expulsa deve usar seu turno para fugir da melhor forma possível e de forma alguma pode se aproximar a mais de 9 metros de você por vontade própria. Ela também não pode usar reações. Como uma ação, a criatura pode apenas realizar uma Disparada ou tentar escapar de um efeito que a impeça de se mover. Se não há lugar para ir, a criatura pode usar a ação Esquivar.",
    },
    {
      level: 2,
      name: "Característica de Domínio Divino",
      description: "Você recebe uma característica do seu Domínio Divino (normalmente o efeito de Canalizar Divindade do domínio).",
    },
    asi(4),
    {
      level: 5,
      name: "Destruir Mortos-Vivos (ND 1/2)",
      description:
        "A partir do 5° nível, quando um morto-vivo falhar no teste de resistência contra a sua característica Expulsar Mortos-vivos, ele é instantaneamente destruído se o Nível de Desafio dele for menor ou igual ao valor da tabela Destruir Mortos-vivos, de acordo com seu nível de clérigo: 5° nível ND 1/2; 8° nível ND 1; 11° nível ND 2; 14° nível ND 3; 17° nível ND 4.",
    },
    {
      level: 6,
      name: "Canalizar Divindade (2/descanso)",
      description: "Você pode usar o Canalizar Divindade duas vezes entre descansos curtos ou longos.",
    },
    {
      level: 6,
      name: "Característica de Domínio Divino",
      description: "Você recebe uma característica do seu Domínio Divino.",
    },
    asi(8),
    {
      level: 8,
      name: "Destruir Mortos-Vivos (ND 1)",
      description: "Mortos-vivos de ND 1 ou menor são destruídos ao falhar na resistência contra Expulsar Mortos-vivos.",
    },
    {
      level: 8,
      name: "Característica de Domínio Divino",
      description: "Você recebe uma característica do seu Domínio Divino (Golpe Divino ou Conjuração Poderosa, conforme o domínio).",
    },
    {
      level: 10,
      name: "Intervenção Divina",
      description:
        "A partir do 10° nível, você pode rogar à sua divindade para que auxilie você em uma árdua tarefa. Implorar pelo auxílio requer uma ação. Você precisa descrever o que busca e realizar uma rolagem de dado de percentagem. Se o resultado for menor ou igual ao seu nível de clérigo, sua divindade intervém. O Mestre escolhe a natureza da intervenção; o efeito de qualquer magia de clérigo ou magia de domínio é apropriado como resultado. Se sua divindade intervir, você fica impedido de usar essa característica de novo por 7 dias. Do contrário, você pode usá-la de novo após terminar um descanso longo.",
    },
    {
      level: 11,
      name: "Destruir Mortos-Vivos (ND 2)",
      description: "Mortos-vivos de ND 2 ou menor são destruídos ao falhar na resistência contra Expulsar Mortos-vivos.",
    },
    asi(12),
    {
      level: 14,
      name: "Destruir Mortos-Vivos (ND 3)",
      description: "Mortos-vivos de ND 3 ou menor são destruídos ao falhar na resistência contra Expulsar Mortos-vivos.",
    },
    asi(16),
    {
      level: 17,
      name: "Destruir Mortos-Vivos (ND 4)",
      description: "Mortos-vivos de ND 4 ou menor são destruídos ao falhar na resistência contra Expulsar Mortos-vivos.",
    },
    {
      level: 17,
      name: "Característica de Domínio Divino",
      description: "Você recebe uma característica do seu Domínio Divino.",
    },
    {
      level: 18,
      name: "Canalizar Divindade (3/descanso)",
      description: "Você pode usar o Canalizar Divindade três vezes entre descansos curtos ou longos.",
    },
    asi(19),
    {
      level: 20,
      name: "Aprimoramento de Intervenção Divina",
      description: "No 20° nível, seus pedidos de Intervenção Divina funcionam automaticamente, sem necessidade de rolagem de dados.",
    },
  ],
  subclassLabel: "Domínio Divino",
  subclasses: [
    {
      id: "conhecimento",
      name: "Domínio do Conhecimento",
      level: 1,
      description:
        "Os deuses do conhecimento - como Oghma, Boccob, Gilean, Aureon e Thoth - valorizam o estudo e compreensão acima de tudo. Seus seguidores estudam conhecimento exotérico, coletam tomos antigos e aprendem tudo que podem.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio do Conhecimento",
          description:
            "1° nível de clérigo: comando, identificação. 3°: augúrio, sugestão. 5°: dificultar detecção, falar com os mortos. 7°: olho arcano, confusão. 9°: conhecimento lendário, vidência.",
        },
        {
          level: 1,
          name: "Bênçãos do Conhecimento",
          description:
            "No 1° nível, você aprende dois idiomas, à sua escolha. Você também se torna proficiente em duas perícias, à sua escolha, dentre as seguintes: Arcanismo, História, Natureza ou Religião. Seu bônus de proficiência é dobrado em qualquer teste de habilidade que você fizer usando qualquer dessas perícias.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Conhecimento das Eras",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para beber da fonte divina do conhecimento. Com uma ação, você escolhe uma perícia ou ferramenta. Por 10 minutos, você terá proficiência com a perícia ou ferramenta escolhida.",
        },
        {
          level: 6,
          name: "Canalizar Divindade: Ler Pensamentos",
          description:
            "No 6° nível, você pode usar seu Canalizar Divindade para ler a mente de uma criatura. Com uma ação, escolha uma criatura que você possa ver a até 18 metros de você. Essa criatura deve realizar um teste de resistência de Sabedoria; se for bem sucedida, você não poderá usar essa característica contra ela novamente até terminar um descanso longo. Se falhar, você pode ler seus pensamentos superficiais quando estiver a até 18 metros dela. Esse efeito dura por 1 minuto. Durante esse tempo, você pode usar sua ação para terminar esse efeito e conjurar a magia sugestão na criatura sem gastar um espaço de magia. O alvo falha automaticamente no teste de resistência contra essa magia.",
        },
        {
          level: 8,
          name: "Conjuração Poderosa",
          description: "A partir do 8° nível, você adiciona seu modificador de Sabedoria no dano causado por qualquer truque de clérigo.",
        },
        {
          level: 17,
          name: "Visões do Passado",
          description:
            "A partir do 17° nível, você pode convocar visões do passado relacionadas a um objeto que você esteja segurando ou sobre o ambiente ao seu redor. Você gasta pelo menos 1 minuto meditando e rezando, então recebe oníricos vislumbres turvos dos eventos recentes. Você pode meditar dessa maneira por um número de minutos igual ao seu valor de Sabedoria e deve manter a concentração durante esse tempo, como se estivesse conjurando uma magia. Quando você usa essa característica, não pode usá-la novamente até terminar um descanso curto ou longo. Leitura de Objeto: ao segurar um objeto enquanto medita, você pode ter visões do dono anterior; depois de meditar por 1 minuto, descobre como o antigo dono adquiriu e perdeu o objeto, assim como o evento recente mais significativo envolvendo o objeto e seu dono. Se o objeto foi portado por outra criatura num passado recente (dentro de um número de dias igual ao seu valor de Sabedoria), você pode gastar 1 minuto adicional, por cada dono, para descobrir as mesmas informações. Leitura Local: à medida que você medita, tem visões dos eventos recentes nas vizinhanças próximas (uma sala, rua, túnel, clareira ou similar, de até 15 metros cúbicos), voltando um número de dias igual ao seu valor de Sabedoria. Para cada minuto que meditar, você descobre sobre um evento significativo, a partir dos mais recentes.",
        },
      ],
    },
    {
      id: "enganacao",
      name: "Domínio da Enganação",
      level: 1,
      description:
        "Deuses da enganação - como Tymora, Beshaba, Olidammara, Garl Glittergold e Loki - são causadores de travessuras e instigadores, patronos dos ladrões, trapaceiros, apostadores, rebeldes e libertadores. Seus clérigos preferem subterfúgio, trapaças, enganação e roubo ao confronto direto.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio da Enganação",
          description:
            "1° nível de clérigo: enfeitiçar pessoa, disfarçar-se. 3°: reflexos, passos sem pegadas. 5°: piscar, dissipar magia. 7°: porta dimensional, metamorfose. 9°: dominar pessoa, modificar memória.",
        },
        {
          level: 1,
          name: "Bênção do Trapaceiro",
          description:
            "A partir do 1° nível, você pode usar sua ação para tocar uma criatura voluntária além de você mesmo para conceder vantagem em testes de Destreza (Furtividade). Essa bênção dura por 1 hora ou até você usar essa característica novamente.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Invocar Duplicidade",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para criar uma duplicata ilusória de si mesmo. Com uma ação, você cria uma ilusão perfeita de si mesmo que dura por 1 minuto ou até você perder sua concentração. A ilusão aparece em um espaço desocupado que você possa ver a até 9 metros de você. Com uma ação bônus, no seu turno, você pode mover a ilusão até 9 metros para um espaço que você possa ver, mas ela deve permanecer a até 36 metros de você. Pela duração, você pode conjurar magias como se estivesse no espaço ocupado pela ilusão, mas deve usar seus próprios sentidos. Além disso, quando você e sua ilusão estiverem a 1,5 metro de uma criatura que possa ver a ilusão, você tem vantagem nas jogadas de ataque contra essa criatura.",
        },
        {
          level: 6,
          name: "Canalizar Divindade: Manto de Sombras",
          description:
            "No 6° nível, você pode usar seu Canalizar Divindade para desaparecer. Com uma ação, você se torna invisível até o final do seu próximo turno. Você se torna visível se atacar ou conjurar uma magia.",
        },
        ...GOLPE_DIVINO,
        {
          level: 17,
          name: "Duplicidade Aprimorada",
          description:
            "A partir do 17° nível, você pode criar até quatro duplicatas de você, ao invés de uma, quando usar Invocar Duplicidade. Com uma ação bônus, no seu turno, você pode mover quantas duplicatas quiser até 9 metros, até no máximo 36 metros de distância.",
        },
      ],
    },
    {
      id: "guerra",
      name: "Domínio da Guerra",
      level: 1,
      description:
        "A guerra tem muitas manifestações. Os deuses da guerra zelam pelos guerreiros e os recompensam pelos seus grandes feitos. Os clérigos de tais deuses se sobressaem em batalha, inspirando os outros a lutar o bom combate ou oferecendo atos de violência como suas orações.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio da Guerra",
          description:
            "1° nível de clérigo: auxílio divino, escudo da fé. 3°: arma mágica, arma espiritual. 5°: manto do cruzado, espíritos guardiões. 7°: movimentação livre, pele de pedra. 9°: coluna de chamas, imobilizar monstro.",
        },
        {
          level: 1,
          name: "Proficiência Adicional",
          description: "No 1° nível, você adquire proficiência em armas marciais e em armaduras pesadas.",
        },
        {
          level: 1,
          name: "Sacerdote da Guerra",
          description:
            "A partir do 1° nível, seu deus envia rajadas de inspiração a você quando você está engajado em combate. Quando você usa a ação de Ataque, você pode realizar um ataque com arma com uma ação bônus. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria (mínimo uma vez). Você recupera todos os usos gastos após terminar um descanso longo.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Ataque Dirigido",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para golpear com precisão sobrenatural. Quando você realiza uma jogada de ataque, você pode usar seu Canalizar Divindade para receber +10 de bônus na jogada. Você realiza essa escolha depois de ver a rolagem, mas antes do Mestre dizer se o ataque atingiu ou errou.",
        },
        {
          level: 6,
          name: "Canalizar Divindade: Bênção do Deus da Guerra",
          description:
            "No 6° nível, quando uma criatura a até 9 metros de você realizar uma jogada de ataque, você pode usar sua reação para conceder à criatura +10 de bônus nessa jogada, usando seu Canalizar Divindade. Você realiza essa escolha depois de ver a rolagem, mas antes do Mestre dizer se o ataque atingiu ou errou.",
        },
        ...GOLPE_DIVINO,
        {
          level: 17,
          name: "Avatar da Batalha",
          description: "A partir do 17° nível, você ganha resistência a dano de concussão, cortante e perfurante de armas não-mágicas.",
        },
      ],
    },
    {
      id: "luz",
      name: "Domínio da Luz",
      level: 1,
      description:
        "Deuses da luz - como Helm, Lathander, Pholtus, Branchala, a Chama Prateada, Belenus, Apolo e Re-Horakhty - promovem os ideais do renascimento e renovação, verdade, vigilância e beleza, muitas vezes usando o símbolo do sol. Clérigos de um deus da luz são almas esclarecidas infundidas com radiação e o poder divino da visão e do discernimento.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio da Luz",
          description:
            "1° nível de clérigo: mãos flamejantes, fogo das fadas. 3°: esfera flamejante, raio ardente. 5°: luz do dia, bola de fogo. 7°: guardião da fé, muralha de fogo. 9°: coluna de chamas, vidência.",
        },
        {
          level: 1,
          name: "Truque Adicional",
          description: "Quando você escolhe esse domínio no 1° nível, você ganha o truque luz se você ainda não o conhecia.",
        },
        {
          level: 1,
          name: "Labareda Protetora",
          description:
            "Também a partir do 1° nível, você pode interpor luz divina entre você e uma criatura atacante. Quando você for atacado por uma criatura a até 9 metros de você que você possa ver, você pode usar sua reação para impor desvantagem na jogada de ataque, causando labaredas de luz na frente do atacante antes dele atingir ou errar. Um atacante que não puder ser cegado é imune a essa característica. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria (mínimo uma vez). Você recupera todos os usos gastos após terminar um descanso longo.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Radiação do Amanhecer",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para criar uma explosão de luz solar, banindo a escuridão e causando dano radiante aos inimigos. Com uma ação, você ergue seu símbolo sagrado e qualquer escuridão mágica num raio de 9 metros de você é dissipada. Além disso, cada criatura hostil a até 9 metros deve realizar um teste de resistência de Constituição. Uma criatura sofre dano radiante igual a 2d10 + seu nível de clérigo se falhar no teste e metade desse dano caso seja bem sucedida. Uma criatura que tenha cobertura total contra você não é afetada.",
        },
        {
          level: 6,
          name: "Labareda Aprimorada",
          description:
            "No 6° nível, você também pode utilizar sua característica Labareda Protetora quando uma criatura que você possa ver a até 9 metros atacar outra criatura diferente de você.",
        },
        {
          level: 8,
          name: "Conjuração Poderosa",
          description: "A partir do 8° nível, você adiciona seu modificador de Sabedoria no dano causado por qualquer truque de clérigo.",
        },
        {
          level: 17,
          name: "Coroa de Luz",
          description:
            "A partir do 17° nível, você pode usar sua ação para ativar uma aura de luz solar que dura por 1 minuto ou até você dissipá-la usando outra ação. Você emite luz plena num raio de 18 metros e penumbra a até 9 metros além disso. Os seus inimigos na área de luz plena têm desvantagem nos testes de resistência contra suas magias que causam dano de fogo ou dano radiante.",
        },
      ],
    },
    {
      id: "natureza",
      name: "Domínio da Natureza",
      level: 1,
      description:
        "Os deuses da natureza são tão variados como a própria natureza do mundo, desde deuses inescrutáveis de profundas florestas (como Silvanus, Obad-Hai, Chislev, Balinor e Pã) até divindades amigáveis associadas a alguma fonte ou bosque em particular (como Eldath).",
      features: [
        {
          level: 1,
          name: "Magias do Domínio da Natureza",
          description:
            "1° nível de clérigo: amizade animal, falar com animais. 3°: pele de árvore, crescer espinhos. 5°: ampliar plantas, muralha de vento. 7°: dominar besta, vinha esmagadora. 9°: praga de insetos, caminhar em árvores.",
        },
        {
          level: 1,
          name: "Acólito da Natureza",
          description:
            "No 1° nível, você aprende um truque de druida, à sua escolha. Você também ganha proficiência em uma das seguintes perícias, à sua escolha: Adestrar Animais, Natureza ou Sobrevivência.",
        },
        {
          level: 1,
          name: "Proficiência Adicional",
          description: "Também a partir do 1° nível, você adquire proficiência com armaduras pesadas.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Enfeitiçar Animais e Plantas",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para enfeitiçar animais e plantas. Com uma ação, você ergue seu símbolo sagrado e invoca o nome do seu deus. Cada besta ou criatura-planta que puder ver você num raio de 9 metros deve realizar um teste de resistência de Sabedoria. Se a criatura falhar, ela estará enfeitiçada por você durante 1 minuto ou até sofrer dano. Enquanto estiver enfeitiçada por você, ela será amistosa a você e às criaturas que você designar.",
        },
        {
          level: 6,
          name: "Amortecer Elementos",
          description:
            "No 6° nível, quando você ou uma criatura a até 9 metros de você sofrer dano de ácido, frio, fogo, elétrico ou trovão, você pode usar sua reação para conceder resistência à criatura contra aquele tipo de dano.",
        },
        ...GOLPE_DIVINO,
        {
          level: 17,
          name: "Senhor da Natureza",
          description:
            "A partir do 17° nível, você ganha a habilidade de comandar animais e criaturas-planta. Enquanto a criatura estiver enfeitiçada pela sua característica Enfeitiçar Animais e Plantas, você pode usar uma ação bônus no seu turno para dizer verbalmente o que cada uma dessas criaturas deve fazer no próximo turno delas.",
        },
      ],
    },
    {
      id: "tempestade",
      name: "Domínio da Tempestade",
      level: 1,
      description:
        "Deuses cujo portfólio contenha o domínio da Tempestade - como Talos, Umberlee, Kord, Zeboim, o Devorador, Zeus e Thor - governam tormentas, mares e céus. Seus clérigos inspiram pavor no povo comum, tanto para mantê-los no caminho da justiça e coragem quanto para oferecer sacrifícios de propiciação para afastar a ira divina.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio da Tempestade",
          description:
            "1° nível de clérigo: névoa obscurecente, onda trovejante. 3°: lufada de vento, despedaçar. 5°: convocar relâmpagos, nevasca. 7°: controlar a água, tempestade de gelo. 9°: onda destrutiva, praga de insetos.",
        },
        {
          level: 1,
          name: "Proficiência Adicional",
          description: "A partir do 1° nível, você adquire proficiência em armas marciais e armaduras pesadas.",
        },
        {
          level: 1,
          name: "Ira da Tormenta",
          description:
            "Também a partir do 1° nível, você pode repreender ataques violentamente. Quando uma criatura a 1,5 metro de você que você possa ver atingir você com um ataque, você pode usar sua reação para forçar a criatura a realizar um teste de resistência de Destreza. A criatura sofre 2d8 de dano elétrico ou de trovão (à sua escolha) caso falhe no teste, e metade desse dano caso seja bem sucedida. Você pode usar essa característica um número de vezes igual ao seu modificador de Sabedoria (mínimo uma vez). Você recupera todos os usos gastos após terminar um descanso longo.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Ira Destruidora",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para empunhar o poder da tormenta com ferocidade desmedida. Quando você rolar dano elétrico ou de trovão, você pode usar seu Canalizar Divindade para causar o máximo de dano, ao invés de rolá-lo.",
        },
        {
          level: 6,
          name: "Golpe de Relâmpago",
          description:
            "No 6° nível, quando você causa dano elétrico a uma criatura Grande ou menor, você também pode empurrá-la para até 3 metros de distância de você.",
        },
        ...GOLPE_DIVINO,
        {
          level: 17,
          name: "Filho da Tormenta",
          description:
            "A partir do 17° nível, você adquire deslocamento de voo igual a seu deslocamento de caminhada contanto que você não esteja no subterrâneo ou em local fechado.",
        },
      ],
    },
    {
      id: "vida",
      name: "Domínio da Vida",
      level: 1,
      description:
        "O domínio da vida foca na vívida energia positiva - uma das forças fundamentais do universo - que sustenta toda a vida. Os deuses da vida promovem a vitalidade e a saúde, curando os doentes e feridos, cuidando dos necessitados, além de afastar as forças da morte e hordas de mortos-vivos.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio da Vida",
          description:
            "1° nível de clérigo: bênção, curar ferimentos. 3°: restauração menor, arma espiritual. 5°: sinal de esperança, revivificar. 7°: proteção contra a morte, guardião da fé. 9°: curar ferimentos em massa, reviver os mortos.",
        },
        {
          level: 1,
          name: "Proficiência Adicional",
          description: "Quando você escolhe este domínio no 1° nível, você ganha proficiência com armaduras pesadas.",
        },
        {
          level: 1,
          name: "Discípulo da Vida",
          description:
            "Também no 1° nível, suas magias de cura são mais efetivas. Sempre que você conjurar uma magia de cura para recuperar pontos de vida, o alvo daquela magia recupera pontos de vida adicionais iguais a 2 + nível da magia.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Preservar a Vida",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para curar os feridos. Como uma ação, você usa seu símbolo sagrado para invocar energia que pode recuperar um total de 5 vezes seu nível de clérigo em pontos de vida. Você escolhe quaisquer criaturas a até 9 metros de você e divide esses pontos entre elas. Essa característica só pode curar as criaturas até metade de seu máximo de pontos de vida. Você não pode usar essa característica em um morto-vivo ou constructo.",
        },
        {
          level: 6,
          name: "Curandeiro Abençoado",
          description:
            "A partir do 6° nível, as magias que você conjurar para curar os outros também curam você. Quando conjurar uma magia de cura em outra criatura, você também recupera pontos de vida, em um total de 2 + nível da magia.",
        },
        ...GOLPE_DIVINO,
        {
          level: 17,
          name: "Cura Suprema",
          description:
            "A partir do 17° nível, quando você jogaria normalmente um ou mais dados para recuperar pontos de vida com uma magia, você usa o maior resultado possível nos dados. Por exemplo, ao invés de recuperar 2d6 pontos de vida, você recupera 12.",
        },
      ],
    },
    {
      id: "arcanismo",
      name: "Domínio do Arcanismo",
      level: 1,
      description:
        "A magia é uma energia que preenche o multiverso e abastece tanto a destruição quanto a criação. Os deuses com o domínio do Arcanismo (como Azuth, Mystra e Corellon Larethian) sabem os segredos e potencial da magia intimamente. Fonte: Compêndio de Classes (Sword Coast Adventurer's Guide), nos Reinos Esquecidos.",
      features: [
        {
          level: 1,
          name: "Magias do Domínio do Arcanismo",
          description:
            "1° nível de clérigo: detectar magia, mísseis mágicos. 3°: arma mágica, aura mágica de Nystul. 5°: círculo mágico, dissipar magia. 7°: arca secreta de Leomund, olho arcano. 9°: âncora planar, círculo de teletransporte.",
        },
        {
          level: 1,
          name: "Iniciado Arcano",
          description:
            "Quando você escolhe esse domínio no 1° nível, você ganha proficiência na perícia Arcanismo e você ganha dois truques, à sua escolha, da lista de magias do mago. Para você, esses truques contam como truques de clérigo.",
        },
        {
          level: 2,
          name: "Canalizar Divindade: Abjuração Arcana",
          description:
            "A partir do 2° nível, você pode usar seu Canalizar Divindade para abjurar criaturas de outros planos. Com uma ação, você apresenta seu símbolo sagrado e um celestial, corruptor, elemental ou fada que esteja a até 9 metros de você deve realizar um teste de resistência de Sabedoria, considerando que a criatura possa ver e ouvir você. Se a criatura fracassar na resistência, ela é expulsa por 1 minuto ou até sofrer qualquer dano. Uma criatura expulsa deve usar seu turno para fugir da melhor forma possível e de forma alguma pode se aproximar a mais de 9 metros de você por vontade própria. Ela também não pode usar reações. Como uma ação, a criatura pode apenas realizar uma Disparada ou tentar escapar de um efeito que a impeça de se mover. Se não há lugar para ir, a criatura pode usar a ação Esquivar. Banimento Arcano: após você alcançar o 5° nível, quando uma criatura falhar no teste de resistência contra Abjuração Arcana, ela é instantaneamente banida por 1 minuto (como na magia banimento, não requer concentração) se não estiver no seu plano de origem e o ND dela for menor ou igual a: 1/2 (5° nível), 1 (8°), 2 (11°), 3 (14°), 4 (17°).",
        },
        {
          level: 6,
          name: "Rompedor de Magia",
          description:
            "A partir do 6° nível, quando você recuperar pontos de vida de um aliado com uma magia de 1° nível ou superior, você também pode terminar um efeito de magia, à sua escolha, nessa criatura. O nível da magia que você termina deve ser igual ou menor que o nível do espaço de magia que você usou para conjurar a magia de cura.",
        },
        {
          level: 8,
          name: "Conjuração Potente",
          description: "A partir do 8° nível, você pode adicionar seu modificador de Sabedoria ao dano causado com qualquer truque de clérigo.",
        },
        {
          level: 17,
          name: "Maestria Arcana",
          description:
            "No 17° nível, você escolhe quatro magias da lista de magias de clérigo, uma de cada um dos níveis a seguir: 6°, 7°, 8°, 9°. Você adiciona elas à sua lista de magias de domínio. Como suas outras magias de domínio, elas sempre estão preparadas e contam como magias de clérigo para você.",
        },
      ],
    },
  ],
  spellcasting: {
    ability: "wis",
    kind: "full",
    cantripsKnown: cantrips(3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5),
    preparesSpells: true,
    ritualCasting: true,
    focus: "Símbolo sagrado",
  },
  progressionColumns: [
    { label: "Canalizar Divindade", values: [dash, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3] },
    {
      label: "Destruir Mortos-Vivos (ND)",
      values: [dash, dash, dash, dash, "1/2", "1/2", "1/2", "1", "1", "1", "2", "2", "2", "3", "3", "3", "4", "4", "4", "4"],
    },
  ],
};

// ---------------------------------------------------------------------------
// DRUIDA
// ---------------------------------------------------------------------------
const DRUIDA: ClassDef = {
  id: "druida",
  name: "Druida",
  summary:
    "Um guardião do equilíbrio da natureza que conjura magias divinas primais e assume a forma de bestas através da Forma Selvagem.",
  hitDie: 8,
  primaryAbilities: ["wis"],
  savingThrows: ["int", "wis"],
  armorProficiencies: ["Armaduras leves", "Armaduras médias", "Escudos (druidas não vestem armaduras ou usam escudos feitos de metal)"],
  weaponProficiencies: ["Clavas", "Adagas", "Dardos", "Azagaias", "Maças", "Bordões", "Cimitarras", "Foices", "Fundas", "Lanças"],
  toolProficiencies: ["Kit de herbalismo"],
  skillChoices: {
    count: 2,
    from: ["arcanismo", "adestrarAnimais", "intuicao", "medicina", "natureza", "percepcao", "religiao", "sobrevivencia"],
  },
  startingEquipment: [
    "(a) um escudo de madeira ou (b) qualquer arma simples",
    "(a) uma cimitarra ou (b) qualquer arma corpo a corpo simples",
    "Armadura de couro, um pacote de aventureiro e um foco druídico",
  ],
  features: [
    {
      level: 1,
      name: "Druídico",
      description:
        "Você conhece o Druídico, o idioma secreto dos druidas. Você pode falar esse idioma e usá-lo para deixar mensagens escondidas. Você e outros que conheçam esse idioma automaticamente veem tais mensagens. Outros perceberão a presença da mensagem se passarem num teste de Sabedoria (Percepção) CD 15, mas não conseguirão decifrá-la sem magia.",
    },
    {
      level: 1,
      name: "Conjuração",
      description:
        "Baseado na essência divina da própria natureza, você pode conjurar magias para moldar sua essência a sua vontade. Truques: você conhece dois truques, à sua escolha, da lista de magias de druida, e aprende truques adicionais em níveis mais altos (coluna Truques Conhecidos). Preparando e Conjurando Magias: a tabela O Druida mostra quantos espaços de magia você tem; você recupera todos os espaços gastos quando termina um descanso longo. Você prepara a lista de magias selecionando-as da lista de magias de druida, em número igual ao seu modificador de Sabedoria + seu nível de druida (mínimo de uma magia), de níveis para os quais você possua espaços de magia. Você pode modificar a lista quando termina um descanso longo; preparar uma nova lista requer no mínimo 1 minuto por nível de magia para cada magia preparada. Habilidade de Conjuração: Sabedoria. CD das magias = 8 + bônus de proficiência + modificador de Sabedoria; modificador de ataque de magia = bônus de proficiência + modificador de Sabedoria. Conjuração de Ritual: você pode conjurar como ritual qualquer magia de druida que possua o descritor ritual e esteja preparada. Foco de Conjuração: você pode usar um foco druídico como foco de conjuração das suas magias de druida.",
    },
    {
      level: 2,
      name: "Forma Selvagem",
      description:
        "A partir do 2° nível, você pode usar sua ação para assumir magicamente a forma de uma besta que você já tenha visto antes. Você pode usar essa característica duas vezes. Você recupera os usos quando termina um descanso curto ou longo. Seu nível de druida determina as bestas em que você pode se transformar, como mostrado na tabela Formas de Besta: 2° nível, ND máx. 1/4, sem deslocamento de voo ou natação (ex.: lobo); 4° nível, ND máx. 1/2, sem deslocamento de voo (ex.: crocodilo); 8° nível, ND máx. 1 (ex.: águia gigante). Você pode continuar na forma de besta por um número de horas igual à metade do seu nível de druida (arredondado para baixo). Então volta à forma original, a não ser que gaste outro uso da característica. Você pode reverter à forma normal prematuramente usando uma ação bônus no seu turno. Você reverte automaticamente se cair inconsciente, cair a 0 pontos de vida ou morrer. Enquanto estiver transformado: suas estatísticas de jogo são substituídas pelas da besta, mas você mantém sua tendência, personalidade e valores de Inteligência, Sabedoria e Carisma; mantém suas proficiências em perícias e testes de resistência, além de receber as da criatura (se a criatura tiver a mesma proficiência e o bônus dela for maior que o seu, usa o dela); você não pode usar ações lendárias ou de covil da criatura. Você assume os pontos de vida e Dados de Vida da criatura; ao reverter, retorna aos pontos de vida que tinha antes, e se reverter por cair a 0 pontos de vida, todo o dano excedente é transferido à sua forma normal. Você não pode conjurar magias e sua fala ou ações que requeiram mãos são limitadas pelas capacidades da forma assumida, mas transformar-se não interrompe sua concentração em uma magia já conjurada. Você mantém os benefícios de todas as características de classe, raça ou outras fontes que a nova forma seja fisicamente capaz de usar, mas não pode usar sentidos especiais (como visão no escuro) a não ser que a nova forma também os tenha. Você escolhe se seu equipamento cai no chão, é assimilado à nova forma ou é usado por ela; equipamento que a nova forma não possa vestir deve cair no chão ou ser assimilado, e equipamentos assimilados não têm efeito até você deixar a forma.",
    },
    {
      level: 2,
      name: "Círculo Druídico",
      description:
        "No 2° nível, você escolhe se identificar com um círculo de druidas: o Círculo da Terra ou o Círculo da Lua. Sua escolha lhe concede características no 2° nível e novamente no 6°, 10° e 14° nível.",
    },
    {
      level: 4,
      name: "Aprimoramento de Forma Selvagem",
      description: "No 4° nível, você pode assumir bestas de ND máximo 1/2 sem deslocamento de voo (veja a tabela Formas de Besta).",
    },
    asi(4),
    {
      level: 6,
      name: "Característica de Círculo Druídico",
      description: "Você recebe uma característica do seu Círculo Druídico.",
    },
    {
      level: 8,
      name: "Aprimoramento de Forma Selvagem",
      description: "No 8° nível, você pode assumir bestas de ND máximo 1 (veja a tabela Formas de Besta).",
    },
    asi(8),
    {
      level: 10,
      name: "Característica de Círculo Druídico",
      description: "Você recebe uma característica do seu Círculo Druídico.",
    },
    asi(12),
    {
      level: 14,
      name: "Característica de Círculo Druídico",
      description: "Você recebe uma característica do seu Círculo Druídico.",
    },
    asi(16),
    {
      level: 18,
      name: "Corpo Atemporal",
      description:
        "Começando no 18° nível, a magia primordial que você controla faz com que você envelheça mais lentamente. Para cada 10 anos que passarem, seu corpo envelhece apenas 1.",
    },
    {
      level: 18,
      name: "Magias da Besta",
      description:
        "A partir do 18° nível, você pode conjurar muitas das suas magias em qualquer forma que assumir usando a Forma Selvagem. Você pode realizar os componentes somáticos e verbais de uma magia de druida na forma de besta, mas não é capaz de prover os componentes materiais.",
    },
    asi(19),
    {
      level: 20,
      name: "Arquidruida",
      description:
        "No 20° nível, você pode usar sua Forma Selvagem um número ilimitado de vezes. Além disso, você pode ignorar os componentes verbais e somáticos das suas magias de druida, assim como qualquer componente material que não tenha custo e não seja consumido pela magia. Você recebe esse benefício tanto na sua forma normal, quanto na forma de besta da sua Forma Selvagem.",
    },
  ],
  subclassLabel: "Círculo Druídico",
  subclasses: [
    {
      id: "circulo-da-terra",
      name: "Círculo da Terra",
      level: 2,
      description:
        "O Círculo da Terra é constituído por místicos e sábios que salvaguardam conhecimento e ritos antigos através de uma vasta tradição oral. Como membro desse círculo, sua magia é influenciada pela terra onde você é iniciado nos ritos misteriosos do círculo.",
      features: [
        {
          level: 2,
          name: "Truque Adicional",
          description: "Quando você escolhe esse círculo no 2° nível, você aprende um truque de druida adicional, à sua escolha.",
        },
        {
          level: 2,
          name: "Recuperação Natural",
          description:
            "A partir do 2° nível, você pode recuperar parte da sua energia mágica parando para fazer uma meditação e comunhão com a natureza. Durante um descanso curto, você escolhe espaços de magia gastos para recuperar. Os espaços podem ter um nível combinado igual ou menor que metade do seu nível de druida (arredondado para baixo) e nenhum dos espaços pode ser de 6° nível ou superior. Você não pode usar essa característica novamente até terminar um descanso longo. Por exemplo, quando você for um druida de 4° nível, pode recuperar até dois níveis em espaços de magia: um espaço de 2° nível ou dois de 1° nível.",
        },
        {
          level: 3,
          name: "Magias de Círculo",
          description:
            "Sua conexão mística com a terra infunde você com a habilidade de conjurar certas magias. No 3°, 5°, 7° e 9° nível, você ganha acesso a magias de círculo ligadas ao terreno em que você se tornou druida: ártico, costa, deserto, floresta, montanha, pântano, planície ou subterrâneo. Uma vez que você tenha acesso a uma magia de círculo, você sempre poderá prepará-la e ela não conta no número de magias que você pode preparar a cada dia. Se a magia não aparece na lista de magias de druida, ela é, mesmo assim, uma magia de druida para você. Ártico: 3° imobilizar pessoa, crescer espinhos; 5° nevasca, lentidão; 7° movimentação livre, tempestade de gelo; 9° comunhão com a natureza, cone de frio. Costa: 3° passo nebuloso, reflexos; 5° andar na água, respirar água; 7° movimentação livre, controlar a água; 9° vidência, conjurar elemental. Deserto: 3° nublar, silêncio; 5° criar alimentos, proteção contra energia; 7° praga, terreno alucinógeno; 9° muralha de pedra, praga de insetos. Floresta: 3° patas de aranha, pele de árvore; 5° convocar relâmpagos, crescer plantas; 7° adivinhação, movimentação livre; 9° comunhão com a natureza, passo de árvore. Montanha: 3° crescer espinhos, patas de aranha; 5° mesclar-se às rochas, relâmpago; 7° moldar rochas, pele de pedra; 9° criar passagem, muralha de pedra. Pântano: 3° escuridão, flecha ácida; 5° andar na água, névoa fétida; 7° localizar criatura, movimentação livre; 9° vidência, praga de insetos. Planície: 3° invisibilidade, passos sem pegadas; 5° luz do dia, velocidade; 7° adivinhação, movimentação livre; 9° praga de insetos, sonho. Subterrâneo: 3° patas de aranha, teia; 5° forma gasosa, névoa fétida; 7° invisibilidade maior, moldar rochas; 9° praga de insetos, névoa mortal.",
        },
        {
          level: 6,
          name: "Caminho da Floresta",
          description:
            "A partir do 6° nível, mover-se através de terreno difícil não-mágico não lhe custa nenhum movimento extra. Você também pode passar através de plantas não-mágicas sem ser atrasado por elas e sem sofrer dano delas se elas tiverem espinhos, espinhas ou perigos similares. Além disso, você tem vantagem em testes de resistência contra plantas criadas magicamente ou manipuladas para impedir movimentação, como as criadas pela magia constrição.",
        },
        {
          level: 10,
          name: "Proteção Natural",
          description: "Quando você atingir o 10° nível, você não pode ser enfeitiçado ou amedrontado por elementais ou fadas e você se torna imune a venenos e doenças.",
        },
        {
          level: 14,
          name: "Santuário Natural",
          description:
            "A partir do 14° nível, as criaturas do mundo natural sentem sua ligação com a natureza e hesitarão em atacar você. Quando uma besta ou planta atacar você, essa criatura deverá fazer um teste de resistência de Sabedoria contra uma CD igual a das suas magias de druida. Em uma falha, a criatura deve escolher um alvo diferente ou o ataque erra automaticamente. Em um sucesso, a criatura se torna imune a esse efeito por 24 horas. A criatura está ciente deste efeito antes de resolver atacar você.",
        },
      ],
    },
    {
      id: "circulo-da-lua",
      name: "Círculo da Lua",
      level: 2,
      description:
        "Os druidas do Círculo da Lua são ferrenhos guardiões da natureza. Tão mutáveis quanto a lua, eles podem espreitar como um grande felino, voar sobre a copa das árvores como uma águia ou mergulhar pela vegetação rasteira como um urso para expulsar um monstro invasor.",
      features: [
        {
          level: 2,
          name: "Forma Selvagem de Combate",
          description:
            "Quando você escolhe esse círculo, no 2° nível, você recebe a habilidade de usar sua Forma Selvagem no seu turno com uma ação bônus, ao invés de com uma ação. Além disso, enquanto você estiver transformado pela sua Forma Selvagem, você pode usar uma ação bônus para gastar um espaço de magia e ganhar 1d8 pontos de vida por nível do espaço de magia gasto.",
        },
        {
          level: 2,
          name: "Formas de Círculo",
          description:
            "Os ritos do seu círculo garantem a você a habilidade de se transformar em formas animais mais poderosas. A partir do 2° nível, você pode usar sua Forma Selvagem para se transformar em uma besta com nível de desafio até 1 (você ignora a coluna ND Máx. da tabela Formas de Besta, mas ainda deve acatar as limitações descritas lá). A partir do 6° nível, você pode se transformar em uma besta com nível de desafio tão alto quanto seu nível de druida dividido por 3, arredondado para baixo.",
        },
        {
          level: 6,
          name: "Ataque Primordial",
          description:
            "A partir do 6° nível, seus ataques na forma de besta contam como mágicos com os propósitos de ultrapassar resistência e imunidade a ataques e danos não-mágicos.",
        },
        {
          level: 10,
          name: "Forma Selvagem de Elemental",
          description:
            "No 10° nível, você pode gastar dois usos da sua Forma Selvagem, ao mesmo tempo, para se transformar em um elemental da água, elemental do ar, elemental do fogo ou elemental da terra.",
        },
        {
          level: 14,
          name: "Mil Formas",
          description: "No 14° nível, você aprende a usar magia para alterar sua forma física de formas mais sutis. Você pode conjurar a magia alterar-se à vontade.",
        },
      ],
    },
  ],
  spellcasting: {
    ability: "wis",
    kind: "full",
    cantripsKnown: cantrips(2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4),
    preparesSpells: true,
    ritualCasting: true,
    focus: "Foco druídico",
  },
  progressionColumns: [
    {
      label: "Forma Selvagem (ND máx.)",
      values: [
        dash,
        "1/4 (sem voo/natação)", "1/4 (sem voo/natação)",
        "1/2 (sem voo)", "1/2 (sem voo)", "1/2 (sem voo)", "1/2 (sem voo)",
        "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// FEITICEIRO
// ---------------------------------------------------------------------------
const FEITICEIRO: ClassDef = {
  id: "feiticeiro",
  name: "Feiticeiro",
  summary:
    "Um conjurador que carrega magia inata em seu sangue ou espírito, moldando-a com pontos de feitiçaria e Metamágica.",
  hitDie: 6,
  primaryAbilities: ["cha"],
  savingThrows: ["con", "cha"],
  armorProficiencies: [],
  weaponProficiencies: ["Adagas", "Dardos", "Fundas", "Bordões", "Bestas leves"],
  toolProficiencies: [],
  skillChoices: { count: 2, from: ["arcanismo", "enganacao", "intuicao", "intimidacao", "persuasao", "religiao"] },
  startingEquipment: [
    "(a) uma besta leve e 20 virotes ou (b) qualquer arma simples",
    "(a) uma bolsa de componentes ou (b) um foco arcano",
    "(a) um pacote de explorador ou (b) um pacote de aventureiro",
    "Duas adagas",
  ],
  features: [
    {
      level: 1,
      name: "Conjuração",
      description:
        "Um evento do seu passado ou na vida de um parente ou ancestral deixou uma marca indelével em você, infundindo você com magia arcana. Truques: você conhece quatro truques, à sua escolha, da lista de magias de feiticeiro, e aprende truques adicionais em níveis mais altos (coluna Truques Conhecidos). Espaços de Magia: a tabela O Feiticeiro mostra quantos espaços de magia de 1° nível e superiores você possui; você recobra todos os espaços gastos quando completa um descanso longo. Magias Conhecidas: você conhece duas magias de 1° nível da lista de magias de feiticeiro; a coluna Magias Conhecidas mostra quando você aprende mais, de um nível a que você tenha acesso. Quando você adquire um nível na classe, pode substituir uma magia de feiticeiro que conheça por outra da lista, de um nível ao qual você tenha espaços de magia. Habilidade de Conjuração: Carisma. CD das magias = 8 + bônus de proficiência + modificador de Carisma; modificador de ataque de magia = bônus de proficiência + modificador de Carisma. Foco de Conjuração: você pode usar um foco arcano como foco de conjuração das suas magias de feiticeiro.",
    },
    {
      level: 1,
      name: "Origem de Feitiçaria",
      description:
        "Escolha uma origem de feitiçaria, que descreve a fonte do seu poder mágico inato: Linhagem Dracônica ou Magia Selvagem (e, nos Reinos Esquecidos, Feitiçaria da Tempestade). Sua escolha lhe confere características quando você a escolhe, no 1° nível e novamente no 6°, 14° e 18° nível.",
    },
    {
      level: 2,
      name: "Fonte de Magia",
      description:
        "No 2° nível, você alcança uma profunda fonte de magia dentro de você. Essa fonte é representada pelos pontos de feitiçaria, que permitem que você crie uma variedade de efeitos mágicos. Você tem 2 pontos de feitiçaria e ganha mais à medida que alcança níveis elevados, como mostrado na coluna Pontos de Feitiçaria. Você nunca poderá ter mais pontos de feitiçaria que os mostrados na tabela para o seu nível. Você recupera todos os pontos de feitiçaria gastos quando termina um descanso longo. Conjuração Flexível: você pode usar seus pontos de feitiçaria para ganhar novos espaços de magia ou sacrificar espaços de magia para ganhar pontos de feitiçaria adicionais. Os espaços de magia criados desaparecem ao final de um descanso longo. Criando Espaços de Magia: com uma ação bônus, no seu turno, você pode transformar pontos de feitiçaria em um espaço de magia. Custo: 1° nível = 2 pontos; 2° = 3; 3° = 5; 4° = 6; 5° = 7. Você não pode criar espaços de magia acima do 5° nível. Convertendo um Espaço de Magia em Pontos de Feitiçaria: com uma ação bônus, no seu turno, você pode gastar um espaço de magia disponível e ganhar uma quantidade de pontos de feitiçaria igual ao nível do espaço.",
    },
    {
      level: 3,
      name: "Metamágica",
      description:
        "No 3° nível, você adquire a habilidade de distorcer suas magias para se adequarem às suas necessidades. Você ganha duas das seguintes opções de Metamágica, à sua escolha, e adquire outra no 10° e no 17° nível. Você pode usar apenas uma opção de Metamágica em uma magia quando a conjura, a não ser que esteja descrito o contrário. Magia Acelerada: ao conjurar uma magia com tempo de conjuração de 1 ação, gaste 2 pontos de feitiçaria para mudar o tempo de conjuração para 1 ação bônus. Magia Aumentada: ao conjurar uma magia que obriga uma criatura a fazer um teste de resistência, gaste 3 pontos de feitiçaria para dar desvantagem a um alvo no primeiro teste de resistência contra ela. Magia Cuidadosa: ao conjurar uma magia que obriga outras criaturas a fazerem teste de resistência, gaste 1 ponto de feitiçaria e escolha criaturas até o seu modificador de Carisma (mínimo uma); elas passam automaticamente no teste. Magia Distante: ao conjurar uma magia com distância de 1,5 metro ou maior, gaste 1 ponto de feitiçaria para dobrar o alcance; com alcance de toque, gaste 1 ponto para mudar o alcance para 9 metros. Magia Duplicada: ao conjurar uma magia incapaz de ter mais de uma criatura como alvo no nível atual e que não tenha alcance pessoal, gaste pontos de feitiçaria iguais ao nível da magia (1 se for truque) para ter uma segunda criatura no alcance como alvo. Magia Estendida: ao conjurar uma magia com duração de 1 minuto ou maior, gaste 1 ponto de feitiçaria para dobrar a duração, até máximo de 24 horas. Magia Potencializada: ao rolar o dano de uma magia, gaste 1 ponto de feitiçaria para jogar novamente dados de dano até seu modificador de Carisma (mínimo um); você deve usar a nova rolagem (pode ser usada junto com outra opção de Metamágica). Magia Sutil: ao conjurar uma magia, gaste 1 ponto de feitiçaria para fazê-lo sem componentes somáticos ou verbais.",
    },
    asi(4),
    {
      level: 6,
      name: "Característica de Origem de Feitiçaria",
      description: "Você recebe uma característica da sua Origem de Feitiçaria.",
    },
    asi(8),
    {
      level: 10,
      name: "Metamágica (opção adicional)",
      description: "Você adquire mais uma opção de Metamágica, à sua escolha.",
    },
    asi(12),
    {
      level: 14,
      name: "Característica de Origem de Feitiçaria",
      description: "Você recebe uma característica da sua Origem de Feitiçaria.",
    },
    asi(16),
    {
      level: 17,
      name: "Metamágica (opção adicional)",
      description: "Você adquire mais uma opção de Metamágica, à sua escolha.",
    },
    {
      level: 18,
      name: "Característica de Origem de Feitiçaria",
      description: "Você recebe uma característica da sua Origem de Feitiçaria.",
    },
    asi(19),
    {
      level: 20,
      name: "Restauração Mística",
      description: "No 20° nível, você recupera 4 pontos de feitiçaria gastos sempre que você terminar um descanso curto.",
    },
  ],
  subclassLabel: "Origem de Feitiçaria",
  subclasses: [
    {
      id: "linhagem-draconica",
      name: "Linhagem Dracônica",
      level: 1,
      description:
        "Sua magia inata vem de magia dracônica que foi misturada ao seu sangue ou ao sangue dos seus ancestrais. Geralmente, os feiticeiros com essa origem traçam sua descendência de poderosos feiticeiros da antiguidade que fizeram uma barganha com um dragão ou que tenham um dragão como parente.",
      features: [
        {
          level: 1,
          name: "Ancestral Dracônico",
          description:
            "No 1° nível, você escolhe um tipo de dragão como seu ancestral. O tipo de dano associado a cada dragão será usado por características que você ganhará posteriormente: Azul (elétrico), Branco (frio), Bronze (elétrico), Cobre (ácido), Latão (fogo), Negro (ácido), Ouro (fogo), Prata (frio), Verde (veneno), Vermelho (fogo). Você pode falar, ler e escrever em Dracônico. Além disso, sempre que você fizer um teste de Carisma quando estiver interagindo com dragões, seu bônus de proficiência será dobrado se ele se aplicar a esse teste.",
        },
        {
          level: 1,
          name: "Resiliência Dracônica",
          description:
            "À medida que a magia flui pelo seu corpo, ela faz com que os traços físicos do seu ancestral dracônico surjam. No 1° nível, seu máximo de pontos de vida aumenta em 1 e aumenta em mais 1 sempre que você ganhar um nível na classe. Além disso, partes da sua pele são cobertas com minúsculas escamas lustrosas de dragão. Quando você não estiver utilizando armadura, sua CA será igual a 13 + seu modificador de Destreza.",
        },
        {
          level: 6,
          name: "Afinidade Elemental",
          description:
            "A partir do 6° nível, quando você conjurar uma magia que cause dano do tipo associado ao seu ancestral dracônico, adicione seu modificador de Carisma ao dano. Ao mesmo tempo, você pode gastar 1 ponto de feitiçaria para ganhar resistência a esse tipo de dano por 1 hora. O bônus de dano se aplica a uma única rolagem de dano da magia, não a diversas rolagens.",
        },
        {
          level: 14,
          name: "Asas de Dragão",
          description:
            "No 14° nível, você adquire a habilidade de brotar um par de asas de dragão das suas costas, ganhando deslocamento de voo igual ao seu deslocamento atual. Você pode criar essas asas com uma ação bônus, no seu turno. Elas duram até que você as dissipe, com uma ação bônus no seu turno. Você não pode manifestar suas asas quando estiver vestindo uma armadura, a não ser que a armadura seja feita para acomodá-las, e roupas que não forem feitas para se acomodar às suas asas devem ser destruídas quando você as manifestar.",
        },
        {
          level: 18,
          name: "Presença Dracônica",
          description:
            "A partir do 18° nível, você pode canalizar a assustadora presença do seu ancestral dracônico, fazendo com que aqueles que o rodeiam fiquem impressionados ou amedrontados. Com uma ação, você pode gastar 5 pontos de feitiçaria para exalar uma aura de admiração ou medo (à sua escolha) a uma distância de 18 metros. Por 1 minuto ou até você perder sua concentração (como se tivesse conjurado uma magia de concentração), cada criatura hostil que começar seu turno nessa aura deve ser bem sucedida num teste de resistência de Sabedoria ou ficará enfeitiçada (se você escolheu admiração) ou amedrontada (se você escolheu medo) até a aura terminar. Uma criatura que seja bem sucedida no teste fica imune à sua aura por 24 horas.",
        },
      ],
    },
    {
      id: "magia-selvagem",
      name: "Magia Selvagem",
      level: 1,
      description:
        "Sua magia inata vem das forças selvagens do caos que constituem a base da ordem da criação. Você deve ter sido exposto a algum tipo de magia bruta, talvez de um portal planar que levava ao Limbo, aos Planos Elementais ou ao misterioso Reino Distante, ou sua magia pode ser uma casualidade do seu nascimento.",
      features: [
        {
          level: 1,
          name: "Surto de Magia Selvagem",
          description:
            "A partir do momento que você escolhe essa origem, no 1° nível, sua conjuração pode liberar surtos de magia selvagem. Imediatamente após você conjurar uma magia de feiticeiro de 1° nível ou superior, o Mestre pode solicitar que você role um d20. Se você rolar um 1, role na tabela Surto de Magia Selvagem para criar um efeito mágico aleatório. Um surto só pode ocorrer uma vez por turno. Se o efeito de um surto for uma magia, ela é muito selvagem para ser afetada por Metamágica. Se normalmente exige concentração, nesse caso não será necessário; a magia permanece por sua duração total. Tabela (d100): 01-02 role na tabela no começo de cada um dos seus turnos pelo próximo minuto, ignorando esse resultado nas rolagens subsequentes; 03-04 você vê criaturas invisíveis por 1 minuto; 05-06 um modron, controlado pelo Mestre, aparece a 1,5 m e desaparece após 1 minuto; 07-08 você conjura bola de fogo (3° nível) centrada em você; 09-10 você conjura mísseis mágicos (5° nível); 11-12 role d10: sua altura muda 3 cm x o resultado (ímpar reduz, par cresce); 13-14 você conjura confusão centrada em você; 15-16 recupera 5 pontos de vida no início de cada turno por 1 minuto; 17-18 cresce uma barba de penas até você espirrar; 19-20 você conjura área escorregadia centrada em você; 21-22 criaturas têm desvantagem em testes de resistência contra a próxima magia com teste de resistência que você conjurar no próximo minuto; 23-24 sua pele fica azul vibrante (remover maldição acaba com o efeito); 25-26 um olho na nuca dá vantagem em Sabedoria (Percepção) visual por 1 minuto; 27-28 por 1 minuto suas magias de 1 ação podem ser conjuradas com ação bônus; 29-30 você se teletransporta até 18 m; 31-32 você vai ao Plano Astral até o fim do próximo turno; 33-34 maximiza o dano da próxima magia de dano no próximo minuto; 35-36 role d10: sua idade muda esse valor em anos (ímpar rejuvenesce, par envelhece); 37-38 1d6 flumphs controlados pelo Mestre aparecem a até 18 m com medo de você e somem após 1 minuto; 39-40 você recupera 2d10 pontos de vida; 41-42 você vira uma planta num vaso até o início do próximo turno (incapacitado, vulnerável a todo dano); 43-44 por 1 minuto você pode se teletransportar até 6 m com ação bônus a cada turno; 45-46 você conjura levitação em si mesmo; 47-48 um unicórnio controlado pelo Mestre aparece a 1,5 m e some em 1 minuto; 49-50 você não consegue falar por 1 minuto (bolhas rosas saem da boca); 51-52 um escudo espectral dá +2 de CA e imunidade a mísseis mágicos por 1 minuto; 53-54 imune a intoxicação por álcool por 5d6 dias; 55-56 seu cabelo cai e volta a crescer em 24 horas; 57-58 por 1 minuto objetos inflamáveis que você tocar (não carregados) entram em combustão; 59-60 você recupera o espaço de magia de menor nível; 61-62 por 1 minuto você deve gritar ao falar; 63-64 você conjura névoa obscurecente centrada em você; 65-66 até três criaturas à sua escolha a até 9 m sofrem 4d10 de dano elétrico; 67-68 você fica com medo da criatura mais próxima até o fim do próximo turno; 69-70 cada criatura a 9 m fica invisível por 1 minuto (termina ao atacar ou conjurar); 71-72 resistência a todos os danos por 1 minuto; 73-74 uma criatura aleatória a até 9 m fica envenenada por 1d4 horas; 75-76 você brilha com luz plena em 9 m por 1 minuto (quem terminar o turno a 1,5 m fica cego até o fim do próximo turno); 77-78 você conjura metamorfose em você (se falhar, vira ovelha); 79-80 borboletas e pétalas ilusórias flutuam a até 3 m por 1 minuto; 81-82 você realiza uma ação adicional imediatamente; 83-84 cada criatura a até 9 m sofre 1d10 necrótico e você recupera pontos de vida iguais à soma; 85-86 você conjura reflexos; 87-88 você conjura voo numa criatura aleatória a até 18 m; 89-90 você fica invisível e inaudível por 1 minuto (termina ao atacar ou conjurar); 91-92 se morrer no próximo minuto, volta à vida por reencarnação; 93-94 seu tamanho aumenta uma categoria por 1 minuto; 95-96 você e criaturas a até 9 m ganham vulnerabilidade a dano perfurante por 1 minuto; 97-98 você é envolto por música etérea suave por 1 minuto; 99-00 você recupera todos os pontos de feitiçaria gastos.",
        },
        {
          level: 1,
          name: "Marés de Caos",
          description:
            "A partir do 1° nível, você pode manipular as forças do acaso e do caos para ganhar vantagem em uma jogada de ataque, teste de habilidade ou teste de resistência. Quando o fizer, você deve finalizar um descanso longo antes de poder usar essa característica novamente. A qualquer momento, depois de recuperar o uso dessa característica, o Mestre pode fazer você rolar na tabela Surto de Magia Selvagem imediatamente após você conjurar uma magia de feiticeiro de 1° nível ou superior. Após isso, você recupera o uso dessa característica.",
        },
        {
          level: 6,
          name: "Dobrar a Sorte",
          description:
            "A partir do 6° nível, você adquire a habilidade de mudar o destino usando sua magia selvagem. Quando outra criatura que você possa ver realizar uma jogada de ataque, um teste de habilidade ou um teste de resistência, você pode usar sua reação para gastar 2 pontos de feitiçaria para rolar 1d4 e aplicar o número rolado como um bônus ou uma penalidade (à sua escolha) na jogada da criatura. Você pode fazer isso depois da criatura fazer a jogada, mas antes do efeito ocorrer.",
        },
        {
          level: 14,
          name: "Caos Controlado",
          description:
            "No 14° nível, você ganha um controle módico sobre seus surtos de magia selvagem. Sempre que você rolar na tabela Surto de Magia Selvagem, você pode rolar duas vezes e usar qualquer resultado.",
        },
        {
          level: 18,
          name: "Bombardeio de Magia",
          description:
            "A partir do 18° nível, a energia nociva das suas magias se intensifica. Quando você rolar o dano de uma magia e rolar o maior dano possível em qualquer dado, escolha um desses dados, role ele novamente e adicione o valor rolado ao dano. Você pode usar essa característica apenas uma vez por rodada.",
        },
      ],
    },
    {
      id: "feiticaria-da-tempestade",
      name: "Feitiçaria da Tempestade",
      level: 1,
      description:
        "Sua magia inata vem do poder elemental do ar. Muitos que possuem esse poder podem rastrear sua mágica de uma experiência de quase-morte causada pela Grande Chuva, ou de uma linhagem que inclui a influência de poderosas criaturas do ar, como os vaati ou djinn. Fonte: Compêndio de Classes (Sword Coast Adventurer's Guide), nos Reinos Esquecidos.",
      features: [
        {
          level: 1,
          name: "Orador do Vento",
          description:
            "A magia arcana que você controla é infundida com ar elemental. Você pode falar, ler e escrever em Primordial. (Conhecer esse idioma permite que você compreenda e seja entendido por aqueles que falam seus dialetos: Aquan, Auran, Ignan e Terran.)",
        },
        {
          level: 1,
          name: "Magia Tempestuosa",
          description:
            "A partir do 1° nível, você pode usar uma ação bônus no seu turno para fazer com que lufadas rodopiantes de ar elemental envolvam você momentaneamente, imediatamente antes ou depois de você conjurar uma magia de 1° nível ou superior. Fazer isso permite que você voe até 3 metros sem provocar ataques de oportunidade.",
        },
        {
          level: 6,
          name: "Coração da Tempestade",
          description:
            "No 6° nível, você ganha resistência a dano elétrico e trovejante. Além disso, sempre que você começar a conjurar uma magia de 1° nível ou superior que cause dano elétrico ou trovejante, mágica tempestuosa irrompe de você. Essa erupção faz com que criaturas de sua escolha, que você possa ver a até 3 metros de você, sofram dano elétrico ou trovejante (escolha a cada vez que essa habilidade se ativar) igual à metade do seu nível de feiticeiro.",
        },
        {
          level: 6,
          name: "Guia da Tempestade",
          description:
            "No 6° nível, você ganha a habilidade de controlar subitamente o clima à sua volta. Se estiver chovendo, você pode usar uma ação para fazer a chuva parar de cair numa esfera de 6 metros de raio, centrada em você. Você pode terminar esse efeito com uma ação bônus. Se estiver ventando, você pode usar uma ação bônus a cada rodada para escolher a direção que o vento sopra numa esfera de 30 metros de raio, centrada em você. O vento sopra nessa direção até o final do seu próximo turno. Essa característica não altera a velocidade do vento.",
        },
        {
          level: 14,
          name: "Fúria da Tempestade",
          description:
            "A partir do 14° nível, quando você for atingido por um ataque corpo a corpo, você pode usar sua reação para causar dano elétrico ao atacante. O dano é igual ao seu nível de feiticeiro. O atacante também deve realizar um teste de resistência de Força contra a CD de suas magias de feiticeiro. Se falhar na resistência, o atacante é afastado de você 6 metros em linha reta.",
        },
        {
          level: 18,
          name: "Alma do Vento",
          description:
            "No 18° nível, você ganha imunidade a dano elétrico e trovejante. Você também ganha um deslocamento de voo mágico de 18 metros. Com uma ação, você pode reduzir seu deslocamento de voo para 9 metros por 1 hora e escolher uma quantidade de criaturas a até 9 metros de você igual a 3 + seu modificador de Carisma. As criaturas escolhidas ganham deslocamento de voo mágico de 9 metros por 1 hora. Quando você reduzir seu deslocamento de voo desse jeito, você não pode fazê-lo novamente até terminar um descanso curto ou longo.",
        },
      ],
    },
  ],
  spellcasting: {
    ability: "cha",
    kind: "full",
    cantripsKnown: cantrips(4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6),
    spellsKnown: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
    preparesSpells: false,
    ritualCasting: false,
    focus: "Foco arcano",
  },
  progressionColumns: [
    { label: "Pontos de Feitiçaria", values: [dash, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  ],
};

export const CLASSES_A: ClassDef[] = [BARBARO, BARDO, BRUXO, CLERIGO, DRUIDA, FEITICEIRO];
