'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Users, Library, Sparkles, ScrollText, User, Shield, Swords, BookOpen, Loader2, CornerDownLeft,
} from 'lucide-react';
import { getCharacters } from '@/lib/api';
import { normalizeText } from '@/components/spells/spell-utils';
import { OPEN_SEARCH_EVENT } from './store';

type Group = 'Páginas' | 'Fichas' | 'Magias' | 'Raças' | 'Classes' | 'Antecedentes' | 'Condições' | 'Regras';

interface Item {
  key: string;
  group: Group;
  title: string;
  sub?: string;
  href: string;
  /** texto normalizado usado na busca */
  hay: string;
  titleNorm: string;
}

const GROUP_ORDER: Group[] = ['Páginas', 'Fichas', 'Magias', 'Raças', 'Classes', 'Antecedentes', 'Condições', 'Regras'];
const GROUP_ICON: Record<Group, typeof Search> = {
  'Páginas': Library, 'Fichas': Users, 'Magias': Sparkles, 'Raças': User,
  'Classes': Swords, 'Antecedentes': BookOpen, 'Condições': Shield, 'Regras': ScrollText,
};
const PER_GROUP = 6;

const mk = (group: Group, key: string, title: string, href: string, sub?: string, extra = ''): Item => ({
  key: `${group}:${key}`, group, title, sub, href,
  titleNorm: normalizeText(title),
  hay: normalizeText(`${title} ${sub ?? ''} ${extra}`),
});

const PAGES: Item[] = [
  mk('Páginas', 'characters', 'Personagens', '/characters', 'Suas fichas'),
  mk('Páginas', 'compendio', 'Compêndio', '/compendio', 'Raças, classes e antecedentes'),
  mk('Páginas', 'magias', 'Magias', '/magias', 'Navegador de magias'),
  mk('Páginas', 'regras', 'Regras', '/regras', 'Condições e regras'),
  mk('Páginas', 'dados', 'Dados', '/dados', 'Rolador de dados'),
];

/** Índice estático (carregado sob demanda: @repo/rules é grande). */
async function buildStaticIndex(): Promise<Item[]> {
  const r = await import('@repo/rules');
  const out: Item[] = [];
  for (const s of r.SPELLS) {
    out.push(mk('Magias', s.id, s.name, `/magias?magia=${encodeURIComponent(s.id)}`,
      `${s.level === 0 ? 'Truque' : `${s.level}º círculo`} · ${s.school}`));
  }
  for (const x of r.RACES) out.push(mk('Raças', x.id, x.name, `/compendio/racas/${x.id}`, 'Raça'));
  for (const x of r.CLASSES) out.push(mk('Classes', x.id, x.name, `/compendio/classes/${x.id}`, 'Classe'));
  for (const x of r.BACKGROUNDS) out.push(mk('Antecedentes', x.id, x.name, `/compendio/antecedentes/${x.id}`, 'Antecedente'));
  for (const x of r.CONDITIONS) out.push(mk('Condições', x.id, x.name, '/regras', 'Condição', x.description.join(' ')));
  for (const x of r.RULE_SECTIONS) out.push(mk('Regras', x.id, x.title, '/regras', 'Seção de regras', x.body.join(' ')));
  return out;
}

/** Destaca o trecho encontrado, ignorando acentos. */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  let norm = '';
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const n = normalizeText(text[i]!);
    for (let j = 0; j < n.length; j++) { norm += n[j]; map.push(i); }
  }
  const at = norm.indexOf(q);
  if (at < 0 || map.length === 0) return <>{text}</>;
  const start = map[at]!;
  const end = (map[at + q.length - 1] ?? text.length - 1) + 1;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-indigo-500/30 text-inherit">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

