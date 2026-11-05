'use client';

import { useState } from 'react';
import { CONDITIONS } from '@repo/rules';
import { AlertTriangle, Minus, Plus } from 'lucide-react';
import { getSheet } from '@/lib/sheet';
import { cn } from '@/lib/utils';
import type { CharacterApi } from './useCharacter';
import { Panel } from './ui';
import { EXHAUSTION_EFFECTS, effectWarnings } from './effects';

/** Condições (chips com descrição da regra), exaustão 0-6 e avisos de efeitos automáticos. */
export default function ConditionsPanel({ api }: { api: CharacterApi }) {
  const sheet = getSheet(api.character!);
  const [openId, setOpenId] = useState<string | null>(null);
  const imm = { immediate: true };
  const list = CONDITIONS.filter((x) => x.id !== 'exaustao');
  const opened = CONDITIONS.find((x) => x.id === openId);
  const warnings = effectWarnings(sheet);

  const toggle = (id: string) => {
    const has = sheet.conditions.includes(id);
    api.patchSheet({ conditions: has ? sheet.conditions.filter((x) => x !== id) : [...sheet.conditions, id] }, imm);
  };
  const setEx = (n: number) => api.patchSheet({ exhaustion: Math.min(6, Math.max(0, n)) }, imm);

  return (
    <Panel title="Condições e exaustão">
      <p className="mb-1.5 text-[10px] text-ink-faint">Clique para marcar; o ícone &quot;i&quot; abre a regra.</p>
      <div className="flex flex-wrap gap-1.5">
        {list.map((cond) => {
          const on = sheet.conditions.includes(cond.id);
          return (
            <span key={cond.id} className={cn('inline-flex items-center overflow-hidden rounded-full border text-xs',
              on ? 'border-amber-400/60 bg-amber-400/10 text-amber-200' : 'border-line text-ink-soft')}>
              <button type="button" aria-pressed={on} onClick={() => toggle(cond.id)} className="py-1 pl-2.5 pr-1.5 hover:text-ink">{cond.name}</button>
              <button
                type="button" aria-label={`Regra: ${cond.name}`} aria-expanded={openId === cond.id}
                onClick={() => setOpenId(openId === cond.id ? null : cond.id)}
                className="border-l border-current/20 px-1.5 py-1 text-[10px] opacity-70 hover:opacity-100"
              >i</button>
            </span>
          );
        })}
      </div>

      {opened && (
        <div className="mt-2 space-y-1 rounded-lg border border-line bg-base p-3 text-[12px] leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">{opened.name}</p>
          {opened.description.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-ink-soft">Exaustão</span>
        <button type="button" aria-label="Diminuir exaustão" onClick={() => setEx(sheet.exhaustion - 1)} className="rounded border border-line p-1 text-ink-soft hover:text-ink"><Minus className="h-3 w-3" /></button>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <button
              key={n} type="button" onClick={() => setEx(sheet.exhaustion === n ? n - 1 : n)} aria-pressed={sheet.exhaustion >= n}
              title={`Nível ${n}: ${EXHAUSTION_EFFECTS[n]}`}
              className={cn('h-6 w-6 rounded border text-[11px] tabular-nums transition-colors',
                sheet.exhaustion >= n ? 'border-red-500/60 bg-red-500/20 text-red-300' : 'border-line text-ink-muted')}
            >{n}</button>
          ))}
        </div>
        <button type="button" aria-label="Aumentar exaustão" onClick={() => setEx(sheet.exhaustion + 1)} className="rounded border border-line p-1 text-ink-soft hover:text-ink"><Plus className="h-3 w-3" /></button>
      </div>
      <ol className="mt-2 space-y-0.5 text-[11px]">
        {EXHAUSTION_EFFECTS.slice(1).map((t, i) => (
          <li key={i} className={sheet.exhaustion >= i + 1 ? 'text-red-300' : 'text-ink-faint'}>{i + 1}. {t}</li>
        ))}
      </ol>

      {warnings.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/5 p-2.5">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-amber-300"><AlertTriangle className="h-3.5 w-3.5" />Efeitos ativos</p>
          <ul className="space-y-0.5 text-[11px] text-amber-200/80">{warnings.map((w) => <li key={w}>• {w}</li>)}</ul>
        </div>
      )}
    </Panel>
  );
}
