"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Dices } from "lucide-react";
import { SKILLS, type Background } from "@repo/rules";
import { Chip, Header, Page, Panel, RuleText } from "./kit";

type Kind = "traits" | "ideals" | "bonds" | "flaws";
const LABEL: Record<Kind, string> = { traits: "Traço de Personalidade", ideals: "Ideal", bonds: "Vínculo", flaws: "Defeito" };

function Table({ kind, items, highlight }: { kind: Kind; items: string[]; highlight?: number }) {
  return (
    <Panel title={LABEL[kind]}>
      <ol className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className={`flex gap-3 rounded-md px-2 py-1.5 text-sm transition-colors ${highlight === i ? "bg-[#f5c451]/10 text-[#f5c451]" : "text-[#cbd5e1]"}`}>
            <span className="w-5 shrink-0 text-right font-semibold text-[#64748b]">{i + 1}</span>
            <span>{t}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export default function BackgroundDetail({ background: b }: { background: Background }) {
  const reduce = useReducedMotion();
  const skillName = (k: string) => SKILLS.find((s) => s.key === k)?.name ?? k;
  const p = b.personality;
  const lists: Record<Kind, string[]> = { traits: p.traits, ideals: p.ideals, bonds: p.bonds, flaws: p.flaws };
  const [roll, setRoll] = useState<Record<Kind, number> | null>(null);
  const [n, setN] = useState(0);

  const doRoll = () => {
    const r = {} as Record<Kind, number>;
    (Object.keys(lists) as Kind[]).forEach((k) => { r[k] = Math.floor(Math.random() * Math.max(lists[k].length, 1)); });
    setRoll(r); setN((x) => x + 1);
  };

  return (
    <Page>
      <Header back={{ href: "/compendio/antecedentes", label: "Antecedentes" }} eyebrow="Antecedente" title={b.name} subtitle={b.summary} />
      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        <Panel title="Proficiências e Equipamento" className="lg:col-span-1">
          <p className="mb-1 text-xs text-[#64748b]">Perícias</p>
          <div className="mb-3 flex flex-wrap gap-1.5">{b.skills.map((s) => <Chip key={s} tone="accent">{skillName(s)}</Chip>)}</div>
          {b.tools.length > 0 && <><p className="mb-1 text-xs text-[#64748b]">Ferramentas</p><p className="mb-3 text-sm text-[#cbd5e1]">{b.tools.join(", ")}</p></>}
          {b.languages > 0 && <p className="mb-3 text-sm text-[#cbd5e1]">{b.languages} idioma(s) à escolha</p>}
          <p className="mb-1 text-xs text-[#64748b]">Equipamento</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-[#cbd5e1] marker:text-[#6366f1]">{b.equipment.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </Panel>
        <Panel title={`Característica: ${b.feature.name}`} className="lg:col-span-2">
          <RuleText text={b.feature.description} />
        </Panel>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f5c451]">Personalidade</h2>
        <button onClick={doRoll} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95">
          <Dices className="h-4 w-4" /> Rolar
        </button>
      </div>

      <AnimatePresence>
        {roll && (
          <motion.div
            key={n}
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 grid gap-3 rounded-xl border border-[#f5c451]/30 bg-[#f5c451]/5 p-5 sm:grid-cols-2"
          >
            {(Object.keys(lists) as Kind[]).map((k) => (
              <div key={k}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#f5c451]">{LABEL[k]} (#{roll[k] + 1})</p>
                <p className="mt-1 text-sm text-[#e2e8f0]">{lists[k][roll[k]] ?? "—"}</p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 md:grid-cols-2">
        {(Object.keys(lists) as Kind[]).map((k) => <Table key={k} kind={k} items={lists[k]} highlight={roll?.[k]} />)}
      </div>
    </Page>
  );
}
