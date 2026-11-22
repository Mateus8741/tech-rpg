import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Particles } from '@/components/motion';

/*
 * Splash animada de entrada. O fundo é UMA cor chapada (#0b0a14, a mesma da splash nativa em
 * app.json), então o 1º frame é idêntico ao nativo e não há troca visível. Tudo o mais nasce
 * dali: brilho radial suave (círculos empilhados, sem bordas duras), círculo mágico girando,
 * o d20 que rola e "cai" com impacto, e o título letra a letra. Toque para pular.
 */

const BG = '#0b0a14';
const GOLD = '#e0b04c';
const GOLD_SOFT = '#f3d994';
const INDIGO = '#4b45c8';

const DIE = 180;
const LAND = 1000; // ms: dado termina de rolar
const EXIT_AT = 2500; // ms: começa a sair
const EXIT_MS = 450;
const LIFT = -64;
const TITLE = 'FICHAS RPG';

const abs = StyleSheet.absoluteFill;

/** Brilho radial sem SVG: círculos concêntricos de baixa opacidade somam um degradê suave. */
function RadialGlow({ size, color, steps, alpha }: { size: number; color: string; steps: number; alpha: number }) {
  return (
    <View pointerEvents="none" style={[styles.fill, { width: size, height: size }]}>
      {Array.from({ length: steps }).map((_, i) => {
        const d = size * (1 - i / steps);
        return <View key={i} style={{ position: 'absolute', width: d, height: d, borderRadius: d, backgroundColor: color, opacity: alpha }} />;
      })}
    </View>
  );
}

/** Marcas (ticks) ou losangos distribuídos num círculo: o "círculo mágico" em volta do dado. */
function MagicRing({ size, count, long, color, dots }: { size: number; count: number; long: number; color: string; dots?: boolean }) {
  const r = size / 2;
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  return (
    <View pointerEvents="none" style={[styles.fill, { width: size, height: size }]}>
      <View style={{ position: 'absolute', width: size, height: size, borderRadius: size, borderWidth: 1, borderColor: color, opacity: 0.35 }} />
      {items.map((i) => {
        const big = i % long === 0;
        const w = dots ? 7 : 1.5;
        const h = dots ? 7 : big ? 12 : 6;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: w,
              height: h,
              borderRadius: 1,
              backgroundColor: color,
              opacity: big ? 0.9 : 0.5,
              transform: [{ rotate: `${(360 / count) * i + (dots ? 45 : 0)}deg` }, { translateY: -r + (dots ? 0 : h / 2) }],
            }}
          />
        );
      })}
    </View>
  );
}

/** Onda fina de luz que sai do dado no impacto. */
function Shock({ delay, size }: { delay: number; size: number }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.set(withDelay(delay, withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) })));
  }, [v, delay]);
  const a = useAnimatedStyle(() => ({
    opacity: v.value === 0 ? 0 : 0.8 * (1 - v.value),
    transform: [{ scale: 0.5 + 1.6 * v.value }],
  }));
  return <Animated.View pointerEvents="none" style={[styles.fill, { width: size, height: size, borderRadius: size, borderWidth: 1.5, borderColor: GOLD_SOFT }, a]} />;
}

