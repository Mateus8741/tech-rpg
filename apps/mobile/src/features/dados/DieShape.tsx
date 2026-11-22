import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { DieSides } from './dice';

/*
 * Dados desenhados só com Views (sem SVG): d4 triângulo, d6 quadrado, d8 losango, d10 pipa,
 * d12 "squircle", d20 hexágono, d100 pipa dupla. Contorno colorido + miolo escuro, como uma
 * gema/dado entalhado. O conteúdo (número) fica centralizado.
 */

type Kind = 'tri' | 'square' | 'diamond' | 'kite' | 'round' | 'hex';

const KIND: Record<number, Kind> = { 4: 'tri', 6: 'square', 8: 'diamond', 10: 'kite', 12: 'round', 20: 'hex', 100: 'kite' };

/** Cor de destaque de cada dado (d20 usa o dourado do tema, passado por quem chama). */
export const DIE_TINT: Record<number, string> = {
  4: '#ef5350',
  6: '#6366f1',
  8: '#8b5cf6',
  10: '#14b8a6',
  12: '#f08a3c',
  20: '',
  100: '#ec6aa8',
};

export const kindOf = (sides: number): Kind => KIND[sides] ?? 'hex';

function Poly({ kind, s, color }: { kind: Kind; s: number; color: string }) {
  const abs = { position: 'absolute' as const, alignSelf: 'center' as const };
  switch (kind) {
    case 'tri': {
      const h = s * 0.88;
      return (
        <View
          style={{
            ...abs,
            top: (s - h) / 2 + s * 0.02,
            width: 0,
            height: 0,
            borderLeftWidth: s / 2,
            borderRightWidth: s / 2,
            borderBottomWidth: h,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: color,
          }}
        />
      );
    }
    case 'square':
      return <View style={{ ...abs, top: s * 0.1, width: s * 0.8, height: s * 0.8, borderRadius: s * 0.14, backgroundColor: color }} />;
    case 'diamond':
      return <View style={{ ...abs, top: s * 0.19, width: s * 0.62, height: s * 0.62, borderRadius: s * 0.06, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />;
    case 'kite':
      return (
        <View
          style={{ ...abs, top: s * 0.25, width: s * 0.5, height: s * 0.5, borderRadius: s * 0.05, backgroundColor: color, transform: [{ scaleY: 1.3 }, { rotate: '45deg' }] }}
        />
      );
    case 'round':
      return <View style={{ ...abs, top: s * 0.08, width: s * 0.84, height: s * 0.84, borderRadius: s * 0.34, backgroundColor: color, transform: [{ rotate: '15deg' }] }} />;
    case 'hex': {
      const w = s * 0.94;
      const h = w * 0.5774;
      const top = (s - h) / 2;
      const r = { ...abs, top, width: w, height: h, borderRadius: s * 0.03, backgroundColor: color };
      return (
        <>
          <View style={r} />
          <View style={{ ...r, transform: [{ rotate: '60deg' }] }} />
          <View style={{ ...r, transform: [{ rotate: '120deg' }] }} />
        </>
      );
    }
  }
}

export function DieShape({
  sides,
  size = 56,
  tint,
  fill,
  active,
  children,
}: {
  sides: number;
  size?: number;
  tint: string;
  /** Cor do miolo. */
  fill: string;
  /** Preenche o miolo com a cor de destaque (selecionado / crítico). */
  active?: boolean;
  children?: ReactNode;
}) {
  const kind = kindOf(sides);
  const inner = size * 0.84;
  const off = (size - inner) / 2;
  const tri = kind === 'tri';
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Poly kind={kind} s={size} color={tint} />
      <View style={{ position: 'absolute', left: off, top: off, width: inner, height: inner }}>
        <Poly kind={kind} s={inner} color={fill} />
        {active && (
          <View style={{ position: 'absolute', width: inner, height: inner, opacity: 0.35 }}>
            <Poly kind={kind} s={inner} color={tint} />
          </View>
        )}
      </View>
      <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', top: tri ? size * 0.3 : 0, bottom: 0, left: 0, right: 0 }} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

export type { DieSides };
