'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, BookOpen, Backpack, Check, FileText, Loader2, ScrollText, Swords, User, Wand2 } from 'lucide-react';
import { getSheet } from '@/lib/sheet';
import CombatTracker from '@/components/CombatTracker';
import { useCharacter, type SaveState } from './useCharacter';
import { RollProvider } from './ui';
import SheetTab from './SheetTab';
import FeaturesTab from './FeaturesTab';
import SpellsTab from './SpellsTab';
import EquipmentTab from './EquipmentTab';
import NotesTab from './NotesTab';
import LegacyBanner from './LegacyBanner';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'ficha', label: 'Ficha', icon: User },
  { id: 'caracteristicas', label: 'Características', icon: ScrollText },
  { id: 'magias', label: 'Magias', icon: Wand2 },
  { id: 'equipamento', label: 'Equipamento', icon: Backpack },
  { id: 'combate', label: 'Combate', icon: Swords },
  { id: 'notas', label: 'Notas', icon: BookOpen },
] as const;
type TabId = (typeof TABS)[number]['id'];

function SaveBadge({ state }: { state: SaveState }) {
  if (state === 'idle') return null;
  const map = {
    pending: { t: 'Alterações pendentes', i: <FileText className="h-3 w-3" />, c: 'text-[#64748b]' },
    saving: { t: 'Salvando...', i: <Loader2 className="h-3 w-3 animate-spin" />, c: 'text-[#a5b4fc]' },
    saved: { t: 'Salvo', i: <Check className="h-3 w-3" />, c: 'text-green-400' },
    error: { t: 'Erro ao salvar', i: <FileText className="h-3 w-3" />, c: 'text-red-400' },
  } as const;
  const m = map[state];
  return <span className={cn('flex items-center gap-1 text-xs', m.c)}>{m.i}{m.t}</span>;
}

export default function CharacterSheet({ id }: { id: string }) {
  const api = useCharacter(id);
  const [tab, setTab] = useState<TabId>('ficha');
  const reduce = useReducedMotion();

  if (api.loading) return <div className="flex h-full items-center justify-center text-[#64748b]">Carregando...</div>;
  if (!api.character) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#64748b]">
        <p>Personagem não encontrado ou sem permissão.</p>
        <Link href="/characters" className="text-sm text-[#a5b4fc] hover:underline">Voltar à lista</Link>
      </div>
    );
  }
  const c = api.character;
  const legacy = !getSheet(c).classId && !getSheet(c).raceId;
  const hasSpells = !!getSheet(c).classId;

  return (
    <RollProvider>
      <div className="flex h-full flex-col">
        <header className="flex min-h-[52px] flex-shrink-0 items-center gap-3 border-b border-[#1e2035] px-4 sm:px-6">
          <Link href="/characters" aria-label="Voltar" className="text-[#64748b] hover:text-[#e2e8f0]"><ArrowLeft className="h-4 w-4" /></Link>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#e2e8f0]">{c.name}</p>
          {api.userRole === 'MASTER' && c.user && <span className="hidden text-xs text-[#475569] sm:inline">Jogador: {c.user.username}</span>}
          <SaveBadge state={api.saveState} />
        </header>

        <nav className="flex-shrink-0 overflow-x-auto border-b border-[#1e2035] px-2 sm:px-4" aria-label="Seções da ficha">
          <LayoutGroup>
            <div role="tablist" className="flex gap-1">
              {TABS.filter((t) => t.id !== 'magias' || hasSpells).map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id} role="tab" aria-selected={active} type="button" onClick={() => setTab(t.id)}
                    className={cn('relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm transition-colors', active ? 'text-[#e2e8f0]' : 'text-[#64748b] hover:text-[#94a3b8]')}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                    {active && (
                      <motion.span
                        layoutId="sheet-tab-underline"
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </nav>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl space-y-4">
            {legacy && <LegacyBanner api={api} />}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.18 }}
              >
                {tab === 'ficha' && <SheetTab api={api} />}
                {tab === 'caracteristicas' && <FeaturesTab api={api} />}
                {tab === 'magias' && <SpellsTab api={api} />}
                {tab === 'equipamento' && <EquipmentTab api={api} />}
                {tab === 'combate' && (
                  <CombatTracker character={c} username={api.username} userRole={api.userRole} onUpdate={() => void api.reload()} />
                )}
                {tab === 'notas' && <NotesTab api={api} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </RollProvider>
  );
}
