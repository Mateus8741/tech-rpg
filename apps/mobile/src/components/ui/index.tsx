import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type PressableProps,
  type ScrollViewProps,
  type TextInputProps,
  type TextProps,
  type ViewProps,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { useCSSVariable, useUniwind, withUniwind } from 'uniwind';

import { Bump, Pop, PressScale, Pulse, Reveal, Shimmer } from '@/components/motion';

// Componentes de terceiros só aceitam className via withUniwind.
const SafeAreaView = withUniwind(RNSafeAreaView);

/*
 * Kit de UI compartilhado do app mobile. Tudo estilizado com classes Tailwind (Uniwind)
 * usando os tokens de src/global.css: canvas, surface, surface-2, line, ink*, indigo, gold…
 */

export type IconName = ComponentProps<typeof Ionicons>['name'];

/** Espaço inferior reservado pela tab bar flutuante (use em listas/scrolls). */
export const TAB_BAR_SPACE = 112;

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

/** Lê uma cor do tema atual (ex.: themeColor('--color-gold')). */
export function useThemeColor(name: `--color-${string}`): string {
  const value = useCSSVariable(name);
  return typeof value === 'string' ? value : '#888888';
}

export function Icon({ name, size = 20, color }: { name: IconName; size?: number; color?: string }) {
  const fallback = useThemeColor('--color-ink-soft');
  return <Ionicons name={name} size={size} color={color ?? fallback} />;
}

/** Tela com fundo do tema e safe area (o header/tab bar já cuidam das bordas). */
export function Screen({ children, className, edges = [] }: { children: ReactNode; className?: string; edges?: ('top' | 'bottom')[] }) {
  return (
    <SafeAreaView edges={edges} className={cx('flex-1 bg-canvas', className)}>
      <Backdrop />
      {children}
    </SafeAreaView>
  );
}

export function ScrollScreen({ children, className, contentContainerClassName, ...rest }: ScrollViewProps & { children: ReactNode }) {
  return (
    <ScrollView
      className={cx('flex-1 bg-canvas', className)}
      contentContainerClassName={cx('p-4 gap-4 pb-32', contentContainerClassName)}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

export function Title({ className, ...props }: TextProps) {
  return <Text className={cx('font-display text-[26px] leading-8 text-gold-ink', className)} {...props} />;
}

export function Heading({ className, ...props }: TextProps) {
  return <Text className={cx('text-[17px] font-semibold leading-6 text-ink', className)} {...props} />;
}

export function Body({ className, ...props }: TextProps) {
  return <Text className={cx('text-[15px] leading-[22px] text-ink-body', className)} {...props} />;
}

export function Muted({ className, ...props }: TextProps) {
  return <Text className={cx('text-[13px] leading-[18px] text-ink-muted', className)} {...props} />;
}

export function Label({ className, ...props }: TextProps) {
  return <Text className={cx('text-[11px] font-bold uppercase tracking-[1.5px] text-ink-faint', className)} {...props} />;
}

/** Aplica transparência (0-1) a uma cor hex #rrggbb. */
export function withAlpha(hex: string, a: number) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  return hex + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
}

/** Brilho dourado sutil no topo da tela (gradiente, não captura toques). */
export function Backdrop({ intensity = 0.1 }: { intensity?: number }) {
  const gold = useThemeColor('--color-gold');
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[withAlpha(gold, intensity), withAlpha(gold, 0)]}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260 }}
    />
  );
}

export function Card({ className, tone = 'default', ...props }: ViewProps & { tone?: 'default' | 'gold' | 'raised' }) {
  const toneCls = tone === 'gold' ? 'border-gold/40 bg-gold/10' : tone === 'raised' ? 'border-line-strong bg-surface-2' : 'border-line bg-surface';
  return <View className={cx('rounded-[20px] border p-4 shadow-md shadow-black/25', toneCls, className)} {...props} />;
}

/** Cartão de vidro (blur + borda luminosa), bom sobre fundos com gradiente/imagem. */
export function GlassCard({ children, className, intensity = 40, style }: { children: ReactNode; className?: string; intensity?: number; style?: ViewProps['style'] }) {
  const { theme } = useUniwind();
  const line = useThemeColor('--color-line-strong');
  return (
    <View style={[{ borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: withAlpha(line, 0.8) }, style]}>
      <BlurView intensity={intensity} tint={theme === 'dark' ? 'dark' : 'light'} style={{ position: 'absolute', inset: 0 }} />
      <View className={cx('bg-surface/40 p-4', className)}>{children}</View>
    </View>
  );
}

