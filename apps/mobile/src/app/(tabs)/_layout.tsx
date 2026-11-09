import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { useThemeColor } from '@/components/ui';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { name: 'personagens', title: 'Fichas', icon: 'people-outline', iconActive: 'people' },
  { name: 'magias', title: 'Magias', icon: 'sparkles-outline', iconActive: 'sparkles' },
  { name: 'compendio', title: 'Compêndio', icon: 'book-outline', iconActive: 'book' },
  { name: 'dados', title: 'Dados', icon: 'dice-outline', iconActive: 'dice' },
  { name: 'perfil', title: 'Perfil', icon: 'person-circle-outline', iconActive: 'person-circle' },
];

export const unstable_settings = { initialRouteName: 'personagens' };

export default function TabsLayout() {
  const surface = useThemeColor('--color-surface');
  const line = useThemeColor('--color-line');
  const active = useThemeColor('--color-gold-ink');
  const inactive = useThemeColor('--color-ink-faint');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: { backgroundColor: surface, borderTopColor: line },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={size} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
