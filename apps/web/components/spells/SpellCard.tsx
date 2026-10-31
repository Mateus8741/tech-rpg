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
        "relative flex h-full flex-col gap-2 overflow-hidden rounded-xl border bg-[#0f1117] p-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
        selected ? "border-[#6366f1]" : "border-[#1e2035] hover:border-[#6366f1]/50",
        className,
      )}
    >
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: color.hex }} />
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#e2e8f0]">{spell.name}</h3>
        <span className="shrink-0 text-xs font-medium text-[#f5c451]">{spellLevelLabel(spell.level)}</span>
      </div>
      <span className={cn("w-fit rounded-full border px-2 py-0.5 text-[11px] font-medium", color.chip)}>{spell.school}</span>
      <p className="line-clamp-3 text-xs leading-relaxed text-[#64748b]">{spell.description}</p>
      <div className="mt-auto flex flex-wrap gap-1 pt-1 text-[10px] text-[#64748b]">
        <span>{spell.castingTime}</span>·<span>{spell.range}</span>
        {spell.concentration && <span className="text-[#a78bfa]">· Concentração</span>}
        {spell.ritual && <span className="text-[#f5c451]">· Ritual</span>}
      </div>
    </motion.button>
  );
}
