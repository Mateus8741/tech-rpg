"use client";

import { ABILITIES, abilityModifier, formatModifier, proficiencyBonus } from "@repo/rules";
import { Check, Circle } from "lucide-react";
import { SKILL_NAME, activeSteps, allSkills, buildCharacterPayload, classOf, raceOf, stepErrors, subclassOf } from "./build";
import { STEP_LABELS, type WizardState } from "./state";
import { cn } from "@/lib/utils";

export default function SummaryPanel({ state }: { state: WizardState }) {
  const p = buildCharacterPayload(state);
  const steps = activeSteps(state);
  const scores: number[] = [p.strength!, p.dexterity!, p.constitution!, p.intelligence!, p.wisdom!, p.charisma!];
  const skills = allSkills(state);
  const cls = classOf(state);
  return (
    <aside className="rounded-xl border border-line bg-canvas p-4 lg:sticky lg:top-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-violet-ink">Ficha em construção</div>
      <div className="mt-1 truncate text-lg font-semibold text-ink">{state.name.trim() || "Sem nome"}</div>
      <div className="text-xs text-ink-muted">
        {p.race || "Raça ?"} · {cls ? `${cls.name} ${state.level}` : "Classe ?"}
        {subclassOf(state) && ` (${subclassOf(state)!.name})`}
      </div>
      {p.background && <div className="text-xs text-ink-muted">{p.background}{p.alignment ? ` · ${p.alignment}` : ""}</div>}

      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {ABILITIES.map((a, i) => (
          <div key={a.key} className="rounded-md border border-line bg-base py-1.5 text-center">
            <div className="text-[10px] text-ink-muted">{a.abbr}</div>
            <div className="text-sm font-bold tabular-nums text-ink">{scores[i]}</div>
            <div className="text-[11px] tabular-nums text-indigo-ink">{formatModifier(abilityModifier(scores[i] ?? 10))}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
        {[["PV", cls ? p.maxHitPoints : "—"], ["CA", p.armorClass], ["Prof.", `+${proficiencyBonus(state.level)}`]].map(([l, v]) => (
          <div key={l as string} className="rounded-md border border-line bg-base py-1.5">
            <div className="text-[10px] text-ink-muted">{l}</div>
            <div className="text-sm font-bold tabular-nums text-gold-ink">{v}</div>
          </div>
        ))}
      </div>

      {skills.length > 0 && (
        <div className="mt-3 text-[11px] leading-relaxed text-ink-soft">
          <span className="text-ink-muted">Perícias: </span>{skills.map((k) => SKILL_NAME[k]).join(", ")}
        </div>
      )}
      {raceOf(state) && <div className="mt-1 text-[11px] text-ink-muted">{p.features?.length ?? 0} características · {p.spells?.length ?? 0} magias</div>}

      <ul className="mt-4 space-y-1 border-t border-line pt-3">
        {steps.map((s) => {
          const ok = stepErrors(state, s).length === 0 && (s !== "details" || !!state.name.trim());
          return (
            <li key={s} className={cn("flex items-center gap-2 text-xs", ok ? "text-success" : "text-ink-muted")}>
              {ok ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />} {STEP_LABELS[s]}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
