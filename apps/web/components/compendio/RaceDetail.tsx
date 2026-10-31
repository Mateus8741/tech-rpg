"use client";

import { SKILLS, type Race, type Trait } from "@repo/rules";
import { AnimatedTabs, Chip, Header, Page, Panel, RuleText } from "./kit";
import { bonusLabel } from "./RaceList";

function Traits({ traits }: { traits: Trait[] }) {
  if (!traits.length) return <p className="text-sm text-[#64748b]">Sem traços adicionais.</p>;
  return (
    <div className="space-y-4">
      {traits.map((t) => (
        <div key={t.name}>
          <h3 className="text-sm font-semibold text-[#e2e8f0]">{t.name}</h3>
          <RuleText text={t.description} className="mt-1" />
        </div>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#1e2035] py-2 text-sm last:border-0">
      <span className="text-[#64748b]">{k}</span><span className="text-right text-[#e2e8f0]">{v}</span>
    </div>
  );
}

export default function RaceDetail({ race: r }: { race: Race }) {
  const skillName = (k: string) => SKILLS.find((s) => s.key === k)?.name ?? k;
  const p = r.proficiencies;
  return (
    <Page>
      <Header back={{ href: "/compendio/racas", label: "Raças" }} eyebrow="Raça" title={r.name} subtitle={r.summary} />
      <div className="mb-6 flex flex-wrap gap-2">
        {bonusLabel(r.abilityBonuses).map((b) => <Chip key={b} tone="accent">{b}</Chip>)}
        {r.abilityChoice && <Chip tone="accent">+{r.abilityChoice.amount} em {r.abilityChoice.count} atributos à escolha</Chip>}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Resumo" className="lg:col-span-1">
          <Row k="Tamanho" v={r.size} />
          <Row k="Deslocamento" v={`${r.speed} m`} />
          <Row k="Idiomas" v={r.languages.join(", ") + (r.extraLanguages ? ` + ${r.extraLanguages} à escolha` : "")} />
          <Row k="Tendência" v={r.alignment} />
          {p?.skills && <Row k="Perícias" v={p.skills.map(skillName).join(", ")} />}
          {p?.weapons && <Row k="Armas" v={p.weapons.join(", ")} />}
          {p?.armor && <Row k="Armaduras" v={p.armor.join(", ")} />}
          {p?.tools && <Row k="Ferramentas" v={p.tools.join(", ")} />}
        </Panel>
        <div className="space-y-5 lg:col-span-2">
          <Panel title="Descrição">
            <RuleText text={r.age} />
            <RuleText text={r.sizeNote} className="mt-3" />
          </Panel>
          <Panel title="Traços Raciais"><Traits traits={r.traits} /></Panel>
        </div>
      </div>
      {r.subraces.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f5c451]">Sub-raças</h2>
          <AnimatedTabs
            tabs={r.subraces.map((s) => ({
              label: s.name,
              content: (
                <Panel>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {bonusLabel(s.abilityBonuses).map((b) => <Chip key={b} tone="accent">{b}</Chip>)}
                    {s.speed !== undefined && <Chip>{s.speed} m</Chip>}
                  </div>
                  <Traits traits={s.traits} />
                </Panel>
              ),
            }))}
          />
        </div>
      )}
    </Page>
  );
}
