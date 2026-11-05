'use client';

import { getBackground, getClass, getRace } from '@repo/rules';
import { getSheet } from '@/lib/sheet';
import type { CharacterApi } from './useCharacter';
import { Collapsible, Panel, selectCls } from './ui';

interface Item { name: string; description: string; tag?: string }

export default function FeaturesTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  const cls = getClass(sheet.classId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  const bg = getBackground(sheet.backgroundId);

  const groups: { title: string; items: Item[] }[] = [
    { title: `Raça${race ? ` · ${race.name}` : ''}`, items: [...(race?.traits ?? []), ...(subrace?.traits ?? [])] },
    {
      title: `Classe${cls ? ` · ${cls.name}` : ''}`,
      items: (cls?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, tag: `Nv ${f.level}` })),
    },
    {
      title: `Subclasse${sub ? ` · ${sub.name}` : ''}`,
      items: (sub?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, tag: `Nv ${f.level}` })),
    },
    { title: `Antecedente${bg ? ` · ${bg.name}` : ''}`, items: bg ? [bg.feature] : [] },
    {
      title: 'Outras características',
      items: [
        ...sheet.chosenFeatures.map((n) => ({ name: n, description: 'Escolha registrada na criação do personagem.' })),
        ...(Array.isArray(c.features) ? c.features : [])
          .filter((f) => f && typeof f === 'object' && 'name' in f)
          .map((f: { name: string; description?: string }) => ({ name: f.name, description: f.description ?? '' })),
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
          {sub && <p className="mt-2 text-[13px] text-ink-soft">{sub.description}</p>}
        </Panel>
      )}

      {groups.map((g) => g.items.length > 0 && (
        <Panel key={g.title} title={g.title}>
          <div className="space-y-2">
            {g.items.map((it, i) => (
              <Collapsible
                key={`${it.name}-${i}`} title={it.name}
                badge={it.tag ? <span className="rounded bg-[#6366f1]/10 px-1.5 py-0.5 text-[10px] text-indigo-ink">{it.tag}</span> : undefined}
              >
                {it.description || 'Sem descrição.'}
              </Collapsible>
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
