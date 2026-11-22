import { SPELLS, type Spell } from '@repo/rules';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { SectionList, Text, View } from 'react-native';

import { Bump, PressScale, Reveal } from '@/components/motion';
import { Chip, EmptyState, Icon, Label, Screen, SearchBar, useThemeColor } from '@/components/ui';
import {
  ChipRow,
  SPELL_LEVELS,
  SPELL_SCHOOLS,
  SPELLCASTER_CLASSES,
  SpellListItem,
  SpellSkeleton,
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
const renderItem = ({ item, index }: { item: Spell; index: number }) => <SpellListItem spell={item} index={index} />;
const renderSectionHeader = ({ section }: { section: SpellSection }) => (
  <View className="flex-row items-center gap-3 bg-canvas px-4 pb-2 pt-4">
    <View className="h-6 min-w-[24px] items-center justify-center rounded-full bg-gold/20 px-2">
      <Text className="text-xs font-bold text-gold-ink">{section.data.length}</Text>
    </View>
    <Label className="text-gold-ink">{section.title}</Label>
    <View className="h-px flex-1 bg-gold/30" />
  </View>
);
const ItemSeparator = () => <View className="h-2" />;

export default function MagiasScreen() {
  const [filters, setFilters] = useState<SpellFilters>(emptyFilters);
  const [booting, setBooting] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const gold = useThemeColor('--color-gold-ink');
  // A busca roda sobre o valor adiado: digitar continua fluido mesmo com centenas de magias.
  const deferred = useDeferredValue(filters);

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 350);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => filterSpells(SPELLS, deferred), [deferred]);
  const sections = useMemo(() => groupByLevel(results), [results]);

  const set = (patch: Partial<SpellFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const active = activeFilterCount(filters);

  const header = (
    <View className="gap-4 pb-2 pt-3">
      <Reveal style={{ paddingHorizontal: 16, gap: 4 }}>
        <Text className="text-[11px] font-bold uppercase tracking-[3px] text-gold-ink">Grimório</Text>
        <Text className="font-display text-[32px] leading-10 text-gold-ink">Magias</Text>
      </Reveal>

      <Reveal delay={60} style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <SearchBar
          className="flex-1"
          value={filters.q}
          onChangeText={(q) => set({ q })}
          placeholder="Buscar: nome, efeito, “cura 3º”, “fogo área”…"
        />
        <PressScale
          accessibilityRole="button"
          accessibilityLabel={showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          onPress={() => setShowFilters((v) => !v)}
          className={`h-12 w-12 items-center justify-center rounded-[14px] border ${showFilters || active > 0 ? 'border-gold bg-gold/15' : 'border-line-strong bg-surface-2'}`}
        >
          <Icon name="options-outline" size={22} color={gold} />
          {active > 0 && (
            <View className="absolute -right-1 -top-1 h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1">
              <Text className="text-[11px] font-bold text-on-gold">{active}</Text>
            </View>
          )}
        </PressScale>
      </Reveal>

      {showFilters && (
        <Reveal delay={0} style={{ gap: 16 }}>
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
        </Reveal>
      )}

      <View className="flex-row items-center justify-between px-4">
        <Bump trigger={results.length}>
          <Text className="text-sm text-ink-muted">
            <Text className="font-bold text-gold-ink">{results.length}</Text>
            {results.length === 1 ? ' magia' : ' magias'}
            {results.length !== SPELLS.length ? ` de ${SPELLS.length}` : ''}
          </Text>
        </Bump>
        {(active > 0 || !!filters.q) && (
          <PressScale
            accessibilityRole="button"
            onPress={() => setFilters(emptyFilters())}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            className="min-h-[44px] justify-center"
          >
            <Text className="text-sm font-semibold text-indigo-ink">Limpar filtros</Text>
          </PressScale>
        )}
      </View>
    </View>
  );

  return (
    <Screen>
      <SectionList
        sections={booting ? [] : sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={header}
        ListEmptyComponent={
          booting ? (
            <SpellSkeleton />
          ) : (
            <EmptyState icon="book-outline" title="Nenhuma magia encontrada" message="Tente outra busca ou remova alguns filtros." />
          )
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
