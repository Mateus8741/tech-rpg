'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Users, Library, Sparkles, ScrollText, User, Swords, BookOpen, Loader2, CornerDownLeft, X, History, Backpack, Wand2,
} from 'lucide-react';
import { getCharacters } from '@/lib/api';
import { useEntry } from '@/components/entries';
import {
  buildRulesCorpus, composeIndex, norm, prepareDoc, removeFilterTokens, search, snippetFor, tokenize,
  type ActiveFilter, type RulesCorpus, type SearchDoc, type SearchGroup, type SearchResult,
} from '@/lib/search';
import { cn } from '@/lib/utils';
import { OPEN_SEARCH_EVENT } from './store';

const GROUP_ORDER: SearchGroup[] = ['Páginas', 'Fichas', 'Magias', 'Características', 'Classes', 'Raças', 'Antecedentes', 'Equipamento', 'Regras'];
const GROUP_ICON: Record<SearchGroup, typeof Search> = {
  'Páginas': Library, 'Fichas': Users, 'Magias': Sparkles, 'Características': Wand2, 'Classes': Swords,
  'Raças': User, 'Antecedentes': BookOpen, 'Equipamento': Backpack, 'Regras': ScrollText,
};
const GROUP_TABS: SearchGroup[] = ['Magias', 'Características', 'Classes', 'Raças', 'Antecedentes', 'Equipamento', 'Regras'];
const PER_GROUP = 6;
const PER_SELECTED_GROUP = 40;

const SUGGESTIONS = ['truque fogo mago', 'reação ladino', 'magia de cura 1 círculo', 'ação bônus', 'concentração ilusão', 'ataque furtivo'];

const RECENT_KEY = 'rpg_recent_searches';
const MAX_RECENT = 6;

function readRecents(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, MAX_RECENT) : [];
  } catch { return []; }
}

function writeRecent(q: string): void {
  const value = q.trim();
  if (!value) return;
  try {
    const next = [value, ...readRecents().filter((x) => norm(x) !== norm(value))].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch { /* sem storage */ }
}

const PAGES: SearchDoc[] = [
  { key: 'page:characters', title: 'Personagens', sub: 'Suas fichas', href: '/characters' },
  { key: 'page:compendio', title: 'Compêndio', sub: 'Raças, classes e antecedentes', href: '/compendio' },
  { key: 'page:magias', title: 'Magias', sub: 'Navegador de magias', href: '/magias' },
  { key: 'page:regras', title: 'Regras', sub: 'Condições e regras', href: '/regras' },
  { key: 'page:dados', title: 'Dados', sub: 'Rolador de dados', href: '/dados' },
].map(({ href, ...d }) => prepareDoc({ ...d, group: 'Páginas', target: { href } }));

/** Destaca os trechos encontrados, ignorando acentos. */
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  let n = '';
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = norm(text[i]!);
    for (let j = 0; j < c.length; j++) { n += c[j]; map.push(i); }
  }
  const ranges: [number, number][] = [];
  for (const t of terms) {
    if (t.length < 2) continue;
    let from = 0;
    for (;;) {
      const at = n.indexOf(t, from);
      if (at < 0) break;
      from = at + t.length;
      if (at > 0 && /[a-z0-9]/.test(n[at - 1]!)) continue;
      ranges.push([map[at]!, (map[at + t.length - 1] ?? text.length - 1) + 1]);
    }
  }
  if (!ranges.length) return <>{text}</>;
  ranges.sort((a, b) => a[0] - b[0]);
  const parts: React.ReactNode[] = [];
  let pos = 0;
  ranges.forEach(([s, e]) => {
    if (e <= pos) return;
    const start = Math.max(s, pos);
    if (start > pos) parts.push(text.slice(pos, start));
    parts.push(<mark key={start} className="rounded-sm bg-indigo-500/30 text-inherit">{text.slice(start, e)}</mark>);
    pos = e;
  });
  parts.push(text.slice(pos));
  return <>{parts}</>;
}

const asResult = (doc: SearchDoc): SearchResult => ({ doc, score: 0, inBody: false });

