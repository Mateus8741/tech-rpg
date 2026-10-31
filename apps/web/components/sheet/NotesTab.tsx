'use client';

import { ALIGNMENTS } from '@repo/rules';
import { getSheet } from '@/lib/sheet';
import type { CharacterApi } from './useCharacter';
import { Field, Panel, inputCls, selectCls } from './ui';
import { cn } from '@/lib/utils';

export default function NotesTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const ta = () => cn(inputCls, 'resize-y leading-relaxed');
  const setP = (k: keyof typeof sheet.personality, v: string) => api.patchSheet({ personality: { ...sheet.personality, [k]: v } });

  return (
    <div className="space-y-4">
      <Panel title="Personalidade">
        <div className="mb-3 max-w-xs">
          <Field label="Tendência">
            <select className={selectCls} value={c.alignment ?? ''} onChange={(e) => api.patch({ alignment: e.target.value })}>
              <option value="">—</option>
              {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {([['traits', 'Traços de personalidade'], ['ideals', 'Ideais'], ['bonds', 'Ligações'], ['flaws', 'Defeitos']] as const).map(([k, label]) => (
            <Field key={k} label={label}>
              <textarea rows={3} className={ta()} value={sheet.personality[k]} onChange={(e) => setP(k, e.target.value)} />
            </Field>
          ))}
        </div>
      </Panel>
      <Panel title="Aparência">
        <textarea rows={4} className={ta()} placeholder="Altura, cabelo, olhos, marcas..." value={sheet.appearance} onChange={(e) => api.patchSheet({ appearance: e.target.value })} />
      </Panel>
      <Panel title="História">
        <textarea rows={8} className={ta()} placeholder="De onde você veio e o que o trouxe até aqui..." value={sheet.backstory} onChange={(e) => api.patchSheet({ backstory: e.target.value })} />
      </Panel>
      <Panel title="Anotações">
        <textarea rows={8} className={ta()} placeholder="Anotações da campanha, NPCs, pistas..." value={c.notes ?? ''} onChange={(e) => api.patch({ notes: e.target.value })} />
      </Panel>
    </div>
  );
}
