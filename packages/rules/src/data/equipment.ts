// Equipamento de D&D 5e (PT-BR) — Livro do Jogador, capítulo 5.
// Preços em po/pp/pc; pesos em kg, exatamente como nas tabelas do livro.
import type { ArmorItem, Weapon } from "../types";

type Cat = Weapon["category"];
type Kind = Weapon["kind"];

const w = (
  category: Cat,
  kind: Kind,
  name: string,
  cost: string,
  damage: string,
  weight: string,
  properties: string[] = [],
): Weapon => ({ name, category, kind, damage, cost, weight, properties });

const SM = "Simples" as const;
const MA = "Marcial" as const;
const CC = "Corpo a corpo" as const;
const AD = "À distância" as const;

export const WEAPONS: Weapon[] = [
  // Armas simples corpo a corpo
  w(SM, CC, "Adaga", "2 po", "1d4 perfurante", "0,5 kg", ["Acuidade", "Leve", "Arremesso (distância 6/18)"]),
  w(SM, CC, "Azagaia", "5 pp", "1d6 perfurante", "1 kg", ["Arremesso (distância 9/36)"]),
  w(SM, CC, "Bordão", "2 pp", "1d6 concussão", "2 kg", ["Versátil (1d8)"]),
  w(SM, CC, "Clava Grande", "2 pp", "1d8 concussão", "5 kg", ["Pesada", "Duas mãos"]),
  w(SM, CC, "Foice Curta", "1 po", "1d4 cortante", "1 kg", ["Leve"]),
  w(SM, CC, "Lança", "1 po", "1d6 perfurante", "1,5 kg", ["Arremesso (distância 6/18)", "Versátil (1d8)"]),
  w(SM, CC, "Maça", "5 po", "1d6 concussão", "2 kg"),
  w(SM, CC, "Machadinha", "5 po", "1d6 cortante", "1 kg", ["Leve", "Arremesso (distância 6/18)"]),
  w(SM, CC, "Martelo Leve", "2 po", "1d4 concussão", "1 kg", ["Leve", "Arremesso (distância 6/18)"]),
  w(SM, CC, "Porrete", "1 pp", "1d4 concussão", "1 kg", ["Leve"]),
  // Armas simples à distância
  w(SM, AD, "Arco Curto", "25 po", "1d6 perfurante", "1 kg", ["Munição (distância 24/96)", "Duas mãos"]),
  w(SM, AD, "Besta Leve", "25 po", "1d8 perfurante", "2,5 kg", ["Munição (distância 24/96)", "Recarga", "Duas mãos"]),
  w(SM, AD, "Dardo", "5 pc", "1d4 perfurante", "0,1 kg", ["Acuidade", "Arremesso (distância 6/18)"]),
  w(SM, AD, "Funda", "1 pp", "1d4 concussão", "—", ["Munição (distância 9/36)"]),
  // Armas marciais corpo a corpo
  w(MA, CC, "Alabarda", "20 po", "1d10 cortante", "3 kg", ["Pesada", "Alcance", "Duas mãos"]),
  w(MA, CC, "Cimitarra", "25 po", "1d6 cortante", "1,5 kg", ["Acuidade", "Leve"]),
  w(MA, CC, "Chicote", "2 po", "1d4 cortante", "1,5 kg", ["Acuidade", "Alcance"]),
  w(MA, CC, "Espada Curta", "10 po", "1d6 perfurante", "1 kg", ["Acuidade", "Leve"]),
  w(MA, CC, "Espada Grande", "50 po", "2d6 cortante", "3 kg", ["Pesada", "Duas mãos"]),
  w(MA, CC, "Espada Longa", "15 po", "1d8 cortante", "1,5 kg", ["Versátil (1d10)"]),
  w(MA, CC, "Glaive", "20 po", "1d10 cortante", "3 kg", ["Pesada", "Alcance", "Duas mãos"]),
  w(MA, CC, "Lança de Montaria", "10 po", "1d12 perfurante", "3 kg", ["Alcance", "Especial"]),
  w(MA, CC, "Lança Longa", "5 po", "1d10 perfurante", "4 kg", ["Pesada", "Alcance", "Duas mãos"]),
  w(MA, CC, "Maça Estrela", "15 po", "1d8 perfurante", "2 kg"),
  w(MA, CC, "Machado Grande", "30 po", "1d12 cortante", "3,5 kg", ["Pesada", "Duas mãos"]),
  w(MA, CC, "Machado de Batalha", "10 po", "1d8 cortante", "2 kg", ["Versátil (1d10)"]),
  w(MA, CC, "Malho", "10 po", "2d6 concussão", "5 kg", ["Pesada", "Duas mãos"]),
  w(MA, CC, "Mangual", "10 po", "1d8 concussão", "1 kg"),
  w(MA, CC, "Martelo de Guerra", "15 po", "1d8 concussão", "1 kg", ["Versátil (1d10)"]),
  w(MA, CC, "Picareta de Guerra", "5 po", "1d8 perfurante", "1 kg"),
  w(MA, CC, "Rapieira", "25 po", "1d8 perfurante", "1 kg", ["Acuidade"]),
  w(MA, CC, "Tridente", "5 po", "1d6 perfurante", "2 kg", ["Arremesso (distância 6/18)", "Versátil (1d8)"]),
  // Armas marciais à distância
  w(MA, AD, "Arco Longo", "50 po", "1d8 perfurante", "1 kg", ["Munição (distância 45/180)", "Pesada", "Duas mãos"]),
  w(MA, AD, "Besta de Mão", "75 po", "1d6 perfurante", "1,5 kg", ["Munição (distância 9/36)", "Leve", "Recarga"]),
  w(MA, AD, "Besta Pesada", "50 po", "1d10 perfurante", "4,5 kg", ["Munição (distância 30/120)", "Pesada", "Recarga", "Duas mãos"]),
  w(MA, AD, "Rede", "1 po", "—", "1,5 kg", ["Especial", "Arremesso (distância 1,5/4,5)"]),
  w(MA, AD, "Zarabatana", "10 po", "1 perfurante", "0,5 kg", ["Munição (distância 7,5/30)", "Recarga"]),
];

