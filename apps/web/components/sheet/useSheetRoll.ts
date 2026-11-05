'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { formatModifier } from '@repo/rules';
import { useDiceRoller, type RollMode } from '@/components/dice';
import type { SheetData } from '@/lib/sheet';
import { disadvantageSources, type RollKind } from './effects';

type Ev = { shiftKey?: boolean; altKey?: boolean };

/**
 * Rolagem de d20 da ficha: usa o histórico do useDiceRoller (aparece no DiceTray),
 * Shift = vantagem, Alt = desvantagem, e aplica desvantagem automática de condições/exaustão.
 */
export function useSheetRoll(sheet: SheetData) {
  const { roll } = useDiceRoller();
  return useCallback((label: string, bonus: number, ev?: Ev, kind: RollKind = 'check') => {
    const sources = disadvantageSources(sheet, kind);
    const manual = ev?.shiftKey ? 1 : ev?.altKey ? -1 : 0;
    const net = manual + (sources.length ? -1 : 0);
    const mode: RollMode = net > 0 ? 'advantage' : net < 0 ? 'disadvantage' : 'normal';
    const r = roll(`1d20${bonus >= 0 ? '+' : '-'}${Math.abs(bonus)}`, mode);
    if (!r) return null;
    const die = r.rolls[0] ?? 0;
    const tag = mode === 'advantage' ? ' (vantagem)' : mode === 'disadvantage' ? ` (desvantagem${sources.length ? `: ${sources.join(', ')}` : ''})` : '';
    const crit = r.crit === 'max' ? ' - crítico!' : r.crit === 'min' ? ' - falha crítica!' : '';
    toast(`${label}${tag}: ${r.total}`, { description: `d20 (${die})${r.discarded ? ` [${r.discarded.rolls[0]}]` : ''} ${formatModifier(bonus)}${crit}` });
    return r;
  }, [roll, sheet]);
}
