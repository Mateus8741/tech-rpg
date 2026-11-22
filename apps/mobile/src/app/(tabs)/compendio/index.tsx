import { router, type Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { ARMOR, BACKGROUNDS, CLASSES, CONDITIONS, FEATS, GEAR, RACES, RULE_SECTIONS, WEAPONS } from '@repo/rules';

import { Icon, Muted, ScrollScreen, type IconName } from '@/components/ui';
import { Pulse, PressScale, Reveal, RevealItem } from '@/components/motion';

type Item = { href: Href; title: string; desc: string; n: number; unit: string; icon: IconName; accent: string; wide?: boolean };

const ITEMS: Item[] = [
  { href: '/compendio/classes', title: 'Classes', desc: 'Progressão, características e subclasses.', n: CLASSES.length, unit: 'classes', icon: 'shield-half-outline', accent: '#e0b04c', wide: true },
  { href: '/compendio/racas', title: 'Raças', desc: 'Povos, traços e sub-raças.', n: RACES.length, unit: 'raças', icon: 'people-outline', accent: '#34d399' },
  { href: '/compendio/antecedentes', title: 'Antecedentes', desc: 'Origens e perícias.', n: BACKGROUNDS.length, unit: 'origens', icon: 'reader-outline', accent: '#60a5fa' },
  { href: '/compendio/talentos', title: 'Talentos', desc: 'Origem, gerais e dádivas.', n: FEATS.length, unit: 'talentos', icon: 'flash-outline', accent: '#f59e0b' },
  { href: '/compendio/equipamento', title: 'Equipamento', desc: 'Armas, armaduras e itens.', n: WEAPONS.length + ARMOR.length + GEAR.length, unit: 'itens', icon: 'bag-handle-outline', accent: '#f87171' },
  { href: '/compendio/regras', title: 'Regras e Condições', desc: 'Regras-chave e condições do jogo.', n: RULE_SECTIONS.length + CONDITIONS.length, unit: 'tópicos', icon: 'book-outline', accent: '#a78bfa', wide: true },
];

function HubCard({ it, index }: { it: Item; index: number }) {
  return (
    <RevealItem index={index} style={{ width: it.wide ? '100%' : '48.3%' }}>
      <PressScale
        onPress={() => router.push(it.href)}
        accessibilityRole="button"
        accessibilityLabel={`${it.title}, ${it.n} ${it.unit}`}
        scaleTo={0.96}
        className="min-h-[150px] overflow-hidden rounded-3xl border border-line bg-surface"
        style={{ borderColor: it.accent + '55' }}
      >
        <LinearGradient colors={[it.accent + '38', it.accent + '08', '#00000000']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View className="flex-1 justify-between gap-4 p-4">
          <View className="flex-row items-start justify-between">
            <Pulse min={0.75} scale={1.1} duration={2000 + index * 250}>
              <View className="h-14 w-14 items-center justify-center rounded-2xl border" style={{ backgroundColor: it.accent + '26', borderColor: it.accent + '66' }}>
                <Icon name={it.icon} size={28} color={it.accent} />
              </View>
            </Pulse>
            <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: it.accent + '26' }}>
              <Text className="text-xs font-bold text-ink">{it.n}</Text>
            </View>
          </View>
          <View className="gap-1">
            <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} className="font-display text-[19px] leading-6 text-ink">{it.title}</Text>
            <Muted numberOfLines={2}>{it.desc}</Muted>
          </View>
        </View>
      </PressScale>
    </RevealItem>
  );
}

export default function CompendioHub() {
  return (
    <ScrollScreen>
      <Reveal>
        <View className="gap-1 pb-1">
          <Text className="text-[11px] font-bold uppercase tracking-[3px] text-gold-ink">Compêndio</Text>
          <Text className="font-display text-[34px] leading-10 text-gold-ink">Livro de Referência</Text>
          <View className="my-1 h-[3px] w-14 rounded-full bg-gold" />
          <Muted className="text-sm leading-5">Consulte raças, classes, antecedentes e equipamento de D&D 5e em português.</Muted>
        </View>
      </Reveal>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {ITEMS.map((it, i) => (
          <HubCard key={it.title} it={it} index={i + 1} />
        ))}
      </View>
    </ScrollScreen>
  );
}
