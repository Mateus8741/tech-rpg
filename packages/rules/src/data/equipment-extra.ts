// Equipamento complementar de D&D 5e (PT-BR): armas de fogo e especiais (Guia do Mestre),
// pacotes detalhados, serviços, estilos de vida, bens de troca, gemas, objetos de arte, venenos, etc.
// Os formatos seguem os de equipment.ts (Weapon, ArmorItem e a forma de GEAR).
import type { ArmorItem, Weapon } from "../types";

export interface ExtraGearItem {
  name: string;
  cost: string;
  weight: string;
  category: string;
  description?: string;
}

const w = (
  category: Weapon["category"],
  kind: Weapon["kind"],
  name: string,
  cost: string,
  damage: string,
  weight: string,
  properties: string[] = [],
): Weapon => ({ name, category, kind, damage, cost, weight, properties });

/** Armas adicionais (Guia do Mestre: armas de fogo; PHB: ataque desarmado e arma improvisada). */
export const WEAPONS_EXTRA: Weapon[] = [
  w("Simples", "Corpo a corpo", "Ataque Desarmado", "—", "1 + mod. de For contundente", "—", []),
  w("Simples", "Corpo a corpo", "Arma Improvisada", "—", "1d4 (tipo à escolha do Mestre)", "—", ["Improvisada"]),
  w("Marcial", "À distância", "Pistola", "150 po", "1d10 perfurante", "1,5 kg", ["Munição (distância 9/27)", "Recarga (4)", "Arma de fogo"]),
  w("Marcial", "À distância", "Mosquete", "500 po", "1d12 perfurante", "5 kg", ["Munição (distância 12/36)", "Recarga (1)", "Duas mãos", "Arma de fogo"]),
  w("Marcial", "À distância", "Pistola Automática", "—", "2d6 perfurante", "1,5 kg", ["Munição (distância 15/45)", "Recarga (15)", "Arma de fogo", "Moderna"]),
  w("Marcial", "À distância", "Revólver", "—", "2d8 perfurante", "1,5 kg", ["Munição (distância 12/36)", "Recarga (6)", "Arma de fogo", "Moderna"]),
  w("Marcial", "À distância", "Rifle de Caça", "—", "2d10 perfurante", "4 kg", ["Munição (distância 24/72)", "Recarga (5)", "Duas mãos", "Arma de fogo", "Moderna"]),
  w("Marcial", "À distância", "Rifle Automático", "—", "2d8 perfurante", "4 kg", ["Munição (distância 24/72)", "Recarga (30)", "Rajada (10)", "Duas mãos", "Arma de fogo", "Futurista"]),
  w("Marcial", "À distância", "Escopeta", "—", "2d8 perfurante", "3,5 kg", ["Munição (distância 9/27)", "Recarga (2)", "Duas mãos", "Arma de fogo", "Moderna"]),
];

/** Armaduras adicionais. Não há armaduras base oficiais fora do PHB; fica vazio para integração futura. */
export const ARMOR_EXTRA: ArmorItem[] = [];

/** Propriedades de arma (PHB). */
export const WEAPON_PROPERTIES: { name: string; description: string }[] = [
  { name: "Acuidade", description: "Você pode usar seu modificador de Força ou de Destreza (à escolha) nas jogadas de ataque e de dano." },
  { name: "Alcance", description: "Aumenta em 1,5 metro o seu alcance corpo a corpo ao atacar com a arma." },
  { name: "Arremesso", description: "Pode ser arremessada para realizar ataques à distância; usa o mesmo modificador de habilidade do ataque corpo a corpo." },
  { name: "Duas mãos", description: "Requer as duas mãos para atacar." },
  { name: "Leve", description: "Arma pequena e fácil de manejar; essencial para combater com duas armas." },
  { name: "Munição", description: "Para atacar com a arma à distância é necessária munição; cada ataque gasta uma peça. Recuperar metade (arredondada para baixo) após o combate." },
  { name: "Pesada", description: "Criaturas Pequenas têm desvantagem em jogadas de ataque com armas pesadas." },
  { name: "Recarga", description: "Só é possível disparar um certo número de vezes por ação, ação bônus ou reação, independentemente de quantos ataques você tenha." },
  { name: "Especial", description: "A arma tem regras próprias descritas no seu texto (por exemplo, a rede)." },
  { name: "Versátil", description: "Pode ser usada com uma ou duas mãos; o dano entre parênteses é o de duas mãos." },
];

