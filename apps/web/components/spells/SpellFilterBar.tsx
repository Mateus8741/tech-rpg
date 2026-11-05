'use client';

import { Search, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SPELL_SCHOOLS, SPELL_SCHOOL_COLORS } from './spell-utils';
import { accentText } from '@/components/sheet/class-style';
import { filtersActive, toggleSet, type SpellFilterState } from './filters';

function Chip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={active}
      className={cn('rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
        active ? 'border-[#6366f1] bg-[#6366f1]/20 text-ink' : 'border-line bg-base text-ink-muted hover:text-ink')}
      style={active && color ? { borderColor: color, background: `${color}26`, color: accentText(color) } : undefined}
    >
      {children}
    </button>
  );
}

/** Barra de filtros compacta, controlada. `extra` = chips adicionais (ex.: Preparadas). */
export function SpellFilterBar({ value, onChange, maxLevel = 9, extra }: {
  value: SpellFilterState; onChange: (v: SpellFilterState) => void; maxLevel?: number; extra?: React.ReactNode;
}) {
  const set = (p: Partial<SpellFilterState>) => onChange({ ...value, ...p });
  const n = filtersActive(value);
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-muted" />
        <input
          aria-label="Buscar magia" value={value.q} onChange={(e) => set({ q: e.target.value })} placeholder="Buscar magia..."
          className="w-full rounded-md border border-line bg-base py-1.5 pl-8 pr-8 text-sm text-ink placeholder:text-ink-faint focus:border-[#6366f1]/60 focus:outline-none"
        />
        {value.q && (
          <button type="button" aria-label="Limpar busca" onClick={() => set({ q: '' })} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"><X className="h-3.5 w-3.5" /></button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={value.favorites} onClick={() => set({ favorites: !value.favorites })} color="#f5c451"><Star className="mr-1 inline h-3 w-3" />Favoritas</Chip>
        {extra}
        <Chip active={value.concentration} onClick={() => set({ concentration: !value.concentration })} color="#a78bfa">Concentração</Chip>
        <Chip active={value.ritual} onClick={() => set({ ritual: !value.ritual })} color="#f5c451">Ritual</Chip>
        {(['v', 's', 'm'] as const).map((c) => (
          <Chip key={c} active={value.components.has(c)} onClick={() => set({ components: toggleSet(value.components, c) })} color="#22d3ee">{c.toUpperCase()}</Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: maxLevel + 1 }, (_, l) => (
          <Chip key={l} active={value.levels.has(l)} onClick={() => set({ levels: toggleSet(value.levels, l) })} color="#f5c451">{l === 0 ? 'Truque' : l}</Chip>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {SPELL_SCHOOLS.map((s) => (
          <Chip key={s} active={value.schools.has(s)} onClick={() => set({ schools: toggleSet(value.schools, s) })} color={SPELL_SCHOOL_COLORS[s].hex}>{s}</Chip>
        ))}
      </div>
      {n > 0 && (
        <button type="button" className="text-[11px] text-violet-ink hover:underline" onClick={() => onChange({ ...value, q: '', concentration: false, ritual: false, components: new Set(), schools: new Set(), levels: new Set(), favorites: false })}>
          Limpar filtros ({n})
        </button>
      )}
    </div>
  );
}
