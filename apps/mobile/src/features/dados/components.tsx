import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Badge, Icon, Label, Muted, cx, useThemeColor } from '@/components/ui';
import { Bump, Pop, PressScale, Pulse, RevealItem, SPRING, Shake, AnimatedView } from '@/components/motion';

import { DICE, type DicePool, type DiceRoll, type DieSides, type RollMode } from './dice';
import { DIE_TINT, DieShape } from './DieShape';

export const ROLL_MS = 780;

/** Cor de destaque do dado, resolvendo o dourado do tema para o d20. */
function useTint(sides: number) {
  const gold = useThemeColor('--color-gold');
  return DIE_TINT[sides] || gold;
}

/* ---------------------------------- Palco ---------------------------------- */

const SPARKS = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2);

function Spark({ angle, color, trigger }: { angle: number; color: string; trigger: string }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = 0;
    p.value = withDelay(ROLL_MS - 40, withTiming(1, { duration: 750, easing: Easing.out(Easing.cubic) }));
  }, [trigger, p]);
  const a = useAnimatedStyle(() => ({
    opacity: p.value === 0 ? 0 : 1 - p.value,
    transform: [
      { translateX: Math.cos(angle) * (70 + p.value * 62) },
      { translateY: Math.sin(angle) * (70 + p.value * 62) },
      { scale: 1 - p.value * 0.5 },
    ],
  }));
  return <AnimatedView pointerEvents="none" style={[{ position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: color }, a]} />;
}

