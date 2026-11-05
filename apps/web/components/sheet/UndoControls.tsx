'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Check, FileText, Loader2, Redo2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CharacterApi } from './useCharacter';

/** "há 5 s", "há 3 min"... */
function ago(ts: number, now: number) {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 5) return 'agora há pouco';
  if (s < 60) return `há ${s} s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  return `há ${Math.floor(m / 60)} h`;
}

/** Indicador de salvamento com "última vez salvo há X". */
export function SaveStatus({ api }: { api: CharacterApi }) {
  const { saveState, lastSavedAt } = api;
  const [now, setNow] = useState(() => Date.now());

  // Atualiza o contador a cada 10s enquanto houver um horário salvo.
  useEffect(() => {
    if (!lastSavedAt) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, [lastSavedAt]);

  const map = {
    pending: { t: 'Alterações pendentes', i: <FileText className="h-3 w-3" />, c: 'text-ink-soft' },
    saving: { t: 'Salvando...', i: <Loader2 className="h-3 w-3 animate-spin" />, c: 'text-indigo-ink' },
    saved: { t: 'Salvo', i: <Check className="h-3 w-3" />, c: 'text-green-400' },
    error: { t: 'Erro ao salvar', i: <AlertTriangle className="h-3 w-3" />, c: 'text-red-400' },
    idle: { t: 'Sem alterações', i: <Check className="h-3 w-3" />, c: 'text-ink-muted' },
  } as const;
  const m = map[saveState];
  const since = lastSavedAt && saveState !== 'saving' ? ` · salvo ${ago(lastSavedAt, now)}` : '';

  return (
    <span role="status" aria-live="polite" className={cn('flex items-center gap-1 whitespace-nowrap text-xs', m.c)}>
      {m.i}
      <span>{m.t}</span>
      {since && <span className="hidden text-ink-muted sm:inline">{since}</span>}
      {saveState === 'error' && (
        <button
          type="button"
          onClick={() => void api.flush()}
          className="ml-1 rounded px-1 underline underline-offset-2 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
        >
          Tentar de novo
        </button>
      )}
    </span>
  );
}

const btn =
  'flex h-7 w-7 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent';

export default function UndoControls({ api }: { api: CharacterApi }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" role="group" aria-label="Histórico de edições">
        <button type="button" className={btn} onClick={api.undo} disabled={!api.canUndo} aria-label="Desfazer (Ctrl+Z)" title="Desfazer (Ctrl+Z)">
          <Undo2 className="h-3.5 w-3.5" />
        </button>
        <button type="button" className={btn} onClick={api.redo} disabled={!api.canRedo} aria-label="Refazer (Ctrl+Shift+Z)" title="Refazer (Ctrl+Shift+Z)">
          <Redo2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <SaveStatus api={api} />
    </div>
  );
}
