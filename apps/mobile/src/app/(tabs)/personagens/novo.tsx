import { CLASSES, RACES, XP_BY_LEVEL, getClass, getRace } from '@repo/rules';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { Button, Chip, Input, Muted, ScrollScreen, Section } from '@/components/ui';
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

  const race = getRace(raceId);
  const cls = getClass(classId);
  const valid = name.trim().length > 0 && !!race && !!cls;

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

  return (
    <ScrollScreen>
      <Section title="Nome">
        <Input value={name} onChangeText={setName} placeholder="Ex.: Thalia Ventoforte" autoCapitalize="words" returnKeyType="done" />
      </Section>

      <Section title="Raça">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
          {RACES.map((r) => (
            <Chip key={r.id} label={r.name} selected={r.id === raceId} onPress={() => setRaceId(r.id)} />
          ))}
        </ScrollView>
        {race && <Muted>{race.summary}</Muted>}
      </Section>

      <Section title="Classe">
        <View className="flex-row flex-wrap gap-2">
          {CLASSES.map((k) => (
            <Chip key={k.id} label={k.name} selected={k.id === classId} onPress={() => setClassId(k.id)} />
          ))}
        </View>
        {cls && <Muted>{cls.summary} · Dado de vida d{cls.hitDie}</Muted>}
      </Section>

      <Section title="Nível">
        <View className="flex-row items-center gap-4">
          <RoundButton icon="remove" label="Diminuir nível" disabled={level <= 1} onPress={() => setLevel((l) => Math.max(1, l - 1))} />
          <Text className="w-10 text-center font-display text-2xl text-gold-ink">{level}</Text>
          <RoundButton icon="add" label="Aumentar nível" disabled={level >= 20} onPress={() => setLevel((l) => Math.min(20, l + 1))} />
          {cls && <Muted className="flex-1">PV iniciais: {startingHp(cls.hitDie, level)}</Muted>}
        </View>
      </Section>

      <Muted>Os atributos começam em 10; ajuste os detalhes completos pela versão web.</Muted>

      <Button title="Criar personagem" icon="checkmark" onPress={submit} loading={saving} disabled={!valid} />
    </ScrollScreen>
  );
}
