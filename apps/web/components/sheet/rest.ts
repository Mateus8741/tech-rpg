// Planejamento de descansos: calcula o que será recuperado antes de aplicar.
import { abilityModifier, formatModifier } from '@repo/rules';
import type { Character } from '@/lib/api';
import type { SheetData } from '@/lib/sheet';
import { longRestPatch } from './logic';

export interface RestPlan {
  lines: string[];
  columns: Partial<Character>;
  sheet: Partial<SheetData>;
}

/** Descanso curto: aplica os dados de vida já rolados (cada valor = resultado do dado). */
export function shortRestPlan(c: Character, sheet: SheetData, diceRolls: number[]): RestPlan {
  const conMod = abilityModifier(c.constitution);
  const heal = diceRolls.reduce((s, r) => s + Math.max(0, r + conMod), 0);
  const hp = Math.min(c.maxHitPoints, c.currentHitPoints + heal);
  const lines: string[] = [];
  if (diceRolls.length) {
    lines.push(`${diceRolls.length} dado(s) de vida (${diceRolls.join(', ')} ${formatModifier(conMod)} Con cada): +${hp - c.currentHitPoints} PV (${c.currentHitPoints} → ${hp})`);
  } else lines.push('Nenhum dado de vida gasto.');

  const resources = sheet.resources.map((r) => (r.recharge === 'short' && r.used > 0 ? { ...r, used: 0 } : r));
  const reset = sheet.resources.filter((r) => r.recharge === 'short' && r.used > 0).map((r) => r.name);
  if (reset.length) lines.push(`Recursos restaurados: ${reset.join(', ')}`);

  const patch: Partial<SheetData> = { hitDiceUsed: sheet.hitDiceUsed + diceRolls.length, resources };
  if (sheet.classId === 'bruxo' && sheet.spellSlotsUsed.some((n) => n > 0)) {
    patch.spellSlotsUsed = [];
    lines.push('Espaços de magia de pacto restaurados');
  }
  if (sheet.classId === 'mago') lines.push('Recuperação Arcana: restaure espaços manualmente na aba Magias (uma vez por dia).');
  return { lines, columns: { currentHitPoints: hp }, sheet: patch };
}

/** Descanso longo completo. */
export function longRestPlan(c: Character, sheet: SheetData): RestPlan {
  const p = longRestPatch(c, sheet);
  const regained = Math.max(1, Math.floor(c.level / 2));
  const lines = [
    `PV: ${c.currentHitPoints} → ${c.maxHitPoints}${c.temporaryHitPoints ? ' (PV temporários zerados)' : ''}`,
    `Dados de vida: +${Math.min(regained, sheet.hitDiceUsed)} recuperado(s)`,
    'Todos os espaços de magia restaurados',
  ];
  const reset = sheet.resources.filter((r) => r.recharge !== 'manual' && r.used > 0).map((r) => r.name);
  if (reset.length) lines.push(`Recursos restaurados: ${reset.join(', ')}`);
  if (sheet.concentratingOn) lines.push('Concentração encerrada');
  if (sheet.exhaustion > 0) lines.push(`Exaustão: ${sheet.exhaustion} → ${sheet.exhaustion - 1} (requer comida e água)`);
  if (sheet.deathSaves.successes || sheet.deathSaves.failures) lines.push('Salvaguardas contra morte zeradas');
  return { lines, columns: p.columns, sheet: p.sheet };
}
