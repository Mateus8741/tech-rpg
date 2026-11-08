"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X, BookOpen, Star } from "lucide-react";
import { CLASSES, SPELLS } from "@repo/rules";
import { parseQuery, scoreSpell } from "@/components/spells/smart-search";
import { cn } from "@/lib/utils";
import { accentText } from "@/components/sheet/class-style";
import {
  SPELL_SCHOOLS, SPELL_SCHOOL_COLORS, SpellDetail, SpellRow, spellLevelLabel,
} from "@/components/spells";
import { useSpellFavorites } from "@/components/spells/useSpellFavorites";

type SortKey = "nome" | "nivel" | "escola";
const PAGE = 60;
const SOURCES = Array.from(new Set(SPELLS.map((s) => s.source).filter((s): s is string => !!s))).sort();
const LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function toggle<T>(set: Set<T>, v: T): Set<T> {
  const n = new Set(set);
  if (n.has(v)) n.delete(v);
  else n.add(v);
  return n;
}

function Chip({
  active, onClick, children, color,
}: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      layout={!reduce}
      whileTap={reduce ? undefined : { scale: 0.93 }}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "border-[#6366f1] bg-[#6366f1]/20 text-ink" : "border-line bg-canvas text-ink-muted hover:text-ink",
      )}
      style={active && color ? { borderColor: color, background: `${color}26`, color: accentText(color) } : undefined}
    >
      {children}
    </motion.button>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 w-14 shrink-0 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{label}</span>
      {children}
    </div>
  );
}

