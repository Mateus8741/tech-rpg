import { useEffect, type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { withUniwind } from 'uniwind';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

/*
 * Kit de movimento do app (Reanimated 4, roda na UI thread). Todas as animações respeitam
 * "reduzir movimento" do sistema (ReduceMotion.System). Use estes blocos em vez de criar
 * animações soltas nas telas, para o app ter um ritmo único.
 *
 *  - Reveal / RevealList: entrada escalonada (fade + sobe) de blocos e itens de lista
 *  - PressScale: Pressable com mola ao toque + haptic leve
 *  - Pulse: respiração contínua (brilho/escala) para destaques
 *  - Shimmer: esqueleto de carregamento
 *  - Pop: aparece com mola (badges, resultados de dado)
 *  - CountUp (via AnimatedNumber): números que contam até o valor
 */

export const SPRING = { damping: 16, stiffness: 220, mass: 0.7 } as const;
const RM = ReduceMotion.System;

export const stagger = (index: number, step = 55, max = 10) => Math.min(index, max) * step;

/** Entrada: fade + desloca de baixo para cima, com atraso opcional. */
export function Reveal({
  children,
  delay = 0,
  from = 'down',
  style,
}: {
  children: ReactNode;
  delay?: number;
  from?: 'down' | 'up' | 'fade';
  style?: StyleProp<ViewStyle>;
}) {
  const base = from === 'up' ? FadeInUp : from === 'fade' ? FadeIn : FadeInDown;
  return (
    <Animated.View
      style={style}
      entering={base.delay(delay).duration(420).easing(Easing.out(Easing.cubic)).reduceMotion(RM)}
      layout={LinearTransition.springify().damping(18).reduceMotion(RM)}
    >
      {children}
    </Animated.View>
  );
}

/** Item de lista com entrada escalonada pelo índice. */
export function RevealItem({ index, children, style }: { index: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <Reveal delay={stagger(index)} style={style}>
      {children}
    </Reveal>
  );
}

/** Aparece com mola (badges, resultados, avisos). */
export function Pop({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Animated.View style={style} entering={ZoomIn.delay(delay).springify().damping(13).reduceMotion(RM)}>
      {children}
    </Animated.View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable com escala em mola ao toque e haptic leve opcional. */
export function PressScale({
  children,
  scaleTo = 0.96,
  haptic = true,
  style,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableProps & { scaleTo?: number; haptic?: boolean; style?: StyleProp<ViewStyle>; className?: string; children: ReactNode }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      style={[a, style]}
      onPressIn={(e) => {
        s.value = withSpring(scaleTo, SPRING);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.value = withSpring(1, SPRING);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
    >
      {children}
    </AnimatedPressable>
  );
}

/** Respiração contínua: oscila opacidade e escala (ex.: brilho do dourado, ícone de destaque). */
export function Pulse({
  children,
  min = 0.65,
  scale = 1.04,
  duration = 1800,
  style,
}: {
  children: ReactNode;
  min?: number;
  scale?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [v, duration]);
  const a = useAnimatedStyle(() => ({ opacity: min + (1 - min) * v.value, transform: [{ scale: 1 + (scale - 1) * v.value }] }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}

/** Bloco de esqueleto com brilho passando. */
export function Shimmer({ style }: { style?: StyleProp<ViewStyle> }) {
  const v = useSharedValue(0.35);
  useEffect(() => {
    v.value = withRepeat(withSequence(withTiming(0.8, { duration: 700 }), withTiming(0.35, { duration: 700 })), -1);
  }, [v]);
  const a = useAnimatedStyle(() => ({ opacity: v.value }));
  return <Animated.View style={[{ backgroundColor: '#8884', borderRadius: 12, height: 16 }, a, style]} />;
}

/** Barra que anima a largura (0–1), ex.: PV, mana. */
export function AnimatedBar({ value, color, track = '#8883', height = 10, style }: { value: number; color: string; track?: string; height?: number; style?: StyleProp<ViewStyle> }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(120, withSpring(Math.max(0, Math.min(1, value)), { damping: 18, stiffness: 120 }));
  }, [value, w]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <Animated.View style={[{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height: '100%', borderRadius: height, backgroundColor: color }, a]} />
    </Animated.View>
  );
}

/** Dá um "pulo" quando o valor muda (use em números que o usuário altera). */
export function Bump({ trigger, children, style }: { trigger: unknown; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withSequence(withTiming(1.18, { duration: 110 }), withSpring(1, SPRING));
  }, [trigger, s]);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}

/** Sacudida (erro / falha crítica). Chame via `key` mudando. */
export function Shake({ trigger, children, style }: { trigger: unknown; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 80 }), withTiming(-5, { duration: 70 }), withTiming(0, { duration: 60 }));
  }, [trigger, x]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}

/** Flutua suavemente para cima/baixo (ícones de destaque, heróis). */
export function Float({ children, distance = 6, duration = 2600, style }: { children: ReactNode; distance?: number; duration?: number; style?: StyleProp<ViewStyle> }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [v, duration]);
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: -distance * v.value }] }));
  return <Animated.View style={[a, style]}>{children}</Animated.View>;
}

function Mote({ x, size, delay, duration, height, color }: { x: number; size: number; delay: number; duration: number; height: number; color: string }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(delay, withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false));
  }, [v, delay, duration]);
  const a = useAnimatedStyle(() => ({
    opacity: v.value < 0.2 ? v.value * 4 : (1 - v.value) * 1.1,
    transform: [{ translateY: -v.value * height * 0.5 }, { translateX: Math.sin(v.value * 6.28) * 10 }],
  }));
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: `${x}%`, bottom: 0, width: size, height: size, borderRadius: size, backgroundColor: color }, a]} />;
}

/** Partículas sutis subindo (fundo de hero/login). Posições determinísticas; não captura toques. */
export function Particles({ count = 14, color = '#e0b04c', height = 400, style }: { count?: number; color?: string; height?: number; style?: StyleProp<ViewStyle> }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left: 0, right: 0, bottom: 0, height }, style]}>
      {Array.from({ length: count }).map((_, i) => (
        <Mote
          key={i}
          x={(i * 37 + 11) % 96}
          size={2 + ((i * 7) % 4)}
          delay={(i * 430) % 4000}
          duration={5200 + ((i * 611) % 3800)}
          height={height}
          color={color}
        />
      ))}
    </Animated.View>
  );
}

/** Anel que expande e some (aura em volta de logo/ícone). */
export function GlowRing({ size = 96, color = '#e0b04c', style }: { size?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }), -1, false);
  }, [v]);
  const a = useAnimatedStyle(() => ({ opacity: 0.55 * (1 - v.value), transform: [{ scale: 1 + 0.7 * v.value }] }));
  return <Animated.View pointerEvents="none" style={[{ position: 'absolute', width: size, height: size, borderRadius: size, borderWidth: 2, borderColor: color }, a, style]} />;
}

export { Animated, Easing, FadeIn, FadeInDown, FadeInUp, LinearTransition, ZoomIn };

/** Animated.View que aceita className (Uniwind não aplica className em componentes do Reanimated sem este wrapper). */
export const AnimatedView = withUniwind(Animated.View);
