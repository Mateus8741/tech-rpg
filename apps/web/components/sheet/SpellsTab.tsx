'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ABILITIES, abilityModifier, getClass, getSpell, spellsForClass, type Spell } from '@repo/rules';
import { BookPlus, Check, Minus, Plus, Sparkles, X } from 'lucide-react';
import { derivedStats, getSheet, scoreOf } from '@/lib/sheet';
import { SpellRow } from '@/components/spells/SpellRow';
import { SpellDetail } from '@/components/spells/SpellDetail';
import { normalizeText } from '@/components/spells/spell-utils';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls, selectCls, useRoll } from './ui';
import { pactSlots, preparedLimit } from './logic';
import { cn } from '@/lib/utils';

export default function SpellsTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const cls = getClass(sheet.classId);
  const sc = cls?.spellcasting;
  const reduce = useReducedMotion();
  const roll = useRoll();
  const [open, setOpen] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const pact = sc?.kind === 'pact';
  const slots = pact ? pactSlots(c.level) : d.spell?.slots ?? [];
  const abilityMod = sc ? abilityModifier(scoreOf(c, sc.ability)) : 0;
  const dc = 8 + d.pb + abilityMod;
  const atk = d.pb + abilityMod;
  const limit = preparedLimit(cls, c.level, abilityMod);
  const maxSpellLevel = Math.max(1, slots.length);

  if (!sc) {
    return (
      <Panel title="Magias">
        <p className="py-6 text-center text-sm text-[#64748b]">
          {cls ? `${cls.name} não é conjurador.` : 'Vincule uma classe para ver as magias.'}
        </p>
      </Panel>
    );
  }

  const known = sheet.spellsKnown.map(getSpell).filter((s): s is Spell => !!s);
  const cantrips = known.filter((s) => s.level === 0);
  const leveled = known.filter((s) => s.level > 0);
  const preparedCount = leveled.filter((s) => sheet.spellsPrepared.includes(s.id)).length;
  const cantripMax = sc.cantripsKnown?.[Math.min(c.level, 20) - 1];

  const toggleSlot = (lvlIdx: number, total: number, spent: boolean) => {
    const used = [...sheet.spellSlotsUsed];
    while (used.length < slots.length) used.push(0);
    used[lvlIdx] = Math.min(total, Math.max(0, (used[lvlIdx] ?? 0) + (spent ? -1 : 1)));
    api.patchSheet({ spellSlotsUsed: used }, { immediate: true });
  };
  const castAt = (lvl: number) => {
    const used = [...sheet.spellSlotsUsed];
    while (used.length < slots.length) used.push(0);
    used[lvl - 1] = (used[lvl - 1] ?? 0) + 1;
    api.patchSheet({ spellSlotsUsed: used }, { immediate: true });
  };

  const addSpell = (id: string) => api.patchSheet({ spellsKnown: [...sheet.spellsKnown, id] });
  const removeSpell = (id: string) =>
    api.patchSheet({ spellsKnown: sheet.spellsKnown.filter((x) => x !== id), spellsPrepared: sheet.spellsPrepared.filter((x) => x !== id) });
  const togglePrepared = (id: string) =>
    api.patchSheet({ spellsPrepared: sheet.spellsPrepared.includes(id) ? sheet.spellsPrepared.filter((x) => x !== id) : [...sheet.spellsPrepared, id] });

  const renderList = (list: Spell[], showPrep: boolean) => (
    <div className="space-y-2">
      {list.map((s) => {
        const prepared = sheet.spellsPrepared.includes(s.id);
        const alwaysOn = !showPrep || !sc.preparesSpells;
        return (
          <div key={s.id}>
            <SpellRow
              spell={s}
              selected={open === s.id}
              onClick={() => setOpen(open === s.id ? null : s.id)}
              action={
                <div className="flex items-center gap-1.5">
                  {showPrep && sc.preparesSpells && (
                    <button
                      type="button" aria-pressed={prepared} title={prepared ? 'Preparada' : 'Preparar'}
                      onClick={() => togglePrepared(s.id)}
                      className={cn('rounded-md border px-2 py-1 text-[11px] transition-colors', prepared ? 'border-[#6366f1] bg-[#6366f1]/20 text-[#c7d2fe]' : 'border-[#1e2035] text-[#64748b] hover:border-[#6366f1]/40')}
                    >
                      {prepared ? <Check className="inline h-3 w-3" /> : null} Preparada
                    </button>
                  )}
                  <button type="button" aria-label={`Remover ${s.name}`} onClick={() => removeSpell(s.id)} className="rounded p-1 text-[#475569] hover:text-red-400"><X className="h-4 w-4" /></button>
                </div>
              }
              className={!alwaysOn && !prepared ? 'opacity-60' : undefined}
            />
            <AnimatePresence initial={false}>
              {open === s.id && (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mx-1 rounded-b-xl border border-t-0 border-[#1e2035] bg-[#0a0c14] p-4">
                    <SpellDetail spell={s} />
                    {s.level > 0 && slots.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#1e2035] pt-3">
                        <span className="text-xs text-[#64748b]">Conjurar usando espaço:</span>
                        {slots.map((total, i) => {
                          const lvl = i + 1;
                          const left = total - (sheet.spellSlotsUsed[i] ?? 0);
                          if (lvl < s.level || total === 0) return null;
                          return (
                            <GhostButton key={lvl} disabled={left <= 0} onClick={() => castAt(lvl)}>
                              <Sparkles className="h-3 w-3" />{lvl}º ({left})
                            </GhostButton>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      <Panel>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#64748b]">Atributo</p>
            <p className="mt-1 text-lg font-bold text-[#e2e8f0]">{ABILITIES.find((a) => a.key === sc.ability)?.name}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#64748b]">CD das magias</p>
            <p className="mt-1 text-2xl font-bold text-[#f5c451] tabular-nums">{dc}</p>
          </div>
          <button type="button" onClick={(e) => roll('Ataque com magia', atk, e)} className="group rounded-lg hover:bg-white/[0.03]">
            <p className="text-[10px] uppercase tracking-widest text-[#64748b]">Bônus de ataque</p>
            <p className="mt-1 text-2xl font-bold text-[#e2e8f0] tabular-nums group-hover:text-[#a5b4fc]">{atk >= 0 ? `+${atk}` : atk}</p>
          </button>
        </div>
      </Panel>

      {slots.length > 0 && (
        <Panel title={pact ? 'Espaços de magia de pacto' : 'Espaços de magia'} action={<span className="text-[10px] text-[#475569]">Clique para gastar/recuperar</span>}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {slots.map((total, i) => {
              if (!total) return null;
              const used = Math.min(total, sheet.spellSlotsUsed[i] ?? 0);
              return (
                <div key={i} className="rounded-lg border border-[#1e2035] bg-[#0a0c14] p-2.5">
                  <p className="mb-2 text-[11px] text-[#64748b]">{i + 1}º círculo <span className="tabular-nums">· {total - used}/{total}</span></p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: total }, (_, j) => {
                      const spent = j >= total - used;
                      return (
                        <motion.button
                          key={j} type="button" onClick={() => toggleSlot(i, total, spent)}
                          aria-label={`Espaço ${i + 1}º círculo ${spent ? 'gasto' : 'disponível'}`}
                          whileTap={reduce ? undefined : { scale: 0.8 }}
                          animate={{ opacity: spent ? 0.35 : 1, scale: spent ? 0.85 : 1 }}
                          className={cn('h-5 w-5 rounded-md border-2 rotate-45', spent ? 'border-[#475569] bg-transparent' : 'border-[#8b5cf6] bg-[#8b5cf6]/50 shadow-[0_0_8px_#8b5cf680]')}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Panel
        title={`Truques${cantripMax !== undefined ? ` (${cantrips.length}/${cantripMax})` : ''}`}
      >
        {cantrips.length ? renderList(cantrips, false) : <p className="text-sm text-[#64748b]">Nenhum truque conhecido.</p>}
      </Panel>

      <Panel
        title={`Magias${limit !== null ? ` · preparadas ${preparedCount}/${limit}` : ''}`}
        action={<GhostButton onClick={() => setAdding((a) => !a)}><BookPlus className="h-3.5 w-3.5" />{adding ? 'Fechar' : 'Gerenciar magias'}</GhostButton>}
      >
        {leveled.length ? renderList(leveled, true) : <p className="text-sm text-[#64748b]">Nenhuma magia adicionada.</p>}
      </Panel>

      <AnimatePresence initial={false}>
        {adding && (
          <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SpellPicker classId={sheet.classId} maxLevel={maxSpellLevel} knownIds={sheet.spellsKnown} onAdd={addSpell} onRemove={removeSpell} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpellPicker({ classId, maxLevel, knownIds, onAdd, onRemove }: {
  classId: string; maxLevel: number; knownIds: string[]; onAdd: (id: string) => void; onRemove: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const [lvl, setLvl] = useState('all');
  const all = useMemo(() => spellsForClass(classId, maxLevel), [classId, maxLevel]);
  const list = all.filter((s) => (lvl === 'all' || s.level === Number(lvl)) && normalizeText(s.name).includes(normalizeText(q)));

  return (
    <Panel title="Magias da classe disponíveis">
      <div className="mb-3 flex gap-2">
        <input className={inputCls} placeholder="Buscar magia..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={cn(selectCls, 'w-40')} value={lvl} onChange={(e) => setLvl(e.target.value)} aria-label="Nível">
          <option value="all">Todos os níveis</option>
          {Array.from({ length: maxLevel + 1 }, (_, i) => <option key={i} value={i}>{i === 0 ? 'Truques' : `${i}º círculo`}</option>)}
        </select>
      </div>
      <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
        {list.map((s) => {
          const has = knownIds.includes(s.id);
          return (
            <SpellRow
              key={s.id} spell={s}
              action={
                <GhostButton onClick={() => (has ? onRemove(s.id) : onAdd(s.id))} className={has ? 'border-[#6366f1]/50 text-[#c7d2fe]' : ''}>
                  {has ? <><Minus className="h-3 w-3" />Remover</> : <><Plus className="h-3 w-3" />Adicionar</>}
                </GhostButton>
              }
            />
          );
        })}
        {list.length === 0 && <p className="py-6 text-center text-sm text-[#64748b]">Nenhuma magia encontrada.</p>}
      </div>
    </Panel>
  );
}
