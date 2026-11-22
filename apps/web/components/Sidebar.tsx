'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, Library, Sparkles, ScrollText, Dices, Swords, LogOut, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { openSearch } from '@/components/search/store';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { href: '/characters', icon: Users, label: 'Personagens' },
  { href: '/compendio', icon: Library, label: 'Compêndio' },
  { href: '/magias', icon: Sparkles, label: 'Magias' },
  { href: '/regras', icon: ScrollText, label: 'Regras' },
  { href: '/dados', icon: Dices, label: 'Dados' },
];

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-line-strong bg-surface-2 px-2.5 py-1.5 text-xs font-medium text-ink opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      {children}
    </span>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername((localStorage.getItem('rpg_username') || '').trim());
  }, []);

  const initial = (username[0] ?? '?').toUpperCase();

  return (
    <aside
      className="sticky top-0 z-40 flex h-screen w-[64px] shrink-0 flex-col items-center gap-1 border-r border-line bg-base py-4"
      aria-label="Navegação principal"
    >
      <Link
        href="/characters"
        aria-label="Início"
        className="bg-brand-gradient mb-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-[0_0_20px_-4px_rgb(99_102_241/0.6)]"
      >
        <Swords className="h-4 w-4 text-white" />
      </Link>

      <LayoutGroup id="sidebar-nav">
        <nav className="flex flex-col items-center gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl outline-none transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-indigo/60"
              >
                {isActive && (
                  <>
                    <motion.span
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl border border-indigo/30 bg-indigo/15"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                    <motion.span
                      layoutId="sidebar-active-bar"
                      className="absolute -left-[13px] h-5 w-[3px] rounded-r-full bg-gold"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  </>
                )}
                <Icon
                  className={cn(
                    'relative h-[18px] w-[18px] transition-colors',
                    isActive ? 'text-violet-soft' : 'text-ink-muted group-hover:text-ink',
                  )}
                />
                <Tooltip>{label}</Tooltip>
              </Link>
            );
          })}
        </nav>
      </LayoutGroup>

      <div className="flex-1" />

      <button
        type="button"
        onClick={openSearch}
        aria-label="Buscar (Ctrl K)"
        aria-keyshortcuts="Control+K Meta+K"
        className="group relative mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted outline-none transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo/60"
      >
        <Search className="h-4 w-4" />
        <Tooltip>Buscar (Ctrl K)</Tooltip>
      </button>

      <ThemeToggle tooltip={(label) => <Tooltip>{label}</Tooltip>} />

      <Link
        href="/entrar"
        aria-label="Sair"
        className="group relative mb-2 flex h-9 w-9 items-center justify-center rounded-xl text-ink-muted outline-none transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-indigo/60"
      >
        <LogOut className="h-4 w-4" />
        <Tooltip>Sair</Tooltip>
      </Link>

      <div className="group relative">
        <div className="bg-brand-gradient flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-gold/30">
          {initial}
        </div>
        {username && <Tooltip>{username}</Tooltip>}
      </div>
    </aside>
  );
}