/** Cabeçalho de tela com gradiente dourado, ícone opcional, título e subtítulo; entra com animação. */
export function GradientHeader({
  title,
  subtitle,
  icon,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const gold = useThemeColor('--color-gold');
  const goldInk = useThemeColor('--color-gold-ink');
  const surface = useThemeColor('--color-surface');
  return (
    <Reveal from="up">
      <View className={cx('overflow-hidden rounded-[24px] border border-gold/30', className)}>
        <LinearGradient
          colors={[withAlpha(gold, 0.28), withAlpha(gold, 0.08), surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', inset: 0 }}
        />
        <View className="gap-3 p-5">
          <View className="flex-row items-center gap-3">
            {icon && (
              <Pulse min={0.8} scale={1.06} duration={2400}>
                <View className="h-12 w-12 items-center justify-center rounded-2xl border border-gold/40 bg-gold/15">
                  <Icon name={icon} size={24} color={goldInk} />
                </View>
              </Pulse>
            )}
            <View className="flex-1">
              <Text className="font-display text-[24px] leading-7 text-gold-ink" numberOfLines={2}>
                {title}
              </Text>
              {!!subtitle && <Muted className="mt-0.5">{subtitle}</Muted>}
            </View>
            {right}
          </View>
          {children}
        </View>
      </View>
    </Reveal>
  );
}

/** Alias semântico de GradientHeader para topos de tela. */
export const Hero = GradientHeader;

/** Pílula de estatística (ícone + valor + rótulo); o valor dá um "bump" quando muda. */
export function StatPill({
  label,
  value,
  icon,
  tone = 'gold',
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: IconName;
  tone?: 'gold' | 'indigo' | 'violet' | 'danger' | 'success' | 'neutral';
  className?: string;
}) {
  const color = useThemeColor(
    tone === 'gold' ? '--color-gold-ink' : tone === 'indigo' ? '--color-indigo-ink' : tone === 'violet' ? '--color-violet-ink' : tone === 'danger' ? '--color-danger' : tone === 'success' ? '--color-success' : '--color-ink-soft',
  );
  return (
    <Pop>
      <View className={cx('min-h-[56px] flex-row items-center gap-2.5 rounded-2xl border border-line bg-surface-2 px-3.5 py-2', className)}>
        {icon && <Icon name={icon} size={18} color={color} />}
        <View>
          <Bump trigger={typeof value === 'string' || typeof value === 'number' ? value : undefined}>
            <Text className="text-[17px] font-bold leading-6 text-ink" style={{ color }}>
              {value}
            </Text>
          </Bump>
          <Text className="text-[10px] font-bold uppercase tracking-[1.2px] text-ink-faint">{label}</Text>
        </View>
      </View>
    </Pop>
  );
}

/** Cabeçalho de seção animado: marcador dourado + título + ação opcional. */
export function SectionHeader({ title, icon, action, delay = 0 }: { title: string; icon?: IconName; action?: ReactNode; delay?: number }) {
  const gold = useThemeColor('--color-gold');
  return (
    <Reveal delay={delay} from="fade">
      <View className="flex-row items-center gap-2.5 pt-2">
        <View style={{ width: 3, height: 16, borderRadius: 2, backgroundColor: gold }} />
        {icon && <Icon name={icon} size={16} color={gold} />}
        <Text className="flex-1 font-display text-[15px] tracking-wide text-ink">{title}</Text>
        {action}
      </View>
    </Reveal>
  );
}

/** Esqueleto de carregamento: N linhas, ou um cartão com avatar. */
export function Skeleton({ lines = 3, height = 14, card, className }: { lines?: number; height?: number; card?: boolean; className?: string }) {
  return (
    <View className={cx('gap-2.5', card && 'rounded-[20px] border border-line bg-surface p-4', className)}>
      {card && <Shimmer style={{ height: 40, width: 40, borderRadius: 20 }} />}
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} style={{ height, width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </View>
  );
}

/** Lista de cartões-esqueleto para estados de carregamento. */
export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View className="gap-3 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} card lines={2} />
      ))}
    </View>
  );
}

/** Card clicável (lista → detalhe). */
export function PressableCard({ className, children, ...props }: PressableProps & { className?: string; children: ReactNode }) {
  return (
    <PressScale scaleTo={0.975} className={cx('rounded-[20px] border border-line bg-surface p-4 shadow-md shadow-black/25', className)} {...props}>
      {children}
    </PressScale>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON: Record<ButtonVariant, { box: string; text: string }> = {
  primary: { box: 'bg-gold shadow-sm shadow-black/30', text: 'text-on-gold' },
  secondary: { box: 'bg-surface-2 border border-line-strong', text: 'text-ink' },
  ghost: { box: 'bg-transparent', text: 'text-gold-ink' },
  danger: { box: 'bg-danger/15 border border-danger/40', text: 'text-danger' },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading,
  disabled,
  icon,
  className,
}: {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  className?: string;
}) {
  const v = BUTTON[variant];
  const onGold = useThemeColor('--color-on-gold');
  const off = disabled || loading;
  return (
    <PressScale
      accessibilityRole="button"
      onPress={onPress}
      disabled={off}
      scaleTo={0.95}
      className={cx('min-h-[48px] flex-row items-center justify-center gap-2 rounded-[14px] px-5', v.box, off && 'opacity-50', className)}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? onGold : undefined} />
      ) : (
        <>
          {icon && <Icon name={icon} size={18} color={variant === 'primary' ? onGold : undefined} />}
          <Text className={cx('text-[15px] font-bold tracking-wide', v.text)}>{title}</Text>
        </>
      )}
    </PressScale>
  );
}

