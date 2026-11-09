import Constants from 'expo-constants';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { Badge, Button, Card, Heading, Icon, InfoRow, Muted, ScrollScreen, Section, cx, useThemeColor } from '@/components/ui';
import { THEME_OPTIONS, useThemePreference } from '@/features/perfil/theme';
import { useCharacterCount } from '@/features/perfil/useCharacterCount';
import { API_URL } from '@/lib/api';
import { useSession } from '@/lib/session';

const appVersion = Constants.expoConfig?.version ?? '—';

export default function PerfilScreen() {
  const { session, signOut } = useSession();
  const { state: characters, reload } = useCharacterCount(session?.username);
  const { preference, resolvedTheme, setPreference } = useThemePreference();
  const [leaving, setLeaving] = useState(false);
  const white = '#ffffff';
  const gold = useThemeColor('--color-gold');
  const soft = useThemeColor('--color-ink-soft');
  const indigoInk = useThemeColor('--color-indigo-ink');

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
      <Card className="flex-row items-center gap-4">
        <View className={cx('h-16 w-16 items-center justify-center rounded-2xl', isMaster ? 'bg-violet' : 'bg-indigo')}>
          <Text className="font-display text-2xl" style={{ color: white }}>
            {initial}
          </Text>
        </View>
        <View className="flex-1 gap-1.5">
          <Heading className="text-lg" numberOfLines={1}>
            {session.username}
          </Heading>
          <Badge tone={isMaster ? 'violet' : 'indigo'}>{isMaster ? 'Mestre' : 'Jogador'}</Badge>
        </View>
        <Icon name={isMaster ? 'shield-half' : 'person'} size={22} color={isMaster ? gold : soft} />
      </Card>

      <Pressable
        accessibilityRole="button"
        accessibilityHint="Toque para atualizar"
        onPress={reload}
        className="flex-row items-center gap-3 rounded-2xl border border-line bg-surface p-4 active:opacity-70"
      >
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
          <Icon name="people" size={20} color={gold} />
        </View>
        <View className="flex-1">
          <Muted className="text-sm">Personagens</Muted>
          {characters.status === 'error' && <Text className="text-xs text-danger">Não foi possível carregar. Toque para tentar de novo.</Text>}
        </View>
        {characters.status === 'loading' ? (
          <ActivityIndicator color={gold} />
        ) : characters.status === 'ok' ? (
          <Text className="font-display text-2xl text-gold-ink">{characters.count}</Text>
        ) : (
          <Icon name="refresh" size={20} color={soft} />
        )}
      </Pressable>

      <Section title="Aparência">
        <View className="flex-row gap-2">
          {THEME_OPTIONS.map((opt) => {
            const on = preference === opt.id;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => setPreference(opt.id)}
                className={cx(
                  'flex-1 items-center gap-1.5 rounded-xl border py-3 active:opacity-70',
                  on ? 'border-indigo bg-indigo/15' : 'border-line bg-surface',
                )}
              >
                <Icon name={opt.icon} size={22} color={on ? indigoInk : soft} />
                <Text className={cx('text-xs font-semibold', on ? 'text-indigo-ink' : 'text-ink-soft')}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
        {preference === 'system' && (
          <Muted>Seguindo o sistema (atualmente {resolvedTheme === 'dark' ? 'escuro' : 'claro'}).</Muted>
        )}
      </Section>

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

      <Button title="Sair" icon="log-out-outline" variant="danger" loading={leaving} onPress={confirmSignOut} />
    </ScrollScreen>
  );
}
