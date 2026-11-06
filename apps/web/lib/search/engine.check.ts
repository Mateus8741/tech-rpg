// Autoverificação da busca. Rodar a partir de apps/web: npx tsx lib/search/engine.check.ts
import assert from 'node:assert/strict';
import * as rules from '@repo/rules';
import { boundedDistance, buildRulesCorpus, composeIndex, parseQuery, removeFilterTokens, search, snippetFor, stem } from './index';

const built = performance.now();
const corpus = buildRulesCorpus(rules);
const index = composeIndex(corpus, []);
console.log(`índice: ${index.docs.length} documentos em ${Math.round(performance.now() - built)}ms`);

const titles = (q: string) => search(index, q).results.map((r) => r.doc.title);
const top = (q: string) => titles(q)[0];
const has = (q: string, title: string) => assert.ok(titles(q).includes(title), `"${q}" deveria trazer ${title}; veio: ${titles(q).slice(0, 8).join(', ')}`);
const keysOf = (q: string) => search(index, q).filters.map((f) => f.key).sort();

// Normalização e distância
assert.equal(stem('magias'), stem('magia'));
assert.equal(stem('acoes'), stem('acao'));
assert.equal(stem('maos'), stem('mao'));
assert.equal(boundedDistance('fgo', 'fogo', 1), 1);
assert.equal(boundedDistance('bolo', 'bloo', 1), 1); // transposição
assert.ok(boundedDistance('mago', 'bruxo', 2) > 2);

// Filtros
assert.deepEqual(keysOf('truque fogo mago'), ['class:mago', 'damage:flamejante', 'level:0']);
has('truque fogo mago', 'Raio de Fogo');
for (const r of search(index, 'truque fogo mago').results) {
  assert.equal(r.doc.facets?.spellLevel, 0, r.doc.title);
  assert.ok(r.doc.facets?.classes?.includes('mago'), r.doc.title);
}
assert.deepEqual(keysOf('reação ladino'), ['class:ladino', 'cost:reacao']);
has('reação ladino', 'Esquiva Sobrenatural');
assert.deepEqual(keysOf('magia de cura 1 círculo'), ['heal', 'level:1', 'spell']);
has('magia de cura 1 círculo', 'Curar Ferimentos');
assert.ok(search(index, 'magia de cura 1 círculo').results.every((r) => r.doc.facets?.spellLevel === 1));
assert.deepEqual(keysOf('acao bonus'), ['cost:bonus']);
has('acao bonus', 'Ação Ardilosa');
assert.deepEqual(keysOf('concentracao ilusao'), ['concentration', 'school:Ilusão']);
assert.ok(search(index, 'concentracao ilusao').results.every((r) => r.doc.facets?.school === 'Ilusão' && r.doc.facets?.concentration));
assert.deepEqual(keysOf('3º círculo'), ['level:3']);
assert.deepEqual(keysOf('círculo 2 ritual'), ['level:2', 'ritual']);

// Nomes têm prioridade sobre filtros
assert.equal(top('bola de fogo'), 'Bola de Fogo');
assert.deepEqual(keysOf('bola de fogo'), []);
assert.equal(top('raio de gelo'), 'Raio de Gelo');
assert.equal(top('raio de fogo'), 'Raio de Fogo');

// Erros de digitação, apelidos e prefixos
assert.equal(top('bola de fgo'), 'Bola de Fogo');
assert.equal(top('desengajr'), 'Desengajar');
assert.equal(top('fireball'), 'Bola de Fogo');
assert.equal(top('borrifo venenoso'), 'Rajada de Veneno');
assert.equal(top('bola de f'), 'Bola de Fogo');

// Tudo mais
assert.equal(top('ataque furtivo'), 'Ataque Furtivo');
assert.equal(top('besta de mao'), 'Besta de Mão');
assert.equal(top('envenenado'), 'Envenenado');
assert.equal(top('o que faz desengajar'), 'Desengajar');
assert.equal(top('MÃOS MÁGICAS'), 'Mãos Mágicas');
assert.equal(top('trapaceiro arcano'), 'Trapaceiro Arcano');

// Filtro sem resultado volta a ser texto livre
assert.deepEqual(search(index, 'ladino paladino').filters, []);

// Remover chip tira as palavras do campo
const parsed = parseQuery('truque de fogo mago', index.vocab);
const fire = parsed.filters.find((f) => f.key === 'damage:flamejante')!;
assert.equal(removeFilterTokens(parsed.rawTokens, fire), 'truque de mago');

// Trecho
const body = search(index, 'flamejante').results.find((r) => r.inBody);
if (body) assert.ok(snippetFor(body.doc, ['flamejante'])?.toLowerCase().includes('flamejante'));

// Ordem determinística
assert.deepEqual(titles('truque'), titles('truque'));

// Desempenho
const queries = ['truque fogo mago', 'reação ladino', 'bola de fgo', 'concentracao ilusao', 'o que faz desengajar', 'teleportacao', 'magia de cura 1 círculo'];
for (const q of queries) {
  const t0 = performance.now();
  for (let i = 0; i < 5; i++) search(index, q);
  const ms = (performance.now() - t0) / 5;
  console.log(`  ${q}: ${ms.toFixed(1)}ms, ${search(index, q).results.length} resultados`);
  assert.ok(ms < 30, `${q} levou ${ms.toFixed(1)}ms`);
}
console.log('ok');
