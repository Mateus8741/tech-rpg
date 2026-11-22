import { useEffect, useState, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { ClassFeature, Trait } from '@repo/rules';
import {
  Animated,
  Easing,
  FadeIn,
  LinearTransition,
  Pop,
  PressScale,
  Pulse,
  Reveal,
  RevealItem,
  Shimmer, AnimatedView } from '@/components/motion';
import { FadeOut, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Badge, Body, Card, Chip, cx, EmptyState, Heading, Icon, Muted, useThemeColor, type BadgeTone, type IconName } from '@/components/ui';

/** Texto de regra (quebras de linha são preservadas pelo Text). */
export function RuleText({ text, className }: { text: string; className?: string }) {
  return <Body className={className}>{text}</Body>;
}

/** Hero de detalhe: gradiente dourado, ícone marca-d'água que respira, título e resumo. */
export function DetailHeader({ eyebrow, title, summary, icon = 'book-outline', children }: { eyebrow: string; title: string; summary?: string; icon?: IconName; children?: ReactNode }) {
  const gold = useThemeColor('--color-gold');
  return (
    <Reveal from="fade">
      <View className="overflow-hidden rounded-3xl border border-gold/30 bg-surface">
        <LinearGradient colors={['#e0b04c40', '#8b5cf620', '#00000000']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View className="absolute -right-4 -top-4" pointerEvents="none">
          <Pulse min={0.5} scale={1.08} duration={2600}>
            <Icon name={icon} size={120} color={gold + '33'} />
          </Pulse>
        </View>
        <View className="gap-2 p-5">
          <Text className="text-[11px] font-bold uppercase tracking-[3px] text-gold-ink">{eyebrow}</Text>
          <Text className="font-display text-[32px] leading-10 text-gold-ink">{title}</Text>
          <View className="h-[3px] w-14 rounded-full bg-gold" />
          {summary ? <Body className="mt-1 text-ink-soft">{summary}</Body> : null}
          {children ? <View className="mt-2 gap-2">{children}</View> : null}
        </View>
      </View>
    </Reveal>
  );
}

/** Card com título dourado (equivalente ao Panel da web). */
export function Panel({ title, children, className, index = 1 }: { title?: string; children: ReactNode; className?: string; index?: number }) {
  return (
    <RevealItem index={index}>
      <Card className={cx('gap-2.5 rounded-3xl', className)}>
        {title ? (
          <View className="flex-row items-center gap-2">
            <View className="h-4 w-1 rounded-full bg-gold" />
            <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-gold-ink">{title}</Text>
          </View>
        ) : null}
        {children}
      </Card>
    </RevealItem>
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
          <Text className="text-sm leading-5 text-gold-ink">•</Text>
          <Body className="flex-1">{e}</Body>
        </View>
      ))}
    </View>
  );
}

/** Seletor segmentado feito de Chips (rola na horizontal se não couber). */
export function Segmented<T extends string>({ options, value, onChange, labels }: { options: readonly T[]; value: T; onChange: (v: T) => void; labels?: Partial<Record<T, string>> }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 py-0.5" className="grow-0">
      {options.map((o) => (
        <Chip key={o} label={labels?.[o] ?? o} selected={o === value} onPress={() => onChange(o)} />
      ))}
    </ScrollView>
  );
}

/** Item de lista que navega para o detalhe (entrada escalonada + toque em mola). */
export function ListItemCard({ title, subtitle, right, badges, onPress, icon, index = 0 }: { title: string; subtitle?: string; right?: ReactNode; badges?: ReactNode; onPress: () => void; icon?: IconName; index?: number }) {
  const gold = useThemeColor('--color-gold-ink');
  return (
    <RevealItem index={index}>
      <PressScale onPress={onPress} accessibilityRole="button" accessibilityLabel={title} scaleTo={0.97} className="min-h-[64px] flex-row items-start gap-3 rounded-3xl border border-line bg-surface p-4">
        {icon ? (
          <View className="h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
            <Icon name={icon} size={22} color={gold} />
          </View>
        ) : null}
        <View className="flex-1 gap-1.5">
          <View className="flex-row items-start justify-between gap-3">
            <Heading className="flex-1 text-[17px] leading-6">{title}</Heading>
            {right}
          </View>
          {subtitle ? (
            <Muted className="text-sm leading-5" numberOfLines={3}>
              {subtitle}
            </Muted>
          ) : null}
          {badges}
        </View>
        <View className="h-6 justify-center">
          <Icon name="chevron-forward" size={18} />
        </View>
      </PressScale>
    </RevealItem>
  );
}