/** Palco: dado grande que gira, treme, embaralha o número e assenta com mola. */
export function RollResult({ roll }: { roll: DiceRoll | null }) {
  const reduce = useReducedMotion();
  const gold = useThemeColor('--color-gold');
  const danger = useThemeColor('--color-danger');
  const faint = useThemeColor('--color-ink-faint');
  const ink = useThemeColor('--color-ink');
  const onGold = useThemeColor('--color-on-gold');
  const surface = useThemeColor('--color-surface-2');

  const [shown, setShown] = useState<number | null>(roll?.total ?? null);
  const [rolling, setRolling] = useState(false);

  const rot = useSharedValue(0);
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const aura = useSharedValue(0);
  const rollId = roll?.id;

  const sides = roll ? (roll.groups.length === 1 ? roll.groups[0].sides : 20) : 20;
  const tint = DIE_TINT[sides] || gold;

  useEffect(() => {
    if (!roll) return;
    setShown(roll.total);
    aura.value = 0;
    if (reduce) {
      setRolling(false);
      scale.value = withSequence(withTiming(0.92, { duration: 90 }), withTiming(1, { duration: 160 }));
      return;
    }
    setRolling(true);
    const top = Math.max(sides, 6);
    const iv = setInterval(() => setShown(1 + Math.floor(Math.random() * top)), 55);
    const done = setTimeout(() => {
      clearInterval(iv);
      setShown(roll.total);
      setRolling(false);
    }, ROLL_MS);

    rot.value = 0;
    rot.value = withTiming(720 + (Math.random() > 0.5 ? 0 : 360), { duration: ROLL_MS, easing: Easing.out(Easing.cubic) });
    lift.value = withSequence(withTiming(-26, { duration: 260, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: ROLL_MS - 260, easing: Easing.bounce }));
    scale.value = withSequence(
      withTiming(0.8, { duration: 120 }),
      withTiming(1.05, { duration: ROLL_MS - 120 - 90 }),
      withSpring(1, { damping: 6, stiffness: 240 }),
    );
    if (roll.crit === 'min') {
      shakeX.value = withDelay(
        ROLL_MS,
        withSequence(withTiming(-12, { duration: 50 }), withTiming(12, { duration: 70 }), withTiming(-9, { duration: 70 }), withTiming(6, { duration: 60 }), withTiming(0, { duration: 60 })),
      );
    }
    if (roll.crit === 'max') {
      aura.value = withDelay(ROLL_MS - 60, withRepeat(withSequence(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }), withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.sin) })), -1));
    }
    return () => {
      clearInterval(iv);
      clearTimeout(done);
    };
    // Só reanima quando chega uma rolagem nova.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollId, reduce]);

  const dieStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { translateY: lift.value }, { scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));
  const counterStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${-rot.value}deg` }] }));
  const auraStyle = useAnimatedStyle(() => ({ opacity: aura.value * 0.55, transform: [{ scale: 0.9 + aura.value * 0.35 }] }));

  if (!roll) {
    return (
      <View className="items-center gap-3 rounded-[22px] border border-gold/30 bg-surface px-6 py-10">
        <Pulse min={0.5} scale={1.06} duration={2200}>
          <DieShape sides={20} size={96} tint={gold} fill={surface}>
            <Icon name="dice-outline" size={30} color={faint} />
          </DieShape>
        </Pulse>
        <Text className="font-display text-lg text-ink">Pronto para rolar</Text>
        <Muted className="text-center text-sm">Monte um pool abaixo ou digite uma expressão.</Muted>
      </View>
    );
  }

  const crit = !rolling ? roll.crit : null;
  const maxed = crit === 'max';
  const failed = crit === 'min';
  const fill = maxed ? gold : failed ? danger : surface;
  const labelColor = maxed ? onGold : failed ? '#fff' : ink;
  const digits = String(shown ?? '').length;
  const fontSize = digits >= 4 ? 28 : digits === 3 ? 36 : 48;
  const dieTint = failed ? danger : tint;
  const border = maxed ? 'border-gold/60' : failed ? 'border-danger/50' : 'border-gold/30';

  return (
    <View className={cx('items-center gap-3 overflow-hidden rounded-[22px] border bg-surface px-4 pb-6 pt-8', border)}>
      <View style={{ width: 200, height: 190, alignItems: 'center', justifyContent: 'center' }}>
        {maxed && (
          <>
            <AnimatedView
              pointerEvents="none"
              style={[{ position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: gold }, auraStyle]}
            />
            {SPARKS.map((ang) => (
              <Spark key={`${roll.id}-${ang}`} angle={ang} color={gold} trigger={roll.id} />
            ))}
          </>
        )}
        <AnimatedView style={dieStyle}>
          <DieShape sides={sides} size={150} tint={dieTint} fill={fill} active={!maxed && !failed}>
            <AnimatedView style={counterStyle}>
              <Text
                accessibilityLabel={`Total ${roll.total}`}
                className="font-display"
                style={{ color: labelColor, fontSize, lineHeight: fontSize + 8, fontVariant: ['tabular-nums'], opacity: rolling ? 0.6 : 1 }}
              >
                {shown}
              </Text>
            </AnimatedView>
          </DieShape>
        </AnimatedView>
      </View>

      <View key={`meta-${roll.id}`} className="items-center gap-2">
        <ShakeIf on={failed} id={roll.id}>
          <View className="flex-row flex-wrap items-center justify-center gap-2">
            <Text className="text-sm font-semibold text-ink-soft">{roll.expr}</Text>
            {roll.mode !== 'normal' && <Badge tone="violet">{roll.mode === 'advantage' ? 'Vantagem' : 'Desvantagem'}</Badge>}
          </View>
        </ShakeIf>

        {!rolling && maxed && (
          <Pop>
            <Badge tone="gold">20 natural! Crítico</Badge>
          </Pop>
        )}
        {!rolling && failed && (
          <Pop>
            <Badge tone="danger">1 natural — falha crítica</Badge>
          </Pop>
        )}

        {!rolling && (
          <View className="flex-row flex-wrap justify-center gap-1.5">
            {roll.groups.flatMap((g, gi) =>
              g.rolls.map((v, i) => (
                <Pop key={`${gi}-${i}`} delay={Math.min(gi * 4 + i, 14) * 40}>
                  <View className={cx('min-w-10 items-center rounded-lg border px-2 py-1', chipClass(roll, g.sides, v))}>
                    <Text className={cx('text-sm font-bold', chipText(g.sides, v))}>{v}</Text>
                    <Text className="text-[10px] text-ink-muted">d{g.sides}</Text>
                  </View>
                </Pop>
              )),
            )}
            {roll.bonus !== 0 && (
              <Pop delay={200}>
                <View className="min-w-10 items-center justify-center rounded-lg border border-indigo/30 bg-indigo/10 px-2 py-1">
                  <Text className="text-sm font-bold text-indigo-ink">{roll.bonus > 0 ? `+${roll.bonus}` : roll.bonus}</Text>
                  <Text className="text-[10px] text-ink-muted">mod</Text>
                </View>
              </Pop>
            )}
          </View>
        )}

        {!rolling && roll.discarded && (
          <Muted>
            Descartado: [{roll.discarded.rolls.join(', ')}] = {roll.discarded.total}
          </Muted>
        )}
      </View>
    </View>
  );
}

function ShakeIf({ on, id, children }: { on: boolean; id: string; children: ReactNode }) {
  return on ? <Shake trigger={id}>{children}</Shake> : <View>{children}</View>;
}

function chipClass(roll: DiceRoll, sides: number, value: number) {
  if (roll.crit && sides === 20) return roll.crit === 'max' ? 'border-gold/50 bg-gold/15' : 'border-danger/40 bg-danger/15';
  if (value === sides) return 'border-gold/40 bg-gold/10';
  if (value === 1) return 'border-danger/30 bg-danger/10';
  return 'border-line bg-surface-2';
}

function chipText(sides: number, value: number) {
  if (value === sides) return 'text-gold-ink';
  if (value === 1) return 'text-danger';
  return 'text-ink';
}

/* ------------------------------------ Pool ------------------------------------ */

function DieButton({ sides, count, index, onAdd, onRemove }: { sides: DieSides; count: number; index: number; onAdd: () => void; onRemove: () => void }) {
  const tint = useTint(sides);
  const surface = useThemeColor('--color-surface-2');
  const ink = useThemeColor('--color-ink');
  const on = count > 0;
  const spin = useSharedValue(0);
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value}deg` }] }));
  const counter = useAnimatedStyle(() => ({ transform: [{ rotate: `${-spin.value}deg` }] }));

  const add = () => {
    spin.value = withSequence(withTiming(spin.value + 90, { duration: 220, easing: Easing.out(Easing.cubic) }));
    onAdd();
  };

  return (
    <RevealItem index={index}>
      <View className="items-center gap-1" style={{ width: 76 }}>
        <PressScale
          haptic={false}
          scaleTo={0.9}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar d${sides}${count ? `, ${count} no pool` : ''}`}
          accessibilityHint="Toque longo remove um"
          onPress={add}
          onLongPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onRemove();
          }}
          style={{ width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}
        >
          <AnimatedView style={spinStyle}>
            <DieShape sides={sides} size={64} tint={tint} fill={surface} active={on}>
              <AnimatedView style={counter}>
                <Text className="font-bold" style={{ color: on ? tint : ink, fontSize: sides === 100 ? 11 : 15 }}>
                  d{sides}
                </Text>
              </AnimatedView>
            </DieShape>
          </AnimatedView>
          {on && (
            <Pop style={{ position: 'absolute', right: -2, top: -2 }}>
              <Bump trigger={count}>
                <View className="h-6 min-w-6 items-center justify-center rounded-full px-1.5" style={{ backgroundColor: tint }}>
                  <Text className="text-xs font-bold text-white">{count}</Text>
                </View>
              </Bump>
            </Pop>
          )}
        </PressScale>
        <View style={{ height: 22 }}>
          {on && (
            <Pop>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remover d${sides}`}
                onPress={onRemove}
                hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
                className="h-[22px] flex-row items-center gap-0.5 rounded-full border border-line-strong bg-surface-2 px-2 active:opacity-60"
              >
                <Icon name="remove" size={12} color={ink} />
              </Pressable>
            </Pop>
          )}
        </View>
      </View>
    </RevealItem>
  );
}

