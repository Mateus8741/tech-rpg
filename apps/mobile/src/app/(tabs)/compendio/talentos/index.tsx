import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { FEATS } from '@repo/rules';

import { Badge, ScrollScreen, SearchBar } from '@/components/ui';
import { BadgeRow, ListItemCard, NoResults, Segmented } from '@/features/compendio/components';
import { matches } from '@/features/compendio/utils';

const ALL = 'Todas';
const SOURCES = [ALL, ...Array.from(new Set(FEATS.map((f) => f.source)))];
const CATEGORIES = [ALL, ...Array.from(new Set(FEATS.map((f) => f.category).filter((c): c is string => !!c)))];

export default function FeatListScreen() {
  const [q, setQ] = useState('');
  const [source, setSource] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const list = useMemo(
    () =>
      FEATS.filter(
        (f) =>
          (source === ALL || f.source === source) &&
          (category === ALL || f.category === category) &&
          matches(q, f.name, f.description, f.prerequisite, f.source, f.category),
      ),
    [q, source, category],
  );
  return (
    <ScrollScreen>
      <SearchBar value={q} onChangeText={setQ} placeholder="Buscar talento…" />
      <Segmented options={SOURCES} value={source} onChange={setSource} />
      {CATEGORIES.length > 1 && <Segmented options={CATEGORIES} value={category} onChange={setCategory} />}
      {list.length === 0 ? (
        <NoResults text="Nenhum talento encontrado." />
      ) : (
        <View className="gap-3">
          {list.map((f) => (
            <ListItemCard
              key={f.id}
              title={f.name}
              subtitle={f.description}
              right={f.category ? <Badge tone="gold">{f.category}</Badge> : undefined}
              onPress={() => router.push({ pathname: '/compendio/talentos/[id]', params: { id: f.id } })}
              badges={
                <BadgeRow
                  items={[
                    { label: f.source, tone: 'indigo' },
                    ...(f.prerequisite ? [{ label: `Pré-req.: ${f.prerequisite}`, tone: 'violet' as const }] : []),
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
