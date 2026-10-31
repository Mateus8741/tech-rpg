import Sidebar from '@/components/Sidebar';
import { DiceTray } from '@/components/dice';
import PageTransition from '@/components/motion/PageTransition';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <PageTransition className="flex flex-1 flex-col">{children}</PageTransition>
      </main>
      <DiceTray />
    </div>
  );
}