export function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const rotate = useSharedValue(0); // giro do dado
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);
  const glow = useSharedValue(0);
  const circle = useSharedValue(0); // entrada do círculo mágico
  const spinA = useSharedValue(0);
  const spinB = useSharedValue(0);
  const flash = useSharedValue(0);
  const root = useSharedValue(1);
  const grow = useSharedValue(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exiting = useRef(false);

  const exit = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    root.set(withTiming(0, { duration: EXIT_MS, easing: Easing.in(Easing.quad) }));
    grow.set(withTiming(1.06, { duration: EXIT_MS, easing: Easing.out(Easing.quad) }));
    timers.current.push(setTimeout(onDone, EXIT_MS));
  }, [root, grow, onDone]);

  useEffect(() => {
    const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
    if (reduce) {
      lift.set(LIFT);
      glow.set(1);
      circle.set(1);
      later(exit, 1300);
    } else {
      glow.set(withDelay(150, withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) })));
      circle.set(withDelay(250, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) })));
      spinA.set(withRepeat(withTiming(360, { duration: 26000, easing: Easing.linear }), -1));
      spinB.set(withRepeat(withTiming(-360, { duration: 38000, easing: Easing.linear }), -1));

      // O dado rola uma volta inteira, com respiro (encolhe, estoura, assenta).
      rotate.set(withDelay(200, withTiming(360, { duration: LAND - 200, easing: Easing.bezier(0.16, 1, 0.3, 1) })));
      scale.set(
        withDelay(
          200,
          withSequence(
            withTiming(0.86, { duration: 200, easing: Easing.out(Easing.quad) }),
            withTiming(1.08, { duration: 420, easing: Easing.inOut(Easing.quad) }),
            withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
          ),
        ),
      );
      // Impacto: clarão rápido no brilho; depois o conjunto sobe para abrir espaço ao título.
      flash.set(withDelay(LAND - 40, withSequence(withTiming(1, { duration: 120 }), withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) }))));
      lift.set(withDelay(LAND + 80, withTiming(LIFT, { duration: 600, easing: Easing.out(Easing.cubic) })));
      later(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {}), LAND - 40);
      later(exit, EXIT_AT);
    }
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, [reduce, rotate, scale, lift, glow, circle, spinA, spinB, flash, exit]);

  const groupStyle = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }] }));
  const dieStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }, { scale: scale.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value * (0.8 + 0.5 * flash.value), transform: [{ scale: 0.8 + 0.2 * glow.value + 0.12 * flash.value }] }));
  const ringA = useAnimatedStyle(() => ({ opacity: circle.value, transform: [{ rotate: `${spinA.value}deg` }, { scale: 0.75 + 0.25 * circle.value }] }));
  const ringB = useAnimatedStyle(() => ({ opacity: circle.value * 0.9, transform: [{ rotate: `${spinB.value}deg` }, { scale: 0.7 + 0.3 * circle.value }] }));
  const rootStyle = useAnimatedStyle(() => ({ opacity: root.value, transform: [{ scale: grow.value }] }));

  const rm = ReduceMotion.System;
  const at = (ms: number) => (reduce ? 0 : ms);

  return (
    <Animated.View style={[abs, { zIndex: 100, backgroundColor: BG }, rootStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pular animação de abertura"
        style={abs}
        onPress={exit}
        // Só depois do 1º layout a splash nativa some: sem piscar entre as duas.
        onLayout={() => SplashScreen.hideAsync().catch(() => {})}
      >
        {!reduce && <Particles color={GOLD} height={760} count={20} />}

        <View style={styles.center} pointerEvents="none">
          <Animated.View style={[styles.group, groupStyle]}>
            <Animated.View style={[styles.fill, glowStyle]}>
              <RadialGlow size={720} color={INDIGO} steps={16} alpha={0.028} />
              <RadialGlow size={420} color={GOLD} steps={16} alpha={0.032} />
            </Animated.View>

            <Animated.View style={[styles.fill, ringA]}>
              <MagicRing size={252} count={48} long={4} color={GOLD} />
            </Animated.View>
            <Animated.View style={[styles.fill, ringB]}>
              <MagicRing size={310} count={12} long={1} color={GOLD_SOFT} dots />
            </Animated.View>

            {!reduce && (
              <>
                <Shock delay={LAND - 40} size={DIE} />
                <Shock delay={LAND + 180} size={DIE} />
              </>
            )}

            <Animated.View style={[styles.fill, { width: DIE, height: DIE }, dieStyle]}>
              <Image source={require('../../../assets/images/splash-icon.png')} style={{ width: DIE, height: DIE }} resizeMode="contain" accessibilityIgnoresInvertColors />
            </Animated.View>
          </Animated.View>

          <View style={styles.titleBox}>
            <View style={styles.titleRow} accessibilityRole="header" accessibilityLabel="Fichas RPG">
              {TITLE.split('').map((ch, i) => (
                <Animated.Text
                  key={i}
                  entering={FadeInDown.delay(at(LAND + 100 + i * 55)).duration(480).easing(Easing.out(Easing.cubic)).reduceMotion(rm)}
                  style={[styles.title, ch === ' ' && { width: 14 }]}
                  importantForAccessibility="no"
                >
                  {ch}
                </Animated.Text>
              ))}
            </View>
            <Animated.View entering={FadeIn.delay(at(LAND + 700)).duration(500).reduceMotion(rm)} style={styles.rule} />
            <Animated.Text entering={FadeInDown.delay(at(LAND + 800)).duration(500).easing(Easing.out(Easing.cubic)).reduceMotion(rm)} style={styles.tagline}>
              Gerenciamento de Personagens D&amp;D
            </Animated.Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { ...abs, alignItems: 'center', justifyContent: 'center' },
  group: { width: DIE, height: DIE, alignItems: 'center', justifyContent: 'center' },
  // Centraliza qualquer camada dentro do grupo, independente do tamanho dela.
  fill: { position: 'absolute', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  titleBox: { position: 'absolute', top: '50%', marginTop: 112, alignItems: 'center', gap: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 32,
    letterSpacing: 5,
    color: GOLD_SOFT,
    textShadowColor: 'rgba(224,176,76,0.55)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  rule: { width: 84, height: 1.5, borderRadius: 2, backgroundColor: GOLD, opacity: 0.85 },
  tagline: { fontSize: 14, letterSpacing: 0.8, color: '#cfc5b4', textAlign: 'center' },
});
