// Motor de busca: puro, sem React e sem depender de @repo/rules em tempo de execução.
// Entende filtros em português ("truque fogo mago"), tolera erros de digitação e pesa os campos
// na ordem título > apelidos > tags > corpo.
import type { ActionCost } from '@repo/rules';
import type { EntryRef } from '@/components/entries/types';

export type SearchGroup =
  | 'Páginas' | 'Fichas' | 'Magias' | 'Características' | 'Classes' | 'Raças' | 'Antecedentes' | 'Equipamento' | 'Regras';

/** Atributos usados pelos filtros. Ausente = o filtro correspondente reprova o documento. */
export interface DocFacets {
  spellLevel?: number;
  featureLevel?: number;
  classes?: string[];
  school?: string;
  cost?: ActionCost;
  concentration?: boolean;
  ritual?: boolean;
  damage?: string[];
  heals?: boolean;
  dealsDamage?: boolean;
}

export type DocTarget = { entry: EntryRef } | { href: string };

export interface DocInput {
  key: string;
  group: SearchGroup;
  title: string;
  sub?: string;
  aliases?: string[];
  tags?: string[];
  body?: string;
  facets?: DocFacets;
  target: DocTarget;
}

export interface SearchDoc extends DocInput {
  titleNorm: string;
  titleTokens: string[];
  titleStems: Set<string>;
  aliasNorms: string[];
  aliasTokens: string[];
  aliasStems: Set<string>;
  tagTokens: string[];
  tagStems: Set<string>;
  bodyNorm: string;
  bodyStems: Set<string>;
}

export interface SearchVocab {
  /** Nome normalizado da classe -> id. */
  classes: Map<string, { id: string; label: string }>;
}

export interface SearchIndex {
  docs: SearchDoc[];
  vocab: SearchVocab;
  /** Tokens de título e apelido, sem repetição (base da busca aproximada). */
  fuzzyVocab: string[];
}

export type QueryFilter =
  | { type: 'level'; value: number; spellOnly: boolean }
  | { type: 'class'; value: string }
  | { type: 'school'; value: string }
  | { type: 'cost'; value: ActionCost }
  | { type: 'concentration' }
  | { type: 'ritual' }
  | { type: 'damage'; value: string }
  | { type: 'heal' }
  | { type: 'deals' }
  | { type: 'spell' };

export interface ActiveFilter {
  key: string;
  label: string;
  filter: QueryFilter;
  /** Posições das palavras da busca que geraram o filtro (para removê-las do campo). */
  tokenIdx: number[];
}

export interface ParsedQuery {
  rawTokens: string[];
  filters: ActiveFilter[];
  /** Palavras livres, sem as que viraram filtro. */
  terms: string[];
  /** Todas as palavras úteis, inclusive as que viraram filtro. */
  literalTerms: string[];
  /** Busca normalizada sem palavras vazias no início. */
  phrase: string;
}

export interface SearchResult {
  doc: SearchDoc;
  score: number;
  /** A correspondência veio só do corpo do texto. */
  inBody: boolean;
}

export interface SearchOutcome {
  results: SearchResult[];
  filters: ActiveFilter[];
  /** Termos usados, para destacar o texto. */
  highlight: string[];
  /** Nenhum documento tinha todas as palavras: mostra os que têm a maioria. */
  relaxed: boolean;
}

/* ---------- Normalização ---------- */

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const tokenize = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

/** Stemming leve: o suficiente para singular e plural em português. */
export function stem(t: string): string {
  if (t.length <= 3) return t;
  if (t.endsWith('coes')) return `${t.slice(0, -4)}cao`;
  if (t.endsWith('oes') || t.endsWith('aes')) return `${t.slice(0, -3)}ao`;
  if (t.length > 4 && t.endsWith('ais')) return `${t.slice(0, -3)}al`;
  if (t.length > 4 && t.endsWith('eis')) return `${t.slice(0, -3)}el`;
  if (t.endsWith('ns')) return `${t.slice(0, -2)}m`;
  if (t.length > 4 && (t.endsWith('res') || t.endsWith('zes'))) return t.slice(0, -2);
  if (t.endsWith('s') && !t.endsWith('ss')) return t.slice(0, -1);
  return t;
}

