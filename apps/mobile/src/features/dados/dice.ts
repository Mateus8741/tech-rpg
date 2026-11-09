import { rollDice } from '@repo/rules';

/*
 * Lógica de rolagem do app mobile, espelhando apps/web/components/dice/useDiceRoller.ts.
 * Suporta um "pool" de dados mistos (ex.: 2d6 + 1d8 + 3) e expressões livres (ex.: 2d6+3).
 */

export const DICE = [4, 6, 8, 10, 12, 20, 100] as const;
export type DieSides = (typeof DICE)[number];

export type RollMode = 'normal' | 'advantage' | 'disadvantage';
export type Crit = 'max' | 'min' | null;

/** Dados no pool, por número de faces. */
export type DicePool = Partial<Record<DieSides, number>>;

export interface RollGroup {
  sides: number;
  rolls: number[];
}

export interface DiceRoll {
  id: string;
  /** Rótulo legível, ex.: "2d6 + 1d8 + 3". */
  expr: string;
  groups: RollGroup[];
  bonus: number;
  total: number;
  mode: RollMode;
  /** Rolagem descartada em vantagem/desvantagem. */
  discarded?: { rolls: number[]; total: number };
  /** 20 natural (max) ou 1 natural (min) em um único d20. */
  crit: Crit;
  at: number;
}

export const MAX_DICE_PER_ROLL = 100;

const D20_RE = /^1?d20([+-]\d+)?$/i;

const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const poolSize = (pool: DicePool) => DICE.reduce((n, d) => n + (pool[d] ?? 0), 0);

/** "2d6 + 1d8 + 3" */
export function poolLabel(pool: DicePool, modifier = 0): string {
  const dice = DICE.filter((d) => (pool[d] ?? 0) > 0).map((d) => `${pool[d]}d${d}`).join(' + ');
  if (!dice) return '—';
  if (modifier > 0) return `${dice} + ${modifier}`;
  if (modifier < 0) return `${dice} - ${-modifier}`;
  return dice;
}

const isSingleD20 = (pool: DicePool) => poolSize(pool) === 1 && pool[20] === 1;

function critOf(isD20: boolean, rolls: number[]): Crit {
  if (!isD20) return null;
  return rolls[0] === 20 ? 'max' : rolls[0] === 1 ? 'min' : null;
}

function pickByMode<T extends { total: number }>(mode: RollMode, a: T, b: T): [used: T, other: T] {
  const pickA = mode === 'advantage' ? a.total >= b.total : a.total <= b.total;
  return pickA ? [a, b] : [b, a];
}

/** Rola o pool montado pelos botões. Vantagem/desvantagem só valem para um único d20. */
export function rollPool(pool: DicePool, modifier: number, mode: RollMode): DiceRoll | null {
  if (poolSize(pool) === 0 || poolSize(pool) > MAX_DICE_PER_ROLL) return null;

  const once = () => {
    const groups: RollGroup[] = [];
    for (const d of DICE) {
      const n = pool[d] ?? 0;
      if (n <= 0) continue;
      const r = rollDice(`${n}d${d}`);
      if (r) groups.push({ sides: d, rolls: r.rolls });
    }
    const sum = groups.reduce((acc, g) => acc + g.rolls.reduce((a, b) => a + b, 0), 0);
    return { groups, total: sum + modifier };
  };

  const d20 = isSingleD20(pool);
  const effMode: RollMode = d20 ? mode : 'normal';
  let used = once();
  let discarded: DiceRoll['discarded'];
  if (effMode !== 'normal') {
    const [u, other] = pickByMode(effMode, used, once());
    used = u;
    discarded = { rolls: other.groups.flatMap((g) => g.rolls), total: other.total };
  }

  return {
    id: newId(),
    expr: poolLabel(pool, modifier),
    groups: used.groups,
    bonus: modifier,
    total: used.total,
    mode: effMode,
    discarded,
    crit: critOf(d20, used.groups[0]?.rolls ?? []),
    at: Date.now(),
  };
}

export type ExpressionResult = { ok: true; roll: DiceRoll } | { ok: false; error: string };

/** Rola uma expressão livre (ex.: "2d6+3") via rollDice de @repo/rules. */
export function rollExpression(input: string, mode: RollMode): ExpressionResult {
  const clean = input.trim().replace(/\s+/g, '');
  const m = clean.match(/^(\d*)d(\d+)/i);
  if (!m) return { ok: false, error: 'Expressão inválida. Use algo como 2d6+3.' };
  const n = Number(m[1] || 1);
  const sides = Number(m[2]);
  if (n < 1 || sides < 1) return { ok: false, error: 'Use ao menos 1 dado com 1 face ou mais.' };
  if (n > MAX_DICE_PER_ROLL) return { ok: false, error: `No máximo ${MAX_DICE_PER_ROLL} dados por rolagem.` };

  const first = rollDice(clean);
  if (!first) return { ok: false, error: 'Expressão inválida. Use algo como 2d6+3.' };

  const d20 = D20_RE.test(clean);
  const effMode: RollMode = d20 ? mode : 'normal';
  let used = first;
  let discarded: DiceRoll['discarded'];
  if (effMode !== 'normal') {
    const [u, other] = pickByMode(effMode, first, rollDice(clean)!);
    used = u;
    discarded = { rolls: other.rolls, total: other.total };
  }

  return {
    ok: true,
    roll: {
      id: newId(),
      expr: clean.toLowerCase(),
      groups: [{ sides, rolls: used.rolls }],
      bonus: used.bonus,
      total: used.total,
      mode: effMode,
      discarded,
      crit: critOf(d20, used.rolls),
      at: Date.now(),
    },
  };
}

export const allRolls = (roll: DiceRoll) => roll.groups.flatMap((g) => g.rolls);
