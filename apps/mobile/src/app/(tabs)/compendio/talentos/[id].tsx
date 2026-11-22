import { useLocalSearchParams } from 'expo-router';
import { FEATS } from '@repo/rules';

import { InfoRow, ScrollScreen, Screen } from '@/components/ui';
import { BadgeRow, BulletList, DetailHeader, NotFound, Panel, RuleText } from '@/features/compendio/components';

export default function FeatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const f = FEATS.find((x) => x.id === String(id));
  if (!f) {
    return (
      <Screen>
        <NotFound what="Talento" />
      </Screen>
    );
  }
  return (
    <ScrollScreen>
      <DetailHeader eyebrow="Talento" title={f.name}>
        <BadgeRow
          items={[
            ...(f.category ? [{ label: f.category, tone: 'gold' as const }] : []),
            { label: f.source, tone: 'indigo' as const },
          ]}
        />
      </DetailHeader>

      {f.prerequisite && (
        <Panel title="Pré-requisito">
          <RuleText text={f.prerequisite} />
        </Panel>
      )}

      <Panel title="Descrição">
        <RuleText text={f.description} />
      </Panel>

      <Panel title="Benefícios">
        <BulletList items={f.benefits} />
      </Panel>

      <Panel title="Fonte">
        <InfoRow label="Livro" value={f.source} />
        {f.category && <InfoRow label="Categoria" value={f.category} />}
      </Panel>
    </ScrollScreen>
  );
}
