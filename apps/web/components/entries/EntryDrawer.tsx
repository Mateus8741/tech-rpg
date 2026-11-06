'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getSpell } from '@repo/rules';
import { Drawer } from '@/components/ui/drawer';
import { SpellDetail } from '@/components/spells/SpellDetail';
import { resolveEntry } from './resolve';
import type { EntryRef } from './types';

/** Painel de detalhes de qualquer item do jogo. Carregado sob demanda: @repo/rules é grande. */
export default function EntryDrawer({ entry, onClose }: { entry: EntryRef | null; onClose: () => void }) {
  const r = entry ? resolveEntry(entry) : null;
  const spell = r?.spellId ? getSpell(r.spellId) : undefined;

  return (
    <Drawer
      open={!!entry} onClose={onClose} widthClassName="max-w-lg"
      title={spell ? 'Magia' : r?.title ?? 'Não encontrado'} description={spell ? undefined : r?.tag}
    >
      {!r && <p className="text-sm text-ink-muted">Este item não está no compêndio.</p>}
      {spell && <SpellDetail spell={spell} />}
      {r && !spell && (
        <div className="space-y-4">
          {r.meta.length > 0 && (
            <dl className="grid grid-cols-2 gap-2">
              {r.meta.map((m) => (
                <div key={m.label} className="rounded-lg border border-line bg-base px-3 py-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">{m.label}</dt>
                  <dd className="mt-0.5 text-sm text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {r.body && <div className="whitespace-pre-line text-sm leading-relaxed text-ink-body">{r.body}</div>}
        </div>
      )}
      {r?.href && (
        <Link href={r.href} onClick={onClose} className="mt-5 inline-flex items-center gap-1 text-sm text-indigo-ink hover:underline">
          Ver no compêndio <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </Drawer>
  );
}
