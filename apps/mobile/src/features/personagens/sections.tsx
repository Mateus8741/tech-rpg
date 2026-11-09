import { ABILITIES, formatModifier } from '@repo/rules';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Badge, Body, Card, EmptyState, Icon, Input, Label, Muted, Section, cx, useThemeColor } from '@/components/ui';
import type { Character } from '@/lib/api';

import { MeterBar, ProfDot, RoundButton, StatTile } from './components';
import { derivedStats, featureGroups, getSheet, knownSpells, sheetPatch } from './sheet';
import type { CharacterApi } from './useCharacter';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/* ---------------- Vida / Mana ---------------- */

function Counter({
  label, value, max, onChange, tone,
}: {
  label: string; value: number; max?: number; onChange: (next: number) => void; tone?: 'indigo';
}) {
  const top = max ?? Number.MAX_SAFE_INTEGER;
  const danger = useThemeColor('--color-danger');
  const success = useThemeColor('--color-success');
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Label>{label}</Label>
        <Muted>toque e segure: ±5</Muted>
      </View>
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button" accessibilityLabel={`Diminuir ${label}`}
          onPress={() => onChange(clamp(value - 1, 0, top))}
          onLongPress={() => onChange(clamp(value - 5, 0, top))}
          className="h-11 w-11 items-center justify-center rounded-full border border-danger/40 bg-danger/10 active:opacity-60"
        >
          <Icon name="remove" size={20} color={danger} />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-3xl font-bold text-ink" style={{ fontVariant: ['tabular-nums'] }}>
            {value}
            {max !== undefined && <Text className="text-lg font-semibold text-ink-muted"> / {max}</Text>}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button" accessibilityLabel={`Aumentar ${label}`}
          onPress={() => onChange(clamp(value + 1, 0, top))}
          onLongPress={() => onChange(clamp(value + 5, 0, top))}
          className="h-11 w-11 items-center justify-center rounded-full border border-success/40 bg-success/10 active:opacity-60"
        >
          <Icon name="add" size={20} color={success} />
        </Pressable>
      </View>
      {max !== undefined && <MeterBar value={value} max={max} tone={tone} />}
    </View>
  );
}

export function VitalsPanel({ api }: { api: CharacterApi }) {
  const c = api.character!;
  return (
    <Card className="gap-4">
      <Counter label="Pontos de vida" value={c.currentHitPoints} max={c.maxHitPoints} onChange={(v) => api.patch({ currentHitPoints: v })} />
      <View className="flex-row items-center justify-between">
        <View>
          <Label>PV temporários</Label>
          <Text className="text-xl font-bold text-ink">{c.temporaryHitPoints}</Text>
        </View>
        <View className="flex-row gap-2">
          <RoundButton icon="remove" label="Diminuir PV temporários" disabled={c.temporaryHitPoints <= 0}
            onPress={() => api.patch((cur) => ({ temporaryHitPoints: Math.max(0, cur.temporaryHitPoints - 1) }))} />
          <RoundButton icon="add" label="Aumentar PV temporários"
            onPress={() => api.patch((cur) => ({ temporaryHitPoints: cur.temporaryHitPoints + 1 }))} />
        </View>
      </View>
      {c.maxMana > 0 && (
        <Counter label="Mana" value={c.currentMana} max={c.maxMana} tone="indigo" onChange={(v) => api.patch({ currentMana: v })} />
      )}
    </Card>
  );
}

/* ---------------- Atributos ---------------- */

