"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SKILLS, formatModifier, proficiencyBonus, spellSlotsFor, type ClassDef, type ClassFeature } from "@repo/rules";
import { AnimatedTabs, Chip, Header, Page, Panel, RuleText, abilityName } from "./kit";

const KIND: Record<string, string> = { full: "Completo", half: "Meio-conjurador", third: "Um terço", pact: "Pacto" };

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
      <span className="shrink-0 text-ink-muted">{k}</span><span className="text-right text-ink">{v}</span>
    </div>
  );
}

function Timeline({ features }: { features: ClassFeature[] }) {
  const reduce = useReducedMotion();
  return (
    <ol className="relative space-y-5 border-l border-line pl-6">
      {features.map((f, i) => (
        <motion.li
          key={`${f.level}-${f.name}-${i}`}
          initial={reduce ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-[#6366f1] bg-base">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6]" />
          </span>
          <div className="flex items-center gap-2">
            <Chip tone="gold">Nível {f.level}</Chip>
            <h3 className="text-sm font-semibold text-ink">{f.name}</h3>
          </div>
          <RuleText text={f.description} className="mt-1.5" />
        </motion.li>
      ))}
    </ol>
  );
}

export default function ClassDetail({ cls: c }: { cls: ClassDef }) {
  const skillName = (k: string) => SKILLS.find((s) => s.key === k)?.name ?? k;
  const sc = c.spellcasting;
  const cols = c.progressionColumns ?? [];
  const slotCols = sc && sc.kind !== "pact" ? 9 : 0;
  const featuresAt = (lv: number) => c.features.filter((f) => f.level === lv).map((f) => f.name).join(", ") || "—";
  const maxSlotLevel = sc && sc.kind !== "pact" ? Math.max(...Array.from({ length: 20 }, (_, i) => spellSlotsFor(sc.kind, i + 1).length), 0) : 0;

  const progression = (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-surface text-[11px] uppercase tracking-wider text-ink-muted">
          <tr>
            <th className="px-3 py-2.5">Nível</th>
            <th className="px-3 py-2.5">Prof.</th>
            <th className="px-3 py-2.5">Características</th>
            {cols.map((col) => <th key={col.label} className="px-3 py-2.5">{col.label}</th>)}
            {sc?.cantripsKnown && <th className="px-3 py-2.5">Truques</th>}
            {sc?.spellsKnown && <th className="px-3 py-2.5">Magias</th>}
            {Array.from({ length: maxSlotLevel }, (_, i) => <th key={i} className="px-2 py-2.5 text-center">{i + 1}º</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((lv) => {
            const slots = sc && slotCols ? spellSlotsFor(sc.kind, lv) : [];
            return (
              <tr key={lv} className="border-t border-line transition-colors hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-semibold text-gold-ink">{lv}</td>
                <td className="px-3 py-2 text-indigo-ink">{formatModifier(proficiencyBonus(lv))}</td>
                <td className="px-3 py-2 text-ink-body">{featuresAt(lv)}</td>
                {cols.map((col) => <td key={col.label} className="px-3 py-2 text-ink-body">{col.values[lv - 1] ?? "—"}</td>)}
                {sc?.cantripsKnown && <td className="px-3 py-2 text-ink-body">{sc.cantripsKnown[lv - 1] ?? "—"}</td>}
                {sc?.spellsKnown && <td className="px-3 py-2 text-ink-body">{sc.spellsKnown[lv - 1] ?? "—"}</td>}
                {Array.from({ length: maxSlotLevel }, (_, i) => <td key={i} className="px-2 py-2 text-center text-ink-body">{slots[i] ?? "—"}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { label: "Progressão", content: progression },
    { label: "Características", content: <Timeline features={c.features} /> },
    ...(c.subclasses.length ? [{
      label: c.subclassLabel,
      content: (
        <AnimatedTabs tabs={c.subclasses.map((s) => ({
          label: s.name,
          content: (
            <Panel>
              <Chip tone="gold">Escolhida no nível {s.level}</Chip>
              <RuleText text={s.description} className="mt-3" />
              <div className="mt-5"><Timeline features={s.features} /></div>
            </Panel>
          ),
        }))} />
      ),
    }] : []),
    ...(sc ? [{
      label: "Conjuração",
      content: (
        <Panel>
          <Row k="Atributo de conjuração" v={abilityName(sc.ability)} />
          <Row k="Tipo" v={KIND[sc.kind] ?? sc.kind} />
          <Row k="Prepara magias" v={sc.preparesSpells ? "Sim" : "Não, conhece um número fixo"} />
          <Row k="Conjuração ritual" v={sc.ritualCasting ? "Sim" : "Não"} />
          {sc.focus && <Row k="Foco" v={sc.focus} />}
        </Panel>
      ),
    }] : []),
  ];

  return (
    <Page>
      <Header back={{ href: "/compendio/classes", label: "Classes" }} eyebrow="Classe" title={c.name} subtitle={c.summary} />
      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Características de Classe">
          <Row k="Dado de vida" v={`d${c.hitDie}`} />
          <Row k="Atributos principais" v={c.primaryAbilities.map(abilityName).join(", ")} />
          <Row k="Resistências" v={c.savingThrows.map(abilityName).join(", ")} />
          <Row k="Armaduras" v={c.armorProficiencies.join(", ") || "Nenhuma"} />
          <Row k="Armas" v={c.weaponProficiencies.join(", ") || "Nenhuma"} />
          <Row k="Ferramentas" v={c.toolProficiencies.join(", ") || "Nenhuma"} />
          <Row k="Perícias" v={`Escolha ${c.skillChoices.count}: ${c.skillChoices.from === "any" ? "quaisquer" : c.skillChoices.from.map(skillName).join(", ")}`} />
        </Panel>
        <Panel title="Equipamento Inicial">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-body marker:text-indigo-ink">
            {c.startingEquipment.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Panel>
      </div>
      <AnimatedTabs tabs={tabs} />
    </Page>
  );
}
