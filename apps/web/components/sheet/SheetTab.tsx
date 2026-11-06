'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ABILITIES, XP_BY_LEVEL, abilityModifier, formatModifier, getBackground, getClass, getRace, levelForXp,
  type AbilityKey,
} from '@repo/rules';
import { ArrowUpCircle, BedDouble, Coffee, Heart, Minus, Plus, Shield, Skull, Sparkles, Star, Footprints, Zap, Eye, Dices } from 'lucide-react';
import { useEntry, type EntryRef } from '@/components/entries';
import { derivedStats, getSheet, SCORE_FIELDS, scoreOf } from '@/lib/sheet';
import { cn } from '@/lib/utils';
import type { CharacterApi } from './useCharacter';
import { Panel, GhostButton, inputCls } from './ui';
import { applyDamage, applyHealing, canLevelUp, hitDiceLeft } from './logic';
import { useDiceRoller } from '@/components/dice';
import { useSheetRoll } from './useSheetRoll';
import type { RollKind } from './effects';
import LevelUpDialog from './LevelUpDialog';
import RestDialog from './RestDialog';
import ResourcesPanel from './ResourcesPanel';
import ConditionsPanel from './ConditionsPanel';
import { classStyle, accentText } from './class-style';

type Props = { api: CharacterApi };

/** Botão de rolagem de d20: usa o histórico do useDiceRoller e a desvantagem automática de condições. */
function RollButton({ api, label, bonus, kind = 'check', className, children }: {
  api: CharacterApi; label: string; bonus: number; kind?: RollKind; className?: string; children: React.ReactNode;
}) {
  const roll = useSheetRoll(getSheet(api.character!));
  return (
    <button
      type="button"
      onClick={(e) => roll(label, bonus, e, kind)}
      title={`Rolar ${label} (Shift: vantagem, Alt: desvantagem)`}
      className={cn('group text-left transition-colors', className)}
    >
      {children}
    </button>
  );
}

/** Nome tocável que abre o painel de detalhes. */
function EntryLink({ entry, children }: { entry: EntryRef; children: React.ReactNode }) {
  const openEntry = useEntry();
  return (
    <button
      type="button" onClick={() => openEntry(entry)} aria-haspopup="dialog"
      className="rounded underline decoration-dotted decoration-ink-faint underline-offset-2 outline-none transition-colors hover:text-indigo-ink focus-visible:ring-2 focus-visible:ring-indigo/70"
    >
      {children}
    </button>
  );
}

