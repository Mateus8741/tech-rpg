"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { ABILITIES, type AbilityKey } from "@repo/rules";
import { cn } from "@/lib/utils";
import { tablistKeyDown } from "@/lib/a11y";

export const abilityAbbr = (k: AbilityKey) => ABILITIES.find((a) => a.key === k)?.abbr ?? k;
export const abilityName = (k: AbilityKey) => ABILITIES.find((a) => a.key === k)?.name ?? k;

export function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function Header({ title, subtitle, back, eyebrow }: { title: string; subtitle?: string; back?: { href: string; label: string }; eyebrow?: string }) {
  return (
    <header className="mb-8">
      {back && (
        <Link href={back.href} className="mb-4 inline-flex items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" /> {back.label}
        </Link>
      )}
      {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-ink">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{subtitle}</p>}
    </header>
  );
}

export function Page({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-6xl p-6 md:p-8"
    >
      {children}
    </motion.div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-[#6366f1]"
      />
    </div>
  );
}

export function Chip({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "accent" | "gold" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
        tone === "muted" && "border-line bg-surface text-ink-soft",
        tone === "accent" && "border-[#6366f1]/30 bg-[#6366f1]/10 text-indigo-ink",
        tone === "gold" && "border-[#f5c451]/30 bg-[#f5c451]/10 text-gold-ink"
      )}
    >
      {children}
    </span>
  );
}

export function FilterChips<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            o === value ? "border-[#6366f1] bg-[#6366f1]/15 text-indigo-ink-soft" : "border-line text-ink-muted hover:text-ink"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/** Texto de regra com \n preservado. */
export function RuleText({ text, className }: { text: string; className?: string }) {
  return <p className={cn("whitespace-pre-line text-sm leading-relaxed text-ink-body", className)}>{text}</p>;
}

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-line bg-canvas p-5", className)}>
      {title && <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">{title}</h2>}
      {children}
    </section>
  );
}

/** Abas com troca animada (conteúdo em fade/slide). */
export function AnimatedTabs({ tabs, initial = 0 }: { tabs: { label: string; content: ReactNode }[]; initial?: number }) {
  const [i, setI] = useState(initial);
  const reduce = useReducedMotion();
  const uid = useId();
  if (tabs.length === 0) return null;
  const idx = Math.min(i, tabs.length - 1);
  return (
    <div>
      <div role="tablist" onKeyDown={tablistKeyDown} className="mb-4 flex flex-wrap gap-1 border-b border-line">
        {tabs.map((t, n) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${uid}-tab-${n}`}
            aria-selected={n === idx}
            aria-controls={`${uid}-panel`}
            tabIndex={n === idx ? 0 : -1}
            onClick={() => setI(n)}
            className={cn("relative rounded-t-md outline-none focus-visible:ring-2 focus-visible:ring-indigo/70 px-4 py-2.5 text-sm font-medium transition-colors", n === idx ? "text-ink" : "text-ink-muted hover:text-ink-body")}
          >
            {t.label}
            {n === idx && (
              <motion.span layoutId={reduce ? undefined : `tab-underline-${tabs.map((x) => x.label).join("|")}`} className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={idx}
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${idx}`}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tabs[idx]?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Grade com entrada em cascata e hover-lift. */
export function CardGrid({ children, className }: { children: ReactNode[] | ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {children}
    </motion.div>
  );
}

export function LiftCard({ href, children, className }: { href?: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const inner = (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn("group h-full rounded-xl border border-line bg-canvas p-5 transition-colors hover:border-[#6366f1]/50", className)}
    >
      {children}
    </motion.div>
  );
  return href ? <Link href={href} className="block h-full">{inner}</Link> : inner;
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-line py-12 text-center text-sm text-ink-muted">{text}</div>;
}

export function Accordion({ title, children, defaultOpen = false, badge }: { title: string; children: ReactNode; defaultOpen?: boolean; badge?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-canvas">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.02]">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">{title}{badge}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.2 }} className="text-ink-muted">▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-t border-line px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
