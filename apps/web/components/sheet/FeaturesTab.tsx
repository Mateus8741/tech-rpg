'use client';

import { ChevronRight } from 'lucide-react';
import { ACTION_COST_LABEL, featureActionCost, getBackground, getClass, getRace, type ActionCost } from '@repo/rules';
import { useEntry, type EntryRef } from '@/components/entries';
import { getSheet } from '@/lib/sheet';
import { cn } from '@/lib/utils';
import type { CharacterApi } from './useCharacter';
import { Panel, selectCls } from './ui';

interface Item { name: string; description: string; tag?: string; ref: EntryRef }

const COST_BADGE: Partial<Record<ActionCost, string>> = {
  acao: 'border-[#f5c451]/40 bg-[#f5c451]/10 text-gold-ink',
  bonus: 'border-[#22c55e]/40 bg-[#22c55e]/10 text-green-300',
  reacao: 'border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-violet-ink',
};

/** Linha tocável: nome, custo em combate e prévia; os detalhes abrem no painel. */
function FeatureRow({ item }: { item: Item }) {
  const openEntry = useEntry();
  const cost = featureActionCost(item.description, item.name);
  const badge = COST_BADGE[cost];
  const preview = item.description.split('\n')[0];
  return (
    <button
      type="button" onClick={() => openEntry(item.ref)} aria-haspopup="dialog"
      className="group flex w-full items-center gap-2 rounded-lg border border-line bg-base px-3 py-2 text-left outline-none transition-colors hover:border-[#6366f1]/50 focus-visible:ring-2 focus-visible:ring-indigo/70"
    >
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium text-ink">{item.name}</span>
          {item.tag && <span className="rounded bg-[#6366f1]/10 px-1.5 py-0.5 text-[10px] text-indigo-ink">{item.tag}</span>}
          {badge && <span className={cn('rounded border px-1.5 py-0.5 text-[10px]', badge)}>{ACTION_COST_LABEL[cost]}</span>}
        </span>
        {preview && <span className="mt-0.5 block truncate text-xs text-ink-muted">{preview}</span>}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint group-hover:text-indigo-ink" aria-hidden />
    </button>
  );
}

export default function FeaturesTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const openEntry = useEntry();
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  const cls = getClass(sheet.classId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  const bg = getBackground(sheet.backgroundId);

  const groups: { title: string; items: Item[] }[] = [
    { title: `Raça${race ? ` · ${race.name}` : ''}`, items: [
      ...(race?.traits ?? []).map((t) => ({ ...t, ref: { kind: 'trait', raceId: race!.id, name: t.name } as EntryRef })),
      ...(subrace?.traits ?? []).map((t) => ({ ...t, ref: { kind: 'trait', raceId: race!.id, subraceId: subrace!.id, name: t.name } as EntryRef })),
    ] },
    {
      title: `Classe${cls ? ` · ${cls.name}` : ''}`,
      items: (cls?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, tag: `Nv ${f.level}`, ref: { kind: 'feature', classId: cls!.id, name: f.name } as EntryRef })),
    },
    {
      title: `Subclasse${sub ? ` · ${sub.name}` : ''}`,
      items: (sub?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, tag: `Nv ${f.level}`, ref: { kind: 'feature', classId: cls!.id, subclassId: sub!.id, name: f.name } as EntryRef })),
    },
    { title: `Antecedente${bg ? ` · ${bg.name}` : ''}`, items: bg ? [{ ...bg.feature, ref: { kind: 'background', id: bg.id } as EntryRef }] : [] },
    {
      title: 'Outras características',
      items: [
        ...sheet.chosenFeatures.map((n) => {
          const description = 'Escolha registrada na criação do personagem.';
          return { name: n, description, ref: { kind: 'custom', title: n, body: description, tag: 'Escolha' } as EntryRef };
        }),
        ...(Array.isArray(c.features) ? c.features : [])
          .filter((f) => f && typeof f === 'object' && 'name' in f)
          .map((f: { name: string; description?: string }) => ({
            name: f.name, description: f.description ?? '',
            ref: { kind: 'custom', title: f.name, body: f.description || 'Sem descrição.', tag: 'Característica' } as EntryRef,
          })),
      ],
    },
  ];

  const needsSubclass = cls && !sub && c.level >= Math.min(...cls.subclasses.map((s) => s.level), 99);

  return (
    <div className="space-y-4">
      {cls && cls.subclasses.length > 0 && (
        <Panel title={cls.subclassLabel}>
          {needsSubclass && <p className="mb-2 text-xs text-gold-ink">Você já pode escolher sua especialização.</p>}
          <select
            value={sheet.subclassId ?? ''} aria-label={cls.subclassLabel} className={selectCls}
            onChange={(e) => api.patchSheet({ subclassId: e.target.value || undefined }, { immediate: true })}
          >
            <option value="">Nenhum</option>
            {cls.subclasses.map((s) => <option key={s.id} value={s.id}>{s.name} (nível {s.level})</option>)}
          </select>
          {sub && (
            <p className="mt-2 text-[13px] text-ink-soft">
              {sub.description}{' '}
              <button
                type="button" onClick={() => openEntry({ kind: 'subclass', classId: cls.id, id: sub.id })} aria-haspopup="dialog"
                className="rounded text-indigo-ink outline-none hover:underline focus-visible:ring-2 focus-visible:ring-indigo/70"
              >Ver</button>
            </p>
          )}
        </Panel>
      )}

      {groups.map((g) => g.items.length > 0 && (
        <Panel key={g.title} title={g.title}>
          <div className="space-y-2">
            {g.items.map((it, i) => (
              <FeatureRow key={`${it.name}-${i}`} item={it} />
            ))}
          </div>
        </Panel>
      ))}

      <Panel title="Proficiências e idiomas">
        <dl className="space-y-2 text-[13px]">
          {([
            ['Armaduras', cls?.armorProficiencies],
            ['Armas', cls?.weaponProficiencies],
            ['Ferramentas', [...(cls?.toolProficiencies ?? []), ...sheet.toolProficiencies]],
            ['Idiomas', [...(race?.languages ?? []), ...sheet.languages]],
          ] as [string, string[] | undefined][]).map(([k, v]) => v && v.length > 0 && (
            <div key={k} className="flex gap-3"><dt className="w-24 shrink-0 text-ink-muted">{k}</dt><dd className="text-ink-body">{[...new Set(v)].join(', ')}</dd></div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}
