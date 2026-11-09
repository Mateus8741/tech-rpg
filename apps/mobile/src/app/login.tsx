import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import { Body, Button, Card, Chip, Icon, Input, Label, Muted, Screen, useThemeColor } from '@/components/ui';
import { useSession, type Role } from '@/lib/session';

export default function LoginScreen() {
  const { signIn, lastUsername } = useSession();
  const [username, setUsername] = useState(lastUsername);
  const [role, setRole] = useState<Role>('PLAYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const gold = useThemeColor('--color-gold');

  const submit = async () => {
    const name = username.trim();
    if (!name) {
      setError('Por favor, insira um nome de usuário');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(name, role);
    } catch {
      setError('Erro ao fazer login. Verifique a conexão com a API e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-center px-6">
        <View className="mb-8 items-center gap-3">
          <View className="h-20 w-20 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
            <Icon name="dice" size={40} color={gold} />
          </View>
          <Text className="text-center font-display text-2xl text-gold-ink">Sistema de Fichas RPG</Text>
          <Muted className="text-sm">Gerenciamento de Personagens D&amp;D</Muted>
        </View>

        <Card className="gap-4 p-5">
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
            <View className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2">
              <Text className="text-sm text-danger">{error}</Text>
            </View>
          )}

          <Button title="Entrar" onPress={submit} loading={loading} disabled={!username.trim()} />
        </Card>

        <View className="mt-6 gap-1.5">
          <Body className="text-xs text-ink-faint">
            <Text className="font-semibold text-ink-soft">Jogador</Text> — acessa apenas suas próprias fichas
          </Body>
          <Body className="text-xs text-ink-faint">
            <Text className="font-semibold text-ink-soft">Mestre</Text> — acessa todas as fichas dos jogadores
          </Body>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