const DES = "+ modificador de Des";
const DES2 = "+ modificador de Des (máx. +2)";

export const ARMOR: ArmorItem[] = [
  // Armadura leve
  { name: "Acolchoada", category: "Leve", ac: `11 ${DES}`, stealthDisadvantage: true, cost: "5 po", weight: "4 kg" },
  { name: "Couro", category: "Leve", ac: `11 ${DES}`, stealthDisadvantage: false, cost: "10 po", weight: "5 kg" },
  { name: "Couro Batido", category: "Leve", ac: `12 ${DES}`, stealthDisadvantage: false, cost: "45 po", weight: "6,5 kg" },
  // Armadura média
  { name: "Gibão de Peles", category: "Média", ac: `12 ${DES2}`, stealthDisadvantage: false, cost: "10 po", weight: "6 kg" },
  { name: "Camisão de Malha", category: "Média", ac: `13 ${DES2}`, stealthDisadvantage: false, cost: "30 po", weight: "10 kg" },
  { name: "Brunea", category: "Média", ac: `14 ${DES2}`, stealthDisadvantage: true, cost: "50 po", weight: "22,5 kg" },
  { name: "Peitoral", category: "Média", ac: `14 ${DES2}`, stealthDisadvantage: false, cost: "400 po", weight: "10 kg" },
  { name: "Meia-Armadura", category: "Média", ac: `15 ${DES2}`, stealthDisadvantage: true, cost: "750 po", weight: "20 kg" },
  // Armadura pesada
  { name: "Cota de Anéis", category: "Pesada", ac: "14", stealthDisadvantage: true, cost: "30 po", weight: "20 kg" },
  { name: "Cota de Malha", category: "Pesada", ac: "16", strengthReq: 13, stealthDisadvantage: true, cost: "75 po", weight: "27,5 kg" },
  { name: "Cota de Talas", category: "Pesada", ac: "17", strengthReq: 15, stealthDisadvantage: true, cost: "200 po", weight: "30 kg" },
  { name: "Placas", category: "Pesada", ac: "18", strengthReq: 15, stealthDisadvantage: true, cost: "1.500 po", weight: "32,5 kg" },
  // Escudo
  { name: "Escudo", category: "Escudo", ac: "+2", stealthDisadvantage: false, cost: "10 po", weight: "3 kg" },
];

