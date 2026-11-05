"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dices, X } from "lucide-react";
import { DicePanel } from "./DicePanel";

/** Botão flutuante no canto inferior direito que abre um painel de rolagem rápida. */
export function DiceTray() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Rolador de dados"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="max-h-[80vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-canvas p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Rolagem rápida</h2>
              <button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="rounded p-1 text-ink-muted hover:text-ink">
                <X className="h-4 w-4" />
              </button>
            </div>
            <DicePanel compact />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label={open ? "Fechar rolador de dados" : "Abrir rolador de dados"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        whileHover={reduce ? undefined : { scale: 1.08 }}
        whileTap={reduce ? undefined : { scale: 0.92, rotate: 90 }}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/30"
      >
        <Dices className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
