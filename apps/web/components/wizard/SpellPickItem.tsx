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
    <div className={cn("rounded-lg border transition-colors", selected ? "border-[#6366f1] bg-[#6366f1]/10" : "border-line bg-base", disabled && !selected && "opacity-40")}>
      <div className="flex items-center gap-2 p-2">
        <button type="button" onClick={onToggle} disabled={disabled && !selected} aria-pressed={selected} aria-label={`Selecionar ${spell.name}`}
          className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded border", selected ? "border-[#6366f1] bg-[#6366f1] text-white" : "border-line-strong")}>
          {selected && <Check className="h-3 w-3" />}
        </button>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="truncate text-sm text-ink">{spell.name}</span>
          <Tag>{spell.level === 0 ? "Truque" : `${spell.level}º`}</Tag>
          <span className="hidden text-[11px] text-ink-muted sm:inline">{spell.school}</span>
          {spell.concentration && <Tag tone="gold">C</Tag>}
          {spell.ritual && <Tag tone="indigo">R</Tag>}
          <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-ink-muted transition-transform", open && "rotate-180")} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-1 border-t border-line p-3 text-xs text-ink-soft">
              <div className="text-ink-muted">{spell.castingTime} · {spell.range} · {spell.duration}</div>
              <p className="whitespace-pre-line leading-relaxed">{spell.description}</p>
              {spell.atHigherLevels && <p className="text-ink-muted">Em níveis superiores: {spell.atHigherLevels}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
