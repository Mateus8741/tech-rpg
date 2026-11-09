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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';

/*
 * Kit de UI compartilhado do app mobile. Tudo estilizado com classes Tailwind (Uniwind)
 * usando os tokens de src/global.css: canvas, surface, surface-2, line, ink*, indigo, gold…
 */

export type IconName = ComponentProps<typeof Ionicons>['name'];

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
      {children}
    </SafeAreaView>
  );
}

export function ScrollScreen({ children, className, contentContainerClassName, ...rest }: ScrollViewProps & { children: ReactNode }) {
  return (
    <ScrollView
      className={cx('flex-1 bg-canvas', className)}
      contentContainerClassName={cx('p-4 gap-4 pb-10', contentContainerClassName)}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      {...rest}
    >
      {children}
    </ScrollView>
  );
}

export function Title({ className, ...props }: TextProps) {
  return <Text className={cx('font-display text-2xl text-gold-ink', className)} {...props} />;
}

export function Heading({ className, ...props }: TextProps) {
  return <Text className={cx('text-base font-semibold text-ink', className)} {...props} />;
}

export function Body({ className, ...props }: TextProps) {
  return <Text className={cx('text-sm leading-5 text-ink-body', className)} {...props} />;
}

export function Muted({ className, ...props }: TextProps) {
  return <Text className={cx('text-xs text-ink-muted', className)} {...props} />;
}

export function Label({ className, ...props }: TextProps) {
  return <Text className={cx('text-[11px] font-semibold uppercase tracking-wider text-ink-faint', className)} {...props} />;
}

export function Card({ className, ...props }: ViewProps) {
  return <View className={cx('rounded-2xl border border-line bg-surface p-4', className)} {...props} />;
}

/** Card clicável (lista → detalhe). */
export function PressableCard({ className, children, ...props }: PressableProps & { className?: string; children: ReactNode }) {
  return (
    <Pressable
      className={cx('rounded-2xl border border-line bg-surface p-4 active:opacity-70', className)}
      {...props}
    >
      {children}
    </Pressable>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON: Record<ButtonVariant, { box: string; text: string }> = {
  primary: { box: 'bg-indigo', text: 'text-white' },
  secondary: { box: 'bg-surface-2 border border-line-strong', text: 'text-ink' },
  ghost: { box: 'bg-transparent', text: 'text-indigo-ink' },
  danger: { box: 'bg-danger/15 border border-danger/30', text: 'text-danger' },
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
  const off = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={off}
      className={cx('h-12 flex-row items-center justify-center gap-2 rounded-xl px-4 active:opacity-80', v.box, off && 'opacity-50', className)}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : undefined} />
      ) : (
        <>
          {icon && <Icon name={icon} size={18} color={variant === 'primary' ? '#fff' : undefined} />}
          <Text className={cx('text-[15px] font-semibold', v.text)}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Input({ className, ...props }: TextInputProps) {
  const placeholder = useThemeColor('--color-ink-faint');
  return (
    <TextInput
      placeholderTextColor={placeholder}
      className={cx('h-12 rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-ink', className)}
      {...props}
    />
  );
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar…', className }: { value: string; onChangeText: (v: string) => void; placeholder?: string; className?: string }) {
  const faint = useThemeColor('--color-ink-faint');
  return (
    <View className={cx('h-11 flex-row items-center gap-2 rounded-xl border border-line bg-surface px-3', className)}>
      <Icon name="search" size={18} color={faint} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={faint}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        className="flex-1 text-[15px] text-ink"
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
    <View className={cx('self-start rounded-full border px-2.5 py-0.5', bg, border, className)}>
      <Text className={cx('text-[11px] font-semibold', text)}>{children}</Text>
    </View>
  );
}

/** Chip de filtro selecionável. */
export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={cx(
        'rounded-full border px-3 py-1.5 active:opacity-70',
        selected ? 'border-indigo bg-indigo/20' : 'border-line bg-surface',
      )}
    >
      <Text className={cx('text-xs font-semibold', selected ? 'text-indigo-ink' : 'text-ink-soft')}>{label}</Text>
    </Pressable>
  );
}

export function Divider({ className }: { className?: string }) {
  return <View className={cx('h-px bg-line', className)} />;
}

export function Loading({ label }: { label?: string }) {
  const color = useThemeColor('--color-gold');
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-canvas p-8">
      <ActivityIndicator color={color} />
      {!!label && <Muted>{label}</Muted>}
    </View>
  );
}

export function EmptyState({ icon = 'sparkles-outline', title, message, action }: { icon?: IconName; title: string; message?: string; action?: ReactNode }) {
  const faint = useThemeColor('--color-ink-faint');
  return (
    <View className="items-center justify-center gap-2 px-8 py-16">
      <Icon name={icon} size={40} color={faint} />
      <Heading className="text-center">{title}</Heading>
      {!!message && <Muted className="text-center text-sm">{message}</Muted>}
      {action && <View className="mt-3">{action}</View>}
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
