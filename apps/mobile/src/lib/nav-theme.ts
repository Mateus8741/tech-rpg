import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { useUniwind } from 'uniwind';

import { useThemeColor } from '@/components/ui';

/** Tema do React Navigation montado a partir dos tokens do global.css. */
export function useNavTheme(): Theme {
  const { theme } = useUniwind();
  const base = theme === 'dark' ? DarkTheme : DefaultTheme;
  const canvas = useThemeColor('--color-canvas');
  const surface = useThemeColor('--color-surface');
  const ink = useThemeColor('--color-ink');
  const line = useThemeColor('--color-line');
  const gold = useThemeColor('--color-gold-ink');
  return {
    ...base,
    colors: { ...base.colors, primary: gold, background: canvas, card: surface, text: ink, border: line, notification: gold },
  };
}

/** Opções de Stack comuns às abas (header no estilo do app). */
export function useStackScreenOptions() {
  const surface = useThemeColor('--color-surface');
  const ink = useThemeColor('--color-ink');
  const gold = useThemeColor('--color-gold-ink');
  return {
    headerStyle: { backgroundColor: surface },
    headerTintColor: gold,
    headerTitleStyle: { color: ink, fontFamily: 'Cinzel_700Bold' },
    headerShadowVisible: false,
    headerBackButtonDisplayMode: 'minimal' as const,
  };
}