export default function SheetTab({ api }: Props) {
  const c = api.character!;
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  const cls = getClass(sheet.classId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  const bg = getBackground(sheet.backgroundId);
  const style = classStyle(sheet.classId);

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <Panel className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl" style={{ background: style.color }} />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border" style={{ borderColor: `${style.color}55`, background: `${style.color}1a`, color: accentText(style.color) }}>
            <style.icon className="h-7 w-7" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-ink">{c.name}</h2>
            <p className="text-sm text-ink-soft">
              {race ? (
                <>
                  <EntryLink entry={{ kind: 'race', id: race.id }}>{race.name}</EntryLink>
                  {subrace && <> (<EntryLink entry={{ kind: 'subrace', raceId: race.id, id: subrace.id }}>{subrace.name}</EntryLink>)</>}
                </>
              ) : c.race || '—'} ·{' '}
              {cls ? (
                <>
                  <EntryLink entry={{ kind: 'class', id: cls.id }}>{cls.name}</EntryLink>
                  {sub && <> (<EntryLink entry={{ kind: 'subclass', classId: cls.id, id: sub.id }}>{sub.name}</EntryLink>)</>}
                </>
              ) : c.class || '—'}
              {(bg?.name || c.background) && (
                <span className="text-ink-muted"> · {bg ? <EntryLink entry={{ kind: 'background', id: bg.id }}>{bg.name}</EntryLink> : c.background}</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-ink-muted">Nível</p>
            <p className="text-3xl font-bold leading-none text-gold-ink tabular-nums">{c.level}</p>
          </div>
        </div>
        <XpBar api={api} />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Abilities api={api} />
          <Panel title="Estatísticas">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              <Stat icon={Shield} label="CA">
                <input
                  type="number" value={c.armorClass} aria-label="Classe de Armadura"
                  onChange={(e) => api.patch({ armorClass: Number(e.target.value) || 0 })}
                  className="w-full bg-transparent text-center text-xl font-bold text-ink tabular-nums focus:outline-none"
                />
              </Stat>
              <RollButton api={api} label="Iniciativa" bonus={d.initiative}>
                <Stat icon={Zap} label="Iniciativa" interactive>
                  <span className="text-xl font-bold text-ink tabular-nums">{formatModifier(d.initiative)}</span>
                </Stat>
              </RollButton>
              <Stat icon={Footprints} label="Deslocamento"><span className="text-xl font-bold text-ink">{d.speed} m</span></Stat>
              <Stat icon={Star} label="Proficiência"><span className="text-xl font-bold text-ink">{formatModifier(d.pb)}</span></Stat>
              <Stat icon={Eye} label="Percepção passiva"><span className="text-xl font-bold text-ink">{d.passivePerception}</span></Stat>
            </div>
          </Panel>
          <HitPoints api={api} />
          <RestPanel api={api} />
          <InspirationDeath api={api} />
        </div>
        <div className="space-y-4">
          <ConditionsPanel api={api} />
          <ResourcesPanel api={api} />
          <SavesSkills api={api} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, children, interactive }: {
  icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode; interactive?: boolean;
}) {
  return (
    <div className={cn('flex h-full flex-col items-center justify-center gap-0.5 rounded-lg border border-line bg-base px-2 py-2.5', interactive && 'hover:border-[#6366f1]/50')}>
      <Icon className="h-3.5 w-3.5 text-indigo-ink" />
      {children}
      <span className="text-[9px] uppercase tracking-wide text-ink-muted text-center">{label}</span>
    </div>
  );
}

/* ---------- XP ---------- */

function XpBar({ api }: Props) {
  const c = api.character!;
  const reduce = useReducedMotion();
  const lvl = Math.min(c.level, 20);
  const from = XP_BY_LEVEL[lvl - 1] ?? 0;
  const to = XP_BY_LEVEL[lvl] ?? from;
  const pct = lvl >= 20 ? 100 : Math.min(100, Math.max(0, ((c.experience - from) / Math.max(1, to - from)) * 100));
  const ready = canLevelUp(c);
  const [lvOpen, setLvOpen] = useState(false);

  return (
    <div className="relative mt-4">
      <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-ink-muted">
        <label className="flex items-center gap-1.5">
          XP
          <input
            type="number" min={0} value={c.experience} aria-label="Pontos de experiência"
            onChange={(e) => api.patch({ experience: Math.max(0, Number(e.target.value) || 0) })}
            className="w-20 rounded border border-line bg-base px-1.5 py-0.5 text-right text-xs text-ink tabular-nums focus:border-[#6366f1]/60 focus:outline-none"
          />
        </label>
        <span className="tabular-nums">{lvl >= 20 ? 'Nível máximo' : `próximo nível: ${to.toLocaleString('pt-BR')} XP`}</span>
        {ready && (
          <motion.button
            type="button"
            initial={reduce ? false : { scale: 0.8, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { scale: [1, 1.06, 1], opacity: 1 }}
            transition={reduce ? undefined : { duration: 1.6, repeat: Infinity }}
            onClick={() => setLvOpen(true)}
            className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#f5c451] to-[#fb923c] px-3 py-1 text-xs font-semibold text-[#0a0c14]"
          >
            <ArrowUpCircle className="h-3.5 w-3.5" /> Subir de nível ({levelForXp(c.experience) > c.level ? c.level + 1 : c.level})
          </motion.button>
        )}
      </div>
      <LevelUpDialog api={api} open={lvOpen} onOpenChange={setLvOpen} />
      <div className="h-2 overflow-hidden rounded-full bg-surface-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#f5c451]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduce ? 0 : 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ---------- Atributos ---------- */

function Abilities({ api }: Props) {
  const c = api.character!;
  const roll = useSheetRoll(getSheet(c));
  const [editing, setEditing] = useState(false);
  const reduce = useReducedMotion();

  const setScore = (k: AbilityKey, v: number) => {
    const val = Math.min(30, Math.max(1, v || 1));
    const field = SCORE_FIELDS[k];
    api.patch({ [field]: val, [`${field}Modifier`]: abilityModifier(val) } as never);
  };

  return (
    <Panel
      title="Atributos"
      action={<GhostButton onClick={() => setEditing((e) => !e)}>{editing ? 'Concluir' : 'Editar valores'}</GhostButton>}
    >
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
        {ABILITIES.map((a, i) => {
          const score = scoreOf(c, a.key);
          const mod = abilityModifier(score);
          return (
            <motion.div
              key={a.key}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : i * 0.04 }}
              className="rounded-xl border border-line bg-base p-2 text-center"
            >
              <p className="text-[10px] font-semibold tracking-widest text-ink-muted">{a.abbr}</p>
              <button
                type="button"
                onClick={(e) => roll(`Teste de ${a.name}`, mod, e, 'check')}
                title={`Rolar teste de ${a.name}`}
                className="my-1 block w-full text-2xl font-bold text-ink tabular-nums transition-colors hover:text-indigo-ink"
              >
                {formatModifier(mod)}
              </button>
              {editing ? (
                <input
                  type="number" min={1} max={30} value={score} aria-label={a.name}
                  onChange={(e) => setScore(a.key, Number(e.target.value))}
                  className={cn(inputCls, 'px-1 py-0.5 text-center text-xs')}
                />
              ) : (
                <span className="inline-block rounded-full border border-line px-2 text-xs text-ink-soft tabular-nums">{score}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ---------- PV ---------- */

function HitPoints({ api }: Props) {
  const c = api.character!;
  const reduce = useReducedMotion();
  const [amount, setAmount] = useState(1);
  const pct = c.maxHitPoints > 0 ? Math.min(100, (c.currentHitPoints / c.maxHitPoints) * 100) : 0;
  const color = pct > 50 ? '#22c55e' : pct > 25 ? '#f5c451' : '#ef4444';
  const imm = { immediate: true };

  return (
    <Panel title="Pontos de vida" action={<Heart className="h-4 w-4 text-red-400" />}>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold tabular-nums text-ink">
          {c.currentHitPoints}
          <span className="text-lg text-ink-muted"> / </span>
          <input
            type="number" min={1} value={c.maxHitPoints} aria-label="PV máximos"
            onChange={(e) => api.patch({ maxHitPoints: Math.max(1, Number(e.target.value) || 1) })}
            className="w-16 border-b border-dashed border-line-strong bg-transparent text-lg text-ink-soft focus:border-[#6366f1] focus:outline-none"
          />
        </p>
        {c.temporaryHitPoints > 0 && <span className="rounded-full bg-[#38bdf8]/10 px-2 py-0.5 text-xs text-[#38bdf8]">+{c.temporaryHitPoints} temp.</span>}
      </div>
      <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-surface-3">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${pct}%`, backgroundColor: color }}
          transition={{ duration: reduce ? 0 : 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <GhostButton aria-label="Perder 1 PV" onClick={() => api.patch(applyDamage(c, 1), imm)}><Minus className="h-3.5 w-3.5" /></GhostButton>
        <GhostButton aria-label="Recuperar 1 PV" onClick={() => api.patch(applyHealing(c, 1), imm)}><Plus className="h-3.5 w-3.5" /></GhostButton>
        <input
          type="number" min={1} value={amount} aria-label="Valor"
          onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
          className={cn(inputCls, 'w-16 text-center')}
        />
        <GhostButton className="border-red-500/30 text-red-300 hover:border-red-500/60 hover:bg-red-500/10" onClick={() => api.patch(applyDamage(c, amount), imm)}>Dano</GhostButton>
        <GhostButton className="border-green-500/30 text-green-300 hover:border-green-500/60 hover:bg-green-500/10" onClick={() => api.patch(applyHealing(c, amount), imm)}>Cura</GhostButton>
        <label className="ml-auto flex items-center gap-1.5 text-[11px] text-ink-muted">
          PV temp.
          <input
            type="number" min={0} value={c.temporaryHitPoints} aria-label="PV temporários"
            onChange={(e) => api.patch({ temporaryHitPoints: Math.max(0, Number(e.target.value) || 0) }, imm)}
            className={cn(inputCls, 'w-16 text-center')}
          />
        </label>
      </div>
    </Panel>
  );
}

/* ---------- Descansos ---------- */

function RestPanel({ api }: Props) {
  const c = api.character!;
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const left = hitDiceLeft(c, sheet);
  const [open, setOpen] = useState(false);

  return (
    <Panel title="Descanso e dados de vida">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-2xl font-bold tabular-nums text-ink">
            {left}<span className="text-sm text-ink-muted"> / {c.level} d{d.hitDie}</span>
          </p>
          <p className="text-[11px] text-ink-muted">dados de vida disponíveis</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <GhostButton onClick={() => setOpen(true)} className="border-[#6366f1]/40 text-indigo-ink-soft"><Coffee className="h-3.5 w-3.5" /><BedDouble className="h-3.5 w-3.5" />Descansar</GhostButton>
        </div>
      </div>
      <RestDialog api={api} open={open} onOpenChange={setOpen} />
    </Panel>
  );
}

/* ---------- Inspiração e mortes ---------- */

function InspirationDeath({ api }: Props) {
  const c = api.character!;
  const sheet = getSheet(c);
  const reduce = useReducedMotion();
  const { successes, failures } = sheet.deathSaves;
  const imm = { immediate: true };

  const setDS = (kind: 'successes' | 'failures', i: number) => {
    const cur = sheet.deathSaves[kind];
    api.patchSheet({ deathSaves: { ...sheet.deathSaves, [kind]: cur === i + 1 ? i : i + 1 } }, imm);
  };

  const { roll: logRoll } = useDiceRoller();
  const rollDeath = () => {
    const r = logRoll('1d20');
    if (!r) return;
    const v = r.total;
    if (v === 20) { api.patchSheet({ deathSaves: { successes: 0, failures: 0 } }, { ...imm, columns: { currentHitPoints: 1 } }); toast.success('Natural 20! Você recupera 1 PV.'); }
    else if (v === 1) { api.patchSheet({ deathSaves: { ...sheet.deathSaves, failures: Math.min(3, failures + 2) } }, imm); toast.error('Natural 1: duas falhas.'); }
    else if (v >= 10) { api.patchSheet({ deathSaves: { ...sheet.deathSaves, successes: Math.min(3, successes + 1) } }, imm); toast.success(`${v}: sucesso.`); }
    else { api.patchSheet({ deathSaves: { ...sheet.deathSaves, failures: Math.min(3, failures + 1) } }, imm); toast.error(`${v}: falha.`); }
  };

  const pips = (kind: 'successes' | 'failures', n: number, good: boolean) => (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <motion.button
          key={i} type="button" onClick={() => setDS(kind, i)}
          aria-label={`${good ? 'Sucesso' : 'Falha'} ${i + 1}`} aria-pressed={i < n}
          whileTap={reduce ? undefined : { scale: 0.8 }}
          animate={{ scale: i < n && !reduce ? [1, 1.3, 1] : 1 }}
          className={cn('grid h-6 w-6 place-items-center rounded-full border-2 transition-colors',
            i < n ? (good ? 'border-green-400 bg-green-400/30 text-green-300' : 'border-red-400 bg-red-400/30 text-red-300') : 'border-line-strong')}
        >
          {i < n && !good && <Skull className="h-3 w-3" />}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel title="Inspiração">
        <button
          type="button" aria-pressed={sheet.inspiration}
          onClick={() => api.patchSheet({ inspiration: !sheet.inspiration }, imm)}
          className={cn('flex w-full items-center gap-3 rounded-lg border px-3 py-3 transition-colors',
            sheet.inspiration ? 'border-[#f5c451]/60 bg-[#f5c451]/10 text-gold-ink' : 'border-line text-ink-muted hover:border-line-strong')}
        >
          <motion.span animate={{ rotate: sheet.inspiration && !reduce ? 360 : 0 }} transition={{ duration: 0.6 }}>
            <Sparkles className="h-5 w-5" />
          </motion.span>
          <span className="text-sm font-medium">{sheet.inspiration ? 'Inspirado' : 'Sem inspiração'}</span>
        </button>
      </Panel>
      <Panel
        title="Salvaguardas contra morte"
        action={<GhostButton onClick={rollDeath} className="py-0.5"><Dices className="h-3.5 w-3.5" />Rolar</GhostButton>}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs text-ink-soft">Sucessos</span>{pips('successes', successes, true)}</div>
          <div className="flex items-center justify-between"><span className="text-xs text-ink-soft">Falhas</span>{pips('failures', failures, false)}</div>
          {c.currentHitPoints > 0 && <p className="pt-1 text-[10px] text-ink-faint">Usadas apenas quando você está com 0 PV.</p>}
        </div>
      </Panel>
    </div>
  );
}

/* ---------- Salvaguardas e perícias ---------- */

function SavesSkills({ api }: Props) {
  const c = api.character!;
  const sheet = getSheet(c);
  const d = derivedStats(c);

  const toggleSave = (k: AbilityKey) => {
    const has = sheet.savingThrowProficiencies.includes(k);
    api.patchSheet({ savingThrowProficiencies: has ? sheet.savingThrowProficiencies.filter((x) => x !== k) : [...sheet.savingThrowProficiencies, k] });
  };
  // Clique no marcador: nenhum -> proficiente -> especialização -> nenhum
  const cycleSkill = (k: (typeof d.skills)[number]) => {
    const prof = sheet.skillProficiencies.filter((x) => x !== k.key);
    const exp = sheet.skillExpertise.filter((x) => x !== k.key);
    if (!k.proficient) api.patchSheet({ skillProficiencies: [...prof, k.key] });
    else if (!k.expertise) api.patchSheet({ skillProficiencies: [...prof, k.key], skillExpertise: [...exp, k.key] });
    else api.patchSheet({ skillProficiencies: prof, skillExpertise: exp });
  };

  const abbr = (key: AbilityKey) => ABILITIES.find((a) => a.key === key)!.abbr;

  return (
    <>
      <Panel title="Salvaguardas">
        <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {d.saves.map((s) => (
            <li key={s.key} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-white/[0.03]">
              <button
                type="button" onClick={() => toggleSave(s.key)} aria-label={`Proficiência em salvaguarda de ${s.name}`} aria-pressed={s.proficient}
                className={cn('h-3.5 w-3.5 shrink-0 rounded-full border transition-colors', s.proficient ? 'border-[#6366f1] bg-[#6366f1]' : 'border-ink-faint')}
              />
              <RollButton api={api} kind="save" label={`Salvaguarda de ${s.name}`} bonus={s.bonus} className="flex flex-1 items-center gap-2">
                <span className="w-8 text-right text-sm font-semibold tabular-nums text-ink">{formatModifier(s.bonus)}</span>
                <span className="text-[13px] text-ink-soft group-hover:text-indigo-ink-soft">{s.name}</span>
              </RollButton>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Perícias" action={<span className="text-[10px] text-ink-faint">Marcador: proficiência › especialização</span>}>
        <ul className="grid grid-cols-1 gap-0.5">
          {d.skills.map((s) => (
            <li key={s.key} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-white/[0.03]">
              <button
                type="button" onClick={() => cycleSkill(s)} aria-label={`Proficiência em ${s.name}`}
                className={cn('relative h-3.5 w-3.5 shrink-0 rounded-full border transition-colors',
                  s.expertise ? 'border-[#f5c451] bg-[#f5c451]' : s.proficient ? 'border-[#6366f1] bg-[#6366f1]' : 'border-ink-faint')}
              >
                {s.expertise && <span className="absolute inset-[3px] rounded-full bg-base" />}
              </button>
              <RollButton api={api} label={s.name} bonus={s.bonus} className="flex flex-1 items-center gap-2">
                <span className="w-8 text-right text-sm font-semibold tabular-nums text-ink">{formatModifier(s.bonus)}</span>
                <span className="flex-1 text-[13px] text-ink-soft group-hover:text-indigo-ink-soft">{s.name}</span>
                <span className="text-[10px] text-ink-faint">{abbr(s.ability)}</span>
              </RollButton>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
