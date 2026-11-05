'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus, LogOut, Trash2, Users, User, Search, Shield, Heart, Upload } from 'lucide-react';
import { CLASSES, getClass, getRace } from '@repo/rules';
import { getCharacters, deleteCharacter, createCharacter, type Character } from '@/lib/api';
import { parseCharacterFile, type ExportedCharacter } from '@/lib/character-io';
import { getSheet } from '@/lib/sheet';
import { classStyle, accentText } from '@/components/sheet/class-style';
import { Button } from '@/components/ui/button';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [importing, setImporting] = useState<ExportedCharacter | null>(null);
  const [importBusy, setImportBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const load = useCallback(async (user: string) => {
    try {
      setLoading(true);
      setCharacters(await getCharacters(user));
    } catch {
      toast.error('Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const u = localStorage.getItem('rpg_username');
    const r = localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER' | null;
    if (!u) { router.push('/'); return; }
    setUsername(u);
    setUserRole(r || 'PLAYER');
    load(u);
  }, [router, load]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCharacter(deleteId, username);
      setCharacters((cs) => cs.filter((c) => c.id !== deleteId));
      toast.success('Personagem excluído');
    } catch {
      toast.error('Erro ao excluir personagem');
    } finally {
      setDeleteId(null);
    }
  };

  // Lê o arquivo escolhido e abre a confirmação
  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 2_000_000) { toast.error('Arquivo grande demais'); return; }
    const res = parseCharacterFile(await file.text());
    if (!res.ok) { toast.error(res.error); return; }
    setImporting(res.character);
  };

  const confirmImport = async () => {
    if (!importing) return;
    setImportBusy(true);
    try {
      const created = await createCharacter(username, importing);
      setCharacters((cs) => [created, ...cs]);
      toast.success(`${created.name} importado`);
      setImporting(null);
    } catch {
      toast.error('Erro ao importar ficha');
    } finally {
      setImportBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rpg_username');
    localStorage.removeItem('rpg_role');
    router.push('/');
  };

  const classIdOf = (c: Character) => {
    const sid = getSheet(c).classId;
    if (sid) return sid;
    return CLASSES.find((k) => norm(k.name) === norm(c.class || ''))?.id ?? '';
  };

  const filtered = useMemo(
    () => characters.filter((c) => {
      if (classFilter !== 'all' && classIdOf(c) !== classFilter) return false;
      const q = norm(query.trim());
      return !q || norm(`${c.name} ${c.race} ${c.class}`).includes(q);
    }),
    [characters, query, classFilter],
  );

  const usedClasses = useMemo(
    () => CLASSES.filter((k) => characters.some((c) => classIdOf(c) === k.id)),
    [characters],
  );

  return (
    <>
      <div className="flex h-[52px] flex-shrink-0 items-center justify-between border-b border-line px-6">
        <div>
          <p className="text-sm font-semibold text-ink">Personagens</p>
          <p className="text-xs text-ink-faint">{characters.length} {characters.length === 1 ? 'personagem' : 'personagens'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={logout} className="text-ink-muted hover:bg-ink/5 hover:text-ink">
            <LogOut className="mr-1.5 h-4 w-4" />Sair
          </Button>
          <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={onPickFile} aria-label="Arquivo de ficha para importar" />
          <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()} className="text-ink-soft hover:bg-ink/5 hover:text-ink">
            <Upload className="mr-1.5 h-4 w-4" />Importar ficha
          </Button>
          <Link href="/characters/new">
            <Button size="sm" className="border-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:from-[#4f46e5] hover:to-[#7c3aed]">
              <Plus className="mr-1.5 h-4 w-4" />Novo personagem
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center text-ink-muted">Carregando...</div>
        ) : characters.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-3">
              <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
                <input
                  value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome, raça ou classe..."
                  aria-label="Buscar personagens"
                  className="w-full rounded-lg border border-line bg-canvas py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-[#6366f1]/60 focus:outline-none"
                />
              </div>
              <select
                value={classFilter} onChange={(e) => setClassFilter(e.target.value)} aria-label="Filtrar por classe"
                className="rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink focus:border-[#6366f1]/60 focus:outline-none"
              >
                <option value="all">Todas as classes</option>
                {usedClasses.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <p className="py-16 text-center text-sm text-ink-muted">Nenhum personagem corresponde à busca.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((c, i) => (
                    <CharacterCard key={c.id} character={c} index={i} showOwner={userRole === 'MASTER'} onDelete={() => setDeleteId(c.id)} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={!!importing} onOpenChange={(o) => !o && !importBusy && setImporting(null)}>
        <AlertDialogContent className="border-line-strong bg-surface">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ink">Importar ficha?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-muted">
              {importing && `${importing.name} — ${importing.race ?? '?'} · ${importing.class ?? '?'} · Nível ${importing.level ?? 1}. Será criado um novo personagem na sua conta.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importBusy} className="border-line-strong bg-transparent text-ink-soft hover:bg-ink/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction disabled={importBusy} onClick={(e) => { e.preventDefault(); confirmImport(); }} className="border-0 bg-[#6366f1] text-white hover:bg-[#4f46e5]">
              {importBusy ? 'Importando...' : 'Importar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="border-line-strong bg-surface">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ink">Excluir personagem?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-muted">
              Esta ação não pode ser desfeita. O personagem será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-line-strong bg-transparent text-ink-soft hover:bg-ink/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="border-0 bg-red-600 text-white hover:bg-red-700">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function EmptyState() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col items-center justify-center gap-4 text-center"
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#6366f1]/30 bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/10"
      >
        <Users className="h-9 w-9 text-indigo-ink" />
      </motion.div>
      <div>
        <p className="text-lg font-semibold text-ink">Sua jornada começa aqui</p>
        <p className="mt-1 text-sm text-ink-muted">Nenhum personagem criado ainda. Escolha raça, classe e antecedente para dar vida a um herói.</p>
      </div>
      <Link href="/characters/new">
        <Button className="border-0 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white">
          <Plus className="mr-1.5 h-4 w-4" />Criar primeiro personagem
        </Button>
      </Link>
    </motion.div>
  );
}

function CharacterCard({ character: c, index, showOwner, onDelete }: {
  character: Character; index: number; showOwner: boolean; onDelete: () => void;
}) {
  const reduce = useReducedMotion();
  const sheet = getSheet(c);
  const cls = getClass(sheet.classId) ?? CLASSES.find((k) => norm(k.name) === norm(c.class || ''));
  const race = getRace(sheet.raceId);
  const style = classStyle(cls?.id);
  const pct = c.maxHitPoints > 0 ? Math.min(100, (c.currentHitPoints / c.maxHitPoints) * 100) : 0;
  const hpColor = pct > 50 ? '#22c55e' : pct > 25 ? '#f5c451' : '#ef4444';

  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : Math.min(index, 12) * 0.05 } }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="group relative overflow-hidden rounded-xl border border-line bg-canvas transition-colors hover:border-line-strong"
    >
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${style.color}, transparent)` }} />
      <Link href={`/characters/${c.id}`} className="block p-4" aria-label={`Abrir ficha de ${c.name}`}>
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border" style={{ borderColor: `${style.color}55`, background: `${style.color}1a`, color: accentText(style.color) }}>
            <style.icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{c.name}</p>
            <p className="truncate text-xs text-ink-soft">{race?.name ?? c.race} · {cls?.name ?? c.class}</p>
            {showOwner && c.user && (
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ink-faint"><User className="h-3 w-3" />{c.user.username}</p>
            )}
          </div>
          <span className="rounded-full border border-[#f5c451]/30 bg-[#f5c451]/10 px-2 py-0.5 text-[10px] font-semibold text-gold-ink">Nv {c.level}</span>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-[11px] text-ink-muted">
            <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-red-400" />PV</span>
            <span className="tabular-nums text-ink-soft">{c.currentHitPoints}/{c.maxHitPoints}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
            <motion.div
              className="h-full rounded-full" style={{ backgroundColor: hpColor }}
              initial={reduce ? false : { width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.2 + index * 0.05 }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
          <Shield className="h-3.5 w-3.5 text-indigo-ink" />CA <span className="font-semibold text-ink">{c.armorClass}</span>
        </div>
      </Link>
      <button
        type="button" onClick={onDelete} aria-label={`Excluir ${c.name}`}
        className="absolute bottom-3 right-3 rounded-md p-1.5 text-ink-faint opacity-0 transition hover:bg-red-500/10 hover:text-red-400 focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
