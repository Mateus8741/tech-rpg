"use client";

import type { ReactNode } from "react";
import type { Spell } from "@repo/rules";
import { cn } from "@/lib/utils";
import { SPELL_SCHOOL_COLORS, spellLevelLabel, spellLevelShort } from "./spell-utils";

export interface SpellRowProps {
  spell: Spell;
  onClick?: () => void;
  /** Slot à direita (ex.: botão "Adicionar"). Cliques nele não disparam onClick. */
  action?: ReactNode;
  selected?: boolean;
  className?: string;
}

export function SpellRow({ spell, onClick, action, selected, className }: SpellRowProps) {
  const color = SPELL_SCHOOL_COLORS[spell.school];
  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border bg-[#0f1117] px-3 py-2.5 transition-colors",
        selected ? "border-[#6366f1] bg-[#6366f1]/10" : "border-[#1e2035] hover:border-[#6366f1]/50 hover:bg-[#13152a]",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded-lg"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold"
          style={{ borderColor: `${color.hex}66`, background: `${color.hex}1a`, color: color.hex }}
          title={spellLevelLabel(spell.level)}
        >
          {spellLevelShort(spell.level)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-[#e2e8f0]">{spell.name}</span>
            {spell.concentration && (
              <span className="rounded border border-[#8b5cf6]/40 px-1 text-[10px] font-semibold text-[#a78bfa]" title="Concentração">C</span>
            )}
            {spell.ritual && (
              <span className="rounded border border-[#f5c451]/40 px-1 text-[10px] font-semibold text-[#f5c451]" title="Ritual">R</span>
            )}
          </span>
          <span className="block truncate text-xs text-[#64748b]">
            <span style={{ color: color.hex }}>{spell.school}</span> · {spell.castingTime} · {spell.range}
          </span>
        </span>
      </button>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
