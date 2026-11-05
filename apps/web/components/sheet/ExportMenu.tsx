'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Download, FileJson, Printer, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import type { Character } from '@/lib/api';
import { exportCharacter, exportFileName } from '@/lib/character-io';

const itemCls = 'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] text-ink-body hover:bg-ink/5 focus:bg-ink/5 focus:outline-none';

export default function ExportMenu({ character }: { character: Character }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const downloadJson = () => {
    try {
      const blob = new Blob([JSON.stringify(exportCharacter(character), null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = exportFileName(character);
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
      toast.success('Ficha exportada');
    } catch {
      toast.error('Não foi possível exportar a ficha');
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-3 py-1.5 text-[13px] text-ink-soft hover:bg-ink/5 hover:text-ink"
      >
        <Download className="h-4 w-4" />Exportar<ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-1 w-48 rounded-lg border border-line-strong bg-surface p-1 shadow-xl">
          <button role="menuitem" type="button" onClick={downloadJson} className={itemCls}>
            <FileJson className="h-4 w-4" />Baixar JSON
          </button>
          <Link role="menuitem" href={`/characters/${character.id}/print`} onClick={() => setOpen(false)} className={itemCls}>
            <Printer className="h-4 w-4" />Imprimir / PDF
          </Link>
        </div>
      )}
    </div>
  );
}