export function DicePoolGrid({ pool, onAdd, onRemove }: { pool: DicePool; onAdd: (d: DieSides) => void; onRemove: (d: DieSides) => void }) {
  return (
    <View className="flex-row flex-wrap justify-center gap-x-1 gap-y-1 pt-1.5">
      {DICE.map((d, i) => (
        <DieButton key={d} sides={d} count={pool[d] ?? 0} index={i} onAdd={() => onAdd(d)} onRemove={() => onRemove(d)} />
      ))}
    </View>
  );
}

/* --------------------------------- Modificador --------------------------------- */

function StepButton({ icon, label, onPress }: { icon: 'remove' | 'add'; label: string; onPress: () => void }) {
  const ink = useThemeColor('--color-ink');
  return (
    <PressScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.88}
      className="h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-surface-2"
    >
      <Icon name={icon} size={20} color={ink} />
    </PressScale>
  );
}

export function ModifierStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-line bg-surface px-4 py-2.5">
      <Label>Modificador</Label>
      <View className="flex-row items-center gap-3">
        <StepButton icon="remove" label="Diminuir modificador" onPress={() => onChange(Math.max(-30, value - 1))} />
        <Pressable onLongPress={() => onChange(0)} accessibilityHint="Toque longo zera" className="min-h-[44px] justify-center">
          <Bump trigger={value}>
            <Text className={cx('w-12 text-center text-xl font-bold', value === 0 ? 'text-ink-muted' : 'text-indigo-ink')}>{value > 0 ? `+${value}` : value}</Text>
          </Bump>
        </Pressable>
        <StepButton icon="add" label="Aumentar modificador" onPress={() => onChange(Math.min(30, value + 1))} />
      </View>
    </View>
  );
}

