'use client';

import { tablistKeyDown } from '@/lib/a11y';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, BookOpen, Backpack, FileText, Pencil, Printer, ScrollText, Swords, User, Wand2, Zap } from 'lucide-react';
import { getSheet } from '@/lib/sheet';
import CombatTracker from '@/components/CombatTracker';
import { useCharacter } from './useCharacter';
import UndoControls from './UndoControls';
import ExportMenu from './ExportMenu';
import { RollProvider } from './ui';
import SheetTab from './SheetTab';
import ActionsTab from './ActionsTab';
import FeaturesTab from './FeaturesTab';
import SpellsTab from './SpellsTab';
import EquipmentTab from './EquipmentTab';
import NotesTab from './NotesTab';
import PaperSheet from './PaperSheet';
import PaperEditor, { type PaperZone } from './PaperEditor';
import LegacyBanner from './LegacyBanner';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'ficha', label: 'Ficha', icon: User },
  { id: 'papel', label: 'Ficha de papel', icon: FileText },
  { id: 'acoes', label: 'Ações', icon: Zap },
  { id: 'caracteristicas', label: 'Características', icon: ScrollText },
  { id: 'magias', label: 'Magias', icon: Wand2 },
  { id: 'equipamento', label: 'Equipamento', icon: Backpack },
  { id: 'combate', label: 'Combate', icon: Swords },
  { id: 'notas', label: 'Notas', icon: BookOpen },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function CharacterSheet({ id }: { id: string }) {
  const api = useCharacter(id);
  const [tab, setTab] = useState<TabId>('ficha');
  const [paperEdit, setPaperEdit] = useState(false);
  const [zone, setZone] = useState<PaperZone>('equipamentos');
  const reduce = useReducedMotion();

  if (api.loading) return <div className="flex h-full items-center justify-center text-ink-muted">Carregando...</div>;
  if (!api.character) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-muted">
        <p>Personagem não encontrado ou sem permissão.</p>
        <Link href="/characters" className="text-sm text-indigo-ink hover:underline">Voltar à lista</Link>
      </div>
    );
  }
  const c = api.character;
  const legacy = !getSheet(c).classId && !getSheet(c).raceId;
  const hasSpells = !!getSheet(c).classId;

  return (
    <RollProvider>
      <div className="flex h-full flex-col">
        <header className="flex min-h-[52px] flex-shrink-0 items-center gap-3 border-b border-line px-4 sm:px-6">
          <Link href="/characters" aria-label="Voltar para personagens" className="rounded-md text-ink-muted outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo/70"><ArrowLeft className="h-4 w-4" /></Link>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{c.name}</p>
          {api.userRole === 'MASTER' && c.user && <span className="hidden text-xs text-ink-faint sm:inline">Jogador: {c.user.username}</span>}
          <UndoControls api={api} />
          <ExportMenu character={c} />
        </header>

        <nav className="flex-shrink-0 overflow-x-auto border-b border-line px-2 sm:px-4" aria-label="Navegação da ficha">
          <LayoutGroup>
            <div role="tablist" aria-label="Seções da ficha" onKeyDown={tablistKeyDown} className="flex gap-1">
              {TABS.filter((t) => t.id !== 'magias' || hasSpells).map((t) => {
                const active = tab === t.id;
                return (
                  <button
                    key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={active} aria-controls="painel-ficha" tabIndex={active ? 0 : -1} type="button" onClick={() => setTab(t.id)}
                    className={cn('relative flex rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo/70 items-center gap-1.5 whitespace-nowrap px-3 py-3 text-sm transition-colors', active ? 'text-ink' : 'text-ink-muted hover:text-ink-soft')}
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
                role="tabpanel"
                id="painel-ficha"
                aria-labelledby={`tab-${tab}`}
                tabIndex={-1}
                className="outline-none"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduce ? 0 : 0.18 }}
              >
                {tab === 'ficha' && <SheetTab api={api} />}
                {tab === 'papel' && (
                  <div className="mx-auto max-w-3xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                      <span>{paperEdit ? 'Toque numa caixa da ficha (ou escolha abaixo) para editar.' : 'Mesma ficha do papel, preenchida com os dados do personagem.'}</span>
                      <div className="flex gap-2">
                        <button type="button" aria-pressed={paperEdit} onClick={() => setPaperEdit((v) => !v)} className={cn('inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px]', paperEdit ? 'border-[#6366f1]/60 bg-[#6366f1]/15 text-ink' : 'border-line-strong text-ink-soft hover:bg-ink/5 hover:text-ink')}><Pencil className="h-4 w-4" />{paperEdit ? 'Concluir edição' : 'Editar'}</button>
                        <Link href={`/characters/${c.id}/print`} className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[13px] text-ink-soft hover:bg-ink/5 hover:text-ink"><Printer className="h-4 w-4" />Imprimir / PDF</Link>
                      </div>
                    </div>
                    {paperEdit && <PaperEditor api={api} zone={zone} onZone={setZone} />}
                    <div className="overflow-hidden rounded-lg shadow-lg"><PaperSheet character={c} editing={paperEdit} zone={zone} onZone={setZone} /></div>
                  </div>
                )}
                {tab === 'acoes' && <ActionsTab api={api} />}
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
