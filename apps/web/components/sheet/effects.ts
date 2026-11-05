// Efeitos mecânicos automáticos de condições e exaustão (5e), usados em avisos e rolagens.
import type { SheetData } from '@/lib/sheet';

export const EXHAUSTION_EFFECTS = [
  'Sem exaustão',
  'Desvantagem em testes de habilidade',
  'Deslocamento reduzido à metade',
  'Desvantagem em ataques e salvaguardas',
  'PV máximos reduzidos à metade',
  'Deslocamento reduzido a 0',
  'Morte',
];

export type RollKind = 'check' | 'save' | 'none';

/** Fontes de desvantagem automática para um tipo de rolagem. */
export function disadvantageSources(sheet: SheetData, kind: RollKind): string[] {
  if (kind === 'none') return [];
  const out: string[] = [];
  const has = (id: string) => sheet.conditions.includes(id);
  if (kind === 'check') {
    if (sheet.exhaustion >= 1) out.push(`Exaustão ${sheet.exhaustion}`);
    if (has('envenenado')) out.push('Envenenado');
    if (has('amedrontado')) out.push('Amedrontado');
  } else if (sheet.exhaustion >= 3) {
    out.push(`Exaustão ${sheet.exhaustion}`);
  }
  return out;
}

/** Avisos curtos para o painel de condições. */
export function effectWarnings(sheet: SheetData): string[] {
  const w: string[] = [];
  const has = (id: string) => sheet.conditions.includes(id);
  const ex = sheet.exhaustion;
  if (ex >= 1) w.push('Desvantagem em testes de habilidade (exaustão).');
  if (ex >= 2) w.push('Deslocamento pela metade (exaustão).');
  if (ex >= 3) w.push('Desvantagem em ataques e salvaguardas (exaustão).');
  if (ex >= 4) w.push('PV máximos pela metade (exaustão).');
  if (ex >= 5) w.push('Deslocamento 0 (exaustão).');
  if (ex >= 6) w.push('Exaustão 6: morte.');
  if (has('envenenado')) w.push('Envenenado: desvantagem em ataques e testes de habilidade.');
  if (has('amedrontado')) w.push('Amedrontado: desvantagem em ataques e testes de habilidade com a fonte do medo à vista.');
  if (has('cego')) w.push('Cego: desvantagem em ataques; falha em testes que exigem visão.');
  if (has('caido')) w.push('Caído: desvantagem em ataques.');
  if (has('impedido')) w.push('Impedido: deslocamento 0, desvantagem em ataques e salvaguardas de Destreza.');
  if (['atordoado', 'paralisado', 'inconsciente', 'petrificado'].some(has)) w.push('Falha automática em salvaguardas de Força e Destreza.');
  if (['atordoado', 'paralisado', 'inconsciente', 'incapacitado'].some(has)) w.push('Incapacitado: sem ações ou reações.');
  if (has('agarrado')) w.push('Agarrado: deslocamento 0.');
  return w;
}
