"use client";

import type { Feat } from "@repo/rules";
import { Chip, Header, Page, Panel, RuleText } from "./kit";

export default function FeatDetail({ feat: f }: { feat: Feat }) {
  return (
    <Page>
      <Header back={{ href: "/compendio/talentos", label: "Talentos" }} eyebrow="Talento" title={f.name} subtitle={f.description} />
      <div className="mb-5 flex flex-wrap gap-1.5">
        <Chip tone="accent">{f.source}</Chip>
        {f.category && <Chip>{`Categoria: ${f.category}`}</Chip>}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Pré-requisito" className="lg:col-span-1">
          <RuleText text={f.prerequisite ?? "Nenhum"} />
          <p className="mb-1 mt-4 text-xs text-ink-muted">Fonte</p>
          <p className="text-sm text-ink-body">{f.source}</p>
        </Panel>
        <Panel title="Benefícios" className="lg:col-span-2">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-body marker:text-indigo-ink">
            {f.benefits.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </Panel>
      </div>
    </Page>
  );
}
