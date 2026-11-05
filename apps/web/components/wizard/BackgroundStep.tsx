"use client";

import { BACKGROUNDS, SKILLS } from "@repo/rules";
import { Dices } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip, Counter, OptionCard, Panel, StepTitle, Tag, TraitList, inputCls, toggleIn } from "./ui";
import { LANGUAGES, allLanguages, backgroundOf } from "./build";
import type { WizardState } from "./state";

interface Props { state: WizardState; update: (p: Partial<WizardState>) => void }

const FIELDS = [
  { key: "traits", label: "Traços de personalidade" },
  { key: "ideals", label: "Ideais" },
  { key: "bonds", label: "Vínculos" },
  { key: "flaws", label: "Defeitos" },
] as const;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)] as T;

export default function BackgroundStep({ state, update }: Props) {
  const bg = backgroundOf(state);
  const known = allLanguages({ ...state, bgLanguages: [] });

  const roll = (key: (typeof FIELDS)[number]["key"]) => {
    if (!bg) return;
    update({ personality: { ...state.personality, [key]: pick(bg.personality[key]) } });
  };
  const rollAll = () => {
    if (!bg) return;
    update({ personality: { traits: pick(bg.personality.traits), ideals: pick(bg.personality.ideals), bonds: pick(bg.personality.bonds), flaws: pick(bg.personality.flaws) } });
  };

  return (
    <div>
      <StepTitle title="Escolha seu antecedente" hint="O antecedente conta de onde você veio e concede perícias, ferramentas e equipamento." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {BACKGROUNDS.map((b) => (
          <OptionCard key={b.id} selected={b.id === state.backgroundId}
            onClick={() => b.id !== state.backgroundId && update({ backgroundId: b.id, bgLanguages: [], personality: { traits: "", ideals: "", bonds: "", flaws: "" } })}
            title={b.name} subtitle={b.skills.map((k) => SKILLS.find((s) => s.key === k)!.name).join(" · ")}>
            <span className="line-clamp-3">{b.summary}</span>
          </OptionCard>
        ))}
      </div>

      {bg && (
        <div className="mt-6 space-y-4">
          <Panel title={`${bg.name} — resumo`}>
            <p className="text-sm leading-relaxed text-ink-soft">{bg.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag tone="gold">Perícias: {bg.skills.map((k) => SKILLS.find((s) => s.key === k)!.name).join(", ")}</Tag>
              {bg.tools.length > 0 && <Tag tone="indigo">Ferramentas: {bg.tools.join(", ")}</Tag>}
              {bg.languages > 0 && <Tag>Idiomas à escolha: {bg.languages}</Tag>}
            </div>
            <ul className="mt-3 list-disc space-y-0.5 pl-5 text-xs text-ink-muted">
              {bg.equipment.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </Panel>

          {bg.languages > 0 && (
            <Panel title="Idiomas do antecedente" aside={<Counter value={state.bgLanguages.length} max={bg.languages} />}>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.filter((l) => !known.includes(l)).map((l) => (
                  <Chip key={l} selected={state.bgLanguages.includes(l)} disabled={state.bgLanguages.length >= bg.languages}
                    onClick={() => update({ bgLanguages: toggleIn(state.bgLanguages, l, bg.languages) })}>{l}</Chip>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Característica do antecedente"><TraitList traits={[bg.feature]} /></Panel>

          <Panel title="Personalidade" aside={
            <Button type="button" size="sm" variant="outline" onClick={rollAll} className="h-7 gap-1 border-line bg-transparent text-xs text-indigo-ink hover:bg-[#6366f1]/10">
              <Dices className="h-3.5 w-3.5" /> Sortear tudo
            </Button>
          }>
            <div className="space-y-3">
              {FIELDS.map((f) => (
                <div key={f.key}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-ink-soft">{f.label}</span>
                    <button type="button" onClick={() => roll(f.key)} className="flex items-center gap-1 text-[11px] text-violet-ink hover:text-violet-ink">
                      <Dices className="h-3 w-3" /> Sortear
                    </button>
                  </div>
                  <textarea rows={2} aria-label={f.label} value={state.personality[f.key]}
                    onChange={(e) => update({ personality: { ...state.personality, [f.key]: e.target.value } })}
                    className={`w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 ${inputCls}`} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
