import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Bump, Pop, Pulse, Reveal, Shake } from '@/components/motion';

import { Button, Icon, Input, Muted, ScrollScreen, Section, useThemeColor } from '@/components/ui';
import {
  ROLL_MS,
  DicePoolGrid,
  HistoryRow,
  ModeToggle,
  ModifierStepper,
  RollResult,
} from '@/features/dados/components';
import {
  MAX_DICE_PER_ROLL,
  poolLabel,
  poolSize,
  rollExpression,
  rollPool,
  type DicePool,
  type DiceRoll,
  type DieSides,
  type RollMode,
} from '@/features/dados/dice';
import { rollHaptics, tapHaptics } from '@/features/dados/haptics';
import { HISTORY_MAX, useDiceHistory } from '@/features/dados/useDiceHistory';

export default function DadosScreen() {
  const { history, last, push, clear } = useDiceHistory();
  const [pool, setPool] = useState<DicePool>({});
  const [modifier, setModifier] = useState(0);
  const [mode, setMode] = useState<RollMode>('normal');
  const [expr, setExpr] = useState('');
  const [error, setError] = useState('');
  const [tries, setTries] = useState(0);
  const muted = useThemeColor('--color-ink-muted');

  const size = poolSize(pool);

  const commitRoll = (roll: DiceRoll) => {
    push(roll);
    tapHaptics();
    setTimeout(() => rollHaptics(roll), ROLL_MS);
  };

  const addDie = (d: DieSides) => {
    if (size >= MAX_DICE_PER_ROLL) return;
    tapHaptics();
    setPool((p) => ({ ...p, [d]: (p[d] ?? 0) + 1 }));
  };

  const removeDie = (d: DieSides) => {
    if (!pool[d]) return;
    tapHaptics();
    setPool((p) => ({ ...p, [d]: Math.max(0, (p[d] ?? 0) - 1) }));
  };

  const rollThePool = () => {
    const r = rollPool(pool, modifier, mode);
    if (r) commitRoll(r);
  };

  const rollExpr = () => {
    if (!expr.trim()) return;
    const res = rollExpression(expr, mode);
    if (res.ok) {
      setError('');
      commitRoll(res.roll);
    } else {
      setError(res.error);
      setTries((n) => n + 1);
    }
  };

  return (
    <ScrollScreen>
      <Reveal>
        <RollResult roll={last} />
      </Reveal>

      <Reveal delay={80}>
        <Section title="Pool de dados">
          <View className="flex-row items-center justify-between">
            <Muted className="text-sm">Toque para adicionar, toque longo para remover.</Muted>
            {size > 0 && (
              <Bump trigger={size}>
                <View className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5">
                  <Text className="text-xs font-bold text-gold-ink">{size} {size === 1 ? 'dado' : 'dados'}</Text>
                </View>
              </Bump>
            )}
          </View>
          <DicePoolGrid pool={pool} onAdd={addDie} onRemove={removeDie} />
        </Section>
      </Reveal>

      <Reveal delay={140}>
        <ModifierStepper value={modifier} onChange={setModifier} />
      </Reveal>
      <Reveal delay={190}>
        <ModeToggle mode={mode} onChange={setMode} />
      </Reveal>

      <Reveal delay={240}>
        <View className="flex-row gap-2">
          <View className="flex-1">
            {size > 0 ? (
              <Pulse min={0.9} scale={1.015} duration={1400}>
                <Button title={`Rolar ${poolLabel(pool, modifier)}`} icon="dice" onPress={rollThePool} />
              </Pulse>
            ) : (
              <Button title="Escolha os dados" icon="dice" disabled onPress={rollThePool} />
            )}
          </View>
          {size > 0 && (
            <Pop>
              <Button
                title="Limpar"
                variant="secondary"
                onPress={() => {
                  setPool({});
                  setModifier(0);
                }}
              />
            </Pop>
          )}
        </View>
      </Reveal>

      <Reveal delay={290}>
      <Section title="Expressão">
        <View className="flex-row gap-2">
          <Input
            value={expr}
            onChangeText={(t) => {
              setExpr(t);
              if (error) setError('');
            }}
            placeholder="2d6+3"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={rollExpr}
            accessibilityLabel="Expressão de dados"
            className="flex-1"
          />
          <Button title="Rolar" variant="secondary" onPress={rollExpr} disabled={!expr.trim()} />
        </View>
        {!!error && (
          <Shake trigger={error + tries}>
            <Text accessibilityRole="alert" className="text-xs text-danger">
              {error}
            </Text>
          </Shake>
        )}
      </Section>
      </Reveal>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            Histórico{history.length ? ` (${history.length}/${HISTORY_MAX})` : ''}
          </Text>
          {history.length > 0 && (
            <Pressable
              accessibilityRole="button"
              onPress={clear}
              hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              className="min-h-[44px] flex-row items-center gap-1 active:opacity-60"
            >
              <Icon name="trash-outline" size={14} color={muted} />
              <Text className="text-xs text-ink-muted">Limpar</Text>
            </Pressable>
          )}
        </View>
        {history.length === 0 ? (
          <View className="items-center gap-2 rounded-2xl border border-dashed border-line-strong py-8">
            <Pulse min={0.5} scale={1.08} duration={2000}>
              <Icon name="time-outline" size={28} color={muted} />
            </Pulse>
            <Muted className="text-center text-sm">Nenhuma rolagem ainda. Suas jogadas aparecem aqui.</Muted>
          </View>
        ) : (
          history.map((h, i) => <HistoryRow key={h.id} roll={h} index={i} />)
        )}
      </View>
    </ScrollScreen>
  );
}
