import {
  Axe, Music, Skull, Cross, Leaf, Sparkles, Sword, Crosshair, Eye, Wand2, Hand, Shield, User, type LucideIcon,
} from 'lucide-react';

export interface ClassStyle { icon: LucideIcon; color: string }

const STYLES: Record<string, ClassStyle> = {
  barbaro: { icon: Axe, color: '#f87171' },
  bardo: { icon: Music, color: '#f472b6' },
  bruxo: { icon: Skull, color: '#a78bfa' },
  clerigo: { icon: Cross, color: '#f5c451' },
  druida: { icon: Leaf, color: '#4ade80' },
  feiticeiro: { icon: Sparkles, color: '#fb923c' },
  guerreiro: { icon: Sword, color: '#94a3b8' },
  guardiao: { icon: Crosshair, color: '#34d399' },
  ladino: { icon: Eye, color: '#64748b' },
  mago: { icon: Wand2, color: '#6366f1' },
  monge: { icon: Hand, color: '#38bdf8' },
  paladino: { icon: Shield, color: '#fde047' },
};

export const classStyle = (classId?: string): ClassStyle => STYLES[classId ?? ''] ?? { icon: User, color: '#818cf8' };
