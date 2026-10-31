"use client";

import { useMemo, useState } from "react";
import { CONDITIONS, RULE_SECTIONS } from "@repo/rules";
import { Accordion, Empty, Header, norm, Page, RuleText, SearchBox } from "./kit";

export default function RulesView() {
  const [q, setQ] = useState("");
  const conds = useMemo(() => CONDITIONS.filter((c) => norm(c.name + " " + c.description.join(" ")).includes(norm(q))), [q]);
  return (
    <Page>
      <Header eyebrow="Referência" title="Regras" subtitle="Regras-chave do jogo e condições." />
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#f5c451]">Regras-chave</h2>
      <div className="mb-10 space-y-2">
        {RULE_SECTIONS.map((s) => (
          <Accordion key={s.id} title={s.title}>
            {s.body.map((p, i) => <RuleText key={i} text={p} />)}
          </Accordion>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f5c451]">Condições ({CONDITIONS.length})</h2>
        <SearchBox value={q} onChange={setQ} placeholder="Buscar condição..." />
      </div>
      {conds.length === 0 ? <Empty text="Nenhuma condição encontrada." /> : (
        <div className="space-y-2">
          {conds.map((c) => (
            <Accordion key={c.id} title={c.name} defaultOpen={q.length > 0 && conds.length <= 3}>
              {c.description.map((p, i) => <RuleText key={i} text={p} />)}
            </Accordion>
          ))}
        </div>
      )}
    </Page>
  );
}
