import { Stack } from 'expo-router';
import { getBackground, getClass, getRace } from '@repo/rules';

import { useStackScreenOptions } from '@/lib/nav-theme';

type IdParams = { id?: string } | undefined;
const idOf = (params: object | undefined) => String((params as IdParams)?.id ?? '');

export default function CompendioLayout() {
  const screenOptions = useStackScreenOptions();
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Compêndio' }} />
      <Stack.Screen name="classes/index" options={{ title: 'Classes' }} />
      <Stack.Screen name="classes/[id]" options={({ route }) => ({ title: getClass(idOf(route.params))?.name ?? 'Classe' })} />
      <Stack.Screen name="racas/index" options={{ title: 'Raças' }} />
      <Stack.Screen name="racas/[id]" options={({ route }) => ({ title: getRace(idOf(route.params))?.name ?? 'Raça' })} />
      <Stack.Screen name="antecedentes/index" options={{ title: 'Antecedentes' }} />
      <Stack.Screen
        name="antecedentes/[id]"
        options={({ route }) => ({ title: getBackground(idOf(route.params))?.name ?? 'Antecedente' })}
      />
      <Stack.Screen name="equipamento" options={{ title: 'Equipamento' }} />
      <Stack.Screen name="regras" options={{ title: 'Regras e Condições' }} />
    </Stack>
  );
}