/** Serviços, despesas, bens, gemas, venenos, pacotes e outros itens (mesmo formato de GEAR, com descrição opcional). */
export const GEAR_EXTRA: ExtraGearItem[] = [];

const g = (category: string, rows: [name: string, cost: string, weight: string, description?: string][]) => {
  for (const [name, cost, weight, description] of rows) GEAR_EXTRA.push({ name, cost, weight, category, description });
};

g("Equipamento de aventura (adicional)", [
  ["Bomba de Fumaça (alquímica)", "50 po", "0,5 kg", "Frasco que, ao ser quebrado, enche uma área de 3 m de raio com fumaça espessa por 1 minuto (área fortemente obscurecida)."],
  ["Corda de seda (15 m)", "10 po", "2,5 kg", "Suporta até 150 kg."],
  ["Rede de pesca", "5 po", "2,5 kg", "Rede de malha fina usada para pesca ou captura de animais pequenos."],
  ["Estrepes (bolsa)", "1 po", "1 kg", "Espalhados num quadrado de 1,5 m; criaturas que entrarem fazem teste de Destreza CD 15 ou param e sofrem 1 de dano perfurante, com deslocamento reduzido."],
  ["Esferas de Metal (1.000)", "1 po", "1 kg", "Espalhadas, criam terreno difícil; teste de Destreza CD 10 ou cai Caído."],
  ["Lâmpada de Óleo", "5 pp", "0,5 kg", "Ilumina um raio de 4,5 m com luz plena e mais 4,5 m de penumbra. Queima 6 horas com 1 frasco de óleo."],
  ["Lanterna Coberta", "5 po", "1 kg", "Cone de luz 18 m, penumbra 18 m adicionais. Queima 6 horas com 1 frasco de óleo."],
  ["Poção de Cura", "50 po", "0,25 kg", "Recupera 2d4 + 2 pontos de vida (poção comum)."],
  ["Poção de Cura Maior", "—", "0,25 kg", "Item mágico incomum (DMG); cura 4d4 + 4 PV."],
  ["Pergaminho de Magia (nível 1)", "—", "—", "Item mágico (DMG) cuja magia pode ser conjurada uma única vez."],
]);

g("Pacote de equipamento (conteúdo)", [
  ["Pacote de Artista (conteúdo)", "40 po", "—", "Mochila, saco de dormir, 2 fantasias, 5 velas, 5 dias de rações, cantil, kit de disfarce."],
  ["Pacote de Assaltante (conteúdo)", "16 po", "—", "Mochila, saco com 1.000 esferas de metal, 3 m de barbante, sino, 5 velas, pé de cabra, martelo, 10 pítons, lanterna furta-fogo, 2 frascos de óleo, 5 dias de rações, caixa de fogo, cantil, corda de cânhamo (15 m)."],
  ["Pacote de Aventureiro (conteúdo)", "12 po", "—", "Mochila, pé de cabra, martelo, 10 pítons, 10 tochas, caixa de fogo, 10 dias de rações, cantil, corda de cânhamo (15 m)."],
  ["Pacote de Diplomata (conteúdo)", "39 po", "—", "Baú, 2 estojos de mapas/pergaminhos, roupas finas, vidro de tinta, caneta-tinteiro, lâmpada, 2 frascos de óleo, 5 folhas de papel, frasco de perfume, cera de lacre, sabão."],
  ["Pacote de Estudioso (conteúdo)", "40 po", "—", "Mochila, livro de conhecimento, vidro de tinta, caneta-tinteiro, 10 folhas de pergaminho, saquinho de areia, faquinha."],
  ["Pacote de Explorador (conteúdo)", "10 po", "—", "Mochila, saco de dormir, kit de refeição, caixa de fogo, 10 tochas, 10 dias de rações, cantil, corda de cânhamo (15 m)."],
  ["Pacote de Sacerdote (conteúdo)", "19 po", "—", "Mochila, cobertor, 10 velas, caixa de fogo, caixa de esmolas, 2 blocos de incenso, incensário, vestimentas, 2 dias de rações, cantil."],
]);

