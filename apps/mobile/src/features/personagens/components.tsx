import { CLASSES, getClass, getRace } from '@repo/rules';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Badge, Chip, Icon, Muted, PressableCard, cx, useThemeColor, type IconName } from '@/components/ui';
import type { Character } from '@/lib/api';

import { getSheet, hpTone, norm } from './sheet';

const BAR_TONE = { success: 'bg-success', gold: 'bg-gold', danger: 'bg-danger' } as const;

/** Barra de progresso (PV, mana). */
export function MeterBar({ value, max, tone, className }: { value: number; max: number; tone?: keyof typeof BAR_TONE | 'indigo'; className?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  const color = tone === 'indigo' ? 'bg-indigo' : BAR_TONE[tone ?? hpTone(value, max)];
  return (
    <View className={cx('h-2 overflow-hidden rounded-full bg-surface-3', className)}>
      <View className={cx('h-full rounded-full', color)} style={{ width: `${pct}%` }} />
    </View>
  );
}

/** Nome exibido da raça/classe, preferindo os dados de @repo/rules. */
export function raceClassLabel(c: Character) {
  const sheet = getSheet(c);
  const race = getRace(sheet.raceId);
  const cls = getClass(sheet.classId) ?? CLASSES.find((k) => norm(k.name) === norm(c.class || ''));
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  return {
    race: race?.name ?? c.race ?? '',
    cls: cls?.name ?? c.class ?? '',
    subclass: sub?.name,
  };
}

export function CharacterCard({ character: c, showOwner, onPress }: { character: Character; showOwner: boolean; onPress: () => void }) {
  const danger = useThemeColor('--color-danger');
  const indigo = useThemeColor('--color-indigo-ink');
  const faint = useThemeColor('--color-ink-faint');
  const { race, cls } = raceClassLabel(c);
  return (
    <PressableCard onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir ficha de ${c.name}`} className="gap-3">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-xl border border-gold/40 bg-gold/10">
          <Text className="font-display text-lg text-gold-ink">{c.name.trim().charAt(0).toUpperCase() || '?'}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-base font-bold text-ink">{c.name}</Text>
          <Muted numberOfLines={1} className="text-sm text-ink-soft">
            {[race, cls].filter(Boolean).join(' · ') || 'Sem raça/classe'}
          </Muted>
          {showOwner && c.user && (
            <View className="mt-0.5 flex-row items-center gap-1">
              <Icon name="person-outline" size={11} color={faint} />
              <Muted className="text-[11px]">{c.user.username}</Muted>
            </View>
          )}
        </View>
        <Badge tone="gold">Nv {c.level}</Badge>
      </View>
      <View className="gap-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Icon name="heart" size={12} color={danger} />
            <Muted>PV</Muted>
          </View>
          <Text className="text-xs font-semibold text-ink-soft" style={{ fontVariant: ['tabular-nums'] }}>
            {c.currentHitPoints}/{c.maxHitPoints}
            {c.temporaryHitPoints > 0 ? ` (+${c.temporaryHitPoints})` : ''}
          </Text>
        </View>
        <MeterBar value={c.currentHitPoints} max={c.maxHitPoints} />
      </View>
      <View className="flex-row items-center gap-1.5">
        <Icon name="shield" size={14} color={indigo} />
        <Muted className="text-sm">CA</Muted>
        <Text className="text-sm font-semibold text-ink">{c.armorClass}</Text>
      </View>
    </PressableCard>
  );
}

/** Botão redondo pequeno (+/−). */
export function RoundButton({ icon, onPress, label, disabled }: { icon: IconName; onPress: () => void; label: string; disabled?: boolean }) {
  const ink = useThemeColor('--color-ink');
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      className={cx('h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-surface-2 active:opacity-60', disabled && 'opacity-40')}
    >
      <Icon name={icon} size={18} color={ink} />
    </Pressable>
  );
}

/** Caixa de estatística (CA, iniciativa, deslocamento...). */
export function StatTile({ label, value, icon, className }: { label: string; value: ReactNode; icon?: IconName; className?: string }) {
  const indigo = useThemeColor('--color-indigo-ink');
  return (
    <View className={cx('flex-1 items-center gap-1 rounded-xl border border-line bg-surface-2 px-2 py-3', className)}>
      {icon && <Icon name={icon} size={16} color={indigo} />}
      <Text className="text-lg font-bold text-ink" style={{ fontVariant: ['tabular-nums'] }}>{value}</Text>
      <Text className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">{label}</Text>
    </View>
  );
}

/** Linha de chips rolável usada como controle segmentado. */
export function SegmentedChips<T extends string>({ options, value, onChange }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 px-4 py-2">
      {options.map((o) => (
        <Chip key={o.id} label={o.label} selected={o.id === value} onPress={() => onChange(o.id)} />
      ))}
    </ScrollView>
  );
}

/** Ponto de proficiência: vazio, cheio ou duplo (especialização). */
export function ProfDot({ proficient, expertise }: { proficient: boolean; expertise?: boolean }) {
  return (
    <View
      className={cx(
        'h-3 w-3 rounded-full border',
        expertise ? 'border-gold bg-gold' : proficient ? 'border-indigo bg-indigo' : 'border-line-strong bg-transparent',
      )}
    />
  );
}
