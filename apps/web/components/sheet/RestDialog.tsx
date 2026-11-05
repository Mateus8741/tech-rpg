'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import { abilityModifier, formatModifier, getClass } from '@repo/rules';
import { BedDouble, Coffee, Dices, X } from 'lucide-react';
import { getSheet } from '@/lib/sheet';
import { cn } from '@/lib/utils';
import { useDiceRoller } from '@/components/dice';
import type { CharacterApi } from './useCharacter';
import { GhostButton } from './ui';
import { hitDiceLeft } from './logic';
import { longRestPlan, shortRestPlan } from './rest';

/** Modal de descanso curto/longo com resumo do que será recuperado antes de confirmar. */
export default function RestDialog({ api, open, onOpenChange }: {
  api: CharacterApi; open: boolean; onOpenChange: (o: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<'short' | 'long'>('short');
  const [rolls, setRolls] = useState<number[]>([]);
  const { roll } = useDiceRoller();
  const c = api.character!;
  const sheet = getSheet(c);
  const die = getClass(sheet.classId)?.hitDie ?? 8;
  const left = hitDiceLeft(c, sheet) - rolls.length;
  const conMod = abilityModifier(c.constitution);

  // Limpa as rolagens pendentes ao abrir/fechar
  useEffect(() => { if (!open) setRolls([]); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const plan = tab === 'short' ? shortRestPlan(c, sheet, rolls) : longRestPlan(c, sheet);

  const spend = () => {
    if (left <= 0) return;
    const r = roll(`1d${die}`);
    if (r) setRolls((x) => [...x, r.total]);
  };

  const confirm = () => {
    api.patchSheet(plan.sheet, { immediate: true, columns: plan.columns });
    toast.success(tab === 'short' ? 'Descanso curto concluído.' : 'Descanso longo concluído.');
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog" aria-modal="true" aria-label="Descanso"
            initial={reduce ? false : { y: 16, scale: 0.97 }} animate={{ y: 0, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-canvas p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Descanso</h2>
              <button type="button" aria-label="Fechar" onClick={() => onOpenChange(false)} className="text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg border border-line bg-base p-1">
              {([['short', 'Curto', Coffee], ['long', 'Longo', BedDouble]] as const).map(([k, label, Icon]) => (
                <button
                  key={k} type="button" onClick={() => setTab(k)} aria-pressed={tab === k}
                  className={cn('flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm transition-colors',
                    tab === k ? 'bg-[#6366f1]/20 text-indigo-ink-soft' : 'text-ink-muted hover:text-ink-soft')}
                >
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>

            {tab === 'short' ? (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-ink-soft">
                  Gaste dados de vida (d{die} {formatModifier(conMod)} Con). Disponíveis: <b className="text-ink">{left}</b>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <GhostButton onClick={spend} disabled={left <= 0}><Dices className="h-3.5 w-3.5" />Gastar e rolar d{die}</GhostButton>
                  {rolls.length > 0 && <GhostButton onClick={() => setRolls([])}>Desfazer</GhostButton>}
                </div>
              </div>
            ) : (
              <p className="mb-4 text-xs text-ink-soft">Descanso de 8 horas. A exaustão só diminui se houve comida e água.</p>
            )}

            <div className="mb-4 rounded-lg border border-line bg-base p-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Resumo</p>
              <ul className="space-y-1 text-[13px] text-ink-body">
                {plan.lines.map((l) => <li key={l}>• {l}</li>)}
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <GhostButton onClick={() => onOpenChange(false)}>Cancelar</GhostButton>
              <GhostButton onClick={confirm} className="border-[#6366f1]/40 bg-[#6366f1]/15 text-indigo-ink-soft">Confirmar descanso</GhostButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