export const GEAR: { name: string; cost: string; weight: string; category: string }[] = [];

const g = (category: string, rows: [name: string, cost: string, weight: string][]) => {
  for (const [name, cost, weight] of rows) GEAR.push({ name, cost, weight, category });
};

g("Equipamento de aventura", [
  ["Ábaco", "2 po", "1 kg"],
  ["Ácido (vidro)", "25 po", "0,5 kg"],
  ["Água benta (frasco)", "25 po", "0,5 kg"],
  ["Algemas", "2 po", "2 kg"],
  ["Algibeira", "5 po", "0,5 kg"],
  ["Aljava", "1 po", "0,5 kg"],
  ["Ampulheta", "25 po", "0,5 kg"],
  ["Antídoto (vidro)", "50 po", "—"],
  ["Apito de advertência", "25 po", "0,5 kg"],
  ["Aríete portátil", "4 po", "17,5 kg"],
  ["Armadilha de caça", "5 po", "12,5 kg"],
  ["Arpéu", "2 po", "2 kg"],
  ["Balança de mercador", "5 po", "1,5 kg"],
  ["Balde", "5 pc", "1 kg"],
  ["Barril", "2 po", "35 kg"],
  ["Baú", "5 po", "12,5 kg"],
  ["Bolsa de componentes", "25 po", "1 kg"],
  ["Caixa de fogo", "5 pp", "0,5 kg"],
  ["Caneca", "2 pc", "0,5 kg"],
  ["Caneta tinteiro", "2 pc", "—"],
  ["Cantil", "2 pp", "2,5 kg"],
  ["Cesto", "4 pp", "1 kg"],
  ["Cobertor de inverno", "5 pp", "1,5 kg"],
  ["Corda de cânhamo (15 metros)", "1 po", "5 kg"],
  ["Corda de seda (15 metros)", "10 po", "2,5 kg"],
  ["Corrente (3 metros)", "5 po", "5 kg"],
  ["Equipamento de pescaria", "1 po", "2 kg"],
  ["Escada (3 metros)", "1 pp", "12,5 kg"],
  ["Esferas (sacola com 1.000)", "1 po", "1 kg"],
  ["Espelho de aço", "5 po", "0,25 kg"],
  ["Estrepes (bolsa com 20)", "1 po", "1 kg"],
  ["Fechadura", "10 po", "0,5 kg"],
  ["Fogo alquímico (frasco)", "50 po", "0,5 kg"],
  ["Frasco", "2 pc", "1 kg"],
  ["Garrafa de vidro", "1 po", "1 kg"],
  ["Giz (1 peça)", "1 pc", "—"],
  ["Grimório", "50 po", "1,5 kg"],
  ["Jarra", "4 pc", "2 kg"],
  ["Kit de escalada", "25 po", "6 kg"],
  ["Kit de primeiros-socorros", "5 po", "1,5 kg"],
  ["Lâmpada", "5 pp", "0,5 kg"],
  ["Lanterna coberta", "5 po", "1 kg"],
  ["Lanterna furta-fogo", "10 po", "1 kg"],
  ["Lente de aumento", "100 po", "—"],
  ["Livro", "25 po", "2,5 kg"],
  ["Luneta", "1.000 po", "0,5 kg"],
  ["Manto", "1 po", "2 kg"],
  ["Marreta", "2 po", "5 kg"],
  ["Martelo", "1 po", "1,5 kg"],
  ["Mochila", "2 po", "2,5 kg"],
  ["Óleo (frasco)", "1 pp", "0,5 kg"],
  ["Pá", "2 po", "2,5 kg"],
  ["Panela de ferro", "2 po", "5 kg"],
  ["Papel (uma folha)", "2 pp", "—"],
  ["Parafina", "5 pp", "—"],
  ["Pé de cabra", "2 po", "2,5 kg"],
  ["Pedra de amolar", "1 pc", "—"],
  ["Perfume (frasco)", "5 po", "—"],
  ["Pergaminho (uma folha)", "1 pp", "—"],
  ["Picareta de minerador", "2 po", "5 kg"],
  ["Píton", "5 pc", "—"],
  ["Poção de cura", "50 po", "0,25 kg"],
  ["Porta mapas ou pergaminhos", "1 po", "0,5 kg"],
  ["Porta virotes", "1 po", "0,5 kg"],
  ["Pregos de ferro (10)", "1 po", "2,5 kg"],
  ["Rações de viagem (1 dia)", "5 pp", "1 kg"],
  ["Robes", "1 po", "2 kg"],
  ["Roldana e polia", "1 po", "2,5 kg"],
  ["Roupas comuns", "5 pp", "1,5 kg"],
  ["Roupas de viajante", "2 po", "2 kg"],
  ["Roupas de entretenimento", "5 po", "2 kg"],
  ["Roupas finas", "15 po", "3 kg"],
  ["Sabão", "2 pc", "—"],
  ["Saco", "1 pc", "0,25 kg"],
  ["Saco de dormir", "1 po", "3,5 kg"],
  ["Sino", "1 po", "—"],
  ["Tenda para duas pessoas", "2 po", "10 kg"],
  ["Tocha", "1 pc", "0,5 kg"],
  ["Tinta (frasco de 30ml)", "10 po", "—"],
  ["Vara (3 metros)", "5 pc", "3,5 kg"],
  ["Vela", "1 pc", "—"],
  ["Veneno básico (frasco)", "100 po", "—"],
]);