/** Distância Damerau-Levenshtein com limite: devolve max + 1 ao passar do limite. */
export function boundedDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2: number[] = [];
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2]! + 1);
      cur[j] = v;
      if (v < best) best = v;
    }
    if (best > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length]!;
}

/* ---------- Vocabulário de filtros ---------- */

export const DAMAGE_TYPES: { id: string; label: string; words: string[]; re: RegExp }[] = [
  { id: 'flamejante', label: 'Fogo', words: ['fogo', 'flamejante', 'flamejantes', 'chamas'], re: /dano (de )?(flamejante|fogo)/ },
  { id: 'congelante', label: 'Frio', words: ['gelo', 'frio', 'congelante', 'congelantes'], re: /dano (de )?(congelante|frio|gelo)/ },
  { id: 'venenoso', label: 'Veneno', words: ['veneno', 'venenoso', 'venenosa'], re: /dano (de )?(venenoso|veneno)/ },
  { id: 'acido', label: 'Ácido', words: ['acido', 'acida'], re: /dano (de )?acido/ },
  { id: 'eletrico', label: 'Elétrico', words: ['raio', 'raios', 'eletrico', 'eletrica', 'eletricidade', 'relampago'], re: /dano (de )?(eletrico|eletricidade|relampago)/ },
  { id: 'trovejante', label: 'Trovão', words: ['trovao', 'trovejante'], re: /dano (de )?(trovejante|trovao)/ },
  { id: 'necrotico', label: 'Necrótico', words: ['necrotico', 'necrotica'], re: /dano (de )?necrotico/ },
  { id: 'radiante', label: 'Radiante', words: ['radiante'], re: /dano (de )?radiante/ },
  { id: 'psiquico', label: 'Psíquico', words: ['psiquico', 'psiquica'], re: /dano (de )?psiquico/ },
  { id: 'forca', label: 'Força', words: ['forca', 'energia'], re: /dano (de )?(forca|energia)/ },
  { id: 'cortante', label: 'Cortante', words: ['cortante'], re: /dano (de )?cortante|\bcortante\b/ },
  { id: 'perfurante', label: 'Perfurante', words: ['perfurante'], re: /dano (de )?perfurante|\bperfurante\b/ },
  { id: 'concussao', label: 'Concussão', words: ['concussao', 'contundente'], re: /dano (de )?(concussao|contundente)|\bconcussao\b/ },
];
const DAMAGE_BY_WORD = new Map(DAMAGE_TYPES.flatMap((d) => d.words.map((w) => [w, d] as const)));

const HEAL_RE = /recuper\w*[^.]{0,80}pontos de vida|\bcura(r|m)?\b/;

/** Tipos de dano e cura citados em um texto já normalizado. */
export const damageIn = (bodyNorm: string) => DAMAGE_TYPES.filter((d) => d.re.test(bodyNorm)).map((d) => d.id);
export const healsIn = (bodyNorm: string) => HEAL_RE.test(bodyNorm);

const SCHOOLS = new Map(
  ['Abjuração', 'Conjuração', 'Adivinhação', 'Encantamento', 'Evocação', 'Ilusão', 'Necromancia', 'Transmutação']
    .map((s) => [norm(s), s] as const),
);

const COST_LABEL: Record<string, string> = { acao: 'Ação', bonus: 'Ação bônus', reacao: 'Reação' };

const STOP_WORDS = new Set([
  'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das', 'e', 'em', 'no', 'na', 'nos', 'nas', 'ao', 'aos',
  'que', 'faz', 'fazem', 'como', 'qual', 'quais', 'funciona', 'para', 'pra', 'com', 'por', 'se', 'sobre', 'meu', 'minha', 'tem',
]);

