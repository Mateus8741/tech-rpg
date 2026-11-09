import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { Uniwind, useUniwind } from 'uniwind';

export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_OPTIONS: { id: ThemePreference; label: string; icon: 'sunny-outline' | 'moon-outline' | 'phone-portrait-outline' }[] = [
  { id: 'light', label: 'Claro', icon: 'sunny-outline' },
  { id: 'dark', label: 'Escuro', icon: 'moon-outline' },
  { id: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
];

const KEY = 'rpg_theme';

/**
 * Reaplica a preferência salva. Para valer desde a abertura do app,
 * chame no layout raiz (ex.: num useEffect do RootNavigator).
 */
export async function restoreThemePreference() {
  try {
    const saved = await AsyncStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') Uniwind.setTheme(saved);
  } catch {
    /* armazenamento indisponível */
  }
}

/** Preferência de tema atual (Claro / Escuro / Sistema) e setter persistido. */
export function useThemePreference() {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const preference: ThemePreference = hasAdaptiveThemes ? 'system' : theme === 'dark' ? 'dark' : 'light';

  const setPreference = useCallback((next: ThemePreference) => {
    Uniwind.setTheme(next);
    AsyncStorage.setItem(KEY, next).catch(() => {});
  }, []);

  return { preference, resolvedTheme: theme, setPreference };
}
