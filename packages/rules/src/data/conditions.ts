// Condições (Livro do Jogador, apêndice A) e regras-chave de jogo (capítulos 7-9), em PT-BR.
import type { Condition } from "../types";

export const CONDITIONS: Condition[] = [
  {
    id: "agarrado",
    name: "Agarrado",
    description: [
      "O deslocamento de uma criatura agarrada se torna 0, e ela não pode se beneficiar de qualquer bônus em seu deslocamento.",
      "A condição encerra caso a criatura que a agarrou fique incapacitada.",
      "A condição se encerra se um efeito, como o causado pela magia onda trovejante, remover a criatura agarrada do alcance da criatura que a agarrou ou do efeito que causa a condição.",
    ],
  },
  {
    id: "amedrontado",
    name: "Amedrontado",
    description: [
      "Uma criatura amedrontada sofre desvantagem em testes de habilidade e jogadas de ataque enquanto a fonte do seu medo estiver em sua linha de visão.",
      "A criatura não pode se mover voluntariamente para uma posição que a faça terminar o turno mais próxima da sua fonte de medo do que sua posição inicial.",
    ],
  },
  {
    id: "atordoado",
    name: "Atordoado",
    description: [
      "Uma criatura atordoada está incapacitada. Ela não pode se mover e somente pode falar hesitantemente.",
      "A criatura falha automaticamente em testes de resistência de Força ou Destreza.",
      "Jogadas de ataque contra a criatura possuem vantagem.",
    ],
  },
  {
    id: "caido",
    name: "Caído",
    description: [
      "A única opção de movimento que uma criatura caída tem é rastejar, a menos que ela se levante, encerrando assim a condição.",
      "A criatura sofre desvantagem nas jogadas de ataque.",
      "Uma jogada de ataque contra a criatura possui vantagem se o atacante estiver a 1,5 metro dela. De qualquer outra forma a jogada sofre desvantagem.",
    ],
  },
  {
    id: "cego",
    name: "Cego",
    description: [
      "Uma criatura cega falha automaticamente em qualquer teste de habilidade que requeira o uso da visão.",
      "Jogadas de ataque contra a criatura possuem vantagem, e os ataques da criatura sofrem desvantagem.",
    ],
  },
  {
    id: "surdo",
    name: "Surdo",
    description: [
      "Uma criatura surda falha automaticamente em qualquer teste de habilidade que requeira o uso da audição.",
    ],
  },
  {
    id: "enfeiticado",
    name: "Enfeitiçado",
    description: [
      "Uma criatura enfeitiçada não pode atacar quem a enfeitiçou ou tê-lo como alvo de habilidades ou efeitos mágicos nocivos.",
      "Quem a enfeitiçou possui vantagem em testes de habilidade feitos para interagir socialmente com a criatura.",
    ],
  },
  {
    id: "envenenado",
    name: "Envenenado",
    description: ["Uma criatura envenenada sofre desvantagem em jogadas de ataque e testes de habilidade."],
  },
  {
    id: "incapacitado",
    name: "Incapacitado",
    description: ["Uma criatura incapacitada não pode realizar ações ou reações."],
  },
  {
    id: "inconsciente",
    name: "Inconsciente",
    description: [
      "Uma criatura inconsciente está incapacitada. Ela não pode se mover ou falar e não tem ciência de seus arredores.",
      "A criatura larga tudo que estiver segurando e fica caída.",
      "A criatura falha automaticamente em testes de resistência de Força ou Destreza.",
      "Jogadas de ataque contra a criatura possuem vantagem.",
      "Qualquer ataque que atinja a criatura é um acerto crítico, se o atacante estiver a 1,5 metro dela.",
    ],
  },
  {
    id: "invisivel",
    name: "Invisível",
    description: [
      "Uma criatura invisível é impossível de ser vista sem a ajuda de magia ou sentidos especiais. Para o propósito de se esconder, a criatura é considerada em área de escuridão densa. A localização da criatura pode ser detectada por qualquer barulho que ela faça ou rastros que ela deixe.",
      "Jogadas de ataque contra a criatura sofrem desvantagem, e os ataques da criatura possuem vantagem.",
    ],
  },
  {
    id: "paralisado",
    name: "Paralisado",
    description: [
      "Uma criatura paralisada está incapacitada. Ela não pode se mover ou falar.",
      "A criatura falha automaticamente em testes de resistência de Força e Destreza.",
      "Jogadas de ataque contra a criatura possuem vantagem.",
      "Qualquer ataque que atinja a criatura é um acerto crítico, se o atacante estiver a 1,5 metro dela.",
    ],
  },
  {
    id: "petrificado",
    name: "Petrificado",
    description: [
      "Uma criatura petrificada está transformada, juntamente com todos os objetos não-mágicos que estiver vestindo ou carregando, em uma substância sólida e inanimada (geralmente pedra). Seu peso é multiplicado por dez, e ela para de envelhecer.",
      "A criatura está incapacitada, não pode se mover ou falar, e não tem ciência de seus arredores.",
      "Jogadas de ataque contra a criatura possuem vantagem.",
      "A criatura falha automaticamente em testes de resistência de Força e Destreza.",
      "A criatura tem resistência a todos os tipos de dano.",
      "A criatura é imune a veneno e doenças, embora um veneno ou doença previamente presente em seu sistema seja apenas suspenso, não neutralizado.",
    ],
  },
  {
    // Chamada de "Contido" em algumas traduções; no Livro do Jogador PT-BR é "Impedido".
    id: "impedido",
    name: "Impedido",
    description: [
      "O deslocamento de uma criatura impedida (contida) se torna 0, e ela não pode se beneficiar de qualquer bônus em seu deslocamento.",
      "Jogadas de ataque contra a criatura possuem vantagem, e os ataques da criatura sofrem desvantagem.",
      "A criatura sofre desvantagem em testes de resistência de Destreza.",
    ],
  },
  {
    id: "exaustao",
    name: "Exaustão",
    description: [
      "Algumas habilidades especiais e perigos ambientais, como fome e exposição prolongada a temperaturas congelantes ou escaldantes, podem impor uma condição especial chamada exaustão. A exaustão é medida em seis níveis.",
      "Nível 1: Desvantagem em testes de habilidade.",
      "Nível 2: Deslocamento reduzido à metade.",
      "Nível 3: Desvantagem nas jogadas de ataque e testes de resistência.",
      "Nível 4: Máximo de pontos de vida reduzido à metade.",
      "Nível 5: Deslocamento reduzido a 0.",
      "Nível 6: Morte.",
      "Se uma criatura que já possui um nível de exaustão sofrer outro efeito que também causa exaustão, o nível atual aumenta na quantidade especificada pelo efeito.",
      "A criatura sofre o efeito do seu nível atual e também de todos os níveis anteriores. Por exemplo, uma criatura no nível 2 tem o deslocamento reduzido à metade e sofre desvantagem em testes de habilidade.",
      "Um efeito que remova exaustão reduz seu nível, com todos os efeitos desaparecendo se o nível for reduzido abaixo de 1.",
      "Terminar um descanso longo reduz a exaustão de uma criatura em 1 nível, contanto que ela também tenha ingerido um pouco de água e comida.",
    ],
  },
];

