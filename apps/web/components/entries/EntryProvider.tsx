'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { EntryRef } from './types';

const EntryDrawer = dynamic(() => import('./EntryDrawer'), { ssr: false });

const EntryContext = createContext<(ref: EntryRef) => void>(() => {});

/** `const openEntry = useEntry(); openEntry({ kind: 'spell', id })` abre o painel de detalhes. */
export const useEntry = () => useContext(EntryContext);

export function EntryProvider({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<EntryRef | null>(null);
  const [loaded, setLoaded] = useState(false);
  const open = useCallback((ref: EntryRef) => { setLoaded(true); setEntry(ref); }, []);
  const close = useCallback(() => setEntry(null), []);
  const value = useMemo(() => open, [open]);
  return (
    <EntryContext.Provider value={value}>
      {children}
      {loaded && <EntryDrawer entry={entry} onClose={close} />}
    </EntryContext.Provider>
  );
}
