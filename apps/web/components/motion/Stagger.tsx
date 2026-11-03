'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

interface StaggerProps extends Omit<React.ComponentProps<'div'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  /** Intervalo entre filhos, em segundos. */
  gap?: number;
  /** Atraso inicial em segundos. */
  delay?: number;
  /** Anima ao entrar na viewport em vez de ao montar. */
  inView?: boolean;
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/** Container que revela os `StaggerItem` filhos em cascata. */
export function Stagger({ gap = 0.06, delay = 0, inView = false, children, ...rest }: StaggerProps) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: gap, delayChildren: delay } },
  };
  const anim = inView
    ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -40px 0px' } }
    : { animate: 'show' };
  return (
    <motion.div {...rest} variants={variants} initial={reduce ? false : 'hidden'} {...anim}>
      {children}
    </motion.div>
  );
}

type StaggerItemProps = Omit<React.ComponentProps<'div'>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'>;

export function StaggerItem({ children, ...rest }: StaggerItemProps) {
  return (
    <motion.div {...rest} variants={item}>
      {children}
    </motion.div>
  );
}
