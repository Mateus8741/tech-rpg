import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { RACES } from '@repo/rules';

import { ScrollScreen, SearchBar } from '@/components/ui';
import { BadgeRow, ListItemCard, NoResults } from '@/features/compendio/components';
import { bonusLabels, matches } from '@/features/compendio/utils';

export default function RaceListScreen() {
  const [q, setQ] = useState('');
  const list = useMemo(() => RACES.filter((r) => matches(q, r.name, r.summary, ...r.subraces.map((s) => s.name))), [q]);
  return (
    <ScrollScreen>
      <SearchBar value={q} onChangeText={setQ} placeholder="Buscar raça…" />
      {list.length === 0 ? (
        <NoResults text="Nenhuma raça encontrada." />
      ) : (
        <View className="gap-3">
          {list.map((r) => (
            <ListItemCard
              key={r.id}
              title={r.name}
              subtitle={r.summary}
              onPress={() => router.push({ pathname: '/compendio/racas/[id]', params: { id: r.id } })}
              badges={
                <BadgeRow
                  items={[
                    ...bonusLabels(r.abilityBonuses).map((label) => ({ label, tone: 'indigo' as const })),
                    ...(r.abilityChoice ? [{ label: `+${r.abilityChoice.amount} ×${r.abilityChoice.count}`, tone: 'indigo' as const }] : []),
                    { label: `${r.speed} m` },
                    ...(r.subraces.length ? [{ label: `${r.subraces.length} sub-raças`, tone: 'gold' as const }] : []),
                  ]}
                />
              }
            />
          ))}
        </View>
      )}
    </ScrollScreen>
  );
}
