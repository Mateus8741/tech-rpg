import { cn } from '@/lib/utils';

interface StatBlockProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Texto secundário abaixo (ex.: modificador). */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  /** Destaca com dourado. */
  highlight?: boolean;
  className?: string;
}

export function StatBlock({ label, value, hint, icon, highlight, className }: StatBlockProps) {
  return (
    <div
      className={cn(
        'surface flex flex-col items-center gap-1 px-4 py-3 text-center',
        highlight && 'border-gold/40',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {icon}
        {label}
      </div>
      <div className={cn('text-2xl font-bold tabular-nums', highlight ? 'text-gold' : 'text-ink')}>{value}</div>
      {hint && <div className="text-xs text-ink-soft">{hint}</div>}
    </div>
  );
}