const numberOf = (t: string) => {
  const m = t.match(/^(\d)[oa]?$/);
  return m ? Number(m[1]) : null;
};
const isLevelWord = (t: string) => t === 'circulo' || t === 'circulos' || t === 'nivel' || t === 'niveis';
const isSpellLevelWord = (t: string) => t === 'circulo' || t === 'circulos';

export function parseQuery(raw: string, vocab: SearchVocab): ParsedQuery {
  const rawTokens = raw.trim().split(/\s+/).filter(Boolean);
  const toks = rawTokens.map((t) => tokenize(t).join(''));
  const filters: ActiveFilter[] = [];
  const terms: string[] = [];
  const used = new Set<number>();
  const add = (key: string, label: string, filter: QueryFilter, ...tokenIdx: number[]) => {
    tokenIdx.forEach((i) => used.add(i));
    if (!filters.some((f) => f.key === key)) filters.push({ key, label, filter, tokenIdx });
  };
  const levelLabel = (n: number, spellOnly: boolean) => (spellOnly || n > 0 ? (spellOnly ? `${n}º círculo` : `Nível ${n}`) : 'Truque');

  for (let i = 0; i < toks.length; i++) {
    if (used.has(i)) continue;
    const t = toks[i]!;
    const next = toks[i + 1] ?? '';
    const n = numberOf(t);
    if (n !== null && isLevelWord(next)) {
      const spellOnly = isSpellLevelWord(next);
      add(`level:${n}`, levelLabel(n, spellOnly), { type: 'level', value: n, spellOnly }, i, i + 1);
    } else if (isLevelWord(t) && numberOf(next) !== null) {
      const v = numberOf(next)!;
      const spellOnly = isSpellLevelWord(t);
      add(`level:${v}`, levelLabel(v, spellOnly), { type: 'level', value: v, spellOnly }, i, i + 1);
    } else if ((t === 'acao' || t === 'acoes') && (next === 'bonus' || next === 'bônus')) {
      add('cost:bonus', COST_LABEL.bonus!, { type: 'cost', value: 'bonus' }, i, i + 1);
    } else if (t === 'bonus') {
      add('cost:bonus', COST_LABEL.bonus!, { type: 'cost', value: 'bonus' }, i);
    } else if (t === 'acao' || t === 'acoes') {
      add('cost:acao', COST_LABEL.acao!, { type: 'cost', value: 'acao' }, i);
    } else if (t === 'reacao' || t === 'reacoes') {
      add('cost:reacao', COST_LABEL.reacao!, { type: 'cost', value: 'reacao' }, i);
    } else if (t === 'truque' || t === 'truques' || t === 'cantrip' || t === 'cantrips') {
      add('level:0', 'Truque', { type: 'level', value: 0, spellOnly: true }, i);
    } else if (t === 'magia' || t === 'magias' || t === 'feitico' || t === 'feiticos') {
      add('spell', 'Magias', { type: 'spell' }, i);
    } else if (t === 'concentracao' || t === 'concentrar') {
      add('concentration', 'Concentração', { type: 'concentration' }, i);
    } else if (t === 'ritual' || t === 'rituais') {
      add('ritual', 'Ritual', { type: 'ritual' }, i);
    } else if (t === 'cura' || t === 'curas' || t === 'curar' || t === 'curativa' || t === 'curativo') {
      add('heal', 'Cura', { type: 'heal' }, i);
    } else if (t === 'dano' || t === 'danos') {
      add('deals', 'Causa dano', { type: 'deals' }, i);
    } else if (SCHOOLS.has(t) || SCHOOLS.has(stem(t))) {
      const school = SCHOOLS.get(t) ?? SCHOOLS.get(stem(t))!;
      add(`school:${school}`, school, { type: 'school', value: school }, i);
    } else if (vocab.classes.has(t) || vocab.classes.has(stem(t))) {
      const c = vocab.classes.get(t) ?? vocab.classes.get(stem(t))!;
      add(`class:${c.id}`, c.label, { type: 'class', value: c.id }, i);
    } else if (DAMAGE_BY_WORD.has(t)) {
      const d = DAMAGE_BY_WORD.get(t)!;
      add(`damage:${d.id}`, `Dano: ${d.label}`, { type: 'damage', value: d.id }, i);
    } else if (t && !STOP_WORDS.has(t)) {
      terms.push(t);
    }
  }

  const literalTerms = toks.flatMap((t) => (t && !STOP_WORDS.has(t) ? [t] : []));
  let first = 0;
  while (first < toks.length && STOP_WORDS.has(toks[first]!)) first++;
  return { rawTokens, filters, terms, literalTerms, phrase: toks.slice(first).filter(Boolean).join(' ') };
}

