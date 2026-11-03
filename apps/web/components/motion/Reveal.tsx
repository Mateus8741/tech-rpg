'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Atraso em segundos. */
  delay?: number;
  /** Deslocamento vertical inicial em px. */
  y?: number;
  /** Anima só na primeira vez que entra na viewport (padrão true). */
  once?: boolean;
}

/** Entrada com fade/slide quando o elemento aparece ao rolar. */
export default function Reveal({ children, className, delay = 0, y = 16, once = true }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
