import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

import { useThemeColor, withAlpha } from '@/components/ui';

type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
type IoniconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IoniconName; iconActive: IoniconName }[] = [
  { name: 'personagens', title: 'Fichas', icon: 'people-outline', iconActive: 'people' },
  { name: 'magias', title: 'Magias', icon: 'sparkles-outline', iconActive: 'sparkles' },
  { name: 'compendio', title: 'Compêndio', icon: 'book-outline', iconActive: 'book' },
  { name: 'dados', title: 'Dados', icon: 'dice-outline', iconActive: 'dice' },
  { name: 'perfil', title: 'Perfil', icon: 'person-circle-outline', iconActive: 'person-circle' },
];

export const unstable_settings = { initialRouteName: 'personagens' };

const RM = ReduceMotion.System;
const BAR_HEIGHT = 64;
const PAD = 6;

function TabItem({ tab, focused, color, onPress, onLongPress }: { tab: (typeof TABS)[number]; focused: boolean; color: string; onPress: () => void; onLongPress: () => void }) {
  const pop = useSharedValue(1);
  const lift = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    lift.value = withTiming(focused ? 1 : 0, { duration: 220, easing: Easing.out(Easing.cubic), reduceMotion: RM });
    if (focused) pop.value = withSequence(withTiming(0.8, { duration: 90, reduceMotion: RM }), withSpring(1, { damping: 8, stiffness: 260, reduceMotion: RM }));
  }, [focused, pop, lift]);
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }, { translateY: -2 * lift.value }] }));
  const label = useAnimatedStyle(() => ({ opacity: 0.65 + 0.35 * lift.value }));

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={tab.title}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: 2 }}
    >
      <Animated.View style={icon}>
        <Ionicons name={focused ? tab.iconActive : tab.icon} size={22} color={color} />
      </Animated.View>
      <Animated.Text style={[label, { color, fontSize: 10.5, fontWeight: '700', letterSpacing: 0.3 }]} numberOfLines={1}>
        {tab.title}
      </Animated.Text>
    </Pressable>
  );
}

function FloatingTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useUniwind();
  const gold = useThemeColor('--color-gold');
  const active = useThemeColor('--color-gold-ink');
  const inactive = useThemeColor('--color-ink-faint');
  const surface = useThemeColor('--color-surface');
  const line = useThemeColor('--color-line-strong');
  const [width, setWidth] = useState(0);
  const x = useSharedValue(0);
  const itemW = width > 0 ? (width - PAD * 2) / TABS.length : 0;

  useEffect(() => {
    if (itemW > 0) x.value = withSpring(PAD + state.index * itemW, { damping: 15, stiffness: 190, mass: 0.8, reduceMotion: RM });
  }, [state.index, itemW, x]);
  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 16, right: 16, bottom: Math.max(insets.bottom, 12) }}>
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={{
          height: BAR_HEIGHT,
          borderRadius: 28,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: withAlpha(line, 0.9),
          shadowColor: '#000',
          shadowOpacity: 0.35,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }}
      >
        <BlurView intensity={60} tint={theme === 'dark' ? 'dark' : 'light'} style={{ position: 'absolute', inset: 0 }} />
        <View style={{ position: 'absolute', inset: 0, backgroundColor: withAlpha(surface, 0.72) }} />
        {itemW > 0 && (
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: PAD,
                bottom: PAD,
                width: itemW,
                borderRadius: 22,
                backgroundColor: withAlpha(gold, 0.18),
                borderWidth: 1,
                borderColor: withAlpha(gold, 0.45),
              },
              indicator,
            ]}
          />
        )}
        <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: PAD, alignItems: 'center' }}>
          {state.routes.map((route, i) => {
            const tab = TABS.find((t) => t.name === route.name);
            if (!tab) return null;
            const focused = state.index === i;
            return (
              <TabItem
                key={route.key}
                tab={tab}
                focused={focused}
                color={focused ? active : inactive}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  const e = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                  if (!focused && !e.defaultPrevented) navigateToTab(route.key);
                }}
                onLongPress={() => emitter.emit({ type: 'tabLongPress', target: route.key })}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, animation: 'shift' }}
    >
      {TABS.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title }} />
      ))}
    </Tabs>
  );
}