/** Busca sem as palavras de um filtro: é o que remover o chip faz com o campo. */
export function removeFilterTokens(rawTokens: string[], f: Pick<ActiveFilter, 'tokenIdx'>): string {
  return rawTokens.filter((_, i) => !f.tokenIdx.includes(i)).join(' ');
}

function passes(doc: SearchDoc, { filter: f }: ActiveFilter): boolean {
  const x = doc.facets;
  if (!x) return false;
  switch (f.type) {
    case 'level': return x.spellLevel === f.value || (!f.spellOnly && x.featureLevel === f.value);
    case 'class': return !!x.classes?.includes(f.value);
    case 'school': return x.school === f.value;
    case 'cost': return x.cost === f.value;
    case 'concentration': return !!x.concentration;
    case 'ritual': return !!x.ritual;
    case 'damage': return !!x.damage?.includes(f.value);
    case 'heal': return !!x.heals;
    case 'deals': return !!x.dealsDamage;
    case 'spell': return x.spellLevel !== undefined;
  }
}

/* ---------- Índice ---------- */

export function prepareDoc(d: DocInput): SearchDoc {
  const titleTokens = tokenize(d.title);
  const aliases = d.aliases ?? [];
  const aliasTokens = aliases.flatMap(tokenize);
  const tagTokens = (d.tags ?? []).flatMap(tokenize);
  const bodyNorm = ` ${norm(d.body ?? '')} `;
  return {
    ...d,
    titleNorm: titleTokens.join(' '),
    titleTokens,
    titleStems: new Set(titleTokens.map(stem)),
    aliasNorms: aliases.map((a) => tokenize(a).join(' ')),
    aliasTokens,
    aliasStems: new Set(aliasTokens.map(stem)),
    tagTokens,
    tagStems: new Set(tagTokens.map(stem)),
    bodyNorm,
    bodyStems: new Set(bodyNorm.split(/[^a-z0-9]+/).filter((t) => t.length > 1).map(stem)),
  };
}

export function createIndex(docs: SearchDoc[], vocab: SearchVocab): SearchIndex {
  const set = new Set<string>();
  for (const d of docs) {
    for (const t of d.titleTokens) set.add(t);
    for (const t of d.aliasTokens) set.add(t);
  }
  return { docs, vocab, fuzzyVocab: [...set] };
}

/* ---------- Pontuação ---------- */

const Field = { Title: 0, Alias: 1, Tag: 2, Body: 3 } as const;
type Field = (typeof Field)[keyof typeof Field];

interface Term {
  raw: string;
  stem: string;
  /** Token do vocabulário -> distância. */
  fuzzy: Map<string, number>;
}

interface TermHit { score: number; field: Field; fuzzy: boolean }

function fuzzyBudget(len: number, multiTerm: boolean): number {
  if (len >= 8) return 2;
  if (len >= 4) return 1;
  // Três letras só com contexto: "bola de fgo" sim; "fgo" sozinho traria ruído demais.
  return len === 3 && multiTerm ? 1 : 0;
}

function makeTerm(raw: string, vocab: string[], multiTerm: boolean): Term {
  const budget = fuzzyBudget(raw.length, multiTerm);
  const fuzzy = new Map<string, number>();
  if (budget > 0) {
    for (const v of vocab) {
      if (v === raw || Math.abs(v.length - raw.length) > budget) continue;
      // O primeiro caractere raramente erra; só palavras longas relaxam essa regra.
      if (v[0] !== raw[0] && raw.length < 5) continue;
      if (v.length < 3) continue;
      const dist = boundedDistance(raw, v, budget);
      if (dist <= budget) fuzzy.set(v, dist);
    }
  }
  return { raw, stem: stem(raw), fuzzy };
}

