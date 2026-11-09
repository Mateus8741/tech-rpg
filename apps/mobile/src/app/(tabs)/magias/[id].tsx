import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Badge, Body, Card, Divider, EmptyState, InfoRow, ScrollScreen, Section, Title } from '@/components/ui';
import { className, getSpellById, spellComponentsLabel, spellLevelSchool } from '@/features/magias';

export default function SpellDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const spell = getSpellById(id);

  if (!spell) {
    return (
      <ScrollScreen>
        <Stack.Screen options={{ title: 'Magia' }} />
        <EmptyState icon="help-circle-outline" title="Magia não encontrada" message="Ela pode ter sido removida do compêndio." />
      </ScrollScreen>
    );
  }

  const paragraphs = spell.description.split(/\n+/).filter((p) => p.trim());
  const higher = spell.atHigherLevels?.split(/\n+/).filter((p) => p.trim()) ?? [];

  return (
    <ScrollScreen>
      <Stack.Screen options={{ title: spell.name }} />

      <View className="gap-2">
        <Title>{spell.name}</Title>
        <Text className="text-sm italic text-ink-soft">{spellLevelSchool(spell)}</Text>
        {(spell.concentration || spell.ritual) && (
          <View className="flex-row flex-wrap gap-1.5">
            {spell.concentration && <Badge tone="violet">Concentração</Badge>}
            {spell.ritual && <Badge tone="gold">Ritual</Badge>}
          </View>
        )}
      </View>

      <Card className="gap-0 py-2">
        <InfoRow label="Tempo de conjuração" value={spell.castingTime} />
        <Divider />
        <InfoRow label="Alcance" value={spell.range} />
        <Divider />
        <InfoRow label="Componentes" value={spellComponentsLabel(spell.components) || '—'} />
        {!!spell.components.m && <Text className="pb-1.5 text-right text-xs text-ink-muted">({spell.components.m})</Text>}
        <Divider />
        <InfoRow label="Duração" value={spell.duration} />
      </Card>

      {spell.classes.length > 0 && (
        <Section title="Classes">
          <View className="flex-row flex-wrap gap-1.5">
            {spell.classes.map((c) => (
              <Badge key={c} tone="indigo">
                {className(c)}
              </Badge>
            ))}
          </View>
        </Section>
      )}

      <Section title="Descrição">
        <View className="gap-3">
          {paragraphs.map((p, i) => (
            <Body key={i}>{p}</Body>
          ))}
        </View>
      </Section>

      {higher.length > 0 && (
        <Section title="Em níveis superiores">
          <Card className="gap-2 border-gold/30 bg-gold/5">
            {higher.map((p, i) => (
              <Body key={i}>{p}</Body>
            ))}
          </Card>
        </Section>
      )}

      {!!spell.source && <Text className="text-xs text-ink-faint">Fonte: {spell.source}</Text>}
    </ScrollScreen>
  );
}
