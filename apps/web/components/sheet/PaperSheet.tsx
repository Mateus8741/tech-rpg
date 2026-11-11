'use client';

// Ficha de papel: desenha o modelo impresso (public/sheet/ficha-p1.png e p2.png, 612x792 pt) e
// escreve por cima os dados do personagem. Posições em pontos (origem no topo esquerdo); o tamanho
// escala com a largura do container via unidades de container query (1pt = 100cqw / 612).
import type { ReactNode } from 'react';
type DivStyle = Record<string, string | number>;
import { ABILITIES, getBackground, getClass, getRace, getSpell, abilityModifier } from '@repo/rules';
import type { Character } from '@/lib/api';
import { derivedStats, getSheet, scoreOf } from '@/lib/sheet';
import type { PaperZone } from './PaperEditor';

const INK = '#141f73';
const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const pt = (n: number) => `calc(${n} * 100cqw / 612)`;

type Align = 'l' | 'c';

/** Texto posicionado: (x, y) é a linha de base (como na ficha); size em pt. */
function T({ x, y, size = 9, align = 'l', w, h, children, style }: {
  x: number; y: number; size?: number; align?: Align; w?: number; h?: number; children: ReactNode; style?: DivStyle;
}) {
  return (
    <div
      style={{
        position: 'absolute', top: pt(y - size * 0.8), fontSize: pt(size), lineHeight: 1.15, whiteSpace: w ? 'normal' : 'nowrap',
        ...(align === 'c' ? { left: pt(x), transform: 'translateX(-50%)', textAlign: 'center' } : { left: pt(x) }),
        ...(w ? { width: pt(w) } : {}), ...(h ? { height: pt(h), overflow: 'hidden' } : {}),
        ...style,
      }}
    >{children}</div>
  );
}

/** Bolinha preenchida (proficiente) ou com anel (especialização), centrada em (x, y). */
function Dot({ x, y, expert }: { x: number; y: number; expert?: boolean }) {
  const r = 3.6;
  return (
    <div style={{
      position: 'absolute', left: pt(x - r), top: pt(y - r), width: pt(r * 2), height: pt(r * 2), borderRadius: '50%',
      background: INK, ...(expert ? { boxShadow: `0 0 0 ${pt(1)} #fff, 0 0 0 ${pt(1.8)} ${INK}` } : {}),
    }} />
  );
}

type Rect = { x: number; y: number; w: number; h: number };
const ZONE_RECTS: { page: 1 | 2; zone: PaperZone; label: string; r: Rect }[] = [
  { page: 1, zone: 'ataques', label: 'Editar ataques', r: { x: 216, y: 382, w: 180, h: 197 } },
  { page: 1, zone: 'moedas', label: 'Editar moedas', r: { x: 217, y: 590, w: 48, h: 177 } },
  { page: 1, zone: 'equipamentos', label: 'Editar equipamentos', r: { x: 266, y: 590, w: 130, h: 177 } },
  { page: 1, zone: 'idiomas', label: 'Editar idiomas e proficiências', r: { x: 28, y: 623, w: 178, h: 144 } },
  { page: 1, zone: 'caracteristicas', label: 'Editar características', r: { x: 407, y: 437, w: 180, h: 330 } },
  { page: 1, zone: 'cm', label: 'Editar C.M', r: { x: 262, y: 117, w: 40, h: 46 } },
  { page: 2, zone: 'magias', label: 'Editar magias', r: { x: 24, y: 110, w: 565, h: 670 } },
  { page: 2, zone: 'cm', label: 'Editar C.M', r: { x: 295, y: 58, w: 285, h: 44 } },
];

