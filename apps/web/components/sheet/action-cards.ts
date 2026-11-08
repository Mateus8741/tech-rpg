// Deriva as cartas de ação da ficha. Puro: sem React.
import {
  ACTION_COST_LABEL, COMBAT_ACTIONS, abilityModifier, featureActionCost, getBackground, getClass, getRace, getSpell,
  spellActionCost, type ActionCost, type Spell, type Weapon,
} from '@repo/rules';
import type { Character } from '@/lib/api';
import { activeSpellcasting, derivedStats, getSheet, type SheetData } from '@/lib/sheet';
import type { EntryRef } from '@/components/entries';
import { spellRollFor } from '@/components/spells/filters';
import { normalizeText } from '@/components/spells/spell-utils';
import { queryEmpty, scoreSpell, scoreText, type ParsedQuery } from '@/components/spells/smart-search';
import { lookupItem, weaponProficient } from './equipment-logic';

export type CardSection = 'acao' | 'bonus' | 'reacao' | 'truque' | 'outro';
/** Slot do turno gasto ao usar a carta. */
export type TurnSlot = 'acao' | 'bonus' | 'reacao';

export const SECTIONS: { id: CardSection; title: string; color: string }[] = [
  { id: 'acao', title: 'Ação', color: '#6366f1' },
  { id: 'bonus', title: 'Ação bônus', color: '#f5c451' },
  { id: 'reacao', title: 'Reação', color: '#38bdf8' },
  { id: 'truque', title: 'Truques', color: '#8b5cf6' },
  { id: 'outro', title: 'Conjuração longa', color: '#94a3b8' },
];

export interface DamageRoll { label: string; expr: string }

export interface ActionCard {
  key: string;
  section: CardSection;
  name: string;
  cost: ActionCost;
  costLabel: string;
  source: string;
  summary: string;
  stats: string[];
  entry: EntryRef;
  attack?: { label: string; bonus: number };
  damage: DamageRoll[];
  spell?: Spell;
}

const asSlot = (cost: ActionCost): TurnSlot | null => (cost === 'acao' || cost === 'bonus' || cost === 'reacao' ? cost : null);
export const turnSlot = (card: ActionCard) => asSlot(card.cost);

const sectionOf = (cost: ActionCost): CardSection => asSlot(cost) ?? 'outro';

