// Carta de ação em formato de carta colecionável: custo no canto, nome em Cinzel,
// arte (imagem própria em /public/cards ou ícone), faixa com o tipo e quadro de informações.
import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Clock, Dices, Hand, Hourglass, Ruler, Sparkles, Target, type LucideIcon } from 'lucide-react';
import { getClass, type SpellSchool } from '@repo/rules';
import { cn } from '@/lib/utils';
import { normalizeText } from '@/components/spells/spell-utils';
import { ActionGlyph } from './ActionIcon';
import { CARD_ART } from './card-art-map';
import type { IconId } from './action-icon-paths';
import type { ActionCard } from './action-cards';

const COST_BADGE: Partial<Record<ActionCard['cost'], string>> = { acao: 'A', bonus: 'B', reacao: 'R', livre: '0' };
const COST_CAPTION: Partial<Record<ActionCard['cost'], string>> = { acao: 'ação', bonus: 'bônus', reacao: 'reação', livre: 'livre' };

/** Cor e emblema de cada escola; as magias usam isto no lugar da cor do custo. */
export const SCHOOL_STYLE: Record<SpellSchool, { color: string; icon: IconId }> = {
  Abjuração: { color: '#3b82f6', icon: 'school-abjuracao' },
  Conjuração: { color: '#d4a017', icon: 'school-conjuracao' },
  Adivinhação: { color: '#9fb3cc', icon: 'school-adivinhacao' },
  Encantamento: { color: '#14a3a3', icon: 'school-encantamento' },
  Evocação: { color: '#ea6a1f', icon: 'school-evocacao' },
  Ilusão: { color: '#a855f7', icon: 'school-ilusao' },
  Necromancia: { color: '#5f7d6e', icon: 'school-necromancia' },
  Transmutação: { color: '#7cb518', icon: 'school-transmutacao' },
};

/* ---------- Arte própria ---------- */

const ART_EXTS = ['webp', 'png', 'jpg'] as const;

/** Imagens a tentar, em ordem: arte própria em /cards e depois o ícone pintado do pacote. */
function artSources(key: string): string[] {
  const own = ART_EXTS.map((e) => `/cards/${key}.${e}`);
  const painted = CARD_ART[key];
  return painted ? [...own, `/cards/painterly/${painted}.webp`] : own;
}
/** Chaves sem imagem em nenhuma fonte; evita repetir os 404 a cada render. */
const missingArt = new Set<string>();

const slug = (s: string) => normalizeText(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Nome do arquivo em /public/cards: id da magia, id da ação básica, ou o nome em slug. */
export function artKey(card: ActionCard): string {
  if (card.spell) return card.spell.id;
  if (card.entry.kind === 'action') return card.entry.id;
  return slug(card.name);
}

function CardArt({ card, color, emblem }: { card: ActionCard; color: string; emblem?: IconId }) {
  const key = artKey(card);
  const sources = artSources(key);
  const [ext, setExt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const failed = missingArt.has(key) || ext >= sources.length;
  return (
    <div
      className="relative mx-2.5 mt-2 grid aspect-[16/9] place-items-center overflow-hidden rounded-[3px] min-[480px]:aspect-[4/3]"
      style={{
        background: `radial-gradient(ellipse at 50% 40%, ${color}66, ${color}1f 45%, #07080c 85%)`,
        boxShadow: `0 0 0 1px ${color}99, 0 0 0 3px #0b0c11, 0 0 0 4px #ffffff1a`,
      }}
    >
      {/* O ícone fica sempre por baixo; a imagem própria cobre ele só depois de carregar. */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 9px)' }} />
      {/* Emblema da escola, grande e apagado, atrás do ícone */}
      {emblem && <ActionGlyph icon={emblem} color={color} className="absolute h-[95%] w-[95%] opacity-[0.08]" />}
      <ActionGlyph
        card={card} color={color}
        className="relative h-[68%] w-[68%] drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] transition-transform duration-300 group-hover:scale-105"
      />
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element -- arquivo opcional; precisa do onError para cair no ícone
        <img
          src={sources[ext]} alt="" loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => { if (ext + 1 >= sources.length) missingArt.add(key); setExt(ext + 1); }}
          className={cn('absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105', loaded ? 'opacity-100' : 'opacity-0')}
        />
      )}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.85)]" />
    </div>
  );
}