export function OverviewSection({ c }: { c: Character }) {
  const d = derivedStats(c);
  return (
    <View className="gap-4">
      <View className="flex-row gap-2">
        <StatTile label="CA" value={c.armorClass} icon="shield" />
        <StatTile label="Iniciativa" value={formatModifier(d.initiative)} icon="flash" />
        <StatTile label="Desloc." value={`${d.speed} m`} icon="walk" />
      </View>
      <View className="flex-row gap-2">
        <StatTile label="Proficiência" value={formatModifier(d.pb)} />
        <StatTile label="Perc. passiva" value={d.passivePerception} />
        <StatTile label="XP" value={c.experience ?? 0} />
      </View>

      <Section title="Atributos">
        <View className="flex-row flex-wrap gap-2">
          {d.abilities.map((a) => (
            <View key={a.key} className="w-[31.5%] items-center rounded-xl border border-line bg-surface py-3">
              <Text className="text-[11px] font-bold tracking-wider text-ink-faint">{a.abbr}</Text>
              <Text className="font-display text-2xl text-gold-ink">{formatModifier(a.mod)}</Text>
              <View className="mt-1 rounded-full bg-surface-3 px-2 py-0.5">
                <Text className="text-xs font-semibold text-ink-soft">{a.score}</Text>
              </View>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Salvaguardas">
        <Card className="gap-1 py-2">
          {d.saves.map((s) => (
            <View key={s.key} className="flex-row items-center gap-3 py-1.5">
              <ProfDot proficient={s.proficient} />
              <Text className="flex-1 text-sm text-ink-body">{s.name}</Text>
              <Text className="text-sm font-semibold text-ink">{formatModifier(s.bonus)}</Text>
            </View>
          ))}
        </Card>
      </Section>
    </View>
  );
}

/* ---------------- Perícias ---------------- */

export function SkillsSection({ c }: { c: Character }) {
  const d = derivedStats(c);
  const abbr = Object.fromEntries(ABILITIES.map((a) => [a.key, a.abbr]));
  return (
    <View className="gap-2">
      <Muted>Proficiência {formatModifier(d.pb)} · ● proficiente · ● dourado = especialização</Muted>
      <Card className="gap-0 py-2">
        {d.skills.map((s, i) => (
          <View key={s.key} className={cx('flex-row items-center gap-3 py-2', i > 0 && 'border-t border-line')}>
            <ProfDot proficient={s.proficient} expertise={s.expertise} />
            <Text className={cx('flex-1 text-sm', s.proficient ? 'font-semibold text-ink' : 'text-ink-body')}>{s.name}</Text>
            <Muted className="w-8 text-right">{abbr[s.ability]}</Muted>
            <Text className="w-9 text-right text-sm font-semibold text-ink">{formatModifier(s.bonus)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

/* ---------------- Equipamento ---------------- */

export function EquipmentSection({ c }: { c: Character }) {
  const equipment = Array.isArray(c.equipment) ? c.equipment : [];
  const inventory = Array.isArray(c.inventory) ? c.inventory : [];
  const anyFlag = equipment.some((e) => e.equipped !== undefined);
  if (equipment.length === 0 && inventory.length === 0) {
    return <EmptyState icon="bag-outline" title="Sem equipamento" message="Nenhum item registrado nesta ficha." />;
  }
  return (
    <View className="gap-4">
      {equipment.length > 0 && (
        <Section title={`Equipamento (${equipment.length})`}>
          <Card className="gap-0 py-1">
            {equipment.map((e, i) => {
              const equipped = e.equipped ?? !anyFlag;
              return (
                <View key={`${e.name}-${i}`} className={cx('flex-row items-center gap-3 py-2.5', i > 0 && 'border-t border-line')}>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-medium text-ink">
                      {e.name}
                      {(e.quantity ?? 1) > 1 ? ` ×${e.quantity}` : ''}
                    </Text>
                    <Muted>
                      {[e.defense ? `Defesa +${e.defense}` : null, e.attack ? `Ataque +${e.attack}` : null, e.weight ? `${e.weight} kg` : null]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </Muted>
                  </View>
                  {equipped && <Badge tone="indigo">Equipado</Badge>}
                </View>
              );
            })}
          </Card>
        </Section>
      )}
      {inventory.length > 0 && (
        <Section title={`Inventário (${inventory.length})`}>
          <Card className="gap-0 py-1">
            {inventory.map((it, i) => (
              <View key={`${it.name}-${i}`} className={cx('flex-row items-center gap-3 py-2.5', i > 0 && 'border-t border-line')}>
                <Text className="flex-1 text-sm text-ink-body">{it.name}</Text>
                <Text className="text-sm font-semibold text-ink-soft">
                  {it.quantity}
                  {it.max && it.max !== it.quantity ? `/${it.max}` : ''}
                </Text>
              </View>
            ))}
          </Card>
        </Section>
      )}
    </View>
  );
}

/* ---------------- Magias ---------------- */

function Expandable({ title, subtitle, tag, body }: { title: string; subtitle?: string; tag?: string; body?: string }) {
  const [open, setOpen] = useState(false);
  const faint = useThemeColor('--color-ink-faint');
  return (
    <Pressable onPress={() => body && setOpen((o) => !o)} className="gap-1 rounded-xl border border-line bg-surface px-3 py-2.5 active:opacity-70">
      <View className="flex-row items-center gap-2">
        <View className="min-w-0 flex-1">
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text className="text-sm font-medium text-ink">{title}</Text>
            {!!tag && <Badge tone="indigo">{tag}</Badge>}
          </View>
          {!!subtitle && <Muted numberOfLines={open ? undefined : 1}>{subtitle}</Muted>}
        </View>
        {body ? <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color={faint} /> : null}
      </View>
      {open && body && <Body className="mt-1">{body}</Body>}
    </Pressable>
  );
}

export function SpellsSection({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const d = derivedStats(c);
  const spells = knownSpells(c);
  const sheet = getSheet(c);
  const abilityName = d.spell ? ABILITIES.find((a) => a.key === d.spell!.ability)?.name : undefined;

  const toggleSlot = (lvlIdx: number, pip: number) => {
    api.patch(
      (cur) => {
        const s = getSheet(cur);
        const used = [...s.spellSlotsUsed];
        while (used.length <= lvlIdx) used.push(0);
        // Toque num espaço disponível gasta; toque num gasto devolve.
        used[lvlIdx] = pip < (used[lvlIdx] ?? 0) ? pip : pip + 1;
        return sheetPatch(cur, { spellSlotsUsed: used });
      },
      { immediate: true },
    );
  };

  const byLevel = new Map<number, typeof spells>();
  for (const s of spells) byLevel.set(s.level, [...(byLevel.get(s.level) ?? []), s]);

  return (
    <View className="gap-4">
      {d.spell ? (
        <>
          <View className="flex-row gap-2">
            <StatTile label="CD" value={d.spell.dc} icon="shield-half" />
            <StatTile label="Ataque" value={formatModifier(d.spell.attack)} icon="flash" />
            <StatTile label="Atributo" value={abilityName?.slice(0, 3).toUpperCase() ?? '—'} icon="sparkles" />
          </View>
          {d.spell.slots.some((n) => n > 0) && (
            <Section title={d.spell.pact ? 'Espaços de pacto' : 'Espaços de magia'}>
              <Card className="gap-2 py-3">
                {d.spell.slots.map((total, idx) =>
                  total > 0 ? (
                    <View key={idx} className="flex-row items-center gap-3">
                      <Text className="w-14 text-sm font-semibold text-ink-soft">{idx + 1}º</Text>
                      <View className="flex-1 flex-row flex-wrap gap-2">
                        {Array.from({ length: total }, (_, pip) => {
                          const spent = pip < (sheet.spellSlotsUsed[idx] ?? 0);
                          return (
                            <Pressable
                              key={pip}
                              accessibilityRole="button"
                              accessibilityLabel={`Espaço de ${idx + 1}º círculo ${spent ? 'gasto' : 'disponível'}`}
                              onPress={() => toggleSlot(idx, pip)}
                              hitSlop={4}
                              className={cx('h-6 w-6 rounded-md border', spent ? 'border-line-strong bg-surface-3' : 'border-violet bg-violet/40')}
                            />
                          );
                        })}
                      </View>
                    </View>
                  ) : null,
                )}
                <Muted>Toque para gastar ou recuperar um espaço.</Muted>
              </Card>
            </Section>
          )}
        </>
      ) : (
        <Card>
          <Muted className="text-center text-sm">Este personagem não conjura magias no nível atual.</Muted>
        </Card>
      )}

      {spells.length === 0 ? (
        <EmptyState icon="sparkles-outline" title="Nenhuma magia" message="As magias conhecidas aparecem aqui." />
      ) : (
        [...byLevel.entries()].map(([lvl, list]) => (
          <Section key={lvl} title={lvl === 0 ? 'Truques' : `${lvl}º círculo`}>
            <View className="gap-2">
              {list.map((s) => (
                <Expandable
                  key={s.id}
                  title={s.name}
                  tag={s.prepared ? 'Preparada' : s.spell?.concentration ? 'Concentração' : undefined}
                  subtitle={s.spell ? `${s.spell.school} · ${s.spell.castingTime} · ${s.spell.range}` : undefined}
                  body={s.spell ? [s.spell.description, s.spell.atHigherLevels].filter(Boolean).join('\n\n') : undefined}
                />
              ))}
            </View>
          </Section>
        ))
      )}
    </View>
  );
}

/* ---------------- Características ---------------- */

export function FeaturesSection({ c }: { c: Character }) {
  const groups = featureGroups(c);
  const proficiencies = (Array.isArray(c.proficiencies) ? c.proficiencies : []).filter((p): p is string => typeof p === 'string');
  if (groups.length === 0 && proficiencies.length === 0) {
    return <EmptyState icon="ribbon-outline" title="Sem características" message="Nada registrado ainda." />;
  }
  return (
    <View className="gap-4">
      {groups.map((g) => (
        <Section key={g.title} title={g.title}>
          <View className="gap-2">
            {g.items.map((it, i) => (
              <Expandable key={`${it.name}-${i}`} title={it.name} tag={it.tag} subtitle={it.description.split('\n')[0]} body={it.description} />
            ))}
          </View>
        </Section>
      ))}
      {proficiencies.length > 0 && (
        <Section title="Proficiências">
          <Card className="flex-row flex-wrap gap-2">
            {proficiencies.map((p) => (
              <Badge key={p}>{p}</Badge>
            ))}
          </Card>
        </Section>
      )}
    </View>
  );
}

/* ---------------- Notas ---------------- */

export function NotesSection({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const personality: [string, string][] = [
    ['Traços', sheet.personality?.traits],
    ['Ideais', sheet.personality?.ideals],
    ['Vínculos', sheet.personality?.bonds],
    ['Defeitos', sheet.personality?.flaws],
    ['Aparência', sheet.appearance],
    ['História', sheet.backstory],
  ].filter((x): x is [string, string] => !!x[1]);
  return (
    <View className="gap-4">
      <Section title="Anotações">
        <Input
          multiline
          value={c.notes ?? ''}
          onChangeText={(notes) => api.patch({ notes })}
          placeholder="Escreva suas anotações…"
          textAlignVertical="top"
          className="py-3"
          style={{ height: undefined, minHeight: 160 }}
        />
        <Muted>{api.saving ? 'Salvando…' : 'Salvo automaticamente.'}</Muted>
      </Section>
      {!!(c.background || c.alignment) && (
        <Card className="gap-1">
          {c.background ? <Text className="text-sm text-ink-body"><Text className="font-semibold text-ink">Antecedente: </Text>{c.background}</Text> : null}
          {c.alignment ? <Text className="text-sm text-ink-body"><Text className="font-semibold text-ink">Tendência: </Text>{c.alignment}</Text> : null}
        </Card>
      )}
      {personality.map(([k, v]) => (
        <Section key={k} title={k}>
          <Card>
            <Body>{v}</Body>
          </Card>
        </Section>
      ))}
    </View>
  );
}
