import { SPELLS, type Spell } from '@repo/rules';
import { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, SectionList, Text, View } from 'react-native';

import { Chip, EmptyState, Label, Screen, SearchBar } from '@/components/ui';
import {
  ChipRow,
  SPELL_LEVELS,
  SPELL_SCHOOLS,
  SPELLCASTER_CLASSES,
  SpellListItem,
  activeFilterCount,
  emptyFilters,
  filterSpells,
  groupByLevel,
  spellLevelShort,
  toggleSet,
  type SpellFilters,
  type SpellSection,
} from '@/features/magias';

const keyExtractor = (s: Spell) => s.id;
const renderItem = ({ item }: { item: Spell }) => <SpellListItem spell={item} />;
const renderSectionHeader = ({ section }: { section: SpellSection }) => (
  <View className="bg-canvas px-4 pb-2 pt-4">
    <Label className="text-gold-ink">
      {section.title} · {section.data.length}
    </Label>
  </View>
);
const ItemSeparator = () => <View className="h-2" />;

export default function MagiasScreen() {
  const [filters, setFilters] = useState<SpellFilters>(emptyFilters);
  // A busca roda sobre o valor adiado: digitar continua fluido mesmo com centenas de magias.
  const deferred = useDeferredValue(filters);

  const results = useMemo(() => filterSpells(SPELLS, deferred), [deferred]);
  const sections = useMemo(() => groupByLevel(results), [results]);

  const set = (patch: Partial<SpellFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const active = activeFilterCount(filters);

  const header = (
    <View className="gap-3 pb-1 pt-3">
      <View className="px-4">
        <SearchBar
          value={filters.q}
          onChangeText={(q) => set({ q })}
          placeholder="Buscar: nome, efeito, “cura 3º”, “fogo área”…"
        />
      </View>

      <ChipRow label="Círculo">
        {SPELL_LEVELS.map((lvl) => (
          <Chip
            key={lvl}
            label={spellLevelShort(lvl)}
            selected={filters.levels.has(lvl)}
            onPress={() => setFilters((f) => ({ ...f, levels: toggleSet(f.levels, lvl) }))}
          />
        ))}
      </ChipRow>

      <ChipRow label="Escola">
        {SPELL_SCHOOLS.map((school) => (
          <Chip
            key={school}
            label={school}
            selected={filters.schools.has(school)}
            onPress={() => setFilters((f) => ({ ...f, schools: toggleSet(f.schools, school) }))}
          />
        ))}
      </ChipRow>

      <ChipRow label="Classe">
        {SPELLCASTER_CLASSES.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            selected={filters.classes.has(c.id)}
            onPress={() => setFilters((f) => ({ ...f, classes: toggleSet(f.classes, c.id) }))}
          />
        ))}
      </ChipRow>

      <ChipRow label="Outros">
        <Chip label="Concentração" selected={filters.concentration} onPress={() => set({ concentration: !filters.concentration })} />
        <Chip label="Ritual" selected={filters.ritual} onPress={() => set({ ritual: !filters.ritual })} />
      </ChipRow>

      <View className="flex-row items-center justify-between px-4">
        <Text className="text-xs text-ink-muted">
          {results.length === 1 ? '1 magia' : `${results.length} magias`}
          {results.length !== SPELLS.length ? ` de ${SPELLS.length}` : ''}
        </Text>
        {(active > 0 || !!filters.q) && (
          <Pressable accessibilityRole="button" onPress={() => setFilters(emptyFilters())} hitSlop={8} className="active:opacity-60">
            <Text className="text-xs font-semibold text-indigo-ink">Limpar filtros</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState icon="book-outline" title="Nenhuma magia encontrada" message="Tente outra busca ou remova alguns filtros." />
        }
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="pb-10"
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={11}
        removeClippedSubviews
      />
    </Screen>
  );
}
