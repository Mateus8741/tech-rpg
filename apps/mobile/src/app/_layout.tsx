import '../global.css';

import { Cinzel_500Medium, Cinzel_700Bold, useFonts } from '@expo-google-fonts/cinzel';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useUniwind } from 'uniwind';

import { AnimatedSplash } from '@/components/splash/AnimatedSplash';
import { restoreThemePreference } from '@/features/perfil/theme';
import { SessionProvider, useSession } from '@/lib/session';
import { useNavTheme } from '@/lib/nav-theme';

SplashScreen.preventAutoHideAsync();
restoreThemePreference();

function RootNavigator() {
  const { session, loading } = useSession();
  const navTheme = useNavTheme();
  const { theme } = useUniwind();
  const [fontsLoaded] = useFonts({ Cinzel_500Medium, Cinzel_700Bold });
  const ready = fontsLoaded && !loading;

  const [splashDone, setSplashDone] = useState(false);

  // Com splash animada, ela mesma esconde a nativa (no 1º layout). Aqui só o caso de segurança.
  useEffect(() => {
    if (ready && splashDone) SplashScreen.hideAsync().catch(() => {});
  }, [ready, splashDone]);

  if (!ready) return null;

  return (
    <ThemeProvider value={navTheme}>
      {!splashDone && <AnimatedSplash onDone={() => setSplashDone(true)} />}
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade', animationDuration: 320 }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}
