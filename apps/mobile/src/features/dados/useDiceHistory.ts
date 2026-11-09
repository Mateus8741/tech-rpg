import { useCallback, useSyncExternalStore } from 'react';

import type { DiceRoll } from './dice';

/*
 * Histórico de rolagens em memória (sobrevive a trocas de aba, some ao fechar o app).
 * Store em módulo + useSyncExternalStore, como no web.
 */

export const HISTORY_MAX = 20;

const EMPTY: DiceRoll[] = [];
let history: DiceRoll[] = EMPTY;
const listeners = new Set<() => void>();

function commit(next: DiceRoll[]) {
  history = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const getSnapshot = () => history;

export function useDiceHistory() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const push = useCallback((roll: DiceRoll) => commit([roll, ...history].slice(0, HISTORY_MAX)), []);
  const clear = useCallback(() => commit(EMPTY), []);
  return { history: items, last: items[0] ?? null, push, clear };
}
