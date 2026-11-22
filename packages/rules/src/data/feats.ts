// Talentos (feats) de D&D 5e em PT-BR: PHB, XGtE, TCoE, Fizban, Strixhaven, SCAG, Eberron e PHB 2024.
// Tipo próprio (não existe suporte a talentos em types.ts).

export interface Feat {
  id: string;
  name: string;
  prerequisite?: string;
  description: string;
  source: string;
  benefits: string[];
  /** "2024" para talentos do PHB 2024 (Origem, Geral, Estilo de Luta, Dádiva Épica). */
  category?: string;
}

const f = (
  id: string,
  name: string,
  source: string,
  description: string,
  benefits: string[],
  prerequisite?: string,
  category?: string,
): Feat => ({ id, name, source, description, benefits, ...(prerequisite ? { prerequisite } : {}), ...(category ? { category } : {}) });

const PHB = "Livro do Jogador";
const XGE = "Guia de Xanathar para Todas as Coisas";
const TCE = "O Caldeirão de Tudo de Tasha";
const FTD = "Fizban's Treasury of Dragons";
const SCC = "Strixhaven: A Curriculum of Chaos";
const SCAG = "Guia do Aventureiro da Costa da Espada";
const ERLW = "Eberron: Rising from the Last War";
const P24 = "Livro do Jogador 2024";