g("Munição", [
  ["Balas de funda (20)", "4 pc", "0,75 kg"],
  ["Flechas (20)", "1 po", "0,5 kg"],
  ["Virotes (20)", "1 po", "0,75 kg"],
  ["Agulhas de zarabatana (50)", "1 po", "0,5 kg"],
]);

g("Foco arcano", [
  ["Bastão", "10 po", "1 kg"],
  ["Cajado", "5 po", "2 kg"],
  ["Cristal", "10 po", "0,5 kg"],
  ["Orbe", "20 po", "1,5 kg"],
  ["Varinha", "10 po", "0,5 kg"],
]);

g("Foco druídico", [
  ["Cajado de madeira", "5 po", "2 kg"],
  ["Ramo de visco", "1 po", "—"],
  ["Totem", "1 po", "—"],
  ["Varinha de teixo", "10 po", "0,5 kg"],
]);

g("Símbolo sagrado", [
  ["Amuleto", "5 po", "0,5 kg"],
  ["Emblema", "5 po", "—"],
  ["Relicário", "5 po", "1 kg"],
  ["Sinete", "5 po", "—"],
]);

g("Pacote de equipamento", [
  ["Pacote de Artista", "40 po", "—"],
  ["Pacote de Assaltante", "16 po", "—"],
  ["Pacote de Aventureiro", "12 po", "—"],
  ["Pacote de Diplomata", "39 po", "—"],
  ["Pacote de Estudioso", "40 po", "—"],
  ["Pacote de Explorador", "10 po", "—"],
  ["Pacote de Sacerdote", "19 po", "—"],
]);

g("Ferramentas de artesão", [
  ["Ferramentas de carpinteiro", "8 po", "3 kg"],
  ["Ferramentas de cartógrafo", "15 po", "3 kg"],
  ["Ferramentas de costureiro", "1 po", "2,5 kg"],
  ["Ferramentas de coureiro", "5 po", "2,5 kg"],
  ["Ferramentas de entalhador", "1 po", "2,5 kg"],
  ["Ferramentas de ferreiro", "20 po", "4 kg"],
  ["Ferramentas de funileiro", "50 po", "5 kg"],
  ["Ferramentas de joalheiro", "25 po", "1 kg"],
  ["Ferramentas de oleiro", "10 po", "1,5 kg"],
  ["Ferramentas de pedreiro", "10 po", "4 kg"],
  ["Ferramentas de pintor", "10 po", "2,5 kg"],
  ["Ferramentas de sapateiro", "5 po", "2,5 kg"],
  ["Ferramentas de vidreiro", "30 po", "2,5 kg"],
  ["Suprimentos de alquimista", "50 po", "4 kg"],
  ["Suprimentos de cervejeiro", "20 po", "4,5 kg"],
  ["Suprimentos de caligrafia", "10 po", "2,5 kg"],
  ["Utensílios de cozinheiro", "1 po", "4 kg"],
]);

