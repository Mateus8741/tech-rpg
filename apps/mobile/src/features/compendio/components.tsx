import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { ClassFeature, Trait } from '@repo/rules';

import { Badge, Body, Card, Chip, cx, EmptyState, Heading, Icon, Muted, PressableCard, type BadgeTone, type IconName } from '@/components/ui';

/** Texto de regra (quebras de linha são preservadas pelo Text). */
export function RuleText({ text, className }: { text: string; className?: string }) {
  return <Body className={className}>{text}</Body>;
}

/** Cabeçalho de detalhe: eyebrow + nome + resumo. */
export function DetailHeader({ eyebrow, title, summary, children }: { eyebrow: string; title: string; summary?: string; children?: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-gold-ink">{eyebrow}</Text>
      <Text className="font-display text-3xl text-ink">{title}</Text>
      {summary ? <Body className="text-ink-soft">{summary}</Body> : null}
      {children}
    </View>
  );
}

/** Card com título dourado (equivalente ao Panel da web). */
export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <Card className={cx('gap-2', className)}>
      {title ? <Text className="text-[11px] font-semibold uppercase tracking-[1.5px] text-gold-ink">{title}</Text> : null}
      {children}
    </Card>
  );
}

export function BadgeRow({ items, tone = 'neutral' }: { items: { label: string; tone?: BadgeTone }[]; tone?: BadgeTone }) {
  if (!items.length) return null;
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {items.map((b, i) => (
        <Badge key={`${b.label}-${i}`} tone={b.tone ?? tone}>
          {b.label}
        </Badge>
      ))}
    </View>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <View className="gap-1.5">
      {items.map((e, i) => (
        <View key={i} className="flex-row gap-2">
          <Text className="text-sm leading-5 text-indigo-ink">•</Text>
          <Body className="flex-1">{e}</Body>
        </View>
      ))}
    </View>
  );
}

/** Seletor segmentado feito de Chips (rola na horizontal se não couber). */
export function Segmented<T extends string>({ options, value, onChange, labels }: { options: readonly T[]; value: T; onChange: (v: T) => void; labels?: Partial<Record<T, string>> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1.5" className="grow-0">
      {options.map((o) => (
        <Chip key={o} label={labels?.[o] ?? o} selected={o === value} onPress={() => onChange(o)} />
      ))}
    </ScrollView>
  );
}

/** Item de lista que navega para o detalhe. */
export function ListItemCard({ title, subtitle, right, badges, onPress }: { title: string; subtitle?: string; right?: ReactNode; badges?: ReactNode; onPress: () => void }) {
  return (
    <PressableCard onPress={onPress} accessibilityRole="button" className="gap-2">
      <View className="flex-row items-start justify-between gap-3">
        <Heading className="flex-1 text-[17px]">{title}</Heading>
        {right}
        <Icon name="chevron-forward" size={18} />
      </View>
      {subtitle ? (
        <Muted className="text-sm leading-5" numberOfLines={3}>
          {subtitle}
        </Muted>
      ) : null}
      {badges}
    </PressableCard>
  );
}

/** Bloco expansível. */
export function Accordion({ title, children, defaultOpen = false, right }: { title: string; children: ReactNode; defaultOpen?: boolean; right?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View className="overflow-hidden rounded-2xl border border-line bg-surface">
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="flex-row items-center justify-between gap-3 px-4 py-3.5 active:opacity-70"
      >
        <View className="flex-1 flex-row flex-wrap items-center gap-2">
          <Heading className="text-[15px]">{title}</Heading>
          {right}
        </View>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={18} />
      </Pressable>
      {open && <View className="gap-3 border-t border-line px-4 py-3.5">{children}</View>}
    </View>
  );
}

export function TraitList({ traits, empty = 'Sem traços adicionais.' }: { traits: Trait[]; empty?: string }) {
  if (!traits.length) return <Muted className="text-sm">{empty}</Muted>;
  return (
    <View className="gap-4">
      {traits.map((t) => (
        <View key={t.name} className="gap-1">
          <Heading className="text-sm">{t.name}</Heading>
          <RuleText text={t.description} />
        </View>
      ))}
    </View>
  );
}

/** Linha do tempo de características por nível. */
export function FeatureTimeline({ features }: { features: ClassFeature[] }) {
  if (!features.length) return <Muted className="text-sm">Nenhuma característica.</Muted>;
  return (
    <View className="ml-2 gap-5 border-l border-line pl-5">
      {features.map((f, i) => (
        <View key={`${f.level}-${f.name}-${i}`} className="gap-1.5">
          <View className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border border-indigo bg-violet" />
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge tone="gold">{`Nível ${f.level}`}</Badge>
            <Heading className="shrink text-sm">{f.name}</Heading>
          </View>
          <RuleText text={f.description} />
        </View>
      ))}
    </View>
  );
}

/** Tabela simples com rolagem horizontal (larguras fixas por coluna). */
export function DataTable({ columns, rows }: { columns: { label: string; width: number; className?: string }[]; rows: ReactNode[][] }) {
  return (
    <View className="overflow-hidden rounded-2xl border border-line">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View className="flex-row bg-surface-2">
            {columns.map((c) => (
              <Text key={c.label} style={{ width: c.width }} className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                {c.label}
              </Text>
            ))}
          </View>
          {rows.map((r, i) => (
            <View key={i} className="flex-row border-t border-line bg-surface">
              {r.map((cell, j) => (
                <View key={j} style={{ width: columns[j]!.width }} className="justify-center px-2 py-2">
                  {typeof cell === 'string' || typeof cell === 'number' ? (
                    <Text className={cx('text-[13px] text-ink-body', columns[j]!.className)}>{cell}</Text>
                  ) : (
                    cell
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function NoResults({ text, icon = 'search-outline' }: { text: string; icon?: IconName }) {
  return <EmptyState icon={icon} title={text} message="Tente outro termo de busca." />;
}

export function NotFound({ what }: { what: string }) {
  return <EmptyState icon="help-circle-outline" title={`${what} não encontrado(a)`} />;
}