export const FEATS: Feat[] = [
  // ───────── Livro do Jogador (2014) ─────────
  f("ator", "Ator", PHB, "Habilidoso em imitar outros e se passar por eles.", [
    "Aumente seu Carisma em 1 (máximo 20).",
    "Vantagem em testes de Carisma (Enganação) e (Atuação) para se passar por outra pessoa.",
    "Você pode imitar a fala de outra pessoa ou sons de criaturas após ouvi-los por 1 minuto; um teste de Sabedoria (Intuição) oposto percebe a fraude.",
  ]),
  f("alerta", "Alerta", PHB, "Sempre atento ao perigo.", [
    "+5 de bônus na iniciativa.",
    "Você não pode ser surpreendido enquanto estiver consciente.",
    "Outras criaturas não ganham vantagem em jogadas de ataque contra você por estarem ocultas.",
  ]),
  f("atleta", "Atleta", PHB, "Você passou por treinamento físico intenso.", [
    "Aumente Força ou Destreza em 1 (máx. 20).",
    "Levantar-se do estado Caído usa apenas 1,5 m de movimento.",
    "Escalar não custa movimento extra.",
    "Você pode fazer saltos longos ou altos após se mover 1,5 m, em vez de 3 m.",
  ]),
  f("atirador-de-elite", "Atirador de Elite", PHB, "Você domina o arco e flecha e armas de projétil.", [
    "Atacar a longa distância não impõe desvantagem.",
    "Seus ataques à distância ignoram cobertura parcial e três quartos.",
    "Antes de atacar com uma arma à distância na qual é proficiente, você pode aceitar -5 no ataque para causar +10 de dano se acertar.",
  ]),
  f("atacante-selvagem", "Atacante Selvagem", PHB, "Você ataca com ferocidade brutal.", [
    "Uma vez por turno ao acertar um ataque corpo a corpo, você pode jogar os dados de dano da arma duas vezes e usar o resultado maior.",
  ]),
  f("brigao-de-taverna", "Brigão de Taverna", PHB, "Acostumado a brigas de bar e a lutar com o que estiver à mão.", [
    "Aumente Força ou Constituição em 1.",
    "Proficiência com armas improvisadas.",
    "Seu ataque desarmado causa 1d4 de dano.",
    "Quando acerta um ataque com arma improvisada ou desarmado, você pode usar uma ação bônus para tentar agarrar o alvo.",
  ]),
  f("combatente-montado", "Combatente Montado", PHB, "Você é um cavaleiro letal.", [
    "Vantagem nas jogadas de ataque corpo a corpo contra criaturas desmontadas menores que sua montaria.",
    "Você pode forçar um ataque dirigido à sua montaria a mirar você.",
    "Se sua montaria passar em um teste de Destreza que dê metade do dano, ela não sofre dano; se falhar, sofre só metade.",
  ]),
  f("conjurador-belico", "Conjurador Bélico", PHB, "Você treinou conjurar magias em combate.", [
    "Vantagem em testes de Constituição para manter concentração ao sofrer dano.",
    "Você pode executar os componentes somáticos de magias mesmo com armas ou escudo em mãos.",
    "Quando uma criatura provocar ataque de oportunidade, você pode lançar uma magia (1 ação, um só alvo) em vez de atacar.",
  ], "Capacidade de conjurar pelo menos uma magia"),
  f("conjurador-de-ritual", "Conjurador de Ritual", PHB, "Você aprendeu rituais mágicos.", [
    "Você ganha um livro de rituais com duas magias de 1º nível de uma lista de classe à escolha (Bardo, Clérigo, Druida, Feiticeiro, Bruxo ou Mago) com o subtipo ritual.",
    "Você pode copiar outros rituais encontrados ao livro (custo de 2 horas e 50 po por nível).",
  ], "Inteligência ou Sabedoria 13 ou maior"),
  f("curandeiro", "Curandeiro", PHB, "Você sabe tratar ferimentos.", [
    "Ao usar um kit de primeiros-socorros em uma criatura com 0 PV, ela recupera 1 PV.",
    "Como ação, você gasta 1 uso do kit para curar 1d6 + 4 + nível da criatura (máx. 1 vez por descanso).",
  ]),
  f("duelista-defensivo", "Duelista Defensivo", PHB, "Você sabe desviar golpes com a arma.", [
    "Se você estiver empunhando uma arma com Acuidade, pode usar sua reação para somar seu bônus de proficiência à CA contra um ataque corpo a corpo.",
  ], "Destreza 13 ou maior"),
  f("duplo-combatente", "Duplo Combatente", PHB, "Você domina o combate com duas armas.", [
    "+1 de CA quando empunhar uma arma em cada mão.",
    "Você pode usar duas armas que não sejam leves no combate com duas armas.",
    "Você pode sacar ou guardar duas armas por vez.",
  ]),
  f("duravel", "Durável", PHB, "Você é difícil de ser abatido.", [
    "Aumente Constituição em 1.",
    "Ao gastar um Dado de Vida para recuperar PV, o mínimo recuperado é o dobro do seu modificador de Constituição (mínimo 2).",
  ]),
  f("especialista-em-besta", "Especialista em Besta", PHB, "Você usa bestas com rapidez e precisão.", [
    "Ignora a propriedade recarga das bestas com as quais é proficiente.",
    "Ataques à distância a 1,5 m de uma criatura hostil não têm desvantagem.",
    "Ao atacar com arma leve, você pode usar a ação bônus para atacar com uma besta de mão.",
  ]),
  f("lider-inspirador", "Líder Inspirador", PHB, "Você inspira os aliados.", [
    "Após 10 minutos de discurso, até 6 criaturas ganham PV temporários iguais ao seu nível + seu modificador de Carisma.",
    "A criatura não pode receber esse benefício novamente até um descanso curto ou longo.",
  ], "Carisma 13 ou maior"),
  f("linguista", "Linguista", PHB, "Você estudou idiomas e códigos.", [
    "Aumente Inteligência em 1.",
    "Aprende 3 idiomas à escolha.",
    "Pode criar códigos escritos que só quem conhece o código ou passa em teste de Inteligência (CD = INT + proficiência + 8) entende.",
  ]),
  f("mestre-das-armas-grandes", "Mestre das Armas Grandes", PHB, "Você sabe usar armas pesadas com ferocidade.", [
    "Ao dar um acerto crítico ou reduzir uma criatura a 0 PV com arma corpo a corpo, você pode fazer um ataque com arma como ação bônus.",
    "Antes de atacar com arma pesada, pode aceitar -5 no ataque para causar +10 de dano se acertar.",
  ]),
  f("mestre-das-armas-de-haste", "Mestre das Armas de Haste", PHB, "Você domina armas de longo alcance.", [
    "Ao usar a ação de Atacar com glaive, alabarda, bordão ou lança, você pode atacar como ação bônus com a outra ponta (1d4 contundente).",
    "Criaturas provocam ataque de oportunidade quando entram em seu alcance.",
  ]),
  f("armadura-leve", "Armadura Leve", PHB, "Você treinou o uso de armaduras leves.", [
    "Aumente Força ou Destreza em 1.",
    "Proficiência com armadura leve.",
  ]),
  f("mestre-em-armaduras-medias", "Mestre em Armaduras Médias", PHB, "Você se move com agilidade em armaduras médias.", [
    "Armadura média não impõe desvantagem em Furtividade.",
    "O bônus máximo de Destreza em armadura média passa a ser +3 (se Des 16 ou mais).",
  ], "Proficiência com armadura média"),
  f("mestre-em-armaduras-pesadas", "Mestre em Armaduras Pesadas", PHB, "Você é um especialista em armadura pesada.", [
    "Aumente Força em 1.",
    "Enquanto usa armadura pesada, dano contundente, cortante e perfurante não mágico é reduzido em 3.",
  ], "Proficiência com armadura pesada"),
  f("mestre-em-escudos", "Mestre em Escudos", PHB, "Você usa escudos para ataque e defesa.", [
    "Se você usar a ação de Atacar, pode usar uma ação bônus para empurrar uma criatura com o escudo.",
    "Soma o bônus de CA do escudo em testes de resistência de Destreza contra efeitos que só o afetam.",
    "Se passar em teste de Destreza para sofrer metade do dano, não sofre dano (reação).",
  ]),
  f("mobilidade", "Mobilidade", PHB, "Você é excepcionalmente ágil.", [
    "+3 m de deslocamento.",
    "Dash ignora terreno difícil.",
    "Ao atacar corpo a corpo uma criatura, você não provoca ataques de oportunidade dela naquele turno.",
  ]),
  f("magico-iniciado", "Mágico Iniciado", PHB, "Você aprendeu magia básica de uma classe.", [
    "Escolha uma classe (Bardo, Clérigo, Druida, Feiticeiro, Bruxo ou Mago).",
    "Aprende 2 truques e 1 magia de 1º nível dessa lista; pode conjurar a magia uma vez por descanso longo.",
  ]),
  f("observador", "Observador", PHB, "Percepção rápida e apurada.", [
    "Aumente Inteligência ou Sabedoria em 1.",
    "Você lê lábios se entender o idioma.",
    "+5 em Percepção passiva e Investigação passiva.",
  ]),
  f("resiliente", "Resiliente", PHB, "Você supera efeitos deletérios.", [
    "Aumente um atributo à sua escolha em 1.",
    "Proficiência em testes de resistência desse atributo.",
  ]),
  f("sentinela", "Sentinela", PHB, "Você bloqueia inimigos com precisão.", [
    "Ataques de oportunidade bem-sucedidos reduzem o deslocamento do alvo a 0 até o fim do turno.",
    "Criaturas provocam ataque de oportunidade mesmo se usarem Desengajar.",
    "Quando uma criatura atacar um aliado a 1,5 m de você, use sua reação para atacar essa criatura.",
  ]),
  f("sortudo", "Sortudo", PHB, "Você possui pontos de sorte.", [
    "3 pontos de sorte por descanso longo.",
    "Gaste 1 ponto para jogar um d20 adicional em um ataque, teste ou resistência (escolha qual usar), ou para fazer um ataque contra você usar o d20 extra.",
  ]),
  f("matador-de-magos", "Matador de Magos", PHB, "Você sabe combater conjuradores.", [
    "Quando uma criatura a 1,5 m de você conjurar uma magia, use sua reação para atacá-la.",
    "Criaturas que você danificar têm desvantagem em testes de concentração.",
    "Você tem vantagem em resistências contra magias lançadas por criaturas a 1,5 m.",
  ]),
  f("adepto-marcial", "Adepto Marcial", PHB, "Você estudou técnicas de combate.", [
    "Aprende duas manobras do Mestre de Batalha.",
    "Ganha 1 dado de superioridade (d6); recupera após descanso curto ou longo.",
  ]),
  f("mestre-de-armas", "Mestre de Armas", PHB, "Você treinou com diversas armas.", [
    "Aumente Força ou Destreza em 1.",
    "Proficiência com 4 armas à escolha.",
  ]),
  f("explorador-de-masmorras", "Explorador de Masmorras", PHB, "Você sabe lidar com perigos de masmorras.", [
    "Vantagem em Sabedoria (Percepção) e Inteligência (Investigação) para detectar portas secretas.",
    "Vantagem em testes de resistência contra armadilhas e resistência a dano de armadilhas.",
    "Busca em ritmo normal sem penalidade de Percepção passiva.",
  ]),
  f("mente-aguda", "Mente Aguçada", PHB, "Sua memória é excepcional.", [
    "Aumente Inteligência em 1.",
    "Você sabe sempre onde fica o norte e quantas horas faltam para o amanhecer/entardecer.",
    "Lembra tudo o que viu ou ouviu no último mês.",
  ]),
  f("armadura-media", "Armadura Média", PHB, "Você treinou o uso de armaduras médias.", [
    "Aumente Força ou Destreza em 1.",
    "Proficiência com armadura média e escudos.",
  ], "Proficiência com armadura leve"),
  f("armadura-pesada", "Armadura Pesada", PHB, "Você treinou o uso de armaduras pesadas.", [
    "Aumente Força em 1.",
    "Proficiência com armadura pesada.",
  ], "Proficiência com armadura média"),
  f("agarrador", "Agarrador", PHB, "Você é um bom lutador de agarre.", [
    "Vantagem em ataques contra criaturas que você esteja agarrando.",
    "Você pode usar sua ação para tentar imobilizar uma criatura agarrada (ambos ficam impedidos).",
  ], "Força 13 ou maior"),
  f("investida", "Investida", PHB, "Você investe contra os inimigos.", [
    "Se usar a ação de Correr, você pode usar uma ação bônus para fazer um ataque corpo a corpo ou empurrar.",
    "Se você se moveu pelo menos 3 m em linha reta antes, ganha +5 de dano (ataque) ou empurra o alvo 3 m.",
  ]),
  f("adepto-elemental", "Adepto Elemental", PHB, "Sua magia está ligada a um elemento.", [
    "Escolha ácido, frio, fogo, relâmpago ou trovão. Suas magias ignoram resistência a esse tipo.",
    "Ao jogar dano desse tipo, trate os resultados 1 como 2.",
  ], "Capacidade de conjurar pelo menos uma magia"),
  f("atirador-arcano", "Atirador Arcano", PHB, "Você é mestre em ataques mágicos à distância.", [
    "Seus ataques com magia ignoram cobertura parcial e três quartos.",
    "O alcance de magias com ataque aumenta em dobro.",
    "Aprende um truque de ataque de uma classe à sua escolha.",
  ], "Capacidade de conjurar pelo menos uma magia"),
  f("habilidoso", "Habilidoso", PHB, "Você tem aptidão para diversas áreas.", [
    "Ganha proficiência em 3 perícias ou ferramentas à sua escolha.",
  ]),
  f("espreitador", "Espreitador", PHB, "Você é mestre em se esconder.", [
    "Você pode tentar se esconder se estiver apenas levemente obscurecido.",
    "Errar um ataque à distância escondido não revela sua posição.",
    "Luz fraca não impõe desvantagem em Percepção.",
  ], "Destreza 13 ou maior"),
  f("resistente", "Resistente", PHB, "Você é mais robusto que a maioria.", [
    "Seus PV máximos aumentam em 2 por nível (retroativo e a cada nível futuro).",
  ]),

  // ───────── Guia de Xanathar para Todas as Coisas ─────────
  f("sorte-abundante", "Sorte Abundante", XGE, "Sua sorte halfling é lendária.", [
    "Quando um aliado a até 9 m falha em jogada de d20, você pode usar sua reação para que ele jogue novamente (use o novo resultado).",
  ], "Halfling"),
  f("medo-de-dragao", "Medo de Dragão", XGE, "Sua herança dracônica impõe pavor.", [
    "Aumente Força, Constituição ou Carisma em 1.",
    "Em vez de sopro, você pode rugir (ação): criaturas a 9 m fazem resistência de Sabedoria ou ficam amedrontadas por 1 minuto (CD = 8 + prof + Car).",
  ], "Draconato"),
  f("pele-de-dragao", "Pele de Dragão", XGE, "Sua pele ganha escamas rígidas.", [
    "Aumente Força, Constituição ou Carisma em 1.",
    "CA 13 + Des sem armadura.",
    "Suas garras (1d4 cortante) tornam-se armas naturais.",
  ], "Draconato"),
  f("magia-drow-superior", "Alta Magia Drow", XGE, "Você aprimora sua magia inata drow.", [
    "Pode conjurar levitar (1/descanso longo) e detectar magia à vontade.",
    "Pode conjurar dissipar magia (1/descanso longo).",
    "Carisma é a habilidade de conjuração.",
  ], "Elfo (Drow)"),
  f("fortitude-anao", "Fortitude Anã", XGE, "Você é resistente como um anão.", [
    "Aumente Constituição em 1.",
    "Quando usar a ação de Esquivar, gaste 1 Dado de Vida para recuperar PV.",
  ], "Anão"),
  f("precisao-elfica", "Precisão Élfica", XGE, "Seus sentidos de elfo aprimoram a mira.", [
    "Aumente Destreza, Inteligência, Sabedoria ou Carisma em 1.",
    "Ao fazer ataque com vantagem usando Des, Int, Sab ou Car, jogue 3 dados e use o maior.",
  ], "Elfo ou Meio-Elfo"),
  f("desvanecer", "Desvanecer", XGE, "Você escapa para a invisibilidade quando ferido.", [
    "Aumente Destreza ou Inteligência em 1.",
    "Quando sofrer dano, use sua reação para ficar invisível até o início do seu próximo turno (1/descanso curto ou longo).",
  ], "Gnomo"),
  f("teletransporte-feerico", "Teletransporte Feérico", XGE, "Você aprende magias do Povo Feérico.", [
    "Aumente Inteligência ou Carisma em 1.",
    "Aprende o idioma Silvestre e a magia passo nebuloso (1/descanso curto ou longo).",
  ], "Elfo (Alto)"),
  f("chamas-de-flegetos", "Chamas de Flegetos", XGE, "Seu sangue infernal inflama as chamas.", [
    "Aumente Inteligência ou Carisma em 1.",
    "Quando joga dano de fogo, você pode rerrolar 1s.",
    "Ao acertar com fogo, o alvo se incendeia e causa 1d4 de fogo no seu turno.",
  ], "Tiefling"),
  f("constituicao-infernal", "Constituição Infernal", XGE, "Sua herança tiefling o fortalece.", [
    "Aumente Constituição em 1.",
    "Resistência a dano de frio e veneno.",
    "Vantagem em resistências contra envenenamento.",
  ], "Tiefling"),
  f("furia-orc", "Fúria Orc", XGE, "Seu sangue orc responde ao desafio.", [
    "Aumente Força, Constituição ou Carisma em 1.",
    "Quando atacar, jogue um dado de dano extra (1/descanso curto ou longo).",
    "Ao ser reduzido a 0 PV, volte a 1 PV (1/descanso longo).",
  ], "Meio-Orc"),
  f("prodigio", "Prodígio", XGE, "Você ganha versatilidade natural.", [
    "Ganha proficiência em uma perícia, uma ferramenta e um idioma à escolha.",
    "Expertise em uma perícia.",
  ], "Meio-Elfo, Meio-Orc ou Humano"),
  f("segunda-chance", "Segunda Chance", XGE, "Você tem sorte quando precisa.", [
    "Aumente Destreza, Constituição ou Carisma em 1.",
    "Quando for atingido por um ataque, use sua reação para forçar o atacante a rolar novamente (1/descanso curto ou longo).",
  ], "Halfling"),
  f("agilidade-agachada", "Agilidade Agachada", XGE, "Você é ágil apesar do tamanho.", [
    "Aumente Força ou Destreza em 1.",
    "+1,5 m no deslocamento.",
    "Vantagem em testes para escapar de agarrões.",
  ], "Anão, Gnomo ou Halfling (Pequeno)"),
  f("magia-do-elfo-da-floresta", "Magia do Elfo da Floresta", XGE, "Você aprende magias druídicas.", [
    "Aprende o truque criar chama ou arte druídica.",
    "Conjura passos largos e falar com animais (1/descanso longo).",
  ], "Elfo (Floresta)"),

  // ───────── O Caldeirão de Tudo de Tasha ─────────
  f("iniciado-artifice", "Iniciado Artífice", TCE, "Você aprendeu um pouco de Artifício.", [
    "Aprende 1 truque e 1 magia de 1º nível da lista do Artífice; pode conjurar a magia 1 vez por descanso longo.",
    "Proficiência com um tipo de ferramenta de artesão.",
  ]),
  f("cozinheiro", "Cozinheiro", TCE, "Você prepara refeições restauradoras.", [
    "Aumente Constituição ou Sabedoria em 1.",
    "Ferramentas de cozinheiro; prepara refeições que curam PV extra após descanso curto.",
    "Cria guloseimas que dão PV temporários.",
  ]),
  f("esmagador", "Esmagador", TCE, "Seus golpes empurram inimigos.", [
    "Aumente Força ou Constituição em 1.",
    "1/turno, ao acertar dano contundente, empurre o alvo 1,5 m.",
    "Um acerto crítico dá vantagem em ataques contra o alvo até o início do seu próximo turno.",
  ]),
  f("adepto-mistico", "Adepto Místico", TCE, "Você domina o poder do místico.", [
    "Aprende 2 invocações de Bruxo, e um truque + magia de 1º nível.",
  ], "Capacidade de conjurar pelo menos uma magia"),
  f("toque-feerico", "Toque Feérico", TCE, "Você foi tocado pelo Reino Feérico.", [
    "Aumente Inteligência, Sabedoria ou Carisma em 1.",
    "Aprende passo nebuloso e uma magia de 1º nível de Adivinhação ou Encantamento.",
  ]),
  f("iniciado-em-combate", "Iniciado em Combate", TCE, "Você aprendeu um estilo de combate.", [
    "Ganha um Estilo de Luta à escolha (como do Guerreiro).",
  ], "Proficiência com uma arma marcial"),
  f("atirador-de-armas-de-fogo", "Pistoleiro", TCE, "Você domina armas de fogo.", [
    "Aumente Destreza em 1.",
    "Proficiência com armas de fogo.",
    "Ignora recarga e desvantagem a 1,5 m de hostis ao disparar.",
  ]),
  f("adepto-de-metamagia", "Adepto de Metamagia", TCE, "Você aprendeu Metamagia.", [
    "Aprende 2 opções de Metamagia e ganha 2 pontos de feitiçaria.",
  ], "Capacidade de conjurar pelo menos uma magia"),
  f("perfurador", "Perfurador", TCE, "Seus ataques perfuram com precisão.", [
    "Aumente Força ou Destreza em 1.",
    "1/turno, rejogue um dado de dano perfurante.",
    "Em acertos críticos, jogue um dado de dano extra.",
  ]),
  f("envenenador", "Envenenador", TCE, "Você domina venenos.", [
    "Seus venenos ignoram resistência a veneno.",
    "Aplica veneno como ação bônus; proficiência em kit de venenos.",
  ]),
  f("toque-sombrio", "Toque Sombrio", TCE, "Você foi tocado pela Umbra.", [
    "Aumente Inteligência, Sabedoria ou Carisma em 1.",
    "Aprende invisibilidade e uma magia de 1º nível de Ilusão ou Necromancia.",
  ]),
  f("especialista-em-pericia", "Especialista em Perícia", TCE, "Você refinou suas habilidades.", [
    "Aumente um atributo em 1.",
    "Proficiência em uma perícia e expertise em uma perícia proficiente.",
  ]),
  f("retalhador", "Retalhador", TCE, "Você domina golpes cortantes.", [
    "Aumente Força ou Destreza em 1.",
    "1/turno, ao acertar dano cortante, reduza o deslocamento do alvo em 3 m.",
    "Em acertos críticos, o alvo tem desvantagem em ataques até seu próximo turno.",
  ]),
  f("telecinetico", "Telecinético", TCE, "Você possui poder mental.", [
    "Aumente Inteligência, Sabedoria ou Carisma em 1.",
    "Aprende o truque Mão Mágica sem componentes.",
    "Pode empurrar uma criatura 1,5 m como ação bônus.",
  ]),
  f("telepatico", "Telepático", TCE, "Você se comunica mentalmente.", [
    "Aumente Inteligência, Sabedoria ou Carisma em 1.",
    "Fala telepaticamente com criaturas a 18 m.",
    "Conjura detectar pensamentos 1/descanso longo.",
  ]),

  // ───────── Fizban's Treasury of Dragons ─────────
  f("dadiva-do-dragao-cromatico", "Dádiva do Dragão Cromático", FTD, "Você recebeu uma fagulha do poder de um dragão cromático.", [
    "Infusão Cromática: como ação bônus, toque uma arma e a infunda com dano de ácido, frio, fogo, relâmpago ou veneno por 1 minuto (+1d4 desse tipo); 1/descanso longo.",
    "Resistência Reativa: como reação, ganhe resistência ao tipo de dano; usos iguais ao bônus de proficiência por descanso longo.",
  ]),
  f("dadiva-do-dragao-metalico", "Dádiva do Dragão Metálico", FTD, "Você recebeu uma fagulha do poder de um dragão metálico.", [
    "Sopro Metálico: cone de 4,5 m que empurra criaturas ou as incapacita; usos igual ao bônus de proficiência por descanso longo.",
    "Asas Protetoras: reação para adicionar 1d4 à CA de um aliado; usos igual ao bônus de proficiência.",
  ]),
  f("dadiva-do-dragao-gema", "Dádiva do Dragão Gema", FTD, "Você recebeu uma fagulha do poder de um dragão gema.", [
    "Aumente Inteligência, Sabedoria ou Carisma em 1.",
    "Retaliação Telecinética: como reação, ao sofrer dano de uma criatura a 18 m, cause 2d8 psíquico e empurre o alvo 3 m (usos = bônus de proficiência).",
  ]),

  // ───────── Strixhaven: A Curriculum of Chaos ─────────
  f("iniciado-de-strixhaven", "Iniciado de Strixhaven", SCC, "Você estudou em uma das faculdades de Strixhaven.", [
    "Escolha uma faculdade (Lorehold, Prismari, Quandrix, Silverquill ou Witherbloom).",
    "Aprende 1 truque e 1 magia de 1º nível associados à faculdade, e pode conjurar a magia 1 vez por descanso longo.",
  ]),

  // ───────── Guia do Aventureiro da Costa da Espada ─────────
  f("magia-svirfneblin", "Magia Svirfneblin", SCAG, "Você tem a magia natural dos gnomos das profundezas.", [
    "Aumente Inteligência em 1.",
    "Conjura nublar, camuflagem e desordenar (cada uma 1/descanso longo, sem componentes materiais).",
  ], "Gnomo (das Rochas / Svirfneblin)"),

  // ───────── Eberron: Rising from the Last War ─────────
  f("marca-do-dragao-aberrante", "Marca do Dragão Aberrante", ERLW, "Você manifestou uma Marca do Dragão aberrante.", [
    "Aumente Constituição em 1.",
    "Aprende um truque e uma magia de 1º nível da lista do Feiticeiro (conjura a magia 1 vez por descanso longo, também gastando Dados de Vida se necessário).",
  ], "Nenhuma Marca do Dragão"),
  f("lamina-revenante", "Lâmina Revenante", ERLW, "Você domina a cimitarra de lâmina dupla.", [
    "Aumente Força ou Destreza em 1.",
    "A cimitarra de lâmina dupla ganha a propriedade Acuidade para você.",
    "+1 de CA enquanto empunha uma cimitarra de lâmina dupla com duas mãos.",
  ], "Elfo ou Meio-Elfo"),
  f("marca-do-dragao-menor", "Marca do Dragão Menor", ERLW, "Você possui uma Marca do Dragão em sua forma inicial.", [
    "Ganha magias e usos da marca: um truque, uma magia de 1º nível (ligada à Casa).",
  ], "Raça com Marca do Dragão"),
  f("marca-do-dragao-superior", "Marca do Dragão Superior", ERLW, "Sua Marca do Dragão se tornou mais poderosa.", [
    "Aumente o atributo da marca em 1; aprende magias de nível 2.",
  ], "Marca do Dragão Menor"),
  f("marca-do-dragao-maior", "Marca do Dragão Maior", ERLW, "Sua Marca do Dragão atingiu o ápice.", [
    "Aumenta o atributo da marca em 1 e ganha magias de nível 3-5 ligadas à Casa.",
  ], "Marca do Dragão Superior"),
];

