// Sugestões de recursos por classe (regras 5e do Livro do Jogador) a partir do nível.
import type { ResourceDef } from '@/lib/sheet';

export type ResourceSuggestion = Omit<ResourceDef, 'used'>;

const step = (level: number, table: [number, number][]) =>
  table.reduce((v, [lv, n]) => (level >= lv ? n : v), 0);

export function suggestResources(classId: string, level: number, mods: { cha: number }): ResourceSuggestion[] {
  const r = (id: string, name: string, max: number, recharge: ResourceDef['recharge']): ResourceSuggestion => ({ id, name, max, recharge });
  const out: ResourceSuggestion[] = [];
  switch (classId) {
    case 'barbaro':
      // 20º nível: usos ilimitados (representado por 99)
      out.push(r('furia', 'Fúria', level >= 20 ? 99 : step(level, [[1, 2], [3, 3], [6, 4], [12, 5], [17, 6]]), 'long'));
      break;
    case 'bardo':
      out.push(r('inspiracao-bardo', 'Inspiração de Bardo', Math.max(1, mods.cha), level >= 5 ? 'short' : 'long'));
      break;
    case 'clerigo':
      out.push(r('canalizar', 'Canalizar Divindade', step(level, [[2, 1], [6, 2], [18, 3]]), 'short'));
      if (level >= 10) out.push(r('intervencao', 'Intervenção Divina', 1, 'long'));
      break;
    case 'druida':
      if (level >= 2) out.push(r('forma-selvagem', 'Forma Selvagem', 2, 'short'));
      break;
    case 'feiticeiro':
      if (level >= 2) out.push(r('pontos-feiticaria', 'Pontos de Feitiçaria', level, 'long'));
      break;
    case 'guerreiro':
      out.push(r('retomar-folego', 'Retomar o Fôlego', 1, 'short'));
      if (level >= 2) out.push(r('surto-acao', 'Surto de Ação', level >= 17 ? 2 : 1, 'short'));
      if (level >= 9) out.push(r('indomavel', 'Indomável', step(level, [[9, 1], [13, 2], [17, 3]]), 'long'));
      break;
    case 'mago':
      out.push(r('recuperacao-arcana', 'Recuperação Arcana', 1, 'long'));
      break;
    case 'monge':
      if (level >= 2) out.push(r('ki', 'Pontos de Ki', level, 'short'));
      break;
    case 'paladino':
      out.push(r('maos-curativas', 'Cura pelas Mãos (PV)', level * 5, 'long'));
      out.push(r('sentido-divino', 'Sentido Divino', Math.max(1, 1 + mods.cha), 'long'));
      if (level >= 3) out.push(r('canalizar', 'Canalizar Divindade', 1, 'short'));
      break;
    default:
      break;
  }
  return out.filter((s) => s.max > 0);
}

export const RECHARGE_LABEL: Record<ResourceDef['recharge'], string> = {
  short: 'Descanso curto',
  long: 'Descanso longo',
  manual: 'Manual',
};

/** Bônus de dano da Fúria por nível de bárbaro. */
export const rageDamage = (level: number) => (level >= 16 ? 4 : level >= 9 ? 3 : 2);
