import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button, Icon, Input, Muted, ScrollScreen, Section, useThemeColor } from '@/components/ui';
import {
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
  const muted = useThemeColor('--color-ink-muted');

  const size = poolSize(pool);

  const commitRoll = (roll: DiceRoll) => {
    push(roll);
    rollHaptics(roll);
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
    }
  };

  return (
    <ScrollScreen>
      <RollResult roll={last} />

      <Section title="Pool de dados">
        <DicePoolGrid pool={pool} onAdd={addDie} onRemove={removeDie} />
        <Muted>Toque para adicionar, toque longo para remover.</Muted>
      </Section>

      <ModifierStepper value={modifier} onChange={setModifier} />
      <ModeToggle mode={mode} onChange={setMode} />

      <View className="flex-row gap-2">
        <Button
          title={size ? `Rolar ${poolLabel(pool, modifier)}` : 'Escolha os dados'}
          icon="dice"
          disabled={size === 0}
          onPress={rollThePool}
          className="flex-1"
        />
        {size > 0 && (
          <Button
            title="Limpar"
            variant="secondary"
            onPress={() => {
              setPool({});
              setModifier(0);
            }}
          />
        )}
      </View>

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
          <Text accessibilityRole="alert" className="text-xs text-danger">
            {error}
          </Text>
        )}
      </Section>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
            Histórico{history.length ? ` (${history.length}/${HISTORY_MAX})` : ''}
          </Text>
          {history.length > 0 && (
            <Pressable
              accessibilityRole="button"
              onPress={clear}
              hitSlop={8}
              className="flex-row items-center gap-1 active:opacity-60"
            >
              <Icon name="trash-outline" size={14} color={muted} />
              <Text className="text-xs text-ink-muted">Limpar</Text>
            </Pressable>
          )}
        </View>
        {history.length === 0 ? (
          <Muted className="py-3 text-center">Nenhuma rolagem ainda.</Muted>
        ) : (
          history.map((h) => <HistoryRow key={h.id} roll={h} />)
        )}
      </View>
    </ScrollScreen>
  );
}
