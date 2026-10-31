"use client";

import { useCallback, useSyncExternalStore } from "react";
import { rollDice } from "@repo/rules";

export type RollMode = "normal" | "advantage" | "disadvantage";
export type Crit = "max" | "min" | null;

export interface DiceRoll {
  id: string;
  expr: string;
  rolls: number[];
  bonus: number;
  total: number;
  mode: RollMode;
  /** Resultado descartado (vantagem/desvantagem): rolagem completa não usada. */
  discarded?: { rolls: number[]; total: number };
  /** 20 natural (max) ou 1 natural (min) em um único d20. */
  crit: Crit;
  at: number;
}

const KEY = "rpg:dice-history";
const MAX = 50;
const EMPTY: DiceRoll[] = [];

let history: DiceRoll[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) history = parsed.slice(0, MAX);
    }
  } catch {
    /* storage indisponível */
  }
}

function commit(next: DiceRoll[]) {
  history = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  load();
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      try {
        history = e.newValue ? (JSON.parse(e.newValue) as DiceRoll[]) : EMPTY;
      } catch {
        history = EMPTY;
      }
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return history;
};
const getServerSnapshot = () => EMPTY;

const D20_RE = /^\s*1?d20\s*(?:[+-]\s*\d+)?\s*$/i;

/** Rola uma expressão (ex.: "2d6+3"). Retorna null se inválida. */
export function performRoll(expr: string, mode: RollMode = "normal"): DiceRoll | null {
  const clean = expr.trim().replace(/\s+/g, "");
  const first = rollDice(clean);
  if (!first) return null;
  const isD20 = D20_RE.test(clean);
  let used = first;
  let discarded: DiceRoll["discarded"];
  const effMode: RollMode = isD20 ? mode : "normal";
  if (effMode !== "normal") {
    const second = rollDice(clean)!;
    const pickFirst = effMode === "advantage" ? first.total >= second.total : first.total <= second.total;
    used = pickFirst ? first : second;
    const other = pickFirst ? second : first;
    discarded = { rolls: other.rolls, total: other.total };
  }
  const crit: Crit = isD20 ? (used.rolls[0] === 20 ? "max" : used.rolls[0] === 1 ? "min" : null) : null;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    expr: clean,
    rolls: used.rolls,
    bonus: used.bonus,
    total: used.total,
    mode: effMode,
    discarded,
    crit,
    at: Date.now(),
  };
}

export function useDiceRoller() {
  const rolls = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /** Rola uma expressão e grava no histórico. */
  const roll = useCallback((expr: string, mode: RollMode = "normal"): DiceRoll | null => {
    const r = performRoll(expr, mode);
    if (r) commit([r, ...history].slice(0, MAX));
    return r;
  }, []);

  /** Rola um único dado (ex.: rollDie(20, "advantage")). */
  const rollDie = useCallback(
    (sides: number, mode: RollMode = "normal") => roll(`1d${sides}`, mode),
    [roll],
  );

  const clear = useCallback(() => commit(EMPTY), []);

  return { history: rolls, last: rolls[0] ?? null, roll, rollDie, clear };
}
