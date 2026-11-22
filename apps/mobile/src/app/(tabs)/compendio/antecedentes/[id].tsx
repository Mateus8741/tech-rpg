import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { getBackground } from '@repo/rules';

import { Button, cx, Muted, ScrollScreen, Screen, Section } from '@/components/ui';
import { Pop } from '@/components/motion';
import { BadgeRow, BulletList, DetailHeader, NotFound, Panel, RuleText } from '@/features/compendio/components';
import { skillName } from '@/features/compendio/utils';

type Kind = 'traits' | 'ideals' | 'bonds' | 'flaws';
const KINDS: Kind[] = ['traits', 'ideals', 'bonds', 'flaws'];
const LABEL: Record<Kind, string> = { traits: 'Traço de Personalidade', ideals: 'Ideal', bonds: 'Vínculo', flaws: 'Defeito' };

export default function BackgroundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const b = getBackground(String(id));
  const [roll, setRoll] = useState<Record<Kind, number> | null>(null);
  const [rollKey, setRollKey] = useState(0);
  if (!b) {
    return (
      <Screen>
        <NotFound what="Antecedente" />
      </Screen>
    );
  }
  const lists: Record<Kind, string[]> = b.personality;

  const doRoll = () => {
    const r = {} as Record<Kind, number>;
    KINDS.forEach((k) => {
      r[k] = Math.floor(Math.random() * Math.max(lists[k].length, 1));
    });
    setRoll(r);
    setRollKey((k) => k + 1);
  };

  return (
    <ScrollScreen>
      <DetailHeader icon="reader-outline" eyebrow="Antecedente" title={b.name} summary={b.summary} />

      <Panel title="Proficiências e Equipamento">
        <Muted>Perícias</Muted>
        <BadgeRow items={b.skills.map((s) => ({ label: skillName(s), tone: 'indigo' as const }))} />
        {b.tools.length > 0 && (
          <>
            <Muted className="mt-2">Ferramentas</Muted>
            <RuleText text={b.tools.join(', ')} />
          </>
        )}
        {b.languages > 0 && (
          <>
            <Muted className="mt-2">Idiomas</Muted>
            <RuleText text={`${b.languages} idioma(s) à escolha`} />
          </>
        )}
        {b.equipment.length > 0 && (
          <>
            <Muted className="mt-2">Equipamento</Muted>
            <BulletList items={b.equipment} />
          </>
        )}
      </Panel>

      <Panel title={`Característica: ${b.feature.name}`}>
        <RuleText text={b.feature.description} />
      </Panel>

      <Section title="Personalidade">
        <Button title="Rolar personalidade" icon="dice-outline" onPress={doRoll} />
        {roll && (
          <Pop key={rollKey} style={{ gap: 12, borderRadius: 24, borderWidth: 1, borderColor: '#e0b04c66', backgroundColor: '#e0b04c1a', padding: 16 }}>
            {KINDS.map((k) => (
              <View key={k} className="gap-0.5">
                <Text className="text-[11px] font-semibold uppercase tracking-wider text-gold-ink">
                  {LABEL[k]} (#{roll[k] + 1})
                </Text>
                <Text className="text-sm leading-5 text-ink">{lists[k][roll[k]] ?? '—'}</Text>
              </View>
            ))}
          </Pop>
        )}
      </Section>

      {KINDS.map((k) => (
        <Panel key={k} title={`${LABEL[k]} (d${lists[k].length})`}>
          {lists[k].map((t, i) => (
            <View key={i} className={cx('flex-row gap-3 rounded-lg px-2 py-1.5', roll?.[k] === i && 'bg-gold/15')}>
              <Text className="w-5 text-right text-sm font-semibold text-ink-muted">{i + 1}</Text>
              <Text className={cx('flex-1 text-sm leading-5', roll?.[k] === i ? 'text-gold-ink' : 'text-ink-body')}>{t}</Text>
            </View>
          ))}
        </Panel>
      ))}
    </ScrollScreen>
  );
}