g("Veneno (Guia do Mestre)", [
  ["Sangue de Assassino (ingerido)", "150 po", "—", "CD 10 Con; 1d12 veneno e envenenado por 24 horas."],
  ["Fumaça de Othur Queimada (inalado)", "500 po", "—", "CD 13 Con; 3d6 veneno por rodada, até 3 testes bem-sucedidos."],
  ["Muco de Carniçal Rastejante (contato)", "200 po", "—", "CD 13 Con; envenenado 1 minuto e paralisado."],
  ["Veneno Drow (injetado)", "200 po", "—", "CD 13 Con; envenenado 1 hora; se falhar em 5 ou mais, inconsciente."],
  ["Essência de Éter (inalado)", "300 po", "—", "CD 15 Con; envenenado 8 horas e inconsciente."],
  ["Malícia (inalado)", "250 po", "—", "CD 15 Con; envenenado 1 hora e cego."],
  ["Lágrimas da Meia-Noite (ingerido)", "1.500 po", "—", "Sem efeito até a meia-noite; CD 17 Con, 9d6 veneno."],
  ["Óleo de Taggit (contato)", "400 po", "—", "CD 13 Con; envenenado 24 horas e inconsciente."],
  ["Tintura Pálida (ingerido)", "250 po", "—", "CD 16 Con; 1d6 veneno; repete a cada 24 h por 7 dias."],
  ["Veneno de Verme Roxo (injetado)", "2.000 po", "—", "CD 19 Con; 12d6 veneno (metade se sucesso)."],
  ["Veneno de Serpente (injetado)", "200 po", "—", "CD 11 Con; 3d6 veneno."],
  ["Torpor (ingerido)", "600 po", "—", "CD 15 Con; envenenado 4d6 horas e incapacitado."],
  ["Soro da Verdade (ingerido)", "150 po", "—", "CD 11 Con; envenenado 1 hora; impossibilitado de mentir de forma deliberada."],
  ["Veneno de Serpente-Verme (injetado)", "1.200 po", "—", "CD 15 Con; 7d6 veneno (metade se sucesso)."],
]);

g("Serviços", [
  ["Condutor (entre cidades)", "1 pc / 1,5 km", "—"],
  ["Condutor (dentro da cidade)", "1 pc", "—"],
  ["Mensageiro", "2 pc / 1,5 km", "—"],
  ["Mercenário (não treinado)", "2 pp / dia", "—"],
  ["Mercenário (treinado)", "2 po / dia", "—"],
  ["Pedágio de estrada ou portão", "1 pc", "—"],
  ["Passagem de navio", "1 po / 1,5 km", "—"],
  ["Magia: nível 0 (truque)", "—", "—", "Gratuito em templos; somente em cidades grandes."],
  ["Magia: 1º círculo", "10–50 po", "—"],
  ["Magia: 2º círculo", "20–200 po", "—"],
  ["Magia: 3º círculo", "100–200 po", "—"],
  ["Magia: 4º círculo", "300–600 po", "—"],
  ["Magia: 5º círculo", "500–1.000 po", "—"],
]);

g("Estilo de vida (por dia)", [
  ["Miserável", "0 po", "—"],
  ["Esquálido", "1 pp", "—"],
  ["Pobre", "2 pp", "—"],
  ["Modesto", "1 po", "—"],
  ["Confortável", "2 po", "—"],
  ["Rico", "4 po", "—"],
  ["Aristocrático", "10 po (mínimo)", "—"],
]);

g("Comida, bebida e hospedagem", [
  ["Cerveja (caneca)", "4 pc", "—"],
  ["Cerveja (jarra de 4 L)", "2 pp", "—"],
  ["Banquete (por pessoa)", "10 po", "—"],
  ["Pão (um pão)", "2 pc", "—"],
  ["Queijo (um pedaço)", "1 pp", "—"],
  ["Carne (um pedaço)", "3 pp", "—"],
  ["Vinho comum (jarra)", "2 pp", "—"],
  ["Vinho fino (garrafa)", "10 po", "—"],
  ["Hospedagem esquálida (dia)", "7 pc", "—"],
  ["Hospedagem pobre (dia)", "1 pp", "—"],
  ["Hospedagem modesta (dia)", "5 pp", "—"],
  ["Hospedagem confortável (dia)", "8 pp", "—"],
  ["Hospedagem rica (dia)", "2 po", "—"],
  ["Hospedagem aristocrática (dia)", "4 po", "—"],
  ["Refeição esquálida", "3 pc", "—"],
  ["Refeição pobre", "6 pc", "—"],
  ["Refeição modesta", "3 pp", "—"],
  ["Refeição confortável", "5 pp", "—"],
  ["Refeição rica", "8 pp", "—"],
  ["Refeição aristocrática", "2 po", "—"],
]);

