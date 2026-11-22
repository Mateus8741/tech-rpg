import { router, type Href } from 'expo-router';
import { Text, View } from 'react-native';
import { ARMOR, BACKGROUNDS, CLASSES, CONDITIONS, FEATS, GEAR, RACES, RULE_SECTIONS, WEAPONS } from '@repo/rules';

import { Body, Icon, Muted, PressableCard, ScrollScreen, useThemeColor, type IconName } from '@/components/ui';

const ITEMS: { href: Href; title: string; desc: string; n: number; unit: string; icon: IconName }[] = [
  { href: '/compendio/classes', title: 'Classes', desc: 'Progressão, características e subclasses.', n: CLASSES.length, unit: 'entradas', icon: 'shield-outline' },
  { href: '/compendio/racas', title: 'Raças', desc: 'Povos de Faerûn, seus traços e sub-raças.', n: RACES.length, unit: 'entradas', icon: 'people-outline' },
  { href: '/compendio/antecedentes', title: 'Antecedentes', desc: 'Origens, perícias e traços de personalidade.', n: BACKGROUNDS.length, unit: 'entradas', icon: 'reader-outline' },
  { href: '/compendio/talentos', title: 'Talentos', desc: 'Talentos de origem, gerais, estilos de luta e dádivas.', n: FEATS.length, unit: 'entradas', icon: 'flash-outline' },
  { href: '/compendio/equipamento', title: 'Equipamento', desc: 'Armas, armaduras e itens de aventura.', n: WEAPONS.length + ARMOR.length + GEAR.length, unit: 'entradas', icon: 'bag-handle-outline' },
  { href: '/compendio/regras', title: 'Regras e Condições', desc: 'Regras-chave e condições do jogo.', n: RULE_SECTIONS.length + CONDITIONS.length, unit: 'tópicos', icon: 'book-outline' },
];

export default function CompendioHub() {
  const violet = useThemeColor('--color-violet-ink');
  return (
    <ScrollScreen>
      <View className="gap-1 pb-1">
        <Text className="text-[11px] font-semibold uppercase tracking-[2px] text-gold-ink">Compêndio</Text>
        <Text className="font-display text-2xl text-ink">Livro de Referência</Text>
        <Muted className="text-sm leading-5">Consulte raças, classes, antecedentes e equipamento de D&D 5e em português.</Muted>
      </View>
      {ITEMS.map((it) => (
        <PressableCard key={it.title} onPress={() => router.push(it.href)} accessibilityRole="button" className="flex-row items-center gap-4">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-violet/15">
            <Icon name={it.icon} size={22} color={violet} />
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="text-[17px] font-semibold text-ink">{it.title}</Text>
            <Body className="text-ink-muted">{it.desc}</Body>
            <Text className="mt-1 text-xs font-semibold text-gold-ink">
              {it.n} {it.unit}
            </Text>
          </View>
          <Icon name="chevron-forward" size={18} />
        </PressableCard>
      ))}
    </ScrollScreen>
  );
}
