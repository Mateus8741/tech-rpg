import Constants from 'expo-constants';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import { Badge, Button, Card, Heading, InfoRow, Muted, ScrollScreen, Section, useThemeColor } from '@/components/ui';
import { Bump, Pop, Reveal } from '@/components/motion';
import { AvatarHero, StatTile, ThemeSelector, useCountUp } from '@/features/perfil/components';
import { useThemePreference } from '@/features/perfil/theme';
import { useCharacterCount } from '@/features/perfil/useCharacterCount';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/session';

const appVersion = Constants.expoConfig?.version ?? '—';

export default function PerfilScreen() {
  const { session, signOut } = useSession();
  const { state: characters, reload } = useCharacterCount(session?.username);
  const { preference, resolvedTheme, setPreference } = useThemePreference();
  const [leaving, setLeaving] = useState(false);
  const shownCount = useCountUp(characters.status === 'ok' ? characters.count : 0);
  const gold = useThemeColor('--color-gold');

  if (!session) return null;

  const isMaster = session.role === 'MASTER';
  const initial = session.username.charAt(0).toUpperCase();

  const confirmSignOut = () => {
    Alert.alert('Sair da conta', `Deseja sair como ${session.username}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setLeaving(true);
          try {
            await signOut();
          } finally {
            setLeaving(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollScreen>
      <Reveal>
        <View className="items-center gap-3 rounded-[22px] border border-gold/30 bg-surface px-5 pb-6 pt-7">
          <AvatarHero initial={initial} master={isMaster} />
          <Heading className="text-xl" numberOfLines={1}>
            {session.username}
          </Heading>
          <Pop delay={250}>
            <Badge tone={isMaster ? 'violet' : 'indigo'}>{isMaster ? 'Mestre' : 'Jogador'}</Badge>
          </Pop>
        </View>
      </Reveal>

      <Reveal delay={90}>
        <View className="flex-row gap-3">
          <StatTile icon="people" label="Personagens" onPress={reload} hint="Toque para atualizar">
            {characters.status === 'loading' ? (
              <ActivityIndicator color={gold} style={{ alignSelf: 'flex-start' }} />
            ) : characters.status === 'ok' ? (
              <Bump trigger={characters.count}>
                <Text className="font-display text-3xl text-gold-ink" style={{ fontVariant: ['tabular-nums'] }}>
                  {shownCount}
                </Text>
              </Bump>
            ) : (
              <Text className="text-xs text-danger">Falhou. Toque para tentar de novo.</Text>
            )}
          </StatTile>
          <StatTile icon={isMaster ? 'shield-half' : 'person'} label="Função">
            <Text className="font-display text-xl text-ink">{isMaster ? 'Mestre' : 'Jogador'}</Text>
          </StatTile>
        </View>
      </Reveal>

      <Reveal delay={170}>
        <Section title="Aparência">
          <ThemeSelector preference={preference} onChange={setPreference} />
          {preference === 'system' && (
            <Muted>Seguindo o sistema (atualmente {resolvedTheme === 'dark' ? 'escuro' : 'claro'}).</Muted>
          )}
        </Section>
      </Reveal>

      <Reveal delay={250}>
      <Section title="Sobre">
        <Card className="py-2">
          <InfoRow label="Versão do app" value={appVersion} />
          <InfoRow
            label="API"
            value={
              <Text selectable className="flex-1 text-right font-mono text-xs text-ink-body" numberOfLines={2}>
                {API_URL}
              </Text>
            }
          />
        </Card>
      </Section>

      </Reveal>

      <Reveal delay={320}>
        <Button title="Sair" icon="log-out-outline" variant="danger" loading={leaving} onPress={confirmSignOut} />
      </Reveal>
    </ScrollScreen>
  );
}
