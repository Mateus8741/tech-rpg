"use client";

import { ALIGNMENTS, abilityModifier, formatModifier, proficiencyBonus } from "@repo/rules";
import { Input } from "@/components/ui/input";
import { Field, Panel, StepTitle, Tag, inputCls, selectCls } from "./ui";
import {
  ABILITY_ABBR, SKILL_NAME, allLanguages, allSkills, buildCharacterPayload, classOf, speedOf,
} from "./build";
import { ABILITIES } from "@repo/rules";
import type { WizardState } from "./state";

interface Props { state: WizardState; update: (p: Partial<WizardState>) => void }

export default function DetailsStep({ state, update }: Props) {
  const p = buildCharacterPayload(state);
  const scores: number[] = [p.strength!, p.dexterity!, p.constitution!, p.intelligence!, p.wisdom!, p.charisma!];
  const taStyle = `w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${inputCls}`;
  return (
    <div className="space-y-4">
      <StepTitle title="Detalhes e revisão" hint="Dê vida ao personagem e confira a ficha antes de criar." />
      <Panel title="Identidade">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nome do personagem">
            <Input value={state.name} onChange={(e) => update({ name: e.target.value })} placeholder="Ex.: Thalion Folha-de-Prata" className={inputCls} />
          </Field>
          <Field label="Tendência">
            <select className={`${selectCls} w-full`} value={state.alignment} onChange={(e) => update({ alignment: e.target.value })}>
              <option value="">Selecione…</option>
              {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-3 grid gap-3">
          <Field label="Aparência"><textarea rows={3} className={taStyle} value={state.appearance} onChange={(e) => update({ appearance: e.target.value })} /></Field>
          <Field label="História"><textarea rows={5} className={taStyle} value={state.backstory} onChange={(e) => update({ backstory: e.target.value })} /></Field>
        </div>
      </Panel>

      <Panel title="Revisão da ficha">
        <div className="mb-3 text-sm text-[#e2e8f0]">
          <span className="font-semibold">{p.name || "Sem nome"}</span>
          <span className="text-[#64748b]"> · {p.race} · {p.class} {p.level} · {p.background}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ABILITIES.map((a, i) => (
            <div key={a.key} className="rounded-lg border border-[#1e2035] bg-[#0a0c14] p-2 text-center">
              <div className="text-[10px] text-[#64748b]">{ABILITY_ABBR[a.key]}</div>
              <div className="text-lg font-bold tabular-nums text-[#e2e8f0]">{scores[i]}</div>
              <div className="text-xs text-[#a5b4fc]">{formatModifier(abilityModifier(scores[i] ?? 10))}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag tone="gold">PV {p.maxHitPoints}</Tag>
          <Tag tone="gold">CA {p.armorClass}</Tag>
          <Tag tone="indigo">Proficiência +{proficiencyBonus(state.level)}</Tag>
          <Tag>Deslocamento {speedOf(state)} m</Tag>
          <Tag>d{classOf(state)?.hitDie} dado de vida</Tag>
          <Tag>XP {p.experience}</Tag>
        </div>
        <dl className="mt-4 space-y-3 text-xs">
          <div><dt className="mb-1 text-[#64748b]">Perícias</dt><dd className="text-[#94a3b8]">{allSkills(state).map((k) => SKILL_NAME[k]).join(", ") || "—"}</dd></div>
          <div><dt className="mb-1 text-[#64748b]">Idiomas</dt><dd className="text-[#94a3b8]">{allLanguages(state).join(", ") || "—"}</dd></div>
          <div><dt className="mb-1 text-[#64748b]">Magias ({p.spells?.length ?? 0})</dt><dd className="text-[#94a3b8]">{p.spells?.length ? p.spells.join(", ") : "—"}</dd></div>
          <div><dt className="mb-1 text-[#64748b]">Inventário inicial</dt><dd className="text-[#94a3b8]">{p.inventory?.map((i) => `${i.quantity}× ${i.name}`).join(" · ")}</dd></div>
          <div><dt className="mb-1 text-[#64748b]">Características ({p.features?.length ?? 0})</dt>
            <dd className="text-[#94a3b8]">{p.features?.map((f: { name: string }) => f.name).join(", ")}</dd></div>
        </dl>
      </Panel>
    </div>
  );
}
