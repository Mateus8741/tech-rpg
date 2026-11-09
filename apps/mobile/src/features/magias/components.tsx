import type { Spell } from '@repo/rules';
import { router } from 'expo-router';
import { memo, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Badge, Icon, Label, useThemeColor } from '@/components/ui';

import { spellLevelSchool } from './filters';

/** Linha da lista de magias. Memoizada para rolagem suave em listas longas. */
export const SpellListItem = memo(function SpellListItem({ spell }: { spell: Spell }) {
  const faint = useThemeColor('--color-ink-faint');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${spell.name}, ${spellLevelSchool(spell)}`}
      onPress={() => router.push({ pathname: '/magias/[id]', params: { id: spell.id } })}
      className="mx-4 flex-row items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 active:opacity-70"
    >
      <View className="flex-1 gap-1">
        <Text className="text-[15px] font-semibold text-ink" numberOfLines={1}>
          {spell.name}
        </Text>
        <Text className="text-xs text-ink-muted" numberOfLines={1}>
          {spellLevelSchool(spell)} · {spell.castingTime}
        </Text>
        {(spell.concentration || spell.ritual) && (
          <View className="mt-0.5 flex-row gap-1.5">
            {spell.concentration && <Badge tone="violet">Concentração</Badge>}
            {spell.ritual && <Badge tone="gold">Ritual</Badge>}
          </View>
        )}
      </View>
      <Icon name="chevron-forward" size={18} color={faint} />
    </Pressable>
  );
});

/** Linha horizontal de chips com rótulo. */
export function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Label className="px-4">{label}</Label>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-2 px-4"
      >
        {children}
      </ScrollView>
    </View>
  );
}
