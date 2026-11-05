"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Spell } from "@repo/rules";
import { cn } from "@/lib/utils";
import { SPELL_SCHOOL_COLORS, spellLevelLabel } from "./spell-utils";

export interface SpellCardProps {
  spell: Spell;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

export function SpellCard({ spell, onClick, selected, className }: SpellCardProps) {
  const reduce = useReducedMotion();
  const color = SPELL_SCHOOL_COLORS[spell.school];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={cn(
        "relative flex h-full flex-col gap-2 overflow-hidden rounded-xl border bg-canvas p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
        selected ? "border-[#6366f1]" : "border-line hover:border-[#6366f1]/50",
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: color.hex }} />
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-ink">{spell.name}</h3>
        <span className="shrink-0 text-xs font-medium text-gold-ink">{spellLevelLabel(spell.level)}</span>
      </div>
      <span className={cn("w-fit rounded-full border px-2 py-0.5 text-[11px] font-medium", color.chip)}>{spell.school}</span>
      <p className="line-clamp-3 text-xs leading-relaxed text-ink-muted">{spell.description}</p>
      <div className="mt-auto flex flex-wrap gap-1 pt-1 text-[10px] text-ink-muted">
        <span>{spell.castingTime}</span>·<span>{spell.range}</span>
        {spell.concentration && <span className="text-violet-ink">· Concentração</span>}
        {spell.ritual && <span className="text-gold-ink">· Ritual</span>}
      </div>
    </motion.button>
  );
}
