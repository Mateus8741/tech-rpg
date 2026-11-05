'use client';

import { useCallback, useSyncExternalStore } from 'react';

const KEY = 'rpg:spell-favorites';
const EMPTY: string[] = [];
let cache: { raw: string | null; list: string[] } = { raw: null, list: EMPTY };
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cache.raw) return cache.list;
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : EMPTY;
    cache = { raw, list };
    return list;
  } catch {
    return EMPTY;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage); };
}

/** Favoritas locais (navegador /magias). Seguro para SSR: servidor vê lista vazia. */
export function useSpellFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggle = useCallback((id: string) => {
    const cur = read();
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage indisponível */ }
    listeners.forEach((l) => l());
  }, []);
  return { favorites, toggle };
}
