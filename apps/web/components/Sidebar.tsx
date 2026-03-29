'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/characters', icon: Users, label: 'Personagens' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [initial, setInitial] = useState('?');

  useEffect(() => {
    const username = (localStorage.getItem('rpg_username') || '').trim() || '?';
    setInitial((username[0] ?? '?').toUpperCase());
  }, []);

  return (
    <aside className="w-[60px] bg-[#0a0c14] border-r border-[#1e2035] flex flex-col items-center py-4 gap-1 flex-shrink-0 h-screen sticky top-0" aria-label="Navigation">
      {/* Logo */}
      <div className="w-9 h-9 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center mb-5 flex-shrink-0">
        <Swords className="w-4 h-4 text-white" />
      </div>

      {/* Nav items */}
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            title={label}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
              isActive
                ? 'bg-[#6366f1]/15 border border-[#6366f1]/30'
                : 'hover:bg-white/5'
            )}
          >
            <Icon
              className={cn(
                'w-[18px] h-[18px]',
                isActive ? 'text-[#a78bfa]' : 'text-[#64748b]'
              )}
            />
          </Link>
        );
      })}

      <div className="flex-1" />

      {/* User avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 flex-shrink-0">
        {initial}
      </div>
    </aside>
  );
}
