import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Float, GlowRing, Particles, Pop, Pulse, Reveal, Shake } from '@/components/motion';
import { Body, Button, Chip, GlassCard, Icon, Input, Label, Muted, Screen, useThemeColor, withAlpha } from '@/components/ui';
import { useSession, type Role } from '@/lib/session';

export default function LoginScreen() {
  const { signIn, lastUsername } = useSession();
  const [username, setUsername] = useState(lastUsername);
  const [role, setRole] = useState<Role>('PLAYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shakes, setShakes] = useState(0);
  const gold = useThemeColor('--color-gold');
  const canvas = useThemeColor('--color-canvas');
  const violet = useThemeColor('--color-violet');

  const fail = (msg: string) => {
    setError(msg);
    setShakes((n) => n + 1);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  };

  const submit = async () => {
    const name = username.trim();
    if (!name) return fail('Por favor, insira um nome de usuário');
    setLoading(true);
    setError('');
    try {
      await signIn(name, role);
    } catch {
      fail('Erro ao fazer login. Verifique a conexão com a API e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <LinearGradient
        pointerEvents="none"
        colors={[withAlpha(gold, 0.22), withAlpha(violet, 0.1), withAlpha(canvas, 0)]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 480 }}
      />
      <Particles color={gold} height={520} count={16} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerClassName="flex-grow justify-center px-6 py-8" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View className="mb-9 items-center gap-3">
            <Pop>
              <Float>
                <View className="h-28 w-28 items-center justify-center">
                  <GlowRing size={96} color={gold} />
                  <Pulse min={0.85} scale={1.05} duration={2000}>
                    <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-gold/60 bg-gold/15 shadow-lg shadow-black/40">
                      <Icon name="dice" size={48} color={gold} />
                    </View>
                  </Pulse>
                </View>
              </Float>
            </Pop>
            <Reveal delay={200}>
              <Text className="text-center font-display text-3xl leading-9 text-gold-ink">Sistema de Fichas RPG</Text>
            </Reveal>
            <Reveal delay={300}>
              <Muted className="text-center text-sm">Gerenciamento de Personagens D&amp;D</Muted>
            </Reveal>
          </View>

          <Reveal delay={420}>
            <Shake trigger={shakes}>
              <GlassCard className="gap-5 p-6">
                <View className="gap-1.5">
                  <Label>Nome de usuário</Label>
                  <Input
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Digite seu nome"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="go"
                    onSubmitEditing={submit}
                    editable={!loading}
                  />
                </View>

                <View className="gap-1.5">
                  <Label>Tipo de usuário</Label>
                  <View className="flex-row gap-2">
                    <Chip label="Jogador" selected={role === 'PLAYER'} onPress={() => setRole('PLAYER')} />
                    <Chip label="Mestre" selected={role === 'MASTER'} onPress={() => setRole('MASTER')} />
                  </View>
                </View>

                {!!error && (
                  <Pop>
                    <View className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2">
                      <Text className="text-sm text-danger">{error}</Text>
                    </View>
                  </Pop>
                )}

                <Button title="Entrar" icon="enter-outline" onPress={submit} loading={loading} disabled={!username.trim()} />
              </GlassCard>
            </Shake>
          </Reveal>

          <Reveal delay={560} from="fade">
            <View className="mt-6 gap-1.5">
              <Body className="text-xs text-ink-faint">
                <Text className="font-semibold text-ink-soft">Jogador</Text> — acessa apenas suas próprias fichas
              </Body>
              <Body className="text-xs text-ink-faint">
                <Text className="font-semibold text-ink-soft">Mestre</Text> — acessa todas as fichas dos jogadores
              </Body>
            </View>
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
