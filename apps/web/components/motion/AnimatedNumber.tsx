'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  /** Duração em segundos. */
  duration?: number;
  /** Casas decimais. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Mostra sinal + para positivos (útil para modificadores). */
  signed?: boolean;
  className?: string;
}

/** Número com contagem animada até `value` (do valor anterior). */
export default function AnimatedNumber({
  value,
  duration = 0.8,
  decimals = 0,
  prefix = '',
  suffix = '',
  signed = false,
  className,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);
  const from = useRef(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => {
        from.current = v;
        setDisplay(v);
      },
    });
    return () => controls.stop();
  }, [value, duration, reduce]);

  const text = display.toFixed(decimals);
  const sign = signed && value > 0 ? '+' : '';
  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {sign}
      {text}
      {suffix}
    </span>
  );
}
