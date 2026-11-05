"use client";

import { useMemo, useState } from "react";
import { CLASSES } from "@repo/rules";
import { CardGrid, Chip, Empty, Header, LiftCard, norm, Page, SearchBox, abilityAbbr } from "./kit";

export default function ClassList() {
  const [q, setQ] = useState("");
  const list = useMemo(() => CLASSES.filter((c) => norm(c.name + " " + c.summary).includes(norm(q))), [q]);
  return (
    <Page>
      <Header back={{ href: "/compendio", label: "Compêndio" }} eyebrow="Compêndio" title="Classes" subtitle="A vocação que define o que seu personagem faz de melhor." />
      <div className="mb-6"><SearchBox value={q} onChange={setQ} placeholder="Buscar classe..." /></div>
      {list.length === 0 ? <Empty text="Nenhuma classe encontrada." /> : (
        <CardGrid key={q}>
          {list.map((c) => (
            <LiftCard key={c.id} href={`/compendio/classes/${c.id}`}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-ink">{c.name}</h2>
                <span className="rounded-md bg-[#f5c451]/10 px-2 py-0.5 text-xs font-bold text-gold-ink">d{c.hitDie}</span>
              </div>
              <p className="mt-1 line-clamp-3 text-sm text-ink-muted">{c.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.primaryAbilities.map((a) => <Chip key={a} tone="accent">{abilityAbbr(a)}</Chip>)}
                {c.spellcasting && <Chip tone="gold">Conjurador</Chip>}
              </div>
            </LiftCard>
          ))}
        </CardGrid>
      )}
    </Page>
  );
}