g("Ferramentas", [
  ["Ferramentas de navegação", "25 po", "1 kg"],
  ["Ferramentas de ladrão", "25 po", "0,5 kg"],
  ["Kit de disfarce", "25 po", "1,5 kg"],
  ["Kit de falsificação", "15 po", "2,5 kg"],
  ["Kit de herbalismo", "5 po", "1,5 kg"],
  ["Kit de venenos", "50 po", "1 kg"],
]);

g("Instrumento musical", [
  ["Alaúde", "35 po", "1 kg"],
  ["Flauta", "2 po", "0,5 kg"],
  ["Flauta de pã", "12 po", "1 kg"],
  ["Gaita de foles", "30 po", "3 kg"],
  ["Lira", "30 po", "1 kg"],
  ["Oboé", "2 po", "0,5 kg"],
  ["Tambor", "6 po", "1,5 kg"],
  ["Trombeta", "3 po", "1 kg"],
  ["Violino", "30 po", "3 kg"],
  ["Xilofone", "25 po", "5 kg"],
]);

g("Kit de jogo", [
  ["Baralho de cartas", "5 pp", "—"],
  ["Conjunto de dados", "1 pp", "—"],
  ["Jogo dos três dragões", "5 po", "—"],
  ["Xadrez do dragão", "1 po", "0,25 kg"],
]);

// Montarias: o peso informado é a capacidade de carga.
g("Montaria ou animal (capacidade de carga)", [
  ["Burro ou mula (desl. 12 m)", "8 po", "210 kg"],
  ["Camelo (desl. 15 m)", "50 po", "240 kg"],
  ["Cavalo de guerra (desl. 18 m)", "400 po", "270 kg"],
  ["Cavalo de montaria (desl. 18 m)", "75 po", "220 kg"],
  ["Cavalo pesado (desl. 12 m)", "50 po", "270 kg"],
  ["Elefante (desl. 12 m)", "200 po", "660 kg"],
  ["Mastim (desl. 12 m)", "25 po", "100 kg"],
  ["Pônei (desl. 12 m)", "30 po", "115 kg"],
]);

g("Arreios, selas e veículos de tração", [
  ["Alforje", "4 po", "4 kg"],
  ["Armadura de montaria", "x4 do preço", "x2 do peso"],
  ["Biga", "250 po", "50 kg"],
  ["Carroça", "15 po", "100 kg"],
  ["Carruagem", "100 po", "300 kg"],
  ["Estábulo (por dia)", "5 pp", "—"],
  ["Freio e rédea", "2 po", "0,5 kg"],
  ["Ração (1 dia)", "5 pc", "5 kg"],
  ["Sela compacta", "5 po", "7,5 kg"],
  ["Sela exótica", "60 po", "20 kg"],
  ["Sela militar", "20 po", "15 kg"],
  ["Sela de viagem", "10 po", "12,5 kg"],
  ["Trenó", "20 po", "150 kg"],
]);

// Velocidade no lugar do peso.
g("Veículo aquático (velocidade)", [
  ["Barco de quilha", "3.000 po", "1,5 km/h"],
  ["Barco a remo", "50 po", "2 km/h"],
  ["Dracar", "10.000 po", "5 km/h"],
  ["Galera", "30.000 po", "6,5 km/h"],
  ["Navio de guerra", "25.000 po", "4 km/h"],
  ["Veleiro", "10.000 po", "3 km/h"],
]);
