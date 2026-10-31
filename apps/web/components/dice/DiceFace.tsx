"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DiceRoll } from "./useDiceRoller";

/** Resultado grande: o dado gira e o número aparece; ouro em 20 natural, vermelho em 1. */
export function RollResult({ roll, className }: { roll: DiceRoll | null; className?: string }) {
  const reduce = useReducedMotion();
  const color =
    roll?.crit === "max" ? "text-[#f5c451]" : roll?.crit === "min" ? "text-[#ef4444]" : "text-[#e2e8f0]";
  const glow =
    roll?.crit === "max" ? "shadow-[0_0_40px_#f5c45166] border-[#f5c451]"
    : roll?.crit === "min" ? "shadow-[0_0_40px_#ef444466] border-[#ef4444]"
    : "border-[#1e2035]";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <AnimatePresence mode="wait">
          {roll ? (
            <motion.div
              key={roll.id}
              className={cn("absolute inset-0 flex items-center justify-center rounded-2xl border-2 bg-[#0a0c14]", glow)}
              style={{ rotate: 0 }}
              initial={reduce ? { opacity: 0 } : { rotate: -360, scale: 0.4, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <motion.span
                className={cn("text-5xl font-extrabold tabular-nums", color)}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.35, type: "spring", stiffness: 400, damping: 18 }}
              >
                {roll.total}
              </motion.span>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-dashed border-[#1e2035] text-3xl text-[#64748b]">
              ?
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="h-10 text-center text-xs text-[#64748b]">
        {roll ? (
          <>
            <div className="font-medium text-[#e2e8f0]">
              {roll.expr}
              {roll.mode !== "normal" && (
                <span className="ml-1 text-[#8b5cf6]">({roll.mode === "advantage" ? "vantagem" : "desvantagem"})</span>
              )}
            </div>
            <div>
              [{roll.rolls.join(", ")}]{roll.bonus ? ` ${roll.bonus > 0 ? "+" : "−"} ${Math.abs(roll.bonus)}` : ""}
              {roll.discarded && <span className="ml-1 line-through opacity-60">[{roll.discarded.rolls.join(", ")}] {roll.discarded.total}</span>}
            </div>
            {roll.crit === "max" && <div className="font-bold text-[#f5c451]">Acerto crítico! 20 natural</div>}
            {roll.crit === "min" && <div className="font-bold text-[#ef4444]">Falha crítica! 1 natural</div>}
          </>
        ) : (
          "Role um dado"
        )}
      </div>
    </div>
  );
}