export const RULE_SECTIONS: { id: string; title: string; body: string[] }[] = [
  {
    id: "vantagem-desvantagem",
    title: "Vantagem e Desvantagem",
    body: [
      "Quando uma habilidade especial ou magia concede vantagem ou desvantagem em um teste de habilidade, teste de resistência ou jogada de ataque, jogue um segundo d20. Use o resultado mais alto se tiver vantagem e o mais baixo se tiver desvantagem.",
      "Se múltiplas situações dão vantagem ou impõem desvantagem, você ainda joga apenas um d20 adicional.",
      "Se uma jogada tiver tanto vantagem quanto desvantagem, considera-se que você não possui nenhuma delas e joga apenas um d20, mesmo que haja várias fontes de um lado e apenas uma do outro.",
      "Se algo permite refazer a jogada de um d20 (como o traço Sortudo dos halflings) enquanto você tem vantagem ou desvantagem, só um dos dados pode ser jogado de novo, à sua escolha.",
    ],
  },
  {
    id: "descanso-curto",
    title: "Descanso Curto",
    body: [
      "Um descanso curto é um período de inatividade com pelo menos 1 hora de duração, durante o qual o personagem não faz nada mais árduo do que comer, beber, ler e tratar seus ferimentos.",
      "O personagem pode gastar um ou mais Dados de Vida no final do descanso, até o máximo de Dados de Vida que possui (igual ao seu nível). Para cada Dado de Vida gasto, o jogador joga o dado e adiciona seu modificador de Constituição; o personagem recupera pontos de vida iguais a essa jogada. O jogador pode decidir gastar um Dado de Vida adicional após cada jogada.",
    ],
  },
  {
    id: "descanso-longo",
    title: "Descanso Longo",
    body: [
      "Um descanso longo é um período de inatividade prolongada, com pelo menos 8 horas de duração, durante o qual o personagem dorme ou exerce atividades leves: ler, falar, comer ou vigiar por não mais de 2 horas.",
      "Se o descanso for interrompido por um período de atividade extenuante (pelo menos 1 hora de caminhada, combate, conjuração de magias ou atividades semelhantes), o personagem deve começar o descanso de novo para ganhar algum benefício.",
      "No final do descanso, o personagem recupera todos os pontos de vida perdidos e recupera Dados de Vida gastos até um total igual à metade de seus Dados de Vida (mínimo de 1). Por exemplo, com oito Dados de Vida, recupera quatro.",
      "Um personagem não pode se beneficiar de mais de um descanso longo em um período de 24 horas, e deve ter pelo menos 1 ponto de vida no início do descanso para obter seus benefícios.",
    ],
  },
  {
    id: "surpresa",
    title: "Surpresa",
    body: [
      "O Mestre determina quem pode estar surpreso. Se nenhum dos lados tenta ser furtivo, eles automaticamente se percebem. Caso contrário, o Mestre compara os testes de Destreza (Furtividade) de quem está escondido com a Sabedoria (Percepção) Passiva de cada criatura do lado oposto. Quem não notar a ameaça está surpreso no início do encontro.",
      "Se você estiver surpreso, não pode se mover nem realizar uma ação no primeiro turno do combate, e também não pode usar uma reação até que aquele turno termine. Um membro de um grupo pode ser surpreendido mesmo se outro não for.",
    ],
  },
  {
    id: "ordem-do-combate",
    title: "Ordem do Combate e Iniciativa",
    body: [
      "1. Determine surpresa. 2. Estabeleça posições. 3. Jogue iniciativa. 4. Jogue os turnos, cada participante na ordem da iniciativa. 5. Comece a próxima rodada quando todos tiverem jogado seus turnos; repita o passo 4 até que a luta acabe.",
      "A iniciativa é um teste de Destreza de cada participante. Os combatentes agem em ordem do valor mais alto ao mais baixo, e a ordem permanece a mesma durante todas as rodadas. O Mestre faz uma jogada para um grupo de criaturas idênticas.",
      "Em caso de empate, o Mestre decide a ordem entre os que ele controla e os jogadores decidem entre seus personagens. Entre um monstro e um personagem, o Mestre decide (ou pede um d20 a cada um).",
    ],
  },
  {
    id: "seu-turno",
    title: "Seu Turno: Movimento, Ação, Ação Bônus e Reação",
    body: [
      "No seu turno, você pode se mover uma distância igual ao seu deslocamento e realizar uma ação, na ordem que preferir. Você pode abrir mão do movimento ou da ação, ou não fazer nada.",
      "Ação bônus: você só pode realizar uma ação bônus quando uma habilidade, magia ou característica afirmar que pode, e apenas uma por turno.",
      "Reação: resposta instantânea a um gatilho, que pode ocorrer no seu turno ou no de outrem. Você pode realizar apenas uma reação até o início do seu próximo turno. O ataque de oportunidade é a reação mais comum.",
      "Outras atividades: você pode se comunicar por expressões ou gestos breves e interagir livremente com um objeto ou característica do ambiente (por exemplo, sacar a arma ao atacar ou abrir uma porta ao se mover). Interagir com um segundo objeto exige a ação Usar um Objeto.",
    ],
  },
  {
    id: "movimento",
    title: "Movimento e Posição",
    body: [
      "Você pode quebrar seu movimento, usando parte do deslocamento antes e depois da ação, e se mover entre ataques quando a ação Atacar inclui mais de um ataque.",
      "Terreno difícil: cada 1,5 metro de movimento custa 1,5 metro adicional. O espaço ocupado por outra criatura, hostil ou não, também conta como terreno difícil.",
      "Estar caído: você pode se jogar ao chão sem custo de deslocamento; levantar-se custa metade do seu deslocamento. Enquanto estiver deitado, cada 1,5 metro rastejado custa 1,5 metro adicional.",
      "Você pode se mover pelo espaço de criaturas não hostis. Pode se mover pelo espaço de uma criatura hostil apenas se ela for duas categorias de tamanho maior ou menor que você. Você não pode terminar o movimento no espaço de outra criatura.",
    ],
  },
  {
    id: "acoes-em-combate",
    title: "Ações em Combate",
    body: [
      "Ajudar: a criatura que você ajuda tem vantagem no próximo teste de habilidade para completar a atividade, se o fizer antes do começo do seu próximo turno. Alternativamente, você ajuda um aliado a atacar uma criatura a até 1,5 metro de você: a primeira jogada de ataque dele contra o alvo, antes do seu próximo turno, tem vantagem.",
      "Atacar: realiza um ataque corpo a corpo ou à distância. Características como Ataque Extra permitem mais de um ataque com essa ação.",
      "Conjurar uma Magia: o tempo de conjuração da magia define se gasta uma ação, uma reação, minutos ou horas.",
      "Desengajar: seu movimento não provoca ataques de oportunidade pelo resto do turno.",
      "Disparada: você ganha deslocamento adicional no turno igual ao seu deslocamento, depois de aplicar modificadores.",
      "Esconder: você faz um teste de Destreza (Furtividade) para tentar se esconder.",
      "Esquivar: até o início do seu próximo turno, jogadas de ataque contra você têm desvantagem se você puder ver o atacante, e você tem vantagem em testes de resistência de Destreza. Perde o benefício se estiver incapacitado ou com deslocamento 0.",
      "Preparar: escolha um gatilho perceptível e a ação (ou movimento) que fará em resposta, usando sua reação. Você tem até o início do seu próximo turno para usá-la. Preparar uma magia exige tempo de conjuração de 1 ação e concentração para segurar a energia; se a concentração for quebrada, a magia se dissipa sem efeito.",
      "Procurar: você foca sua atenção em encontrar algo; o Mestre pode pedir um teste de Sabedoria (Percepção) ou Inteligência (Investigação).",
      "Usar um Objeto: necessária quando o objeto exige sua ação ou quando você quer interagir com mais de um objeto por turno.",
      "Improvisar uma ação: o Mestre diz se é possível e que jogada, se houver, determina o sucesso.",
    ],
  },
  {
    id: "realizando-um-ataque",
    title: "Realizando um Ataque",
    body: [
      "1. Escolha o alvo dentro do alcance. 2. Determine os modificadores (cobertura, vantagem ou desvantagem, bônus e penalidades). 3. Resolva o ataque: jogue um d20 e adicione os modificadores; se o total igualar ou superar a CA do alvo, o ataque acerta e você joga o dano.",
      "Modificadores: a Força para armas corpo a corpo e a Destreza para armas à distância (acuidade e arremesso são exceções), mais o bônus de proficiência se for proficiente com a arma ou com a magia.",
      "Rolando 1 ou 20: um 20 natural sempre acerta e é um acerto crítico; um 1 natural sempre erra.",
      "Acerto crítico: jogue todos os dados de dano do ataque duas vezes e some, depois adicione os modificadores normalmente.",
      "Ataque desarmado: causa dano de concussão igual a 1 + modificador de Força. Você é proficiente com ataques desarmados.",
    ],
  },
  {
    id: "alvos-ocultos",
    title: "Atacantes e Alvos Ocultos",
    body: [
      "Quando você ataca um alvo que não pode ver, tem desvantagem na jogada de ataque, mesmo se estiver adivinhando a localização. Se o alvo não estiver onde você mirou, o ataque erra; o Mestre geralmente diz apenas que errou.",
      "Quando uma criatura não pode ver você, você tem vantagem nas jogadas de ataque contra ela.",
      "Se você está escondido, sem ser visto e ouvido, ao realizar um ataque, revela sua localização, acertando ou não.",
    ],
  },
  {
    id: "ataques-a-distancia",
    title: "Ataques à Distância",
    body: [
      "Armas com duas distâncias: o menor número é a distância normal e o maior é a distância longa. A jogada tem desvantagem se o alvo estiver além da distância normal, e você não pode atacar além da distância longa.",
      "Ataque à distância engajado: você tem desvantagem na jogada de ataque se estiver a 1,5 metro de uma criatura hostil que possa vê-lo e não esteja incapacitada.",
    ],
  },
  {
    id: "ataque-de-oportunidade",
    title: "Ataque de Oportunidade",
    body: [
      "Você pode realizar um ataque de oportunidade quando um inimigo que você possa ver se move para fora do seu alcance. Usa sua reação e faz um ataque corpo a corpo contra a criatura; o ataque interrompe o movimento dela um instante antes de deixar seu alcance.",
      "Você pode evitar provocar o ataque realizando a ação Desengajar. Também não se provoca ataque de oportunidade ao se teletransportar ou quando algo move você sem usar sua ação, deslocamento ou reação (por exemplo, uma explosão ou a queda).",
    ],
  },
  {
    id: "duas-armas",
    title: "Combater com Duas Armas",
    body: [
      "Quando você realiza a ação Atacar com uma arma corpo a corpo leve empunhada em uma mão, pode usar uma ação bônus para atacar com uma arma corpo a corpo leve diferente na outra mão. Você não adiciona o modificador de habilidade ao dano desse ataque extra, a menos que o modificador seja negativo.",
      "Se a arma possuir a propriedade arremesso, você pode arremessá-la em vez de realizar um ataque corpo a corpo com ela.",
    ],
  },
  {
    id: "agarrao",
    title: "Agarrão",
    body: [
      "Com a ação Atacar, você pode substituir um ataque por um agarrão. O alvo deve ser no máximo uma categoria de tamanho maior que você e estar ao seu alcance. Usando pelo menos uma mão livre, faça um teste de Força (Atletismo) resistido pelo teste de Força (Atletismo) ou Destreza (Acrobacia) do alvo (à escolha dele). Se vencer, o alvo fica agarrado; você pode soltá-lo quando quiser, sem ação.",
      "Escapar: a criatura agarrada usa uma ação e vence um teste de Força (Atletismo) ou Destreza (Acrobacia) resistido pelo seu teste de Força (Atletismo).",
      "Movendo uma criatura agarrada: você pode arrastá-la ou carregá-la, mas seu deslocamento cai pela metade, a menos que ela seja duas ou mais categorias de tamanho menor que você.",
    ],
  },
  {
    id: "encontrao",
    title: "Encontrão em uma Criatura",
    body: [
      "Com a ação Atacar, você pode substituir um ataque por um encontrão. O alvo deve ser no máximo uma categoria de tamanho maior que você e estar ao seu alcance. Faça um teste de Força (Atletismo) resistido pelo teste de Força (Atletismo) ou Destreza (Acrobacia) do alvo (à escolha dele). Se vencer, você pode derrubar o alvo no chão ou empurrá-lo 1,5 metro para longe de você.",
    ],
  },
  {
    id: "cobertura",
    title: "Cobertura",
    body: [
      "O alvo só se beneficia de cobertura quando o ataque ou efeito se origina do lado oposto dela. Se houver várias fontes, aplica-se apenas a de maior grau; os graus não se somam.",
      "Meia-cobertura: +2 de bônus na CA e nos testes de resistência de Destreza. Um obstáculo bloqueia pelo menos metade do corpo do alvo (mureta, mobília grande, tronco estreito ou outra criatura, inimiga ou amigável).",
      "Três-quartos de cobertura: +5 de bônus na CA e nos testes de resistência de Destreza. Pelo menos três quartos do corpo estão cobertos (grade levadiça, seteira, tronco robusto).",
      "Cobertura total: o alvo não pode ser alvo direto de ataque ou magia, mas algumas magias o alcançam ao incluí-lo na área do efeito. Ocorre quando ele está completamente protegido por um obstáculo.",
    ],
  },
  {
    id: "dano-e-cura",
    title: "Dano, Resistência e Cura",
    body: [
      "Ao atacar com arma, você adiciona o modificador de habilidade ao dano, o mesmo usado na jogada de ataque. Se um efeito causa dano a vários alvos ao mesmo tempo, jogue o dano uma única vez para todos.",
      "Resistência: o dano daquele tipo é reduzido pela metade. Vulnerabilidade: o dano é dobrado. São aplicadas depois de todos os outros modificadores de dano, e múltiplas resistências ou vulnerabilidades ao mesmo tipo contam apenas como uma.",
      "Cura: os pontos de vida recuperados são somados aos atuais, sem exceder o máximo. Uma criatura morta só recupera pontos de vida por magias como reviver.",
      "Pontos de vida temporários: são perdidos primeiro e não são somados entre si (você escolhe manter os atuais ou os novos). Cura não os recupera, e eles não estabilizam nem acordam quem está com 0 PV. Duram até acabarem ou até você terminar um descanso longo, salvo duração específica.",
    ],
  },
  {
    id: "morte-e-salvaguardas",
    title: "Morte e Testes de Resistência Contra a Morte",
    body: [
      "Ao cair a 0 pontos de vida, você morre direto ou fica inconsciente.",
      "Morte instantânea: se o dano reduz seus PV a 0 e o dano restante é igual ou maior que seu máximo de pontos de vida, você morre.",
      "Caindo inconsciente: se o dano reduz seus PV a 0 sem matá-lo, você cai inconsciente. Isso acaba quando você recupera quaisquer pontos de vida.",
      "Sempre que começar seu turno com 0 PV, faça um teste de resistência contra a morte (d20 sem modificador de habilidade): 10 ou mais é sucesso; caso contrário, fracasso. Três sucessos estabilizam você; três fracassos matam você. Não precisam ser consecutivos, e a contagem zera quando você recupera PV ou se estabiliza.",
      "Um 1 natural conta como dois fracassos. Um 20 natural faz você recuperar 1 ponto de vida.",
      "Sofrer dano com 0 PV causa um fracasso (dois se for um acerto crítico). Se o dano for igual ou maior que seu máximo de PV, você morre instantaneamente.",
    ],
  },
  {
    id: "estabilizando",
    title: "Estabilizando, Nocautear e Monstros",
    body: [
      "Estabilizar: use sua ação para administrar primeiros socorros a uma criatura inconsciente, com um teste de Sabedoria (Medicina) CD 10. Uma criatura estável com 0 PV não faz testes de resistência contra a morte.",
      "Nocautear: ao reduzir uma criatura a 0 PV com um ataque corpo a corpo, o atacante pode escolher nocauteá-la; ela cai inconsciente e estável.",
      "Monstros: a maioria dos Mestres declara um monstro morto ao cair a 0 PV; vilões poderosos e PdMs especiais seguem as regras dos personagens jogadores.",
    ],
  },
  {
    id: "combate-montado",
    title: "Combate Montado",
    body: [
      "Uma criatura disposta, de até uma categoria de tamanho maior que a sua e de anatomia adequada, pode servir de montaria.",
      "Montar ou desmontar uma vez durante seu movimento custa metade do seu deslocamento, e a criatura deve estar a até 1,5 metro.",
      "Se um efeito mover a montaria contra a sua vontade, ou se você for derrubado, faça um teste de resistência de Destreza ou caia da montaria, ficando caído a 1,5 metro dela. Se a montaria for derrubada, você pode usar sua reação para desmontar e permanecer de pé.",
    ],
  },
  {
    id: "queda",
    title: "Queda",
    body: [
      "Ao final de uma queda, a criatura sofre 1d6 de dano de concussão para cada 3 metros de queda, até um máximo de 20d6, e cai derrubada, a menos que evite o dano.",
    ],
  },
  {
    id: "asfixia",
    title: "Asfixia",
    body: [
      "Uma criatura pode prender a respiração por 1 + seu modificador de Constituição minutos (mínimo de 30 segundos). Sem ar, sobrevive por um número de rodadas igual ao seu modificador de Constituição (mínimo 1). No início do turno seguinte, cai a 0 pontos de vida e está morrendo.",
    ],
  },
  {
    id: "luz-e-visao",
    title: "Luz e Visão",
    body: [
      "Escuridão leve (penumbra, névoa, folhagem): desvantagem em testes de Sabedoria (Percepção) que dependem da visão. Escuridão pesada (escuridão, nevoeiro espesso, folhagem densa): bloqueia a visão por completo; a criatura efetivamente fica cega.",
      "Luz plena permite enxergar normalmente. Penumbra cria uma área de escuridão leve. Escuridão cria uma área de escuridão pesada.",
      "Visão no escuro: dentro de um alcance, enxerga na escuridão como se fosse penumbra, mas apenas em tons de cinza. Sentido cego: percebe os arredores sem depender da visão dentro de um raio. Visão verdadeira: enxerga na escuridão normal e mágica, criaturas invisíveis, detecta ilusões visuais e formas originais, e vê no Plano Etéreo.",
    ],
  },
  {
    id: "agua-e-comida",
    title: "Água e Comida",
    body: [
      "Quem não come ou bebe sofre exaustão, que só é removida quando o personagem consome a quantidade total necessária.",
      "Água: 3 litros por dia (6 litros se o tempo estiver quente). Quem bebe apenas metade deve ser bem-sucedido em um teste de resistência de Constituição CD 15 ou sofre um nível de exaustão ao fim do dia; com menos que isso, sofre automaticamente um nível. Se já tiver exaustão, sofre dois níveis em ambos os casos.",
    ],
  },
  {
    id: "armaduras-e-proficiencia",
    title: "Armaduras e Proficiência",
    body: [
      "Vestir armadura sem proficiência impõe desvantagem em qualquer teste de habilidade, teste de resistência ou jogada de ataque que envolvam Força ou Destreza, e impede de lançar magias.",
      "Se a armadura exigir Força (por exemplo, For 13 ou For 15) e você não a tiver, seu deslocamento é reduzido em 3 metros. Desvantagem em Furtividade impõe desvantagem em testes de Destreza (Furtividade). Armaduras leves somam o modificador de Destreza à CA; médias, até +2; pesadas, nenhum. Um escudo aumenta a CA em 2, e só um escudo pode ser usado por vez.",
      "Tempo para vestir/remover: armadura leve 1 minuto/1 minuto; média 5 minutos/1 minuto; pesada 10 minutos/5 minutos; escudo 1 ação/1 ação.",
    ],
  },
  {
    id: "testes-de-habilidade",
    title: "Testes de Habilidade e de Resistência",
    body: [
      "Teste de habilidade: d20 + modificador da habilidade (+ proficiência, se aplicável) contra a CD; igualar ou superar é sucesso. CDs típicas: muito fácil 5, fácil 10, moderada 15, difícil 20, muito difícil 25, quase impossível 30.",
      "Teste de resistência: d20 + modificador da habilidade (+ proficiência, se tiver no teste) contra a CD definida pelo efeito. Teste resistido: os dois lados rolam; o maior total vence e, em caso de empate, a situação permanece como estava.",
      "Teste passivo: sem rolagem, vale 10 + os modificadores do teste; +5 com vantagem, −5 com desvantagem.",
      "Trabalho em equipe: quem lidera faz o teste com vantagem; só ajuda quem poderia tentar a tarefa sozinho e se a colaboração fizer sentido. Teste em grupo: todos rolam e o grupo tem sucesso se pelo menos metade passar.",
    ],
  },
  {
    id: "carga",
    title: "Erguer e Carregar",
    body: [
      "Capacidade de carga: Força × 7,5 kg. Empurrar, arrastar ou erguer: até o dobro da capacidade (Força × 15 kg); acima da capacidade de carga, o deslocamento cai para 1,5 metro.",
      "Cada categoria acima de Médio dobra esses valores; criatura Miúda fica com a metade.",
      "Variação (sobrecarga): acima de Força × 2,5 kg, −3 metros de deslocamento. Acima de Força × 5 kg, até a capacidade máxima, −6 metros e desvantagem em testes de habilidade, ataques e testes de resistência de Força, Destreza ou Constituição. Com esta variação, ignore a coluna Força da tabela de armaduras.",
    ],
  },
  {
    id: "esconder-se",
    title: "Esconder-se",
    body: [
      "Faça um teste de Destreza (Furtividade). Até ser descoberto ou parar de se esconder, esse total é resistido pela Sabedoria (Percepção) de quem procurar ativamente; quem não procura é comparado pela Percepção passiva.",
      "Não é possível se esconder de quem vê você claramente, e fazer barulho revela sua posição. Criatura invisível sempre pode tentar se esconder, mas ainda deixa rastros e precisa ficar em silêncio. Em combate, sair do esconderijo e se aproximar normalmente revela você; o Mestre pode permitir que continue oculto diante de um alvo distraído, ganhando vantagem no ataque.",
    ],
  },
  {
    id: "viagem",
    title: "Ritmo de Viagem",
    body: [
      "Rápido: 120 metros/minuto, 6 km/hora, 45 km/dia; −5 em Sabedoria (Percepção) passiva. Normal: 90 metros/minuto, 4,5 km/hora, 36 km/dia. Lento: 60 metros/minuto, 3 km/hora, 27 km/dia; permite furtividade.",
      "Terreno difícil: cada 1,5 metro custa 3 metros de deslocamento, o que reduz à metade a distância por minuto, hora ou dia.",
      "Ordem de marcha: defina linha de frente, intermediárias e retaguarda; com só uma linha, ela conta como frente. Só quem viaja em ritmo lento e fora de local aberto pode tentar surpreender ou passar despercebido.",
    ],
  },
  {
    id: "movimento-especial",
    title: "Escalar, Nadar e Saltar",
    body: [
      "Escalar ou nadar: cada 1,5 metro custa 1,5 metro extra (3 metros extras em terreno difícil), a menos que a criatura tenha esse tipo de deslocamento. Superfícies escorregadias ou água agitada podem exigir Força (Atletismo).",
      "Salto em distância: Força × 0,3 metro após correr pelo menos 3 metros; metade sem corrida. Cada metro saltado custa um metro de deslocamento. Obstáculo baixo (até 1/4 da distância saltada) pode pedir Força (Atletismo) CD 10; aterrissar em terreno difícil pede Destreza (Acrobacia) CD 10 ou você cai.",
      "Salto em altura: 0,3 × (3 + modificador de Força) metros após correr pelo menos 3 metros; metade sem corrida. Você ainda pode estender os braços e alcançar a altura do salto + 1,5 vez a sua altura.",
    ],
  },
  {
    id: "tamanho",
    title: "Tamanho e Espaço",
    body: [
      "Espaço ocupado em combate: Miúdo 0,75 × 0,75 m; Pequeno e Médio 1,5 × 1,5 m; Grande 3 × 3 m; Enorme 4,5 × 4,5 m; Imenso 6 × 6 m ou mais.",
    ],
  },
  {
    id: "combate-submerso",
    title: "Combate Submerso",
    body: [
      "Corpo a corpo: sem deslocamento de natação, desvantagem no ataque, exceto com adaga, azagaia, espada curta, lança ou tridente.",
      "À distância: erra automaticamente além da distância normal; dentro dela, desvantagem, exceto com besta, rede ou arma de arremesso (azagaia, lança, tridente, dardo).",
      "Criaturas e objetos totalmente submersos têm resistência a dano de fogo.",
    ],
  },
  {
    id: "conjuracao",
    title: "Conjuração de Magias",
    body: [
      "Espaço de nível superior: a magia passa a ser daquele nível, e algumas ficam mais fortes. Truques têm nível 0, não usam espaço e não precisam ser preparados.",
      "Ritual: leva 10 minutos a mais, não gasta espaço e por isso não pode ser conjurado em nível superior. Exige uma característica que permita rituais e, em geral, a magia preparada ou conhecida.",
      "Ação bônus: quem conjura magia assim no turno só pode conjurar outra naquele turno se for um truque com tempo de 1 ação. Tempos maiores que 1 ação: gaste a ação a cada turno e mantenha concentração; se ela for quebrada, a magia falha sem gastar o espaço.",
      "Componentes: V exige poder falar; S exige ao menos uma mão livre; M pode ser suprido por bolsa de componentes ou foco, salvo quando tem custo indicado ou é consumido. A mão que acessa os materiais pode ser a mesma dos gestos.",
      "Concentração: só uma magia por vez; você pode encerrá-la sem gastar ação. Termina ao conjurar outra magia de concentração, ficar incapacitado ou morrer. Ao sofrer dano, faça teste de resistência de Constituição CD 10 ou metade do dano, o que for maior, um teste por fonte de dano.",
      "Alvos: é preciso caminho livre, sem cobertura total. Se escolher um ponto de origem que não vê e houver obstáculo no caminho, a área surge no lado mais próximo do obstáculo. Se o alvo é à sua escolha, pode ser você mesmo, salvo indicação em contrário.",
      "Áreas: cilindro, cone, cubo, esfera e linha partem de um ponto de origem, e cobertura total bloqueia a expansão. O ponto de origem está incluído no cilindro e na esfera, mas não no cone, no cubo nem na linha, a menos que você queira.",
    ],
  },
  {
    id: "propriedades-das-armas",
    title: "Propriedades das Armas",
    body: [
      "Acuidade: use Força ou Destreza, a mesma no ataque e no dano. Alcance: +1,5 metro de alcance, inclusive em ataques de oportunidade. Arremesso: ataque à distância usando o mesmo modificador do corpo a corpo. Distância (normal/máxima): além da normal há desvantagem; além da máxima não é possível atacar.",
      "Duas mãos: exige as duas mãos para atacar. Leve: permite combater com duas armas. Munição: gasta uma peça por ataque; sacar faz parte do ataque, e metade pode ser recuperada com 1 minuto de busca após a batalha. Pesada: criaturas Pequenas têm desvantagem. Recarga: apenas uma peça por ação, ação bônus ou reação. Versátil: o valor entre parênteses vale ao usar com duas mãos.",
      "Lança de Montaria: desvantagem contra alvo a até 1,5 metro; exige duas mãos quando você não está montado. Rede: criatura Grande ou menor atingida fica impedida (sem efeito em quem não tem forma definida ou é Enorme ou maior); livra-se com Força CD 10 ou causando 5 de dano cortante à rede (CA 10); ataques com ela são limitados a um por ação, ação bônus ou reação.",
      "Armas improvisadas: um objeto parecido com uma arma pode ser tratado como ela, a critério do Mestre. Os demais causam 1d4; arremesso improvisado tem distância 6/18. Prateação: 100 po para uma arma ou 10 munições.",
    ],
  },
  {
    id: "moedas-e-despesas",
    title: "Moedas, Comércio e Despesas",
    body: [
      "Câmbio: 1 po = 10 pp = 100 pc; 1 pe = 5 pp; 1 pl = 10 po. Cem moedas pesam cerca de 1 kg.",
      "Comércio (por 0,5 kg, salvo indicação): trigo 1 pc; farinha ou uma galinha 2 pc; sal 5 pc; ferro ou 1 m² de lona 1 pp; cobre ou 1 m² de algodão 5 pp; gengibre ou uma cabra 1 po; canela, pimenta ou uma ovelha 2 po; cravos ou um porco 3 po; prata ou 1 m² de linho 5 po; 1 m² de seda ou uma vaca 10 po; açafrão ou um boi 15 po; ouro 50 po; platina 500 po.",
      "Estilo de vida por dia: miserável sem custo; esquálido 1 pp; pobre 2 pp; modesto 1 po; confortável 2 po; rico 4 po; aristocrático 10 po ou mais.",
      "Hospedagem por dia: esquálida 7 pc; pobre 1 pp; modesta 5 pp; confortável 8 pp; rica 2 po; aristocrática 4 po. Refeições por dia: esquálida 3 pc; pobre 6 pc; modesta 3 pp; confortável 5 pp; rica 8 pp; aristocrática 2 po.",
      "Comida e bebida: banquete 10 po por pessoa; pedaço de carne 3 pp; pão 2 pc; queijo 1 pp; cerveja 2 pp o galão ou 4 pc a caneca; vinho comum 2 pp a jarra; vinho fino 10 po a garrafa.",
      "Serviços: condutor 1 pc na cidade ou 2 pc por km entre cidades; mensageiro 1 pc por km; passagem de navio 6 pc por km; pedágio 1 pc; serviçal destreinado 2 pp por dia; treinado 2 po por dia. Magia de 1º ou 2º nível contratada: de 10 a 50 po, mais componentes; níveis superiores são raros e costumam exigir favores.",
    ],
  },
  {
    id: "tempo-livre",
    title: "Atividades em Tempo Livre",
    body: [
      "Cada dia conta se houver pelo menos 8 horas dedicadas à atividade; os dias não precisam ser seguidos.",
      "Construir itens: exige proficiência com a ferramenta. Avança 5 po de valor de mercado por dia, e cada participante soma 5 po; gaste metade do valor em matéria-prima. Enquanto trabalha, mantém estilo modesto de graça ou confortável pela metade do preço.",
      "Exercer uma profissão: sustenta estilo modesto; confortável se for por uma organização que paga; rico com proficiência em Atuação, se atuar for a atividade.",
      "Recuperar-se: após 3 dias, faça teste de resistência de Constituição CD 15. Se passar, encerre um efeito que impede recuperar PV ou tenha vantagem por 24 horas contra uma doença ou veneno ativo.",
      "Pesquisar: custa 1 po por dia, além do estilo de vida; o Mestre define tempo, restrições e testes. Treinar: com um instrutor, 250 dias e 1 po por dia para aprender um idioma ou uma ferramenta.",
    ],
  },
  {
    id: "avanco-de-personagem",
    title: "Avanço de Personagem",
    body: [
      "XP por nível: 2º 300; 3º 900; 4º 2.700; 5º 6.500; 6º 14.000; 7º 23.000; 8º 34.000; 9º 48.000; 10º 64.000; 11º 85.000; 12º 100.000; 13º 120.000; 14º 140.000; 15º 165.000; 16º 195.000; 17º 225.000; 18º 265.000; 19º 305.000; 20º 355.000.",
      "Bônus de proficiência: +2 (níveis 1-4), +3 (5-8), +4 (9-12), +5 (13-16), +6 (17-20).",
      "Compra de pontos (variação): 27 pontos, valores de 8 a 15 antes dos bônus raciais. Custo: 8=0, 9=1, 10=2, 11=3, 12=4, 13=5, 14=7, 15=9.",
    ],
  },
  {
    id: "inspiracao",
    title: "Inspiração",
    body: [
      "O Mestre a concede, em geral por interpretar traços, vínculos e defeitos. Você tem ou não tem inspiração: ela não acumula.",
      "Gaste-a para ter vantagem em uma jogada de ataque, teste de habilidade ou teste de resistência, ou passe-a a outro jogador como recompensa por uma boa contribuição ao jogo.",
    ],
  },
  {
    id: "idiomas",
    title: "Idiomas",
    body: [
      "Padrão (alfabeto): Anão (Anão), Comum (Comum), Élfico (Élfico), Gigante (Anão), Gnômico (Anão), Goblin (Anão), Halfling (Comum), Orc (Anão).",
      "Exóticos (alfabeto): Abissal (Infernal), Celestial (Celestial), Dialeto Subterrâneo (sem alfabeto), Dracônico (Dracônico), Infernal (Infernal), Primordial (Anão), Silvestre (Élfico), Subcomum (Élfico).",
    ],
  },
  {
    id: "multiclasse",
    title: "Multiclasse",
    body: [
      "Ao subir de nível, você pode pegar um nível em outra classe; os níveis somam para XP e bônus de proficiência. O equipamento inicial vem só da primeira classe. Dados de Vida de todas as classes se somam, separados por tipo. Os PV de 1º nível valem só para o personagem de nível 1.",
      "Pré-requisitos (classe atual e nova): Bárbaro For 13; Bardo Car 13; Bruxo Car 13; Clérigo Sab 13; Druida Sab 13; Feiticeiro Car 13; Guerreiro For 13 ou Des 13; Ladino Des 13; Mago Int 13; Monge Des 13 e Sab 13; Paladino For 13 e Car 13; Patrulheiro Des 13 e Sab 13.",
      "Proficiências ganhas: Bárbaro: escudos, armas simples e marciais. Bardo: armadura leve, uma perícia, um instrumento. Bruxo: armadura leve, armas simples. Clérigo e Druida: armadura leve e média, escudos. Feiticeiro e Mago: nenhuma. Guerreiro e Paladino: armadura leve e média, escudos, armas simples e marciais. Ladino: armadura leve, uma perícia da classe, ferramentas de ladrão. Monge: armas simples, espadas curtas. Patrulheiro: armadura leve e média, escudos, armas simples e marciais, uma perícia da classe.",
      "Características: Canalizar Divindade dá os efeitos das duas classes, mas usos adicionais só vêm quando um nível de classe os concede. Ataque Extra de classes diferentes não se soma. Defesa sem Armadura não pode ser ganha de uma segunda classe.",
      "Espaços de magia: some os níveis de bardo, clérigo, druida, feiticeiro e mago, mais metade de paladino e patrulheiro e um terço de Cavaleiro Arcano e Trapaceiro Arcano (arredondando para baixo). Magias conhecidas e preparadas são calculadas por classe. Magia de Pacto fica à parte, mas os espaços de cada uma podem conjurar as magias da outra.",
      "Espaços por nível combinado (espaços do 1º ao 9º nível): 1: 2. 2: 3. 3: 4/2. 4: 4/3. 5: 4/3/2. 6: 4/3/3. 7: 4/3/3/1. 8: 4/3/3/2. 9: 4/3/3/3/1. 10: 4/3/3/3/2. 11-12: 4/3/3/3/2/1. 13-14: 4/3/3/3/2/1/1. 15-16: 4/3/3/3/2/1/1/1. 17: 4/3/3/3/2/1/1/1/1. 18: 4/3/3/3/3/1/1/1/1. 19: 4/3/3/3/3/2/1/1/1. 20: 4/3/3/3/3/2/2/1/1.",
    ],
  },
  {
    id: "talentos",
    title: "Talentos",
    body: [
      "Regra opcional: troque um Incremento no Valor de Habilidade por um talento. Cada um só pode ser escolhido uma vez, salvo indicação, e perder o pré-requisito suspende o benefício.",
      "Adepto Elemental (conjurar magia): escolha ácido, elétrico, fogo, frio ou trovão. Suas magias ignoram resistência a esse tipo e tratam 1 no dado de dano como 2. Pode repetir com outro tipo.",
      "Adepto Marcial: aprende duas manobras de Mestre de Batalha (CD 8 + proficiência + For ou Des) e ganha um dado de superioridade d6, ou mais um se já tiver; recupera em descanso curto ou longo.",
      "Alerta: +5 em iniciativa; não pode ser surpreendido enquanto consciente; criaturas escondidas não ganham vantagem por isso contra você.",
      "Ambidestro: +1 de CA com uma arma corpo a corpo em cada mão; pode combater com duas armas sem que sejam leves; saca ou guarda duas armas de uma mão de uma vez.",
      "Atacante Bestial: uma vez por turno, em ataque corpo a corpo com arma, rola de novo o dado de dano e fica com qualquer um dos resultados.",
      "Atirador Aguçado: sem desvantagem além da distância normal; ignora meia-cobertura e três quartos de cobertura; pode aceitar −5 no ataque à distância com proficiência para ter +10 no dano.",
      "Atirador de Magia (conjurar magia): dobra o alcance de magias com jogada de ataque; ignora meia-cobertura e três quartos de cobertura em ataques à distância com magia; aprende um truque de ataque de bardo, bruxo, clérigo, druida, feiticeiro ou mago.",
      "Atleta: +1 em For ou Des; levantar custa 1,5 metro; escalar não custa movimento extra; salto com corrida exige só 1,5 metro de impulso.",
      "Ator: +1 em Car; vantagem em Atuação e Enganação ao se passar por outra pessoa; imita voz ou sons ouvidos por pelo menos 1 minuto, descoberto com Intuição resistida por Enganação.",
      "Combatente Montado: vantagem corpo a corpo contra criatura desmontada menor que a montaria; pode assumir um ataque feito contra a montaria; a montaria sofre 0 de dano em sucesso e metade em falha nos testes de Destreza para metade do dano.",
      "Conjurador de Guerra (conjurar magia): vantagem em Constituição para manter concentração ao sofrer dano; faz componentes somáticos com armas ou escudo nas mãos; pode trocar ataque de oportunidade por magia de 1 ação com um único alvo.",
      "Conjurador de Ritual (Int ou Sab 13): livro com duas magias rituais de 1º nível de uma classe conjuradora à escolha. Pode copiar outras rituais da mesma lista, de nível até metade do seu (para cima), por 2 horas e 50 po por nível.",
      "Curandeiro: estabilizar com kit de primeiros-socorros deixa o alvo com 1 PV; com uma ação e um uso do kit, cura 1d6 + 4 + total de Dados de Vida do alvo, uma vez por descanso curto ou longo por criatura.",
      "Duelista Defensivo (Des 13): empunhando arma de acuidade com proficiência, usa a reação para somar a proficiência à CA contra um ataque corpo a corpo.",
      "Especialista em Besta: ignora recarga das bestas com proficiência; sem desvantagem à distância com inimigo a até 1,5 metro; ao atacar com arma de uma mão, ataca com besta de mão carregada como ação bônus.",
      "Especialista em Briga: +1 em For ou Con; ataques desarmados causam 1d4; ao acertar desarmado ou com arma improvisada, pode tentar agarrar como ação bônus.",
      "Explorador de Cavernas: vantagem para detectar portas secretas e nos testes de resistência contra armadilhas; resistência ao dano delas; procura armadilhas em ritmo normal.",
      "Imobilizador (For 13): vantagem em ataques contra quem você agarra; com uma ação e outro teste de agarrar, você e o alvo ficam impedidos até o agarre acabar.",
      "Iniciado em Magia: dois truques e uma magia de 1º nível de uma classe; conjura a magia no nível mais baixo, uma vez por descanso longo.",
      "Investida Poderosa: após Disparada, ação bônus para ataque corpo a corpo ou empurrão. Com 3 metros em linha reta antes: +5 no dano ou empurra até 3 metros.",
      "Líder Inspirador (Car 13): 10 minutos; até seis criaturas a até 9 metros ganham PV temporários iguais a seu nível + Car, uma vez por descanso curto ou longo.",
      "Maestria em Arma de Haste: ataque de ação bônus com a outra ponta (d4, concussão) usando glaive, alabarda ou bordão; empunhando também lança longa, quem entra no seu alcance provoca ataque de oportunidade.",
      "Maestria em Armadura Média (proficiência): sem desvantagem em Furtividade; soma até +3 de Destreza à CA, se tiver Des 16 ou mais.",
      "Maestria em Armadura Pesada (proficiência): +1 em For; reduz em 3 o dano de concussão, cortante e perfurante de armas não mágicas.",
      "Matador de Conjuradores: reação para atacar corpo a corpo quem conjurar a até 1,5 metro; quem você ferir tem desvantagem para manter concentração; vantagem contra magias conjuradas a até 1,5 metro.",
      "Mente Afiada: +1 em Int; sempre sabe o norte e as horas até o próximo nascer ou pôr do sol; relembra com precisão tudo do último mês.",
      "Mestre de Armas: +1 em For ou Des; proficiência com quatro armas simples ou marciais.",
      "Mestre de Armas Grandes: ao fazer crítico ou reduzir a 0 PV com arma corpo a corpo, ataca como ação bônus; pode aceitar −5 no ataque com arma pesada com proficiência para ter +10 no dano.",
      "Mestre de Escudo: empurrão como ação bônus após atacar; soma o bônus do escudo em testes de resistência de Destreza contra magias ou efeitos nocivos que tenham você como alvo; reação para sofrer 0 de dano em sucesso nos testes de Destreza para metade.",
      "Mobilidade: +3 metros de deslocamento; Disparada ignora terreno difícil naquele turno; quem você atacar corpo a corpo não faz ataque de oportunidade contra você naquele turno, acertando ou não.",
      "Observador: +1 em Int ou Sab; lê lábios em idioma que conhece; +5 em Percepção e Investigação passivas.",
      "Perito: proficiência em três perícias ou ferramentas, em qualquer combinação.",
      "Poliglota: +1 em Int; três idiomas; cria códigos escritos, decifráveis com teste de Inteligência (CD = sua Int + proficiência), magia ou seu ensino.",
      "Proteção Leve: +1 em For; proficiência em armadura leve. Proteção Moderada (armadura leve): +1 em For; proficiência em armadura média e escudos. Proteção Pesada (armadura média): +1 em For; proficiência em armadura pesada.",
      "Resiliente: +1 em uma habilidade e proficiência nos testes de resistência dela.",
      "Resistente: +1 em Con; ao rolar Dado de Vida, recupera no mínimo 2 × Con (mínimo 2).",
      "Robusto: PV máximos +2 por nível atual e +2 a cada novo nível.",
      "Sentinela: acerto com ataque de oportunidade zera o deslocamento do alvo no turno; Desengajar não evita seu ataque; reação para atacar quem, a até 1,5 metro, atacar outro alvo sem este talento.",
      "Sorrateiro (Des 13): pode se esconder estando levemente obscurecido; errar um ataque à distância escondido não revela sua posição; penumbra não dá desvantagem em Percepção por visão.",
      "Sortudo: 3 pontos de sorte por descanso longo. Antes de saber o resultado, gaste um para rolar d20 extra e escolher entre eles em ataque, teste de habilidade ou de resistência. Também pode rolar d20 contra um ataque feito a você e escolher qual usar. Pontos de duas criaturas na mesma jogada se cancelam.",
    ],
  },
];
