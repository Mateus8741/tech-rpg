import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Badge, Card, Icon, Label, Muted, cx, useThemeColor } from '@/components/ui';

import { DICE, type DicePool, type DiceRoll, type DieSides, type RollMode } from './dice';

/* ---------------------------------- Resultado ---------------------------------- */

function rollChipClass(roll: DiceRoll, sides: number, value: number) {
  if (roll.crit && sides === 20) return roll.crit === 'max' ? 'border-gold/50 bg-gold/15' : 'border-danger/40 bg-danger/15';
  if (value === sides) return 'border-gold/40 bg-gold/10';
  if (value === 1) return 'border-danger/30 bg-danger/10';
  return 'border-line bg-surface-2';
}

function rollChipText(sides: number, value: number) {
  if (value === sides) return 'text-gold-ink';
  if (value === 1) return 'text-danger';
  return 'text-ink';
}

/** Resultado grande e animado da última rolagem. */
export function RollResult({ roll }: { roll: DiceRoll | null }) {
  const reduce = useReducedMotion();
  const faint = useThemeColor('--color-ink-faint');
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!roll) return;
    if (reduce) {
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 180 });
      return;
    }
    scale.value = 0.55;
    rotate.value = -14;
    opacity.value = 0.2;
    scale.value = withSpring(1, { damping: 9, stiffness: 180, mass: 0.7 });
    rotate.value = withSequence(
      withTiming(10, { duration: 110, easing: Easing.out(Easing.quad) }),
      withTiming(-5, { duration: 100 }),
      withSpring(0, { damping: 8, stiffness: 160 }),
    );
    opacity.value = withTiming(1, { duration: 160 });
    // Só reanima quando chega uma rolagem nova.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roll?.id, reduce]);

  const animated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  if (!roll) {
    return (
      <Card className="items-center gap-2 py-8">
        <Icon name="dice-outline" size={44} color={faint} />
        <Muted className="text-center text-sm">Monte um pool abaixo ou digite uma expressão para rolar.</Muted>
      </Card>
    );
  }

  const totalColor = roll.crit === 'max' ? 'text-gold-ink' : roll.crit === 'min' ? 'text-danger' : 'text-ink';
  const border = roll.crit === 'max' ? 'border-gold/60 bg-gold/10' : roll.crit === 'min' ? 'border-danger/50 bg-danger/10' : '';

  return (
    <Card className={cx('items-center gap-3 py-6', border)}>
      <View className="flex-row flex-wrap items-center justify-center gap-2">
        <Text className="text-sm font-semibold text-ink-soft">{roll.expr}</Text>
        {roll.mode !== 'normal' && <Badge tone="violet">{roll.mode === 'advantage' ? 'Vantagem' : 'Desvantagem'}</Badge>}
      </View>

      <Animated.View style={animated}>
        <Text
          accessibilityLabel={`Total ${roll.total}`}
          className={cx('font-display text-7xl leading-[84px]', totalColor)}
          style={{ fontVariant: ['tabular-nums'] }}
        >
          {roll.total}
        </Text>
      </Animated.View>

      {roll.crit === 'max' && <Badge tone="gold">20 natural! Crítico</Badge>}
      {roll.crit === 'min' && <Badge tone="danger">1 natural — falha crítica</Badge>}

      <View className="flex-row flex-wrap justify-center gap-1.5">
        {roll.groups.flatMap((g, gi) =>
          g.rolls.map((v, i) => (
            <View key={`${gi}-${i}`} className={cx('min-w-9 items-center rounded-lg border px-2 py-1', rollChipClass(roll, g.sides, v))}>
              <Text className={cx('text-sm font-bold', rollChipText(g.sides, v))}>{v}</Text>
              <Text className="text-[9px] text-ink-faint">d{g.sides}</Text>
            </View>
          )),
        )}
        {roll.bonus !== 0 && (
          <View className="min-w-9 items-center justify-center rounded-lg border border-indigo/30 bg-indigo/10 px-2 py-1">
            <Text className="text-sm font-bold text-indigo-ink">{roll.bonus > 0 ? `+${roll.bonus}` : roll.bonus}</Text>
            <Text className="text-[9px] text-ink-faint">mod</Text>
          </View>
        )}
      </View>

      {roll.discarded && (
        <Muted>
          Descartado: [{roll.discarded.rolls.join(', ')}] = {roll.discarded.total}
        </Muted>
      )}
    </Card>
  );
}

