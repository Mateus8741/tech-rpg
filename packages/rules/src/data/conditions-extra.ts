// Condições e regras complementares (PHB variantes, Guia do Mestre, Guia de Xanathar) em PT-BR.
// Complementa conditions.ts (CONDITIONS / RULE_SECTIONS), sem repetir o que já existe lá.
import type { Condition } from "../types";

/** Estados de jogo que se comportam como condições mas não fazem parte da lista do apêndice A do PHB. */
export const CONDITIONS_EXTRA: Condition[] = [
  {
    id: "sobrecarregado",
    name: "Sobrecarregado (regra variante)",
    description: [
      "Se você carrega peso superior a 5 vezes o seu valor de Força (em quilos: Força x 2,5), seu deslocamento diminui em 3 metros.",
    ],
  },
  {
    id: "muito-sobrecarregado",
    name: "Muito Sobrecarregado (regra variante)",
    description: [
      "Se você carrega peso superior a 10 vezes o seu valor de Força (em quilos: Força x 5), seu deslocamento diminui em 6 metros.",
      "Você também tem desvantagem em testes de habilidade, jogadas de ataque e testes de resistência que usem Força, Destreza ou Constituição.",
      "A capacidade máxima de carga é 15 vezes o valor de Força (Força x 7,5 kg).",
    ],
  },
  {
    id: "morrendo",
    name: "Morrendo",
    description: [
      "Uma criatura reduzida a 0 pontos de vida morre instantaneamente ou cai inconsciente (ver Morte e Testes de Resistência Contra a Morte).",
      "No início de cada turno, a criatura inconsciente faz um teste de resistência contra a morte (d20 sem modificadores): 10 ou mais é um sucesso; 9 ou menos é uma falha. Um 1 natural conta como duas falhas; um 20 natural devolve 1 ponto de vida.",
      "Três sucessos estabilizam a criatura; três falhas a matam. Sofrer dano enquanto estiver com 0 PV causa uma falha (duas se o ataque for crítico).",
    ],
  },
  {
    id: "estavel",
    name: "Estável",
    description: [
      "Uma criatura estável continua inconsciente com 0 PV, mas não faz mais testes de resistência contra a morte.",
      "Ela volta a 1 PV após 1d4 horas, a menos que sofra dano novamente. Uma criatura é estabilizada com um teste de Sabedoria (Medicina) CD 10, com cura mágica ou com o uso de um kit de primeiros-socorros.",
    ],
  },
  {
    id: "concentrando",
    name: "Concentrando-se",
    description: [
      "Algumas magias e efeitos exigem concentração. Você só pode manter concentração em um efeito por vez; iniciar outro encerra o anterior.",
      "A concentração é quebrada se você ficar incapacitado, morrer, ou falhar em um teste de resistência de Constituição ao sofrer dano (CD 10 ou metade do dano, o que for maior; um teste por fonte de dano).",
      "Você também pode encerrar a concentração a qualquer momento (não requer ação). Eventos ambientais perturbadores podem exigir um teste de Constituição CD 10.",
    ],
  },
  {
    id: "maldicao",
    name: "Maldição",
    description: [
      "Uma maldição é um efeito mágico persistente imposto por uma magia (como Maldição), um item maldito, um monstro ou um local amaldiçoado.",
      "Os efeitos variam e são descritos na fonte. Em geral só podem ser encerrados por Remover Maldição, Desejo, Intervenção Divina ou outro efeito específico indicado.",
    ],
  },
  {
    id: "licantropia",
    name: "Licantropia",
    description: [
      "Uma criatura humanoide mordida por um licantropo em forma animal ou híbrida deve ser bem-sucedida em um teste de resistência de Constituição CD 13 ou fica amaldiçoada com licantropia.",
      "A maldição se manifesta na próxima lua cheia: o personagem assume a forma de animal ou híbrida, comportando-se segundo a natureza do licantropo, e perde o controle de si mesmo.",
      "Pode ser removida por Remover Maldição, ou por outro efeito que a encerre.",
    ],
  },
  {
    id: "doente",
    name: "Doente",
    description: [
      "Uma criatura exposta a uma doença deve fazer um teste de resistência (normalmente de Constituição) contra a CD indicada. Em caso de falha, contrai a doença; seus efeitos são descritos em cada doença.",
      "Algumas doenças só podem ser curadas por Restauração Maior, Curar Doenças ou Descanso Longo repetido, conforme a doença.",
    ],
  },
  {
    id: "enlouquecido",
    name: "Enlouquecido (Loucura)",
    description: [
      "Horrores sobrenaturais e certas magias podem deixar uma criatura com loucura de curto prazo, longo prazo ou perene (ver regras de Loucura).",
      "Loucura de curto prazo dura 1d10 minutos; de longo prazo, 1d10 x 10 horas; perene é indefinida até ser curada. Pode ser removida por Restauração Maior, Restauração Menor (curto prazo), Desejo ou Calmaria.",
    ],
  },
];

