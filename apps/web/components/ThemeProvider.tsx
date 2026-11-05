'use client';

import { MotionConfig } from 'framer-motion';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Provedor de tema (claro/escuro/sistema) e preferência de movimento:
 * MotionConfig reducedMotion="user" desliga animações de transform/layout do framer-motion
 * para quem ativou prefers-reduced-motion (cobre também componentes sem useReducedMotion).
 */
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
