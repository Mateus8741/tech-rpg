import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { CONDITIONS, RULE_SECTIONS, WEAPON_PROPERTIES } from '@repo/rules';

import { Reveal, RevealItem } from '@/components/motion';
import { ScrollScreen, SearchBar, Section } from '@/components/ui';
import { Accordion, NoResults, RuleText } from '@/features/compendio/components';
import { matches } from '@/features/compendio/utils';

export default function RulesScreen() {
  const [q, setQ] = useState('');
  const rules = useMemo(() => RULE_SECTIONS.filter((s) => matches(q, s.title, ...s.body)), [q]);
  const conds = useMemo(() => CONDITIONS.filter((c) => matches(q, c.name, ...c.description)), [q]);
  const props = useMemo(() => WEAPON_PROPERTIES.filter((p) => matches(q, p.name, p.description)), [q]);
  const searching = q.trim().length > 0;

  return (
    <ScrollScreen>
      <Reveal>
        <Text className="font-display text-[30px] leading-9 text-gold-ink">Regras</Text>
      </Reveal>
      <SearchBar value={q} onChangeText={setQ} placeholder="Buscar regra ou condição…" />
      {rules.length === 0 && conds.length === 0 && props.length === 0 ? (
        <NoResults text="Nada encontrado." />
      ) : (
        <>
          {rules.length > 0 && (
            <Section title={`Regras-chave (${rules.length})`}>
              <View className="gap-2">
                {rules.map((s) => (
                  <Accordion key={`${s.id}-${searching}`} title={s.title} defaultOpen={searching && rules.length <= 2}>
                    {s.body.map((p, i) => (
                      <RuleText key={i} text={p} />
                    ))}
                  </Accordion>
                ))}
              </View>
            </Section>
          )}
          {conds.length > 0 && (
            <Section title={`Condições (${conds.length})`}>
              <View className="gap-2">
                {conds.map((c) => (
                  <Accordion key={`${c.id}-${searching}`} title={c.name} defaultOpen={searching && conds.length <= 3}>
                    {c.description.map((p, i) => (
                      <RuleText key={i} text={p} />
                    ))}
                  </Accordion>
                ))}
              </View>
            </Section>
          )}
          {props.length > 0 && (
            <Section title={`Propriedades de Arma (${props.length})`}>
              <View className="gap-2">
                {props.map((p) => (
                  <Accordion key={`${p.name}-${searching}`} title={p.name} defaultOpen={searching && props.length <= 3}>
                    <RuleText text={p.description} />
                  </Accordion>
                ))}
              </View>
            </Section>
          )}
        </>
      )}
    </ScrollScreen>
  );
}
