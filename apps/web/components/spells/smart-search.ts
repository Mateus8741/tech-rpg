// Busca "inteligente" de magias e cartas: procura em nome e texto, aceita várias palavras
// em qualquer ordem, entende sinônimos de jogador ("cura", "voar", "controle") e atalhos
// ("truque", "3º", "concentração", "bônus", escola, classe). Puro: sem React.
import { CLASSES, type Spell } from '@repo/rules';
import { normalizeText } from './spell-utils';

/** Palavra digitada -> trechos (já normalizados) que contam como acerto no texto. */
const SYNONYMS: Record<string, string[]> = {};
const syn = (keys: string[], hits: string[]) => { for (const k of keys) SYNONYMS[k] = hits; };

syn(['cura', 'curar', 'cure', 'heal', 'vida'], ['cura', 'curar', 'recupera', 'pontos de vida', 'restaura', 'regenera']);
syn(['fogo', 'chama', 'chamas', 'fire'], ['fogo', 'chamas', 'flamej', 'incendi', 'queimad', 'brasa', 'ardente']);
syn(['gelo', 'frio', 'neve', 'ice'], ['frio', 'gelo', 'congel', 'neve', 'glacial']);
syn(['eletrico', 'eletricidade', 'relampago', 'choque'], ['eletric', 'relampag', 'chocante', 'choque']);
syn(['trovao', 'trovejante', 'som'], ['trovao', 'trovej', 'estrond', 'ensurdecedor']);
syn(['acido'], ['acid']);
syn(['veneno', 'venenoso', 'envenenar'], ['venen', 'veneno']);
syn(['necrotico', 'necromancia'], ['necrot', 'necromancia']);
syn(['radiante', 'sagrado', 'divino'], ['radiante', 'sagrad', 'divin']);
syn(['psiquico', 'mental', 'mente'], ['psiquic', 'mente', 'mental']);
syn(['voar', 'voo', 'voando', 'flutuar', 'levitar'], ['voo', 'voar', 'voando', 'levita', 'flutua']);
syn(['teleporte', 'teletransporte', 'teleportar'], ['teleport', 'teletransport', 'dimensional', 'desaparece', 'portal']);
syn(['invisivel', 'invisibilidade', 'sumir'], ['invisiv']);
syn(['controle', 'controlar', 'cc'], ['paralisad', 'amedrontad', 'enfeiticad', 'impedid', 'atordoad', 'caido', 'agarrad', 'incapacitad', 'imobiliz', 'restringid', 'inconscient', 'cego', 'surdo']);
syn(['medo', 'assustar', 'amedrontar'], ['amedront', 'medo', 'pavor', 'terror']);
syn(['dormir', 'sono'], ['sono', 'dorm', 'inconscient']);
syn(['protecao', 'proteger', 'defesa', 'defender'], ['classe de armadura', 'resistencia a', 'protec', 'escudo', 'barreira']);
syn(['invocar', 'convocar', 'summon'], ['invoca', 'convoca', 'conjura', 'surge', 'criatura aparece']);
syn(['area', 'aoe'], ['de raio', 'em um raio', 'cone', 'cubo', 'linha de', 'esfera de', 'cilindro', 'emanacao', 'cada criatura']);
syn(['buff', 'bonus'], ['vantagem', 'bonus', 'adiciona']);
syn(['debuff', 'maldicao', 'amaldicoar'], ['desvantagem', 'maldic', 'subtrai', 'penalidade']);
syn(['luz', 'iluminar'], ['luz', 'ilumina', 'brilh']);
syn(['escuridao', 'sombra'], ['escurid', 'sombra']);
syn(['agua', 'mar'], ['agua', 'mar', 'onda', 'respirar']);
syn(['terra', 'pedra', 'rocha'], ['terra', 'pedra', 'rocha', 'solo']);
syn(['vento', 'ar'], ['vento', 'rajada', 'tornado', 'redemoinho']);
syn(['planta', 'plantas', 'natureza'], ['planta', 'vinha', 'arvore', 'espinho', 'vegeta']);
syn(['animal', 'animais', 'besta'], ['animal', 'animais', 'besta', 'fera']);
syn(['mortos', 'morto', 'zumbi', 'esqueleto', 'morte'], ['morto', 'cadaver', 'zumbi', 'esquelet', 'morte']);
syn(['reviver', 'ressuscitar', 'ressurreicao'], ['reviv', 'ressusc', 'ressurrei', 'de volta a vida']);
syn(['detectar', 'descobrir', 'revelar', 'achar'], ['detect', 'sentir', 'percebe', 'localiz', 'revela', 'encontr']);
syn(['comunicar', 'conversar', 'falar', 'idioma'], ['telepat', 'mensag', 'idioma', 'falar com', 'comunica']);
syn(['velocidade', 'rapido', 'correr'], ['velocid', 'deslocamento', 'rapid', 'disparada']);
syn(['cegar', 'cego', 'cegueira'], ['cego', 'cegueira', 'cegad']);
syn(['empurrar', 'afastar', 'derrubar'], ['empurr', 'afast', 'arremess', 'caido']);
syn(['furtivo', 'furtividade', 'esconder', 'disfarce'], ['furtiv', 'escond', 'disfarc', 'oculta']);
syn(['dano'], ['dano']);

const STOPWORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'que', 'com', 'em', 'a', 'o', 'e', 'as', 'os', 'para', 'um', 'uma', 'no', 'na']);

const SCHOOLS: Record<string, string> = {
  abjuracao: 'Abjuração', conjuracao: 'Conjuração', adivinhacao: 'Adivinhação', encantamento: 'Encantamento',
  evocacao: 'Evocação', ilusao: 'Ilusão', necromancia: 'Necromancia', transmutacao: 'Transmutação',
};
const CLASS_BY_WORD: Record<string, string> = Object.fromEntries(CLASSES.map((c) => [normalizeText(c.name), c.id]));

export type CostFacet = 'acao' | 'bonus' | 'reacao';

export interface ParsedQuery {
  /** Palavras que precisam aparecer (cada uma pode casar por sinônimo). */
  terms: string[];
  /** A busca inteira, para o bônus de frase exata no nome. */
  phrase: string;
  level?: number;
  concentration?: boolean;
  ritual?: boolean;
  cost?: CostFacet;
  school?: string;
  classId?: string;
}

export function parseQuery(raw: string): ParsedQuery {
  const phrase = normalizeText(raw.trim());
  const words = phrase.split(/[\s,;]+/).filter(Boolean);
  const pq: ParsedQuery = { terms: [], phrase };
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const lvl = w.match(/^(?:nivel|circulo|nv)?([0-9])(?:o|º|°)?$/);
    if (w === 'truque' || w === 'truques') pq.level = 0;
    else if (lvl) pq.level = Number(lvl[1]);
    else if (w === 'concentracao' || w === 'conc') pq.concentration = true;
    else if (w === 'ritual') pq.ritual = true;
    else if (w === 'reacao') pq.cost = 'reacao';
    else if (w === 'bonus' && (words[i - 1] === 'acao' || pq.cost === 'acao')) pq.cost = 'bonus';
    else if (w === 'acao') pq.cost = words[i + 1] === 'bonus' ? 'bonus' : 'acao';
    else if (SCHOOLS[w]) pq.school = SCHOOLS[w];
    else if (CLASS_BY_WORD[w]) pq.classId = CLASS_BY_WORD[w];
    else if (!STOPWORDS.has(w)) pq.terms.push(w);
  }
  if (pq.cost === 'bonus') pq.terms = pq.terms.filter((t) => t !== 'bonus');
  return pq;
}

/** Nenhuma palavra nem atalho: tudo casa. */
export const queryEmpty = (pq: ParsedQuery) =>
  !pq.terms.length && pq.level === undefined && !pq.concentration && !pq.ritual && !pq.cost && !pq.school && !pq.classId;

/**
 * Pontua um texto contra as palavras da busca. -1 = alguma palavra não aparece.
 * Nome vale mais que descrição; palavra exata vale mais que sinônimo.
 */
/** `needle` aparece no começo de alguma palavra de `hay` ("cura" não casa com "loucura"). */
function hasWord(hay: string, needle: string): boolean {
  for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + 1)) {
    if (i === 0 || !/[a-z0-9]/.test(hay[i - 1]!)) return true;
  }
  return false;
}

export function scoreText(name: string, text: string, pq: ParsedQuery): number {
  let score = 0;
  for (const t of pq.terms) {
    const hits = SYNONYMS[t] ?? [];
    if (hasWord(name, t)) score += name.startsWith(t) ? 15 : 10;
    else if (hits.some((h) => name.startsWith(h))) score += 12;
    else if (hits.some((h) => hasWord(name, h))) score += 8;
    else if (hasWord(text, t)) score += 3;
    else if (hits.some((h) => hasWord(text, h))) score += 2;
    else return -1;
  }
  if (pq.phrase && pq.terms.length > 1 && name.includes(pq.phrase)) score += 20;
  return score;
}

export const spellCost = (s: Pick<Spell, 'castingTime'>): CostFacet | undefined => {
  const t = normalizeText(s.castingTime);
  if (t.includes('bonus')) return 'bonus';
  if (t.includes('reacao')) return 'reacao';
  if (/\b1 acao\b/.test(t) || t === 'acao') return 'acao';
  return undefined;
};

const spellIndex = new WeakMap<Spell, { name: string; text: string }>();
function indexOf(s: Spell) {
  let ix = spellIndex.get(s);
  if (!ix) {
    const classes = s.classes.map((id) => CLASSES.find((c) => c.id === id)?.name ?? id).join(' ');
    ix = {
      name: normalizeText(s.name),
      text: normalizeText([s.description, s.atHigherLevels ?? '', s.school, classes, s.range, s.duration, s.castingTime, s.components.m ?? ''].join(' ')),
    };
    spellIndex.set(s, ix);
  }
  return ix;
}

/** Pontuação da magia para a busca; -1 = fora. Com busca vazia, 0. */
export function scoreSpell(s: Spell, pq: ParsedQuery): number {
  if (pq.level !== undefined && s.level !== pq.level) return -1;
  if (pq.concentration && !s.concentration) return -1;
  if (pq.ritual && !s.ritual) return -1;
  if (pq.cost && spellCost(s) !== pq.cost) return -1;
  if (pq.school && s.school !== pq.school) return -1;
  if (pq.classId && !s.classes.includes(pq.classId)) return -1;
  const ix = indexOf(s);
  return scoreText(ix.name, ix.text, pq);
}
