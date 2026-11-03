"use client";

import type { Spell } from "@repo/rules";
import { CLASSES } from "@repo/rules";
import { cn } from "@/lib/utils";
import { SPELL_SCHOOL_COLORS, spellComponentsLabel, spellLevelLabel } from "./spell-utils";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#1e2035] bg-[#0a0c14] px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">{label}</dt>
      <dd className="mt-0.5 text-sm text-[#e2e8f0]">{children}</dd>
    </div>
  );
}

export function SpellDetail({ spell, className }: { spell: Spell; className?: string }) {
  const color = SPELL_SCHOOL_COLORS[spell.school];
  const classNames = spell.classes.map((id) => CLASSES.find((c) => c.id === id)?.name ?? id);
  return (
    <article className={cn("space-y-4 text-[#e2e8f0]", className)}>
      <header className="space-y-2">
        <h2 className="text-xl font-bold leading-tight">{spell.name}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#f5c451]/40 bg-[#f5c451]/10 px-2.5 py-0.5 text-xs font-semibold text-[#f5c451]">
            {spellLevelLabel(spell.level)}
          </span>
          <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", color.chip)}>{spell.school}</span>
          {spell.concentration && (
            <span className="rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-2.5 py-0.5 text-xs text-[#a78bfa]">Concentração</span>
          )}
          {spell.ritual && (
            <span className="rounded-full border border-[#f5c451]/40 bg-[#f5c451]/10 px-2.5 py-0.5 text-xs text-[#f5c451]">Ritual</span>
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
        <p className="rounded-lg border border-[#1e2035] bg-[#0a0c14] px-3 py-2 text-xs text-[#94a3b8]">
          <span className="font-semibold text-[#64748b]">Material: </span>
          {spell.components.m}
        </p>
      )}

      <div className="whitespace-pre-line text-sm leading-relaxed text-[#cbd5e1]">{spell.description}</div>

      {spell.atHigherLevels && (
        <div className="rounded-lg border border-[#6366f1]/30 bg-[#6366f1]/5 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#8b5cf6]">Em níveis superiores</p>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#cbd5e1]">{spell.atHigherLevels}</p>
        </div>
      )}

      <footer className="space-y-2 border-t border-[#1e2035] pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-[#64748b]">Classes:</span>
          {classNames.map((n) => (
            <span key={n} className="rounded-full border border-[#1e2035] bg-[#13152a] px-2 py-0.5 text-xs text-[#e2e8f0]">{n}</span>
          ))}
        </div>
        {spell.source && <p className="text-xs text-[#64748b]">Fonte: {spell.source}</p>}
      </footer>
    </article>
  );
}
