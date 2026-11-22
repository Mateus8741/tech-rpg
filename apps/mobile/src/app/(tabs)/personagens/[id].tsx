import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Pop, Reveal } from '@/components/motion';
import { ErrorState, Icon, Loading, Muted, Screen, Title, useThemeColor } from '@/components/ui';
import { CountUp, MeterBar, SegmentedChips, raceClassLabel } from '@/features/personagens/components';
import {
  EquipmentSection, FeaturesSection, NotesSection, OverviewSection, SkillsSection, SpellsSection, VitalsPanel,
} from '@/features/personagens/sections';
import { PaperSheet } from '@/features/personagens/paper/PaperSheet';
import { useCharacter } from '@/features/personagens/useCharacter';
import { deleteCharacter } from '@/lib/api';

const TABS = [
  { id: 'ficha', label: 'Ficha' },
  { id: 'pericias', label: 'Perícias' },
  { id: 'equipamento', label: 'Equipamento' },
  { id: 'magias', label: 'Magias' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'notas', label: 'Notas' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export default function FichaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const api = useCharacter(String(id));
  const [tab, setTab] = useState<TabId>('ficha');
  const [mode, setMode] = useState<'ficha' | 'papel'>('ficha');
  const [refreshing, setRefreshing] = useState(false);
  const danger = useThemeColor('--color-danger');
  const gold = useThemeColor('--color-gold-ink');

  const c = api.character;

  const confirmDelete = () => {
    if (!c) return;
    Alert.alert('Excluir personagem?', `${c.name} será excluído permanentemente. Esta ação não pode ser desfeita.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCharacter(c.id, api.username);
            router.back();
          } catch (e) {
            Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível excluir o personagem.');
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await api.flush();
    await api.reload();
    setRefreshing(false);
  };

  if (api.loading) {
    return (
      <Screen>
        <Loading label="Abrindo ficha…" />
      </Screen>
    );
  }

  if (!c) {
    return (
      <Screen>
        <ErrorState message={api.error ?? 'Personagem não encontrado ou sem permissão.'} onRetry={() => void api.reload()} />
      </Screen>
    );
  }

  const { race, cls, subclass } = raceClassLabel(c);

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: c.name,
          headerRight: () => (
            <Pressable accessibilityRole="button" accessibilityLabel="Excluir personagem" hitSlop={8} onPress={confirmDelete}>
              <Icon name="trash-outline" size={22} color={danger} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1 bg-canvas"
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[1]}
        contentContainerClassName="pb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={gold} />}
      >
        <View className="gap-3 px-4 pt-4">
          <Reveal from="up">
            <View className="gap-3 overflow-hidden rounded-[24px] border border-gold/40 bg-surface p-4 shadow-md shadow-black/30">
              <View className="flex-row items-center gap-4">
                <Pop>
                  <View className="h-[68px] w-[68px] items-center justify-center rounded-3xl border-2 border-gold/70 bg-gold/15">
                    <Text className="font-display text-3xl text-gold-ink">{c.name.trim().charAt(0).toUpperCase() || '?'}</Text>
                  </View>
                </Pop>
                <View className="min-w-0 flex-1 gap-1">
                  <Title numberOfLines={2}>{c.name}</Title>
                  <Text className="text-sm text-ink-soft">
                    {[race, cls, subclass].filter(Boolean).join(' · ') || 'Sem raça/classe'}
                  </Text>
                  {api.role === 'MASTER' && c.user && <Muted>Jogador: {c.user.username}</Muted>}
                </View>
                <Pop delay={150}>
                  <View className="items-center rounded-2xl border border-gold/50 bg-gold/10 px-3 py-2">
                    <Text className="text-[9px] font-bold uppercase tracking-widest text-ink-faint">Nível</Text>
                    <CountUp value={c.level} className="font-display text-2xl text-gold-ink" />
                  </View>
                </Pop>
              </View>
              <View className="flex-row items-center gap-2">
                <Icon name="heart" size={13} color={danger} />
                <View className="flex-1">
                  <MeterBar value={c.currentHitPoints} max={c.maxHitPoints} height={8} />
                </View>
                <Muted>{c.currentHitPoints}/{c.maxHitPoints}</Muted>
              </View>
              {api.saving && <Muted>Salvando…</Muted>}
            </View>
          </Reveal>
          <View className="rounded-2xl border border-line bg-surface-2 p-1">
            <SegmentedChips scroll={false} fill options={[{ id: 'ficha', label: 'Ficha' }, { id: 'papel', label: 'Papel' }]} value={mode} onChange={setMode} />
          </View>
          {mode === 'ficha' && <VitalsPanel api={api} />}
        </View>

        <View className="mt-2 border-b border-line bg-canvas">
          {mode === 'ficha' && <SegmentedChips options={[...TABS]} value={tab} onChange={setTab} />}
        </View>

        <Reveal key={`${mode}-${mode === 'ficha' ? tab : ''}`} from="down" style={{ padding: 16 }}>
          {mode === 'papel' && <PaperSheet c={c} />}
          {mode === 'ficha' && tab === 'ficha' && <OverviewSection c={c} />}
          {mode === 'ficha' && tab === 'pericias' && <SkillsSection c={c} />}
          {mode === 'ficha' && tab === 'equipamento' && <EquipmentSection c={c} />}
          {mode === 'ficha' && tab === 'magias' && <SpellsSection api={api} />}
          {mode === 'ficha' && tab === 'caracteristicas' && <FeaturesSection c={c} />}
          {mode === 'ficha' && tab === 'notas' && <NotesSection api={api} />}
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
