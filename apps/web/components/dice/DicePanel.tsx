"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RollResult } from "./DiceFace";
import { useDiceRoller, type RollMode } from "./useDiceRoller";

export const DICE = [4, 6, 8, 10, 12, 20, 100] as const;

const MODES: { id: RollMode; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "advantage", label: "Vantagem" },
  { id: "disadvantage", label: "Desvantagem" },
];

/** Conteúdo completo do rolador (usado na página e no DiceTray). */
export function DicePanel({ compact = false, showHistory = true }: { compact?: boolean; showHistory?: boolean }) {
  const { history, last, roll, rollDie, clear } = useDiceRoller();
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<RollMode>("normal");
  const [expr, setExpr] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expr.trim()) return;
    const r = roll(expr, mode);
    setError(r ? "" : "Expressão inválida. Use algo como 2d6+3.");
  };

  return (
    <div className="space-y-4">
      <RollResult roll={last} />

      <div className="flex justify-center gap-1 rounded-lg border border-line bg-base p-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            aria-pressed={mode === m.id}
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              mode === m.id ? "bg-[#6366f1] text-white" : "text-ink-muted hover:text-ink",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>
      {mode !== "normal" && <p className="-mt-2 text-center text-[10px] text-ink-muted">Vale apenas para o d20.</p>}

      <div className={cn("grid gap-2", compact ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-7")}>
        {DICE.map((d) => (
          <motion.button
            key={d}
            type="button"
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.88, rotate: -8 }}
            onClick={() => rollDie(d, d === 20 ? mode : "normal")}
            className={cn(
              "rounded-xl border py-3 text-sm font-bold transition-colors",
              d === 20
                ? "border-[#f5c451]/50 bg-[#f5c451]/10 text-gold-ink hover:bg-[#f5c451]/20"
                : "border-line bg-canvas text-ink hover:border-[#6366f1]",
            )}
          >
            d{d}
          </motion.button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-1">
        <div className="flex gap-2">
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="2d6+3"
            aria-label="Expressão de dados"
            className="h-10 min-w-0 flex-1 rounded-lg border border-line bg-canvas px-3 text-sm text-ink placeholder:text-ink-muted focus:border-[#6366f1] focus:outline-none"
          />
          <button type="submit" className="h-10 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 text-sm font-semibold text-white hover:opacity-90">
            Rolar
          </button>
        </div>
        {error && <p role="alert" className="text-xs text-danger">{error}</p>}
      </form>

      {showHistory && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Histórico</h3>
            {history.length > 0 && (
              <button type="button" onClick={clear} className="flex items-center gap-1 text-xs text-ink-muted hover:text-danger">
                <Trash2 className="h-3 w-3" /> Limpar
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="py-3 text-center text-xs text-ink-muted">Nenhuma rolagem ainda.</p>
          ) : (
            <ul className={cn("space-y-1 overflow-y-auto pr-1", compact ? "max-h-40" : "max-h-72")}>
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs">
                  <span className="text-ink-muted">
                    <span className="font-medium text-ink">{h.expr}</span>
                    {h.mode !== "normal" && <span className="text-violet-ink"> {h.mode === "advantage" ? "vant." : "desv."}</span>}
                    {" "}[{h.rolls.join(", ")}]
                  </span>
                  <span className={cn("text-base font-bold tabular-nums", h.crit === "max" ? "text-gold-ink" : h.crit === "min" ? "text-danger" : "text-ink")}>
                    {h.total}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
