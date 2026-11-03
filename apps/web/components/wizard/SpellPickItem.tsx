"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { Spell } from "@repo/rules";
import { cn } from "@/lib/utils";
import { Tag } from "./ui";

interface Props { spell: Spell; selected: boolean; disabled?: boolean; onToggle: () => void }

export default function SpellPickItem({ spell, selected, disabled, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("rounded-lg border transition-colors", selected ? "border-[#6366f1] bg-[#6366f1]/10" : "border-[#1e2035] bg-[#0a0c14]", disabled && !selected && "opacity-40")}>
      <div className="flex items-center gap-2 p-2">
        <button type="button" onClick={onToggle} disabled={disabled && !selected} aria-pressed={selected} aria-label={`Selecionar ${spell.name}`}
          className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded border", selected ? "border-[#6366f1] bg-[#6366f1] text-white" : "border-[#2d2f45]")}>
          {selected && <Check className="h-3 w-3" />}
        </button>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="truncate text-sm text-[#e2e8f0]">{spell.name}</span>
          <Tag>{spell.level === 0 ? "Truque" : `${spell.level}º`}</Tag>
          <span className="hidden text-[11px] text-[#64748b] sm:inline">{spell.school}</span>
          {spell.concentration && <Tag tone="gold">C</Tag>}
          {spell.ritual && <Tag tone="indigo">R</Tag>}
          <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-[#64748b] transition-transform", open && "rotate-180")} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-1 border-t border-[#1e2035] p-3 text-xs text-[#94a3b8]">
              <div className="text-[#64748b]">{spell.castingTime} · {spell.range} · {spell.duration}</div>
              <p className="whitespace-pre-line leading-relaxed">{spell.description}</p>
              {spell.atHigherLevels && <p className="text-[#64748b]">Em níveis superiores: {spell.atHigherLevels}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