g("Bens de troca", [
  ["Trigo (0,5 kg)", "1 pc", "0,5 kg"],
  ["Farinha (0,5 kg)", "2 pc", "0,5 kg"],
  ["Galinha", "2 pc", "—"],
  ["Sal (0,5 kg)", "5 pc", "0,5 kg"],
  ["Ferro (0,5 kg)", "1 pp", "0,5 kg"],
  ["Cobre (0,5 kg)", "5 pp", "0,5 kg"],
  ["Algodão (1 m²)", "5 pp", "—"],
  ["Gengibre (0,5 kg)", "1 po", "0,5 kg"],
  ["Cabra", "1 po", "—"],
  ["Linho (1 m²)", "1 po", "—"],
  ["Canela ou pimenta (0,5 kg)", "2 po", "0,5 kg"],
  ["Ovelha", "2 po", "—"],
  ["Cravo (0,5 kg)", "3 po", "0,5 kg"],
  ["Porco", "3 po", "—"],
  ["Prata (0,5 kg)", "5 po", "0,5 kg"],
  ["Seda (1 m²)", "10 po", "—"],
  ["Vaca", "10 po", "—"],
  ["Açafrão (0,5 kg)", "15 po", "0,5 kg"],
  ["Boi", "15 po", "—"],
  ["Ouro (0,5 kg)", "50 po", "0,5 kg"],
  ["Platina (0,5 kg)", "500 po", "0,5 kg"],
]);

g("Pedra preciosa (valor)", [
  ["Azurita, ágata, hematita, lápis-lazúli, malaquita, obsidiana, rodocrosita, turquesa", "10 po", "—"],
  ["Heliotrópio, cornalina, calcedônia, citrino, jaspe, pedra-da-lua, ônix, quartzo, zircão", "50 po", "—"],
  ["Âmbar, ametista, crisoberilo, coral, granada, jade, azeviche, pérola, espinela, turmalina", "100 po", "—"],
  ["Alexandrita, água-marinha, pérola negra, safira-espinela, peridoto, topázio", "500 po", "—"],
  ["Opala negra, safira azul, esmeralda, opala de fogo, opala, rubi estrela, safira estrela, safira amarela", "1.000 po", "—"],
  ["Coríndon preto, diamante, jacinto, rubi", "5.000 po", "—"],
]);

g("Objeto de arte (valor)", [
  ["Cálice de prata, estatueta de marfim, braceletes de prata, ídolo de prata", "25 po", "—"],
  ["Anel de ouro com gemas, estatueta de pedra, pintura grande", "250 po", "—"],
  ["Tiara de ouro, cálice de ouro cravejado de gemas", "750 po", "—"],
  ["Colar de ouro com gema, coroa de ouro", "2.500 po", "—"],
  ["Coroa real, anel de selo real, objeto lendário", "7.500 po", "—"],
]);

g("Ferramenta (adicional)", [
  ["Veículos (terrestres)", "—", "—", "Proficiência para conduzir veículos terrestres (carroças, carruagens). Permite testes de habilidade para manobras e reparos."],
  ["Veículos (aquáticos)", "—", "—", "Proficiência para pilotar barcos e navios; testes para navegação, manobra e reparos."],
  ["Kit de herbalismo", "5 po", "1,5 kg", "Permite criar antídotos e poções de cura (nível básico), e identificar plantas."],
  ["Kit de disfarce", "25 po", "1,5 kg", "Cosméticos, tintura de cabelo, pequenos adereços; permite criar disfarces."],
  ["Ferramentas de ladrão", "25 po", "0,5 kg", "Lima, gazuas, espelho de cabo, tesoura pequena, alicate; para abrir fechaduras e desarmar armadilhas."],
]);
