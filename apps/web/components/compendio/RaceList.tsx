"use client";

import { useMemo, useState } from "react";
import { RACES } from "@repo/rules";
import { CardGrid, Chip, Empty, Header, LiftCard, norm, Page, SearchBox, abilityAbbr } from "./kit";
import type { AbilityKey } from "@repo/rules";

export function bonusLabel(b: Partial<Record<AbilityKey, number>>) {
  return Object.entries(b).map(([k, v]) => `${abilityAbbr(k as AbilityKey)} +${v}`);
}

export default function RaceList() {
  const [q, setQ] = useState("");
  const list = useMemo(() => RACES.filter((r) => norm(r.name + " " + r.summary).includes(norm(q))), [q]);
  return (
    <Page>
      <Header back={{ href: "/compendio", label: "Compêndio" }} eyebrow="Compêndio" title="Raças" subtitle="Escolha a herança do seu personagem." />
      <div className="mb-6"><SearchBox value={q} onChange={setQ} placeholder="Buscar raça..." /></div>
      {list.length === 0 ? <Empty text="Nenhuma raça encontrada." /> : (
        <CardGrid key={q}>
          {list.map((r) => (
            <LiftCard key={r.id} href={`/compendio/racas/${r.id}`}>
              <h2 className="text-lg font-semibold text-[#e2e8f0]">{r.name}</h2>
              <p className="mt-1 line-clamp-3 text-sm text-[#64748b]">{r.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {bonusLabel(r.abilityBonuses).map((b) => <Chip key={b} tone="accent">{b}</Chip>)}
                {r.abilityChoice && <Chip tone="accent">+{r.abilityChoice.amount} x{r.abilityChoice.count}</Chip>}
                <Chip>{r.speed} m</Chip>
                {r.subraces.length > 0 && <Chip tone="gold">{r.subraces.length} sub-raças</Chip>}
              </div>
            </LiftCard>
          ))}
        </CardGrid>
      )}
    </Page>
  );
}
