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
const GROUP_MS = 1000;
const HISTORY_LIMIT = 50;
const RETRY_DELAYS = [1000, 3000, 8000];

/** Um passo do histórico: valores das chaves antes/depois da edição. */
interface HistoryEntry {
  before: Partial<Character>;
  after: Partial<Character>;
  t: number;
}

const isEditable = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
};

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
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCount = useRef(0);
  const stateRef = useRef<SaveState>('idle');
  const undoStack = useRef<HistoryEntry[]>([]);
  const redoStack = useRef<HistoryEntry[]>([]);
  const [hist, setHist] = useState({ undo: 0, redo: 0 });
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const setState = useCallback((s: SaveState) => { stateRef.current = s; setSaveState(s); }, []);
  const syncHist = useCallback(() => {
    setHist({ undo: undoStack.current.length, redo: redoStack.current.length });
  }, []);

  const apply = useCallback((c: Character) => {
    charRef.current = c;
    setCharacter(c);
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
    const payload = pendingRef.current;
    if (Object.keys(payload).length === 0 || !userRef.current) return chainRef.current;
    pendingRef.current = {};
    setState('saving');
    chainRef.current = chainRef.current.then(async () => {
      try {
        await updateCharacter(id, userRef.current, payload);
        retryCount.current = 0;
        setLastSavedAt(Date.now());
        if (Object.keys(pendingRef.current).length === 0) setState('saved');
        toast.success('Salvo', { id: 'sheet-saved', duration: 1200 });
      } catch {
        setState('error');
        pendingRef.current = { ...payload, ...pendingRef.current };
        // Retry automático com backoff (1s, 3s, 8s); depois, só na próxima alteração.
        const delay = RETRY_DELAYS[retryCount.current];
        if (delay !== undefined) {
          retryCount.current += 1;
          toast.error('Não foi possível salvar. Tentando novamente...', { id: 'sheet-error' });
          retryRef.current = setTimeout(() => { retryRef.current = null; void flush(); }, delay);
        } else {
          toast.error('Não foi possível salvar. Tentaremos de novo na próxima alteração.', { id: 'sheet-error' });
        }
      }
    });
    return chainRef.current;
  }, [id, setState]);

  /** Aplica e agenda o salvamento; `record` controla se entra no histórico. */
  const commit = useCallback((partial: Partial<Character>, opts: PatchOpts, record: boolean) => {
    const cur = charRef.current;
    if (!cur) return;
    if (record) {
      const keys = Object.keys(partial) as (keyof Character)[];
      const before: Record<string, unknown> = {};
      for (const k of keys) before[k] = cur[k];
      const now = Date.now();
      const last = undoStack.current[undoStack.current.length - 1];
      const sameKeys = last && Object.keys(last.before).length === keys.length
        && keys.every((k) => k in last.before);
      if (last && sameKeys && now - last.t < GROUP_MS) {
        last.after = { ...last.after, ...partial };
        last.t = now;
      } else {
        undoStack.current.push({ before: before as Partial<Character>, after: { ...partial }, t: now });
        if (undoStack.current.length > HISTORY_LIMIT) undoStack.current.shift();
      }
      redoStack.current = [];
      syncHist();
    }
    apply({ ...cur, ...partial });
    pendingRef.current = { ...pendingRef.current, ...partial };
    retryCount.current = 0;
    if (opts.immediate) { void flush(); return; }
    setState('pending');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { void flush(); }, DEBOUNCE_MS);
  }, [apply, flush, setState, syncHist]);

  const patch = useCallback((partial: Partial<Character>, opts: PatchOpts = {}) => {
    commit(partial, opts, true);
  }, [commit]);

  const undo = useCallback(() => {
    const e = undoStack.current.pop();
    if (!e) return;
    redoStack.current.push(e);
    e.t = 0; // não agrupa edições novas com este passo
    commit(e.before, {}, false);
    syncHist();
  }, [commit, syncHist]);

  const redo = useCallback(() => {
    const e = redoStack.current.pop();
    if (!e) return;
    undoStack.current.push(e);
    commit(e.after, {}, false);
    syncHist();
  }, [commit, syncHist]);

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
    undoStack.current = []; redoStack.current = []; syncHist();
    setUsername(u);
    setUserRole(r);
    let alive = true;
    getCharacter(id, u)
      .then((c) => { if (alive) apply(c); })
      .catch(() => { if (alive) setNotFound(true); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [id, apply, syncHist]);

  // Garante que nada se perde ao sair da página/aba.
  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') void flush(); };
    const onUnload = (e: BeforeUnloadEvent) => {
      const s = stateRef.current;
      void flush();
      // Avisa se ainda há alterações não salvas.
      if (s === 'pending' || s === 'saving' || s === 'error') { e.preventDefault(); e.returnValue = ''; }
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onUnload);
      void flush();
    };
  }, [flush]);

  // Atalhos Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z e Ctrl+Y (fora de campos de texto).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || isEditable(e.target)) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if ((k === 'z' && e.shiftKey) || (k === 'y' && !e.metaKey)) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo]);

  // Limpa o retry pendente ao desmontar.
  useEffect(() => () => { if (retryRef.current) clearTimeout(retryRef.current); }, []);

  return { character, username, userRole, loading, notFound, saveState, patch, patchSheet, reload, flush,
    undo, redo, canUndo: hist.undo > 0, canRedo: hist.redo > 0, lastSavedAt };
}

export type CharacterApi = ReturnType<typeof useCharacter>;
