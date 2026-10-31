'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getCharacter, updateCharacter, type Character } from '@/lib/api';
import { getSheet, type SheetData } from '@/lib/sheet';

export type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface PatchOpts {
  /** Persiste agora, sem debounce (PV, espaços de magia, mortes...). */
  immediate?: boolean;
}

const DEBOUNCE_MS = 900;

/**
 * Carrega o personagem e mantém as edições com auto-save:
 * as alterações são aplicadas na hora na tela (otimista) e enviadas em lote.
 */
export function useCharacter(id: string) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const charRef = useRef<Character | null>(null);
  const pendingRef = useRef<Partial<Character>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chainRef = useRef<Promise<void>>(Promise.resolve());
  const userRef = useRef('');

  const apply = useCallback((c: Character) => {
    charRef.current = c;
    setCharacter(c);
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    const payload = pendingRef.current;
    if (Object.keys(payload).length === 0 || !userRef.current) return chainRef.current;
    pendingRef.current = {};
    setSaveState('saving');
    chainRef.current = chainRef.current.then(async () => {
      try {
        await updateCharacter(id, userRef.current, payload);
        if (Object.keys(pendingRef.current).length === 0) setSaveState('saved');
        toast.success('Salvo', { id: 'sheet-saved', duration: 1200 });
      } catch {
        setSaveState('error');
        toast.error('Não foi possível salvar. Tentando novamente na próxima alteração.', { id: 'sheet-error' });
        pendingRef.current = { ...payload, ...pendingRef.current };
      }
    });
    return chainRef.current;
  }, [id]);

  const patch = useCallback((partial: Partial<Character>, opts: PatchOpts = {}) => {
    const cur = charRef.current;
    if (!cur) return;
    apply({ ...cur, ...partial });
    pendingRef.current = { ...pendingRef.current, ...partial };
    if (opts.immediate) { void flush(); return; }
    setSaveState('pending');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void flush(); }, DEBOUNCE_MS);
  }, [apply, flush]);

  /** Atualiza campos de customData.sheet (e opcionalmente colunas soltas). */
  const patchSheet = useCallback((partial: Partial<SheetData>, opts: PatchOpts & { columns?: Partial<Character> } = {}) => {
    const cur = charRef.current;
    if (!cur) return;
    const sheet = { ...getSheet(cur), ...partial };
    patch({ ...(opts.columns ?? {}), customData: { ...(cur.customData ?? {}), sheet } }, opts);
  }, [patch]);

  const reload = useCallback(async () => {
    if (!userRef.current) return;
    await flush();
    try { apply(await getCharacter(id, userRef.current)); } catch { /* mantém estado atual */ }
  }, [id, flush, apply]);

  useEffect(() => {
    const u = localStorage.getItem('rpg_username');
    const r = (localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER' | null) ?? 'PLAYER';
    if (!u) { window.location.href = '/'; return; }
    userRef.current = u;
    setUsername(u);
    setUserRole(r);
    let alive = true;
    getCharacter(id, u)
      .then((c) => { if (alive) apply(c); })
      .catch(() => { if (alive) setNotFound(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, apply]);

  // Garante que nada se perde ao sair da página/aba.
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') void flush(); };
    const onUnload = () => { void flush(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onUnload);
      void flush();
    };
  }, [flush]);

  return { character, username, userRole, loading, notFound, saveState, patch, patchSheet, reload, flush };
}

export type CharacterApi = ReturnType<typeof useCharacter>;
