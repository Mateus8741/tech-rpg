import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, serif } from "./theme";
import { Bg, Card, Title, fade, useIn } from "./ui";

/* 1 — Intro */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const p = useIn(0, 14);
  const t = useIn(25);
  const s = useIn(45);
  return (
    <Bg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 420,
            height: 420,
            borderRadius: 90,
            overflow: "hidden",
            transform: `scale(${0.4 + p * 0.6}) rotate(${(1 - p) * -180 + Math.sin(f / 25) * 3}deg)`,
            opacity: p,
            boxShadow: `0 0 ${80 + Math.sin(f / 15) * 30}px rgba(245,196,81,.45)`,
          }}
        >
          <Img src={staticFile("d20.png")} style={{ width: "100%", height: "100%" }} />
        </div>
        <div
          style={{
            fontFamily: serif,
            fontWeight: 800,
            fontSize: 140,
            marginTop: 40,
            color: C.gold,
            opacity: t,
            transform: `translateY(${(1 - t) * 40}px)`,
            letterSpacing: 4,
          }}
        >
          Fichas RPG
        </div>
        <div style={{ fontSize: 40, color: C.muted, opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>
          Sua mesa de D&D 5e, em português.
        </div>
      </AbsoluteFill>
    </Bg>
  );
};

/* 2 — Ficha */
const ABILITIES: [string, string, number][] = [
  ["Força", "FOR", 8],
  ["Destreza", "DES", 17],
  ["Constituição", "CON", 13],
  ["Inteligência", "INT", 12],
  ["Sabedoria", "SAB", 10],
  ["Carisma", "CAR", 14],
];
const mod = (v: number) => Math.floor((v - 10) / 2);

export const Sheet: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, 150], [1, 1.12]);
  return (
    <Bg>
      <div style={{ position: "absolute", left: 110, top: 120 }}>
        <Title kicker="Fichas completas" title="Tudo calculado" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 250px)", gap: 24, marginTop: 70 }}>
          {ABILITIES.map(([name, abbr, v], i) => {
            const p = useIn(20 + i * 8);
            const shown = Math.round(v * p);
            const m = mod(v);
            return (
              <Card key={abbr} style={{ textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, padding: 22 }}>
                <div style={{ color: C.muted, fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>{name.toUpperCase()}</div>
                <div style={{ fontFamily: serif, fontSize: 90, fontWeight: 800 }}>{shown}</div>
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 22px",
                    borderRadius: 999,
                    background: "rgba(245,196,81,.15)",
                    color: C.gold,
                    fontWeight: 700,
                    fontSize: 30,
                    opacity: fade(f, 60 + i * 8, 75 + i * 8),
                  }}
                >
                  {m >= 0 ? "+" : ""}
                  {m}
                </div>
              </Card>
            );
          })}
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: C.muted, opacity: fade(f, 100, 120) }}>
          Modificador = (valor − 10) ÷ 2 · PV, CA e proficiência automáticos
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 60,
          width: 700,
          height: 960,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,.6)",
          opacity: useIn(10),
        }}
      >
        <Img
          src={staticFile("ficha.png")}
          style={{ width: "100%", transform: `scale(${zoom})`, transformOrigin: "70% 35%" }}
        />
      </div>
    </Bg>
  );
};

/* 3 — Wizard */
const STEPS = [
  { t: "Raça", opts: ["Humano", "Elfo", "Anão", "Halfling", "Meio-Orc"], pick: 3 },
  { t: "Classe", opts: ["Bárbaro", "Bardo", "Ladino", "Mago", "Clérigo"], pick: 2 },
  { t: "Antecedente", opts: ["Acólito", "Criminoso", "Eremita", "Soldado", "Sábio"], pick: 1 },
];

