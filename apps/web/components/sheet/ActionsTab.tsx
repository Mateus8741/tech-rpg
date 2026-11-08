'use client';

import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { Dices, RotateCcw, Search, Sparkles, Target } from 'lucide-react';
import { formatModifier, getSpell, type Spell } from '@repo/rules';
import { useEntry } from '@/components/entries';
import { useDiceRoller } from '@/components/dice';
import { parseQuery } from '@/components/spells/smart-search';
import { activeSpellcasting, derivedStats, getSheet } from '@/lib/sheet';
import { cn } from '@/lib/utils';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls } from './ui';
import { pactSlots } from './logic';
import { useSheetRoll } from './useSheetRoll';
import { accentText } from './class-style';
import GameCard from './GameCard';
import {
  SECTIONS, attackDisadvantage, buildActionCards, cardScore, lowestSlot, turnSlot,
  type ActionCard, type DamageRoll, type TurnSlot,
} from './action-cards';

const SLOT_LABEL: Record<TurnSlot, string> = { acao: 'Ação', bonus: 'Ação bônus', reacao: 'Reação' };
const SLOTS = Object.keys(SLOT_LABEL) as TurnSlot[];
const FRESH_TURN: Record<TurnSlot, boolean> = { acao: false, bonus: false, reacao: false };

type Ev = { shiftKey: boolean; altKey: boolean };

export default function ActionsTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const sc = activeSpellcasting(sheet, c.level);
  const reduce = useReducedMotion();
  const openEntry = useEntry();
  const rollD20 = useSheetRoll(sheet);
  const { roll: rollExpr } = useDiceRoller();
  const [turn, setTurn] = useState(FRESH_TURN);
  const [query, setQuery] = useState('');

  const cards = useMemo(() => buildActionCards(c), [c]);
  const pq = parseQuery(query);
  // Com palavras na busca, as cartas mais relevantes vêm primeiro dentro de cada seção.
  const visible = cards
    .map((card) => ({ card, score: cardScore(card, pq) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => (pq.terms.length ? b.score - a.score : 0))
    .map((x) => x.card);
  const slots = sc?.kind === 'pact' ? pactSlots(c.level) : d.spell?.slots ?? [];
  const concSpell = sheet.concentratingOn ? getSpell(sheet.concentratingOn) : undefined;

  const markUsed = (card: ActionCard) => {
    const slot = turnSlot(card);
    if (slot) setTurn((t) => ({ ...t, [slot]: true }));
  };

  const rollAttack = (card: ActionCard, ev: Ev) => {
    if (!card.attack) return;
    const sources = attackDisadvantage(sheet);
    // Shift (vantagem) e uma fonte de desvantagem se anulam.
    const dis = ev.altKey || sources.length > 0;
    const label = sources.length ? `${card.attack.label} [${sources.join(', ')}]` : card.attack.label;
    rollD20(label, card.attack.bonus, { shiftKey: ev.shiftKey && !dis, altKey: dis && !ev.shiftKey }, 'none');
    markUsed(card);
  };

  const rollDamage = (card: ActionCard, dmg: DamageRoll) => {
    const r = rollExpr(dmg.expr);
    if (r) toast(`${card.name} · ${dmg.label}: ${r.total}`, { description: dmg.expr });
  };

  /** Conjura: gasta o menor espaço livre e troca a concentração, como na aba Magias. */
  const cast = (card: ActionCard, s: Spell) => {
    const patch: { spellSlotsUsed?: number[]; concentratingOn?: string | null } = {};
    let circle = '';
    if (s.level > 0) {
      const lvl = lowestSlot(s.level, slots, sheet.spellSlotsUsed);
      if (lvl === null) return;
      const used = [...sheet.spellSlotsUsed];
      while (used.length < slots.length) used.push(0);
      used[lvl - 1] = (used[lvl - 1] ?? 0) + 1;
      patch.spellSlotsUsed = used;
      circle = ` (${lvl}º círculo)`;
    }
    const swapped = s.concentration && sheet.concentratingOn && sheet.concentratingOn !== s.id;
    if (s.concentration) patch.concentratingOn = s.id;
    if (Object.keys(patch).length) api.patchSheet(patch, { immediate: true });
    markUsed(card);
    toast(`${s.name} conjurada${circle}.`, swapped ? { description: `Concentração em ${concSpell?.name ?? 'outra magia'} encerrada.` } : undefined);
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Turno"
        action={<GhostButton onClick={() => setTurn(FRESH_TURN)}><RotateCcw className="h-3.5 w-3.5" />Novo turno</GhostButton>}
      >
        <div className="grid grid-cols-3 gap-2">
          {SLOTS.map((slot) => {
            const color = SECTIONS.find((s) => s.id === slot)!.color;
            return (
              <motion.button
                key={slot} type="button" aria-pressed={turn[slot]}
                onClick={() => setTurn((t) => ({ ...t, [slot]: !t[slot] }))}
                whileTap={reduce ? undefined : { scale: 0.96 }}
                style={turn[slot] ? undefined : { borderColor: `${color}80`, background: `${color}1a`, color: accentText(color) }}
                className={cn(
                  'rounded-lg border px-2 py-2.5 text-xs font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo/70 sm:text-sm',
                  turn[slot] && 'border-line bg-base text-ink-faint line-through',
                )}
              >
                {SLOT_LABEL[slot]}
                <span className="block text-[10px] font-normal no-underline opacity-80">{turn[slot] ? 'usada' : 'disponível'}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" aria-hidden />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Filtrar cartas"
            placeholder="Filtrar: fogo, cura bônus, controle, reação..." className={cn(inputCls, 'pl-8')}
          />
        </div>
      </Panel>

      {visible.length === 0 && <p className="py-8 text-center text-sm text-ink-muted">Nenhuma carta encontrada.</p>}

      {SECTIONS.map((section) => {
        const list = visible.filter((card) => card.section === section.id);
        if (list.length === 0) return null;
        return (
          <section key={section.id} aria-label={section.title}>
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: accentText(section.color) }}>
              <span className="h-2 w-2 rounded-full" style={{ background: section.color }} aria-hidden />
              {section.title}
              <span className="font-normal text-ink-faint">{list.length}</span>
            </h3>
            <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {list.map((card) => {
                const slot = turnSlot(card);
                const spell = card.spell;
                const noSlot = !!spell && spell.level > 0 && lowestSlot(spell.level, slots, sheet.spellSlotsUsed) === null;
                return (
                  <GameCard
                    key={card.key} card={card} color={section.color} reduce={reduce}
                    used={!!slot && turn[slot]} onOpen={() => openEntry(card.entry)}
                  >
                      {card.attack && (
                        <GhostButton onClick={(e) => rollAttack(card, e)} title="Shift: vantagem, Alt: desvantagem">
                          <Target className="h-3 w-3" />Acerto {formatModifier(card.attack.bonus)}
                        </GhostButton>
                      )}
                      {card.damage.map((dmg) => (
                        <GhostButton key={dmg.label} onClick={() => rollDamage(card, dmg)}>
                          <Dices className="h-3 w-3" />{dmg.label} {dmg.expr}
                        </GhostButton>
                      ))}
                      {spell ? (
                        <GhostButton disabled={noSlot} title={noSlot ? 'Sem espaços de magia' : undefined} onClick={() => cast(card, spell)}>
                          <Sparkles className="h-3 w-3" />{noSlot ? 'Sem espaço' : 'Conjurar'}
                        </GhostButton>
                      ) : !card.attack && slot && (
                        <GhostButton onClick={() => markUsed(card)}>Usar</GhostButton>
                      )}
                  </GameCard>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