// ───────── Livro do Jogador 2024 ─────────
const o = (id: string, name: string, description: string, benefits: string[], pre?: string) =>
  f(`${id}-2024`, `${name} (2024)`, P24, description, benefits, pre, "Origem");
const gen = (id: string, name: string, description: string, benefits: string[], pre = "Nível 4 ou superior") =>
  f(`${id}-2024`, `${name} (2024)`, P24, description, benefits, pre, "Geral");
const fs = (id: string, name: string, description: string, benefits: string[]) =>
  f(`${id}-2024`, `${name} (2024)`, P24, description, benefits, "Característica de Estilo de Luta", "Estilo de Luta");
const boon = (id: string, name: string, description: string, benefits: string[]) =>
  f(`${id}-2024`, `Dádiva ${name} (2024)`, P24, description, benefits, "Nível 19 ou superior", "Dádiva Épica");

export const FEATS_2024: Feat[] = [
  // Origem
  o("alerta", "Alerta", "Você está sempre pronto para o perigo.", ["Adicione seu bônus de proficiência à Iniciativa.", "Pode trocar de Iniciativa com um aliado voluntário no início do combate."]),
  o("artifice", "Artesão", "Você domina ferramentas de artesão.", ["Proficiência com três ferramentas de artesão.", "Ao comprar equipamento não mágico, desconto de 20%.", "Cria itens de artesão com rapidez ao fim de um descanso longo."]),
  o("curandeiro", "Curandeiro", "Você sabe aliviar feridas.", ["Usando um kit de cura, uma ação de Utilizar: o alvo gasta um Dado de Vida e recupera PV (rolagem + proficiência).", "Pode rejogar 1s ao curar com Dados de Vida."]),
  o("sortudo", "Sortudo", "Você é abençoado pela sorte.", ["Pontos de Sorte iguais ao bônus de proficiência por descanso longo.", "Gaste 1 para ter vantagem em um Teste de d20, ou impor desvantagem a um ataque contra você."]),
  o("magico-iniciado", "Mágico Iniciado", "Você aprendeu magia de uma lista (Clérigo, Druida ou Mago).", ["Dois truques e uma magia de 1º nível da lista escolhida.", "Conjura a magia de 1º nível 1 vez por descanso longo sem espaço de magia."]),
  o("musico", "Músico", "Você é treinado em instrumentos.", ["Proficiência com três instrumentos musicais.", "Ao fim de um descanso curto ou longo, toque música para dar Inspiração Heroica a aliados (número = bônus de proficiência)."]),
  o("atacante-selvagem", "Atacante Selvagem", "Seus golpes são brutais.", ["1/turno, ao acertar uma arma, jogue os dados de dano duas vezes e use o maior."]),
  o("habilidoso", "Habilidoso", "Você é versátil.", ["Proficiência em três perícias ou ferramentas à escolha."]),
  o("brigao-de-taverna", "Brigão de Taverna", "Você luta sem regras.", ["Ataques desarmados causam 1d4 + For.", "Ao jogar dano desarmado, rejogue 1s.", "Proficiência com armas improvisadas.", "Empurre uma criatura ao acertar desarmado (1/turno)."]),
  o("resistente", "Resistente", "Você é mais robusto.", ["PV máximos aumentam em 2 por nível (retroativo)."]),
  // Gerais
  gen("aumento-de-atributo", "Aumento de Atributo", "Treino ou estudo aprimora suas capacidades.", ["Aumente um atributo em 2 ou dois atributos em 1 (máx. 20)."]),
  gen("ator", "Ator", "Você é especialista em disfarce e imitação.", ["Aumente Carisma em 1.", "Vantagem em Enganação e Atuação ao se passar por outra pessoa.", "Pode imitar vozes ou sons ouvidos."]),
  gen("atleta", "Atleta", "Você treina o corpo.", ["Aumente For ou Des em 1.", "Escalada e saltos mais eficientes; levantar-se custa 1,5 m."]),
  gen("investida", "Investida", "Você ataca com força total.", ["Aumente For ou Des em 1.", "Se Correr 3 m em linha reta e acertar, ganha +1d8 de dano ou empurra 3 m."]),
  gen("cozinheiro", "Cozinheiro", "Você cozinha refeições restauradoras.", ["Aumente Con ou Sab em 1.", "Refeições dão PV temporários e cura extra em descansos curtos."]),
  gen("especialista-em-besta", "Especialista em Besta", "Você usa bestas com perícia.", ["Aumente Des em 1.", "Ignora Recarga das bestas.", "Sem desvantagem em ataques à distância a 1,5 m.", "Ataque com besta de mão como ação bônus."]),
  gen("esmagador", "Esmagador", "Seus golpes empurram.", ["Aumente For ou Con em 1.", "1/turno, empurre 1,5 m ao acertar contundente.", "Críticos dão vantagem em ataques até seu próximo turno."]),
  gen("duelista-defensivo", "Duelista Defensivo", "Você bloqueia ataques.", ["Aumente Des em 1.", "Com arma com Acuidade, reação para +proficiência na CA contra um ataque."], "Destreza 13 ou maior"),
  gen("duplo-combatente", "Duplo Combatente", "Você luta com duas armas.", ["Aumente For ou Des em 1.", "Duas armas que não sejam leves; saca duas armas ao mesmo tempo."]),
  gen("duravel", "Durável", "Você é difícil de abater.", ["Aumente Con em 1.", "Dados de Vida: mínimo recuperado é o dobro de Con.", "Pode gastar Dados de Vida como ação bônus ao fim de um descanso curto."]),
  gen("adepto-elemental", "Adepto Elemental", "Magia ligada a um elemento.", ["Aumente Int, Sab ou Car em 1.", "Magias ignoram resistência ao elemento; 1s rerrolados."], "Capacidade de conjurar magias"),
  gen("toque-feerico", "Toque Feérico", "Tocado pelo Reino Feérico.", ["Aumente Int, Sab ou Car em 1.", "Passo Nebuloso e uma magia de 1º nível de Adivinhação ou Encantamento."]),
  gen("agarrador", "Agarrador", "Lutador de agarre.", ["Aumente For ou Des em 1.", "Vantagem em ataques contra criaturas agarradas por você."], "Força ou Destreza 13 ou maior"),
  gen("mestre-das-armas-grandes", "Mestre das Armas Grandes", "Armas pesadas.", ["Aumente For em 1.", "Dano adicional = proficiência com arma pesada.", "Ação bônus de ataque ao acertar crítico ou reduzir criatura a 0."], "Força 13 ou maior"),
  gen("armadura-pesada", "Armadura Pesada", "Treino com armadura pesada.", ["Aumente For em 1.", "Proficiência com armadura pesada."], "Proficiência com armadura média"),
  gen("mestre-em-armadura-pesada", "Mestre em Armadura Pesada", "Armadura pesada reduz dano.", ["Aumente For ou Con em 1.", "Em armadura pesada, reduza dano físico em 3 (ou prof)."], "Proficiência com armadura pesada"),
  gen("lider-inspirador", "Líder Inspirador", "Você inspira aliados.", ["Aumente Sab ou Car em 1.", "Após descanso curto ou longo, aliados ganham PV temporários."], "Sabedoria ou Carisma 13 ou maior"),
  gen("mente-aguda", "Mente Aguçada", "Mente afiada.", ["Aumente Int em 1.", "Proficiência ou expertise em Arcanismo, História, Investigação, Natureza ou Religião."]),
  gen("armadura-leve", "Armadura Leve", "Treino com armadura leve.", ["Aumente For ou Des em 1.", "Proficiência com armadura leve."]),
  gen("matador-de-magos", "Matador de Magos", "Combate contra conjuradores.", ["Aumente For ou Des em 1.", "Reação: ataque criatura que conjura a 1,5 m.", "Concentração do alvo tem desvantagem."]),
  gen("treino-de-arma-marcial", "Treino com Armas Marciais", "Treino marcial.", ["Aumente For ou Des em 1.", "Proficiência com armas marciais."]),
  gen("mestre-em-armadura-media", "Mestre em Armadura Média", "Armadura média com agilidade.", ["Aumente For ou Des em 1.", "Limite de +3 Des e sem desvantagem em Furtividade."], "Proficiência com armadura média"),
  gen("armadura-media", "Armadura Média", "Treino com armadura média.", ["Aumente For ou Des em 1.", "Proficiência com armadura média e escudos."], "Proficiência com armadura leve"),
  gen("combatente-montado", "Combatente Montado", "Cavaleiro letal.", ["Aumente For, Des ou Sab em 1.", "Vantagem contra criaturas menores desmontadas.", "Protege a montaria."]),
  gen("observador", "Observador", "Percepção apurada.", ["Aumente Int ou Sab em 1.", "Proficiência ou expertise em Intuição, Investigação, Percepção ou Sobrevivência."]),
  gen("perfurador", "Perfurador", "Armas perfurantes.", ["Aumente For ou Des em 1.", "Rejogue 1 dado de dano perfurante 1/turno; críticos causam +1 dado."]),
  gen("envenenador", "Envenenador", "Mestre dos venenos.", ["Aumente Des ou Int em 1.", "Ignora resistência a veneno; cria venenos como Ação Utilizar."]),
  gen("mestre-das-armas-de-haste", "Mestre das Armas de Haste", "Armas de haste.", ["Aumente For ou Des em 1.", "Ação bônus de ataque com a ponta de trás; ataque de oportunidade ao entrar no alcance."]),
  gen("resiliente", "Resiliente", "Você supera males.", ["Aumente um atributo em 1.", "Proficiência em testes de resistência desse atributo."]),
  gen("conjurador-de-ritual", "Conjurador de Ritual", "Rituais mágicos.", ["Aumente Int, Sab ou Car em 1.", "Livro de rituais com magias de nível 1 ou inferior."]),
  gen("toque-sombrio", "Toque Sombrio", "Tocado pela Umbra.", ["Aumente Int, Sab ou Car em 1.", "Invisibilidade e magia de Ilusão ou Necromancia de nível 1."]),
  gen("sentinela", "Sentinela", "Guardião eficiente.", ["Aumente For ou Des em 1.", "Ataque de oportunidade reduz deslocamento a 0.", "Reação: ataque criatura que atacar aliado."]),
  gen("atirador-de-elite", "Atirador de Elite", "Mira excepcional.", ["Aumente Des em 1.", "Ignora cobertura parcial e três quartos; sem desvantagem em longo alcance."], "Destreza 13 ou maior"),
  gen("mestre-em-escudos", "Mestre em Escudos", "Uso de escudo ofensivo.", ["Aumente For em 1.", "Ação bônus para empurrar com escudo; soma CA do escudo em salvaguardas de Destreza."], "Proficiência com escudos"),
  gen("especialista-em-pericia", "Especialista em Perícia", "Perícia aprimorada.", ["Aumente um atributo em 1.", "Proficiência em uma perícia e expertise em outra."]),
  gen("espreitador", "Espreitador", "Mestre em se esconder.", ["Aumente Des em 1.", "Visão no escuro 18 m; esconde-se com leve obscuridade."], "Destreza 13 ou maior"),
  gen("retalhador", "Retalhador", "Cortes profundos.", ["Aumente For ou Des em 1.", "1/turno ao acertar cortante: -3 m de deslocamento do alvo.", "Críticos impõem desvantagem."]),
  gen("veloz", "Veloz", "Rápido e ágil.", ["Aumente Des ou Con em 1.", "+3 m de deslocamento; Correr ignora terreno difícil; sem ataque de oportunidade."]),
  gen("atirador-arcano", "Atirador Arcano", "Mestre de ataques mágicos.", ["Aumente Int, Sab ou Car em 1.", "Magias de ataque ignoram cobertura; alcance dobrado.", "Aprende um truque de ataque."], "Capacidade de conjurar magias"),
  gen("telecinetico", "Telecinético", "Poder mental.", ["Aumente Int, Sab ou Car em 1.", "Mão Mágica sem componentes; empurre criaturas como ação bônus."]),
  gen("telepatico", "Telepático", "Comunicação mental.", ["Aumente Int, Sab ou Car em 1.", "Fala telepaticamente a 18 m; Detectar Pensamentos 1/descanso longo."]),
  gen("conjurador-belico", "Conjurador Bélico", "Combate mágico.", ["Aumente Int, Sab ou Car em 1.", "Vantagem em concentração; magia como reação de ataque de oportunidade."], "Capacidade de conjurar magias"),
  // Estilo de Luta
  fs("arquearia", "Arquearia", "Precisão com arcos.", ["+2 nas jogadas de ataque à distância com armas de longa distância."]),
  fs("combate-as-cegas", "Combate às Cegas", "Percepção sem visão.", ["Percepção às cegas num raio de 3 m."]),
  fs("defesa", "Defesa", "Armadura reforçada.", ["+1 de CA enquanto estiver usando armadura."]),
  fs("duelismo", "Duelismo", "Arma de uma mão.", ["+2 no dano com arma de uma mão, sem outra arma."]),
  fs("combate-com-arma-grande", "Combate com Armas Grandes", "Armas de duas mãos.", ["Trate 1 e 2 dos dados de dano como 3 com armas de duas mãos."]),
  fs("interceptacao", "Interceptação", "Proteja aliados.", ["Reação: reduza dano a um aliado em 1d10 + proficiência."]),
  fs("protecao", "Proteção", "Escudo para aliados.", ["Reação: impõe desvantagem a ataque contra aliado a 1,5 m (com escudo)."]),
  fs("combate-com-armas-de-arremesso", "Combate com Armas de Arremesso", "Arremesso eficiente.", ["Saca arma de arremesso como parte do ataque; +2 de dano."]),
  fs("combate-com-duas-armas", "Combate com Duas Armas", "Duas armas.", ["Adiciona modificador de atributo ao dano da segunda arma."]),
  fs("combate-sem-arma", "Combate Desarmado", "Golpes desarmados.", ["Dano desarmado d6 (d8 com mãos livres); 1d4 de dano em agarrões."]),
  // Dádivas Épicas
  boon("prestigio-em-combate", "de Proeza em Combate", "Golpes certeiros.", ["Quando errar um ataque, pode acertar em vez disso (1/turno)."]),
  boon("viagem-dimensional", "de Viagem Dimensional", "Teletransporte.", ["Teletransporte 9 m após Ataque ou Conjurar."]),
  boon("destino", "do Destino", "Guiado pelo destino.", ["Adiciona 2d4 a um teste de outra criatura a 18 m (1/descanso curto ou longo)."]),
  boon("fortitude", "de Fortitude", "Imenso vigor.", ["+40 PV máximos; cura ao tomar dano."]),
  boon("ofensiva-irresistivel", "de Ofensiva Irresistível", "Ataques inevitáveis.", ["Ignora resistência a dano contundente, cortante e perfurante."]),
  boon("recuperacao", "de Recuperação", "Recuperação rápida.", ["Cura como ação bônus: metade dos PV máximos (1/descanso longo)."]),
  boon("habilidade", "de Habilidade", "Aptidão ampliada.", ["Proficiência em todas as perícias; expertise em uma."]),
  boon("velocidade", "de Velocidade", "Super velocidade.", ["+9 m de deslocamento; Correr e Desengajar como ação bônus."]),
  boon("memoria-de-magia", "de Recordação de Magia", "Conjuração livre.", ["Conjure magia sem gastar espaço (1/turno)."]),
  boon("espirito-noturno", "do Espírito Noturno", "Furtividade sobrenatural.", ["Invisibilidade em penumbra e escuridão."]),
  boon("visao-verdadeira", "de Visão Verdadeira", "Percepção aguçada.", ["Visão verdadeira 18 m."]),
];

FEATS.push(...FEATS_2024);
