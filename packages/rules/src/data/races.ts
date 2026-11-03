// Raças de D&D 5e (PT-BR). Fontes: Livro do Jogador (cap. 2), Compêndio de Raças
// (Aarakocra, Genasi, Golias, Duergar, Gnomo das Profundezas, Halfling Fantasma e variações)
// e Resumo das Raças (Biblioteca Élfica). Deslocamentos em metros.

import type { Race } from "../types";

const VISAO_NO_ESCURO =
  "Acostumado à vida subterrânea, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.";

export const RACES: Race[] = [
  // ───────────────────────── ANÃO ─────────────────────────
  {
    id: "anao",
    name: "Anão",
    summary:
      "Povo robusto e tradicional das montanhas e do Subterrâneo, conhecido pela resistência, pelo artesanato e pela lealdade ao clã.",
    abilityBonuses: { con: 2 },
    age: "Anões tornam-se maduros na mesma proporção que os humanos, mas são considerados jovens até atingirem a idade de 50 anos. Em média, eles vivem 350 anos.",
    alignment:
      "A maioria dos anões é leal, pois acreditam firmemente nos benefícios de uma sociedade bem organizada. Eles tendem para o bem, com um forte senso de honestidade e uma crença de que todos merecem compartilhar os benefícios de uma ordem social justa.",
    size: "Médio",
    sizeNote: "Anões estão entre 1,20 e 1,50 metro de altura e pesam cerca de 75 kg.",
    speed: 7.5,
    languages: ["Comum", "Anão"],
    traits: [
      {
        name: "Deslocamento",
        description:
          "Seu deslocamento base de caminhada é de 7,5 metros. Seu deslocamento não é reduzido quando estiver usando armadura pesada.",
      },
      { name: "Visão no Escuro", description: VISAO_NO_ESCURO },
      {
        name: "Resiliência Anã",
        description:
          "Você possui vantagem em testes de resistência contra venenos e resistência contra dano de veneno (explicado no capítulo 9).",
      },
      {
        name: "Treinamento Anão em Combate",
        description:
          "Você tem proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra.",
      },
      {
        name: "Proficiência com Ferramentas",
        description:
          "Você tem proficiência em uma ferramenta de artesão à sua escolha entre: ferramentas de ferreiro, suprimentos de cervejeiro ou ferramentas de pedreiro.",
      },
      {
        name: "Especialização em Rochas",
        description:
          "Sempre que você realizar um teste de Inteligência (História) relacionado à origem de um trabalho em pedra, você é considerado proficiente na perícia História e adiciona o dobro do seu bônus de proficiência ao teste, ao invés do seu bônus de proficiência normal.",
      },
      {
        name: "Idiomas",
        description:
          "Você pode falar, ler e escrever Comum e Anão. O idioma Anão é repleto de consoantes duras e sons guturais, e essa característica influencia, como um sotaque, qualquer outro idioma que o anão falar.",
      },
    ],
    proficiencies: {
      weapons: ["Machado de batalha", "Machadinha", "Martelo leve", "Martelo de guerra"],
    },
    subraces: [
      {
        id: "anao-da-colina",
        name: "Anão da Colina",
        abilityBonuses: { wis: 1 },
        traits: [
          {
            name: "Tenacidade Anã",
            description:
              "Seu máximo de pontos de vida aumentam em 1, e cada vez que o anão da colina sobe um nível, ele recebe 1 ponto de vida adicional.",
          },
        ],
      },
      {
        id: "anao-da-montanha",
        name: "Anão da Montanha",
        abilityBonuses: { str: 2 },
        traits: [
          {
            name: "Treinamento Anão com Armaduras",
            description: "Você adquire proficiência em armaduras leves e médias.",
          },
        ],
        proficiencies: { armor: ["Armaduras leves", "Armaduras médias"] },
      },
      {
        id: "duergar",
        name: "Anão Cinzento (Duergar)",
        abilityBonuses: { str: 1 },
        traits: [
          {
            name: "Visão no Escuro Superior",
            description: "Sua visão no escuro tem um raio de 36 metros.",
          },
          {
            name: "Idioma Extra",
            description: "Você pode falar, ler e escrever Subterrâneo.",
          },
          {
            name: "Resistência Duergar",
            description:
              "Você tem vantagem nos testes de resistência contra ilusões e para não ser enfeitiçado ou paralisado.",
          },
          {
            name: "Magia Duergar",
            description:
              "Quando alcança o 3° nível, você pode conjurar a magia aumentar/reduzir em si mesmo uma vez com esse traço, usando apenas a opção de aumentar da magia. Quando alcança o 5° nível, você pode conjurar a magia invisibilidade em si mesmo uma vez com esse traço. Você não precisa de componentes materiais para nenhuma das magias e você não pode conjurá-las enquanto estiver sob luz solar direta, apesar da luz solar não ter efeito sobre elas após serem conjuradas. Você recupera a capacidade de conjurar essas magias com esse traço quando você termina um descanso longo. Sua habilidade de conjuração para essas magias é Inteligência.",
          },
          {
            name: "Sensibilidade à Luz Solar",
            description:
              "Você tem desvantagem nas jogadas de ataque e em testes de Sabedoria (Percepção) relacionados à visão quando você, o alvo do seu ataque, ou o que quer que você esteja tentando perceber, estiver sob luz solar direta.",
          },
          {
            name: "Observação do Mestre",
            description:
              "A sub-raça duergar tem os traços raciais do anão do Livro do Jogador, mais os traços de sub-raça acima. Verifique com seu Mestre para ver se você pode jogar com um personagem anão cinzento.",
          },
        ],
      },
    ],
  },

  // ───────────────────────── ELFO ─────────────────────────
  {
    id: "elfo",
    name: "Elfo",
    summary:
      "Povo gracioso e longevo, ligado à magia e à natureza, que ama a liberdade, a arte e a expressão pessoal.",
    abilityBonuses: { dex: 2 },
    age: "Embora os elfos atinjam a maturidade física com praticamente a mesma idade dos humanos, a compreensão élfica da idade adulta vai além da maturidade física, abrangendo sua experiência sobre o mundo. Um elfo tipicamente assume a idade adulta e um nome adulto com cerca de 100 anos de idade e pode viver 750 anos.",
    alignment:
      "Elfos amam a liberdade, a diversidade e a expressão pessoal, então eles inclinam-se forte e suavemente para aspectos do caos. Eles valorizam e protegem a liberdade dos outros como a sua própria, e são geralmente mais bondosos que o contrário. Os drow são exceção. Seu exílio no Subterrâneo fez deles perversos e perigosos. Drow são geralmente mais maus que o contrário.",
    size: "Médio",
    sizeNote: "Elfos medem entre 1,50 a 1,80 metro de altura e possuem constituição delgada.",
    speed: 9,
    languages: ["Comum", "Élfico"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Visão no Escuro",
        description:
          "Acostumado às florestas crepusculares e ao céu noturno, você possui uma visão superior em condições de escuridão e na penumbra. Você pode enxergar na penumbra a até 18 metros como se fosse na luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      },
      { name: "Sentidos Aguçados", description: "Você tem proficiência na perícia Percepção." },
      {
        name: "Ancestral Feérico",
        description:
          "Você tem vantagem nos testes de resistência para resistir a ser enfeitiçado e magias não podem colocá-lo para dormir.",
      },
      {
        name: "Transe",
        description:
          "Elfos não precisam dormir. Ao invés disso, eles meditam profundamente, permanecendo semiconscientes, durante 4 horas por dia. (A palavra em idioma comum para tal meditação é \"transe\".) Enquanto medita, um elfo é capaz de sonhar de certo modo. Esses sonhos na verdade são exercícios mentais que se tornam reflexos através de anos de prática. Depois de descansar dessa forma, você ganha os mesmos benefícios que um humano depois de 8 horas de sono.",
      },
      {
        name: "Idiomas",
        description:
          "Você pode falar, ler e escrever Comum e Élfico. O Élfico é um idioma fluido, com entonações sutis e gramática complexa. A literatura élfica é rica e diversa, e suas canções e poemas são famosos entre outras raças. Muitos bardos aprendem essa língua para que possam adicionar canções élficas ao seu repertório.",
      },
    ],
    proficiencies: { skills: ["percepcao"] },
    subraces: [
      {
        id: "alto-elfo",
        name: "Alto Elfo",
        abilityBonuses: { int: 1 },
        traits: [
          {
            name: "Treinamento Élfico com Armas",
            description:
              "Você possui proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos.",
          },
          {
            name: "Truque",
            description:
              "Você conhece um truque, à sua escolha, da lista de truques do mago. Inteligência é a habilidade usada para conjurar este truque.",
          },
          {
            name: "Idioma Adicional",
            description: "Você pode falar, ler e escrever um idioma adicional à sua escolha.",
          },
          {
            name: "Elfos do Sol e Elfos da Lua",
            description:
              "Em muitos dos mundos de D&D, existem dois tipos de altos elfos. Um tipo (que inclui os elfos cinzentos e elfos do vale de Greyhawk, os Silvanesti de Dragonlance, e os elfos do sol dos Reinos Esquecidos) são arrogantes e reclusos, acreditando serem superiores aos não elfos e até mesmo a outros elfos. O outro tipo (como os altos elfos de Greyhawk, os Qualinesti de Dragonlance e os elfos da lua dos Reinos Esquecidos) são mais comuns e amigáveis, e muitas vezes encontrados entre humanos e outras raças. Os elfos do sol de Faerûn (também chamado de elfos dourados ou elfos do amanhecer) têm pele bronzeada e cabelos cor de cobre, negros ou louro dourado. Seus olhos são dourados, prateados ou negros. Os elfos da lua (também chamados de elfos de prata ou elfos cinzentos) são muito mais pálidos, com pele de alabastro por vezes tingida de azul. Normalmente, eles têm cabelos de um branco prateado, negros ou azuis, diversos tons de loiro, castanho e vermelho não são incomuns. Seus olhos são azuis ou verdes com manchas douradas.",
          },
        ],
        proficiencies: {
          weapons: ["Espada longa", "Espada curta", "Arco longo", "Arco curto"],
        },
      },
      {
        id: "elfo-da-floresta",
        name: "Elfo da Floresta",
        abilityBonuses: { wis: 1 },
        speed: 10.5,
        traits: [
          {
            name: "Treinamento Élfico com Armas",
            description:
              "Você possui proficiência com espadas longas, espadas curtas, arcos longos e arcos curtos.",
          },
          {
            name: "Pés Ligeiros",
            description: "Seu deslocamento base de caminhada aumenta para 10,5 metros.",
          },
          {
            name: "Máscara da Natureza",
            description:
              "Você pode tentar se esconder mesmo quando você está apenas levemente obscurecido por folhagem, chuva forte, neve caindo, névoa ou outro fenômeno natural.",
          },
        ],
        proficiencies: {
          weapons: ["Espada longa", "Espada curta", "Arco longo", "Arco curto"],
        },
      },
      {
        id: "drow",
        name: "Elfo Negro (Drow)",
        abilityBonuses: { cha: 1 },
        traits: [
          {
            name: "Visão no Escuro Superior",
            description: "Sua visão no escuro tem alcance de 36 metros de raio.",
          },
          {
            name: "Sensibilidade à Luz Solar",
            description:
              "Você possui desvantagem nas jogadas de ataque e testes de Sabedoria (Percepção) relacionados a visão quando você, o alvo do seu ataque, ou qualquer coisa que você está tentando perceber, esteja sob luz solar direta.",
          },
          {
            name: "Magia Drow",
            description:
              "Você possui o truque globos de luz. Quando você alcança o 3° nível, você pode conjurar fogo das fadas uma vez com este traço. Quando você alcança o 5° nível, você pode conjurar escuridão uma vez com este traço. Você precisa terminar um descanso longo para poder conjurar as magias desse traço novamente. Carisma é sua habilidade chave para conjurar essas magias.",
          },
          {
            name: "Treinamento Drow com Armas",
            description: "Você possui proficiência com rapieiras, espadas curtas e bestas de mão.",
          },
          {
            name: "Disponibilidade",
            description:
              "Aventureiros drow são raros e a raça não existe em todo o mundo. Verifique com seu Mestre se a raça drow está disponível como personagem de jogador.",
          },
        ],
        proficiencies: { weapons: ["Rapieira", "Espada curta", "Besta de mão"] },
      },
    ],
  },

  // ───────────────────────── HALFLING ─────────────────────────
  {
    id: "halfling",
    name: "Halfling",
    summary:
      "Pequeno povo afável e tradicional, apegado à comunidade, ao lar e ao conforto, mas surpreendentemente corajoso e sortudo.",
    abilityBonuses: { dex: 2 },
    age: "Um halfling atinge a idade adulta aos 20 anos e pode chegar a 150 anos.",
    alignment:
      "A maioria dos halflings é leal e boa. Via de regra, eles possuem um bom coração e são amáveis, odeiam ver o sofrimento dos outros e não toleram a opressão. Eles também são muito ordeiros e tradicionais, fortemente apegados à sua comunidade e ao conforto de suas antigas tradições.",
    size: "Pequeno",
    sizeNote: "Halflings medem cerca de 0,90 metro de altura e pesam aproximadamente 20 kg.",
    speed: 7.5,
    languages: ["Comum", "Halfling"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 7,5 metros." },
      {
        name: "Sortudo",
        description:
          "Quando você obtiver um 1 natural em uma jogada de ataque, teste de habilidade ou teste de resistência, você pode jogar de novo o dado e deve utilizar o novo resultado.",
      },
      {
        name: "Bravura",
        description: "Você tem vantagem em testes de resistência contra ficar amedrontado.",
      },
      {
        name: "Agilidade Halfling",
        description:
          "Você pode mover-se através do espaço de qualquer criatura que for de um tamanho maior que o seu.",
      },
      {
        name: "Idiomas",
        description:
          "Você pode falar, ler e escrever Comum e Halfling. A linguagem Halfling não é secreta, mas os halflings são relutantes em compartilhá-la com os outros. Eles escrevem muito pouco, por isso eles não possuem uma literatura rica. No entanto, sua tradição oral é muito forte. Quase todos os halflings falam o idioma Comum para conversar com as pessoas das terras que habitam, ou através das quais eles estejam viajando.",
      },
    ],
    subraces: [
      {
        id: "pes-leves",
        name: "Pés-Leves",
        abilityBonuses: { cha: 1 },
        traits: [
          {
            name: "Furtividade Natural",
            description:
              "Você pode tentar se esconder mesmo quando possuir apenas a cobertura de uma criatura que for no mínimo um tamanho maior que o seu.",
          },
        ],
      },
      {
        id: "robusto",
        name: "Robusto",
        abilityBonuses: { con: 1 },
        traits: [
          {
            name: "Resiliência dos Robustos",
            description:
              "Você tem vantagem em testes de resistência contra veneno e tem resistência contra dano de veneno.",
          },
        ],
      },
      {
        id: "fantasma",
        name: "Fantasma",
        abilityBonuses: { wis: 1 },
        traits: [
          {
            name: "Dialeto Silencioso",
            description:
              "Você pode falar telepaticamente com qualquer criatura a até 9 metros de você. A criatura compreende você apenas se ambos partilharem um idioma. Você pode falar telepaticamente dessa forma apenas com uma criatura por vez.",
          },
          {
            name: "Observação do Mestre",
            description:
              "Devido a esse povo ser unido e desconfiado de forasteiros, os halflings fantasma aventureiros são raros. Pergunte ao seu Mestre se você pode jogar com um membro dessa sub-raça, que possui os traços raciais dos halflings do Livro do Jogador, mais os traços da sub-raça.",
          },
        ],
      },
    ],
  },

  // ───────────────────────── HUMANO ─────────────────────────
  {
    id: "humano",
    name: "Humano",
    summary:
      "A mais jovem das raças comuns: inovadores, realizadores e pioneiros, de culturas e aparências muito variadas.",
    abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    age: "Os humanos chegam à idade adulta no final da adolescência e vivem menos de um século.",
    alignment:
      "Os humanos não possuem inclinação a nenhuma tendência em especial. Os melhores e os piores são encontrados entre eles.",
    size: "Médio",
    sizeNote:
      "Os humanos variam muito em altura e peso, podem ter quase 1,50 metro ou mais de 1,80 metro. Independentemente da sua posição entre esses valores, o seu tamanho é Médio.",
    speed: 9,
    languages: ["Comum"],
    extraLanguages: 1,
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Idiomas",
        description:
          "Você pode falar, ler e escrever Comum e outro idioma adicional, à sua escolha. Os humanos normalmente aprendem os idiomas dos povos que convivem, incluindo dialetos obscuros. Eles gostam de rechear seu discurso com palavras emprestadas de outras línguas: xingamentos orcs, expressões musicais élficas, frases militares anãs e outros.",
      },
      {
        name: "Traços Raciais Alternativos",
        description:
          "Se sua campanha usa as regras opcionais de talentos do capítulo 6, seu Mestre pode permitir que você utilize os traços raciais alternativos que substituem as características Aumento no Valor de Habilidade e Perícias. Aumento no Valor de Habilidade: dois valores de habilidade, à sua escolha, aumentam em 1. Perícia: você ganha proficiência em uma perícia, à sua escolha. Talento: você adquire um talento de sua escolha.",
      },
    ],
    subraces: [],
  },

  // ───────────────────────── DRACONATO ─────────────────────────
  {
    id: "draconato",
    name: "Draconato",
    summary:
      "Humanoides de herança dracônica, altos e orgulhosos, com escamas, resistência elemental e uma arma de sopro.",
    abilityBonuses: { str: 2, cha: 1 },
    age: "Draconatos jovens crescem rapidamente. Eles caminham horas após nascerem, adquirindo o tamanho e desenvolvimento semelhante a de uma criança humana de 10 anos com 3 anos de idade e alcançam a maturidade aos 15. Eles costumam viver até os 80.",
    alignment:
      "Os draconatos tendem aos extremos, realizando uma escolha consciente de um lado ou do outro da guerra cósmica entre o bem e o mal (representada por Bahamut e Tiamat, respectivamente). A maioria dos draconatos é boa, mas os que vão para o lado de Tiamat podem se tornar vilões terríveis.",
    size: "Médio",
    sizeNote:
      "Os draconatos são mais altos e mais pesados que os humanos, geralmente possuindo mais de 1,80 metro e normalmente pesando mais de 125 kg.",
    speed: 9,
    languages: ["Comum", "Dracônico"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Ancestral Dracônico",
        description:
          "Você possui um ancestral dracônico. Escolha um tipo de dragão da tabela Ancestral Dracônico. Sua arma de sopro e resistência a dano são determinadas pelo tipo de dragão, como mostrado na tabela. Tabela (Dragão: tipo de dano; arma de sopro): Azul: elétrico; linha de 1,5m por 9m (teste de Des). Branco: frio; cone de 4,5m (teste de Con). Bronze: elétrico; linha de 1,5m por 9m (teste de Des). Cobre: ácido; linha de 1,5m por 9m (teste de Des). Latão: fogo; linha de 1,5m por 9m (teste de Des). Negro: ácido; linha de 1,5m por 9m (teste de Des). Ouro: fogo; cone de 4,5m (teste de Des). Prata: frio; cone de 4,5m (teste de Con). Verde: veneno; cone de 4,5m (teste de Con). Vermelho: fogo; cone de 4,5m (teste de Des).",
      },
      {
        name: "Arma de Sopro",
        description:
          "Você pode usar uma ação para exalar energia destrutiva. Seu ancestral dracônico determina o tamanho, formato e tipo de dano que você expele. Quando você usa sua arma de sopro, cada criatura na área exalada deve realizar um teste de resistência, o tipo do teste é determinado pelo seu ancestral dracônico. A CD do teste de resistência é 8 + seu modificador de Constituição + seu bônus de proficiência. Uma criatura sofre 2d6 de dano num fracasso e metade desse dano num sucesso. O dano aumenta para 3d6 no 6° nível, 4d6 no 11° nível e 5d6 no 16° nível. Depois de usar sua arma de sopro, você não poderá utilizá-la novamente até completar um descanso curto ou longo.",
      },
      {
        name: "Resistência a Dano",
        description: "Você possui resistência ao tipo de dano associado ao seu ancestral dracônico.",
      },
      {
        name: "Idiomas",
        description:
          "Você pode falar, ler e escrever Comum e Dracônico. O idioma Dracônico é conhecido por ser uma das mais antigas línguas e ainda é usado no estudo de magia. A linguagem soa áspera para a maioria das criaturas, incluindo várias consoantes e sílabas firmes.",
      },
    ],
    subraces: [],
  },

  // ───────────────────────── GNOMO ─────────────────────────
  {
    id: "gnomo",
    name: "Gnomo",
    summary:
      "Pequenos inventores e curiosos, cheios de energia e bom humor, que apreciam cada momento de invenção, exploração e brincadeira.",
    abilityBonuses: { int: 2 },
    age: "Gnomos amadurecem a mesma proporção que os humanos e, a maioria, atinge a idade adulta por volta dos 40 anos. Eles podem viver entre 350 e 500 anos.",
    alignment:
      "Os gnomos geralmente são bons. Os que tendem para a ordem são sábios, engenheiros, pesquisadores, escolásticos, investigadores ou inventores. Os que tendem ao caos são menestréis, engenhoqueiros, andarilhos ou joalheiros caprichosos. Gnomos são bons de coração e, até mesmo os trapaceiros entre eles tendem a ser mais brincalhões que perversos.",
    size: "Pequeno",
    sizeNote: "Os gnomos tem entre 0,90 e 1,20 metro e seu peso médio é de 20 kg.",
    speed: 7.5,
    languages: ["Comum", "Gnômico"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 7,5 metros." },
      { name: "Visão no Escuro", description: VISAO_NO_ESCURO },
      {
        name: "Esperteza Gnômica",
        description:
          "Você possui vantagem em todos os testes de resistência de Inteligência, Sabedoria e Carisma contra magia.",
      },
      {
        name: "Idiomas",
        description:
          "Você sabe falar, ler e escrever Comum e Gnômico. A linguagem Gnômica, que usa o alfabeto Anão, é conhecida por suas técnicas de dissertação e por seus catálogos de conhecimento sobre o mundo natural.",
      },
    ],
    subraces: [
      {
        id: "gnomo-da-floresta",
        name: "Gnomo da Floresta",
        abilityBonuses: { dex: 1 },
        traits: [
          {
            name: "Ilusionista Nato",
            description:
              "Você conhece o truque ilusão menor. Inteligência é a sua habilidade usada para conjurá-la.",
          },
          {
            name: "Falar com Bestas Pequenas",
            description:
              "Através de sons e gestos, você pode comunicar ideias simples para Bestas pequenas ou menores. Gnomos da floresta amam os animais e normalmente possuem esquilos, doninhas, coelhos, toupeiras, pica-paus e outras criaturas como amados animais de estimação.",
          },
        ],
      },
      {
        id: "gnomo-das-rochas",
        name: "Gnomo das Rochas",
        abilityBonuses: { con: 1 },
        traits: [
          {
            name: "Conhecimento de Artífice",
            description:
              "Toda vez que você fizer um teste de Inteligência (História) relacionado a itens mágicos, objetos alquímicos ou mecanismos tecnológicos, você pode adicionar o dobro do seu bônus de proficiência, ao invés de qualquer bônus de proficiência que você normalmente use.",
          },
          {
            name: "Engenhoqueiro",
            description:
              "Você possui proficiência com ferramentas de artesão (ferramentas de engenhoqueiro). Usando essas ferramentas, você pode gastar 1 hora e 10 po em materiais para construir um mecanismo Miúdo (CA 5, 1 pv). O mecanismo para de funcionar após 24 horas (a não ser que você gaste 1 hora reparando-o para manter o mecanismo funcionando), ou quando você usa sua ação para desmantelá-lo; nesse momento, você pode recuperar o material usado para criá-lo. Você pode ter até três desses mecanismos ativos ao mesmo tempo. Quando você criar um mecanismo, escolha uma das seguintes opções: Brinquedo Mecânico: esse brinquedo é um animal, monstro ou pessoa mecânica, como um sapo, rato, pássaro, dragão ou soldado. Quando colocado no chão, o brinquedo se move 1,5 metro pelo chão em cada um dos seus turnos em uma direção aleatória. Ele faz barulhos apropriados a criatura que ele representa. Isqueiro Mecânico: o mecanismo produz uma miniatura de chama, que você pode usar para acender uma vela, tocha ou fogueira. Usar o mecanismo requer sua ação. Caixa de Música: quando aberta, essa caixa de música toca uma canção a um volume moderado. A caixa para de tocar quando alcança o fim da música ou quando é fechada.",
          },
        ],
        proficiencies: { tools: ["Ferramentas de engenhoqueiro"] },
      },
      {
        id: "gnomo-das-profundezas",
        name: "Gnomo das Profundezas (Svirfneblin)",
        abilityBonuses: { dex: 1 },
        traits: [
          {
            name: "Alternativa às Sub-raças do Livro do Jogador",
            description:
              "Quando você criar um personagem gnomo, você pode escolher o gnomo das profundezas como uma alternativa às sub-raças do Livro do Jogador. No Compêndio, os traços raciais do gnomo e do gnomo das profundezas foram combinados: Inteligência aumenta em 2 e Destreza aumenta em 1.",
          },
          {
            name: "Idade",
            description:
              "Gnomos das profundezas tem vidas curtas em comparação com os gnomos. Eles amadurecem a mesma proporção que os humanos e, a maioria, atinge a idade adulta por volta dos 25 anos. Eles podem viver entre 200 e 250 anos, apesar do trabalho árduo e dos perigos do Subterrâneo geralmente levá-los antes do tempo.",
          },
          {
            name: "Tendência",
            description:
              "Os svirfneblin acreditam que sobreviver depende de evitar confusão com outras criaturas e não fazer inimigos, então, eles tendem a ser neutros. Eles raramente desejam o mal a outros, mas dificilmente irão se arriscar por outros.",
          },
          {
            name: "Tamanho",
            description:
              "Um svirfneblin típico tem entre 0,90 e 1 metro de altura e pesam entre 40 e 60 kg. Seu tamanho é Pequeno.",
          },
          {
            name: "Visão no Escuro",
            description: "Sua visão no escuro tem um raio de 36 metros.",
          },
          {
            name: "Camuflagem Rochosa",
            description:
              "Você tem vantagem em testes de Destreza (Furtividade) feitos para se esconder em terreno rochoso.",
          },
          {
            name: "Idiomas",
            description:
              "Você sabe falar, ler e escrever Comum, Gnômico e Subterrâneo. O dialeto svirfneblin é mais gutural que o Gnômico da superfície, e muitos svirfneblin conhecem apenas um pouco de Comum, mas aqueles que lidam com estrangeiros (incluindo você como aventureiro) conhecem o suficiente de Comum para irem até outras terras.",
          },
          {
            name: "Talento Opcional: Magia Svirfneblin",
            description:
              "Se o seu Mestre permite o uso dos talentos do capítulo 6 do Livro do Jogador, seu personagem gnomo das profundezas tem acesso ao seguinte talento especial. Pré-requisito: Gnomo (gnomo das profundezas). Você herdou a capacidade de conjuração inata dos seus ancestrais. Essa habilidade permite que você conjure dificultar detecção em si mesmo, à vontade, sem precisar de componentes materiais. Você também pode conjurar cada uma das seguintes magias com essa habilidade: cegueira/surdez, nublar e disfarçar-se. Você recupera a capacidade de conjurar essas magias quando termina um descanso longo.",
          },
        ],
      },
    ],
  },

  // ───────────────────────── MEIO-ELFO ─────────────────────────
  {
    id: "meio-elfo",
    name: "Meio-Elfo",
    summary:
      "Fruto da união entre humanos e elfos, combina a graça élfica com a energia humana e costuma ser um excelente embaixador.",
    abilityBonuses: { cha: 2 },
    abilityChoice: { count: 2, amount: 1, exclude: ["cha"] },
    age: "Meio-elfos atingem a maturidade ao mesmo tempo que os humanos atingem a idade adulta, por volta dos 20 anos. Eles vivem muito mais que os humanos, no entanto, raramente ultrapassam os 180 anos.",
    alignment:
      "Meio-elfos compartilham a veia caótica da sua herança élfica. Eles valorizam tanto a sua liberdade quanto sua expressão criativa, não demonstrando qualquer apreço por líderes ou seguidores. Eles se irritam com regras, ressentindo com exigências de outros e, às vezes, se provam incertos, ou pelo menos, imprevisíveis.",
    size: "Médio",
    sizeNote:
      "Meio-elfos tem aproximadamente a mesma altura dos humanos, variando entre 1,50 metro e 1,80 metro.",
    speed: 9,
    languages: ["Comum", "Élfico"],
    extraLanguages: 1,
    traits: [
      {
        name: "Aumento no Valor de Habilidade",
        description:
          "Seu valor de Carisma aumenta em 2 e outros dois valores de habilidade, à sua escolha, aumentam em 1.",
      },
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Visão no Escuro",
        description:
          "Graças ao seu sangue élfico, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      },
      {
        name: "Ancestral Feérico",
        description:
          "Você possui vantagem em testes de resistência contra encantamento e magia não pode colocar você para dormir.",
      },
      {
        name: "Versatilidade em Perícia",
        description: "Você ganha proficiência em duas perícias, à sua escolha.",
      },
      {
        name: "Idiomas",
        description:
          "Você sabe falar, ler e escrever Comum, Élfico e um idioma adicional, à sua escolha.",
      },
      {
        name: "Variações de Meio-Elfo",
        description:
          "Alguns meio-elfos em Faerûn possuem um traço racial no lugar do traço Versatilidade em Perícia. Se o seu Mestre permitir, seu personagem meio-elfo pode abdicar da Versatilidade em Perícia e, ao invés, ter o traço racial Sentidos Aguçados ou um traço baseado no seu parentesco élfico: um meio-elfo com descendência de elfo da floresta pode escolher o Treinamento Élfico com Arma, Pés Ligeiros ou Máscara da Natureza do elfo da floresta; um meio-elfo com descendência de elfo da lua ou elfo do sol pode escolher o Treinamento Élfico com Arma ou Truque do alto elfo; um meio-elfo com descendência drow pode escolher a Magia Drow do drow; um meio-elfo com descendência de elfo aquático pode escolher um deslocamento de natação de 9 metros.",
      },
    ],
    subraces: [],
  },

  // ───────────────────────── MEIO-ORC ─────────────────────────
  {
    id: "meio-orc",
    name: "Meio-Orc",
    summary:
      "Descendente de orcs e humanos, forte e resistente, de temperamento feroz e frequentemente marcado pela busca de aceitação.",
    abilityBonuses: { str: 2, con: 1 },
    age: "Os meio-orcs amadurecem um pouco antes dos humanos, atingindo a idade adulta aos 14 anos. Eles envelhecem notavelmente mais rápido e, raramente, vivem mais de 75 anos.",
    alignment:
      "Meio-orcs tem uma tendência inata ao caos devido aos seus parentes orcs e não são fortemente inclinados ao bem. Meio-orcs que cresceram entre orcs e desejam viver e estão dispostos a passar sua vida entre eles, tendem a ser malignos.",
    size: "Médio",
    sizeNote:
      "Meio-orcs são de certa forma maiores e mais largos que os humanos, medindo entre 1,80 metro e 2,10 metros.",
    speed: 9,
    languages: ["Comum", "Orc"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Visão no Escuro",
        description:
          "Graças ao seu sangue orc, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      },
      { name: "Ameaçador", description: "Você adquire proficiência na perícia Intimidação." },
      {
        name: "Resistência Implacável",
        description:
          "Quando você é reduzido a 0 pontos de vida mas não é completamente morto, você pode voltar para 1 ponto de vida. Você não pode usar essa característica novamente até completar um descanso longo.",
      },
      {
        name: "Ataques Selvagens",
        description:
          "Quando você atinge um ataque crítico com uma arma corpo-a-corpo, você pode rolar um dos dados de dano da arma mais uma vez e adicioná-lo ao dano extra causado pelo acerto crítico.",
      },
      {
        name: "Idiomas",
        description:
          "Você sabe falar, ler e escrever Comum e Orc. O Orc é um idioma ríspido, possuindo uma linguagem de consoantes duras. Ele não possui alfabeto próprio, mas usa o alfabeto Anão.",
      },
    ],
    proficiencies: { skills: ["intimidacao"] },
    subraces: [],
  },

  // ───────────────────────── TIEFLING ─────────────────────────
  {
    id: "tiefling",
    name: "Tiefling",
    summary:
      "Humanoides de herança infernal, vistos com desconfiança, de natureza independente e dotados de magia e resistência ao fogo.",
    abilityBonuses: { int: 1, cha: 2 },
    age: "Os tieflings amadurecem ao mesmo tempo que os humanos, mas vivem alguns anos a mais.",
    alignment:
      "Tieflings não possuem uma tendência inata ao mal, mas muitos acabam por abraçá-lo. Maligno ou não, uma natureza independente inclina a maioria dos tieflings ao alinhamento caótico.",
    size: "Médio",
    sizeNote: "Os tieflings possuem o mesmo tamanho e compleição dos humanos.",
    speed: 9,
    languages: ["Comum", "Infernal"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Visão no Escuro",
        description:
          "Graças a sua herança infernal, você tem uma visão superior no escuro e na penumbra. Você enxerga na penumbra a até 18 metros como se fosse luz plena, e no escuro como se fosse na penumbra. Você não pode discernir cores no escuro, apenas tons de cinza.",
      },
      { name: "Resistência Infernal", description: "Você possui resistência a dano de fogo." },
      {
        name: "Legado Infernal",
        description:
          "Você conhece o truque taumaturgia. Quando você atingir o 3° nível, você poderá conjurar a magia repreensão infernal uma vez por dia como uma magia de 2° nível. Quando você atingir o 5° nível, você também poderá conjurar a magia escuridão. Você precisa terminar um descanso longo para poder usar as magias desse traço novamente. Sua habilidade de conjuração para essas magias é Carisma.",
      },
      {
        name: "Idiomas",
        description: "Você sabe falar, ler e escrever Comum e Infernal.",
      },
      {
        name: "Variação: Alado",
        description:
          "Você tem asas de morcego brotando de suas omoplatas. Você tem deslocamento de voo de 9 metros. Esse traço substitui o traço Legado Infernal. (Língua do Diabo, Fogo Infernal e Alado são mutuamente exclusivos.)",
      },
      {
        name: "Variação: Aparência",
        description:
          "Seu tiefling pode não se parecer com outros tieflings. Ao invés de ter as características físicas descritas no Livro do Jogador, escolha 1d4 + 1 dos seguintes traços: pequenos chifres; presas ou dentes afiados; uma língua bifurcada; olhos de serpente; seis dedos em cada mão; pernas de bode; cascos partidos; uma cauda bifurcada; pele coriácea ou escamada; pele vermelha ou azul escura; não projeta sombra ou reflexo; exala um cheiro de enxofre.",
      },
      {
        name: "Variação: Feroz",
        description:
          "Seu valor de Inteligência aumenta em 1 e seu valor de Destreza aumenta em 2. Esse traço substitui o traço Aumento no Valor de Habilidade.",
      },
      {
        name: "Variação: Fogo Infernal",
        description:
          "Quando você alcança o 3° nível, você pode conjurar a magia mãos flamejantes uma vez como uma magia de 2° nível. Esse traço substitui a magia repreensão infernal do traço Legado Infernal. (Língua do Diabo, Fogo Infernal e Alado são mutuamente exclusivos.)",
      },
      {
        name: "Variação: Língua do Diabo",
        description:
          "Você conhece o truque zombaria viciosa. Quando você alcança o 3° nível, você pode conjurar a magia enfeitiçar pessoa como uma magia de 2° nível uma vez com esse traço. Quando você alcança o 5° nível, você pode conjurar a magia cativar uma vez com esse traço. Você deve terminar um descanso longo para conjurar essas magias novamente com esse traço. Sua habilidade de conjuração para elas é Carisma. Esse traço substitui o traço Legado Infernal. (Língua do Diabo, Fogo Infernal e Alado são mutuamente exclusivos.)",
      },
    ],
    subraces: [],
  },

  // ───────────────────────── GENASI ─────────────────────────
  {
    id: "genasi",
    name: "Genasi",
    summary:
      "Prole de gênios e mortais, marcada pelo poder dos Planos Elementais, independente e autoconfiante, com quatro linhagens elementais.",
    abilityBonuses: { con: 2 },
    age: "Os genasi amadurecem a mesma proporção que os humanos e alcançam a idade adulta no final de sua adolescência, por volta dos 20 anos. Eles vivem um pouco mais que os humanos, chegando até 120 anos.",
    alignment: "Independentes e autoconfiantes, os genasi tendem a serem neutros.",
    size: "Médio",
    sizeNote:
      "Os genasi são tão variados quanto seus parentes mortais, mas geralmente tem compleição de humanos, variando entre 1,5 e 1,8 metro de altura.",
    speed: 9,
    languages: ["Comum", "Primordial"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      {
        name: "Idiomas",
        description:
          "Você pode falar, ler e escrever Comum e Primordial. Primordial é um idioma gutural, cheio de sílabas ásperas e consoantes duras.",
      },
      {
        name: "Sub-raça",
        description:
          "Quatro sub-raças maiores de genasi são encontradas entre os mundos de D&D: genasi da água, genasi da terra, genasi do ar e genasi do fogo. Escolha uma dessas sub-raças.",
      },
    ],
    subraces: [
      {
        id: "genasi-da-agua",
        name: "Genasi da Água",
        abilityBonuses: { wis: 1 },
        traits: [
          { name: "Resistência a Ácido", description: "Você tem resistência a dano de ácido." },
          { name: "Anfíbio", description: "Você pode respirar ar e água." },
          {
            name: "Natação",
            description: "Você tem deslocamento de natação de 9 metros.",
          },
          {
            name: "Chamas as Ondas",
            description:
              "Você conhece o truque moldar água (veja no Compêndio de Magias). Quando você alcançar o 3° nível, você pode conjurar a magia criar ou destruir água uma vez com esse traço como uma magia de 2° nível, sem necessidade de componentes materiais, e você recupera a habilidade de conjurar dessa forma quando você termina um descanso longo. Sua habilidade de conjuração para essa magia é Constituição.",
          },
        ],
      },
      {
        id: "genasi-da-terra",
        name: "Genasi da Terra",
        abilityBonuses: { str: 1 },
        traits: [
          {
            name: "Caminhada Terrestre",
            description:
              "Você pode se mover através de terreno difícil feito de terra ou pedra sem gastar movimento extra.",
          },
          {
            name: "Mesclar-se às Rochas",
            description:
              "Você pode conjurar a magia passos sem pegadas uma vez com esse traço, sem necessidade de componentes materiais, e você recupera a habilidade de conjurar dessa forma quando você termina um descanso longo. Sua habilidade de conjuração para essa magia é Constituição.",
          },
        ],
      },
      {
        id: "genasi-do-ar",
        name: "Genasi do Ar",
        abilityBonuses: { dex: 1 },
        traits: [
          {
            name: "Fôlego Interminável",
            description:
              "Você pode prender seu fôlego indefinidamente enquanto não estiver incapacitado.",
          },
          {
            name: "Misturar-se ao Vento",
            description:
              "Você pode conjurar a magia levitação uma vez com esse traço, sem necessidade de componentes materiais e você recupera a habilidade de conjurar dessa forma quando termina um descanso longo. Sua habilidade de conjuração para essa magia é Constituição.",
          },
        ],
      },
      {
        id: "genasi-do-fogo",
        name: "Genasi do Fogo",
        abilityBonuses: { int: 1 },
        traits: [
          {
            name: "Visão no Escuro",
            description:
              "Você pode ver na penumbra a até 18 metros de você como se fosse luz plena e na escuridão como se fosse penumbra. Seus laços com o Plano Elemental do Fogo tornam sua visão no escuro incomum: tudo que você vê no escuro está em tons de vermelho.",
          },
          { name: "Resistência a Fogo", description: "Você tem resistência a dano de fogo." },
          {
            name: "Alcançar as Chamas",
            description:
              "Você conhece o truque criar chamas. Quando você alcançar o 3° nível, você pode conjurar a magia mãos flamejantes uma vez com esse traço como uma magia de 1° nível, sem necessidade de componentes materiais, e você recupera a habilidade de conjurar dessa forma quando você termina um descanso longo. Sua habilidade de conjuração para essa magia é Constituição.",
          },
        ],
      },
    ],
  },

  // ───────────────────────── AARAKOCRA ─────────────────────────
  {
    id: "aarakocra",
    name: "Aarakocra",
    summary:
      "Povo-pássaro originário do Plano Elemental do Ar, que vive nos céus, ama a paz e a solidão e voa desde o 1° nível.",
    abilityBonuses: { dex: 2, wis: 1 },
    age: "Um aarakocra atinge a maturidade aos 3 anos. Comparado com humanos, um aarakocra geralmente não vive mais de 30 anos.",
    alignment:
      "A maioria dos aarakocra são bons e raramente escolhem lados em se tratando de ordem e caos. Líderes tribais e guerreiros podem ser leais, enquanto que exploradores e aventureiros podem tender a serem caóticos.",
    size: "Médio",
    sizeNote:
      "Os aarakocra tem aproximadamente 1,5 metro de altura. Eles tem corpos magros e leves que pesam entre 40 e 50 quilos.",
    speed: 7.5,
    languages: ["Comum", "Aarakocra", "Auran"],
    traits: [
      {
        name: "Deslocamento",
        description: "Seu deslocamento base de caminhada é 7,5 metros.",
      },
      {
        name: "Voo",
        description:
          "Você tem deslocamento de voo de 15 metros. Para usar esse deslocamento, você não pode estar vestindo armadura média ou pesada.",
      },
      {
        name: "Garras",
        description: "Você tem garras que causam 1d4 de dano cortante ao atingirem.",
      },
      {
        name: "Idiomas",
        description: "Você pode falar, ler e escrever Comum, Aarakocra e Auran.",
      },
      {
        name: "Observação do Mestre",
        description:
          "Ser capaz de voar em altas velocidades desde o 1° nível é excepcionalmente eficiente em determinadas circunstâncias e excessivamente perigoso em outras. Como resultado, jogar com um aarakocra requer considerações especiais do seu Mestre.",
      },
    ],
    subraces: [],
  },

  // ───────────────────────── GOLIAS ─────────────────────────
  {
    id: "golias",
    name: "Golias",
    summary:
      "Nômades reclusos dos picos mais altos, de corpos que parecem esculpidos em rocha, competitivos e autossuficientes.",
    abilityBonuses: { str: 2, con: 1 },
    age: "Os golias tem uma expectativa de vida compatível com a dos humanos. Eles chegam a idade adulta no fim da adolescência, por volta dos 18 anos, e geralmente vivem menos de um século.",
    alignment:
      "A sociedade dos golias, com seus papéis e tarefas bem definidos, tem uma forte inclinação à ordem. O sentido de justiça dos golias, equilibrado com uma ênfase na autossuficiência e responsabilidade pessoal, os impele à neutralidade.",
    size: "Médio",
    sizeNote: "Os golias tem entre 2,10 e 2,40 metros e pesam entre 140 e 170 quilos.",
    speed: 9,
    languages: ["Comum", "Gigante"],
    traits: [
      { name: "Deslocamento", description: "Seu deslocamento base de caminhada é 9 metros." },
      { name: "Atleta Natural", description: "Você tem proficiência na perícia Atletismo." },
      {
        name: "Resistência da Pedra",
        description:
          "Você pode se focar para ocasionalmente reduzir um ferimento. Quando você sofrer dano, você pode usar sua reação para rolar um d12. Adicione seu modificador de Constituição ao valor rolado e reduza o dano por esse resultado. Após usar esse traço, você não poderá usá-lo novamente até terminar um descanso curto ou longo.",
      },
      {
        name: "Compleição Poderosa",
        description:
          "Você é considerado como de uma categoria de tamanho maior para determinar sua capacidade de carga e o peso que você pode empurrar, arrastar ou erguer.",
      },
      {
        name: "Nascido nas Montanhas",
        description:
          "Você está aclimatado a altas altitudes, incluindo elevações acima de 6.000 metros. Você também é naturalmente adaptado a climas frios, como descrito no capítulo 5 do Guia do Mestre.",
      },
      {
        name: "Idiomas",
        description: "Você pode falar, ler e escrever Comum e Gigante.",
      },
    ],
    proficiencies: { skills: ["atletismo"] },
    subraces: [],
  },
];

export const getRace = (id: string) => RACES.find((r) => r.id === id);
