import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { Badge, ErrorState, Icon, Loading, Muted, Screen, Title, useThemeColor } from '@/components/ui';
import { SegmentedChips, raceClassLabel } from '@/features/personagens/components';
import {
  EquipmentSection, FeaturesSection, NotesSection, OverviewSection, SkillsSection, SpellsSection, VitalsPanel,
} from '@/features/personagens/sections';
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
          <View className="flex-row items-start gap-3">
            <View className="min-w-0 flex-1 gap-1">
              <Title numberOfLines={2}>{c.name}</Title>
              <Text className="text-sm text-ink-soft">
                {[race, cls, subclass].filter(Boolean).join(' · ') || 'Sem raça/classe'}
              </Text>
              {api.role === 'MASTER' && c.user && <Muted>Jogador: {c.user.username}</Muted>}
            </View>
            <View className="items-end gap-1">
              <Badge tone="gold">Nível {c.level}</Badge>
              {api.saving && <Muted>Salvando…</Muted>}
            </View>
          </View>
          <VitalsPanel api={api} />
        </View>

        <View className="border-b border-line bg-canvas">
          <SegmentedChips options={[...TABS]} value={tab} onChange={setTab} />
        </View>

        <View className="p-4">
          {tab === 'ficha' && <OverviewSection c={c} />}
          {tab === 'pericias' && <SkillsSection c={c} />}
          {tab === 'equipamento' && <EquipmentSection c={c} />}
          {tab === 'magias' && <SpellsSection api={api} />}
          {tab === 'caracteristicas' && <FeaturesSection c={c} />}
          {tab === 'notas' && <NotesSection api={api} />}
        </View>
      </ScrollView>
    </Screen>
  );
}
