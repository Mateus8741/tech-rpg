import { CLASSES, getClass, getRace } from '@repo/rules';
import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, ScrollView, Text, View, type LayoutChangeEvent } from 'react-native';

import { Icon, Muted, cx, useThemeColor, type IconName } from '@/components/ui';
import { Animated, AnimatedBar, Pop, PressScale, RevealItem, SPRING } from '@/components/motion';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { Character } from '@/lib/api';

import { getSheet, hpTone, norm } from './sheet';

type MeterTone = 'success' | 'gold' | 'danger' | 'indigo';
const TONE_VAR = { success: '--color-success', gold: '--color-gold', danger: '--color-danger', indigo: '--color-indigo' } as const;

/** Barra de progresso animada (PV, mana). A cor segue o estado dos PV quando não há tom fixo. */
export function MeterBar({ value, max, tone, height = 10 }: { value: number; max: number; tone?: MeterTone; className?: string; height?: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const t = tone ?? hpTone(value, max);
  const color = useThemeColor(TONE_VAR[t]);
  const track = useThemeColor('--color-surface-3');
  return <AnimatedBar value={pct} color={color} track={track} height={height} style={undefined} />;
}

/** Número que conta até o valor (respeita reduzir movimento). */
export function CountUp({ value, duration = 650, className, format }: { value: number; duration?: number; className?: string; format?: (n: number) => string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled) return;
      const start = from.current;
      if (reduce || start === value) {
        from.current = value;
        setShown(value);
        return;
      }
      const t0 = Date.now();
      const tick = () => {
        const p = Math.min(1, (Date.now() - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = Math.round(start + (value - start) * eased);
        from.current = v;
        setShown(v);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);
  return (
    <Text className={className} style={{ fontVariant: ['tabular-nums'] }}>
      {format ? format(shown) : shown}
    </Text>
  );
}

/** Nome exibido da raça/classe, preferindo os dados de @repo/rules. */
export function raceClassLabel(c: Character) {
  const sheet = getSheet(c);
  const race = getRace(sheet.raceId);
  const cls = getClass(sheet.classId) ?? CLASSES.find((k) => norm(k.name) === norm(c.class || ''));
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  return {
    race: race?.name ?? c.race ?? '',
    cls: cls?.name ?? c.class ?? '',
    subclass: sub?.name,
  };
}

const CLASS_ICON: Record<string, IconName> = {
  guerreiro: 'shield', barbaro: 'flame', bárbaro: 'flame', mago: 'sparkles', feiticeiro: 'flash', bruxo: 'moon',
  clerigo: 'sunny', clérigo: 'sunny', druida: 'leaf', ladino: 'eye', bardo: 'musical-notes', paladino: 'shield-checkmark',
  patrulheiro: 'compass', monge: 'hand-left',
};
const classIcon = (cls: string): IconName | undefined => CLASS_ICON[norm(cls)];

/** Card rico de personagem: avatar com anel, classe/nível, PV animado e CA. */
export function CharacterCard({ character: c, showOwner, onPress, index = 0 }: { character: Character; showOwner: boolean; onPress: () => void; index?: number }) {
  const danger = useThemeColor('--color-danger');
  const indigo = useThemeColor('--color-indigo-ink');
  const gold = useThemeColor('--color-gold-ink');
  const faint = useThemeColor('--color-ink-faint');
  const { race, cls } = raceClassLabel(c);
  const icon = classIcon(cls);
  const low = c.maxHitPoints > 0 && c.currentHitPoints / c.maxHitPoints <= 0.25;
  return (
    <RevealItem index={index}>
      <PressScale
        onPress={onPress}
        scaleTo={0.97}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ficha de ${c.name}`}
        className="gap-3.5 overflow-hidden rounded-[22px] border border-line bg-surface p-4 shadow-md shadow-black/25"
      >
        <View className="flex-row items-center gap-3.5">
          <View className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-gold/60 bg-gold/15">
            {icon ? <Icon name={icon} size={26} color={gold} /> : <Text className="font-display text-xl text-gold-ink">{c.name.trim().charAt(0).toUpperCase() || '?'}</Text>}
          </View>
          <View className="min-w-0 flex-1 gap-0.5">
            <Text numberOfLines={1} className="font-display-medium text-[18px] text-ink">{c.name}</Text>
            <Muted numberOfLines={1} className="text-sm text-ink-soft">
              {[race, cls].filter(Boolean).join(' · ') || 'Sem raça/classe'}
            </Muted>
            {showOwner && c.user && (
              <View className="flex-row items-center gap-1">
                <Icon name="person-outline" size={11} color={faint} />
                <Muted className="text-[11px]">{c.user.username}</Muted>
              </View>
            )}
          </View>
          <View className="items-center rounded-xl border border-gold/40 bg-gold/10 px-2.5 py-1.5">
            <Text className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">Nível</Text>
            <Text className="font-display text-xl leading-6 text-gold-ink">{c.level}</Text>
          </View>
        </View>
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <Icon name="heart" size={13} color={danger} />
              <Muted>Pontos de vida</Muted>
            </View>
            <Text className={cx('text-xs font-semibold', low ? 'text-danger' : 'text-ink-soft')} style={{ fontVariant: ['tabular-nums'] }}>
              {c.currentHitPoints}/{c.maxHitPoints}
              {c.temporaryHitPoints > 0 ? ` (+${c.temporaryHitPoints})` : ''}
            </Text>
          </View>
          <MeterBar value={c.currentHitPoints} max={c.maxHitPoints} />
        </View>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5">
            <Icon name="shield" size={13} color={indigo} />
            <Text className="text-xs font-semibold text-ink">CA {c.armorClass}</Text>
          </View>
          {c.maxMana > 0 && (
            <View className="flex-row items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5">
              <Icon name="water" size={13} color={indigo} />
              <Text className="text-xs font-semibold text-ink">{c.currentMana}/{c.maxMana}</Text>
            </View>
          )}
          <View className="flex-1" />
          <Icon name="chevron-forward" size={18} color={faint} />
        </View>
      </PressScale>
    </RevealItem>
  );
}

/** Botão redondo (+/−) com mola e área de toque de 44pt. */
export function RoundButton({ icon, onPress, label, disabled }: { icon: IconName; onPress: () => void; label: string; disabled?: boolean }) {
  const ink = useThemeColor('--color-ink');
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      scaleTo={0.88}
      hitSlop={6}
      className={cx('h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface-2', disabled && 'opacity-40')}
    >
      <Icon name={icon} size={18} color={ink} />
    </PressScale>
  );
}

/** Caixa de estatística (CA, iniciativa...) que aparece com mola e conta o número. */
export function StatTile({ label, value, icon, className }: { label: string; value: ReactNode; icon?: IconName; className?: string; delay?: number }) {
  const indigo = useThemeColor('--color-indigo-ink');
  return (
    <View style={{ flex: 1 }}>
      <View className={cx('items-center gap-1 rounded-2xl border border-line bg-surface-2 px-2 py-3.5', className)}>
        {icon && <Icon name={icon} size={16} color={indigo} />}
        <Text className="text-lg font-bold text-ink" style={{ fontVariant: ['tabular-nums'] }}>{value}</Text>
        <Text className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{label}</Text>
      </View>
    </View>
  );
}

/** Abas com indicador dourado que desliza sob a aba ativa. Com `scroll`, rola horizontalmente. */
export function SegmentedChips<T extends string>({
  options, value, onChange, scroll = true, fill = false,
}: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; scroll?: boolean; fill?: boolean }) {
  const gold = useThemeColor('--color-gold');
  const [layouts, setLayouts] = useState<Record<string, { x: number; w: number }>>({});
  const x = useSharedValue(0);
  const w = useSharedValue(0);
  const ready = useRef(false);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const cur = layouts[value];
  useEffect(() => {
    if (!cur) return;
    if (!ready.current) {
      x.value = cur.x;
      w.value = cur.w;
      ready.current = true;
    } else {
      x.value = withSpring(cur.x, SPRING);
      w.value = withSpring(cur.w, SPRING);
    }
    scrollRef.current?.scrollTo({ x: Math.max(0, cur.x - 40), animated: true });
  }, [cur, x, w]);
  const indicator = useAnimatedStyle(() => ({ width: w.value, transform: [{ translateX: x.value }] }));
  const onLayout = (id: string) => (e: LayoutChangeEvent) => {
    const { x: lx, width } = e.nativeEvent.layout;
    setLayouts((p) => (p[id]?.x === lx && p[id]?.w === width ? p : { ...p, [id]: { x: lx, w: width } }));
  };
  const items = (
    <View className={cx('flex-row', fill && 'flex-1')}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            onLayout={onLayout(o.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.id)}
            className={cx('min-h-[44px] items-center justify-center px-4', fill && 'flex-1')}
          >
            <Text className={cx('text-sm', active ? 'font-bold text-gold-ink' : 'font-medium text-ink-muted')}>{o.label}</Text>
          </Pressable>
        );
      })}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', bottom: 0, left: 0, height: 3, borderRadius: 3, backgroundColor: gold }, indicator]} />
    </View>
  );
  if (!scroll) return items;
  return (
    <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
      {items}
    </ScrollView>
  );
}

/** Ponto de proficiência: vazio, cheio ou duplo (especialização). */
export function ProfDot({ proficient, expertise }: { proficient: boolean; expertise?: boolean }) {
  return (
    <View
      className={cx(
        'h-3 w-3 rounded-full border',
        expertise ? 'border-gold bg-gold' : proficient ? 'border-gold/70 bg-gold/60' : 'border-line-strong bg-transparent',
      )}
    />
  );
}
