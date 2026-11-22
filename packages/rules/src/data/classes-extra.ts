// Classes extras de D&D 5e (PT-BR): Artífice (Eberron: Rising from the Last War / Tasha's Cauldron of Everything).
import type { ClassDef, ClassFeature } from "../types";

const asi = (level: number): ClassFeature => ({
  level,
  name: "Incremento no Valor de Habilidade",
  description:
    "Quando você atinge o 4° nível e novamente no 8°, 12°, 16° e 19° nível, você pode aumentar um valor de habilidade, à sua escolha, em 2 ou você pode aumentar dois valores de habilidade, à sua escolha, em 1. Como padrão, você não pode elevar um valor de habilidade acima de 20 com essa característica.",
});

const f = (level: number, name: string, description: string): ClassFeature => ({ level, name, description });

const ARTIFICE: ClassDef = {
  id: "artifice",
  name: "Artífice",
  summary:
    "Mestre em inventar e infundir magia em objetos, o artífice usa ferramentas e engenhosidade para criar itens mágicos, curar aliados e fortalecer a si e aos companheiros.",
  hitDie: 8,
  primaryAbilities: ["int"],
  savingThrows: ["con", "int"],
  armorProficiencies: ["Armaduras leves", "Armaduras médias", "Escudos"],
  weaponProficiencies: ["Armas simples"],
  toolProficiencies: ["Ferramentas de ladrão", "Ferramentas de funileiro", "Um tipo de ferramenta de artesão à sua escolha"],
  skillChoices: {
    count: 2,
    from: ["arcanismo", "historia", "investigacao", "medicina", "natureza", "percepcao", "prestidigitacao"],
  },
  startingEquipment: [
    "(a) duas armas simples quaisquer ou (b) uma besta leve e 20 virotes",
    "(a) armadura de couro batido ou (b) camisão de cota de malha",
    "Ferramentas de ladrão e um pacote de explorador",
  ],
  features: [
    f(1, "Conjuração", "Você estudou o funcionamento da magia e como canalizá-la através de objetos. Seu atributo de conjuração é Inteligência. Foco: você usa ferramentas de ladrão ou ferramentas de artesão com as quais seja proficiente como foco arcano; você deve estar de posse delas ao conjurar. Truques: você conhece dois truques da lista de artífice (mais um no 10º nível e outro no 14º). Preparando magias: você prepara uma quantidade de magias da lista de artífice igual ao seu modificador de Inteligência + metade do seu nível de artífice (arredondado para baixo), mínimo de uma. Conjuração ritual: você pode conjurar qualquer magia de artífice preparada que tenha o descritor ritual. CD de resistência = 8 + bônus de proficiência + mod. de Inteligência."),
    f(1, "Engenhoca Mágica", "No 1º nível, você aprende a imbuir objetos com magia. Como ação, você toca um objeto Miúdo não mágico e lhe concede uma das propriedades: o objeto emite luz fraca de 1,5 m de raio; ou reproduz uma mensagem gravada de até 6 segundos; ou emite um odor ou som inofensivo, à escolha; ou mostra texto estático ou imagem simples. A propriedade dura 1 hora (a menos que você a encerre). Você pode ter até um número de objetos assim igual ao seu modificador de Inteligência."),
    f(2, "Infundir Item", "No 2º nível, você ganha a capacidade de imbuir objetos mundanos com certas infusões mágicas. Você aprende quatro infusões (seis no 6º nível, oito no 10º, dez no 14º e doze no 18º) e pode ter no máximo duas infusões ativas (três no 6º nível, quatro no 10º, cinco no 14º e seis no 18º). Ao terminar um descanso longo, você pode tocar um objeto não mágico e infundi-lo. A infusão dura até você terminá-la ou até você morrer. Infusões incluem Armadura Aprimorada, Arma Aprimorada, Foco Arcano Aprimorado, Servo Homúnculo, Afiador de Mente, Escudo Repulsor, Flecha Repetidora, Armadura Resistente, Arma Retornante, Botas do Caminho Sinuoso, Replicar Item Mágico, Arma Radiante, Elmo de Percepção e outras."),
    f(3, "Especialização do Artífice", "No 3º nível, você escolhe uma especialização: Alquimista, Armeiro, Artilheiro ou Ferreiro de Batalha. Sua escolha concede características nos níveis 3º, 5º, 9º e 15º."),
    f(3, "A Ferramenta Certa para o Trabalho", "No 3º nível, você aprende a produzir a ferramenta ideal. Ao terminar um descanso curto ou longo, você pode usar ferramentas de ladrão ou de artesão para criar magicamente um conjunto de ferramentas de artesão em um espaço desocupado a até 1,5 metro, que desaparece quando você usar esta característica novamente."),
    asi(4),
    f(6, "Especialista em Ferramentas", "No 6º nível, seu bônus de proficiência é dobrado em qualquer teste de habilidade que você faça que use uma ferramenta com a qual seja proficiente."),
    f(7, "Flash de Gênio", "No 7º nível, você ganha a capacidade de adicionar o modificador de Inteligência a um teste de habilidade ou teste de resistência. Quando você ou uma criatura a até 9 metros fizer o teste, você pode usar sua reação para adicionar seu modificador de Inteligência (mínimo +1) à jogada. Usos igual ao seu modificador de Inteligência (mínimo 1) por descanso longo."),
    asi(8),
    f(10, "Adepto de Itens Mágicos", "No 10º nível, você alcança um nível de proficiência na utilização de itens mágicos. Você pode se sintonizar com até 4 itens mágicos ao mesmo tempo. Você também reduz pela metade o tempo e o custo para criar itens mágicos comuns ou incomuns."),
    f(11, "Item que Armazena Magias", "No 11º nível, você pode armazenar uma magia em um objeto. Ao terminar um descanso longo, você toca uma arma simples ou marcial ou um item que você possa usar como foco de conjuração e armazena nele uma magia de artífice de 1º ou 2º nível (que tenha tempo de conjuração de 1 ação e que você possa conjurar usando espaços de magia). Enquanto segura o objeto, uma criatura pode usar uma ação para conjurar a magia armazenada, usando seu modificador de conjuração. O objeto pode ser usado um número de vezes igual a 2 × seu modificador de Inteligência (mínimo 2); após isso, a magia some."),
    asi(12),
    f(14, "Sábio de Itens Mágicos", "No 14º nível, você alcança um nível ainda maior de proficiência no uso de itens mágicos. Você pode se sintonizar com até cinco itens mágicos ao mesmo tempo e ignora todas as restrições de classe, raça, magia ou nível em itens mágicos que você sintonizar."),
    asi(16),
    f(18, "Mestre de Itens Mágicos", "No 18º nível, você pode se sintonizar com até seis itens mágicos ao mesmo tempo."),
    asi(19),
    f(20, "Alma do Artífice", "No 20º nível, sua maestria com itens mágicos permite que você aproveite suas conexões com eles. Você ganha +1 em todos os testes de resistência para cada item mágico com o qual esteja sintonizado. Além disso, se você for reduzido a 0 PV mas não morrer instantaneamente, você pode usar sua reação para encerrar uma das suas infusões ativas e ficar com 1 PV em vez de 0."),
  ],
  subclassLabel: "Especialização do Artífice",
  subclasses: [
    {
      id: "alquimista",
      name: "Alquimista",
      level: 3,
      description:
        "O alquimista é um especialista em combinar reagentes para produzir efeitos místicos. Eles usam suas criações para curar e causar dano, preparando elixires e poções instantâneas.",
      features: [
        f(3, "Proficiência com Ferramentas", "No 3º nível, você ganha proficiência com suprimentos de alquimista. Se já a tiver, ganha proficiência em outra ferramenta de artesão. Você pode usar suprimentos de alquimista como foco de conjuração para suas magias de artífice."),
        f(3, "Magias de Alquimista", "Você sempre tem preparadas as magias a seguir: 3º palavra de cura, raio nauseante; 5º esfera flamejante, flecha ácida de Melf; 9º forma gasosa, palavra de cura em massa; 13º definhar, proteção contra a morte; 17º névoa mortal, reviver os mortos."),
        f(3, "Elixir Experimental", "No 3º nível, sempre que você terminar um descanso longo, você pode criar magicamente um elixir em um frasco vazio que esteja carregando. Você cria um elixir (dois no 6º nível, três no 15º). Você também pode criar um elixir gastando um espaço de magia de 1º nível ou superior. Role na tabela (d6): 1 Cura (2d4 + Int PV), 2 Agilidade (+3 m de deslocamento por 1 hora), 3 Resiliência (+1 CA por 10 minutos), 4 Ousadia (+1d4 em ataques e testes de resistência por 1 minuto), 5 Voo (voo de 3 m por 10 minutos), 6 Transformação (efeito de alterar-se por 10 minutos). O elixir perde potência após 10 minutos."),
        f(5, "Sábio Alquímico", "No 5º nível, sua habilidade com reagentes aprimora as poções e substâncias que você faz. Sempre que você conjurar uma magia de artífice que cause dano de ácido, fogo, necrótico ou venenoso, ou que restaure PV, usando suprimentos de alquimista como foco, você ganha bônus na jogada de dano ou cura igual ao seu modificador de Inteligência (mínimo +1)."),
        f(9, "Reagentes Restauradores", "No 9º nível, você pode incorporar reagentes restauradores em alguns de seus itens: sempre que uma criatura bebe um Elixir Experimental criado por você, ela ganha 2d6 + Int PV temporários. Além disso, você pode conjurar restauração menor sem gastar espaço de magia e sem componentes materiais, um número de vezes igual ao seu modificador de Inteligência (mínimo 1) por descanso longo."),
        f(15, "Maestria Química", "No 15º nível, você foi exposto a tantos produtos químicos que ganha resistência a dano de ácido e de veneno e imunidade à condição envenenado. Você pode conjurar restauração maior e cura (curar) sem espaço, componentes ou foco, uma vez cada por descanso longo, usando sua Inteligência."),
      ],
    },
    {
      id: "armeiro",
      name: "Armeiro",
      level: 3,
      description:
        "Um armeiro modifica sua armadura para agir como uma segunda pele, um traje mecânico que fortalece, protege e armazena armas mágicas. Seu traje arcano pode se adaptar a lutadores de linha de frente ou a infiltradores.",
      features: [
        f(3, "Ferramentas do Ofício", "No 3º nível, você ganha proficiência com armaduras pesadas. Você também ganha proficiência com ferramentas de ferreiro; se já a tiver, ganha proficiência em outra ferramenta de artesão à sua escolha."),
        f(3, "Magias de Armeiro", "Você sempre tem preparadas as magias a seguir: 3º mísseis mágicos, onda trovejante; 5º imagem espelhada, despedaçar; 9º padrão hipnótico, relâmpago; 13º escudo de fogo, invisibilidade maior; 17º passa-parede, muralha de energia."),
        f(3, "Armadura Arcana", "No 3º nível, você transforma uma armadura em armadura arcana, que serve como foco de conjuração. Enquanto você a veste, ela não pode ser removida contra sua vontade, ela cobre seu corpo, você pode usar ou retirar (ação) e ela substitui um membro que você tenha perdido. A armadura ignora requisitos de Força. Você usa seu foco para conjurar magias; e ganha ganhos conforme o modelo."),
        f(3, "Modelo de Armadura", "No 3º nível, escolha um modelo para sua armadura arcana: Guardião (Luvas Trovejantes: ataques de 1d8 de dano trovejante que impõem desvantagem em ataques contra outros alvos; Campo Defensivo: reação ou ação bônus para ganhar PV temporários igual ao seu nível de artífice) ou Infiltrador (Lançador de Relâmpagos: arma corpo a corpo de 1d6 de dano elétrico à distância e 1d6 adicional uma vez por turno; Passos Silenciosos: +1,5 m de deslocamento; Campo Atenuador: vantagem em testes de Furtividade)."),
        f(5, "Ataque Extra", "No 5º nível, você pode atacar duas vezes, ao invés de uma, sempre que realizar a ação de Atacar no seu turno."),
        f(9, "Modificações de Armadura", "No 9º nível, você aprende a modificar sua armadura. Ela passa a contar como itens separados (peitoral, botas, capacete e arma) para fins de infusões. Você ganha mais duas infusões ativas, que só podem ser usadas nas partes da armadura arcana."),
        f(15, "Armadura Aperfeiçoada", "No 15º nível, sua armadura arcana é aperfeiçoada: Guardião ganha Puxão do Guardião (arrasta criaturas de dano trovejante e vantagem em ataques) e Infiltrador ganha Brilho Deslumbrante (alvos ficam sob um efeito que dá dano adicional de 1d6 e vantagem para quem atacar)."),
      ],
    },
    {
      id: "artilheiro",
      name: "Artilheiro",
      level: 3,
      description:
        "Um artilheiro é especialista em canhões élficos mágicos, que usa para infligir dano, proteger aliados e fortalecer a linha de frente.",
      features: [
        f(3, "Proficiência com Ferramentas", "No 3º nível, você ganha proficiência com ferramentas de entalhador de madeira. Se já a tiver, ganha proficiência em outra ferramenta de artesão. Você pode usar essas ferramentas como foco de conjuração."),
        f(3, "Magias de Artilheiro", "Você sempre tem preparadas as magias a seguir: 3º escudo, onda trovejante; 5º raio ardente, despedaçar; 9º bola de fogo, muralha de vento; 13º tempestade de gelo, muralha de fogo; 17º cone de frio, muralha de energia."),
        f(3, "Canhão Élfico", "No 3º nível, como ação, você pode criar um canhão élfico em um espaço desocupado a até 1,5 metro. Escolha: Lança-chamas (cone de 4,5 m, 2d8 de dano de fogo, teste de Destreza), Balista de Energia (ataque à distância de 2d8 de dano de energia, que empurra 1,5 m) ou Protetor (PV temporários 1d8 + Int a uma criatura próxima). O canhão é Pequeno ou Miúdo, tem CA 18, PV igual a 5 × seu nível de artífice e dura 1 hora. Você pode criá-lo uma vez por descanso longo, ou gastando um espaço de magia."),
        f(5, "Arma de Fogo Arcana", "No 5º nível, você sabe como usar uma varinha, bastão ou cajado como foco para conjurar. Sempre que causar dano com uma magia de artífice usando esse foco, você adiciona 1d8 ao dano em um alvo."),
        f(9, "Canhão Explosivo", "No 9º nível, o dano de todos os seus canhões élficos aumenta em 1d8. Além disso, como ação, você pode comandar o canhão a detonar, destruindo-o e causando 3d8 de dano de energia em criaturas a até 6 metros (teste de Destreza para metade)."),
        f(15, "Posição Fortificada", "No 15º nível, você e seus aliados a até 3 metros do canhão ganham meia cobertura. Você pode criar dois canhões de uma vez, e a ação para criar o segundo é bônus."),
      ],
    },
    {
      id: "ferreiro-de-batalha",
      name: "Ferreiro de Batalha",
      level: 3,
      description:
        "Os ferreiros de batalha são combatentes que usam magia para consertar e reparar o aço, pareados com um defensor de aço, uma criação mecânica que luta e protege ao seu lado.",
      features: [
        f(3, "Proficiência com Ferramentas", "No 3º nível, você ganha proficiência com ferramentas de ferreiro. Se já a tiver, ganha proficiência em outra ferramenta de artesão."),
        f(3, "Magias de Ferreiro de Batalha", "Você sempre tem preparadas as magias a seguir: 3º heroísmo, escudo; 5º golpe marcante, vínculo protetor; 9º aura de vitalidade, barragem de conjuração; 13º aura de pureza, escudo de fogo; 17º golpe banidor, cura em massa."),
        f(3, "Pronto para a Batalha", "No 3º nível, você ganha proficiência com armas marciais. Além disso, quando atacar com uma arma mágica, você pode usar seu modificador de Inteligência, ao invés de Força ou Destreza, para jogadas de ataque e dano."),
        f(3, "Defensor de Aço", "No 3º nível, seu trabalho com ferramentas criou um defensor de aço, um constructo leal. Ele obedece a seus comandos (ação bônus). Tem CA 15, PV igual a 2 + seu modificador de Inteligência + 5 × seu nível de artífice, ataque Força de Ferro (1d8 + bônus de proficiência de dano de energia) e pode conjurar Reparar (cura 2d8 + prof. a si ou a outra criatura). Se ele for destruído, você pode reconstruí-lo em 1 hora gastando um espaço de magia."),
        f(5, "Ataque Extra", "No 5º nível, você pode atacar duas vezes, ao invés de uma, sempre que realizar a ação de Atacar no seu turno. Seu defensor de aço também ganha dois ataques."),
        f(9, "Choque Arcano", "No 9º nível, você aprende a canalizar magia através de ataques: uma vez por turno, quando atingir uma criatura com um ataque de arma mágica ou o defensor atingir, você pode causar 2d6 de dano de energia adicional ou curar 2d6 PV a uma criatura a até 9 metros. Usos igual ao seu modificador de Inteligência por descanso longo."),
        f(15, "Defensor Aprimorado", "No 15º nível, seu Choque Arcano causa ou cura 4d6, e o defensor de aço ganha +2 na CA e Defletir Ataque: como reação, ele impõe desvantagem no ataque contra um alvo próximo e causa 1d4 + Int de dano de energia ao atacante."),
      ],
    },
  ],
  spellcasting: {
    ability: "int",
    kind: "half",
    cantripsKnown: [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4],
    preparesSpells: true,
    ritualCasting: true,
    focus: "Ferramentas de ladrão ou ferramentas de artesão",
  },
  progressionColumns: [
    {
      label: "Infusões Conhecidas",
      values: ["—", 4, 4, 4, 4, 6, 6, 6, 6, 8, 8, 8, 8, 10, 10, 10, 10, 12, 12, 12],
    },
    {
      label: "Itens Infundidos",
      values: ["—", 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6],
    },
    {
      label: "Espaços de Magia (1º ao 5º)",
      values: [
        "2", "2", "3", "3", "4/2", "4/2", "4/3", "4/3", "4/3/2", "4/3/2",
        "4/3/3", "4/3/3", "4/3/3/1", "4/3/3/1", "4/3/3/2", "4/3/3/2", "4/3/3/3/1", "4/3/3/3/1", "4/3/3/3/2", "4/3/3/3/2",
      ],
    },
  ],
};

export const CLASSES_EXTRA: ClassDef[] = [ARTIFICE];
