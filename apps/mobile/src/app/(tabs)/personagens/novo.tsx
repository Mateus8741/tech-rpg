import { CLASSES, RACES, XP_BY_LEVEL, getClass, getRace } from '@repo/rules';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { AnimatedBar, Bump, Pop, PressScale, Reveal, RevealItem } from '@/components/motion';
import { Button, Card, Heading, Icon, Input, Label, Muted, ScrollScreen, Section, cx, useThemeColor } from '@/components/ui';
import { RoundButton } from '@/features/personagens/components';
import { emptySheet } from '@/features/personagens/sheet';
import { createCharacter, type Character } from '@/lib/api';
import { useRequiredSession } from '@/lib/session';

/** PV iniciais: dado de vida cheio no 1º nível + média nos seguintes (sem Con, atributos em 10). */
const startingHp = (hitDie: number, level: number) => hitDie + (level - 1) * (Math.floor(hitDie / 2) + 1);

export default function NovoPersonagemScreen() {
  const { username } = useRequiredSession();
  const [name, setName] = useState('');
  const [raceId, setRaceId] = useState('');
  const [classId, setClassId] = useState('');
  const [level, setLevel] = useState(1);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(0);
  const gold = useThemeColor('--color-gold');
  const track = useThemeColor('--color-surface-3');

  const race = getRace(raceId);
  const cls = getClass(classId);

  const submit = async () => {
    if (!race || !cls) return;
    setSaving(true);
    try {
      const hp = startingHp(cls.hitDie, level);
      const payload: Partial<Character> = {
        name: name.trim(),
        race: race.name,
        class: cls.name,
        level,
        experience: XP_BY_LEVEL[level - 1] ?? 0,
        strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10,
        strengthModifier: 0, dexterityModifier: 0, constitutionModifier: 0,
        intelligenceModifier: 0, wisdomModifier: 0, charismaModifier: 0,
        maxHitPoints: hp, currentHitPoints: hp, temporaryHitPoints: 0,
        maxMana: 0, currentMana: 0,
        armorClass: 10,
        equipment: [], inventory: [], spells: [], features: [], proficiencies: [], notes: '',
        customData: {
          sheet: { ...emptySheet(), raceId: race.id, classId: cls.id, savingThrowProficiencies: cls.savingThrows },
        },
      };
      const created = await createCharacter(username, payload);
      router.replace(`/personagens/${created.id}`);
    } catch (e) {
      Alert.alert('Erro', e instanceof Error ? e.message : 'Não foi possível criar o personagem.');
      setSaving(false);
    }
  };

  const STEPS = ['Nome', 'Raça', 'Classe', 'Nível'] as const;
  const canNext = [name.trim().length > 0, !!race, !!cls, true][step];
  const last = step === STEPS.length - 1;
  const next = () => (last ? void submit() : setStep((n) => n + 1));

  return (
    <View className="flex-1 bg-canvas">
      <View className="gap-2 px-4 pb-2 pt-4">
        <View className="flex-row items-center justify-between">
          <Label>Passo {step + 1} de {STEPS.length}</Label>
          <Text className="font-display text-base text-gold-ink">{STEPS[step]}</Text>
        </View>
        <AnimatedBar value={(step + 1) / STEPS.length} color={gold} track={track} height={8} />
      </View>
      <ScrollScreen keyboardShouldPersistTaps="handled" contentContainerClassName="gap-4 p-4 pb-6">
        <Reveal key={step} from="down" style={{ gap: 16 }}>
          {step === 0 && (
            <Section title="Como se chama o herói?">
              <Input value={name} onChangeText={setName} placeholder="Ex.: Thalia Ventoforte" autoCapitalize="words" returnKeyType="next" onSubmitEditing={() => canNext && next()} autoFocus />
            </Section>
          )}
          {step === 1 && (
            <Section title="Raça">
              <View className="gap-2">
                {RACES.map((r, i) => (
                  <ChoiceCard key={r.id} index={i} title={r.name} text={r.summary} selected={r.id === raceId} onPress={() => setRaceId(r.id)} />
                ))}
              </View>
            </Section>
          )}
          {step === 2 && (
            <Section title="Classe">
              <View className="gap-2">
                {CLASSES.map((k, i) => (
                  <ChoiceCard key={k.id} index={i} title={k.name} text={`${k.summary} · d${k.hitDie}`} selected={k.id === classId} onPress={() => setClassId(k.id)} />
                ))}
              </View>
            </Section>
          )}
          {step === 3 && (
            <>
              <Section title="Nível inicial">
                <View className="flex-row items-center justify-center gap-6 rounded-[22px] border border-gold/30 bg-surface p-5">
                  <RoundButton icon="remove" label="Diminuir nível" disabled={level <= 1} onPress={() => setLevel((l) => Math.max(1, l - 1))} />
                  <Bump trigger={level}>
                    <Text className="w-16 text-center font-display text-5xl text-gold-ink">{level}</Text>
                  </Bump>
                  <RoundButton icon="add" label="Aumentar nível" disabled={level >= 20} onPress={() => setLevel((l) => Math.min(20, l + 1))} />
                </View>
              </Section>
              <Card className="gap-1 rounded-[22px] border-gold/30">
                <Heading>{name.trim()}</Heading>
                <Muted>{[race?.name, cls?.name].filter(Boolean).join(' · ')} · nível {level}</Muted>
                {cls && <Muted>PV iniciais: {startingHp(cls.hitDie, level)}</Muted>}
              </Card>
              <Muted>Os atributos começam em 10; ajuste os detalhes completos pela versão web.</Muted>
            </>
          )}
        </Reveal>
      </ScrollScreen>
      <View className="flex-row gap-3 border-t border-line bg-canvas px-4 py-3">
        {step > 0 && <Button title="Voltar" variant="secondary" icon="arrow-back" onPress={() => setStep((n) => n - 1)} className="flex-1" />}
        <Button title={last ? 'Criar personagem' : 'Continuar'} icon={last ? 'checkmark' : 'arrow-forward'} onPress={next} loading={saving} disabled={!canNext} className="flex-[2]" />
      </View>
    </View>
  );
}

/** Opção selecionável em cartão, com marca que dá pop ao escolher. */
function ChoiceCard({ title, text, selected, onPress, index }: { title: string; text: string; selected: boolean; onPress: () => void; index: number }) {
  const gold = useThemeColor('--color-gold-ink');
  return (
    <RevealItem index={index}>
      <PressScale
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        onPress={onPress}
        scaleTo={0.97}
        className={cx('min-h-[56px] flex-row items-center gap-3 rounded-2xl border px-4 py-3', selected ? 'border-gold bg-gold/15' : 'border-line bg-surface')}
      >
        <View className="min-w-0 flex-1">
          <Text className="font-display-medium text-base text-ink">{title}</Text>
          <Muted numberOfLines={2}>{text}</Muted>
        </View>
        {selected && (
          <Pop>
            <Icon name="checkmark-circle" size={24} color={gold} />
          </Pop>
        )}
      </PressScale>
    </RevealItem>
  );
}
