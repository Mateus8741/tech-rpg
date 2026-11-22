import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { BACKGROUNDS } from '@repo/rules';

import { ScrollScreen, SearchBar } from '@/components/ui';
import { BadgeRow, ListItemCard, ListSkeleton, NoResults, useBootSkeleton } from '@/features/compendio/components';
import { matches, skillName } from '@/features/compendio/utils';

export default function BackgroundListScreen() {
  const [q, setQ] = useState('');
  const booting = useBootSkeleton();
  const list = useMemo(() => BACKGROUNDS.filter((b) => matches(q, b.name, b.summary, b.feature.name)), [q]);
  return (
    <ScrollScreen>
      <SearchBar value={q} onChangeText={setQ} placeholder="Buscar antecedente…" />
      {booting ? (
        <ListSkeleton />
      ) : list.length === 0 ? (
        <NoResults text="Nenhum antecedente encontrado." />
      ) : (
        <View className="gap-3">
          {list.map((b, i) => (
            <ListItemCard
              index={i}
              icon="reader-outline"
              key={b.id}
              title={b.name}
              subtitle={b.summary}
              onPress={() => router.push({ pathname: '/compendio/antecedentes/[id]', params: { id: b.id } })}
              badges={<BadgeRow items={b.skills.map((s) => ({ label: skillName(s), tone: 'indigo' as const }))} />}
            />
          ))}
        </View>
      )}
    </ScrollScreen>
  );
}
