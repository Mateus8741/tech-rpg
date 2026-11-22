import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { formatModifier, getClass, proficiencyBonus, spellSlotsFor, type ClassDef } from '@repo/rules';

import { Badge, InfoRow, ScrollScreen, Screen } from '@/components/ui';
import { Accordion, BulletList, DataTable, DetailHeader, FeatureTimeline, NotFound, Panel, RuleText, Segmented } from '@/features/compendio/components';
import { abilityAbbr, abilityName, skillName, SPELLCASTING_KIND } from '@/features/compendio/utils';

type Tab = 'caracteristicas' | 'subclasses' | 'progressao' | 'conjuracao';

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = getClass(String(id));
  const [tab, setTab] = useState<Tab>('caracteristicas');
  if (!c) {
    return (
      <Screen>
        <NotFound what="Classe" />
      </Screen>
    );
  }
  const sc = c.spellcasting;
  const tabs: Tab[] = ['caracteristicas', ...(c.subclasses.length ? (['subclasses'] as const) : []), 'progressao', ...(sc ? (['conjuracao'] as const) : [])];
  const labels: Record<Tab, string> = {
    caracteristicas: 'Características',
    subclasses: c.subclassLabel || 'Subclasses',
    progressao: 'Progressão',
    conjuracao: 'Conjuração',
  };

  return (
    <ScrollScreen>
      <DetailHeader icon="shield-half-outline" eyebrow="Classe" title={c.name} summary={c.summary}>
        <View className="flex-row flex-wrap gap-1.5">
          <Badge tone="gold">{`Dado de vida d${c.hitDie}`}</Badge>
          {sc && <Badge tone="violet">Conjurador</Badge>}
        </View>
      </DetailHeader>

      <Panel title="Características de Classe">
        <InfoRow label="Dado de vida" value={`d${c.hitDie}`} />
        <InfoRow label="Atributos principais" value={c.primaryAbilities.map(abilityName).join(', ')} />
        <InfoRow label="Resistências" value={c.savingThrows.map(abilityName).join(', ')} />
        <InfoRow label="Armaduras" value={c.armorProficiencies.join(', ') || 'Nenhuma'} />
        <InfoRow label="Armas" value={c.weaponProficiencies.join(', ') || 'Nenhuma'} />
        <InfoRow label="Ferramentas" value={c.toolProficiencies.join(', ') || 'Nenhuma'} />
        <InfoRow
          label="Perícias"
          value={`Escolha ${c.skillChoices.count}: ${c.skillChoices.from === 'any' ? 'quaisquer' : c.skillChoices.from.map(skillName).join(', ')}`}
        />
      </Panel>

      {c.startingEquipment.length > 0 && (
        <Panel title="Equipamento Inicial">
          <BulletList items={c.startingEquipment} />
        </Panel>
      )}

      <Segmented options={tabs} value={tab} onChange={setTab} labels={labels} />

      {tab === 'caracteristicas' && <FeatureTimeline features={c.features} />}
      {tab === 'subclasses' && <Subclasses c={c} />}
      {tab === 'progressao' && <Progression c={c} />}
      {tab === 'conjuracao' && sc && (
        <Panel>
          <InfoRow label="Atributo" value={`${abilityName(sc.ability)} (${abilityAbbr(sc.ability)})`} />
          <InfoRow label="Tipo" value={SPELLCASTING_KIND[sc.kind] ?? sc.kind} />
          <InfoRow label="Prepara magias" value={sc.preparesSpells ? 'Sim' : 'Não, conhece um número fixo'} />
          <InfoRow label="Conjuração ritual" value={sc.ritualCasting ? 'Sim' : 'Não'} />
          {!!sc.focus && <InfoRow label="Foco" value={sc.focus} />}
        </Panel>
      )}
    </ScrollScreen>
  );
}

function Subclasses({ c }: { c: ClassDef }) {
  return (
    <View className="gap-2">
      {c.subclasses.map((s, i) => (
        <Accordion key={s.id} title={s.name} defaultOpen={i === 0 && c.subclasses.length === 1} right={<Badge tone="gold">{`Nv ${s.level}`}</Badge>}>
          <RuleText text={s.description} />
          <FeatureTimeline features={s.features} />
        </Accordion>
      ))}
    </View>
  );
}

function Progression({ c }: { c: ClassDef }) {
  const sc = c.spellcasting;
  const cols = c.progressionColumns ?? [];
  const featuresAt = (lv: number) =>
    c.features
      .filter((f) => f.level === lv)
      .map((f) => f.name)
      .join(', ') || '—';
  const slotKind = sc && sc.kind !== 'pact' ? sc.kind : null;
  const maxSlotLevel = slotKind ? Math.max(0, ...Array.from({ length: 20 }, (_, i) => spellSlotsFor(slotKind, i + 1).length)) : 0;

  const columns = [
    { label: 'Nível', width: 52, className: 'font-semibold text-gold-ink' },
    { label: 'Prof.', width: 52, className: 'text-indigo-ink' },
    { label: 'Características', width: 200 },
    ...cols.map((col) => ({ label: col.label, width: 96 })),
    ...(sc?.cantripsKnown ? [{ label: 'Truques', width: 72 }] : []),
    ...(sc?.spellsKnown ? [{ label: 'Magias', width: 72 }] : []),
    ...Array.from({ length: maxSlotLevel }, (_, i) => ({ label: `${i + 1}º`, width: 40 })),
  ];

  const rows = Array.from({ length: 20 }, (_, i) => i + 1).map((lv) => {
    const slots = slotKind ? spellSlotsFor(slotKind, lv) : [];
    return [
      String(lv),
      formatModifier(proficiencyBonus(lv)),
      featuresAt(lv),
      ...cols.map((col) => String(col.values[lv - 1] ?? '—')),
      ...(sc?.cantripsKnown ? [String(sc.cantripsKnown[lv - 1] ?? '—')] : []),
      ...(sc?.spellsKnown ? [String(sc.spellsKnown[lv - 1] ?? '—')] : []),
      ...Array.from({ length: maxSlotLevel }, (_, i) => String(slots[i] ?? '—')),
    ];
  });

  return (
    <View className="gap-2">
      <DataTable columns={columns} rows={rows} />
      <Text className="text-xs text-ink-faint">Deslize a tabela para o lado para ver todas as colunas.</Text>
    </View>
  );
}
