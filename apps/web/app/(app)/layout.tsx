import Sidebar from '@/components/Sidebar';
import { DiceTray } from '@/components/dice';
import CommandPalette from '@/components/search/CommandPalette';
import PageTransition from '@/components/motion/PageTransition';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-indigo focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-gold"
      >
        Pular para o conteúdo
      </a>
      <Sidebar />
      <main id="conteudo" tabIndex={-1} className="flex-1 flex flex-col overflow-y-auto outline-none">
        <PageTransition className="flex flex-1 flex-col">{children}</PageTransition>
      </main>
      <DiceTray />
      <CommandPalette />
    </div>
  );
}