function matchIn(tokens: string[], stems: Set<string>, t: Term, exact: number, prefix: number, minPrefix: number): number {
  if (tokens.includes(t.raw) || stems.has(t.stem)) return exact;
  if (t.raw.length >= minPrefix && tokens.some((x) => x.startsWith(t.raw))) return prefix;
  return 0;
}

function bestFuzzy(tokens: string[], t: Term): number | undefined {
  let best: number | undefined;
  for (const x of tokens) {
    const d = t.fuzzy.get(x);
    if (d !== undefined && (best === undefined || d < best)) best = d;
  }
  return best;
}

function matchTerm(doc: SearchDoc, t: Term): TermHit | null {
  let s = matchIn(doc.titleTokens, doc.titleStems, t, 100, 70, 1);
  if (s) return { score: s, field: Field.Title, fuzzy: false };
  s = matchIn(doc.aliasTokens, doc.aliasStems, t, 60, 45, 2);
  if (s) return { score: s, field: Field.Alias, fuzzy: false };
  s = matchIn(doc.tagTokens, doc.tagStems, t, 35, 25, 3);
  if (s) return { score: s, field: Field.Tag, fuzzy: false };
  if (t.fuzzy.size) {
    const dt = bestFuzzy(doc.titleTokens, t);
    if (dt !== undefined) return { score: 32 - dt * 4, field: Field.Title, fuzzy: true };
    const da = bestFuzzy(doc.aliasTokens, t);
    if (da !== undefined) return { score: 20 - da * 3, field: Field.Alias, fuzzy: true };
  }
  if (doc.bodyStems.has(t.stem)) return { score: 12, field: Field.Body, fuzzy: false };
  if (t.raw.length >= 4 && doc.bodyNorm.includes(` ${t.raw}`)) return { score: 8, field: Field.Body, fuzzy: false };
  return null;
}

const collator = new Intl.Collator('pt-BR');
const byRank = (a: SearchResult, b: SearchResult) =>
  b.score - a.score || collator.compare(a.doc.title, b.doc.title) || a.doc.key.localeCompare(b.doc.key);

const hasPhrase = (hay: string, phrase: string) => ` ${hay} `.includes(` ${phrase} `);

function phraseBonus(doc: SearchDoc, phrase: string): number {
  if (!phrase) return 0;
  if (doc.titleNorm === phrase) return 1000;
  if (doc.aliasNorms.includes(phrase)) return 600;
  if (doc.titleNorm.startsWith(`${phrase} `)) return 400;
  if (hasPhrase(doc.titleNorm, phrase)) return 200;
  if (phrase.length >= 2 && doc.titleNorm.startsWith(phrase)) return 120;
  if (doc.aliasNorms.some((a) => hasPhrase(a, phrase))) return 100;
  return 0;
}

/** Documento cujo título ou apelido contém todas as palavras digitadas. */
function isLiteralTitle(doc: SearchDoc, terms: Term[]): boolean {
  return terms.length > 0 && terms.every((t) => {
    const hit = matchTerm(doc, t);
    return !!hit && (hit.field === Field.Title || hit.field === Field.Alias);
  });
}

interface RunOptions { filters: ActiveFilter[]; terms: Term[]; literal: Term[]; phrase: string; minMatches?: number }

