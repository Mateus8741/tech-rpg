"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createCharacter } from "@/lib/api";
import { cn } from "@/lib/utils";
import { activeSteps, buildCharacterPayload, stepErrors } from "./build";
import { STEP_LABELS, initialState, type StepId, type WizardState } from "./state";
import RaceStep from "./RaceStep";
import ClassStep from "./ClassStep";
import BackgroundStep from "./BackgroundStep";
import AbilitiesStep from "./AbilitiesStep";
import SpellsStep from "./SpellsStep";
import DetailsStep from "./DetailsStep";
import SummaryPanel from "./SummaryPanel";

export default function CharacterWizard({ username }: { username: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [state, setState] = useState<WizardState>(initialState);
  const [stepId, setStepId] = useState<StepId>("race");
  const [dir, setDir] = useState(1);
  const [saving, setSaving] = useState(false);

  const update = useCallback((patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch })), []);

  const steps = activeSteps(state);
  const idx = Math.max(0, steps.indexOf(stepId));
  const current = steps[idx] ?? "race";
  const errors = stepErrors(state, current);
  const last = idx === steps.length - 1;

  const go = (target: number) => {
    setDir(target > idx ? 1 : -1);
    setStepId(steps[target] ?? "race");
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const canReach = (target: number) => steps.slice(0, target).every((s) => stepErrors(state, s).length === 0);

  const submit = async () => {
    for (const s of steps) if (stepErrors(state, s).length) { toast.error(stepErrors(state, s)[0]); go(steps.indexOf(s)); return; }
    setSaving(true);
    try {
      const created = await createCharacter(username, buildCharacterPayload(state));
      toast.success("Personagem criado!");
      router.push(`/characters/${created.id}`);
    } catch {
      toast.error("Erro ao criar personagem. Tente novamente.");
      setSaving(false);
    }
  };

  const slide = reduce ? { opacity: 0 } : { opacity: 0, x: 24 * dir };
  const props = { state, update };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-ink"><Sparkles className="h-5 w-5 text-gold-ink" /> Novo personagem</h1>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-3" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={idx + 1}>
          <motion.div className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" initial={false}
            animate={{ width: `${((idx + 1) / steps.length) * 100}%` }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }} />
        </div>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="Passos">
          {steps.map((s, i) => {
            const reachable = i <= idx || canReach(i);
            return (
              <button key={s} type="button" disabled={!reachable} onClick={() => go(i)} aria-current={i === idx ? "step" : undefined}
                className={cn("rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]",
                  i === idx ? "border-[#6366f1] bg-[#6366f1]/20 text-indigo-ink-soft" : reachable ? "border-line text-ink-soft hover:border-[#6366f1]/50" : "cursor-not-allowed border-line text-ink-faint")}>
                {i + 1}. {STEP_LABELS[s]}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={current} initial={slide} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 * dir }} transition={{ duration: reduce ? 0 : 0.2 }}>
              {current === "race" && <RaceStep {...props} />}
              {current === "class" && <ClassStep {...props} />}
              {current === "background" && <BackgroundStep {...props} />}
              {current === "abilities" && <AbilitiesStep {...props} />}
              {current === "spells" && <SpellsStep {...props} />}
              {current === "details" && <DetailsStep {...props} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 border-t border-line pt-4">
            {errors.length > 0 && (
              <ul className="mb-3 space-y-0.5 text-xs text-gold-ink" role="status">
                {errors.map((e) => <li key={e}>• {e}</li>)}
              </ul>
            )}
            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" disabled={idx === 0 || saving} onClick={() => go(idx - 1)}
                className="gap-2 border-line bg-transparent text-ink-soft hover:bg-surface-3/50 hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              {last ? (
                <Button type="button" disabled={errors.length > 0 || saving} onClick={submit} className="gap-2 bg-[#6366f1] text-white hover:bg-[#5558e6]">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Criar personagem
                </Button>
              ) : (
                <Button type="button" disabled={errors.length > 0} onClick={() => go(idx + 1)} className="gap-2 bg-[#6366f1] text-white hover:bg-[#5558e6]">
                  Avançar <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <SummaryPanel state={state} />
      </div>
    </div>
  );
}
