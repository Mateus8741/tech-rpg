"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Spell } from "@repo/rules";
import SpellPickItem from "./SpellPickItem";
import { Counter, Panel, StepTitle, inputCls, selectCls, toggleIn } from "./ui";
import { ABILITY_NAME, resolvedSpells } from "./build";
import type { WizardState } from "./state";

interface Props { state: WizardState; update: (p: Partial<WizardState>) => void }

function Picker({ title, list, selected, max, onChange, hint }: {
  title: string; list: Spell[]; selected: string[]; max: number; onChange: (ids: string[]) => void; hint?: string;
}) {
  const [q, setQ] = useState("");
  const [lv, setLv] = useState("all");
  const levels = [...new Set(list.map((s) => s.level))].sort((a, b) => a - b);
  const shown = list.filter((s) => (lv === "all" || s.level === Number(lv)) && s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Panel title={title} aside={<Counter value={selected.length} max={Math.min(max, list.length)} />}>
      {hint && <p className="mb-3 text-xs text-[#64748b]">{hint}</p>}
      <div className="mb-3 flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar magia…" className={inputCls} />
        {levels.length > 1 && (
          <select className={selectCls} value={lv} onChange={(e) => setLv(e.target.value)} aria-label="Filtrar por nível">
            <option value="all">Todos</option>
            {levels.map((l) => <option key={l} value={l}>{l}º nível</option>)}
          </select>
        )}
      </div>
      <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
        {shown.map((s) => (
          <SpellPickItem key={s.id} spell={s} selected={selected.includes(s.id)} disabled={selected.length >= max}
            onToggle={() => onChange(toggleIn(selected, s.id, max))} />
        ))}
        {!shown.length && <p className="py-4 text-center text-xs text-[#64748b]">Nenhuma magia encontrada.</p>}
      </div>
    </Panel>
  );
}

export default function SpellsStep({ state, update }: Props) {
  const r = resolvedSpells(state);
  const plan = r.plan;
  if (!plan) return null;
  const bookSpells = plan.spellList.filter((s) => r.spells.includes(s.id));
  return (
    <div className="space-y-4">
      <StepTitle
        title="Escolha suas magias"
        hint={`Atributo de conjuração: ${ABILITY_NAME[plan.sc.ability]} · magias até o ${plan.maxLevel}º nível${plan.sc.kind === "pact" ? " (Magia de Pacto)" : ""}.`}
      />
      {plan.cantrips > 0 && (
        <Picker title="Truques" list={plan.cantripList} selected={r.cantrips} max={plan.cantrips} onChange={(cantrips) => update({ cantrips })} />
      )}
      {plan.mode === "known" && plan.known > 0 && (
        <Picker title="Magias conhecidas" list={plan.spellList} selected={r.spells} max={plan.known} onChange={(spells) => update({ spells })} />
      )}
      {plan.mode === "prepared" && (
        <Picker title="Magias preparadas" list={plan.spellList} selected={r.spells} max={plan.prepared} onChange={(spells) => update({ spells })}
          hint="Você conhece toda a lista da classe e prepara um número limitado a cada descanso longo. Aqui é a preparação inicial." />
      )}
      {plan.mode === "book" && (
        <>
          <Picker title="Grimório" list={plan.spellList} selected={r.spells} max={plan.known} onChange={(spells) => update({ spells, prepared: state.prepared.filter((id) => spells.includes(id)) })}
            hint="Magias de 1º nível+ registradas no seu grimório." />
          <Picker title="Magias preparadas" list={bookSpells} selected={r.prepared} max={plan.prepared} onChange={(prepared) => update({ prepared })}
            hint="Escolha, entre as do grimório, as que estarão preparadas." />
        </>
      )}
    </div>
  );
}