function search(items: Item[], raw: string): Item[] {
  const q = normalizeText(raw.trim());
  if (!q) return [];
  const tokens = q.split(/\s+/);
  const scored: { it: Item; score: number }[] = [];
  for (const it of items) {
    if (!tokens.every((t) => it.hay.includes(t))) continue;
    const score = it.titleNorm.startsWith(q) ? 0 : it.titleNorm.includes(q) ? 1 : it.titleNorm.includes(tokens[0]!) ? 2 : 3;
    scored.push({ it, score });
  }
  scored.sort((a, b) => a.score - b.score);
  return scored.map((s) => s.it);
}

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [staticIdx, setStaticIdx] = useState<Item[] | null>(null);
  const [chars, setChars] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const uid = useId();

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery(''); setActive(0); setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Atalho global e evento vindo da Sidebar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => { if (!o) { lastFocus.current = document.activeElement as HTMLElement | null; setQuery(''); setActive(0); } return !o; });
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, show);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(OPEN_SEARCH_EVENT, show); };
  }, [show]);

  // Carrega índice e fichas sob demanda ao abrir.
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    const user = (localStorage.getItem('rpg_username') || '').trim();
    const tasks: Promise<unknown>[] = [];
    if (!staticIdx) tasks.push(buildStaticIndex().then((i) => { if (alive) setStaticIdx(i); }).catch(() => {}));
    if (user) {
      tasks.push(getCharacters(user).then((list) => {
        if (alive) setChars(list.map((c) => mk('Fichas', c.id, c.name, `/characters/${c.id}`, `${c.race} ${c.class} · nível ${c.level}`)));
      }).catch(() => {}));
    }
    void Promise.all(tasks).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open, staticIdx]);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  // Resultados agrupados e achatados (ordem de navegação).
  const { groups, flat } = useMemo(() => {
    const all = [...PAGES, ...chars, ...(staticIdx ?? [])];
    const q = normalizeText(query.trim());
    const base = q ? search(all, query) : [...PAGES, ...chars.slice(0, PER_GROUP)];
    const by = new Map<Group, Item[]>();
    for (const it of base) {
      const arr = by.get(it.group) ?? [];
      if (arr.length < PER_GROUP) { arr.push(it); by.set(it.group, arr); }
    }
    const groups = GROUP_ORDER.filter((g) => by.has(g)).map((g) => ({ group: g, items: by.get(g)! }));
    return { groups, flat: groups.flatMap((g) => g.items) };
  }, [query, chars, staticIdx]);

  useEffect(() => { setActive(0); }, [query]);

  // Mantém o item ativo visível.
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, flat]);

  const go = (it: Item) => { setOpen(false); router.push(it.href); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (flat.length ? (a + 1) % flat.length : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (flat.length ? (a - 1 + flat.length) % flat.length : 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = flat[active]; if (it) go(it); }
    else if (e.key === 'Tab') { e.preventDefault(); inputRef.current?.focus(); } // foco preso na paleta
  };

  if (!open) return null;
  const q = normalizeText(query.trim());
  const optId = (i: number) => `${uid}-opt-${i}`;
  let idx = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={close}>
      <div
        role="dialog" aria-modal="true" aria-label="Busca global"
        onKeyDown={onKeyDown} onMouseDown={(e) => e.stopPropagation()}
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            role="combobox" aria-expanded="true" aria-controls={`${uid}-list`} aria-autocomplete="list"
            aria-activedescendant={flat.length ? optId(active) : undefined}
            aria-label="Buscar magias, raças, classes, regras e fichas"
            placeholder="Buscar magias, classes, regras, fichas..."
            className="h-12 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-indigo-ink" aria-label="Carregando" />}
          <kbd className="hidden rounded border border-line-strong px-1.5 py-0.5 text-[10px] text-ink-muted sm:block">Esc</kbd>
        </div>

        <div ref={listRef} id={`${uid}-list`} role="listbox" aria-label="Resultados" className="overflow-y-auto p-2">
          {flat.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-ink-muted">
              {loading ? 'Carregando...' : q ? `Nada encontrado para “${query.trim()}”.` : 'Digite para buscar.'}
            </p>
          )}
          {groups.map(({ group, items }) => {
            const Icon = GROUP_ICON[group];
            return (
              <div key={group} role="group" aria-label={group} className="mb-1">
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{group}</div>
                {items.map((it) => {
                  idx += 1;
                  const i = idx;
                  const sel = i === active;
                  return (
                    <div
                      key={it.key} id={optId(i)} role="option" aria-selected={sel}
                      onMouseMove={() => setActive(i)} onClick={() => go(it)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm ${sel ? 'bg-indigo-500/15 text-ink' : 'text-ink-soft'}`}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-indigo-ink" aria-hidden />
                      <span className="min-w-0 flex-1 truncate"><Highlight text={it.title} q={q} /></span>
                      {it.sub && <span className="hidden truncate text-xs text-ink-muted sm:block">{it.sub}</span>}
                      {sel && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden />}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-t border-line px-4 py-2 text-[10px] text-ink-muted">
          <span>↑↓ navegar</span><span>Enter abrir</span><span>Esc fechar</span>
        </div>
      </div>
    </div>
  );
}

