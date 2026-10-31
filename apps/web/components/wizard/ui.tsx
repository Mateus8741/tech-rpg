"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StepTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold text-[#e2e8f0]">{title}</h2>
      {hint && <p className="mt-1 text-sm text-[#64748b]">{hint}</p>}
    </div>
  );
}

export function Panel({ title, children, className, aside }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode }) {
  return (
    <section className={cn("rounded-xl border border-[#1e2035] bg-[#0f1117] p-4", className)}>
      {(title || aside) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8b5cf6]">{title}</h3>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function OptionCard({
  selected, onClick, title, subtitle, children, disabled,
}: { selected: boolean; onClick: () => void; title: string; subtitle?: string; children?: ReactNode; disabled?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileHover={reduce || disabled ? undefined : { y: -2 }}
      whileTap={reduce || disabled ? undefined : { scale: 0.99 }}
      aria-pressed={selected}
      className={cn(
        "relative w-full rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
        selected ? "border-[#6366f1] bg-[#6366f1]/10" : "border-[#1e2035] bg-[#0f1117] hover:border-[#6366f1]/50",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#6366f1] text-white">
          <Check className="h-3 w-3" />
        </span>
      )}
      <div className="pr-6 text-sm font-semibold text-[#e2e8f0]">{title}</div>
      {subtitle && <div className="mt-0.5 text-xs text-[#f5c451]">{subtitle}</div>}
      {children && <div className="mt-2 text-xs leading-relaxed text-[#64748b]">{children}</div>}
    </motion.button>
  );
}

export function Chip({
  selected, disabled, onClick, children, title,
}: { selected: boolean; disabled?: boolean; onClick: () => void; children: ReactNode; title?: string }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
        selected ? "border-[#6366f1] bg-[#6366f1]/20 text-[#c7d2fe]" : "border-[#1e2035] bg-[#0a0c14] text-[#94a3b8] hover:border-[#6366f1]/50",
        disabled && !selected && "cursor-not-allowed opacity-35 hover:border-[#1e2035]",
      )}
    >
      {children}
    </button>
  );
}

export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "gold" | "indigo" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px]",
        tone === "gold" && "border-[#f5c451]/30 bg-[#f5c451]/10 text-[#f5c451]",
        tone === "indigo" && "border-[#6366f1]/30 bg-[#6366f1]/10 text-[#a5b4fc]",
        tone === "muted" && "border-[#1e2035] bg-[#0a0c14] text-[#94a3b8]",
      )}
    >
      {children}
    </span>
  );
}

export function TraitList({ traits }: { traits: { name: string; description: string }[] }) {
  return (
    <ul className="space-y-2">
      {traits.map((t) => (
        <li key={t.name} className="rounded-lg border border-[#1e2035] bg-[#0a0c14] p-3">
          <div className="text-xs font-semibold text-[#e2e8f0]">{t.name}</div>
          <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-[#64748b]">{t.description}</p>
        </li>
      ))}
    </ul>
  );
}

export const selectCls =
  "h-9 rounded-md border border-[#1e2035] bg-[#0a0c14] px-2 text-sm text-[#e2e8f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]";
export const inputCls =
  "border-[#1e2035] bg-[#0a0c14] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#6366f1]";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-[#94a3b8]">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-[#64748b]">{hint}</span>}
    </label>
  );
}

export function Counter({ value, max }: { value: number; max: number }) {
  return (
    <span className={cn("text-xs tabular-nums", value >= max ? "text-[#34d399]" : "text-[#f5c451]")}>
      {value}/{max}
    </span>
  );
}

/** Alterna item em lista respeitando um limite. */
export function toggleIn<T>(list: T[], item: T, max: number): T[] {
  if (list.includes(item)) return list.filter((x) => x !== item);
  return list.length >= max ? list : [...list, item];
}
