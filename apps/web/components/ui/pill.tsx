import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pillVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'border-line-strong bg-ink/5 text-ink-soft',
        indigo: 'border-indigo/30 bg-indigo/15 text-violet-soft',
        gold: 'border-gold/30 bg-gold/10 text-gold',
        success: 'border-success/30 bg-success/10 text-success',
        danger: 'border-danger/30 bg-danger/10 text-danger',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

interface PillProps extends React.ComponentProps<'span'>, VariantProps<typeof pillVariants> {}

export function Pill({ tone, className, ...props }: PillProps) {
  return <span className={cn(pillVariants({ tone }), className)} {...props} />;
}