/** Primeira frase do texto, limitada para caber na carta. */
function firstSentence(text: string, max = 120): string {
  const line = text.split('\n')[0]!.trim();
  const end = line.search(/[.!?](\s|$)/);
  const s = end > 0 ? line.slice(0, end + 1) : line;
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/** Resumos em que a primeira frase não diz o que a característica faz. */
const SUMMARY_OVERRIDES: Record<string, string> = {
  'Ação Ardilosa': 'Disparada, Desengajar ou Esconder como ação bônus.',
};

const fmtMod = (n: number) => (n === 0 ? '' : n > 0 ? `+${n}` : `${n}`);

/* ---------- Armas ---------- */

function weaponCard(c: Character, sheet: SheetData, w: Weapon, attackBonus: number, key: string): ActionCard {
  const d = derivedStats(c);
  const str = abilityModifier(c.strength);
  const dex = abilityModifier(c.dexterity);
  const finesse = w.properties.some((p) => normalizeText(p).startsWith('acuidade'));
  const ranged = w.kind === 'À distância';
  const mod = ranged ? dex : finesse ? Math.max(str, dex) : str;
  const prof = weaponProficient(getClass(sheet.classId), w);
  const bonus = mod + (prof ? d.pb : 0) + attackBonus;
  const dice = w.damage.match(/^\d+d\d+/)?.[0];
  const damage: DamageRoll[] = [];
  if (dice) damage.push({ label: 'Dano', expr: `${dice}${fmtMod(mod)}` });
  const sneak = sheet.classId === 'ladino' && (finesse || ranged) ? `${Math.ceil(c.level / 2)}d6` : null;
  if (sneak) damage.push({ label: 'Furtivo', expr: sneak });
  return {
    key, section: 'acao', name: w.name, cost: 'acao', costLabel: ACTION_COST_LABEL.acao,
    source: `Arma ${w.kind === 'À distância' ? 'à distância' : 'corpo a corpo'}`,
    summary: w.properties.join(' · ') || 'Sem propriedades especiais.',
    stats: [
      `Ataque ${bonus >= 0 ? '+' : ''}${bonus}${prof ? '' : ' (sem proficiência)'}`,
      dice ? `${dice}${fmtMod(mod)} ${w.damage.slice(dice.length).trim()}` : w.damage,
      ...(sneak ? [`Ataque Furtivo +${sneak}`] : []),
    ],
    entry: { kind: 'weapon', name: w.name },
    attack: { label: `Ataque com ${w.name}`, bonus },
    damage,
  };
}

/* ---------- Magias ---------- */

const SAVE_ABBR: Record<string, string> = {
  forca: 'FOR', destreza: 'DES', constituicao: 'CON', inteligencia: 'INT', sabedoria: 'SAB', carisma: 'CAR',
};

/** Dano do truque cresce nos níveis 5, 11 e 17 do personagem. */
const cantripTier = (level: number) => (level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1);

function spellDamage(s: Spell, level: number): DamageRoll | null {
  const r = spellRollFor(s, s.level);
  if (!r) return null;
  const label = r.kind === 'cura' ? 'Cura' : 'Dano';
  if (s.level > 0) return { label, expr: r.expr };
  const m = r.expr.match(/^(\d+)(d.+)$/);
  return { label, expr: m ? `${Number(m[1]) * cantripTier(level)}${m[2]}` : r.expr };
}

function spellCard(c: Character, s: Spell): ActionCard {
  const spell = derivedStats(c).spell;
  const cost = spellActionCost(s);
  const text = normalizeText(s.description);
  const hasAttack = /jogada de ataque|ataque (magico|com magia)/.test(text);
  const save = text.match(/(?:teste de resistencia|salvaguarda) de (forca|destreza|constituicao|inteligencia|sabedoria|carisma)/)?.[1];
  const dmg = spellDamage(s, c.level);
  return {
    key: `spell:${s.id}`,
    section: s.level === 0 ? 'truque' : sectionOf(cost),
    name: s.name, cost,
    costLabel: asSlot(cost) ? ACTION_COST_LABEL[cost] : s.castingTime,
    source: s.level === 0 ? 'Truque' : `Magia de ${s.level}º círculo`,
    summary: firstSentence(s.description),
    stats: [
      s.range, s.duration,
      ...(dmg ? [`${dmg.label} ${dmg.expr}`] : []),
      ...(save && spell ? [`CD ${spell.dc} ${SAVE_ABBR[save]}`] : []),
      ...(s.concentration && !/concentra/i.test(s.duration) ? ['Concentração'] : []),
    ],
    entry: { kind: 'spell', id: s.id },
    attack: hasAttack && spell ? { label: `Ataque de ${s.name}`, bonus: spell.attack } : undefined,
    damage: dmg ? [dmg] : [],
    spell: s,
  };
}

/* ---------- Lista completa ---------- */

export function buildActionCards(c: Character): ActionCard[] {
  const sheet = getSheet(c);
  const cards: ActionCard[] = [];

  // Ordem das seções: o que é do personagem primeiro; regras básicas no fim.
  (c.equipment ?? []).forEach((it, i) => {
    const l = lookupItem(it.name);
    if (l?.kind === 'weapon') cards.push(weaponCard(c, sheet, l.weapon, it.attack ?? 0, `weapon:${i}:${l.weapon.name}`));
  });

  const pushTrait = (key: string, name: string, description: string, source: string, entry: EntryRef) => {
    const cost = featureActionCost(description, name);
    if (cost === 'passivo') return;
    cards.push({
      key, section: sectionOf(cost), name, cost, costLabel: ACTION_COST_LABEL[cost], source,
      summary: SUMMARY_OVERRIDES[name] ?? firstSentence(description), stats: [], entry, damage: [],
    });
  };

  const cls = getClass(sheet.classId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  for (const f of cls?.features ?? []) {
    if (f.level <= c.level) pushTrait(`feature:${f.name}`, f.name, f.description, cls!.name, { kind: 'feature', classId: sheet.classId, name: f.name });
  }
  for (const f of sub?.features ?? []) {
    if (f.level <= c.level) pushTrait(`feature:${sub!.id}:${f.name}`, f.name, f.description, sub!.name, { kind: 'feature', classId: sheet.classId, subclassId: sub!.id, name: f.name });
  }

  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  for (const t of race?.traits ?? []) pushTrait(`trait:${t.name}`, t.name, t.description, race!.name, { kind: 'trait', raceId: race!.id, name: t.name });
  for (const t of subrace?.traits ?? []) pushTrait(`trait:${subrace!.id}:${t.name}`, t.name, t.description, subrace!.name, { kind: 'trait', raceId: race!.id, subraceId: subrace!.id, name: t.name });

  const bg = getBackground(sheet.backgroundId);
  if (bg) pushTrait(`background:${bg.id}`, bg.feature.name, bg.feature.description, bg.name, { kind: 'background', id: bg.id });

  const prepares = activeSpellcasting(sheet, c.level)?.preparesSpells;
  for (const id of sheet.spellsKnown) {
    const s = getSpell(id);
    if (s && (s.level === 0 || !prepares || sheet.spellsPrepared.includes(id))) cards.push(spellCard(c, s));
  }

  for (const a of COMBAT_ACTIONS) {
    cards.push({
      key: `action:${a.id}`, section: sectionOf(a.cost), name: a.name, cost: a.cost, costLabel: ACTION_COST_LABEL[a.cost],
      source: 'Regra básica', summary: a.summary, stats: [], entry: { kind: 'action', id: a.id }, damage: [],
    });
  }
  return cards;
}

/**
 * Pontua a carta para a busca inteligente; -1 = fora. Magias usam o índice completo;
 * as demais cartas, nome + texto da carta. Atalhos de magia (círculo, concentração...) excluem não-magias.
 */
export function cardScore(card: ActionCard, pq: ParsedQuery): number {
  if (queryEmpty(pq)) return 0;
  if (card.spell) return scoreSpell(card.spell, pq);
  if (pq.level !== undefined || pq.concentration || pq.ritual || pq.school || pq.classId) return -1;
  if (pq.cost && card.cost !== pq.cost) return -1;
  return scoreText(normalizeText(card.name), normalizeText(`${card.source} ${card.summary} ${card.stats.join(' ')}`), pq);
}

/** Condições que dão desvantagem em ataques (diferente de testes de habilidade). */
export function attackDisadvantage(sheet: SheetData): string[] {
  const names: [string, string][] = [['envenenado', 'Envenenado'], ['amedrontado', 'Amedrontado'], ['cego', 'Cego'], ['caido', 'Caído'], ['impedido', 'Impedido']];
  return [
    ...(sheet.exhaustion >= 3 ? [`Exaustão ${sheet.exhaustion}`] : []),
    ...names.filter(([id]) => sheet.conditions.includes(id)).map(([, n]) => n),
  ];
}

/** Menor círculo com espaço livre para conjurar a magia. Retorna null quando não há. */
export function lowestSlot(spellLevel: number, slots: number[], used: number[]): number | null {
  for (let lvl = spellLevel; lvl <= slots.length; lvl++) {
    const total = slots[lvl - 1] ?? 0;
    if (total > (used[lvl - 1] ?? 0)) return lvl;
  }
  return null;
}
