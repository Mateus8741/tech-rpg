'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { abilityModifier, getClass } from '@repo/rules';
import { Flame, Plus, Trash2, Wand2 } from 'lucide-react';
import { getSheet, type ResourceDef } from '@/lib/sheet';
import { cn } from '@/lib/utils';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls, selectCls } from './ui';
import { RECHARGE_LABEL, rageDamage, suggestResources } from './resources';

/** Recursos rastreáveis (fúria, ki, usos por descanso...) em caixinhas clicáveis. */
export default function ResourcesPanel({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const imm = { immediate: true };
  const [raging, setRaging] = useState(false);
  const [draft, setDraft] = useState<{ name: string; max: number; recharge: ResourceDef['recharge'] } | null>(null);

  const save = (resources: ResourceDef[]) => api.patchSheet({ resources }, imm);
  const update = (id: string, p: Partial<ResourceDef>) => save(sheet.resources.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const suggestions = suggestResources(sheet.classId, c.level, { cha: abilityModifier(c.charisma) })
    .filter((s) => !sheet.resources.some((r) => r.id === s.id));

  const addSuggested = () => {
    save([...sheet.resources, ...suggestions.map((s) => ({ ...s, used: 0 }))]);
    toast.success(`${suggestions.length} recurso(s) adicionado(s).`);
  };

  // Clique na caixa i: marca até ela como usada; clicar na última usada devolve um uso
  const toggleBox = (r: ResourceDef, i: number) => update(r.id, { used: r.used === i + 1 ? i : i + 1 });

  const addCustom = () => {
    if (!draft?.name.trim()) return;
    save([...sheet.resources, { id: `custom-${Date.now()}`, name: draft.name.trim(), max: Math.max(1, draft.max), used: 0, recharge: draft.recharge }]);
    setDraft(null);
  };

  const furia = sheet.resources.find((r) => r.id === 'furia');
  const toggleRage = () => {
    if (!raging && furia) {
      if (furia.used >= furia.max) { toast.error('Sem usos de Fúria restantes.'); return; }
      update('furia', { used: furia.used + 1 });
    }
    setRaging((x) => !x);
  };

  return (
    <Panel
      title="Recursos"
      action={
        <div className="flex gap-1.5">
          {suggestions.length > 0 && (
            <GhostButton onClick={addSuggested} className="py-0.5"><Wand2 className="h-3.5 w-3.5" />Adicionar sugeridos da classe</GhostButton>
          )}
          <GhostButton onClick={() => setDraft({ name: '', max: 1, recharge: 'long' })} className="py-0.5"><Plus className="h-3.5 w-3.5" />Novo recurso</GhostButton>
        </div>
      }
    >
      {sheet.classId === 'barbaro' && (
        <button
          type="button" aria-pressed={raging} onClick={toggleRage}
          className={cn('mb-3 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
            raging ? 'border-red-500/60 bg-red-500/10 text-red-300' : 'border-line text-ink-muted hover:border-line-strong')}
        >
          <Flame className="h-4 w-4" />
          {raging ? `Fúria ativa: +${rageDamage(c.level)} de dano corpo a corpo, resistência a dano físico` : 'Fúria inativa (consome um uso ao ativar)'}
        </button>
      )}

      {sheet.resources.length === 0 && !draft && (
        <p className="text-xs text-ink-faint">
          Nenhum recurso. {getClass(sheet.classId) ? 'Use "Adicionar sugeridos da classe" ou crie um novo.' : 'Crie um novo recurso.'}
        </p>
      )}

      <ul className="space-y-2">
        {sheet.resources.map((r) => (
          <li key={r.id} className="rounded-lg border border-line bg-base px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{r.name}</span>
              <span className="text-[10px] text-ink-muted">{r.max - r.used}/{r.max} · {RECHARGE_LABEL[r.recharge]}</span>
              <select
                aria-label={`Recarga de ${r.name}`} value={r.recharge}
                onChange={(e) => update(r.id, { recharge: e.target.value as ResourceDef['recharge'] })}
                className="rounded border border-line bg-canvas px-1 py-0.5 text-[10px] text-ink-soft"
              >
                {Object.entries(RECHARGE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <input
                type="number" min={1} value={r.max} aria-label={`Máximo de ${r.name}`}
                onChange={(e) => { const max = Math.max(1, Number(e.target.value) || 1); update(r.id, { max, used: Math.min(r.used, max) }); }}
                className="w-12 rounded border border-line bg-canvas px-1 py-0.5 text-center text-xs text-ink"
              />
              <button type="button" aria-label={`Remover ${r.name}`} onClick={() => save(sheet.resources.filter((x) => x.id !== r.id))} className="text-ink-faint hover:text-red-400">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            {r.max <= 20 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {Array.from({ length: r.max }, (_, i) => (
                  <button
                    key={i} type="button" onClick={() => toggleBox(r, i)} aria-pressed={i < r.used}
                    aria-label={`${r.name} uso ${i + 1}`}
                    className={cn('h-5 w-5 rounded border transition-colors', i < r.used ? 'border-ink-faint bg-surface-3' : 'border-[#6366f1] bg-[#6366f1]/30 hover:bg-[#6366f1]/50')}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
                Usados
                <input
                  type="number" min={0} max={r.max} value={r.used} aria-label={`Usados de ${r.name}`}
                  onChange={(e) => update(r.id, { used: Math.min(r.max, Math.max(0, Number(e.target.value) || 0)) })}
                  className="w-16 rounded border border-line bg-canvas px-1 py-0.5 text-center text-xs text-ink"
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {draft && (
        <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-[#6366f1]/30 p-2">
          <input aria-label="Nome do recurso" className={cn(inputCls, 'min-w-32 flex-1')} placeholder="Nome" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className={cn(inputCls, 'w-16 text-center')} type="number" min={1} value={draft.max} aria-label="Máximo" onChange={(e) => setDraft({ ...draft, max: Number(e.target.value) || 1 })} />
          <select className={cn(selectCls, 'w-auto')} value={draft.recharge} aria-label="Recarga" onChange={(e) => setDraft({ ...draft, recharge: e.target.value as ResourceDef['recharge'] })}>
            {Object.entries(RECHARGE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <GhostButton onClick={addCustom}>Adicionar</GhostButton>
          <GhostButton onClick={() => setDraft(null)}>Cancelar</GhostButton>
        </div>
      )}
    </Panel>
  );
}
