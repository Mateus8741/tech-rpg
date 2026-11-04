"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ABILITIES, POINT_BUY_BUDGET, POINT_BUY_COST, STANDARD_ARRAY, abilityModifier, formatModifier } from "@repo/rules";
import { Dices, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberField, Panel, StepTitle, selectCls } from "./ui";
import { baseScores, finalScores, pointBuySpent, racialBonuses, rollTotal } from "./build";
import type { AbilityMode, WizardState } from "./state";
import { cn } from "@/lib/utils";

interface Props { state: WizardState; update: (p: Partial<WizardState>) => void }

const MODES: { id: AbilityMode; label: string; hint: string }[] = [
  { id: "standard", label: "Array Padrão", hint: "15, 14, 13, 12, 10, 8" },
  { id: "pointbuy", label: "Compra de Pontos", hint: `${POINT_BUY_BUDGET} pontos` },
  { id: "roll", label: "Rolagem 4d6", hint: "descarta o menor" },
  { id: "manual", label: "Manual", hint: "digite os valores (1 a 20)" },
];

const d6 = () => 1 + Math.floor(Math.random() * 6);

export default function AbilitiesStep({ state, update }: Props) {
  const reduce = useReducedMotion();
  const [rolling, setRolling] = useState(false);
  const [flicker, setFlicker] = useState<number[][]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const bonus = racialBonuses(state);
  const base = baseScores(state);
  const final = finalScores(state);
  const spent = pointBuySpent(state.pointBuy);

  const rollAll = () => {
    const result = Array.from({ length: 6 }, () => Array.from({ length: 4 }, d6));
    const done = () => { update({ rolls: result, rollAssign: { str: null, dex: null, con: null, int: null, wis: null, cha: null } }); setRolling(false); setFlicker([]); };
    if (reduce) return done();
    setRolling(true);
    let ticks = 0;
    timer.current = setInterval(() => {
      ticks++;
      setFlicker(Array.from({ length: 6 }, () => Array.from({ length: 4 }, d6)));
      if (ticks >= 12) { if (timer.current) clearInterval(timer.current); done(); }
    }, 70);
  };

  const dice = rolling ? flicker : state.rolls;
  const usedStd = new Set(ABILITIES.map((a) => state.standard[a.key]).filter((v) => v != null));
  const usedRoll = new Set(ABILITIES.map((a) => state.rollAssign[a.key]).filter((v) => v != null));

  return (
    <div>
      <StepTitle title="Distribua seus atributos" hint="Os bônus raciais são somados automaticamente ao valor base." />
      <div className="mb-5 grid gap-2 sm:grid-cols-4">
        {MODES.map((m) => (
          <button key={m.id} type="button" onClick={() => update({ abilityMode: m.id })} aria-pressed={state.abilityMode === m.id}
            className={cn("rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
              state.abilityMode === m.id ? "border-[#6366f1] bg-[#6366f1]/10" : "border-[#1e2035] bg-[#0f1117] hover:border-[#6366f1]/50")}>
            <div className="text-sm font-semibold text-[#e2e8f0]">{m.label}</div>
            <div className="text-xs text-[#64748b]">{m.hint}</div>
          </button>
        ))}
      </div>

      {state.abilityMode === "pointbuy" && (
        <p className="mb-3 text-sm text-[#94a3b8]">
          Pontos restantes: <span className={cn("font-semibold tabular-nums", spent > POINT_BUY_BUDGET ? "text-red-400" : "text-[#f5c451]")}>{POINT_BUY_BUDGET - spent}</span> / {POINT_BUY_BUDGET}
        </p>
      )}
      {state.abilityMode === "roll" && (
        <div className="mb-4 rounded-xl border border-[#1e2035] bg-[#0f1117] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#94a3b8]">Role 4d6 seis vezes; o menor dado de cada rolagem é descartado.</p>
            <Button type="button" onClick={rollAll} disabled={rolling} className="shrink-0 gap-2 bg-[#6366f1] text-white hover:bg-[#5558e6]">
              <Dices className="h-4 w-4" /> {state.rolls.length ? "Rolar de novo" : "Rolar"}
            </Button>
          </div>
          {dice.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {dice.map((set, i) => {
                const min = set.indexOf(Math.min(...set));
                return (
                  <motion.div key={i} animate={rolling && !reduce ? { rotate: [-2, 2, -2] } : { rotate: 0 }} transition={{ duration: 0.2, repeat: rolling ? Infinity : 0 }}
                    className="rounded-lg border border-[#1e2035] bg-[#0a0c14] p-2 text-center">
                    <div className="flex justify-center gap-1">
                      {set.map((v, j) => (
                        <span key={j} className={cn("flex h-6 w-6 items-center justify-center rounded text-xs font-semibold tabular-nums",
                          j === min && !rolling ? "bg-[#1e2035] text-[#475569] line-through" : "bg-[#6366f1]/20 text-[#c7d2fe]")}>{v}</span>
                      ))}
                    </div>
                    <div className="mt-1 text-lg font-bold tabular-nums text-[#f5c451]">{rollTotal(set)}</div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Panel>
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-x-3 gap-y-2 text-sm">
          <span className="text-xs text-[#64748b]">Atributo</span>
          <span className="text-center text-xs text-[#64748b]">Base</span>
          <span className="text-center text-xs text-[#64748b]">Racial</span>
          <span className="text-center text-xs text-[#64748b]">Final</span>
          <span className="text-center text-xs text-[#64748b]">Mod.</span>
          {ABILITIES.map((a) => {
            const k = a.key;
            return (
              <div key={k} className="contents">
                <div>
                  <div className="font-medium text-[#e2e8f0]">{a.name}</div>
                  <div className="mt-1">
                    {state.abilityMode === "standard" && (
                      <select className={selectCls} aria-label={`Valor de ${a.name}`} value={state.standard[k] ?? ""}
                        onChange={(e) => update({ standard: { ...state.standard, [k]: e.target.value ? Number(e.target.value) : null } })}>
                        <option value="">—</option>
                        {STANDARD_ARRAY.map((v) => <option key={v} value={v} disabled={usedStd.has(v) && state.standard[k] !== v}>{v}</option>)}
                      </select>
                    )}
                    {state.abilityMode === "pointbuy" && (
                      <div className="flex items-center gap-2">
                        <Button type="button" size="icon" variant="outline" className="h-7 w-7 border-[#1e2035] bg-transparent" aria-label={`Diminuir ${a.name}`}
                          disabled={state.pointBuy[k] <= 8} onClick={() => update({ pointBuy: { ...state.pointBuy, [k]: state.pointBuy[k] - 1 } })}><Minus className="h-3 w-3" /></Button>
                        <span className="w-6 text-center tabular-nums text-[#e2e8f0]">{state.pointBuy[k]}</span>
                        <Button type="button" size="icon" variant="outline" className="h-7 w-7 border-[#1e2035] bg-transparent" aria-label={`Aumentar ${a.name}`}
                          disabled={state.pointBuy[k] >= 15 || spent - (POINT_BUY_COST[state.pointBuy[k]] ?? 0) + (POINT_BUY_COST[state.pointBuy[k] + 1] ?? 99) > POINT_BUY_BUDGET}
                          onClick={() => update({ pointBuy: { ...state.pointBuy, [k]: state.pointBuy[k] + 1 } })}><Plus className="h-3 w-3" /></Button>
                        <span className="text-[11px] text-[#64748b]">custo {POINT_BUY_COST[state.pointBuy[k]]}</span>
                      </div>
                    )}
                    {state.abilityMode === "manual" && (
                      <NumberField label={`Valor de ${a.name}`} value={state.manual[k]} min={1} max={20}
                        onCommit={(n) => update({ manual: { ...state.manual, [k]: n } })}
                        className="h-8 w-20 rounded-md border border-[#1e2035] bg-[#0a0c14] px-2 text-center text-sm tabular-nums text-[#e2e8f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]" />
                    )}
                    {state.abilityMode === "roll" && (
                      <select className={selectCls} aria-label={`Rolagem de ${a.name}`} disabled={!state.rolls.length || rolling} value={state.rollAssign[k] ?? ""}
                        onChange={(e) => update({ rollAssign: { ...state.rollAssign, [k]: e.target.value === "" ? null : Number(e.target.value) } })}>
                        <option value="">—</option>
                        {state.rolls.map((set, i) => <option key={i} value={i} disabled={usedRoll.has(i) && state.rollAssign[k] !== i}>{rollTotal(set)} (rolagem {i + 1})</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <span className="text-center tabular-nums text-[#94a3b8]">{base[k]}</span>
                <span className={cn("text-center tabular-nums", bonus[k] ? "text-[#f5c451]" : "text-[#475569]")}>{bonus[k] ? `+${bonus[k]}` : "—"}</span>
                <span className="text-center text-lg font-bold tabular-nums text-[#e2e8f0]">{final[k]}</span>
                <span className="text-center font-semibold tabular-nums text-[#a5b4fc]">{formatModifier(abilityModifier(final[k]))}</span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
