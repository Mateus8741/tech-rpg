import { cn } from '@/lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  /** Conteúdo à direita (contagem, link, botão). */
  aside?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, aside, className }: SectionTitleProps) {
  return (
    <div className={cn('mb-3 flex items-center gap-3', className)}>
      <span aria-hidden className="text-xs text-gold">◆</span>
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold-soft">{children}</h2>
      <span aria-hidden className="h-px flex-1 bg-linear-to-r from-gold/30 to-transparent" />
      {aside && <div className="text-xs text-ink-muted">{aside}</div>}
    </div>
  );
}