function Zones({ page, active, onZone }: { page: 1 | 2; active?: PaperZone | null; onZone: (z: PaperZone) => void }) {
  return (
    <>
      {ZONE_RECTS.filter((z) => z.page === page).map((z) => (
        <button
          key={z.zone + z.page} type="button" aria-label={z.label} title={z.label} onClick={() => onZone(z.zone)}
          style={{ position: 'absolute', left: pt(z.r.x), top: pt(z.r.y), width: pt(z.r.w), height: pt(z.r.h), zIndex: z.zone === 'magias' ? 1 : 2, borderRadius: pt(4) }}
          className={`border-2 border-dashed transition-colors ${active === z.zone ? 'border-indigo-500 bg-indigo-500/10' : 'border-indigo-400/50 hover:border-indigo-500 hover:bg-indigo-500/10'}`}
        />
      ))}
    </>
  );
}

const mid = (y: number, size: number) => y + size * 0.35;

// Ordem das perícias na ficha → chave em @repo/rules
const SKILL_ORDER = [
  'acrobacia', 'arcanismo', 'atletismo', 'atuacao', 'enganacao', 'furtividade', 'historia', 'intimidacao', 'intuicao',
  'investigacao', 'adestrarAnimais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia',
];

// Linhas de magia por nível: [x do texto, primeira linha (y), quantidade, passo, x do cabeçalho, y do cabeçalho]
const SPELL_LAYOUT: Record<number, { x: number; y0: number; n: number; hx: number; hy: number }> = {
  0: { x: 35, y0: 184.6, n: 8, hx: 0, hy: 0 },
  1: { x: 44, y0: 369.6, n: 12, hx: 72, hy: 328 },
  2: { x: 44, y0: 582.2, n: 13, hx: 72, hy: 552 },
  3: { x: 230, y0: 185.9, n: 13, hx: 261, hy: 156 },
  4: { x: 230, y0: 411.5, n: 13, hx: 261, hy: 381.6 },
  5: { x: 230, y0: 638, n: 9, hx: 261, hy: 608.6 },
  6: { x: 416, y0: 185.9, n: 9, hx: 449, hy: 156 },
  7: { x: 416, y0: 355.6, n: 9, hx: 449, hy: 326 },
  8: { x: 416, y0: 525.4, n: 7, hx: 449, hy: 495.6 },
  9: { x: 416, y0: 666.2, n: 7, hx: 449, hy: 636 },
};

function Page({ n, children }: { n: 1 | 2; children: ReactNode }) {
  return (
    <div
      className="paper-page"
      style={{
        position: 'relative', width: '100%', aspectRatio: '612 / 792', containerType: 'inline-size', color: INK,
        fontFamily: 'Helvetica, Arial, sans-serif', fontStyle: 'italic', background: `#fff url(/sheet/ficha-p${n}.png) center / 100% 100% no-repeat`,
      }}
    >{children}</div>
  );
}

