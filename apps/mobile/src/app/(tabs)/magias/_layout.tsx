import { Stack } from 'expo-router';

import { useStackScreenOptions } from '@/lib/nav-theme';

export default function MagiasLayout() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Magias' }} />
      <Stack.Screen name="[id]" options={{ title: 'Magia' }} />
    </Stack>
  );
}
