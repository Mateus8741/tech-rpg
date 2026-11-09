import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { getRace } from '@repo/rules';

import { InfoRow, ScrollScreen, Screen, Section } from '@/components/ui';
import { Accordion, BadgeRow, DetailHeader, NotFound, Panel, RuleText, TraitList } from '@/features/compendio/components';
import { bonusLabels, skillName } from '@/features/compendio/utils';

export default function RaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = getRace(String(id));
  if (!r) {
    return (
      <Screen>
        <NotFound what="Raça" />
      </Screen>
    );
  }
  const p = r.proficiencies;
  return (
    <ScrollScreen>
      <DetailHeader eyebrow="Raça" title={r.name} summary={r.summary}>
        <BadgeRow
          items={[
            ...bonusLabels(r.abilityBonuses).map((label) => ({ label, tone: 'indigo' as const })),
            ...(r.abilityChoice
              ? [{ label: `+${r.abilityChoice.amount} em ${r.abilityChoice.count} atributos à escolha`, tone: 'indigo' as const }]
              : []),
          ]}
        />
      </DetailHeader>

      <Panel title="Resumo">
        <InfoRow label="Tamanho" value={r.size} />
        <InfoRow label="Deslocamento" value={`${r.speed} m`} />
        <InfoRow label="Idiomas" value={r.languages.join(', ') + (r.extraLanguages ? ` + ${r.extraLanguages} à escolha` : '')} />
        <InfoRow label="Tendência" value={r.alignment} />
        {p?.skills && <InfoRow label="Perícias" value={p.skills.map(skillName).join(', ')} />}
        {p?.weapons && <InfoRow label="Armas" value={p.weapons.join(', ')} />}
        {p?.armor && <InfoRow label="Armaduras" value={p.armor.join(', ')} />}
        {p?.tools && <InfoRow label="Ferramentas" value={p.tools.join(', ')} />}
      </Panel>

      <Panel title="Descrição">
        <RuleText text={r.age} />
        <RuleText text={r.sizeNote} />
      </Panel>

      <Panel title="Traços Raciais">
        <TraitList traits={r.traits} />
      </Panel>

      {r.subraces.length > 0 && (
        <Section title={`Sub-raças (${r.subraces.length})`}>
          <View className="gap-2">
            {r.subraces.map((s) => (
              <Accordion key={s.id} title={s.name} defaultOpen={r.subraces.length === 1}>
                <BadgeRow
                  items={[
                    ...bonusLabels(s.abilityBonuses).map((label) => ({ label, tone: 'indigo' as const })),
                    ...(s.speed !== undefined ? [{ label: `${s.speed} m` }] : []),
                  ]}
                />
                {s.proficiencies?.weapons && <InfoRow label="Armas" value={s.proficiencies.weapons.join(', ')} />}
                {s.proficiencies?.armor && <InfoRow label="Armaduras" value={s.proficiencies.armor.join(', ')} />}
                {s.proficiencies?.skills && <InfoRow label="Perícias" value={s.proficiencies.skills.map(skillName).join(', ')} />}
                {s.proficiencies?.tools && <InfoRow label="Ferramentas" value={s.proficiencies.tools.join(', ')} />}
                <TraitList traits={s.traits} />
              </Accordion>
            ))}
          </View>
        </Section>
      )}
    </ScrollScreen>
  );
}