function run(index: SearchIndex, o: RunOptions): { results: SearchResult[]; passed: number } {
  const out: { r: SearchResult; fuzzy: boolean; strong: boolean }[] = [];
  let passed = 0;
  for (const doc of index.docs) {
    const passFilters = o.filters.every((f) => passes(doc, f));
    let score = 0;
    let matched = 0;
    let usedFuzzy = false;
    let shortFuzzy = false;
    let exactTitle = false;
    let inBody = false;
    if (passFilters) {
      for (const t of o.terms) {
        const hit = matchTerm(doc, t);
        if (!hit) continue;
        matched++;
        score += hit.score;
        if (hit.fuzzy) { usedFuzzy = true; if (t.raw.length === 3) shortFuzzy = true; }
        else if (hit.field === Field.Title) exactTitle = true;
        if (hit.field === Field.Body) inBody = true;
      }
    }
    const need = o.minMatches ?? o.terms.length;
    let ok = passFilters && matched >= need && !(shortFuzzy && !exactTitle);
    if (ok && o.filters.length) passed++;
    const literal = o.filters.length > 0 && isLiteralTitle(doc, o.literal);
    if (literal) { score += 300; ok = true; inBody = false; }
    if (!ok) continue;
    score += phraseBonus(doc, o.phrase);
    out.push({ r: { doc, score, inBody }, fuzzy: usedFuzzy, strong: !usedFuzzy && (exactTitle || literal) });
  }
  // Com acerto real no título, os aproximados só atrapalham.
  const anyStrong = out.some((x) => x.strong);
  const kept = anyStrong ? out.filter((x) => !x.fuzzy) : out;
  return { results: kept.map((x) => x.r).sort(byRank), passed };
}

export function search(index: SearchIndex, raw: string): SearchOutcome {
  const p = parseQuery(raw, index.vocab);
  if (!p.literalTerms.length) return { results: [], filters: [], highlight: [], relaxed: false };

  const multi = p.literalTerms.length > 1;
  const literal = p.literalTerms.map((t) => makeTerm(t, index.fuzzyVocab, multi));
  const highlightOf = (terms: string[]) => [...new Set(terms.flatMap((t) => [t, stem(t)]))];
  const free = () => run(index, { filters: [], terms: literal, literal, phrase: p.phrase });

  let filters = p.filters;
  // "Bola de Fogo" é o nome de uma magia, mesmo com "fogo" sendo também um filtro.
  if (filters.length && p.terms.length && index.docs.some((d) => hasPhrase(d.titleNorm, p.phrase) || d.aliasNorms.some((a) => hasPhrase(a, p.phrase)))) {
    filters = [];
  }

  let results: SearchResult[];
  if (filters.length) {
    const terms = p.terms.map((t) => makeTerm(t, index.fuzzyVocab, multi));
    const r = run(index, { filters, terms, literal, phrase: p.phrase });
    if (r.passed > 0) return { results: r.results, filters, highlight: highlightOf(p.literalTerms), relaxed: false };
    // Filtro não fez sentido: as palavras voltam a ser texto livre.
    filters = [];
    results = free().results;
  } else {
    results = free().results;
  }

  if (results.length || literal.length < 2) return { results, filters: [], highlight: highlightOf(p.literalTerms), relaxed: false };
  const relaxed = run(index, { filters: [], terms: literal, literal, phrase: p.phrase, minMatches: Math.ceil(literal.length / 2) });
  return { results: relaxed.results, filters: [], highlight: highlightOf(p.literalTerms), relaxed: true };
}

/** Trecho do corpo em volta da primeira palavra encontrada. */
export function snippetFor(doc: Pick<SearchDoc, 'body' | 'bodyNorm'>, terms: string[], width = 110): string | undefined {
  if (!doc.body) return undefined;
  let at = -1;
  for (const t of terms) {
    if (t.length < 2) continue;
    const i = doc.bodyNorm.indexOf(` ${t}`);
    if (i >= 0 && (at < 0 || i < at)) at = i;
  }
  if (at < 0) return undefined;
  // bodyNorm tem um espaço a mais no início, e o índice aponta para o espaço antes da palavra.
  const source = doc.body.length === doc.bodyNorm.length - 2 ? doc.body : doc.bodyNorm.trim();
  const start = Math.max(0, at - 30);
  const end = Math.min(source.length, start + width);
  return `${start > 0 ? '…' : ''}${source.slice(start, end).replace(/\s+/g, ' ').trim()}${end < source.length ? '…' : ''}`;
}