export default function CommandPalette() {
  const router = useRouter();
  const openEntry = useEntry();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [group, setGroup] = useState<SearchGroup | null>(null);
  const [corpus, setCorpus] = useState<RulesCorpus | null>(null);
  const [chars, setChars] = useState<SearchDoc[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const uid = useId();

  const reset = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery(''); setActive(0); setGroup(null); setRecents(readRecents());
  }, []);
  const show = useCallback(() => { reset(); setOpen(true); }, [reset]);
  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Atalho global e evento vindo da Sidebar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => { if (!o) reset(); return !o; });
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, show);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(OPEN_SEARCH_EVENT, show); };
  }, [show, reset]);

  // Carrega índice e fichas sob demanda ao abrir.
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    const user = (localStorage.getItem('rpg_username') || '').trim();
    const tasks: Promise<unknown>[] = [];
    if (!corpus) {
      tasks.push(import('@repo/rules').then((r) => { if (alive) setCorpus(buildRulesCorpus(r)); }).catch(() => {}));
    }
    if (user) {
      tasks.push(getCharacters(user).then((list) => {
        if (alive) {
          setChars(list.map((c) => prepareDoc({
            key: `sheet:${c.id}`, group: 'Fichas', title: c.name, sub: `${c.race} ${c.class} · nível ${c.level}`,
            tags: [c.race, c.class], target: { href: `/characters/${c.id}` },
          })));
        }
      }).catch(() => {}));
    }
    void Promise.all(tasks).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open, corpus]);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const index = useMemo(() => composeIndex(corpus, [...PAGES, ...chars]), [corpus, chars]);
  const hasQuery = tokenize(query).length > 0;
  const outcome = useMemo(
    () => (hasQuery ? search(index, query) : { results: [] as SearchResult[], filters: [] as ActiveFilter[], highlight: [] as string[], relaxed: false }),
    [hasQuery, index, query],
  );

  const counts = useMemo(() => {
    const m = new Map<SearchGroup, number>();
    for (const r of outcome.results) m.set(r.doc.group, (m.get(r.doc.group) ?? 0) + 1);
    return m;
  }, [outcome.results]);

  // Resultados agrupados e achatados (ordem de navegação). Grupos seguem a melhor nota.
  const { groups, flat } = useMemo(() => {
    const base = hasQuery
      ? outcome.results.filter((r) => !group || r.doc.group === group)
      : [...PAGES, ...chars.slice(0, PER_GROUP)].map(asResult);
    const limit = group ? PER_SELECTED_GROUP : PER_GROUP;
    const by = new Map<SearchGroup, SearchResult[]>();
    for (const r of base) {
      const arr = by.get(r.doc.group) ?? [];
      if (arr.length < limit) { arr.push(r); by.set(r.doc.group, arr); }
    }
    const rank = (g: SearchGroup) => by.get(g)![0]!.score;
    const groups = GROUP_ORDER.filter((g) => by.has(g))
      .sort((a, b) => rank(b) - rank(a) || GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b))
      .map((g) => ({ group: g, items: by.get(g)! }));
    return { groups, flat: groups.flatMap((g) => g.items) };
  }, [hasQuery, outcome.results, group, chars]);

  useEffect(() => { setActive(0); }, [query, group]);

  // Mantém o item ativo visível.
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, flat]);

  const go = (r: SearchResult) => {
    writeRecent(query);
    setOpen(false);
    if ('entry' in r.doc.target) openEntry(r.doc.target.entry);
    else router.push(r.doc.target.href);
  };

  const fill = (q: string) => { setQuery(q); inputRef.current?.focus(); };
  const removeFilter = (f: ActiveFilter) => {
    fill(removeFilterTokens(query.trim().split(/\s+/).filter(Boolean), f));
  };

  const trapTab = (e: React.KeyboardEvent) => {
    const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('input, button:not([disabled])');
    if (!nodes?.length) return;
    const first = nodes[0]!;
    const last = nodes[nodes.length - 1]!;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (flat.length ? (a + 1) % flat.length : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0)); }
    else if (e.key === 'Enter' && e.target === inputRef.current) { e.preventDefault(); const r = flat[active]; if (r) go(r); }
    else if (e.key === 'Tab') trapTab(e);
  };

  if (!open) return null;
  const optId = (i: number) => `${uid}-opt-${i}`;
  let idx = -1;

  const quickButtons = (title: string, values: string[], Icon: typeof Search) => values.length > 0 && (
    <div className="px-3 pb-2 pt-3">
      <div className="pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {values.map((s) => (
          <button
            key={s} type="button" onClick={() => fill(s)}
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft outline-none transition-colors hover:border-[#6366f1]/50 hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo/70"
          >
            <Icon className="h-3 w-3 text-ink-muted" aria-hidden />{s}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[10vh] backdrop-blur-sm" onMouseDown={close}>
      <div
        ref={dialogRef} role="dialog" aria-modal="true" aria-label="Busca global"
        onKeyDown={onKeyDown} onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[78vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            role="combobox" aria-expanded="true" aria-controls={`${uid}-list`} aria-autocomplete="list"
            aria-activedescendant={flat.length ? optId(active) : undefined}
            aria-label="Buscar magias, características, classes, equipamento, regras e fichas"
            placeholder="Tente: truque fogo mago, reação ladino, besta de mão..."
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted sm:text-sm"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-ink" aria-label="Carregando" />}
          <kbd className="hidden rounded border border-line-strong px-1.5 py-0.5 text-[10px] text-ink-muted sm:block">Esc</kbd>
        </div>

        {hasQuery && (
          <div className="space-y-2 border-b border-line px-3 py-2">
            {outcome.filters.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5" aria-label="Filtros reconhecidos">
                <span className="text-[10px] uppercase tracking-wider text-ink-muted">Filtros</span>
                {outcome.filters.map((f) => (
                  <button
                    key={f.key} type="button" onClick={() => removeFilter(f)} aria-label={`Remover filtro ${f.label}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[#6366f1]/50 bg-[#6366f1]/15 px-2 py-0.5 text-xs text-indigo-ink-soft outline-none hover:bg-[#6366f1]/25 focus-visible:ring-2 focus-visible:ring-indigo/70"
                  >
                    {f.label}<X className="h-3 w-3" aria-hidden />
                  </button>
                ))}
              </div>
            )}
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="Filtrar por tipo">
              {[null, ...GROUP_TABS].map((g) => {
                const count = g ? counts.get(g) ?? 0 : outcome.results.length;
                const on = group === g;
                if (g && !count && !on) return null;
                return (
                  <button
                    key={g ?? 'tudo'} type="button" aria-pressed={on} onClick={() => setGroup(g)}
                    className={cn(
                      'shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo/70',
                      on ? 'border-[#6366f1] bg-[#6366f1]/20 text-ink' : 'border-line text-ink-muted hover:text-ink',
                    )}
                  >
                    {g ?? 'Tudo'} <span className="tabular-nums opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={listRef} id={`${uid}-list`} role="listbox" aria-label="Resultados" className="min-h-0 flex-1 overflow-y-auto p-2">
          {hasQuery && flat.length === 0 && (
            <>
              <p className="px-3 pb-2 pt-6 text-center text-sm text-ink-muted">
                {loading ? 'Carregando...' : `Nada encontrado para “${query.trim()}”.`}
              </p>
              {!loading && quickButtons('Experimente', SUGGESTIONS, Search)}
            </>
          )}
          {outcome.relaxed && flat.length > 0 && (
            <p className="px-3 pb-1 pt-2 text-xs text-ink-muted">Nada tem todas as palavras. Estes são os mais próximos:</p>
          )}
          {groups.map(({ group: g, items }) => {
            const Icon = GROUP_ICON[g];
            return (
              <div key={g} role="group" aria-label={g} className="mb-1">
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{g}</div>
                {items.map((r) => {
                  idx += 1;
                  const i = idx;
                  const sel = i === active;
                  const snippet = r.inBody ? snippetFor(r.doc, outcome.highlight) : undefined;
                  return (
                    <div
                      key={r.doc.key} id={optId(i)} role="option" aria-selected={sel}
                      onMouseMove={() => setActive(i)} onClick={() => go(r)}
                      className={cn('flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-sm', sel ? 'bg-indigo-500/15 text-ink' : 'text-ink-soft')}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-indigo-ink" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className="truncate"><Highlight text={r.doc.title} terms={outcome.highlight} /></div>
                        {r.doc.sub && <div className="truncate text-xs text-ink-muted">{r.doc.sub}</div>}
                        {snippet && <div className="mt-0.5 line-clamp-2 text-xs text-ink-muted"><Highlight text={snippet} terms={outcome.highlight} /></div>}
                      </div>
                      {sel && <CornerDownLeft className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />}
                    </div>
                  );
                })}
              </div>
            );
          })}
          {!hasQuery && quickButtons('Recentes', recents, History)}
          {!hasQuery && quickButtons('Experimente', SUGGESTIONS, Search)}
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[10px] text-ink-muted">
          <span>↑↓ navegar</span><span>Enter abrir</span><span>Esc fechar</span>
          <span className="ml-auto hidden sm:inline">Entende filtros como “truque”, “reação”, “mago”, “fogo” e “2º círculo”</span>
        </div>
      </div>
    </div>
  );
}