/* ---------- Moldura ---------- */

/** Arabesco de canto; espelhado nos quatro cantos. */
function Corner({ color, className }: { color: string; className: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('pointer-events-none absolute h-5 w-5', className)}>
      <path d="M2 22V8C2 4.7 4.7 2 8 2h14" fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M6 22v-9c0-3.9 3.1-7 7-7h9" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
      <circle cx="8" cy="8" r="1.6" fill={color} />
    </svg>
  );
}

/** Ruído sutil (feTurbulence) para dar textura de pedra/papel. */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ---------- Informações ---------- */

interface Fact { icon: LucideIcon; text: string; hint?: string }

function factsOf(card: ActionCard): { facts: Fact[]; chips: string[] } {
  const s = card.spell;
  if (s) {
    const comps = [s.components.v && 'V', s.components.s && 'S', s.components.m && 'M'].filter(Boolean).join(', ');
    return {
      facts: [
        { icon: Clock, text: s.castingTime },
        { icon: Hand, text: comps || '—', hint: s.components.m },
        { icon: Ruler, text: s.range },
        { icon: Hourglass, text: s.duration },
      ],
      // Alcance e duração já viraram fatos; dano/cura aparecem nos botões.
      chips: card.stats.slice(2).filter((st) => !/^(Dano|Cura) /.test(st)),
    };
  }
  if (card.entry.kind === 'weapon') {
    const icons = [Target, Dices, Sparkles];
    return { facts: card.stats.map((text, i) => ({ icon: icons[i] ?? Sparkles, text })), chips: [] };
  }
  return { facts: [], chips: [] };
}

