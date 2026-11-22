"use client";

import { useMemo, useState } from "react";
import { ARMOR, GEAR, WEAPONS, WEAPON_PROPERTIES } from "@repo/rules";
import { AnimatedTabs, Chip, Empty, FilterChips, Header, norm, Page, SearchBox } from "./kit";

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-3 py-2.5">{children}</th>;
}
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}
const head = "bg-surface text-[11px] uppercase tracking-wider text-ink-muted";
const tr = "border-t border-line transition-colors hover:bg-white/[0.02]";

function Weapons({ q }: { q: string }) {
  const [cat, setCat] = useState("Todas");
  const [kind, setKind] = useState("Todas");
  const list = useMemo(() => WEAPONS.filter((w) =>
    (cat === "Todas" || w.category === cat) && (kind === "Todas" || w.kind === kind) &&
    norm(w.name + " " + w.damage + " " + w.properties.join(" ")).includes(norm(q))), [q, cat, kind]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <FilterChips options={["Todas", "Simples", "Marcial"]} value={cat} onChange={setCat} />
        <FilterChips options={["Todas", "Corpo a corpo", "À distância"]} value={kind} onChange={setKind} />
      </div>
      {list.length === 0 ? <Empty text="Nenhuma arma encontrada." /> : (
        <Wrap>
          <thead className={head}><tr><Th>Nome</Th><Th>Categoria</Th><Th>Dano</Th><Th>Custo</Th><Th>Peso</Th><Th>Propriedades</Th></tr></thead>
          <tbody>
            {list.map((w) => (
              <tr key={w.name} className={tr}>
                <td className="px-3 py-2 font-medium text-ink">{w.name}</td>
                <td className="px-3 py-2 text-ink-soft">{w.category} · {w.kind}</td>
                <td className="px-3 py-2 text-gold-ink">{w.damage}</td>
                <td className="px-3 py-2 text-ink-body">{w.cost}</td>
                <td className="px-3 py-2 text-ink-body">{w.weight}</td>
                <td className="px-3 py-2"><div className="flex flex-wrap gap-1">{w.properties.map((p) => <Chip key={p}>{p}</Chip>)}</div></td>
              </tr>
            ))}
          </tbody>
        </Wrap>
      )}
    </div>
  );
}

function Armors({ q }: { q: string }) {
  const [cat, setCat] = useState("Todas");
  const list = useMemo(() => ARMOR.filter((a) => (cat === "Todas" || a.category === cat) && norm(a.name).includes(norm(q))), [q, cat]);
  return (
    <div className="space-y-4">
      <FilterChips options={["Todas", "Leve", "Média", "Pesada", "Escudo"]} value={cat} onChange={setCat} />
      {list.length === 0 ? <Empty text="Nenhuma armadura encontrada." /> : (
        <Wrap>
          <thead className={head}><tr><Th>Nome</Th><Th>Categoria</Th><Th>CA</Th><Th>Força</Th><Th>Furtividade</Th><Th>Custo</Th><Th>Peso</Th></tr></thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.name} className={tr}>
                <td className="px-3 py-2 font-medium text-ink">{a.name}</td>
                <td className="px-3 py-2 text-ink-soft">{a.category}</td>
                <td className="px-3 py-2 text-gold-ink">{a.ac}</td>
                <td className="px-3 py-2 text-ink-body">{a.strengthReq ? `For ${a.strengthReq}` : "—"}</td>
                <td className="px-3 py-2 text-ink-body">{a.stealthDisadvantage ? "Desvantagem" : "—"}</td>
                <td className="px-3 py-2 text-ink-body">{a.cost}</td>
                <td className="px-3 py-2 text-ink-body">{a.weight}</td>
              </tr>
            ))}
          </tbody>
        </Wrap>
      )}
    </div>
  );
}

const descOf = (g: object) => (g as { description?: string }).description ?? "";

function Gear({ q }: { q: string }) {
  const cats = useMemo(() => ["Todas", ...Array.from(new Set(GEAR.map((g) => g.category)))], []);
  const [cat, setCat] = useState("Todas");
  const list = useMemo(() => GEAR.filter((g) => (cat === "Todas" || g.category === cat) && norm(g.name + " " + descOf(g)).includes(norm(q))), [q, cat]);
  return (
    <div className="space-y-4">
      {cats.length > 2 && <FilterChips options={cats} value={cat} onChange={setCat} />}
      {list.length === 0 ? <Empty text="Nenhum item encontrado." /> : (
        <Wrap>
          <thead className={head}><tr><Th>Nome</Th><Th>Categoria</Th><Th>Custo</Th><Th>Peso</Th></tr></thead>
          <tbody>
            {list.map((g) => (
              <tr key={g.name} className={tr}>
                <td className="px-3 py-2 font-medium text-ink">{g.name}{descOf(g) && <p className="mt-0.5 max-w-md whitespace-pre-line text-xs font-normal leading-relaxed text-ink-muted">{descOf(g)}</p>}</td>
                <td className="px-3 py-2 text-ink-soft">{g.category}</td>
                <td className="px-3 py-2 text-ink-body">{g.cost}</td>
                <td className="px-3 py-2 text-ink-body">{g.weight}</td>
              </tr>
            ))}
          </tbody>
        </Wrap>
      )}
    </div>
  );
}

function Properties({ q }: { q: string }) {
  const list = WEAPON_PROPERTIES.filter((p) => norm(p.name + " " + p.description).includes(norm(q)));
  return list.length === 0 ? <Empty text="Nenhuma propriedade encontrada." /> : (
    <div className="space-y-2">
      {list.map((p) => (
        <div key={p.name} className="rounded-xl border border-line bg-canvas p-4">
          <h3 className="text-sm font-semibold text-ink">{p.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-body">{p.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function EquipmentView() {
  const [q, setQ] = useState("");
  return (
    <Page>
      <Header back={{ href: "/compendio", label: "Compêndio" }} eyebrow="Compêndio" title="Equipamento" subtitle="Armas, armaduras e itens de aventura." />
      <div className="mb-6"><SearchBox value={q} onChange={setQ} placeholder="Buscar equipamento..." /></div>
      <AnimatedTabs tabs={[
        { label: `Armas (${WEAPONS.length})`, content: <Weapons q={q} /> },
        { label: `Armaduras (${ARMOR.length})`, content: <Armors q={q} /> },
        { label: `Equipamento (${GEAR.length})`, content: <Gear q={q} /> },
        { label: `Propriedades de Armas (${WEAPON_PROPERTIES.length})`, content: <Properties q={q} /> },
      ]} />
    </Page>
  );
}
