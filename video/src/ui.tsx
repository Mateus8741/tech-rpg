import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, sans, serif } from "./theme";

export const Bg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const x = 50 + Math.sin(f / 90) * 12;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% 40%, #23204a 0%, ${C.bg} 62%)`,
        fontFamily: sans,
        color: C.text,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const useIn = (delay = 0, damping = 200) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping } });
};

export const Title: React.FC<{ kicker: string; title: string; delay?: number }> = ({ kicker, title, delay = 0 }) => {
  const p = useIn(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ color: C.gold, letterSpacing: 6, fontSize: 26, fontWeight: 700, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ fontFamily: serif, fontWeight: 800, fontSize: 84, marginTop: 8 }}>{title}</div>
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      background: C.card,
      border: `2px solid ${C.border}`,
      borderRadius: 24,
      padding: 28,
      boxShadow: "0 20px 60px rgba(0,0,0,.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const fade = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
