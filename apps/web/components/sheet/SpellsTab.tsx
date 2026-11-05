'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ABILITIES, abilityModifier, getClass, getRace, getSpell, rollDice, spellsForClass, type Spell } from '@repo/rules';
import { BookPlus, Check, Dices, Minus, Plus, Shield, Sparkles, Star, X } from 'lucide-react';
import { derivedStats, getSheet, scoreOf } from '@/lib/sheet';
import { SpellRow } from '@/components/spells/SpellRow';
import { SpellDetail } from '@/components/spells/SpellDetail';
import { normalizeText } from '@/components/spells/spell-utils';
import { SpellFilterBar } from '@/components/spells/SpellFilterBar';
import { emptyFilters, matchesFilters, spellRollFor, type SpellFilterState } from '@/components/spells/filters';
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
  const [filters, setFilters] = useState<SpellFilterState>(emptyFilters);
  const [onlyPrepared, setOnlyPrepared] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [dmg, setDmg] = useState('');

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
        <p className="py-6 text-center text-sm text-ink-muted">
          {cls ? `${cls.name} não é conjurador.` : 'Vincule uma classe para ver as magias.'}
        </p>
      </Panel>
    );
  }

  const known = sheet.spellsKnown.map(getSpell).filter((s): s is Spell => !!s);
  const allLeveled = known.filter((s) => s.level > 0);
  const preparedCount = allLeveled.filter((s) => sheet.spellsPrepared.includes(s.id)).length;
  const passes = (s: Spell) =>
    matchesFilters(s, filters, sheet.spellsFavorite) && (!onlyPrepared || s.level === 0 || sheet.spellsPrepared.includes(s.id));
  const cantrips = known.filter((s) => s.level === 0 && passes(s));
  const leveled = allLeveled.filter(passes);
  const concSpell = sheet.concentratingOn ? getSpell(sheet.concentratingOn) : undefined;
  const conSave = d.saves.find((x) => x.key === 'con')?.bonus ?? 0;
  const race = getRace(sheet.raceId);
  const racialTraits = [...(race?.traits ?? []), ...(race?.subraces.find((s) => s.id === sheet.subraceId)?.traits ?? [])];
  const racialCantrips = racialTraits.filter((t) => /você (conhece|possui) (o|um) truque/i.test(t.description)).length;
  const classCantrips = sc.cantripsKnown?.[Math.min(c.level, 20) - 1];
  const cantripMax = classCantrips === undefined ? undefined : classCantrips + racialCantrips;

  const toggleSlot = (lvlIdx: number, total: number, spent: boolean) => {
    const used = [...sheet.spellSlotsUsed];
    while (used.length < slots.length) used.push(0);
    used[lvlIdx] = Math.min(total, Math.max(0, (used[lvlIdx] ?? 0) + (spent ? -1 : 1)));
    api.patchSheet({ spellSlotsUsed: used }, { immediate: true });
  };
  const slotsAfterCast = (lvl: number) => {
    const used = [...sheet.spellSlotsUsed];
    while (used.length < slots.length) used.push(0);
    used[lvl - 1] = (used[lvl - 1] ?? 0) + 1;
    return used;
  };

  const toggleFavorite = (id: string) =>
    api.patchSheet({ spellsFavorite: sheet.spellsFavorite.includes(id) ? sheet.spellsFavorite.filter((x) => x !== id) : [...sheet.spellsFavorite, id] });

  // Lança a magia: consome espaço (se não for truque), troca concentração e rola dano/cura.
  const cast = (s: Spell, lvl: number) => {
    const patch: { spellSlotsUsed?: number[]; concentratingOn?: string | null } = {};
    const msgs: string[] = [];
    if (s.level > 0) {
      patch.spellSlotsUsed = slotsAfterCast(lvl);
    }
    if (s.concentration) {
      if (sheet.concentratingOn && sheet.concentratingOn !== s.id) msgs.push(`Concentração em ${concSpell?.name ?? 'outra magia'} encerrada.`);
      patch.concentratingOn = s.id;
    }
    api.patchSheet(patch, { immediate: true });
    const r = spellRollFor(s, lvl);
    const res = r ? rollDice(r.expr) : null;
    if (r && res) msgs.push(`${s.name}: ${r.kind} ${r.expr} = ${res.total} (${res.rolls.join(' + ')}${res.bonus ? ` ${res.bonus > 0 ? '+' : ''}${res.bonus}` : ''})`);
    else msgs.push(`${s.name} lançada${s.level > 0 ? ` (${lvl}º círculo)` : ''}.`);
    setNote(msgs.join(' '));
  };
  const concentrationCheck = (ev: React.MouseEvent) => {
    const damage = Math.max(0, Number(dmg) || 0);
    const cd = Math.max(10, Math.floor(damage / 2));
    const r = roll('Concentração (CON)', conSave, ev);
    if (!r) return;
    const ok = r.total >= cd;
    setNote(`Teste de concentração CD ${cd}: ${r.total} — ${ok ? 'mantida.' : 'falhou, concentração encerrada.'}`);
    if (!ok) api.patchSheet({ concentratingOn: null }, { immediate: true });
  };

  const addSpell = (id: string) => api.patchSheet({ spellsKnown: [...sheet.spellsKnown, id] });
  const removeSpell = (id: string) =>
    api.patchSheet({ spellsKnown: sheet.spellsKnown.filter((x) => x !== id), spellsPrepared: sheet.spellsPrepared.filter((x) => x !== id), spellsFavorite: sheet.spellsFavorite.filter((x) => x !== id), concentratingOn: sheet.concentratingOn === id ? null : sheet.concentratingOn });
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
                  <button
                    type="button" aria-pressed={sheet.spellsFavorite.includes(s.id)} aria-label={`Favoritar ${s.name}`}
                    onClick={() => toggleFavorite(s.id)}
                    className={cn('rounded p-1', sheet.spellsFavorite.includes(s.id) ? 'text-gold-ink' : 'text-ink-faint hover:text-gold-ink')}
                  ><Star className={cn('h-4 w-4', sheet.spellsFavorite.includes(s.id) && 'fill-current')} /></button>
                  {s.level === 0 && (
                    <GhostButton onClick={() => cast(s, 0)}><Sparkles className="h-3 w-3" />Lançar</GhostButton>
                  )}
                  {showPrep && sc.preparesSpells && (
                    <button
                      type="button" aria-pressed={prepared} title={prepared ? 'Preparada' : 'Preparar'}
                      onClick={() => togglePrepared(s.id)}
                      className={cn('rounded-md border px-2 py-1 text-[11px] transition-colors', prepared ? 'border-[#6366f1] bg-[#6366f1]/20 text-indigo-ink-soft' : 'border-line text-ink-muted hover:border-[#6366f1]/40')}
                    >
                      {prepared ? <Check className="inline h-3 w-3" /> : null} Preparada
                    </button>
                  )}
                  <button type="button" aria-label={`Remover ${s.name}`} onClick={() => removeSpell(s.id)} className="rounded p-1 text-ink-faint hover:text-red-400"><X className="h-4 w-4" /></button>
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
                  <div className="mx-1 rounded-b-xl border border-t-0 border-line bg-base p-4">
                    <SpellDetail spell={s} />
                    {sheet.concentratingOn === s.id && (
                      <p className="mt-3 text-xs text-violet-ink">Em concentração.</p>
                    )}
                    {s.level > 0 && slots.length > 0 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                        <span className="text-xs text-ink-muted">Lançar com espaço (dano/cura rolados automaticamente):</span>
                        {slots.map((total, i) => {
                          const lvl = i + 1;
                          const left = total - (sheet.spellSlotsUsed[i] ?? 0);
                          if (lvl < s.level || total === 0) return null;
                          return (
                            <GhostButton key={lvl} disabled={left <= 0} onClick={() => cast(s, lvl)}>
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
            <p className="text-[10px] uppercase tracking-widest text-ink-muted">Atributo</p>
            <p className="mt-1 text-lg font-bold text-ink">{ABILITIES.find((a) => a.key === sc.ability)?.name}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-ink-muted">CD das magias</p>
            <p className="mt-1 text-2xl font-bold text-gold-ink tabular-nums">{dc}</p>
          </div>
          <button type="button" onClick={(e) => roll('Ataque com magia', atk, e)} className="group rounded-lg hover:bg-white/[0.03]">
            <p className="text-[10px] uppercase tracking-widest text-ink-muted">Bônus de ataque</p>
            <p className="mt-1 text-2xl font-bold text-ink tabular-nums group-hover:text-indigo-ink">{atk >= 0 ? `+${atk}` : atk}</p>
          </button>
        </div>
      </Panel>

      {(concSpell || note) && (
        <Panel>
          {concSpell && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/50 bg-[#8b5cf6]/15 px-2.5 py-1 text-xs text-violet-ink-soft">
                <Shield className="h-3 w-3" />Concentrando: {concSpell.name}
              </span>
              <GhostButton onClick={() => { api.patchSheet({ concentratingOn: null }, { immediate: true }); setNote(null); }}><X className="h-3 w-3" />Encerrar</GhostButton>
              <div className="ml-auto flex items-center gap-1.5">
                <input
                  type="number" min={0} inputMode="numeric" value={dmg} onChange={(e) => setDmg(e.target.value)}
                  placeholder="Dano" aria-label="Dano sofrido" className={cn(inputCls, 'w-20')}
                />
                <GhostButton onClick={concentrationCheck} title="Salvaguarda de Constituição (Shift: vantagem, Alt: desvantagem)">
                  <Dices className="h-3 w-3" />Teste de concentração
                </GhostButton>
              </div>
            </div>
          )}
          {note && (
            <div className={cn('flex items-start justify-between gap-2 text-sm text-ink', concSpell && 'mt-2')}>
              <p>{note}</p>
              <button type="button" aria-label="Fechar aviso" onClick={() => setNote(null)} className="text-ink-muted hover:text-ink"><X className="h-4 w-4" /></button>
            </div>
          )}
        </Panel>
      )}

      <Panel>
        <SpellFilterBar
          value={filters} onChange={setFilters} maxLevel={maxSpellLevel}
          extra={sc.preparesSpells ? (
            <button
              type="button" aria-pressed={onlyPrepared} onClick={() => setOnlyPrepared((v) => !v)}
              className={cn('rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors', onlyPrepared ? 'border-[#6366f1] bg-[#6366f1]/20 text-ink' : 'border-line bg-base text-ink-muted hover:text-ink')}
            >Preparadas</button>
          ) : null}
        />
      </Panel>

      {slots.length > 0 && (
        <Panel title={pact ? 'Espaços de magia de pacto' : 'Espaços de magia'} action={<span className="text-[10px] text-ink-faint">Clique para gastar/recuperar</span>}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {slots.map((total, i) => {
              if (!total) return null;
              const used = Math.min(total, sheet.spellSlotsUsed[i] ?? 0);
              return (
                <div key={i} className="rounded-lg border border-line bg-base p-2.5">
                  <p className="mb-2 text-[11px] text-ink-muted">{i + 1}º círculo <span className="tabular-nums text-violet-ink-soft">· {total - used}/{total} restantes</span></p>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: total }, (_, j) => {
                      const spent = j >= total - used;
                      return (
                        <motion.button
                          key={j} type="button" onClick={() => toggleSlot(i, total, spent)}
                          aria-label={`Espaço ${i + 1}º círculo ${spent ? 'gasto' : 'disponível'}`}
                          whileTap={reduce ? undefined : { scale: 0.8 }}
                          animate={{ opacity: spent ? 0.35 : 1, scale: spent ? 0.85 : 1 }}
                          className={cn('h-5 w-5 rounded-md border-2 rotate-45', spent ? 'border-ink-faint bg-transparent' : 'border-[#8b5cf6] bg-[#8b5cf6]/50 shadow-[0_0_8px_#8b5cf680]')}
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
        {cantrips.length ? renderList(cantrips, false) : <p className="text-sm text-ink-muted">Nenhum truque encontrado.</p>}
      </Panel>

      <Panel
        title={`Magias${limit !== null ? ` · preparadas ${preparedCount}/${limit}` : ''}`}
        action={<GhostButton onClick={() => setAdding((a) => !a)}><BookPlus className="h-3.5 w-3.5" />{adding ? 'Fechar' : 'Gerenciar magias'}</GhostButton>}
      >
        {leveled.length ? renderList(leveled, true) : <p className="text-sm text-ink-muted">Nenhuma magia encontrada.</p>}
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
        <input aria-label="Buscar magia" className={inputCls} placeholder="Buscar magia..." value={q} onChange={(e) => setQ(e.target.value)} />
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
                <GhostButton onClick={() => (has ? onRemove(s.id) : onAdd(s.id))} className={has ? 'border-[#6366f1]/50 text-indigo-ink-soft' : ''}>
                  {has ? <><Minus className="h-3 w-3" />Remover</> : <><Plus className="h-3 w-3" />Adicionar</>}
                </GhostButton>
              }
            />
          );
        })}
        {list.length === 0 && <p className="py-6 text-center text-sm text-ink-muted">Nenhuma magia encontrada.</p>}
      </div>
    </Panel>
  );
}
