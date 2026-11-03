'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Inclinação máxima em graus. */
  max?: number;
  /** Se true, só eleva (sem inclinar em 3D). */
  liftOnly?: boolean;
}

/** Card com hover-lift e inclinação 3D sutil seguindo o cursor. */
export default function Tilt({ children, className, max = 6, liftOnly = false }: TiltProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const tilt = !reduce && !liftOnly;

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={tilt ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onPointerMove={(e) => {
        if (!tilt || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
