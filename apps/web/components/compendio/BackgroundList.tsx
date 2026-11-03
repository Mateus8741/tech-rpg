"use client";

import { useMemo, useState } from "react";
import { BACKGROUNDS, SKILLS } from "@repo/rules";
import { CardGrid, Chip, Empty, Header, LiftCard, norm, Page, SearchBox } from "./kit";

export default function BackgroundList() {
  const [q, setQ] = useState("");
  const list = useMemo(() => BACKGROUNDS.filter((b) => norm(b.name + " " + b.summary).includes(norm(q))), [q]);
  const skillName = (k: string) => SKILLS.find((s) => s.key === k)?.name ?? k;
  return (
    <Page>
      <Header back={{ href: "/compendio", label: "Compêndio" }} eyebrow="Compêndio" title="Antecedentes" subtitle="De onde seu personagem veio e o que fazia antes da aventura." />
      <div className="mb-6"><SearchBox value={q} onChange={setQ} placeholder="Buscar antecedente..." /></div>
      {list.length === 0 ? <Empty text="Nenhum antecedente encontrado." /> : (
        <CardGrid key={q}>
          {list.map((b) => (
            <LiftCard key={b.id} href={`/compendio/antecedentes/${b.id}`}>
              <h2 className="text-lg font-semibold text-[#e2e8f0]">{b.name}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-[#64748b]">{b.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{b.skills.map((s) => <Chip key={s} tone="accent">{skillName(s)}</Chip>)}</div>
            </LiftCard>
          ))}
        </CardGrid>
      )}
    </Page>
  );
}
