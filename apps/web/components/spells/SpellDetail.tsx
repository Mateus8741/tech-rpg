"use client";

import type { Spell } from "@repo/rules";
import { CLASSES } from "@repo/rules";
import { cn } from "@/lib/utils";
import { SPELL_SCHOOL_COLORS, spellComponentsLabel, spellLevelLabel } from "./spell-utils";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-base px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{children}</dd>
    </div>
  );
}

export function SpellDetail({ spell, className }: { spell: Spell; className?: string }) {
  const color = SPELL_SCHOOL_COLORS[spell.school];
  const classNames = spell.classes.map((id) => CLASSES.find((c) => c.id === id)?.name ?? id);
  return (
    <article className={cn("space-y-4 text-ink", className)}>
      <header className="space-y-2">
        <h2 className="text-xl font-bold leading-tight">{spell.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#f5c451]/40 bg-[#f5c451]/10 px-2.5 py-0.5 text-xs font-semibold text-gold-ink">
            {spellLevelLabel(spell.level)}
          </span>
          <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", color.chip)}>{spell.school}</span>
          {spell.concentration && (
            <span className="rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-2.5 py-0.5 text-xs text-violet-ink">Concentração</span>
          )}
          {spell.ritual && (
            <span className="rounded-full border border-[#f5c451]/40 bg-[#f5c451]/10 px-2.5 py-0.5 text-xs text-gold-ink">Ritual</span>
          )}
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-2">
        <Field label="Tempo de conjuração">{spell.castingTime}</Field>
        <Field label="Alcance">{spell.range}</Field>
        <Field label="Duração">{spell.duration}</Field>
        <Field label="Componentes">
          {spellComponentsLabel(spell.components) || "—"}
        </Field>
      </dl>
      {spell.components.m && (
        <p className="rounded-lg border border-line bg-base px-3 py-2 text-xs text-ink-soft">
          <span className="font-semibold text-ink-muted">Material: </span>
          {spell.components.m}
        </p>
      )}

      <div className="whitespace-pre-line text-sm leading-relaxed text-ink-body">{spell.description}</div>

      {spell.atHigherLevels && (
        <div className="rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/5 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-violet-ink">Em níveis superiores</p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-body">{spell.atHigherLevels}</p>
        </div>
      )}

      <footer className="space-y-2 border-t border-line pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-ink-muted">Classes:</span>
          {classNames.map((n) => (
            <span key={n} className="rounded-full border border-line bg-surface px-2 py-0.5 text-xs text-ink">{n}</span>
          ))}
        </div>
        {spell.source && <p className="text-xs text-ink-muted">Fonte: {spell.source}</p>}
      </footer>
    </article>
  );
}