/* ----------------------------------- Modos ----------------------------------- */

const MODES: { id: RollMode; label: string; icon: 'remove-outline' | 'arrow-up' | 'arrow-down' }[] = [
  { id: 'normal', label: 'Normal', icon: 'remove-outline' },
  { id: 'advantage', label: 'Vantagem', icon: 'arrow-up' },
  { id: 'disadvantage', label: 'Desvantagem', icon: 'arrow-down' },
];

export function ModeToggle({ mode, onChange }: { mode: RollMode; onChange: (m: RollMode) => void }) {
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const idx = MODES.findIndex((m) => m.id === mode);
  const cell = w ? (w - 8) / MODES.length : 0;
  const first = useRef(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!cell) return;
    const target = idx * cell;
    if (first.current || reduce) {
      x.value = target;
      first.current = false;
    } else {
      x.value = withSpring(target, SPRING);
    }
  }, [idx, cell, x, reduce]);

  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const ink = useThemeColor('--color-ink-muted');

  return (
    <View className="gap-1">
      <View className="flex-row rounded-xl border border-line bg-surface p-1" onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {cell > 0 && <AnimatedView pointerEvents="none" className="absolute bottom-1 left-1 top-1 rounded-lg bg-indigo" style={[{ width: cell }, pill]} />}
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onChange(m.id);
              }}
              className="min-h-[44px] flex-1 flex-row items-center justify-center gap-1 rounded-lg py-2"
            >
              {m.id !== 'normal' && <Icon name={m.icon} size={13} color={on ? '#fff' : ink} />}
              <Text className={cx('text-[13px] font-semibold', on ? 'text-white' : 'text-ink-muted')}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {mode !== 'normal' && <Muted className="text-center text-xs">Vale apenas para um único d20.</Muted>}
    </View>
  );
}

/* --------------------------------- Histórico --------------------------------- */

const timeFmt = (at: number) => {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function HistoryRow({ roll, index = 0 }: { roll: DiceRoll; index?: number }) {
  const rolls = roll.groups.flatMap((g) => g.rolls);
  const sides = roll.groups.length === 1 ? roll.groups[0].sides : 20;
  const tint = useTint(sides);
  const surface = useThemeColor('--color-surface-2');
  const danger = useThemeColor('--color-danger');
  const gold = useThemeColor('--color-gold');
  const ink = useThemeColor('--color-ink');
  const max = roll.crit === 'max';
  const min = roll.crit === 'min';
  return (
    <RevealItem index={Math.min(index, 4)}>
      <View
        className={cx(
          'min-h-[60px] flex-row items-center gap-3 rounded-xl border bg-surface px-3 py-2',
          max ? 'border-gold/50' : min ? 'border-danger/40' : 'border-line',
        )}
      >
        <DieShape sides={sides} size={42} tint={min ? danger : max ? gold : tint} fill={surface} active={max || min}>
          <Text className="text-[10px] font-bold" style={{ color: ink }}>
            d{sides}
          </Text>
        </DieShape>
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-medium text-ink" numberOfLines={1}>
            {roll.expr}
            {roll.mode !== 'normal' && <Text className="text-violet-ink"> {roll.mode === 'advantage' ? 'vant.' : 'desv.'}</Text>}
          </Text>
          <Text className="text-xs text-ink-muted" numberOfLines={1}>
            [{rolls.join(', ')}] · {timeFmt(roll.at)}
          </Text>
        </View>
        <Text
          className={cx('font-display text-2xl', max ? 'text-gold-ink' : min ? 'text-danger' : 'text-ink')}
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {roll.total}
        </Text>
      </View>
    </RevealItem>
  );
}
