'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { rollDice, formatModifier } from '@repo/rules';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- Painéis e rótulos ---------- */

export function Panel({ title, action, children, className }: {
  title?: string; action?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cn('bg-canvas border border-line rounded-xl p-4', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && <h3 className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const inputCls =
  'w-full rounded-md bg-base border border-line px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-[#6366f1]/60 focus:ring-1 focus:ring-[#6366f1]/30 transition-colors';

export const selectCls = cn(inputCls, 'appearance-none pr-7');

export function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn('block', className)}>
      <span className="block text-[10px] uppercase tracking-widest text-ink-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

export function GhostButton({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...p}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md border border-line bg-white/[0.02] px-2.5 py-1.5 text-xs text-ink-soft transition-colors hover:border-[#6366f1]/40 hover:bg-[#6366f1]/10 hover:text-indigo-ink-soft disabled:opacity-40 disabled:pointer-events-none',
        className,
      )}
    />
  );
}

/** Seção que abre/fecha com animação de altura. */
export function Collapsible({ title, subtitle, badge, children, defaultOpen = false }: {
  title: string; subtitle?: string; badge?: ReactNode; children: ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  return (
    <div className="rounded-lg border border-line bg-base/60">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate">{title}</p>
          {subtitle && <p className="text-[11px] text-ink-muted truncate">{subtitle}</p>}
        </div>
        {badge}
        <ChevronDown className={cn('h-4 w-4 text-ink-muted transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-3 py-3 text-[13px] leading-relaxed text-ink-soft whitespace-pre-line">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Rolagens ---------- */

export interface RollResult {
  id: number;
  label: string;
  rolls: number[];
  bonus: number;
  total: number;
  mode: 'normal' | 'adv' | 'dis';
  discarded?: number;
  crit?: 'max' | 'min';
}

type RollFn = (label: string, bonus: number, ev?: { shiftKey?: boolean; altKey?: boolean }) => RollResult | null;
const RollCtx = createContext<RollFn>(() => null);
export const useRoll = () => useContext(RollCtx);

export function RollProvider({ children }: { children: ReactNode }) {
  const [res, setRes] = useState<RollResult | null>(null);
  const idRef = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();

  const roll = useCallback<RollFn>((label, bonus, ev) => {
    const expr = `1d20${bonus >= 0 ? '+' : ''}${bonus}`;
    const a = rollDice(expr);
    if (!a) return null;
    const mode: RollResult['mode'] = ev?.shiftKey ? 'adv' : ev?.altKey ? 'dis' : 'normal';
    let chosen = a;
    let discarded: number | undefined;
    if (mode !== 'normal') {
      const b = rollDice(expr)!;
      const pickA = mode === 'adv' ? (a.rolls[0] ?? 0) >= (b.rolls[0] ?? 0) : (a.rolls[0] ?? 0) <= (b.rolls[0] ?? 0);
      chosen = pickA ? a : b;
      discarded = (pickA ? b : a).rolls[0];
    }
    const die = chosen.rolls[0];
    const r: RollResult = {
      id: ++idRef.current, label, rolls: chosen.rolls, bonus, total: chosen.total, mode, discarded,
      crit: die === 20 ? 'max' : die === 1 ? 'min' : undefined,
    };
    setRes(r);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRes(null), 4500);
    return r;
  }, []);

  return (
    <RollCtx.Provider value={roll}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {res
          ? `${res.label}${res.mode === 'adv' ? ', vantagem' : res.mode === 'dis' ? ', desvantagem' : ''}: d20 ${res.rolls[0] ?? 0}, total ${res.total}${res.crit === 'max' ? '. Sucesso crítico!' : res.crit === 'min' ? '. Falha crítica!' : ''}`
          : ''}
      </div>
      <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4">
        <AnimatePresence mode="wait">
          {res && (
            <motion.div
              key={res.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 380, damping: 26 }}
              className={cn(
                'pointer-events-auto flex items-center gap-4 rounded-2xl border bg-canvas/95 px-5 py-3 shadow-2xl shadow-black/60 backdrop-blur',
                res.crit === 'max' ? 'border-[#f5c451]/60' : res.crit === 'min' ? 'border-red-500/50' : 'border-[#6366f1]/40',
              )}
            >
              <motion.div
                initial={reduce ? false : { rotate: -200, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className={cn('grid h-12 w-12 place-items-center rounded-xl border',
                  res.crit === 'max' ? 'border-[#f5c451]/50 bg-[#f5c451]/10 text-gold-ink'
                    : res.crit === 'min' ? 'border-red-500/40 bg-red-500/10 text-red-400'
                      : 'border-[#6366f1]/40 bg-[#6366f1]/10 text-indigo-ink')}
              >
                <span className="text-xl font-bold tabular-nums">{(res.rolls[0] ?? 0)}</span>
              </motion.div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-ink-muted">
                  {res.label}{res.mode === 'adv' ? ' · vantagem' : res.mode === 'dis' ? ' · desvantagem' : ''}
                </p>
                <p className="text-sm text-ink-soft tabular-nums">
                  d20 ({(res.rolls[0] ?? 0)}){res.discarded !== undefined && <span className="text-ink-faint"> [{res.discarded}]</span>} {formatModifier(res.bonus)}
                </p>
                {res.crit && (
                  <p className={cn('text-[11px] font-semibold', res.crit === 'max' ? 'text-gold-ink' : 'text-red-400')}>
                    {res.crit === 'max' ? 'Sucesso crítico!' : 'Falha crítica!'}
                  </p>
                )}
              </div>
              <motion.p
                key={res.total}
                initial={reduce ? false : { scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold tabular-nums text-ink"
              >
                {res.total}
              </motion.p>
              <button type="button" onClick={() => setRes(null)} aria-label="Fechar resultado" className="rounded text-ink-faint outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo/70">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RollCtx.Provider>
  );
}

export function RollButton({ label, bonus, className, children }: {
  label: string; bonus: number; className?: string; children: ReactNode;
}) {
  const roll = useRoll();
  return (
    <button
      type="button"
      onClick={(e) => roll(label, bonus, e)}
      title={`Rolar ${label} (Shift: vantagem, Alt: desvantagem)`}
      className={cn('group text-left transition-colors', className)}
    >
      {children}
    </button>
  );
}