/* ------------------------------------ Pool ------------------------------------ */

function DieButton({ sides, count, onAdd, onRemove }: { sides: DieSides; count: number; onAdd: () => void; onRemove: () => void }) {
  const d20 = sides === 20;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Adicionar d${sides}${count ? `, ${count} no pool` : ''}`}
      accessibilityHint="Toque longo remove um"
      onPress={onAdd}
      onLongPress={onRemove}
      className={cx(
        'h-16 w-[23%] items-center justify-center rounded-xl border active:scale-95 active:opacity-80',
        count > 0 ? 'border-indigo bg-indigo/15' : d20 ? 'border-gold/50 bg-gold/10' : 'border-line bg-surface',
      )}
    >
      <Text className={cx('text-base font-bold', d20 ? 'text-gold-ink' : 'text-ink')}>d{sides}</Text>
      {count > 0 && (
        <View className="absolute -right-1.5 -top-1.5 h-6 min-w-6 items-center justify-center rounded-full bg-indigo px-1.5">
          <Text className="text-xs font-bold text-white">{count}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function DicePoolGrid({ pool, onAdd, onRemove }: { pool: DicePool; onAdd: (d: DieSides) => void; onRemove: (d: DieSides) => void }) {
  return (
    <View className="flex-row flex-wrap gap-2 pt-1.5">
      {DICE.map((d) => (
        <DieButton key={d} sides={d} count={pool[d] ?? 0} onAdd={() => onAdd(d)} onRemove={() => onRemove(d)} />
      ))}
    </View>
  );
}

/* --------------------------------- Modificador --------------------------------- */

function StepButton({ icon, label, onPress }: { icon: 'remove' | 'add'; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-lg border border-line-strong bg-surface-2 active:opacity-70"
    >
      <Icon name={icon} size={20} color={useThemeColor('--color-ink')} />
    </Pressable>
  );
}

export function ModifierStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View className="flex-row items-center justify-between rounded-xl border border-line bg-surface px-3 py-2">
      <Label>Modificador</Label>
      <View className="flex-row items-center gap-3">
        <StepButton icon="remove" label="Diminuir modificador" onPress={() => onChange(Math.max(-30, value - 1))} />
        <Pressable onLongPress={() => onChange(0)} accessibilityHint="Toque longo zera">
          <Text className={cx('w-12 text-center text-xl font-bold', value === 0 ? 'text-ink-muted' : 'text-indigo-ink')}>
            {value > 0 ? `+${value}` : value}
          </Text>
        </Pressable>
        <StepButton icon="add" label="Aumentar modificador" onPress={() => onChange(Math.min(30, value + 1))} />
      </View>
    </View>
  );
}

/* ----------------------------------- Modos ----------------------------------- */

const MODES: { id: RollMode; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'advantage', label: 'Vantagem' },
  { id: 'disadvantage', label: 'Desvantagem' },
];

export function ModeToggle({ mode, onChange }: { mode: RollMode; onChange: (m: RollMode) => void }) {
  return (
    <View className="gap-1">
      <View className="flex-row gap-1 rounded-xl border border-line bg-surface p-1">
        {MODES.map((m) => {
          const on = mode === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => onChange(m.id)}
              className={cx('flex-1 items-center rounded-lg py-2', on ? 'bg-indigo' : 'active:bg-surface-2')}
            >
              <Text className={cx('text-xs font-semibold', on ? 'text-white' : 'text-ink-muted')}>{m.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {mode !== 'normal' && <Muted className="text-center text-[10px]">Vale apenas para um único d20.</Muted>}
    </View>
  );
}

/* --------------------------------- Histórico --------------------------------- */

const timeFmt = (at: number) => {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export function HistoryRow({ roll }: { roll: DiceRoll }) {
  const rolls = roll.groups.flatMap((g) => g.rolls);
  return (
    <View className="flex-row items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2">
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
        className={cx('text-xl font-bold', roll.crit === 'max' ? 'text-gold-ink' : roll.crit === 'min' ? 'text-danger' : 'text-ink')}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {roll.total}
      </Text>
    </View>
  );
}
