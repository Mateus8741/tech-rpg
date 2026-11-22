import type { Spell, SpellSchool } from '@repo/rules';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Pulse, PressScale, RevealItem, Shimmer } from '@/components/motion';
import { Badge, Icon, Label, useThemeColor, type IconName } from '@/components/ui';

import { spellLevelSchool } from './filters';

/** Cor e ícone de cada escola de magia (cores fixas: funcionam em tema claro e escuro). */
export const SCHOOL_STYLE: Record<SpellSchool, { color: string; icon: IconName }> = {
  Abjuração: { color: '#60a5fa', icon: 'shield-outline' },
  Conjuração: { color: '#f59e0b', icon: 'sparkles-outline' },
  Adivinhação: { color: '#22d3ee', icon: 'eye-outline' },
  Encantamento: { color: '#f472b6', icon: 'heart-outline' },
  Evocação: { color: '#f87171', icon: 'flame-outline' },
  Ilusão: { color: '#a78bfa', icon: 'color-wand-outline' },
  Necromancia: { color: '#4ade80', icon: 'skull-outline' },
  Transmutação: { color: '#2dd4bf', icon: 'swap-horizontal-outline' },
};
const FALLBACK = { color: '#e0b04c', icon: 'book-outline' as IconName };
export const schoolStyle = (school: string) => SCHOOL_STYLE[school as SpellSchool] ?? FALLBACK;

/** Selo do círculo da magia: gradiente na cor da escola, nível em destaque. */
export function LevelBadge({ spell, size = 48 }: { spell: Pick<Spell, 'level' | 'school'>; size?: number }) {
  const { color } = schoolStyle(spell.school);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 3, borderWidth: 1, borderColor: color + '88', overflow: 'hidden' }} className="items-center justify-center">
      <LinearGradient colors={[color + '55', color + '15']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      {spell.level === 0 ? (
        <Icon name="star" size={size * 0.42} color={color} />
      ) : (
        <Text style={{ color, fontSize: size * 0.5, lineHeight: size * 0.6 }} className="font-display">
          {spell.level}
        </Text>
      )}
    </View>
  );
}

/** Linha da lista de magias. Memoizada para rolagem suave em listas longas. */
export const SpellListItem = memo(function SpellListItem({ spell, index = 0 }: { spell: Spell; index?: number }) {
  const faint = useThemeColor('--color-ink-faint');
  const { color, icon } = schoolStyle(spell.school);
  return (
    <RevealItem index={index} style={{ marginHorizontal: 16 }}>
      <PressScale
        accessibilityRole="button"
        accessibilityLabel={`${spell.name}, ${spellLevelSchool(spell)}`}
        onPress={() => router.push({ pathname: '/magias/[id]', params: { id: spell.id } })}
        scaleTo={0.97}
        className="min-h-[72px] flex-row items-center gap-3 overflow-hidden rounded-3xl border border-line bg-surface py-3 pl-4 pr-3"
      >
        <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: color }} />
        <LevelBadge spell={spell} />
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-ink" numberOfLines={1}>
            {spell.name}
          </Text>
          <View className="flex-row items-center gap-1.5">
            <Icon name={icon} size={13} color={color} />
            <Text style={{ color }} className="text-xs font-semibold" numberOfLines={1}>
              {spell.school}
            </Text>
            <Text className="flex-1 text-xs text-ink-muted" numberOfLines={1}>
              · {spell.castingTime}
            </Text>
          </View>
          {(spell.concentration || spell.ritual) && (
            <View className="mt-0.5 flex-row gap-1.5">
              {spell.concentration && <Badge tone="violet">Concentração</Badge>}
              {spell.ritual && <Badge tone="gold">Ritual</Badge>}
            </View>
          )}
        </View>
        <Icon name="chevron-forward" size={18} color={faint} />
      </PressScale>
    </RevealItem>
  );
});

/** Esqueleto da lista enquanto a tela abre. */
export function SpellSkeleton({ count = 7 }: { count?: number }) {
  return (
    <View className="gap-2 px-4 pt-2">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} className="h-[72px] flex-row items-center gap-3 rounded-3xl border border-line bg-surface px-4">
          <Shimmer style={{ width: 48, height: 48, borderRadius: 16 }} />
          <View className="flex-1 gap-2">
            <Shimmer style={{ width: '60%', height: 16 }} />
            <Shimmer style={{ width: '40%', height: 12 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Linha horizontal de chips com rótulo. */
export function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Label className="px-4 text-ink-muted">{label}</Label>
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

/** Ícone da escola com respiração (hero do detalhe). */
export function SchoolGlyph({ school, size = 120 }: { school: string; size?: number }) {
  const { color, icon } = schoolStyle(school);
  return (
    <Pulse min={0.5} scale={1.1} duration={2600}>
      <Icon name={icon} size={size} color={color + '40'} />
    </Pulse>
  );
}
