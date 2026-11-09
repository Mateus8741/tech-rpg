import { Stack } from 'expo-router';

import { useStackScreenOptions } from '@/lib/nav-theme';

export default function DadosLayout() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Dados' }} />
    </Stack>
  );
}
