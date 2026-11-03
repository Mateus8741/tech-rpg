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
];
