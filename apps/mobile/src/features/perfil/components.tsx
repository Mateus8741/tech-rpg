import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Icon, cx, useThemeColor, type IconName } from '@/components/ui';
import { Pop, Pulse, SPRING, AnimatedView } from '@/components/motion';

import { THEME_OPTIONS, type ThemePreference } from './theme';

/** Conta de 0 até o valor (ease-out), respeitando reduzir movimento. */
export function useCountUp(target: number, duration = 800) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? target : 0);
  const from = useRef(0);
  useEffect(() => {
    if (reduce) {
      setV(target);
      return;
    }
    const start = Date.now();
    const a = from.current;
    let raf = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setV(Math.round(a + (target - a) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduce]);
  return v;
}

/** Avatar com anel tracejado girando devagar e halo pulsante. */
export function AvatarHero({ initial, master }: { initial: string; master: boolean }) {
  const gold = useThemeColor('--color-gold');
  const rot = useSharedValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    rot.value = withRepeat(withTiming(360, { duration: 16000, easing: Easing.linear }), -1);
  }, [rot, reduce]);
  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return (
    <Pop>
      <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
        <Pulse min={0.2} scale={1.18} duration={2400} style={{ position: 'absolute' }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: gold, opacity: 0.18 }} />
        </Pulse>
        <AnimatedView
          style={[{ position: 'absolute', width: 92, height: 92, borderRadius: 46, borderWidth: 2, borderStyle: 'dashed', borderColor: gold }, ring]}
        />
        <View className={cx('h-[72px] w-[72px] items-center justify-center rounded-full', master ? 'bg-violet' : 'bg-indigo')}>
          <Text className="font-display text-3xl" style={{ color: '#fff' }}>
            {initial}
          </Text>
        </View>
      </View>
    </Pop>
  );
}

/** Tile de estatística (ícone + rótulo + valor). */
export function StatTile({ icon, label, children, onPress, hint }: { icon: IconName; label: string; children: React.ReactNode; onPress?: () => void; hint?: string }) {
  const gold = useThemeColor('--color-gold');
  const body = (
    <View className="min-h-[96px] flex-1 justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
      <View className="h-9 w-9 items-center justify-center rounded-xl bg-gold/15">
        <Icon name={icon} size={18} color={gold} />
      </View>
      <View className="gap-0.5">
        {children}
        <Text className="text-xs text-ink-muted">{label}</Text>
      </View>
    </View>
  );
  if (!onPress) return <View className="flex-1">{body}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={hint} onPress={onPress} className="flex-1 active:opacity-70">
      {body}
    </Pressable>
  );
}

/** Seletor de tema com pílula deslizante em mola. */
export function ThemeSelector({ preference, onChange }: { preference: ThemePreference; onChange: (p: ThemePreference) => void }) {
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const reduce = useReducedMotion();
  const first = useRef(true);
  const idx = THEME_OPTIONS.findIndex((o) => o.id === preference);
  const cell = w ? (w - 8) / THEME_OPTIONS.length : 0;
  const gold = useThemeColor('--color-gold');
  const soft = useThemeColor('--color-ink-soft');
  const onGold = useThemeColor('--color-on-gold');

  useEffect(() => {
    if (!cell) return;
    const t = idx * cell;
    if (first.current || reduce) {
      x.value = t;
      first.current = false;
    } else x.value = withSpring(t, SPRING);
  }, [idx, cell, x, reduce]);

  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View className="flex-row rounded-2xl border border-line bg-surface p-1" onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {cell > 0 && <AnimatedView pointerEvents="none" className="absolute bottom-1 left-1 top-1 rounded-xl bg-gold" style={[{ width: cell }, pill]} />}
      {THEME_OPTIONS.map((o) => {
        const on = preference === o.id;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onChange(o.id);
            }}
            className="min-h-[64px] flex-1 items-center justify-center gap-1 rounded-xl py-2"
          >
            <Icon name={o.icon} size={22} color={on ? onGold : soft} />
            <Text className={cx('text-[13px] font-semibold', on ? 'text-on-gold' : 'text-ink-soft')}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
