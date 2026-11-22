// Subclasses extras de D&D 5e (PT-BR): XGtE, TCoE, Volo, SCAG, Guildmasters, Eberron, Wildemount,
// Fizban, Van Richten, Strixhaven, Spelljammer, Dragonlance e DMG. Complementa classes-a/classes-b.
// Chave = id da classe. Integrar ao campo `subclasses` de cada classe.
import type { ClassFeature, Subclass } from "../types";

const f = (level: number, name: string, description: string): ClassFeature => ({ level, name, description });

export const SUBCLASSES_EXTRA: Record<string, Subclass[]> = {
  // =========================================================================
  barbaro: [
    {
      id: "guardiao-ancestral",
      name: "Caminho do Guardião Ancestral",
      level: 3,
      description:
        "Alguns bárbaros invocam os espíritos de seus ancestrais guerreiros para proteger os vivos. Em fúria, esses espíritos surgem como figuras fantasmagóricas que defendem seus aliados e punem os inimigos. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Protetores Ancestrais", "A partir do 3º nível, enquanto estiver em fúria, o primeiro alvo que você atingir com um ataque com arma em cada turno tem desvantagem em jogadas de ataque contra qualquer criatura que não seja você até o início do seu próximo turno, e, se a criatura atacar um aliado seu, esse aliado tem resistência ao dano do ataque."),
        f(6, "Escudo Espiritual", "A partir do 6º nível, se você estiver em fúria e uma criatura a até 9 metros de você sofrer dano, você pode usar sua reação para reduzir esse dano em 2d6. Esse dano aumenta para 3d6 no 10º nível e 4d6 no 14º nível."),
        f(10, "Consultar os Espíritos", "No 10º nível, você ganha a capacidade de consultar seus espíritos ancestrais. Você pode conjurar adivinhação ou augúrio, sem gastar espaço de magia nem componentes materiais. Após conjurar uma das duas, você não pode usar esta característica novamente até terminar um descanso curto ou longo. Sua habilidade de conjuração para essas magias é Sabedoria."),
        f(14, "Barreira Vingativa", "A partir do 14º nível, os espíritos guardiões se tornam vingativos. Quando você usar Escudo Espiritual para reduzir o dano de um ataque, o atacante sofre uma quantidade de dano de energia igual ao dano que seu Escudo Espiritual evitou."),
      ],
    },
    {
      id: "arauto-da-tempestade",
      name: "Caminho do Arauto da Tempestade",
      level: 3,
      description:
        "Bárbaros desse caminho emanam uma aura tempestuosa quando em fúria, canalizando o poder bruto da natureza (deserto, mar ou tundra). Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Aura de Tempestade", "A partir do 3º nível, enquanto em fúria, você emana uma aura de 3 metros de raio. Escolha entre Deserto (dano de fogo igual a 2 em criaturas na aura no início do seu turno, aumentando com o nível), Mar (uma criatura à sua escolha na aura faz teste de resistência de Destreza e sofre dano elétrico, ou metade se passar) ou Tundra (você concede pontos de vida temporários às criaturas escolhidas na aura). Você escolhe o ambiente cada vez que entra em fúria e a aura se ativa com uma ação bônus."),
        f(6, "Alma Tempestuosa", "No 6º nível, a tempestade lhe concede benefícios mesmo fora de fúria, conforme o ambiente escolhido: Deserto (resistência a fogo e queima objetos inflamáveis), Mar (respirar debaixo d'água e deslocamento de natação de 9 metros) ou Tundra (resistência a frio e congela água não-mágica ao toque)."),
        f(10, "Proteção Tempestuosa", "No 10º nível, você ganha imunidade ao dano concedido pelo seu ambiente: fogo (Deserto), elétrico (Mar) ou frio (Tundra), mais um benefício adicional enquanto em fúria."),
        f(14, "Fúria da Tempestade", "No 14º nível, a aura se torna mais devastadora, com um efeito de reação (Deserto: dano de fogo ao atacante; Mar: derruba atacante; Tundra: reduz deslocamento) contra quem o atingir com ataque corpo a corpo enquanto em fúria."),
      ],
    },
    {
      id: "fanatico",
      name: "Caminho do Fanático",
      level: 3,
      description:
        "Guerreiros sagrados cuja fúria é uma resposta divina, ardendo com o poder de um deus da batalha. Mesmo a morte é apenas um obstáculo temporário. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Fúria Divina", "A partir do 3º nível, enquanto em fúria, a primeira criatura que você atingir em cada um de seus turnos com um ataque com arma sofre dano adicional igual a 1d6 + metade do seu nível de bárbaro (arredondado para baixo). O dano é necrótico ou radiante, à sua escolha."),
        f(3, "Guerreiro dos Deuses", "No 3º nível, se uma magia que restaure vida (como ressurreição) for conjurada sobre você, ela não requer componentes materiais."),
        f(6, "Foco Fanático", "A partir do 6º nível, uma vez por fúria, se você falhar em um teste de resistência, você pode rolá-lo novamente e usar o novo resultado."),
        f(10, "Presença Zelosa", "No 10º nível, você pode usar uma ação bônus para gritar uma prece de guerra. Até 10 criaturas à sua escolha a até 18 metros têm vantagem em jogadas de ataque e testes de resistência até o início do seu próximo turno. Você não pode usar novamente até terminar um descanso longo, a menos que gaste um uso de fúria."),
        f(14, "Fúria Além da Morte", "A partir do 14º nível, enquanto estiver em fúria, ter 0 pontos de vida não o faz cair inconsciente. Você ainda precisa fazer testes de resistência contra a morte e sofre falhas normalmente, mas não morre por falhas enquanto a fúria durar. Se terminar a fúria com 0 PV, você sofre os efeitos normais."),
      ],
    },
    {
      id: "besta",
      name: "Caminho da Besta",
      level: 3,
      description:
        "Bárbaros que canalizam uma fera interior, manifestando garras, mandíbulas ou cauda quando entram em fúria. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Forma da Besta", "A partir do 3º nível, ao entrar em fúria você pode transformar seu corpo, escolhendo uma das opções: Mordida (ataque desarmado de 1d8 perfurante; você recupera PV ao reduzir um inimigo ferido a zero PV ou críticos), Garras (ataques desarmados de 1d6 cortante, com um ataque adicional ao atacar) ou Cauda (alcance 3 m, 1d8 perfurante; reação para aumentar sua CA em 1d8 contra um ataque)."),
        f(6, "Alma Bestial", "No 6º nível, seus ataques naturais contam como mágicos. Além disso, você pode escolher um benefício ao terminar um descanso: Nadar (deslocamento de natação), Escalar (deslocamento de escalada) ou Salto (salto aumentado)."),
        f(10, "Fúria Infecciosa", "No 10º nível, quando atingir uma criatura com seu ataque natural, você pode forçá-la a um teste de resistência de Sabedoria; em falha, ela sofre 2d12 de dano psíquico ou deve usar a reação para atacar outra criatura. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(14, "Chamar a Caçada", "No 14º nível, quando você entra em fúria, você pode chamar a matilha: seus aliados a até 9 metros ganham PV temporários e causam 1d6 de dano adicional de sua escolha (necrótico ou perfurante) até o fim da fúria. Uma vez por descanso longo."),
      ],
    },
    {
      id: "magia-selvagem-barbaro",
      name: "Caminho da Magia Selvagem",
      level: 3,
      description:
        "A fúria desses bárbaros é uma torrente de magia selvagem que se manifesta de formas imprevisíveis, ligada a uma fonte primal do multiverso. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Sentido Mágico", "No 3º nível, você pode usar uma ação para abrir sua consciência para forças mágicas. Até o final do seu próximo turno, você sabe a localização de qualquer magia ou item mágico a até 18 metros e a escola de magia deles. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(3, "Surto Selvagem", "No 3º nível, ao entrar em fúria, role um d8 na tabela de Surtos Selvagens: efeitos como pulso necrótico, teletransporte, espírito de arma, aura de luz, explosão de flores, entre outros. O efeito dura enquanto a fúria durar (ou é instantâneo)."),
        f(6, "Magia Reforçadora", "No 6º nível, como ação, você toca uma criatura e a fortalece com magia selvagem: ela adiciona 1d3 em uma jogada de ataque ou teste de habilidade uma vez, ou você recupera um espaço de magia de 1º nível se tiver. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(10, "Retorno Instável", "No 10º nível, quando você sofre dano ou falha em um teste de resistência enquanto em fúria, você pode usar a reação para rolar novamente na tabela de Surtos Selvagens, escolhendo o novo efeito."),
        f(14, "Surto Controlado", "No 14º nível, quando você rolar na tabela de Surtos Selvagens, você pode rolar duas vezes e escolher qual dos dois resultados usar."),
      ],
    },
    {
      id: "gigante",
      name: "Caminho do Gigante",
      level: 3,
      description:
        "Bárbaros que canalizam a força dos gigantes, crescendo em tamanho e arremessando criaturas e objetos com poder titânico. Fonte: Bigby Presents: Glory of the Giants.",
      features: [
        f(3, "Poder dos Gigantes", "No 3º nível, quando você entra em fúria, escolha uma energia gigante (frio, fogo, relâmpago, etc.). Seu dano de fúria vira dano dessa energia e você ganha aprendizado de Giganteco. Você também pode aumentar de tamanho enquanto em fúria."),
        f(3, "Arremesso de Gigante", "No 3º nível, você pode arremessar criaturas ou objetos. Armas com a propriedade arremesso ganham alcance maior e dano adicional do dado de fúria."),
        f(6, "Tamanho de Colosso", "No 6º nível, quando entra em fúria, seu tamanho aumenta uma categoria e seu alcance corpo a corpo cresce 1,5 metro."),
        f(10, "Impulso Titânico", "No 10º nível, você pode usar uma ação bônus para arremessar uma criatura Grande ou menor que você esteja agarrando, causando dano de esmagamento (2d8 + modificador de Força) a ela e às que atingir."),
        f(14, "Fúria Titânica", "No 14º nível, a energia gigante irrompe de você, causando dano em área quando você entra em fúria."),
      ],
    },
  ],

  // =========================================================================
  bardo: [
    {
      id: "colegio-do-glamour",
      name: "Colégio do Glamour",
      level: 3,
      description:
        "Os bardos do Colégio do Glamour dominam a magia ensinada pelos feéricos, usando-a para encantar, inspirar e tornar-se irresistíveis. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Magia Cativante", "A partir do 3º nível, você pode usar uma ação bônus e gastar um uso de Inspiração de Bardo para deixar até um número de criaturas igual ao seu modificador de Carisma enfeitiçadas ou amedrontadas por 1 minuto, caso falhem em um teste de resistência de Sabedoria. Quando as criaturas não são hostis a você, o efeito inclui vantagem em testes de Carisma contra você."),
        f(3, "Manto de Inspiração", "No 3º nível, você pode gastar uma ação bônus e um uso de Inspiração de Bardo para conceder pontos de vida temporários a até um número de aliados igual ao seu modificador de Carisma (mínimo 1), igual a 5 + o dado de inspiração rolado, e eles podem usar a reação para se mover sem provocar ataques de oportunidade."),
        f(6, "Manto de Majestade", "No 6º nível, você ganha a capacidade de conjurar comando como uma ação bônus, sem gastar espaço de magia. Ao fazê-lo, você assume uma aparência de beleza sobrenatural por 1 minuto, e pode usar uma ação bônus em seus turnos para conjurar comando novamente sem espaço de magia. Uma vez por descanso longo."),
        f(14, "Majestade Inquebrável", "No 14º nível, como ação bônus, você assume uma aparência majestosa por 1 minuto. Durante esse tempo, a primeira criatura que o atacar em um turno faz um teste de resistência de Carisma contra sua CD de magia; em falha, perde o ataque e a ação. Em sucesso, é imune a esse efeito por 24 h. Uma vez por descanso curto ou longo."),
      ],
    },
    {
      id: "colegio-das-espadas",
      name: "Colégio das Espadas",
      level: 3,
      description:
        "Bardos que combinam exibição marcial e arte performática, atuando como lutadores artísticos ou entretenimento em eventos sangrentos. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Proficiências Bônus", "No 3º nível, você ganha proficiência com armaduras médias e com a cimitarra. Você pode usar uma arma com a qual tenha proficiência como foco de conjuração."),
        f(3, "Estilo de Luta", "No 3º nível, escolha o estilo Duelismo ou Combate com Duas Armas."),
        f(3, "Floreio de Combate", "No 3º nível, você aprende a gastar Inspiração de Bardo para adicionar efeitos aos seus ataques: Floreio Defensivo (aumenta CA), Floreio Cortante (dano a outra criatura) ou Floreio Móvel (empurra o alvo)."),
        f(6, "Ataque Extra", "No 6º nível, você pode atacar duas vezes, ao invés de uma, sempre que realizar a ação de Atacar no seu turno."),
        f(14, "Floreio Mestre", "No 14º nível, sempre que usar um Floreio de Combate, você pode rolar um d6 ao invés de gastar um dado de Inspiração de Bardo."),
      ],
    },
    {
      id: "colegio-dos-sussurros",
      name: "Colégio dos Sussurros",
      level: 3,
      description:
        "Bardos que usam segredos e medo como armas, atuando como espiões, extorsionários ou assassinos disfarçados de artistas. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Lâminas Psíquicas", "No 3º nível, quando você atingir uma criatura com um ataque com arma, pode gastar um uso de Inspiração de Bardo para causar dano psíquico adicional: 2d6, aumentando com o nível (3d6 no 5º, 5d6 no 10º, 8d6 no 15º)."),
        f(3, "Palavras de Terror", "No 3º nível, você pode falar em particular com uma criatura por 1 minuto, e ela faz um teste de resistência de Sabedoria. Em falha, fica amedrontada de você ou de outra criatura de sua escolha até o final de 1 hora. Uma vez por descanso curto ou longo."),
        f(6, "Mantos de Sussurros", "No 6º nível, quando uma criatura humanoide morre a até 9 metros de você, você pode usar sua reação para capturar sua sombra, assumindo sua forma por 1 hora e acessando suas lembranças superficiais. Usos igual ao seu bônus de proficiência ou 1 com Inspiração de Bardo."),
        f(14, "Sombra do Medo", "No 14º nível, você pode usar uma ação bônus para gastar Inspiração de Bardo e ver a maior ansiedade de uma criatura, impondo o efeito de amedrontado e dano psíquico em testes de resistência de Sabedoria falhos."),
      ],
    },
    {
      id: "colegio-da-criacao",
      name: "Colégio da Criação",
      level: 3,
      description:
        "Os bardos desse colégio acreditam que o universo foi cantado a existir em uma Canção da Criação, da qual ainda ecoam fragmentos. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Mote de Potencial", "No 3º nível, ao conceder Inspiração de Bardo a uma criatura, você pode atribuir-lhe um mote: Proteção (PV temporários ao rolar o dado), Ímpeto (aumenta o dano ou testes de característica) ou Ressonância (outra criatura próxima é afetada)."),
        f(3, "Performance da Criação", "No 3º nível, como ação, você pode criar um item não-mágico em um espaço desocupado a até 3 metros. O objeto vale até 20 vezes seu nível de bardo em PO, dura uma hora e é de tamanho até Médio. Uma vez por descanso longo (gasta espaço de magia para mais)."),
        f(6, "Animando Desempenho", "No 6º nível, você pode usar uma ação para animar um objeto Grande ou menor por um minuto, transformando-o em um Objeto Dançante que obedece suas ordens. Uma vez por descanso longo."),
        f(14, "Crescendo Criativo", "No 14º nível, quando usar Performance da Criação, você pode criar vários itens ao mesmo tempo (até seu modificador de Carisma) e o tamanho máximo aumenta de acordo com o seu nível."),
      ],
    },
    {
      id: "colegio-da-eloquencia",
      name: "Colégio da Eloquência",
      level: 3,
      description:
        "Bardos desse colégio dominam a oratória, a persuasão e as palavras que movem corações, derrubam tronos ou unem reinos. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Língua de Prata", "No 3º nível, ao fazer um teste de Persuasão ou Enganação, você trata qualquer resultado de d20 de 9 ou menos como 10."),
        f(3, "Palavras Inquietantes", "No 3º nível, como ação bônus, você pode gastar uma Inspiração de Bardo para sussurrar palavras a uma criatura a até 9 metros, impondo uma penalidade igual ao dado de inspiração rolado no próximo teste de resistência dela antes do início do seu próximo turno."),
        f(6, "Discurso Inspirador Infalível", "No 6º nível, se um aliado falhar em um teste de característica, ataque ou resistência após usar seu dado de Inspiração de Bardo, você não perde o dado."),
        f(6, "Discurso Universal", "No 6º nível, como ação, você pode escolher até seu modificador de Carisma em criaturas a até 18 metros: elas compreendem sua fala por 1 hora, independentemente do idioma. Uma vez por descanso longo."),
        f(14, "Inspiração Contagiante", "No 14º nível, quando você concede Inspiração de Bardo a uma criatura, ela pode conceder a outra criatura a até 18 metros, sem custo, até seu modificador de Carisma vezes por descanso longo."),
      ],
    },
    {
      id: "colegio-dos-espiritos",
      name: "Colégio dos Espíritos",
      level: 3,
      description:
        "Bardos que dominam histórias de fantasmas e almas inquietas, canalizando espíritos para revelar segredos e conceder bênçãos. Fonte: Van Richten's Guide to Ravenloft.",
      features: [
        f(3, "Orientação Espiritual", "No 3º nível, você ganha um foco espiritual (um objeto que seja de uma criatura morta) e aprende o truque orientação espiritual. Ao conjurar com ele, você adiciona 1d6 ao dano ou à cura."),
        f(3, "Contos do Além", "No 3º nível, como ação bônus, você gasta um uso de Inspiração de Bardo, rolando um dado: uma criatura a até 9 metros sofre um efeito aleatório da Tabela de Contos Espirituais (curar PV, dano psíquico, vantagem, teletransporte, invisibilidade, etc.)."),
        f(6, "Sessão Espiritual", "No 6º nível, você pode, como ritual, conjurar adivinhação ou falar com os mortos usando o foco espiritual, sem componentes."),
        f(6, "Contos Aprimorados", "No 6º nível, ao rolar na tabela de Contos Espirituais, você rola 2d6 e escolhe um efeito."),
        f(14, "Conexão Mística", "No 14º nível, quando você rolar na Tabela de Contos do Além, você rola duas vezes e escolhe, e o espírito pode possuir temporariamente uma criatura (usando Possessão Mística)."),
      ],
    },
  ],

  // =========================================================================
  bruxo: [
    {
      id: "celestial",
      name: "O Celestial",
      level: 1,
      description:
        "Seu patrono é uma criatura de planos superiores, como um anjo, unicórnio ou fênix. Esse poder concede dons de cura e luz. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(1, "Magias Adicionais", "Magias de patrono, sempre preparadas ao ter acesso a espaços do nível: 1º cura ferimentos, raio guiado; 2º restauração menor, esfera flamejante; 3º luz do dia, revivificar; 4º guardião da fé, muralha de fogo; 5º golpe flamejante, restauração maior. Elas contam como magias de bruxo, mas não contam no limite de magias conhecidas."),
        f(1, "Truques Bônus", "No 1º nível, você aprende os truques luz e chama sagrada."),
        f(1, "Luz Curativa", "No 1º nível, você ganha a capacidade de curar com uma ação bônus. Você tem um número de d6 igual a 1 + seu nível de bruxo; ao usar, rola um número de dados até o seu modificador de Carisma (mínimo 1) e restaura PV a uma criatura a até 18 metros igual à soma. Recupera todos os dados em um descanso longo."),
        f(6, "Alma Radiante", "No 6º nível, você ganha resistência a dano radiante, e quando causar dano radiante ou de fogo com uma magia, adiciona seu modificador de Carisma ao dano de um alvo."),
        f(10, "Resiliência Celestial", "No 10º nível, você ganha PV temporários sempre que terminar um descanso curto ou longo: igual ao seu nível de bruxo + seu modificador de Carisma. Além disso, até cinco criaturas à sua escolha ganham metade dessa quantidade."),
        f(14, "Vingança Calcinante", "No 14º nível, quando você ou um aliado a até 9 metros estiver com 0 PV, você pode usar uma reação para ressurgir em chamas, recuperando PV até metade do seu máximo, e emitindo uma explosão radiante que causa 2d8 + seu modificador de Carisma de dano a criaturas escolhidas. Uma vez por descanso longo."),
      ],
    },
    {
      id: "lamina-maldita",
      name: "A Lâmina Maldita",
      level: 1,
      description:
        "Seu patrono é uma entidade misteriosa ligada às Sombras, com um pacto ligado a armas místicas forjadas na Plano das Sombras. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(1, "Magias Adicionais", "Magias de patrono: 1º escudo, golpe colérico; 2º névoa, golpe marcador; 3º piscar, arma elemental; 4º assassino fantasmagórico, golpe cambaleante; 5º golpe banidor, cone de frio. Contam como magias de bruxo, mas não no limite de magias conhecidas."),
        f(1, "Maldição da Lâmina Maldita", "No 1º nível, como ação bônus, você amaldiçoa uma criatura que possa ver a até 9 metros. A maldição dura 1 minuto. Você ganha bônus no dano igual ao seu bônus de proficiência, crítico em 19 ou 20, e recupera PV igual ao seu nível de bruxo + seu modificador de Carisma quando o alvo morre. Uma vez por descanso curto ou longo."),
        f(1, "Guerreiro Amaldiçoado", "No 1º nível, você ganha proficiência com armaduras médias, escudos e armas marciais."),
        f(1, "Arma Amaldiçoada", "No 1º nível, você pode usar Carisma ao invés de Força ou Destreza em ataques com armas e dano com sua arma de pacto."),
        f(6, "Espectro Amaldiçoado", "No 6º nível, quando você mata um humanoide, você pode invocar seu espírito como um espectro que serve você até o fim do próximo descanso longo."),
        f(10, "Armadura Amaldiçoada", "No 10º nível, quando um atacante o atingir com um ataque, você pode usar uma reação para forçar o atacante a ter desvantagem no ataque."),
        f(14, "Mestre da Maldição", "No 14º nível, você pode ressuscitar com PV após morrer quando seu alvo amaldiçoado cai a 0 PV."),
      ],
    },
    {
      id: "insondavel",
      name: "O Insondável",
      level: 1,
      description:
        "Seu patrono é uma entidade de grandes profundezas oceânicas, como um kraken ou uma criatura abissal, concedendo poder das águas e das trevas. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias Adicionais", "Magias de patrono: 1º criar ou destruir água, onda trovejante; 2º rajada de vento, silêncio; 3º relâmpago, nevasca; 4º controlar água, invocar aberração; 5º mão de Bigby, cone de frio."),
        f(1, "Tentáculo das Profundezas", "No 1º nível, como ação bônus, você pode conjurar um tentáculo espectral a até 18 metros que ataca uma criatura, causando 1d8 de dano de frio e reduzindo seu deslocamento em 3 metros. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(6, "Presente do Mar", "No 6º nível, você ganha deslocamento de natação de 12 metros e pode respirar debaixo d'água."),
        f(10, "Oceano na Alma", "No 10º nível, você ganha resistência a dano de frio e pode se comunicar telepaticamente com criaturas que respirem água."),
        f(14, "Canção das Profundezas", "No 14º nível, você pode impor um efeito de aprisionamento: alvos próximos fazem teste de resistência e podem ser forçados a se mover, sofrendo dano de frio e ficando afogados."),
      ],
    },
    {
      id: "genio",
      name: "O Gênio",
      level: 1,
      description:
        "Seu patrono é um gênio nobre (dao, djinni, efreeti ou marid), cujo poder ilumina você com dons do plano elemental correspondente. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias Adicionais", "Magias de patrono: 1º detectar o bem e o mal; 2º força fantasmagórica; 3º criar alimento e água; 4º assassino fantasmagórico; 5º criação; além de uma magia extra de 1º nível conforme o tipo de gênio (marid: cura de ferimentos; efreeti: mãos flamejantes; dao: pedra encantada; djinni: pasmo/onda trovejante)."),
        f(1, "Frasco do Gênio", "No 1º nível, você ganha um recipiente mágico onde o gênio reside, no qual você pode entrar com uma ação bônus por um número de horas igual ao seu bônus de proficiência, ou usá-lo como foco de conjuração."),
        f(1, "Vingança do Gênio", "No 1º nível, quando você usa o frasco, você pode causar dano elemental adicional a uma criatura que atingir (bônus de proficiência por descanso longo)."),
        f(6, "Refúgio Elemental", "No 6º nível, você pode escolher um bônus elemental (resistência a dano de acordo com o gênio) e invocar o frasco como refúgio em perigo."),
        f(10, "Resistência Elemental", "No 10º nível, você ganha resistência a um tipo de dano elemental, e pode compartilhá-la com um aliado."),
        f(14, "Desejos Limitados", "No 14º nível, você pode conceder um desejo limitado a um aliado, conjurando efeitos como a magia desejo em escala limitada (uma vez por 1d4 dias de descanso longo)."),
      ],
    },
    {
      id: "morto-vivo",
      name: "O Morto-vivo",
      level: 1,
      description:
        "Seu patrono é uma criatura morta-viva antiga, como um lich, vampiro ou espectro, que lhe concede poder necrótico e resistência a dano. Fonte: Van Richten's Guide to Ravenloft.",
      features: [
        f(1, "Magias Adicionais", "Magias de patrono: 1º perdição, vida falsa; 2º cegueira/surdez, força fantasmagórica; 3º montaria fantasmagórica, falar com os mortos; 4º proteção contra a morte, porta dimensional; 5º animar mortos, imobilizar monstro."),
        f(1, "Forma de Dread", "No 1º nível, como ação bônus, você assume uma forma assustadora por 1 minuto: você ganha PV temporários igual a 1d10 + nível de bruxo, e criaturas a até 3 metros devem fazer teste de resistência de Sabedoria ou ficam amedrontadas. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(6, "Resistência Mortal", "No 6º nível, você ganha resistência a dano necrótico, e imunidade a doenças e ser amedrontado quando em Forma de Dread."),
        f(10, "Aura de Mortalha", "No 10º nível, enquanto em Forma de Dread, criaturas ao seu redor sofrem dano necrótico quando iniciam seu turno."),
        f(14, "Fúria Sepulcral", "No 14º nível, quando você reduzir uma criatura a 0 PV em Forma de Dread, você pode mover-se ou atacar novamente."),
      ],
    },
  ],

  // =========================================================================
  clerigo: [
    {
      id: "forja",
      name: "Domínio da Forja",
      level: 1,
      description:
        "Os deuses da forja são patronos de artesãos e ferreiros, que valorizam a criatividade, o trabalho duro e a perfeição do ofício. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(1, "Magias de Domínio", "Magias sempre preparadas: 1º identificação, golpe ardente; 3º metal quente, arma mágica; 5º arma elemental, proteção contra energia; 7º fabricar, muralha de fogo; 9º animar objetos, criação."),
        f(1, "Proficiência Bônus", "No 1º nível, você ganha proficiência com armaduras pesadas e ferramentas de ferreiro."),
        f(1, "Bênção do Ferreiro", "No 1º nível, ao terminar um descanso longo, você pode tocar uma arma não-mágica ou armadura e conceder bônus +1 na jogada de ataque ou CA, durando até o próximo descanso longo."),
        f(2, "Canalizar Divindade: Bênção do Artesão", "No 2º nível, você pode usar Canalizar Divindade para criar um item de metal não-mágico (armadura, arma ou ferramenta de até 100 PO de valor) ou concedendo +1 temporário, ao longo de 1 hora de trabalho. O item é criado ou aprimorado e permanece até você terminar um descanso longo."),
        f(6, "Alma da Forja", "No 6º nível, você ganha resistência a dano de fogo e +1 na CA enquanto estiver usando armadura de metal."),
        f(8, "Golpe Divino", "No 8º nível, uma vez por turno, ao atingir uma criatura com um ataque com arma, você causa 1d8 de dano de fogo adicional, aumentando para 2d8 no 14º nível."),
        f(17, "Santo da Forja e do Fogo", "No 17º nível, você ganha imunidade a dano de fogo e, enquanto usar armadura de metal, resistência a dano contundente, cortante e perfurante de ataques não-mágicos."),
      ],
    },
    {
      id: "tumulo",
      name: "Domínio do Túmulo",
      level: 1,
      description:
        "Os deuses do túmulo supervisionam o ciclo da vida e da morte, protegendo as almas e punindo aqueles que desafiam a ordem natural. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(1, "Magias de Domínio", "Magias sempre preparadas: 1º perdição, vida falsa; 3º descanso tranquilo, raio do enfraquecimento; 5º revivificar, toque vampírico; 7º definhar, proteção contra a morte; 9º concha antivida, reviver os mortos."),
        f(1, "Círculo da Mortalidade", "No 1º nível, quando você usar uma magia de cura numa criatura com 0 PV, você a cura com o máximo de dados. Você também aprende o truque toque macabro."),
        f(1, "Olhos do Túmulo", "No 1º nível, você pode usar uma ação para detectar mortos-vivos a até 18 metros. Usos igual ao seu modificador de Sabedoria (mínimo 1) por descanso longo."),
        f(2, "Canalizar Divindade: Caminho do Túmulo", "No 2º nível, como ação, você escolhe uma criatura a até 9 metros: até o início do seu próximo turno, ela se torna vulnerável a todo dano da próxima fonte que a atingir (seu ataque ou de um aliado), por 1 turno."),
        f(6, "Sentinela nos Portões da Morte", "No 6º nível, como reação, você pode transformar um acerto crítico contra você ou contra um aliado em um acerto normal. Usos igual ao seu modificador de Sabedoria."),
        f(8, "Golpe Divino", "No 8º nível, uma vez por turno, ao atingir uma criatura com um ataque com arma, você causa 1d8 de dano necrótico adicional, aumentando para 2d8 no 14º nível."),
        f(17, "Guardião das Almas", "No 17º nível, quando um inimigo morre a até 18 metros de você, você ou um aliado a até 18 metros recupera PV igual ao número de dados de vida do inimigo morto (uma vez por rodada)."),
      ],
    },
    {
      id: "ordem",
      name: "Domínio da Ordem",
      level: 1,
      description:
        "O domínio da Ordem representa a lei, a hierarquia e a obediência. Seus clérigos exercem autoridade moral e impõem a disciplina. Fonte: Guildmasters' Guide to Ravnica / Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias de Domínio", "Magias sempre preparadas: 1º comando, heroísmo; 3º imobilizar pessoa, zona da verdade; 5º cura em massa (palavra), lentidão; 7º compulsão, localizar criatura; 9º comunhão, dominar pessoa."),
        f(1, "Voz da Autoridade", "No 1º nível, quando você conjura uma magia com espaço de magia de 1º nível ou superior em um aliado, esse aliado pode usar a reação para fazer um ataque com arma."),
        f(1, "Proficiência Bônus", "No 1º nível, você ganha proficiência com armaduras pesadas e na perícia Intimidação ou Persuasão."),
        f(2, "Canalizar Divindade: Demanda da Ordem", "No 2º nível, como ação, você apresenta seu símbolo sagrado e cada criatura à sua escolha a até 9 metros que possa ver ou ouvir você faz um teste de resistência de Sabedoria. Em falha, fica enfeitiçada por você até o final do seu próximo turno; você pode causar dano psíquico igual a 2d6 + seu nível de clérigo."),
        f(6, "Encarnação da Lei", "No 6º nível, se você conjurar uma magia de encantamento de 1º nível ou superior, pode conjurá-la como ação bônus. Usos igual ao seu modificador de Sabedoria (mínimo 1) por descanso longo."),
        f(8, "Ira da Ordem", "No 8º nível, uma vez por turno, ao atingir uma criatura com um ataque com arma, você causa 1d8 de dano psíquico adicional, aumentando para 2d8 no 14º nível."),
        f(17, "Ira da Ordem Aprimorada", "No 17º nível, quando sua Demanda da Ordem enfeitiça criaturas, elas também ficam sujeitas a dano psíquico (2d6 + seu nível de clérigo) no turno em que ficarem enfeitiçadas."),
      ],
    },
    {
      id: "paz",
      name: "Domínio da Paz",
      level: 1,
      description:
        "O domínio da Paz promove a harmonia entre indivíduos e comunidades, vinculando aliados e curando divisões. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias de Domínio", "Magias sempre preparadas: 1º heroísmo, santuário; 3º auxílio, vínculo protetor; 5º sinal de esperança, mensagem; 7º aura de pureza, esfera resiliente de Otiluke; 9º restauração maior, vínculo telepático de Rary."),
        f(1, "Implemento de Paz", "No 1º nível, você ganha proficiência na perícia Intuição, Persuasão ou Atuação."),
        f(1, "Vínculo Emotivo", "No 1º nível, como ação bônus, você escolhe um número de criaturas voluntárias igual ao seu bônus de proficiência em 9 metros. Elas ficam vinculadas por 10 minutos: quando uma delas faz um teste, as outras podem usar a reação para adicionar 1d4. Usos igual ao bônus de proficiência."),
        f(2, "Canalizar Divindade: Bálsamo da Paz", "No 2º nível, como ação bônus, você usa Canalizar Divindade para que uma criatura a até 9 metros recupere 2d6 + seu modificador de Sabedoria PV por criatura vinculada, e também não provoca ataques de oportunidade."),
        f(6, "Vínculo Protetor", "No 6º nível, quando uma criatura vinculada a você sofrer dano, você pode usar sua reação para teletransportar-se para perto dela e reduzir o dano."),
        f(8, "Conjuração Potente", "No 8º nível, uma vez por turno, ao atingir uma criatura com um ataque com arma, você causa 1d8 de dano de energia adicional, aumentando para 2d8 no 14º nível."),
        f(17, "Vínculo Ampliado", "No 17º nível, o benefício de Vínculo Emotivo se amplia: aliados vinculados ganham resistência a todo dano quando você usa o Vínculo Protetor e aumenta o alcance de teletransporte."),
      ],
    },
    {
      id: "crepusculo",
      name: "Domínio do Crepúsculo",
      level: 1,
      description:
        "Os deuses do crepúsculo cuidam do tempo entre luz e escuridão, trazendo conforto e proteção durante a noite. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias de Domínio", "Magias sempre preparadas: 1º fogo feérico, sono; 3º raio de luar, ver invisibilidade; 5º aura de vitalidade, cabana de Leomund; 7º aura de vida, invisibilidade maior; 9º círculo de poder, enganar."),
        f(1, "Proficiências Bônus", "No 1º nível, você ganha proficiência com armas marciais e armaduras pesadas."),
        f(1, "Olhos da Noite", "No 1º nível, você tem visão no escuro de 90 metros e pode compartilhar esse benefício por 1 hora com um número de criaturas igual ao seu modificador de Sabedoria. Uma vez por descanso longo (ou gastando espaço de magia de 1º nível ou superior)."),
        f(1, "Bênção Vigilante", "No 1º nível, como ação, você pode conceder a uma criatura (incluindo você) um bônus de +5 na iniciativa. O efeito dura até que a criatura use o bônus."),
        f(2, "Canalizar Divindade: Santuário do Crepúsculo", "No 2º nível, como ação, você faz uma esfera de crepúsculo de 9 metros de raio centrada em você por 1 minuto. Ao final de cada turno de uma criatura na esfera, você escolhe: ela ganha 1d6 + seu nível de clérigo de PV temporários, ou termina um efeito de amedrontado ou enfeitiçado nela."),
        f(6, "Passos da Noite", "No 6º nível, como ação bônus, você ganha deslocamento de voo igual ao seu deslocamento terrestre por 1 minuto, enquanto estiver em luz fraca ou escuridão. Usos igual ao seu modificador de Sabedoria."),
        f(8, "Golpe Divino", "No 8º nível, você pode causar 1d8 de dano radiante adicional uma vez por turno em ataque com arma, aumentando para 2d8 no 14º nível."),
        f(17, "Manto do Crepúsculo", "No 17º nível, você e aliados dentro do Santuário do Crepúsculo ganham meia cobertura enquanto estiverem na esfera."),
      ],
    },
    {
      id: "morte",
      name: "Domínio da Morte",
      level: 1,
      description:
        "O domínio da Morte é voltado a deuses de morte, necromancia e do além, com ênfase em poder necrótico. Fonte: Dungeon Master's Guide.",
      features: [
        f(1, "Magias de Domínio", "Magias sempre preparadas: 1º vida falsa, raio nauseante; 3º cegueira/surdez, raio do enfraquecimento; 5º animar mortos, toque vampírico; 7º definhar, proteção contra a morte; 9º concha antivida, névoa mortal."),
        f(1, "Proficiência Bônus", "No 1º nível, você ganha proficiência com armas marciais."),
        f(1, "Ceifar", "No 1º nível, quando você conjura um truque de necromancia que causa dano em uma criatura, pode causar o mesmo dano a uma segunda criatura a até 1,5 metro da primeira. Você também aprende um truque de necromancia à sua escolha da lista de qualquer classe."),
        f(2, "Canalizar Divindade: Toque da Morte", "No 2º nível, quando você atinge uma criatura com um ataque corpo a corpo, pode usar Canalizar Divindade para causar 5 + 2x seu nível de clérigo de dano necrótico adicional."),
        f(6, "Destruição Inescapável", "No 6º nível, quando você causa dano necrótico a uma criatura, esse dano ignora resistência a dano necrótico."),
        f(8, "Golpe Divino", "No 8º nível, você pode causar 1d8 de dano necrótico adicional uma vez por turno em ataque com arma, aumentando para 2d8 no 14º nível."),
        f(17, "Ceifar Aprimorado", "No 17º nível, ao conjurar um truque de necromancia com Ceifar, você pode afetar um número maior de criaturas (até 2 adicionais) e o dano passa a ser máximo em vez de rolado."),
      ],
    },
  ],

  // =========================================================================
  druida: [
    {
      id: "circulo-dos-sonhos",
      name: "Círculo dos Sonhos",
      level: 2,
      description:
        "Druidas do Círculo dos Sonhos têm laços com a Corte do Crepúsculo e o Reino Feérico. Dedicam-se a curar, proteger e levar descanso e esperança. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(2, "Bálsamo da Corte de Verão", "No 2º nível, como ação bônus, você pode escolher uma criatura a até 36 metros e gastar dados do bálsamo (você tem um número de d6 igual ao seu nível de druida, restaurados em descanso longo; gasta até metade do seu nível de uma vez). A criatura recupera PV igual ao total rolado e ganha 1 PV temporário por dado gasto."),
        f(6, "Abrigo de Luz da Lua e Sombra", "No 6º nível, você cria uma esfera de 9 metros de raio durante um descanso curto ou longo: criaturas nela ganham cobertura de três quartos e +10 em testes de Furtividade, e você obtém benefícios adicionais, como visão do crepúsculo."),
        f(10, "Caminhos Ocultos", "No 10º nível, como ação bônus, você pode teletransportar-se 18 metros para um espaço visível, ou como ação, teletransportar uma criatura voluntária que tocar 9 metros. Usos igual ao seu modificador de Sabedoria por descanso longo."),
        f(14, "Andarilho dos Sonhos", "No 14º nível, ao terminar um descanso curto, você pode conjurar sonho, vidência ou círculo de teletransporte sem gastar espaço; para círculo de teletransporte, você chega ao local do último descanso longo. Uma vez por descanso longo."),
      ],
    },
    {
      id: "circulo-do-pastor",
      name: "Círculo do Pastor",
      level: 2,
      description:
        "Druidas do Círculo do Pastor comungam com os espíritos da natureza, em especial os espíritos das feras e dos feéricos, e invocam esses espíritos para ajudá-los. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(2, "Fala da Floresta", "No 2º nível, você aprende a falar Silvestre e a comunicar-se brevemente com bestas, que entendem o sentido geral do que você diz."),
        f(2, "Totem Espiritual", "No 2º nível, como ação bônus, você invoca um espírito totêmico a até 18 metros, criando um halo de 9 metros de raio por 1 minuto: Urso (PV temporários iguais a 5 + seu nível de druida e vantagem em testes de Força), Falcão (reação para dar vantagem em ataque a aliado; vantagem em Percepção) ou Unicórnio (vantagem em detectar criaturas; cura adicional em magias). Uma vez por descanso curto ou longo."),
        f(6, "Invocador Poderoso", "No 6º nível, bestas e feéricos que você invocar com magias de conjuração ganham 2 PV extras por Dado de Vida e seus ataques naturais contam como mágicos."),
        f(10, "Espírito Guardião", "No 10º nível, bestas ou feéricos invocados por você que terminem seu turno na aura do seu Totem Espiritual recuperam PV igual à metade do seu nível de druida."),
        f(14, "Invocação Fiel", "No 14º nível, se você for reduzido a 0 PV ou ficar incapacitado, você invoca automaticamente quatro bestas de ND 2 ou menor, que atuam como em conjurar animais por 1 hora e o protegem. Uma vez por descanso longo."),
      ],
    },
    {
      id: "circulo-dos-esporos",
      name: "Círculo dos Esporos",
      level: 2,
      description:
        "Druidas do Círculo dos Esporos encontram beleza no ciclo de decomposição e renovação, usando fungos para conjurar poderes e animar os mortos. Fonte: Guildmasters' Guide to Ravnica / Tasha's Cauldron.",
      features: [
        f(2, "Magias do Círculo", "Magias sempre preparadas: 3º cegueira/surdez, descanso tranquilo; 5º animar mortos, forma gasosa; 7º definhar, confusão; 9º névoa mortal, contágio."),
        f(2, "Halo de Esporos", "No 2º nível, você aprende o truque toque necrótico (ou toque macabro) e ganha Halo de Esporos: como reação, quando uma criatura que você possa ver se move para um espaço a até 3 metros de você ou começa o turno ali, ela faz um teste de resistência de Constituição ou sofre 1d4 de dano necrótico (1d6 no 6º, 1d8 no 10º, 1d10 no 14º). Em falha. Alternativamente, Halo de Esporos pode ser usado em vez de Forma Selvagem."),
        f(2, "Entidade Simbiótica", "No 2º nível, como ação, você gasta um uso de Forma Selvagem para infundir esporos em si: você ganha 4 PV temporários por nível de druida, ataques corpo a corpo com arma causam 1d6 de dano necrótico adicional, e o dano do Halo de Esporos é dobrado. Dura 10 minutos ou até seus PV temporários acabarem."),
        f(6, "Infestação Fúngica", "No 6º nível, quando uma besta ou humanoide morre a até 3 metros de você, você pode usar sua reação para animá-la como zumbi fúngico sob seu comando por 1 hora. Usos igual ao seu modificador de Sabedoria por descanso longo."),
        f(10, "Espalhando Esporos", "No 10º nível, como ação bônus, você espalha esporos em um cubo de 3 metros a até 9 metros de você por 1 minuto. Criaturas na área sofrem o dano do Halo de Esporos; enquanto Entidade Simbiótica estiver ativa, o dano é dobrado."),
        f(14, "Corpo Fúngico", "No 14º nível, você e criaturas afetadas por seus esporos ganham imunidade a cegueira, surdez, amedrontado, envenenado e acertos críticos viram acertos normais."),
      ],
    },
    {
      id: "circulo-das-estrelas",
      name: "Círculo das Estrelas",
      level: 2,
      description:
        "Druidas do Círculo das Estrelas buscam sabedoria nas constelações, canalizando o poder do firmamento. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(2, "Mapa Estelar", "No 2º nível, você cria um mapa estelar (foco druídico). Você aprende o truque raio guia e pode conjurar orientação como se o mapa fosse um foco; usos de raio guia sem gastar espaço de magia igual ao seu modificador de Sabedoria."),
        f(2, "Forma Estrelada", "No 2º nível, como ação bônus, você gasta um uso de Forma Selvagem para assumir uma forma estrelada e escolher uma constelação: Arqueiro (ataque à distância como ação bônus), Dragão (mínimo 10 em testes de Constituição, Inteligência e Sabedoria) ou Taça (cura adicional ao curar)."),
        f(6, "Presságio Cósmico", "No 6º nível, ao terminar um descanso longo, você obtém presságios: Prosperidade (adicionar 1d6 a testes), Desastre (subtrair 1d6) ou ambos, por um número de vezes igual ao seu bônus de proficiência."),
        f(10, "Constelações Cintilantes", "No 10º nível, a Forma Estrelada melhora: Dragão ganha voo, Arqueiro causa dano maior (2d8) e Taça cura mais. Você pode mudar de constelação no início de cada turno."),
        f(14, "Cheio de Estrelas", "No 14º nível, enquanto em Forma Estrelada, você ganha resistência a dano contundente, cortante e perfurante."),
      ],
    },
    {
      id: "circulo-do-fogo-selvagem",
      name: "Círculo do Fogo Selvagem",
      level: 2,
      description:
        "Druidas do Círculo do Fogo Selvagem veem o fogo como uma força de renovação, aceitando o ciclo de destruição e renascimento. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(2, "Magias do Círculo", "Magias sempre preparadas: 3º mãos flamejantes, curar ferimentos; 5º esfera flamejante, raio ardente; 7º crescimento de plantas, revivificar; 9º aura de vida, escudo de fogo."),
        f(2, "Invocar Espírito Selvagem", "No 2º nível, como ação, você gasta um uso de Forma Selvagem para invocar um espírito do fogo selvagem a até 9 metros: ele tem PV iguais a 5 + 5x seu nível de druida, CA 13 + prof., ataques à distância de 1d6 + prof. de fogo, e pode teletransportar você e aliados com sua ação bônus. Dura 1 hora."),
        f(6, "Vínculo Aprimorado", "No 6º nível, quando você conjura uma magia com dano de fogo ou cura, o espírito ou você pode adicionar 1d8 ao dano ou à cura. O espírito pode se teletransportar com aliados em seu alcance."),
        f(10, "Chamas Cauterizantes", "No 10º nível, como reação, quando uma criatura que você possa ver a até 9 metros do espírito morre, você pode forçar o espírito a liberar chamas curativas ou danosas: 2d10 + seu modificador de Sabedoria de dano de fogo ou cura a uma criatura à vista. Usos igual ao bônus de proficiência."),
        f(14, "Renascer em Chamas", "No 14º nível, se você for reduzido a 0 PV e seu espírito estiver a até 36 metros de você, o espírito é reduzido a 0 PV e você recupera PV iguais à metade do seu máximo, ressurgindo em chamas."),
      ],
    },
  ],

  // =========================================================================
  feiticeiro: [
    {
      id: "alma-divina",
      name: "Alma Divina",
      level: 1,
      description:
        "Sua magia é uma centelha divina, ligando-se às esferas superiores de um deus ou potência cósmica. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(1, "Magia Divina", "No 1º nível, sua lista de feiticeiro inclui magias de clérigo. Você também escolhe uma afinidade: Bem (curar ferimentos), Mal (infligir ferimentos), Ordem (bênção), Caos (perdição) ou Neutralidade (proteção contra o bem e o mal), e aprende essa magia."),
        f(1, "Favorecido pelos Deuses", "No 1º nível, se falhar em um teste de resistência ou errar um ataque, você pode adicionar 2d4 ao resultado, possivelmente transformando a falha em sucesso. Uma vez por descanso curto ou longo."),
        f(6, "Cura Empoderada", "No 6º nível, quando você conjurar uma magia de cura, pode gastar 1 ponto de feitiçaria para rolar novamente dados de cura de resultado 1."),
        f(14, "Asas Angélicas", "No 14º nível, como ação bônus, você pode fazer brotar asas que concedem deslocamento de voo de 9 metros. Dura até ser incapacitado ou dispensado."),
        f(18, "Recuperação Sobrenatural", "No 18º nível, como ação bônus, quando estiver com menos da metade dos PV, você pode se curar metade do seu máximo de PV. Uma vez por descanso longo, ou gastando 5 pontos de feitiçaria para usar novamente."),
      ],
    },
    {
      id: "magia-das-sombras",
      name: "Magia das Sombras",
      level: 1,
      description:
        "Sua magia vem da Umbra Shadowfell, uma conexão sombria e funesta que lhe concede poderes de morte e dissimulação. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(1, "Olhos da Escuridão", "No 1º nível, você tem visão no escuro de 36 metros. No 3º nível, pode conjurar escuridão gastando 2 pontos de feitiçaria e ver através dela."),
        f(1, "Força do Túmulo", "No 1º nível, quando o dano reduziria você a 0 PV, você pode fazer um teste de resistência de Carisma (CD 5 + dano). Em sucesso, você cai para 1 PV (a menos que o dano seja radiante ou crítico). Uma vez por descanso longo."),
        f(6, "Cão do Mau Agouro", "No 6º nível, como ação bônus e gastando 3 pontos de feitiçaria, você invoca um cão espectral que aparece a até 9 metros de um alvo que você escolher a até 36 metros; o alvo tem desvantagem em testes de resistência contra suas magias enquanto o cão estiver a até 1,5 metro dele. O cão ataca e persegue seu alvo por 5 minutos."),
        f(14, "Caminhar nas Sombras", "No 14º nível, como ação bônus, quando estiver em luz fraca ou escuridão, você pode teletransportar-se até 36 metros para um espaço visível também em luz fraca ou escuridão."),
        f(18, "Forma Sombria", "No 18º nível, você pode gastar 6 pontos de feitiçaria para assumir forma sombria: resistência a todo dano exceto radiante e força, passa por criaturas e objetos e se torna invisível em luz fraca."),
      ],
    },
    {
      id: "mente-aberrante",
      name: "Mente Aberrante",
      level: 1,
      description:
        "Sua magia é alimentada por influência psiônica, de um contato com o Reino Distante ou por um artefato mental. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias Psiônicas", "No 1º nível, você sempre tem preparadas: 1º braços de Hadar, sussurros dissonantes; 3º acalmar emoções, detectar pensamentos; 5º fome de Hadar, mensagem; 7º tentáculos negros de Evard, invocar aberração; 9º vínculo telepático de Rary, telecinese. Você aprende também o truque lasca mental."),
        f(1, "Fala Telepática", "No 1º nível, como ação bônus, você cria um vínculo telepático com uma criatura que possa ver a até 9 metros, por um número de minutos igual ao seu nível de feiticeiro; vocês se comunicam em qualquer idioma enquanto estiverem a até 1,6 km vezes seu nível de feiticeiro de distância."),
        f(6, "Defesas Psiônicas", "No 6º nível, você ganha resistência a dano psíquico e vantagem em testes de resistência contra ser enfeitiçado ou amedrontado. Além disso, Feitiçaria Psiônica: você pode conjurar magias psiônicas gastando pontos de feitiçaria iguais ao nível da magia, sem componentes verbais e somáticos."),
        f(14, "Revelação em Carne", "No 14º nível, como ação bônus, você gasta 1 ou mais pontos de feitiçaria para transformar seu corpo por 10 minutos, por ponto: ver invisível a 9 m; voo de 9 m; natação de 9 m com respiração aquática; ou espremer-se por espaços de 2,5 cm."),
        f(18, "Implosão Distorcida", "No 18º nível, como ação, você se teletransporta até 36 metros e cada criatura a até 9 metros do ponto de partida sofre 3d10 de dano de energia (teste de Força para metade). Uma vez por descanso longo, ou 5 pontos de feitiçaria."),
      ],
    },
    {
      id: "alma-mecanica",
      name: "Alma Mecânica",
      level: 1,
      description:
        "Sua magia vem de Mechanus, o plano da ordem cósmica. Sua alma ressoa com a ordem do multiverso, e você se opõe ao caos. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(1, "Magias Mecânicas", "No 1º nível, você sempre tem preparadas: 1º alarme, proteção contra o bem e o mal; 3º auxílio, restauração menor; 5º dissipar magia, proteção contra energia; 7º movimentação livre, invocar constructo; 9º restauração maior, muralha de energia."),
        f(1, "Restaurar o Equilíbrio", "No 1º nível, como reação, você cancela a vantagem ou desvantagem em um teste de uma criatura a até 18 metros. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(6, "Baluarte da Lei", "No 6º nível, como ação, você gasta 1 a 5 pontos de feitiçaria e cria uma proteção em você ou em uma criatura a até 9 metros; a proteção tem um número de d8 igual aos pontos gastos e absorve dano. Dura até o fim de um descanso longo."),
        f(14, "Transe da Ordem", "No 14º nível, como ação bônus, você entra em transe por 1 minuto: ataques contra você não têm vantagem, e rolagens de d20 de 9 ou menos em seus ataques, testes e resistência são tratadas como 10. Uma vez por descanso longo, ou 5 pontos de feitiçaria."),
        f(18, "Cavalgada Mecânica", "No 18º nível, como ação, você faz uma onda de energia ordenada em um cubo de 9 metros: criaturas amigáveis recuperam 100 PV (divididos) e objetos são consertados. Uma vez por descanso longo, ou 7 pontos de feitiçaria."),
      ],
    },
    {
      id: "feiticaria-lunar",
      name: "Feitiçaria Lunar",
      level: 1,
      description:
        "Sua magia é ligada às três luas de Krynn (Solinari, Lunitari e Nuitari), concedendo-lhe poderes que mudam conforme a fase da lua. Fonte: Dragonlance: Shadow of the Dragon Queen.",
      features: [
        f(1, "Magias Lunares", "No 1º nível, você aprende truques e magias adicionais ligados às luas, sempre preparadas."),
        f(1, "Fases Lunares", "No 1º nível, ao terminar um descanso longo, você escolhe uma fase da lua (Lua Nova, Lua Crescente, Lua Cheia), que concede um benefício até o próximo descanso longo."),
        f(6, "Arco Lunar", "No 6º nível, você pode gastar pontos de feitiçaria para conjurar magias com efeitos de teletransporte em uma curta distância, usando a lua como guia."),
        f(14, "Impulso Lunar", "No 14º nível, quando estiver sob a lua cheia, você pode ganhar vantagem em testes de resistência."),
        f(18, "Eclipse Lunar", "No 18º nível, você pode invocar um eclipse que cobre uma área de 18 metros, concedendo benefícios a aliados e penalidades a inimigos por 1 minuto."),
      ],
    },
  ],

  // =========================================================================
  guerreiro: [
    {
      id: "samurai",
      name: "Samurai",
      level: 3,
      description:
        "O Samurai é um guerreiro que luta com espírito inabalável e determinação feroz, empregando disciplina e tenacidade para triunfar. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Proficiência Bônus", "No 3º nível, você ganha proficiência em uma das perícias: História, Intuição, Atuação ou Persuasão; ou aprende um idioma à sua escolha."),
        f(3, "Espírito Combativo", "No 3º nível, como ação bônus, você ganha vantagem em todos os ataques com arma até o final do turno e recebe 5 PV temporários + seu nível de guerreiro. Usos igual a 3 por descanso longo."),
        f(7, "Cortesão Elegante", "No 7º nível, você adiciona seu modificador de Sabedoria em testes de Persuasão e ganha proficiência em testes de resistência de Sabedoria (ou de Inteligência/Carisma, à escolha, se já tiver Sabedoria)."),
        f(10, "Espírito Incansável", "No 10º nível, quando você rola iniciativa e não tem usos restantes de Espírito Combativo, você recupera um uso."),
        f(15, "Golpe Rápido", "No 15º nível, se você tiver vantagem num ataque, você pode abrir mão dela para realizar um ataque adicional contra o mesmo alvo (Ataque Rápido), o que exige gastar um uso de Espírito Combativo."),
        f(18, "Força Antes da Morte", "No 18º nível, quando você é reduzido a 0 PV mas não morre imediatamente, você pode realizar um turno extra imediato, durante o qual age normalmente. Se você cair a 0 PV, só cai ao fim desse turno. Uma vez por descanso longo."),
      ],
    },
    {
      id: "cavaleiro-cavalaria",
      name: "Cavaleiro",
      level: 3,
      description:
        "O Cavaleiro é treinado em combate montado e em liderar o campo de batalha, protegendo aliados e punindo quem os ameaça. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Proficiência Bônus", "No 3º nível, você ganha proficiência em uma das perícias: Adestrar Animais, História, Intuição, Persuasão; ou aprende um idioma."),
        f(3, "Nascido para a Sela", "No 3º nível, você tem vantagem em testes de resistência para não ser derrubado da montaria, e levantar custa 1,5 metro de deslocamento ao invés da metade."),
        f(3, "Marca Inabalável", "No 3º nível, quando você atinge uma criatura com ataque corpo a corpo com arma, ela é marcada até o final do seu próximo turno. Enquanto marcada, a criatura sofre desvantagem em ataques contra alvos que não sejam você; e se ela causar dano a outra criatura, você pode realizar um ataque corpo a corpo adicional contra ela com sua ação bônus, causando dano adicional igual ao seu nível de guerreiro. Usos igual ao seu modificador de Constituição por descanso longo."),
        f(7, "Manobra de Proteção", "No 7º nível, como reação, quando uma criatura que você possa ver atingir você ou um aliado a até 1,5 metro com um ataque, você pode gastar um dado de superioridade ou usar seu dado para aumentar a CA em 1d8 até o fim do ataque."),
        f(10, "Segurar a Linha", "No 10º nível, como reação, quando uma criatura provocar o ataque de oportunidade de um aliado seu, ou quando uma criatura em seu alcance se mover, ela fica com deslocamento reduzido a 0 até o fim do movimento; seus ataques de oportunidade também podem ser feitos quando uma criatura se afasta de você, mesmo com Desengajar."),
        f(15, "Investida Feroz", "No 15º nível, se você move ao menos 3 metros em linha reta antes de atingir uma criatura com ataque corpo a corpo, o alvo faz um teste de resistência de Força ou fica caído."),
        f(18, "Defensor Vigilante", "No 18º nível, em cada turno de combate, você ganha uma reação especial que só pode ser usada para realizar um ataque de oportunidade, e você a recebe mesmo que já tenha usado sua reação normal."),
      ],
    },
    {
      id: "cavaleiro-eco",
      name: "Cavaleiro Eco",
      level: 3,
      description:
        "Lutadores raros que usam energia dos planos de existência para criar um eco de si mesmos de uma linha do tempo alternativa. Fonte: Explorer's Guide to Wildemount.",
      features: [
        f(3, "Manifestar Eco", "No 3º nível, como ação bônus, você manifesta um eco mágico de si em um espaço desocupado a até 4,5 metros. O eco tem CA 14 + proficiência, PV igual a 1 e usa seus modificadores. Você pode atacar do espaço do eco, trocar de lugar e usar reações através dele. O eco desaparece se estiver a mais de 9 metros de você."),
        f(3, "Desencadear Encarnação", "No 3º nível, como ação bônus, você pode realizar um ataque do espaço do eco (usando Desencadear Encarnação): sempre que você realizar a ação de Atacar, você pode fazer um ataque adicional do espaço do eco, um número de vezes igual ao seu modificador de Constituição por descanso longo."),
        f(7, "Avatar do Eco", "No 7º nível, você pode ver através do eco como se estivesse no espaço dele, mesmo a até 300 metros; enquanto isso você fica cego e surdo, mas pode ouvir e ver o ambiente do eco."),
        f(10, "Mártir da Sombra", "No 10º nível, como reação, quando você ou outra criatura a até 9 metros do eco for atingida por um ataque, você pode trocar de lugar com o eco, e o ataque passa a ter você como alvo."),
        f(15, "Recuperar Potencial", "No 15º nível, quando seu eco é reduzido a 0 PV, ou se você o desfizer, você recupera PV temporários igual ao seu nível de guerreiro mais um modificador de Constituição."),
        f(18, "Legião de Um", "No 18º nível, como ação bônus, você pode criar dois ecos simultaneamente e ambos podem ser usados para Desencadear Encarnação. Se você rolar iniciativa sem uso de Manifestar Eco, recupera um uso."),
      ],
    },
    {
      id: "guerreiro-psiquico",
      name: "Guerreiro Psíquico",
      level: 3,
      description:
        "Guerreiros que ampliam suas proezas físicas com poderes psiônicos, usando dados psiônicos para fortalecer ataques, defesas e mobilidade. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Poder Psiônico", "No 3º nível, você tem dados psiônicos (d6; d8 no 5º, d10 no 11º, d12 no 17º). Número de dados: 4 no 3º nível, 6 no 5º, 8 no 9º, 10 no 13º, 12 no 17º. Eles alimentam Golpe Psiônico, Campo Protetor e Movimento Telecinético. Você recupera todos em um descanso longo e um dado em descanso curto."),
        f(3, "Golpe Psiônico", "No 3º nível, uma vez por turno, ao atingir uma criatura com ataque com arma, você pode gastar um dado psiônico para causar dano de energia adicional igual ao dado + seu modificador de Inteligência."),
        f(3, "Campo Protetor", "No 3º nível, como reação, quando você ou uma criatura a até 9 metros sofrer dano, você pode gastar um dado psiônico para reduzir o dano em dado + modificador de Inteligência."),
        f(7, "Adepto Telecinético", "No 7º nível, você ganha: Salto Telecinético (ação bônus: gasta um dado psiônico para voar 6 metros por um turno) e Impulso Telecinético (ao usar Golpe Psiônico, o alvo faz teste de Força ou é empurrado até 3 metros). Usa um dado psiônico por uso, 1 uso grátis por descanso."),
        f(10, "Mente Guardada", "No 10º nível, você tem resistência a dano psíquico e, como reação, pode usar um dado psiônico para encerrar um efeito de enfeitiçado ou amedrontado em você."),
        f(15, "Baluarte de Força", "No 15º nível, como ação bônus, você pode gastar um dado psiônico para criar uma barreira de força: você e aliados escolhidos (até 3) têm cobertura total por 1 minuto num raio de 9 metros. Uma vez por descanso longo."),
        f(18, "Mestre Telecinético", "No 18º nível, você pode conjurar telecinese sem espaço de magia ou componentes, usando Inteligência como habilitação, gastando um dado psiônico. Uma vez por descanso longo, ou pagando 1 dado."),
      ],
    },
    {
      id: "cavaleiro-runico",
      name: "Cavaleiro Rúnico",
      level: 3,
      description:
        "Cavaleiros que usam runas místicas gigantes para ampliar seus poderes, crescendo a tamanhos colossais em batalha. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Proficiências Bônus", "No 3º nível, você ganha proficiência com ferramentas de ferreiro e aprende o idioma Gigante."),
        f(3, "Entalhador de Runas", "No 3º nível, você aprende duas runas (Frio, Fogo, Nuvem, Pedra, Colina, Tempestade) e as aplica em itens. Cada runa tem um benefício passivo e uma ativação por descanso curto ou longo. Aprende mais runas nos níveis 7, 10 e 15."),
        f(3, "Força de Gigante", "No 3º nível, como ação bônus, você aumenta seu tamanho por 1 minuto (Médio vira Grande), ganha vantagem em testes e resistências de Força, e causa 1d6 de dano adicional uma vez por turno em ataques com arma. Usos igual ao bônus de proficiência por descanso longo."),
        f(7, "Escudo Rúnico", "No 7º nível, como reação, quando uma criatura que você possa ver a até 18 metros fizer um ataque, teste ou resistência, você usa o escudo rúnico para forçá-la a rolar novamente. Usos igual ao bônus de proficiência."),
        f(10, "Grande Estatura", "No 10º nível, quando você usa Força de Gigante, você cresce para Grande e ganha mais 1d6 de dano; o tamanho se mantém por 1 minuto e você pode quebrar efeitos de agarrar."),
        f(15, "Mestre das Runas", "No 15º nível, você pode ativar cada runa duas vezes entre descansos; e o dano de Força de Gigante passa a 1d8."),
        f(18, "Colosso Rúnico", "No 18º nível, ao usar Força de Gigante você se torna Enorme, seu alcance aumenta em 1,5 metro e o dano passa a 1d10."),
      ],
    },
    {
      id: "arqueiro-arcano",
      name: "Arqueiro Arcano",
      level: 3,
      description:
        "Os arqueiros arcanos élficos aprendem a infundir flechas com magia, dando origem a técnicas lendárias de combate à distância. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Conhecimento do Arqueiro Arcano", "No 3º nível, você ganha proficiência em Arcanismo ou Natureza, e aprende o truque prestidigitação ou druidismo."),
        f(3, "Tiro Arcano", "No 3º nível, você aprende duas opções de Tiro Arcano (Flecha Banidora, Flecha Explosiva, Flecha Agarradora, Flecha Enfraquecedora, Flecha Perseguidora, Flecha Sombria, Flecha Empurradora, Flecha Perfurante) e pode usar uma por turno quando atacar com arco. Dois usos por descanso curto ou longo; dano adicional de 1d6 em muitos tiros."),
        f(7, "Flecha Mágica e Tiro Curvo", "No 7º nível, você ganha Flecha Mágica (suas flechas contam como mágicas) e Tiro Curvo: como ação bônus, você pode redirecionar o ataque que falhou a outro alvo a até 18 metros do original."),
        f(7, "Tiro Arcano Aprimorado", "No 7º nível, você aprende uma opção adicional de Tiro Arcano."),
        f(10, "Mais Opções de Tiro", "No 10º nível, você aprende duas opções adicionais de Tiro Arcano."),
        f(15, "Tiro Sempre Pronto", "No 15º nível, quando você rola iniciativa e não tem usos restantes de Tiro Arcano, você recupera um uso."),
        f(18, "Tiro Arcano Maior", "No 18º nível, o dano de suas opções de Tiro Arcano aumenta para 2d6 (ou 4d6 se aplicável)."),
      ],
    },
  ],

  // =========================================================================
  guardiao: [
    {
      id: "perseguidor-sombrio",
      name: "Perseguidor Sombrio",
      level: 3,
      description:
        "Os perseguidores sombrios são caçadores noturnos que se esgueiram em cavernas e masmorras, cercados por escuridão que os esconde. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Magias de Perseguidor Sombrio", "Magias sempre preparadas: 3º disfarçar-se; 5º truque da corda; 9º medo; 13º invisibilidade maior; 17º aparência enganosa."),
        f(3, "Emboscador Aterrorizante", "No 3º nível, você adiciona seu modificador de Sabedoria à iniciativa. No primeiro turno de cada combate, seu deslocamento aumenta em 3 metros e, ao realizar a ação de Atacar, você pode fazer um ataque adicional com arma que causa 1d8 de dano adicional."),
        f(3, "Visão no Escuro Estendida", "No 3º nível, sua visão no escuro aumenta em 18 metros, e você fica invisível para criaturas que dependem de visão no escuro."),
        f(7, "Mente de Ferro", "No 7º nível, você ganha proficiência em testes de resistência de Sabedoria (ou Inteligência/Carisma se já tiver)."),
        f(11, "Rajada do Perseguidor", "No 11º nível, uma vez por turno, ao errar um ataque com arma, você pode realizar outro ataque com a mesma arma como parte da mesma ação."),
        f(15, "Esquiva das Sombras", "No 15º nível, quando uma criatura que você não possa ver atingi-lo com ataque, você pode usar a reação para impor desvantagem."),
      ],
    },
    {
      id: "andarilho-do-horizonte",
      name: "Andarilho do Horizonte",
      level: 3,
      description:
        "Andarilhos do horizonte guardam as fronteiras entre os planos, eliminando ameaças interdimensionais. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Magias de Andarilho do Horizonte", "Magias sempre preparadas: 3º proteção contra o bem e o mal; 5º passo nebuloso; 9º velocidade; 13º banimento; 17º círculo de teletransporte."),
        f(3, "Detectar Portal", "No 3º nível, como ação, você pode detectar a direção do portal planar mais próximo a até 1,6 quilômetro. Uma vez por descanso curto ou longo."),
        f(3, "Guerreiro Planar", "No 3º nível, uma vez por turno, quando você atinge uma criatura com ataque com arma, você pode causar 1d8 de dano de energia adicional e o mesmo a uma segunda criatura a até 9 metros dela (2d8 no 11º nível)."),
        f(7, "Passo Etéreo", "No 7º nível, como ação bônus, você pode conjurar passo etéreo sem gastar espaço de magia, até o fim do seu turno. Uma vez por descanso curto ou longo."),
        f(11, "Ataque Distante", "No 11º nível, quando você realizar a ação de Atacar, você pode se teletransportar 3 metros antes ou depois de cada ataque."),
        f(15, "Defesa Espectral", "No 15º nível, como reação, quando sofrer dano, você ganha resistência a todo dano daquele ataque."),
      ],
    },
    {
      id: "matador-de-monstros",
      name: "Matador de Monstros",
      level: 3,
      description:
        "Os matadores de monstros são caçadores especializados em enfrentar criaturas sobrenaturais, recorrendo a tática, conhecimento e magia contra o seu alvo. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Magias de Matador de Monstros", "Magias sempre preparadas: 3º proteção contra o bem e o mal; 5º zona da verdade; 9º círculo mágico; 13º banimento; 17º imobilizar monstro."),
        f(3, "Sentido do Caçador e Presa do Matador", "No 3º nível, como ação bônus, você escolhe uma criatura que possa ver a até 18 metros para ser sua Presa: aprende as imunidades, resistências e vulnerabilidades dela. Você causa 1d6 de dano adicional uma vez por turno em ataques com arma. Dura 1 hora ou até marcar outra."),
        f(3, "Estudo Sobrenatural", "No 3º nível, você tem proficiência em Arcanismo ou Investigação."),
        f(7, "Defesa Sobrenatural", "No 7º nível, quando a sua Presa o forçar a um teste de resistência ou tentar agarrá-lo, você adiciona 1d6 ao teste."),
        f(11, "Nêmesis do Usuário de Magia", "No 11º nível, como reação, quando sua Presa estiver conjurando uma magia a até 18 metros, você pode forçar um teste de resistência de Sabedoria; em falha, a magia é interrompida (como contraespecialidade do usuário de magia). Usos igual ao seu modificador de Sabedoria."),
        f(15, "Contra-ataque do Matador", "No 15º nível, quando sua Presa o forçar a um teste de resistência e você passar, você pode usar sua reação para atacá-la. Se o ataque acertar, o efeito é anulado."),
      ],
    },
    {
      id: "andarilho-feerico",
      name: "Andarilho Feérico",
      level: 3,
      description:
        "Guardiões marcados pelo poder do Reino Feérico, cuja magia envolve glamour e caminhos secretos. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Magias de Andarilho Feérico", "Magias sempre preparadas: 3º enfeitiçar pessoa; 5º passo nebuloso; 9º invocar feérico; 13º porta dimensional; 17º enganar."),
        f(3, "Golpes Terríveis", "No 3º nível, uma vez por turno, quando você atinge uma criatura com ataque com arma, você causa 1d4 de dano psíquico adicional (1d6 no 11º nível)."),
        f(3, "Glamour Sobrenatural", "No 3º nível, você adiciona seu modificador de Sabedoria (mínimo +1) a testes de Carisma e ganha proficiência em Enganação, Atuação ou Persuasão."),
        f(7, "Reviravolta Sedutora", "No 7º nível, você tem vantagem contra ser enfeitiçado ou amedrontado e, como reação, pode redirecionar o efeito de enfeitiçar ou amedrontar para outra criatura visível a 36 metros."),
        f(11, "Reforços Feéricos", "No 11º nível, você pode conjurar invocar feérico sem material, sem espaço de magia, sem concentração (duração 1 minuto). Uma vez por descanso longo."),
        f(15, "Andarilho Nebuloso", "No 15º nível, você pode conjurar passo nebuloso sem espaço de magia um número de vezes igual ao seu modificador de Sabedoria por descanso longo, levando uma criatura voluntária adjacente."),
      ],
    },
    {
      id: "guardiao-do-enxame",
      name: "Guardião do Enxame",
      level: 3,
      description:
        "Guardiões que se aliam a enxames de espíritos da natureza, transformando-os em armas e companheiros. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Magias do Guardião do Enxame", "Magias sempre preparadas: 3º fogo feérico; 5º teia; 9º forma gasosa; 13º olho arcano; 17º praga de insetos."),
        f(3, "Enxame Reunido", "No 3º nível, uma vez por turno, ao atingir uma criatura com ataque, você pode causar 1d6 de dano de energia adicional (2d6 no 11º nível) e/ou mover o alvo 4,5 metros, ou mover-se 1,5 metro sem provocar. Você também aprende o truque mãos mágicas (aparência de enxame)."),
        f(7, "Maré Ondulante", "No 7º nível, como ação bônus, você pode voar por 10 minutos com deslocamento de voo igual ao deslocamento terrestre. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(11, "Enxame Poderoso", "No 11º nível, o dano de Enxame Reunido aumenta para 2d6 e, ao atingir uma criatura, o alvo também fica caído se falhar em teste de Força; o enxame também concede cobertura de meia metade."),
        f(15, "Dispersão do Enxame", "No 15º nível, como reação, quando você sofrer dano, você pode se teletransportar até 9 metros e ganhar resistência àquele dano."),
      ],
    },
    {
      id: "guardiao-dragonico",
      name: "Guardião Dracônico",
      level: 3,
      description:
        "Guardiões que invocam e criam um laço com um dragãozinho cuja força cresce com a deles. Fonte: Fizban's Treasury of Dragons.",
      features: [
        f(3, "Dádiva Dracônica", "No 3º nível, você aprende o truque taumaturgia e o idioma Dracônico, ganhando uma Dádiva Dracônica."),
        f(3, "Drake Companheiro", "No 3º nível, como ação, você invoca um drake (dragãozinho) que o acompanha. Seus PV, ataques e CA crescem com o seu nível; ele age conforme seus comandos de ação bônus. Você pode invocá-lo uma vez por descanso longo sem gastar espaço, ou gastando um espaço de magia de 1º nível."),
        f(7, "Laço de Presa e Escama", "No 7º nível, enquanto o drake estiver a até 9 metros, você ganha resistência a um tipo de dano elemental (à escolha) e seu dano com arma aumenta 1d6; o drake cresce para Grande e você pode cavalgá-lo."),
        f(11, "Sopro do Drake", "No 11º nível, como ação, você comanda seu drake a soprar em um cone de 9 metros, causando 2d6 de dano do elemento escolhido (teste de Destreza para metade). Usos igual ao seu bônus de proficiência por descanso longo."),
        f(15, "Vínculo Aperfeiçoado", "No 15º nível, o drake cresce para Enorme e ganha deslocamento de voo; você ganha resistência ao elemento escolhido e os ataques do drake ficam mais fortes."),
      ],
    },
  ],

  // =========================================================================
  ladino: [
    {
      id: "batedor",
      name: "Batedor",
      level: 3,
      description:
        "Batedores são hábeis sobreviventes e exploradores, dominam a floresta, a estrada e o terreno hostil, atuando como emissários e espiões. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Escaramuçador", "No 3º nível, como reação, quando uma criatura terminar seu turno a até 1,5 metro de você, você pode se mover até metade do seu deslocamento sem provocar ataques de oportunidade."),
        f(3, "Sobrevivente", "No 3º nível, você ganha proficiência em Natureza e Sobrevivência, e dobra seu bônus de proficiência nelas."),
        f(9, "Mobilidade Superior", "No 9º nível, seu deslocamento aumenta em 3 metros. Se tiver deslocamento de escalada ou natação, também aumenta em 3 metros."),
        f(13, "Emboscador", "No 13º nível, no primeiro turno de combate você tem vantagem em ataques contra criaturas que ainda não agiram, e se acertar, dano adicional de Ataque Furtivo é aplicado."),
        f(17, "Golpe Repentino", "No 17º nível, como ação bônus, depois de usar Ataque Furtivo, você pode realizar um ataque adicional contra um alvo diferente."),
      ],
    },
    {
      id: "investigador",
      name: "Investigador",
      level: 3,
      description:
        "Investigadores têm um olho aguçado para detalhes e uma habilidade rara de decifrar o comportamento humano, perfeitos como detetives. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Olhar Perspicaz", "No 3º nível, como ação, você faz um teste de Sabedoria (Intuição) contra Carisma (Enganação) de uma criatura. Se bem-sucedido, você tem vantagem em testes de ataque e Ataque Furtivo contra ela por 1 minuto."),
        f(3, "Olho Treinado", "No 3º nível, você ganha proficiência em Intuição e Investigação, e pode usar Inteligência para Percepção passiva como ação bônus."),
        f(9, "Percepção Aguçada", "No 9º nível, você pode fazer um teste de Intuição para saber se uma criatura mente, adicionando seu bônus de proficiência."),
        f(13, "Olhar Penetrante", "No 13º nível, você pode usar uma ação para ver através de ilusões e disfarces mágicos, e tem vantagem em testes de Investigação."),
        f(17, "Impulso Mortal", "No 17º nível, quando você usar Ataque Furtivo e o alvo fizer um teste de Constituição, ele tem desvantagem; se falhar, é derrubado."),
      ],
    },
    {
      id: "fantasma",
      name: "Fantasma",
      level: 3,
      description:
        "Ladinos fantasmas obtêm poder do mundo espiritual, usando sussurros e conexões com os mortos para atacar de forma sutil. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Sussurros dos Mortos", "No 3º nível, após um descanso curto ou longo, você ganha proficiência em uma perícia ou ferramenta à sua escolha (de qualquer mestre), até o próximo descanso curto ou longo, ou dádiva espiritual."),
        f(3, "Pranto dos Perdidos", "No 3º nível, ao causar Ataque Furtivo, você pode causar dano necrótico igual ao dado de furtivo a uma segunda criatura a até 9 metros do alvo. Usos igual ao bônus de proficiência por descanso longo."),
        f(9, "Fichas Fantasmas", "No 9º nível, quando você usa Sussurros dos Mortos, você pode criar fichas (usos de proficiência) que podem ser doadas a aliados."),
        f(13, "Toque do Fantasma", "No 13º nível, quando você usa o Pranto dos Perdidos, o alvo faz um teste de Constituição ou fica amedrontado."),
        f(17, "Amigo da Morte", "No 17º nível, o dano necrótico do Pranto dos Perdidos passa a ser dobrado e você recupera PV igual ao dano; você também pode usar uma ação bônus para abrigar uma alma no seu próprio corpo."),
      ],
    },
    {
      id: "lamina-da-alma",
      name: "Lâmina da Alma",
      level: 3,
      description:
        "Ladinos lâminas da alma canalizam energia psíquica para criar lâminas e ferramentas de energia mental. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Poder Psiônico", "No 3º nível, você tem dados psiônicos (d6; d8 no 5º, d10 no 11º, d12 no 17º), em número igual a duas vezes o bônus de proficiência. Eles alimentam Sussurros Psíquicos, Lâminas Psíquicas e Esquadrinhar Mental. Recupera em descanso longo, um dado em descanso curto."),
        f(3, "Lâminas Psíquicas", "No 3º nível, você pode materializar uma lâmina psíquica de 1d6 + Destreza de dano psíquico, com arremesso 18 m, como parte de um ataque, e uma lâmina na outra mão como ação bônus (1d4)."),
        f(3, "Sussurros Psíquicos", "No 3º nível, como ação, você pode estabelecer comunicação telepática com criaturas à vista, rolando um dado psiônico que define a duração em horas."),
        f(9, "Lâminas da Alma", "No 9º nível, você ganha Teleporte Psíquico (ação bônus: gasta um dado psiônico para teletransportar-se 3 + dado x 3 metros) e Ataque Preciso (rola um dado psiônico para acrescentar ao ataque que errou)."),
        f(13, "Véu Psíquico", "No 13º nível, como ação, você fica invisível por 1 hora, ou até atacar; uma vez por descanso longo (ou gastando dado)."),
        f(17, "Rasgar Mente", "No 17º nível, quando você atinge uma criatura com a lâmina psíquica, você pode forçar um teste de Sabedoria (CD 8 + prof + Destreza); em falha, fica atordoada por 1 minuto. Uma vez por descanso longo."),
      ],
    },
  ],

  // =========================================================================
  mago: [
    {
      id: "cronurgia",
      name: "Magia da Cronurgia",
      level: 2,
      description:
        "Cronurgistas manipulam o fluxo do tempo, alterando eventos e atrasando ou acelerando o destino. Fonte: Explorer's Guide to Wildemount.",
      features: [
        f(2, "Deslocamento Cronal", "No 2º nível, como reação, quando você ou uma criatura que possa ver a até 9 metros fizer uma jogada de ataque, teste de resistência ou de habilidade, você pode forçá-la a rolar o d20 novamente e usar o novo resultado. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(2, "Consciência Temporal", "No 2º nível, você adiciona seu modificador de Inteligência às suas jogadas de iniciativa."),
        f(6, "Estase Momentânea", "No 6º nível, como ação, uma criatura Grande ou menor a até 18 metros faz um teste de resistência de Constituição ou fica incapacitada, com deslocamento 0, até o fim do seu próximo turno. Usos igual ao seu modificador de Inteligência por descanso longo."),
        f(10, "Suspensão Arcana", "No 10º nível, quando você conjura uma magia de 4º nível ou inferior, você pode comprimi-la em uma conta de luz e liberá-la depois, em um turno posterior, como ação bônus. Uma vez por descanso longo."),
        f(14, "Controle do Tempo", "No 14º nível, quando você ou um aliado sofrer dano a até 9 metros, você pode usar a reação para reverter o dano, restaurando os PV perdidos. Uma vez por descanso longo, ou gastando um espaço de magia de 3º nível ou superior."),
      ],
    },
    {
      id: "gravituria",
      name: "Magia da Gravitúrgia",
      level: 2,
      description:
        "Gravitúrgicos manipulam a gravidade, comprimindo e esticando o espaço para controlar o campo de batalha e os corpos dos inimigos. Fonte: Explorer's Guide to Wildemount.",
      features: [
        f(2, "Poço Gravitacional", "No 2º nível, quando você conjura uma magia que cause dano em uma criatura, você pode mover a criatura até 1,5 metro em uma direção à sua escolha."),
        f(2, "Ajustar Densidade", "No 2º nível, como ação, você pode alterar a densidade de uma criatura a até 9 metros por 1 minuto: Mais pesada (deslocamento reduzido) ou mais leve (deslocamento aumentado, +saltos)."),
        f(6, "Atração Violenta", "No 6º nível, como reação, quando uma criatura que você possa ver cair ou for atingida por arma, você pode adicionar 1d10 ao dano; além disso, aumenta o efeito. Usos igual ao seu modificador de Inteligência por descanso longo."),
        f(10, "Horizonte de Eventos", "No 10º nível, como ação, você cria uma onda de força: criaturas a até 9 metros de um ponto fazem teste de Força ou sofrem 2d10 de dano de energia e ficam com deslocamento 0 até o fim do próximo turno. Uma vez por descanso longo."),
        f(14, "Singularidade Gravitacional", "No 14º nível, a sua Atração Violenta passa a causar 2d10 de dano adicional, e o Horizonte de Eventos se recupera ao gastar um espaço de magia de 3º nível ou superior."),
      ],
    },
    {
      id: "magia-de-guerra",
      name: "Escola de Magia de Guerra",
      level: 2,
      description:
        "Magos de guerra combinam técnicas defensivas e ofensivas, usando evocação e abjuração para proteger a si e atacar. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(2, "Deflexão Arcana", "No 2º nível, quando você é atingido por um ataque ou falha em um teste de resistência, você pode usar a reação para ganhar +2 de CA ou +4 no teste. Depois disso, até o fim do seu próximo turno só pode conjurar truques."),
        f(2, "Perspicácia Tática", "No 2º nível, você adiciona seu modificador de Inteligência às suas jogadas de iniciativa."),
        f(6, "Surto de Poder", "No 6º nível, você pode armazenar contadores de surto (igual ao seu modificador de Inteligência). Ao terminar um descanso longo, ou ao conjurar dissipar magia/contramágica com sucesso, ganha 1. Quando atingir criatura com magia ou truque, gasta 1 para causar dano de energia adicional igual à metade do nível de mago."),
        f(10, "Magia Durável", "No 10º nível, enquanto você estiver se concentrando em uma magia, você ganha +2 de CA e +2 em todos os testes de resistência."),
        f(14, "Manto Defletor", "No 14º nível, quando você usa Deflexão Arcana, você pode, como parte da reação, criar um manto: até três criaturas à sua escolha a até 18 metros sofrem dano de energia igual à metade do nível de mago."),
      ],
    },
    {
      id: "ordem-dos-escribas",
      name: "Ordem dos Escribas",
      level: 2,
      description:
        "Os magos da Ordem dos Escribas veem seu grimório como um tomo vivo e senciente, capaz de criar magia por conta própria. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(2, "Pena de Mago e Grimório Desperto", "No 2º nível, você ganha Pena de Mago: como ação bônus, uma pena mágica que copia magias no grimório (2 minutos por nível, sem custo). Você também ganha Grimório Desperto: o grimório funciona como foco arcano, permite conjurar rituais sem tempo extra, e você pode alterar o tipo de dano de uma magia ao conjurá-la para o tipo de uma magia do grimório."),
        f(2, "Substituição de Dano", "No 2º nível, quando você conjura uma magia usando o grimório como foco, você pode gastar uma ação para substituir o tipo de dano pelo de outra magia de mesmo nível já registrada."),
        f(6, "Mente Manifesta", "No 6º nível, como ação bônus, você convoca uma mente espectral em um espaço a até 18 metros por 1 hora (Mente Manifesta); você pode conjurar magias a partir dela, ela tem visão e audição, e dá vantagem em testes de Concentração."),
        f(10, "Escriba Mestre", "No 10º nível, durante um descanso longo, você pode criar um pergaminho mágico de uma magia do grimório ao custo normal; reduz o tempo e custo."),
        f(14, "Um com a Palavra", "No 14º nível, como reação, quando você sofre dano, você pode apagar uma magia do grimório para reduzir o dano pela metade (e escrever-la depois). Também pode usar o grimório sem componentes materiais."),
      ],
    },
  ],

  // =========================================================================
  monge: [
    {
      id: "mestre-bebado",
      name: "Caminho do Mestre Bêbado",
      level: 3,
      description:
        "Os seguidores do Mestre Bêbado imitam os movimentos oscilantes e imprevisíveis de um bêbado, lutando com aparente descuido e agilidade surpreendente. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Proficiências Bônus", "No 3º nível, você ganha proficiência em Atuação e em suprimentos de cervejeiro (se já tiver, outra ferramenta ou perícia)."),
        f(3, "Técnica Embriagada", "No 3º nível, sempre que você usar Rajada de Golpes, você ganha o benefício de Desengajar e seu deslocamento aumenta em 3 metros até o fim do turno."),
        f(6, "Balanço Cambaleante", "No 6º nível, você ganha Levantar-se de um Salto (levantar-se custa apenas 1,5 metro) e Redirecionar Ataque: como reação, quando uma criatura errar um ataque corpo a corpo contra você, você gasta 1 ponto de ki e o ataque passa a ter como alvo outra criatura a até 1,5 metro de você."),
        f(11, "Sorte do Bêbado", "No 11º nível, quando você fizer um teste de resistência, teste de característica ou ataque com desvantagem, você pode gastar 2 pontos de ki para cancelar a desvantagem."),
        f(17, "Frenesi Embriagado", "No 17º nível, quando você usar Rajada de Golpes, pode realizar até 5 ataques (ao invés de 2), desde que cada ataque seja contra uma criatura diferente."),
      ],
    },
    {
      id: "kensei",
      name: "Caminho do Kensei",
      level: 3,
      description:
        "Os monges do Caminho do Kensei treinam com armas específicas, tratando-as como extensão de si mesmos e perfeitos em técnicas de arte marcial. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Caminho do Kensei", "No 3º nível, você escolhe dois tipos de arma como armas Kensei (uma corpo a corpo e uma à distância). Você é proficiente com elas e elas contam como armas de monge. Você ganha Aparar Ágil (como ação bônus, +2 CA contra um ataque corpo a corpo) e Tiro do Kensei (ação bônus para dar dano extra de 1d4 em ataque à distância). Você também ganha proficiência em Caligrafia ou Pintura."),
        f(6, "Um com a Lâmina", "No 6º nível, seus ataques com armas Kensei contam como mágicos, e você pode gastar 1 ponto de ki para causar dano adicional igual ao seu dado de arte marcial."),
        f(11, "Afiar a Lâmina", "No 11º nível, como ação bônus, você pode gastar até 3 pontos de ki para conceder bônus nos ataques e dano de uma arma Kensei igual ao número de pontos, por 1 minuto."),
        f(17, "Precisão Infalível", "No 17º nível, uma vez por turno, quando você errar um ataque com arma de monge, você pode rolar novamente a jogada de ataque."),
      ],
    },
    {
      id: "eu-astral",
      name: "Caminho do Eu Astral",
      level: 3,
      description:
        "Monges do Eu Astral acreditam que o corpo é uma ilusão, e canalizam a própria alma como uma manifestação astral para lutar e proteger. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Braços do Eu Astral", "No 3º nível, como ação bônus, você gasta 1 ponto de ki para invocar os braços astrais por 10 minutos. Você usa Sabedoria para testes e resistências de Força, e seus ataques desarmados com os braços causam dano de energia (dado de arte marcial) com alcance de 3 metros."),
        f(6, "Visão do Eu Astral", "No 6º nível, enquanto os Braços do Eu Astral estiverem ativos, você ganha visão no escuro de 36 metros e vantagem em testes de Intuição, e pode convocar um rosto astral que o auxilia (ajuda em perícias)."),
        f(11, "Corpo do Eu Astral", "No 11º nível, quando os braços e o rosto estiverem ativos, você ganha um corpo astral: reação para reduzir dano em 2d10 + modificador de Sabedoria e um ataque adicional contra o atacante."),
        f(17, "Eu Astral Desperto", "No 17º nível, você pode usar todos os três aspectos (braços, rosto, corpo) ao mesmo tempo, ganhando +2 CA e um ataque adicional em Rajada de Golpes. Custo: 5 pontos de ki."),
      ],
    },
    {
      id: "misericordia",
      name: "Caminho da Misericórdia",
      level: 3,
      description:
        "Monges da Misericórdia são médicos ou carrascos, conhecidos por máscaras que escondem seus rostos, e usam ki para curar ou ferir. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Implementos de Misericórdia", "No 3º nível, você ganha proficiência em Intuição, Medicina e no kit de herbalismo, e recebe uma máscara especial (suprimento do Caminho)."),
        f(3, "Mão de Cura", "No 3º nível, como ação ou ao usar Rajada de Golpes, você gasta 1 ponto de ki para restaurar PV a uma criatura que tocar: dado de arte marcial + modificador de Sabedoria."),
        f(3, "Mão de Dano", "No 3º nível, ao atingir uma criatura com ataque desarmado, você pode gastar 1 ponto de ki para causar dano necrótico adicional igual ao dado de arte marcial + modificador de Sabedoria (uma vez por turno)."),
        f(6, "Toque do Médico", "No 6º nível, ao usar Mão de Cura, você pode encerrar uma condição (cegueira, surdez, enfeitiçado, amedrontado, atordoado, envenenado). Ao usar Mão de Dano, o alvo faz um teste de Constituição ou fica envenenado."),
        f(11, "Rajada de Cura e Dano", "No 11º nível, quando você usa Rajada de Golpes, você pode substituir cada ataque por uma Mão de Cura ou Mão de Dano sem gastar ki adicional (usos iguais ao seu modificador de Sabedoria)."),
        f(17, "Mão da Misericórdia Suprema", "No 17º nível, como ação, você pode reviver uma criatura que morreu há até 24 horas: ela retorna à vida com 4d10 + modificador de Sabedoria PV, e perde condições. Se a criatura for atingida, ela morre. Uma vez por descanso longo."),
      ],
    },
    {
      id: "dragao-ascendente",
      name: "Caminho do Dragão Ascendente",
      level: 3,
      description:
        "Monges do Dragão Ascendente aprendem a canalizar o poder de dragões para exalar sopros elementais e ganhar asas espectrais. Fonte: Fizban's Treasury of Dragons.",
      features: [
        f(3, "Sopro do Dragão", "No 3º nível, como ação (ou substituindo um ataque ao usar Atacar), você pode exalar o Sopro do Dragão: cone de 4,5 metros ou linha de 9 metros, 2d6 de dano de tipo escolhido (ácido, frio, fogo, elétrico ou veneno), teste de resistência de Destreza para metade. Usos igual ao seu bônus de proficiência por descanso longo."),
        f(3, "Discípulo do Dragão", "No 3º nível, você aprende Dracônico ou ganha proficiência em Intimidação, Persuasão ou Percepção, e pode usar Sabedoria para ataques com o sopro."),
        f(6, "Aspecto Ascendente", "No 6º nível, você ganha visão às cegas de 3 metros e aumento de deslocamento de natação ou escalada igual ao deslocamento; seu Sopro de Dragão causa dano adicional."),
        f(11, "Asas Estendidas", "No 11º nível, como ação bônus, você pode manifestar asas espectrais por 10 minutos, com voo igual ao seu deslocamento. Uma vez por descanso longo, ou gastando 3 pontos de ki."),
        f(17, "Dádiva do Dragão", "No 17º nível, quando você usa o Sopro do Dragão, pode gastar pontos de ki para acrescentar dano e conceder resistência a aliados na área."),
      ],
    },
    {
      id: "tranquilidade",
      name: "Caminho da Tranquilidade",
      level: 3,
      description:
        "Os monges do Caminho da Tranquilidade buscam a paz interior e a compaixão, atuando como curandeiros e mediadores. Fonte: Sword Coast Adventurer's Guide / Xanathar's Guide to Everything.",
      features: [
        f(3, "Caminho da Tranquilidade", "No 3º nível, você ganha proficiência em Caligrafia ou Pintura, e Santuário (a magia santuário sobre você após um descanso longo; dura até atacar ou conjurar)."),
        f(6, "Mãos Curativas", "No 6º nível, como ação, você pode gastar 1 ponto de ki para restaurar PV a uma criatura que tocar (dado de arte marcial + Sabedoria), ou terminar uma condição."),
        f(11, "Emissário da Paz", "No 11º nível, como ação bônus, você ganha +10 em testes de Persuasão por 10 minutos."),
        f(17, "Apague as Chamas da Guerra", "No 17º nível, você pode conjurar acalmar emoções sem gastar espaço de magia ou componentes, usando Sabedoria. Uma vez por descanso longo."),
      ],
    },
  ],

  // =========================================================================
  paladino: [
    {
      id: "conquista",
      name: "Juramento da Conquista",
      level: 3,
      description:
        "O Juramento da Conquista é feito por paladinos que acreditam na ordem pelo poder, dominando o campo de batalha e esmagando os inimigos. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Magias de Juramento", "Magias sempre preparadas: 3º armadura de Agathys, comando; 5º arma espiritual, imobilizar pessoa; 9º rogar maldição, medo; 13º dominar fera, pele-rocha; 17º névoa mortal, dominar pessoa."),
        f(3, "Canalizar Divindade: Presença Conquistadora", "No 3º nível, como ação, você pode usar Canalizar Divindade para criar uma aura: criaturas a até 9 metros fazem teste de Sabedoria ou ficam amedrontadas por 1 minuto, com deslocamento reduzido a 0."),
        f(3, "Canalizar Divindade: Golpe Guiado", "No 3º nível, você pode gastar Canalizar Divindade para ganhar +10 em uma jogada de ataque."),
        f(7, "Aura de Conquista", "No 7º nível, criaturas amedrontadas a até 3 metros de você têm deslocamento 0, e sofrem dano psíquico igual à metade do seu nível de paladino no início do turno. A aura aumenta para 9 metros no 18º nível."),
        f(15, "Repreensão Desdenhosa", "No 15º nível, quando uma criatura o atingir com um ataque, ela sofre dano psíquico igual ao seu modificador de Carisma (mínimo 1)."),
        f(20, "Conquistador Invencível", "No 20º nível, como ação, você ganha resistência a todo dano, um ataque adicional por turno e crítico em 19-20 por 1 minuto. Uma vez por descanso longo."),
      ],
    },
    {
      id: "redencao",
      name: "Juramento da Redenção",
      level: 3,
      description:
        "O Juramento da Redenção compromete o paladino com a paz e a justiça pacífica, recorrendo à violência apenas em último caso. Fonte: Xanathar's Guide to Everything.",
      features: [
        f(3, "Magias de Juramento", "Magias sempre preparadas: 3º santuário, sono; 5º acalmar emoções, imobilizar pessoa; 9º contramágica, padrão hipnótico; 13º esfera resiliente de Otiluke, pele-rocha; 17º imobilizar monstro, muralha de energia."),
        f(3, "Canalizar Divindade: Emissário da Paz", "No 3º nível, como ação bônus, você ganha +5 em testes de Persuasão por 10 minutos."),
        f(3, "Canalizar Divindade: Repreender o Violento", "No 3º nível, como reação, quando uma criatura a até 9 metros causar dano a outra, você pode forçá-la a um teste de Sabedoria; em falha, sofre o dano que causou (radiante)."),
        f(7, "Aura do Guardião", "No 7º nível, como reação, quando você ou uma criatura a até 3 metros sofrer dano, você pode transferir o dano para si. Esse dano não é reduzido por resistências. A aura aumenta para 9 metros no 18º nível."),
        f(15, "Espírito Protetor", "No 15º nível, você recupera PV igual a 1d6 + metade do seu nível de paladino no fim do seu turno, se estiver com menos da metade dos PV."),
        f(20, "Emissário da Redenção", "No 20º nível, você ganha resistência a todo dano de criaturas que você não ataque, e reflete metade do dano de volta. A aura se mantém por 1 minuto, uma vez por descanso longo."),
      ],
    },
    {
      id: "gloria",
      name: "Juramento da Glória",
      level: 3,
      description:
        "O Juramento da Glória é feito por paladinos que acreditam que seu destino é a glória e que seu dever é inspirar, vencer e encarnar o ideal heroico. Fonte: Mythic Odysseys of Theros / Tasha's Cauldron of Everything.",
      features: [
        f(3, "Magias de Juramento", "Magias sempre preparadas: 3º raio guiado, heroísmo; 5º aprimorar habilidade, arma mágica; 9º velocidade, proteção contra energia; 13º compulsão, movimentação livre; 17º comunhão, coluna de chamas."),
        f(3, "Canalizar Divindade: Atleta Incomparável", "No 3º nível, como ação bônus, você ganha vantagem em testes de Atletismo e Acrobacia por 10 minutos e aumento de salto."),
        f(3, "Canalizar Divindade: Golpe Inspirador", "No 3º nível, depois de usar Destruição Divina, você pode usar Canalizar Divindade para conceder PV temporários (2d8 + seu nível de paladino) a aliados a até 9 metros."),
        f(7, "Aura de Agilidade", "No 7º nível, seu deslocamento aumenta em 3 metros, e aliados a até 1,5 metro também (a aura aumenta para 9 metros no 18º nível)."),
        f(15, "Defesa Gloriosa", "No 15º nível, como reação, quando você ou uma criatura a até 3 metros for atingido por um ataque, você pode adicionar seu modificador de Carisma à CA e, se o ataque falhar, atacar o agressor."),
        f(20, "Lenda Viva", "No 20º nível, como ação bônus, por 1 minuto, você ganha vantagem em testes de Carisma, pode jogar novamente um ataque que errou, e reduz dano crítico. Uma vez por descanso longo."),
      ],
    },
    {
      id: "vigilantes",
      name: "Juramento dos Vigilantes",
      level: 3,
      description:
        "O Juramento dos Vigilantes é feito por paladinos que protegem o mundo mortal de ameaças extraplanares, aberrações e magias de invasão. Fonte: Tasha's Cauldron of Everything.",
      features: [
        f(3, "Magias de Juramento", "Magias sempre preparadas: 3º alarme, detectar magia; 5º raio de luar, ver invisibilidade; 9º contramágica, não detecção; 13º aura de pureza, banimento; 17º imobilizar monstro, vidência."),
        f(3, "Canalizar Divindade: Vontade do Vigia", "No 3º nível, como ação, você faz uma aura: criaturas escolhidas ganham vantagem em testes de resistência de Inteligência, Sabedoria e Carisma, por 1 minuto."),
        f(3, "Canalizar Divindade: Abjurar o Extraplanar", "No 3º nível, como ação, você expulsa aberrações, celestiais, elementais, feéricos e ínferos a até 9 metros: eles fazem teste de Sabedoria ou ficam amedrontados."),
        f(7, "Aura da Sentinela", "No 7º nível, você e aliados a até 3 metros ganham bônus na iniciativa igual ao seu modificador de Carisma (aura de 9 metros no 18º nível)."),
        f(15, "Repreensão Vigilante", "No 15º nível, quando você é atingido por uma criatura que pode ser vista, você pode usar uma reação para causar 2d8 + Carisma de dano de energia ao atacante."),
        f(20, "Baluarte Mortal", "No 20º nível, como ação bônus, por 1 minuto, você obtém visão verdadeira de 9 metros, vantagem em ataques contra extraplanares, e pode banir criaturas a 36 metros. Uma vez por descanso longo."),
      ],
    },
    {
      id: "quebrador-de-juramento",
      name: "Quebrador de Juramento",
      level: 3,
      description:
        "Um paladino que quebrou seu juramento sagrado e caiu em desgraça, buscando poder sombrio e dominação em um caminho de trevas. Fonte: Dungeon Master's Guide.",
      features: [
        f(3, "Magias de Juramento", "Magias sempre preparadas: 3º repreensão infernal, infligir ferimentos; 5º coroa da loucura, escuridão; 9º animar mortos, rogar maldição; 13º definhar, confusão; 17º contágio, dominar pessoa."),
        f(3, "Canalizar Divindade: Controlar Mortos-vivos", "No 3º nível, como ação, você escolhe um morto-vivo a até 9 metros; ele faz um teste de Sabedoria ou fica sob seu comando por 24 horas."),
        f(3, "Canalizar Divindade: Aspecto Terrível", "No 3º nível, como ação, você emana uma aura aterrorizante: criaturas a até 9 metros fazem teste de Sabedoria ou ficam amedrontadas por 1 minuto."),
        f(7, "Aura de Ódio", "No 7º nível, você e seus asseclas (infernais e mortos-vivos) a até 3 metros adicionam seu modificador de Carisma ao dano corpo a corpo (mínimo +1). A aura aumenta para 9 metros no 18º nível."),
        f(15, "Resistência Sobrenatural", "No 15º nível, você ganha resistência a dano contundente, cortante e perfurante de armas não-mágicas."),
        f(20, "Senhor do Pavor", "No 20º nível, como ação, você assume uma forma sombria por 1 minuto: aura de 9 metros de penumbra, criaturas inimigas têm desvantagem e você causa dano necrótico adicional. Uma vez por descanso longo."),
      ],
    },
  ],
};
