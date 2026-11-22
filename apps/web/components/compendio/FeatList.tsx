"use client";

import { useMemo, useState } from "react";
import { FEATS } from "@repo/rules";
import { CardGrid, Chip, Empty, FilterChips, Header, LiftCard, norm, Page, SearchBox } from "./kit";

const ALL = "Todos";
const catLabel = (c?: string) => (c ? `Categoria: ${c}` : "Geral");

export default function FeatList() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState(ALL);
  const [cat, setCat] = useState(ALL);
  const sources = useMemo(() => [ALL, ...Array.from(new Set(FEATS.map((f) => f.source)))], []);
  const cats = useMemo(() => {
    const set = Array.from(new Set(FEATS.map((f) => f.category).filter((c): c is string => !!c)));
    return set.length ? [ALL, "Sem categoria", ...set] : [];
  }, []);
  const list = useMemo(
    () =>
      FEATS.filter(
        (f) =>
          (source === ALL || f.source === source) &&
          (cat === ALL || (cat === "Sem categoria" ? !f.category : f.category === cat)) &&
          norm(`${f.name} ${f.prerequisite ?? ""} ${f.description}`).includes(norm(q)),
      ),
    [q, source, cat],
  );
  return (
    <Page>
      <Header back={{ href: "/compendio", label: "Compêndio" }} eyebrow="Compêndio" title="Talentos" subtitle="Talentos opcionais que concedem benefícios especiais ao seu personagem." />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Buscar talento..." /></div>
      <div className="mb-6 space-y-3">
        <div><p className="mb-1.5 text-xs text-ink-muted">Fonte</p><FilterChips options={sources} value={source} onChange={setSource} /></div>
        {cats.length > 0 && <div><p className="mb-1.5 text-xs text-ink-muted">Categoria</p><FilterChips options={cats} value={cat} onChange={setCat} /></div>}
      </div>
      <p className="mb-4 text-xs text-ink-muted">{list.length} talento(s)</p>
      {list.length === 0 ? <Empty text="Nenhum talento encontrado." /> : (
        <CardGrid key={`${q}|${source}|${cat}`}>
          {list.map((f) => (
            <LiftCard key={f.id} href={`/compendio/talentos/${f.id}`}>
              <h2 className="text-lg font-semibold text-ink">{f.name}</h2>
              {f.prerequisite && <p className="mt-1 text-xs text-gold-ink">Pré-requisito: {f.prerequisite}</p>}
              <p className="mt-1 line-clamp-3 text-sm text-ink-muted">{f.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <Chip tone="accent">{f.source}</Chip>
                {f.category && <Chip>{catLabel(f.category)}</Chip>}
              </div>
            </LiftCard>
          ))}
        </CardGrid>
      )}
    </Page>
  );
}