export default function PaperSheet({ character: c, editing = false, zone, onZone }: { character: Character; editing?: boolean; zone?: PaperZone | null; onZone?: (z: PaperZone) => void }) {
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const cls = getClass(sheet.classId);
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  const bg = getBackground(sheet.backgroundId);
  const raceLabel = race ? `${race.name}${subrace ? ` (${subrace.name})` : ''}` : c.race;
  const classLabel = `${cls?.name ?? c.class} ${c.level}`;

  // Ataques: equipamento com bônus de ataque + dano vindo das habilidades de mesmo nome
  const equipment = c.equipment ?? [];
  const attacks = equipment.filter((e) => (e.attack ?? 0) !== 0).map((e) => ({
    name: e.name, bonus: sign(e.attack!), damage: (c.abilities ?? []).find((a) => a.name === e.name)?.damage ?? '',
  }));
  const equipLines = [
    ...equipment.map((e) => `${e.quantity && e.quantity > 1 ? `${e.quantity} ` : ''}${e.name}`),
    ...(c.inventory ?? []).map((it) => `${it.quantity > 1 ? `${it.quantity} ` : ''}${it.name}`),
  ].filter((l) => l.trim());
  const features = [
    ...(cls?.features ?? []).filter((f) => f.level <= c.level).map((f) => f.name),
    ...(sub?.features ?? []).filter((f) => f.level <= c.level).map((f) => f.name),
    ...(race?.traits ?? []).map((t) => t.name),
    ...(subrace?.traits ?? []).map((t) => t.name),
    ...(bg ? [bg.feature.name] : []),
    ...sheet.chosenFeatures.filter((f) => f.trim()),
    ...(Array.isArray(c.features) ? c.features : []).filter((f) => f && typeof f === 'object' && 'name' in f).map((f: { name: string }) => f.name),
  ];
  const languages = [...sheet.languages, ...sheet.toolProficiencies].filter((l) => l.trim());
  const cm = sheet.cm?.length ? sheet.cm : null;
  const cmTotal = cm ? cm.reduce((a, b) => a + b, 0) : null;

  const known = Array.from(new Set([...sheet.spellsKnown, ...sheet.spellsPrepared]));
  const byLevel: Record<number, { name: string; prepared: boolean }[]> = {};
  for (const sid of known) {
    const s = getSpell(sid);
    if (!s) continue;
    (byLevel[s.level] ??= []).push({ name: s.name, prepared: sheet.spellsPrepared.includes(sid) });
  }
  const coins: [number, number | undefined][] = [[607.5, sheet.coins.cp], [633.5, sheet.coins.sp], [659.6, sheet.coins.gp], [685, sheet.coins.pp]];
  const casterLabel = d.spell ? `${cls?.name ?? c.class}${sub && !cls?.spellcasting ? ` (${sub.name})` : ''}` : '';

  return (
    <div className="space-y-4">
      <Page n={1}>
        {/* Cabeçalho */}
        <T x={125} y={84} size={c.name.length > 22 ? 9 : 12} align="c">{c.name}</T>
        <T x={270} y={59.5}>{classLabel}</T>
        <T x={374.8} y={59.5}>{bg?.name ?? c.background ?? ''}</T>
        <T x={463.2} y={59.5}>{c.user?.username ?? ''}</T>
        <T x={270} y={86} size={raceLabel.length > 18 ? 7.5 : 9}>{raceLabel}</T>
        <T x={374.8} y={86}>{c.alignment ?? ''}</T>
        <T x={463.2} y={86}>{c.experience ? c.experience : ''}</T>

        {/* Inspiração, proficiência, passiva */}
        {sheet.inspiration && <T x={108} y={mid(141, 14)} size={14} align="c">✦</T>}
        <T x={108} y={mid(177.5, 15)} size={15} align="c">{sign(d.pb)}</T>
        <T x={44} y={mid(599, 14)} size={14} align="c">{d.passivePerception}</T>

        {/* Atributos */}
        {ABILITIES.map((a, i) => (
          <div key={a.key}>
            <T x={57} y={mid(171 + 71.8 * i, 20)} size={20} align="c">{sign(abilityModifier(scoreOf(c, a.key)))}</T>
            <T x={57} y={mid(193.1 + 71.8 * i, 10)} size={10} align="c">{scoreOf(c, a.key)}</T>
          </div>
        ))}

        {/* Salvaguardas */}
        {d.saves.map((s, i) => (
          <div key={s.key}>
            <T x={120} y={215.4 + 13.5 * i - 1.8} align="c">{sign(s.bonus)}</T>
            {s.proficient && <Dot x={104.35} y={211.3 + 13.5 * i} />}
          </div>
        ))}

        {/* Perícias */}
        {SKILL_ORDER.map((key, i) => {
          const s = d.skills.find((k) => k.key === key);
          if (!s) return null;
          return (
            <div key={key}>
              <T x={119} y={330.6 + 13.5 * i - 1.8} align="c">{sign(s.bonus)}</T>
              {(s.proficient || s.expertise) && <Dot x={104.35} y={326.55 + 13.5 * i} expert={s.expertise} />}
            </div>
          );
        })}

        {/* Combate */}
        <T x={239.5} y={mid(157, 16)} size={16} align="c">{c.armorClass}</T>
        {cmTotal !== null && <T x={282} y={mid(160, 16)} size={16} align="c">{cmTotal}</T>}
        <T x={325.5} y={mid(156, 16)} size={16} align="c">{sign(d.initiative)}</T>
        <T x={370.5} y={mid(157, 11)} size={11} align="c">{String(d.speed).replace('.', ',')} m</T>
        <T x={335} y={204} size={12} align="c">{c.currentHitPoints} / {c.maxHitPoints}</T>
        {c.temporaryHitPoints > 0 && <T x={305} y={mid(277, 14)} size={14} align="c">{c.temporaryHitPoints}</T>}
        <T x={271} y={326.5} size={10} align="c">{c.level}d{d.hitDie}{sheet.hitDiceUsed ? ` (${c.level - sheet.hitDiceUsed})` : ''}</T>
        {[0, 1, 2].map((k) => (
          <div key={k}>
            {k < sheet.deathSaves.successes && <Dot x={350 + 12.7 * k} y={326.8} />}
            {k < sheet.deathSaves.failures && <Dot x={350 + 12.7 * k} y={342.3} />}
          </div>
        ))}

        {/* Ataques */}
        {attacks.slice(0, 9).map((a, i) => {
          const mY = 392 + 20.5 * i + 8;
          return (
            <div key={i}>
              <T x={225} y={mY - 1} size={6.5} w={66} h={15}>{a.name}</T>
              <T x={306.5} y={mY + 2.8} size={8} align="c">{a.bonus}</T>
              <T x={329} y={mY - 1} size={7} w={64} h={15}>{a.damage}</T>
            </div>
          );
        })}

        {/* Moedas (PC, PP, PO, PL) */}
        {coins.map(([y, v], i) => !!v && <T key={i} x={244} y={mid(y, 9)} size={9} align="c">{v}</T>)}

        {/* Equipamentos */}
        <T x={272} y={602 - 7 * 0.2} size={7} w={121} h={136} style={{ lineHeight: 1.25 }}>
          {equipLines.map((l, i) => <div key={i} style={{ paddingLeft: pt(8), textIndent: pt(-8) }}>{l}</div>)}
        </T>

        {/* Idiomas e proficiências */}
        <T x={36} y={634 - 8.5 * 0.2} size={8.5} w={164} h={110} style={{ lineHeight: 1.4 }}>
          {languages.map((l, i) => <div key={i}>{l}</div>)}
        </T>

        {/* Características e habilidades */}
        <T x={414} y={456 - 9 * 0.2} size={8} w={165} h={285} style={{ lineHeight: 1.45 }}>
          {features.map((f, i) => <div key={i}>{f}</div>)}
        </T>
      {editing && onZone && <Zones page={1} active={zone} onZone={onZone} />}
      </Page>

      <Page n={2}>
        {casterLabel && <T x={52} y={81} size={10}>{casterLabel}</T>}
        {cm && [311.5, 359, 407, 455, 503].map((x, i) => cm[i] !== undefined && <T key={i} x={x} y={80} size={13} align="c">{cm[i]}</T>)}
        {cmTotal !== null && <T x={554} y={80} size={13} align="c">{cmTotal}</T>}

        {Object.entries(SPELL_LAYOUT).map(([lv, L]) => {
          const level = Number(lv);
          const spells = byLevel[level] ?? [];
          const total = level > 0 ? d.spell?.slots[level - 1] ?? 0 : 0;
          const used = sheet.spellSlotsUsed[level - 1] ?? 0;
          return (
            <div key={lv}>
              {total > 0 && <T x={L.hx} y={mid(L.hy, 14)} size={14} align="c">{total}</T>}
              {total > 0 && used > 0 && <T x={L.hx + 78} y={mid(L.hy, 14)} size={14} align="c">{used}</T>}
              {spells.slice(0, L.n).map((s, i) => (
                <div key={i}>
                  <T x={L.x} y={L.y0 + 14 * i - 2} size={8.5}>{s.name}</T>
                  {level > 0 && s.prepared && <Dot x={L.x - 8.3} y={L.y0 + 14 * i - 4.5} />}
                </div>
              ))}
            </div>
          );
        })}
        {editing && onZone && <Zones page={2} active={zone} onZone={onZone} />}
      </Page>
    </div>
  );
}