export function SpellBrowser() {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [classes, setClasses] = useState<Set<string>>(() => new Set(params.get("classe")?.split(",").filter(Boolean)));
  const [levels, setLevels] = useState<Set<number>>(
    () => new Set(params.get("nivel")?.split(",").filter((x) => x !== "").map(Number).filter((n) => n >= 0 && n <= 9)),
  );
  const [schools, setSchools] = useState<Set<string>>(() => new Set(params.get("escola")?.split(",").filter(Boolean)));
  const [concentration, setConcentration] = useState(params.get("concentracao") === "1");
  const [ritual, setRitual] = useState(params.get("ritual") === "1");
  const [comps, setComps] = useState<Set<"v" | "s" | "m">>(() => new Set(params.get("comp")?.split(",").filter((c): c is "v" | "s" | "m" => c === "v" || c === "s" || c === "m")));
  const [onlyFav, setOnlyFav] = useState(params.get("favoritas") === "1");
  const { favorites, toggle: toggleFav } = useSpellFavorites();
  const [source, setSource] = useState(params.get("fonte") ?? "");
  const [sort, setSort] = useState<SortKey>((params.get("ordem") as SortKey) || "nome");
  const [selectedId, setSelectedId] = useState<string | null>(params.get("magia"));
  const [limit, setLimit] = useState(PAGE);
  const sentinel = useRef<HTMLDivElement>(null);

  // Sincroniza filtros com a URL (deep link) sem navegar.
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (classes.size) p.set("classe", [...classes].join(","));
    if (levels.size) p.set("nivel", [...levels].sort().join(","));
    if (schools.size) p.set("escola", [...schools].join(","));
    if (concentration) p.set("concentracao", "1");
    if (ritual) p.set("ritual", "1");
    if (comps.size) p.set("comp", [...comps].join(","));
    if (onlyFav) p.set("favoritas", "1");
    if (source) p.set("fonte", source);
    if (sort !== "nome") p.set("ordem", sort);
    if (selectedId) p.set("magia", selectedId);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, classes, levels, schools, concentration, ritual, comps, onlyFav, source, sort, selectedId]);

  const filtered = useMemo(() => {
    const pq = parseQuery(q);
    const scores = new Map<string, number>();
    const list = SPELLS.filter((s) => {
      const score = scoreSpell(s, pq);
      if (score < 0) return false;
      scores.set(s.id, score);
      if (classes.size && !s.classes.some((c) => classes.has(c))) return false;
      if (levels.size && !levels.has(s.level)) return false;
      if (schools.size && !schools.has(s.school)) return false;
      if (concentration && !s.concentration) return false;
      if (ritual && !s.ritual) return false;
      for (const c of comps) if (c === "m" ? !s.components.m : !s.components[c]) return false;
      if (onlyFav && !favorites.includes(s.id)) return false;
      if (source && s.source !== source) return false;
      return true;
    });
    const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR");
    list.sort((a, b) => {
      // Com palavras na busca, a ordem por nome vira ordem por relevância.
      if (sort === "nome" && pq.terms.length) return (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || byName(a.name, b.name);
      if (sort === "nivel") return a.level - b.level || byName(a.name, b.name);
      if (sort === "escola") return byName(a.school, b.school) || a.level - b.level || byName(a.name, b.name);
      return byName(a.name, b.name);
    });
    return list;
  }, [q, classes, levels, schools, concentration, ritual, comps, onlyFav, favorites, source, sort]);

  // Reinicia a paginação quando os filtros mudam.
  useEffect(() => setLimit(PAGE), [filtered]);

  // Rolagem infinita.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (e) => e[0]?.isIntersecting && setLimit((l) => l + PAGE),
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  // Esc fecha o painel.
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const selected = selectedId ? SPELLS.find((s) => s.id === selectedId) : undefined;
  const visible = filtered.slice(0, limit);
  const activeCount =
    classes.size + levels.size + schools.size + (concentration ? 1 : 0) + (ritual ? 1 : 0) + comps.size + (onlyFav ? 1 : 0) + (source ? 1 : 0);

  const clearAll = () => {
    setQ(""); setClasses(new Set()); setLevels(new Set()); setSchools(new Set());
    setConcentration(false); setRitual(false); setComps(new Set()); setOnlyFav(false); setSource("");
  };

  const spellcasters = CLASSES.filter((c) => SPELLS.some((s) => s.classes.includes(c.id)));

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 p-4 sm:p-8">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">Grimório</h1>
          <p className="text-sm text-ink-muted">{SPELLS.length} magias de D&amp;D 5e em português</p>
        </div>
      </header>

      <div className="space-y-3 rounded-2xl border border-line bg-base p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            aria-label="Buscar magia pelo nome"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar: fogo em área, cura bônus, controle 2º, mago ritual…"
            className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-9 text-sm text-ink placeholder:text-ink-muted focus:border-[#6366f1] focus:outline-none"
          />
          {q && (
            <button type="button" aria-label="Limpar busca" onClick={() => setQ("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FilterGroup label="Classe">
          {spellcasters.map((c) => (
            <Chip key={c.id} active={classes.has(c.id)} onClick={() => setClasses(toggle(classes, c.id))}>{c.name}</Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Nível">
          {LEVELS.map((l) => (
            <Chip key={l} active={levels.has(l)} onClick={() => setLevels(toggle(levels, l))} color="#f5c451">
              {l === 0 ? "Truque" : l}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Escola">
          {SPELL_SCHOOLS.map((s) => (
            <Chip key={s} active={schools.has(s)} onClick={() => setSchools(toggle(schools, s))} color={SPELL_SCHOOL_COLORS[s].hex}>{s}</Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Outros">
          <Chip active={concentration} onClick={() => setConcentration(!concentration)} color="#a78bfa">Concentração</Chip>
          <Chip active={ritual} onClick={() => setRitual(!ritual)} color="#f5c451">Ritual</Chip>
          {(["v", "s", "m"] as const).map((c) => (
            <Chip key={c} active={comps.has(c)} onClick={() => setComps(toggle(comps, c))} color="#22d3ee">{c.toUpperCase()}</Chip>
          ))}
          <Chip active={onlyFav} onClick={() => setOnlyFav(!onlyFav)} color="#f5c451">Favoritas</Chip>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            aria-label="Fonte"
            className="h-7 max-w-[220px] rounded-full border border-line bg-canvas px-3 text-xs text-ink focus:border-[#6366f1] focus:outline-none"
          >
            <option value="">Todas as fontes</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FilterGroup>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-ink-muted">
          <span>
            <strong className="text-ink">{filtered.length}</strong> resultado{filtered.length === 1 ? "" : "s"}
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="ml-3 text-violet-ink hover:underline">Limpar filtros ({activeCount})</button>
            )}
          </span>
          <label className="flex items-center gap-2">
            Ordenar por
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-7 rounded-md border border-line bg-canvas px-2 text-xs text-ink focus:border-[#6366f1] focus:outline-none"
            >
              <option value="nome">Nome</option>
              <option value="nivel">Nível</option>
              <option value="escola">Escola</option>
            </select>
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-16 text-center text-sm text-ink-muted">
          Nenhuma magia encontrada. Tente afrouxar os filtros.
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((s, i) => (
            <motion.div
              key={s.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: reduce ? 0 : Math.min(i % PAGE, 12) * 0.015 }}
            >
              <SpellRow
                spell={s} selected={s.id === selectedId} onClick={() => setSelectedId(s.id)}
                action={
                  <button
                    type="button" aria-pressed={favorites.includes(s.id)} aria-label={`Favoritar ${s.name}`}
                    onClick={() => toggleFav(s.id)}
                    className={cn("rounded p-1", favorites.includes(s.id) ? "text-gold-ink" : "text-ink-faint hover:text-gold-ink")}
                  >
                    <Star className={cn("h-4 w-4", favorites.includes(s.id) && "fill-current")} />
                  </button>
                }
              />
            </motion.div>
          ))}
          <div ref={sentinel} className="h-8" />
          {visible.length < filtered.length && (
            <p className="text-center text-xs text-ink-muted">Carregando mais…</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            />
            <motion.aside
              key="panel"
              role="dialog"
              aria-label={selected.name}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-canvas shadow-2xl"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{spellLevelLabel(selected.level)}</span>
                <button type="button" aria-label="Fechar" onClick={() => setSelectedId(null)} className="rounded-md p-1.5 text-ink-muted hover:bg-surface-3 hover:text-ink">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <SpellDetail key={selected.id} spell={selected} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
