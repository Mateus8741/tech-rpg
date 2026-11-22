'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Se já houver usuário salvo, vai direto para as fichas; senão, para a tela de entrada.
export function ContinueCta() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem('rpg_username'));
  }, []);

  return (
    <Link
      href={user ? '/characters' : '/entrar'}
      className="inline-flex min-h-12 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-5 py-3 text-sm font-semibold text-ink outline-none transition hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-indigo sm:w-auto"
    >
      {user ? `Continuar como ${user}` : 'Entrar com meu personagem'}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