/** Esqueleto de lista: cartões com brilho enquanto carrega. */
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="flex-row gap-3 rounded-3xl border border-line bg-surface p-4">
          <Shimmer style={{ width: 48, height: 48, borderRadius: 16 }} />
          <View className="flex-1 gap-2">
            <Shimmer style={{ width: '55%', height: 18 }} />
            <Shimmer style={{ width: '90%', height: 12 }} />
            <Shimmer style={{ width: '40%', height: 12 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Mostra o esqueleto por um instante na abertura e então revela o conteúdo. */
export function useBootSkeleton(ms = 350) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return !ready;
}

/** Bloco expansível: chevron gira, conteúdo entra com fade e o layout desliza em mola. */
export function Accordion({ title, children, defaultOpen = false, right }: { title: string; children: ReactNode; defaultOpen?: boolean; right?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const rot = useSharedValue(defaultOpen ? 1 : 0);
  const chev = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value * 180}deg` }] }));
  const toggle = () => {
    rot.value = withTiming(open ? 0 : 1, { duration: 220, easing: Easing.out(Easing.cubic) });
    setOpen((o) => !o);
  };
  return (
    <AnimatedView layout={LinearTransition.springify().damping(20)} className={cx('overflow-hidden rounded-2xl border bg-surface', open ? 'border-gold/40' : 'border-line')}>
      <PressScale
        onPress={toggle}
        scaleTo={0.985}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="min-h-[52px] flex-row items-center justify-between gap-3 px-4 py-3.5"
      >
        <View className="flex-1 flex-row flex-wrap items-center gap-2">
          <Heading className="text-[15px]">{title}</Heading>
          {right}
        </View>
        <AnimatedView style={chev}>
          <Icon name="chevron-down" size={18} />
        </AnimatedView>
      </PressScale>
      {open && (
        <AnimatedView entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)} className="gap-3 border-t border-line px-4 py-3.5">
          {children}
        </AnimatedView>
      )}
    </AnimatedView>
  );
}

export function TraitList({ traits, empty = 'Sem traços adicionais.' }: { traits: Trait[]; empty?: string }) {
  if (!traits.length) return <Muted className="text-sm">{empty}</Muted>;
  return (
    <View className="gap-4">
      {traits.map((t) => (
        <View key={t.name} className="gap-1">
          <Heading className="text-[15px]">{t.name}</Heading>
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
        <RevealItem key={`${f.level}-${f.name}-${i}`} index={i} style={{ gap: 6 }}>
          <View className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-canvas bg-gold" />
          <View className="flex-row flex-wrap items-center gap-2">
            <Badge tone="gold">{`Nível ${f.level}`}</Badge>
            <Heading className="shrink text-sm">{f.name}</Heading>
          </View>
          <RuleText text={f.description} />
        </RevealItem>
      ))}
    </View>
  );
}

/** Tabela simples com rolagem horizontal (larguras fixas por coluna). */
export function DataTable({ columns, rows }: { columns: { label: string; width: number; className?: string }[]; rows: ReactNode[][] }) {
  return (
    <View className="overflow-hidden rounded-2xl border border-gold/30">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View className="flex-row border-b border-gold/40 bg-gold/10">
            {columns.map((c) => (
              <Text key={c.label} style={{ width: c.width }} className="px-2.5 py-3 text-[11px] font-bold uppercase tracking-wider text-gold-ink">
                {c.label}
              </Text>
            ))}
          </View>
          {rows.map((r, i) => (
            <View key={i} className={cx('flex-row border-t border-line', i % 2 ? 'bg-surface-2' : 'bg-surface')}>
              {r.map((cell, j) => (
                <View key={j} style={{ width: columns[j]!.width }} className="justify-center px-2.5 py-2.5">
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
  return (
    <Pop>
      <EmptyState icon={icon} title={text} message="Tente outro termo de busca." />
    </Pop>
  );
}

export function NotFound({ what }: { what: string }) {
  return <EmptyState icon="help-circle-outline" title={`${what} não encontrado(a)`} />;
}
