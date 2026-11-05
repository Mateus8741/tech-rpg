'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { BACKGROUNDS, CLASSES, RACES, SKILLS, getBackground, getClass } from '@repo/rules';
import { getSheet } from '@/lib/sheet';
import type { CharacterApi } from './useCharacter';
import { Field, GhostButton, selectCls } from './ui';

/** Aviso para personagens criados antes da ficha baseada em regras. */
export default function LegacyBanner({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const [raceId, setRaceId] = useState(sheet.raceId);
  const [subraceId, setSubraceId] = useState(sheet.subraceId ?? '');
  const [classId, setClassId] = useState(sheet.classId);
  const [bgId, setBgId] = useState(sheet.backgroundId);
  const race = RACES.find((r) => r.id === raceId);

  const link = () => {
    const cls = getClass(classId);
    const bg = getBackground(bgId);
    const sub = race?.subraces.find((s) => s.id === subraceId);
    const skills = new Set([...sheet.skillProficiencies, ...(bg?.skills ?? [])]);
    api.patchSheet(
      {
        raceId, subraceId: subraceId || undefined, classId, backgroundId: bgId,
        savingThrowProficiencies: cls ? cls.savingThrows : sheet.savingThrowProficiencies,
        skillProficiencies: SKILLS.map((s) => s.key).filter((k) => skills.has(k)),
      },
      {
        immediate: true,
        columns: {
          ...(race ? { race: sub ? `${race.name} (${sub.name})` : race.name } : {}),
          ...(cls ? { class: cls.name } : {}),
          ...(bg ? { background: bg.name } : {}),
        },
      },
    );
  };

  return (
    <div className="rounded-xl border border-[#f5c451]/30 bg-[#f5c451]/5 p-4">
      <div className="mb-3 flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" />
        <div>
          <p className="text-sm font-semibold text-gold-ink">Ficha antiga</p>
          <p className="text-xs text-ink-soft">
            Este personagem foi criado sem vínculo com as regras (raça: “{c.race || '—'}”, classe: “{c.class || '—'}”). Vincule raça, classe e antecedente para liberar características, magias e bônus automáticos.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Raça">
          <select className={selectCls} value={raceId} onChange={(e) => { setRaceId(e.target.value); setSubraceId(''); }}>
            <option value="">Selecione...</option>
            {RACES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </Field>
        <Field label="Sub-raça">
          <select className={selectCls} value={subraceId} disabled={!race?.subraces.length} onChange={(e) => setSubraceId(e.target.value)}>
            <option value="">—</option>
            {race?.subraces.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
        <Field label="Classe">
          <select className={selectCls} value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">Selecione...</option>
            {CLASSES.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </Field>
        <Field label="Antecedente">
          <select className={selectCls} value={bgId} onChange={(e) => setBgId(e.target.value)}>
            <option value="">Selecione...</option>
            {BACKGROUNDS.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </Field>
        <div className="flex items-end">
          <GhostButton className="w-full py-2" disabled={!raceId && !classId && !bgId} onClick={link}>Vincular às regras</GhostButton>
        </div>
      </div>
    </div>
  );
}