export default function GameCard({
  card, color: sectionColor, used, reduce, onOpen, children,
}: {
  card: ActionCard; color: string; used: boolean; reduce: boolean | null; onOpen: () => void; children: ReactNode;
}) {
  const spell = card.spell;
  const school = spell ? SCHOOL_STYLE[spell.school] : undefined;
  const color = school?.color ?? sectionColor;
  const { facts, chips } = factsOf(card);
  const badge = spell ? String(spell.level) : COST_BADGE[card.cost] ?? '·';
  const caption = spell ? (spell.level === 0 ? 'truque' : 'círculo') : COST_CAPTION[card.cost];
  const banner = spell ? spell.school : card.entry.kind === 'weapon' ? 'Arma' : card.costLabel;
  const subtitle = spell
    ? spell.classes.map((id) => getClass(id)?.name ?? id).join(', ')
    : card.entry.kind === 'weapon' ? card.source.replace(/^Arma /, '') : card.source;
  // Magias mostram os fatos; as demais cartas, o resumo.
  const text = spell ? null : card.summary;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ duration: reduce ? 0 : 0.16 }}
      className={cn('group relative rounded-[14px] p-[5px] shadow-[0_8px_22px_rgba(0,0,0,0.55)] focus-within:ring-2 focus-within:ring-indigo/70', used && 'opacity-50 saturate-50')}
      style={{ background: `linear-gradient(160deg, ${color}, ${color}80 30%, #1d1f29 55%, ${color}80 80%, ${color})` }}
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[10px] bg-[#13151d]"
        style={{ backgroundImage: `${NOISE}, linear-gradient(180deg, #1a1c26, #101119)`, backgroundBlendMode: 'soft-light, normal', boxShadow: `inset 0 0 0 1px ${color}55` }}
      >
        <Corner color={color} className="left-1 top-1" />
        <Corner color={color} className="right-1 top-1 -scale-x-100" />
        <Corner color={color} className="bottom-1 left-1 -scale-y-100" />
        <Corner color={color} className="bottom-1 right-1 -scale-100" />

        {/* Cabeçalho: custo + nome */}
        <div className="mx-2.5 mt-2.5 flex items-center gap-2 rounded-[3px] bg-black/35 px-1.5 py-1 ring-1 ring-white/10">
          <div className="flex shrink-0 flex-col items-center leading-none">
            <span
              className="grid h-8 w-8 place-items-center rounded-full font-display text-sm font-bold text-[#f6ead0]"
              style={{ background: 'radial-gradient(circle at 50% 35%, #2b2f3d, #0b0c12)', boxShadow: `inset 0 0 0 2px ${color}, 0 0 8px ${color}55` }}
            >
              {badge}
            </span>
            {caption && <span className="mt-0.5 text-[8px] uppercase tracking-wider text-[#a9a08a]">{caption}</span>}
          </div>
          <div className="min-w-0 flex-1 text-center">
            {/* O botão do título cobre a carta inteira; os botões de ação ficam acima dele. */}
            <button
              type="button" onClick={onOpen} aria-label={`Ver detalhes de ${card.name}`}
              className="line-clamp-2 block w-full font-display text-[13px] font-bold uppercase leading-tight tracking-wide text-[#f3e6c4] outline-none [text-shadow:0_1px_2px_#000] after:absolute after:inset-0 after:rounded-[14px] after:content-['']"
              title={card.name}
            >
              {card.name}
            </button>
            <p className="truncate font-display text-[9.5px] uppercase tracking-wider text-[#b9ae94]" title={subtitle}>{subtitle}</p>
          </div>
        </div>

        <CardArt card={card} color={color} emblem={school?.icon} />

        {/* Faixa do tipo, com emblema que "sai" da carta */}
        <div
          className="relative z-[1] -mt-3.5 ml-1.5 mr-2.5 flex items-center gap-1.5 rounded-r-sm py-1 pl-9 pr-2 shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}d9 55%, ${color}55)` }}
        >
          <span
            className="absolute -left-0.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full"
            style={{ background: 'radial-gradient(circle at 50% 35%, #2b2f3d, #08090d)', boxShadow: `0 0 0 1.5px ${color}, 0 0 10px ${color}aa` }}
          >
            <ActionGlyph icon={school?.icon} card={card} color={color} className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-[12.5px] font-bold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">{banner}</span>
        </div>

        {/* Quadro de informações */}
        <div
          className="mx-2.5 mt-2 flex-1 rounded-[3px] p-2 ring-1 ring-white/10"
          style={{ backgroundImage: `${NOISE}, linear-gradient(180deg, #2a2b31, #1b1c22)`, backgroundBlendMode: 'soft-light, normal', boxShadow: 'inset 0 0 0 3px #0e0f13, inset 0 0 0 4px #ffffff14' }}
        >
          {facts.length > 0 && (
            <ul className={cn('grid gap-x-2 gap-y-1.5 px-0.5', spell ? 'grid-cols-2' : 'grid-cols-1')}>
              {facts.map(({ icon: Icon, text: t, hint }) => (
                <li key={t} className="flex min-w-0 items-start gap-1.5 text-[11px] font-semibold leading-tight text-[#efe7d3]" title={hint ?? t}>
                  <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-black/50 ring-1 ring-white/20">
                    <Icon className="h-2.5 w-2.5 text-[#d8ccb0]" aria-hidden />
                  </span>
                  <span className="line-clamp-2">{t}</span>
                </li>
              ))}
            </ul>
          )}
          {text && <p className={cn('px-0.5 text-[11.5px] leading-snug text-[#d6cdb8]', facts.length > 0 && 'mt-1.5 border-t border-white/10 pt-1.5')}>{text}</p>}
          {chips.length > 0 && (
            <ul className="mt-1.5 flex flex-wrap gap-1">
              {chips.map((c) => (
                <li key={c} className="rounded-sm border border-white/15 bg-black/30 px-1.5 py-0.5 text-[10px] text-[#efe7d3]">{c}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Botões */}
        <div className="relative z-10 flex flex-wrap gap-1.5 p-2.5">{children}</div>
      </div>
    </motion.article>
  );
}