export function Input({ className, ...props }: TextInputProps) {
  const placeholder = useThemeColor('--color-ink-faint');
  return (
    <TextInput
      placeholderTextColor={placeholder}
      className={cx('h-12 rounded-[14px] border border-line-strong bg-surface-2 px-4 text-[16px] text-ink focus:border-gold', className)}
      {...props}
    />
  );
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar…', className }: { value: string; onChangeText: (v: string) => void; placeholder?: string; className?: string }) {
  const faint = useThemeColor('--color-ink-faint');
  return (
    <View className={cx('h-12 flex-row items-center gap-2 rounded-[14px] border border-line-strong bg-surface-2 px-3.5', className)}>
      <Icon name="search" size={18} color={faint} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={faint}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        className="h-full flex-1 text-[16px] text-ink"
      />
    </View>
  );
}

const BADGE_TONES = {
  neutral: 'bg-surface-2 border-line text-ink-soft',
  indigo: 'bg-indigo/15 border-indigo/30 text-indigo-ink',
  violet: 'bg-violet/15 border-violet/30 text-violet-ink',
  gold: 'bg-gold/15 border-gold/40 text-gold-ink',
  danger: 'bg-danger/15 border-danger/30 text-danger',
  success: 'bg-success/15 border-success/30 text-success',
} as const;

export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  const [bg, border, text] = BADGE_TONES[tone].split(' ');
  return (
    <View className={cx('self-start rounded-full border px-2.5 py-1', bg, border, className)}>
      <Text className={cx('text-[11px] font-semibold', text)}>{children}</Text>
    </View>
  );
}

/** Chip de filtro selecionável. */
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.92}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      className={cx(
        'min-h-[44px] justify-center rounded-full border px-4',
        selected ? 'border-gold bg-gold/15' : 'border-line-strong bg-surface',
      )}
    >
      <Text className={cx('text-[13px] font-semibold', selected ? 'text-gold-ink' : 'text-ink-soft')}>{label}</Text>
    </PressScale>
  );
}

/** Divisor com fade nas pontas (dourado discreto). */
export function Divider({ className }: { className?: string }) {
  const line = useThemeColor('--color-line-strong');
  return (
    <LinearGradient
      colors={[withAlpha(line, 0), line, withAlpha(line, 0)]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: 1 }}
      className={className}
    />
  );
}

export function Loading({ label }: { label?: string }) {
  const color = useThemeColor('--color-gold');
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-canvas p-8">
      <Pulse min={0.5} scale={1.12} duration={1100}>
        <View className="h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
          <Icon name="dice" size={30} color={color} />
        </View>
      </Pulse>
      {!!label && <Muted>{label}</Muted>}
    </View>
  );
}

export function EmptyState({ icon = 'sparkles-outline', title, message, action }: { icon?: IconName; title: string; message?: string; action?: ReactNode }) {
  const gold = useThemeColor('--color-gold-ink');
  return (
    <View className="items-center justify-center gap-2 px-8 py-16">
      <Pop>
        <Pulse min={0.75} scale={1.05} duration={2200}>
          <View className="mb-2 h-24 w-24 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <View className="h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/15">
              <Icon name={icon} size={32} color={gold} />
            </View>
          </View>
        </Pulse>
      </Pop>
      <Reveal delay={120}>
        <Text className="text-center font-display text-xl text-ink">{title}</Text>
      </Reveal>
      {!!message && (
        <Reveal delay={200}>
          <Muted className="text-center text-sm leading-5">{message}</Muted>
        </Reveal>
      )}
      {action && (
        <Reveal delay={300} style={{ marginTop: 16 }}>
          {action}
        </Reveal>
      )}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="Algo deu errado"
      message={message}
      action={onRetry && <Button title="Tentar de novo" variant="secondary" onPress={onRetry} />}
    />
  );
}

/** Linha "rótulo: valor" usada em detalhes. */
export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View className="flex-row items-start justify-between gap-4 py-1.5">
      <Muted className="text-sm">{label}</Muted>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text className="flex-1 text-right text-sm font-medium text-ink">{value}</Text>
      ) : (
        value
      )}
    </View>
  );
}

export function Section({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <View className={cx('gap-2', className)}>
      <Label>{title}</Label>
      {children}
    </View>
  );
}

export { cx };
