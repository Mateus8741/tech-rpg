// Gera docs/card-art/PROMPTS.md e prompts.csv: um prompt de imagem por carta.
// Uso: node docs/card-art/build-prompts.mjs
// Edite STYLE / SCHOOL_MOOD aqui e os temas em subjects.txt.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const data = join(here, '../../packages/rules/src/data');

const STYLE =
  'dark fantasy trading card illustration, painterly digital painting, dramatic rim lighting, ' +
  'deep shadows, single centered subject, moody dark background, highly detailed, ' +
  'no text, no letters, no border, no frame, 4:3 aspect ratio';

const SCHOOL_MOOD = {
  Abjuração: 'protective blue light, shimmering wards',
  Conjuração: 'golden summoning light, swirling portals',
  Adivinhação: 'silver moonlit glow, mystical eyes and stars',
  Encantamento: 'teal and pink hypnotic glow',
  Evocação: 'blazing orange and crackling energy',
  Ilusão: 'violet and magenta dreamlike shimmer',
  Necromancia: 'sickly green and bone-gray necrotic mist',
  Transmutação: 'emerald green transforming energy',
};
const ACTION_MOOD = 'gritty medieval battlefield, warm torchlight, steel and leather';

// Temas: "<arquivo>: <tema>"
const subjects = new Map();
for (const line of readFileSync(join(here, 'subjects.txt'), 'utf8').split('\n')) {
  const m = line.match(/^([a-z0-9-]+):\s*(.+)$/);
  if (m) subjects.set(m[1], m[2].trim());
}

// Magias direto da fonte (sem executar TS).
const spells = [];
for (const f of ['spells-a.ts', 'spells-b.ts']) {
  const src = readFileSync(join(data, f), 'utf8');
  for (const m of src.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*level:\s*(\d+),\s*school:\s*"([^"]+)"/g)) {
    spells.push({ id: m[1], name: m[2], level: Number(m[3]), school: m[4] });
  }
}
const actions = [...readFileSync(join(data, '../combat-actions.ts'), 'utf8')
  .matchAll(/\{ id: "([^"]+)", name: "([^"]+)"/g)].map((m) => ({ id: m[1], name: m[2] }));

const rows = [
  ...actions.map((a) => ({ group: 'Ações básicas', file: a.id, name: a.name,
    prompt: `${subjects.get(a.id) ?? a.name}, ${ACTION_MOOD}, ${STYLE}` })),
  ...spells.sort((a, b) => a.level - b.level || a.name.localeCompare(b.name, 'pt'))
    .map((s) => ({ group: s.level === 0 ? 'Truques' : `${s.level}º círculo`, file: s.id, name: `${s.name} (${s.school})`,
      prompt: `${subjects.get(s.id) ?? `the spell "${s.name}"`}, ${SCHOOL_MOOD[s.school] ?? ''}, ${STYLE}` })),
];

const missing = rows.filter((r) => !subjects.has(r.file)).map((r) => r.file);
let md = '# Prompts para as artes das cartas\n\n' +
  'Gere a imagem, salve em `apps/web/public/cards/<arquivo>.png` (ou `.webp`/`.jpg`) e a carta passa a usá-la.\n' +
  'No Midjourney, troque "4:3 aspect ratio" por `--ar 4:3`. Gerado por `build-prompts.mjs`; não edite à mão.\n';
let group = '';
for (const r of rows) {
  if (r.group !== group) { group = r.group; md += `\n## ${group}\n\n| Arquivo | Carta | Prompt |\n|---|---|---|\n`; }
  md += `| \`${r.file}\` | ${r.name} | ${r.prompt} |\n`;
}
writeFileSync(join(here, 'PROMPTS.md'), md);
const q = (s) => `"${s.replace(/"/g, '""')}"`;
writeFileSync(join(here, 'prompts.csv'), 'arquivo,carta,prompt\n' + rows.map((r) => [r.file, r.name, r.prompt].map(q).join(',')).join('\n') + '\n');
console.log(`${rows.length} prompts (${actions.length} ações, ${spells.length} magias); sem tema: ${missing.length ? missing.join(', ') : 'nenhuma'}`);