export const Wizard: React.FC = () => {
  const f = useCurrentFrame();
  const stepLabels = ["Raça", "Classe", "Antecedente", "Atributos", "Magias"];
  const active = Math.min(4, Math.floor(f / 36));
  return (
    <Bg>
      <div style={{ position: "absolute", left: 110, top: 120, right: 110 }}>
        <Title kicker="Criação guiada" title="Do zero ao herói em minutos" />
        <div style={{ display: "flex", gap: 14, marginTop: 60 }}>
          {stepLabels.map((s, i) => (
            <div
              key={s}
              style={{
                flex: 1,
                padding: "16px 0",
                textAlign: "center",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 26,
                background: i <= active ? C.gold : C.card,
                color: i <= active ? "#2a1d00" : C.muted,
                border: `2px solid ${i <= active ? C.gold : C.border}`,
              }}
            >
              {i < active ? "✓ " : ""}
              {s}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 28, marginTop: 50 }}>
          {STEPS.map((st, si) => {
            const appear = useIn(18 + si * 14);
            return (
              <Card key={st.t} style={{ flex: 1, opacity: appear, transform: `translateY(${(1 - appear) * 40}px)` }}>
                <div style={{ fontFamily: serif, fontSize: 38, fontWeight: 800, color: C.gold, marginBottom: 18 }}>{st.t}</div>
                {st.opts.map((o, oi) => {
                  const picked = oi === st.pick && f > 36 * si + 24;
                  return (
                    <div
                      key={o}
                      style={{
                        padding: "14px 20px",
                        marginBottom: 10,
                        borderRadius: 12,
                        fontSize: 28,
                        background: picked ? "rgba(245,196,81,.18)" : "rgba(255,255,255,.04)",
                        border: `2px solid ${picked ? C.gold : "transparent"}`,
                        color: picked ? C.gold : C.text,
                        fontWeight: picked ? 700 : 400,
                      }}
                    >
                      {o}
                    </div>
                  );
                })}
              </Card>
            );
          })}
        </div>
      </div>
    </Bg>
  );
};

/* 4 — Compêndio e magias */
const SPELLS: [string, string, string, string][] = [
  ["Bola de Fogo", "3º círculo", "Evocação", "#ef4444"],
  ["Mísseis Mágicos", "1º círculo", "Evocação", "#ef4444"],
  ["Cura Ferimentos", "1º círculo", "Evocação", "#22c55e"],
  ["Invisibilidade", "2º círculo", "Ilusão", "#38bdf8"],
  ["Relâmpago", "3º círculo", "Evocação", "#facc15"],
  ["Detectar Magia", "1º círculo", "Adivinhação", "#a78bfa"],
];
const CHIPS = ["Raças", "Classes", "Antecedentes", "Equipamento", "Condições", "Regras"];

export const Compendium: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Bg>
      <div style={{ position: "absolute", left: 110, top: 110, right: 110 }}>
        <Title kicker="Compêndio · Magias · Regras" title="Tudo da 5e na ponta dos dedos" />
        <div style={{ display: "flex", gap: 14, marginTop: 36, opacity: fade(f, 15, 30) }}>
          {CHIPS.map((c) => (
            <div key={c} style={{ padding: "10px 24px", borderRadius: 999, border: `2px solid ${C.border}`, fontSize: 26, color: C.muted }}>
              {c}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26, marginTop: 50 }}>
          {SPELLS.map(([n, lvl, school, col], i) => {
            const p = useIn(25 + i * 9);
            return (
              <Card key={n} style={{ opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.95 + p * 0.05})`, borderLeft: `8px solid ${col}` }}>
                <div style={{ fontFamily: serif, fontSize: 42, fontWeight: 800 }}>{n}</div>
                <div style={{ marginTop: 10, fontSize: 28, color: C.muted }}>
                  {lvl} · {school}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Bg>
  );
};

/* 5 — Dados */
export const Dice: React.FC = () => {
  const f = useCurrentFrame();
  const rolling = f < 60;
  const value = rolling ? 1 + Math.floor(random(`r-${Math.floor(f / 2)}`) * 20) : 20;
  const settle = useIn(60, 12);
  const crit = f >= 60;
  return (
    <Bg>
      <div style={{ position: "absolute", left: 110, top: 120 }}>
        <Title kicker="Rolador de dados" title="Role com emoção" />
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: 120 }}>
        <div
          style={{
            width: 380,
            height: 380,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: serif,
            fontWeight: 800,
            fontSize: 190,
            color: crit ? "#2a1d00" : "#fff",
            clipPath: "polygon(50% 0, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
            background: `linear-gradient(160deg, ${crit ? "#fde7a0" : "#7a7fe8"}, ${crit ? C.goldDark : "#3a3d9a"})`,
            transform: `rotate(${rolling ? f * 24 : 0}deg) scale(${crit ? 1 + (1 - settle) * 0.4 + 0.1 : 1})`,
            filter: crit ? "drop-shadow(0 0 60px rgba(245,196,81,.8))" : "none",
          }}
        >
          <span style={{ transform: `rotate(${rolling ? -f * 24 : 0}deg)` }}>{value}</span>
        </div>
        <div style={{ fontFamily: serif, fontSize: 64, color: C.gold, marginTop: 30, opacity: crit ? settle : 0 }}>
          ✦ Acerto crítico! ✦
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 110, top: 240, display: "flex", flexDirection: "column", gap: 18, opacity: fade(f, 20, 40) }}>
        {["d4", "d6", "d8", "d10", "d12", "d20", "d100"].map((d) => (
          <div key={d} style={{ padding: "12px 34px", borderRadius: 14, border: `2px solid ${d === "d20" ? C.gold : C.border}`, color: d === "d20" ? C.gold : C.muted, fontSize: 34, fontWeight: 700, textAlign: "center" }}>
            {d}
          </div>
        ))}
      </div>
    </Bg>
  );
};

/* 6 — Jogador x Mestre */
export const Roles: React.FC = () => {
  const a = useIn(10);
  const b = useIn(28);
  const box = (p: number, icon: string, t: string, lines: string[]) => (
    <Card style={{ flex: 1, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, padding: 44 }}>
      <div style={{ fontSize: 80 }}>{icon}</div>
      <div style={{ fontFamily: serif, fontSize: 60, fontWeight: 800, color: C.gold, margin: "10px 0 24px" }}>{t}</div>
      {lines.map((l) => (
        <div key={l} style={{ fontSize: 32, marginBottom: 14, color: C.text }}>
          ✓ {l}
        </div>
      ))}
    </Card>
  );
  return (
    <Bg>
      <div style={{ position: "absolute", left: 110, top: 120, right: 110 }}>
        <Title kicker="Jogador & Mestre" title="Cada um no seu papel" />
        <div style={{ display: "flex", gap: 40, marginTop: 60 }}>
          {box(a, "🗡️", "Jogador", ["Cria suas fichas", "Edita e deleta as próprias", "Login só com o nome"])}
          {box(b, "🎲", "Mestre", ["Vê todas as fichas da mesa", "Edita qualquer personagem", "Controle total da campanha"])}
        </div>
      </div>
    </Bg>
  );
};

/* 7 — Plataformas + CTA */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const p = useIn(0, 14);
  const u = useIn(40);
  return (
    <Bg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 220, height: 220, borderRadius: 50, overflow: "hidden", transform: `scale(${p})`, boxShadow: "0 0 80px rgba(245,196,81,.4)" }}>
          <Img src={staticFile("d20.png")} style={{ width: "100%" }} />
        </div>
        <div style={{ fontFamily: serif, fontWeight: 800, fontSize: 96, color: C.gold, marginTop: 36, opacity: p }}>Fichas RPG</div>
        <div style={{ display: "flex", gap: 24, marginTop: 30, opacity: fade(f, 20, 40) }}>
          {["Web", "iOS", "Android"].map((x) => (
            <div key={x} style={{ padding: "10px 32px", borderRadius: 999, border: `2px solid ${C.border}`, fontSize: 32, color: C.text }}>
              {x}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 50, fontSize: 48, color: C.text, opacity: u, transform: `translateY(${(1 - u) * 20}px)` }}>
          rpg.codewaveds.com.br
        </div>
      </AbsoluteFill>
    </Bg>
  );
};