export const RULE_SECTIONS_EXTRA: { id: string; title: string; body: string[] }[] = [
  {
    id: "doencas",
    title: "Doenças",
    body: [
      "Uma praga em um vilarejo, um pântano infecto ou uma criatura asquerosa podem espalhar doenças. Aventureiros expostos precisam fazer testes de resistência para resistir ao contágio.",
      "Febre do Esgoto: transmitida por água contaminada ou criaturas imundas. Resistência de Constituição CD 11. Sintomas em 1d4 horas: fadiga e febre. Você ganha 1 nível de exaustão que não pode ser removido até a cura. Ao fim de cada descanso longo, repita o teste; com 3 sucessos você se cura. Se você falhar, ganha mais um nível de exaustão.",
      "Dor Visceral (Doença do Rato): transmitida por pulgas ou ratos. Resistência de Constituição CD 11. Após 1d4 horas surgem cãibras severas. Os PV máximos são reduzidos em 1d10 e você não recupera PV enquanto estiver doente. Repita o teste a cada descanso longo.",
      "Podridão da Visão (Sight Rot): causada por infestação de fungos aquáticos. Resistência de Constituição CD 15. Visão turva; desvantagem em testes de Percepção baseados em visão. Cura com ervas específicas (amora de cegonha).",
      "Fervura Delirante (Cackle Fever): transmitida pelo ar. Resistência de Constituição CD 13. Desvantagem em testes de Inteligência, Sabedoria e Carisma. Surtos de riso incontrolável quando estressado.",
      "Qualquer doença pode ser curada com Curar Doenças ou Restauração Maior, e muitas respondem a descansos longos consecutivos e cuidados médicos (Medicina CD 15).",
    ],
  },
  {
    id: "venenos",
    title: "Venenos",
    body: [
      "Os venenos se dividem em quatro tipos: Ingerido (precisa ser engolido), Inalado (pó ou gás respirado), Contato (aplicado em objeto ou pele) e Injetado (aplicado em arma, dardo ou presa).",
      "Cada veneno exige um teste de resistência de Constituição contra a CD indicada. Em falha, a criatura fica Envenenada e sofre os efeitos listados (dano de veneno, perda de PV, paralisia ou outro efeito).",
      "Um personagem proficiente em Kit de Venenos pode aplicar um veneno em uma arma como ação. O veneno de contato permanece por 1 minuto (ou até ser aplicado); o injetado, até acertar um ataque (máx. 1 minuto).",
      "Venenos típicos incluem: Sangue de Assassino (ingerido), Fumaça de Othur Queimada (inalado), Veneno de Drow (injetado), Essência de Éter (inalado), Veneno de Serpente (injetado), Soro da Verdade (ingerido).",
    ],
  },
  {
    id: "loucura",
    title: "Loucura",
    body: [
      "Em jogos de horror ou contato com forças além da compreensão mortal, personagens podem sofrer loucura. O Mestre pode exigir testes de resistência de Sabedoria para evitá-la.",
      "Loucura de Curto Prazo: dura 1d10 minutos. Exemplos: pânico, catatonia, comportamento compulsivo, amnésia temporária.",
      "Loucura de Longo Prazo: dura 1d10 x 10 horas. Exemplos: fobia severa, obsessão, alucinações, paranoia.",
      "Loucura Perene: dura até ser curada. Exemplos: um novo defeito de personalidade, novos medos, compulsão duradoura.",
      "Curas: Restauração Maior encerra loucura perene ou de longo prazo; Restauração Menor encerra a de curto prazo (alguns efeitos); Calmaria, Desejo e Restauração Maior removem efeitos mágicos.",
    ],
  },
  {
    id: "clima-extremo",
    title: "Clima e Ambientes Extremos",
    body: [
      "Frio Extremo: temperaturas abaixo de -17 °C. Cada hora exposta exige teste de resistência de Constituição CD 10; falha causa 1 nível de exaustão. Criaturas com resistência a frio ou imunes ao frio e equipadas com roupas de inverno são automaticamente bem-sucedidas.",
      "Calor Extremo: temperaturas acima de 38 °C. Cada hora exige teste de Constituição CD 5 (+1 por hora adicional); falha causa 1 nível de exaustão. Quem usa armadura média ou pesada tem desvantagem. Criaturas com resistência ou imunidade a fogo são bem-sucedidas automaticamente.",
      "Vento Forte: impõe desvantagem em ataques à distância e apaga chamas expostas. Em um deserto, o vento pode causar rajadas de areia.",
      "Chuva Pesada: visibilidade reduzida, desvantagem em testes de Sabedoria (Percepção) que dependam da visão ou audição.",
      "Altitude Elevada: acima de 3.000 m, cada hora de viagem conta como 2 horas para o ritmo de viagem; aclimatar-se leva 30 dias.",
      "Terreno Difícil: cada metro de movimento custa 1 metro adicional.",
    ],
  },
  {
    id: "atividades-intervalo",
    title: "Atividades de Intervalo",
    body: [
      "Entre aventuras os personagens podem dedicar seu tempo a atividades de intervalo (downtime): construir um estabelecimento, vender itens mágicos, forjar itens, pesquisar, praticar um crime, participar de um jogo de azar, realizar um ofício, recuperar-se, pesquisar, religião, ganhar dinheiro, treinar, entre outras.",
      "Trabalho Remunerado: cada dia de trabalho qualificado gera o equivalente ao estilo de vida modesto (1 po/dia) ou mais, conforme o ofício.",
      "Criar um Item: o personagem precisa de proficiência na ferramenta apropriada, das matérias-primas (metade do valor de mercado do item) e de tempo (progresso de 5 po de valor de mercado por dia de trabalho).",
      "Crime: o personagem escolhe o crime, o nível de dificuldade e faz testes de perícia; falhas podem levar a multa, prisão ou perseguição.",
      "Pesquisa: dias de estudo em bibliotecas ou arquivos; cada dia gasta 1 po e exige testes de Inteligência (Investigação) ou Sabedoria (Intuição) conforme o Mestre determinar.",
      "Treinamento: 250 dias de trabalho, gastando 1 po por dia (250 po), para aprender um idioma ou ganhar proficiência em uma ferramenta, com um instrutor.",
    ],
  },
  {
    id: "estilos-de-vida",
    title: "Estilo de Vida",
    body: [
      "Estilo de vida determina o custo diário de manutenção (hospedagem, alimentação, vestuário, etc.).",
      "Miserável: 0 po/dia. Esquálido: 1 pp/dia. Pobre: 2 pp/dia. Modesto: 1 po/dia. Confortável: 2 po/dia. Rico: 4 po/dia. Aristocrático: mínimo 10 po/dia.",
      "Estilos de vida mais caros dão acesso a contatos sociais, informação, influência e conforto melhores. O Mestre pode impor penalidades ou bônus em interações sociais conforme o estilo de vida adotado.",
    ],
  },
  {
    id: "niveis-de-exaustao",
    title: "Níveis de Exaustão (resumo)",
    body: [
      "1: desvantagem em testes de habilidade. 2: deslocamento reduzido à metade. 3: desvantagem em jogadas de ataque e testes de resistência. 4: PV máximos reduzidos à metade. 5: deslocamento reduzido a 0. 6: morte.",
      "Os efeitos são cumulativos. Um descanso longo reduz o nível de exaustão em 1, desde que a criatura tenha ingerido comida e água.",
    ],
  },
];
