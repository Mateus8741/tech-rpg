import { Stack, router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';

import { Button, EmptyState, ErrorState, Icon, Loading, Muted, Screen, SearchBar, useThemeColor } from '@/components/ui';
import { CharacterCard, raceClassLabel } from '@/features/personagens/components';
import { norm } from '@/features/personagens/sheet';
import { getCharacters, type Character } from '@/lib/api';
import { useRequiredSession } from '@/lib/session';

export default function PersonagensScreen() {
  const { username, role } = useRequiredSession();
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const gold = useThemeColor('--color-gold-ink');

  const load = useCallback(async () => {
    try {
      setError(null);
      setCharacters(await getCharacters(username));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar personagens');
    }
  }, [username]);

  // Recarrega ao voltar para a aba (ex.: após editar PV na ficha ou criar personagem).
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!characters) return [];
    if (!q) return characters;
    return characters.filter((c) => {
      const { race, cls } = raceClassLabel(c);
      return norm(`${c.name} ${race} ${cls} ${c.user?.username ?? ''}`).includes(q);
    });
  }, [characters, query]);

  const header = (
    <Stack.Screen
      options={{
        headerRight: () => (
          <Pressable accessibilityRole="button" accessibilityLabel="Novo personagem" hitSlop={8} onPress={() => router.push('/personagens/novo')}>
            <Icon name="add" size={26} color={gold} />
          </Pressable>
        ),
      }}
    />
  );

  if (!characters && !error) {
    return (
      <Screen>
        {header}
        <Loading label="Carregando fichas…" />
      </Screen>
    );
  }

  if (!characters) {
    return (
      <Screen>
        {header}
        <ErrorState message={error ?? 'Erro desconhecido'} onRetry={() => void load()} />
      </Screen>
    );
  }

  return (
    <Screen>
      {header}
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-3 p-4 pb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={gold} />}
        ListHeaderComponent={
          characters.length > 0 ? (
            <View className="gap-2">
              <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por nome, raça ou classe…" />
              <Muted>
                {characters.length} {characters.length === 1 ? 'personagem' : 'personagens'}
                {role === 'MASTER' ? ' · visão do mestre' : ''}
              </Muted>
              {error && <Muted className="text-danger">{error}</Muted>}
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          characters.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="Sua jornada começa aqui"
              message="Nenhum personagem criado ainda."
              action={<Button title="Criar personagem" icon="add" onPress={() => router.push('/personagens/novo')} />}
            />
          ) : (
            <EmptyState icon="search-outline" title="Nada encontrado" message="Nenhum personagem corresponde à busca." />
          )
        }
        renderItem={({ item }) => (
          <CharacterCard character={item} showOwner={role === 'MASTER'} onPress={() => router.push(`/personagens/${item.id}`)} />
        )}
      />
    </Screen>
  );
}
