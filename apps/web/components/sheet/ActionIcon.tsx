// Ícone de cada carta de ação, no estilo de "botão de habilidade" dos RPGs táticos:
// moldura na cor do custo, fundo escuro com brilho e silhueta com gradiente.
import { useId } from 'react';
import { normalizeText } from '@/components/spells/spell-utils';
import { ICON_PATHS, type IconId } from './action-icon-paths';
import type { ActionCard } from './action-cards';

const COMBAT_ICONS: Record<string, IconId> = {
  atacar: 'crossed-swords',
  conjurar: 'spell-book',
  disparada: 'sprint',
  desengajar: 'exit-door',
  esquivar: 'dodging',
  ajudar: 'shaking-hands',
  esconder: 'hood',
  preparar: 'hourglass',
  procurar: 'magnifying-glass',
  'usar-objeto': 'standing-potion',
  agarrar: 'grab',
  empurrar: 'push',
  'duas-armas': 'crossed-sabres',
  'ataque-de-oportunidade': 'sword-slice',
  'reacao-preparada': 'stopwatch',
};

/** Características conhecidas; o resto cai no ícone genérico. Chave = nome normalizado. */
const FEATURE_ICONS: Record<string, IconId> = {
  furia: 'enrage',
  'arma de sopro': 'dragon-breath',
  'acao ardilosa': 'cloak-dagger',
  'esquiva sobrenatural': 'shield-reflect',
  'inspiracao de bardo': 'spark-spirit',
  'forma selvagem': 'claw-slashes',
  'segundo folego': 'health',
  'surto de acao': 'whirlwind',
  'imposicao das maos': 'magic-palm',
};

/** Primeira regra que casa com o nome da arma. */
const WEAPON_ICONS: [RegExp, IconId][] = [
  [/machad|martelo|maca|mangual|picareta|alabarda|glaive|malho/, 'battle-axe'],
  [/arco|besta|funda|zarabatana/, 'pocket-bow'],
  [/azagaia|lanca|tridente|dardo|pique/, 'spear'],
  [/adaga|punhal|faca/, 'thrown-daggers'],
  [/desarmad|soco|punho/, 'fist'],
];

/** Magias pelo efeito descrito; ordem importa (cura antes de dano). */
const SPELL_ICONS: [RegExp, IconId][] = [
  [/recupera .*pontos de vida|cura|curar/, 'health'],
  [/teletransport|desaparece e reaparece/, 'teleport'],
  [/dano de fogo|chamas/, 'fireball'],
  [/dano de frio|gelo/, 'ice-bolt'],
  [/dano eletrico|dano de trovao|relampago|raio/, 'lightning-arc'],
  [/dano necrotico|morte/, 'death-zone'],
  [/dano radiante|luz/, 'sparkles'],
];

export function iconFor(card: ActionCard): IconId {
  const e = card.entry;
  if (e.kind === 'action') return COMBAT_ICONS[e.id] ?? 'beveled-star';
  if (e.kind === 'weapon') {
    const n = normalizeText(card.name);
    if (card.source.includes('distância') && !/azagaia|lanca|dardo|adaga/.test(n)) return 'pocket-bow';
    return WEAPON_ICONS.find(([re]) => re.test(n))?.[1] ?? 'broadsword';
  }
  if (card.spell) {
    const t = normalizeText(card.spell.description);
    return SPELL_ICONS.find(([re]) => re.test(t))?.[1] ?? (card.spell.level === 0 ? 'magic-swirl' : 'rolling-energy');
  }
  return FEATURE_ICONS[normalizeText(card.name)] ?? 'beveled-star';
}

/** Silhueta do ícone com gradiente creme → cor da seção; o tamanho vem de `className`. */
export function ActionGlyph({ card, icon, color, className }: { card?: ActionCard; icon?: IconId; color: string; className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 512 512" aria-hidden className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8e1" />
          <stop offset="55%" stopColor="#e9d3a0" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d={ICON_PATHS[icon ?? (card ? iconFor(card) : 'beveled-star')]} fill={`url(#${id})`} />
    </svg>
  );
}
