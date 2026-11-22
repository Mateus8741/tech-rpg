import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { CLASSES } from '@repo/rules';

import { Badge, ScrollScreen, SearchBar } from '@/components/ui';
import { BadgeRow, ListItemCard, ListSkeleton, NoResults, useBootSkeleton } from '@/features/compendio/components';
import { abilityAbbr, matches } from '@/features/compendio/utils';

export default function ClassListScreen() {
  const [q, setQ] = useState('');
  const booting = useBootSkeleton();
  const list = useMemo(() => CLASSES.filter((c) => matches(q, c.name, c.summary)), [q]);
  return (
    <ScrollScreen>
      <SearchBar value={q} onChangeText={setQ} placeholder="Buscar classe…" />
      {booting ? (
        <ListSkeleton />
      ) : list.length === 0 ? (
        <NoResults text="Nenhuma classe encontrada." />
      ) : (
        <View className="gap-3">
          {list.map((c, i) => (
            <ListItemCard
              index={i}
              icon="shield-half-outline"
              key={c.id}
              title={c.name}
              subtitle={c.summary}
              right={<Badge tone="gold">{`d${c.hitDie}`}</Badge>}
              onPress={() => router.push({ pathname: '/compendio/classes/[id]', params: { id: c.id } })}
              badges={
                <BadgeRow
                  items={[
                    ...c.primaryAbilities.map((a) => ({ label: abilityAbbr(a), tone: 'indigo' as const })),
                    ...(c.spellcasting ? [{ label: 'Conjurador', tone: 'violet' as const }] : []),
                    ...(c.subclasses.length ? [{ label: `${c.subclasses.length} subclasses` }] : []),
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
