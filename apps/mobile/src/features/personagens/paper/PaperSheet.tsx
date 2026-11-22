// Ficha de papel (somente visualização): porte de apps/web/components/sheet/PaperSheet.tsx.
// Desenha o modelo impresso (612x792 pt) e escreve os dados por cima; 1 pt = largura / 612.
import { useState, type ReactNode } from 'react';
import { Image, Pressable, ScrollView, Text, useWindowDimensions, View, type TextStyle } from 'react-native';
import { ABILITIES, abilityModifier, getBackground, getClass, getRace, getSpell, type Spell } from '@repo/rules';

import type { Character } from '@/lib/api';
import { derivedStats, getSheet, scoreOf } from '../sheet';
import { attackDetail, equipmentDetail, featureDetail, languageDetail, saveDetail, skillDetail, spellDetail, zoneDetail, type Detail, type FeatureItem } from './items';
import { ZoneSheet } from './ZoneSheet';
import { ZONES, type Rect, type Zone, type ZoneCtx } from './zones';

const INK = '#141f73';
const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const mid = (y: number, size: number) => y + size * 0.35;
const PAGES = { 1: require('../../../../assets/sheet/ficha-p1.png'), 2: require('../../../../assets/sheet/ficha-p2.png') };

/** Linha tocável sobre um item específico (perícia, magia, ataque…). */
function Row({ s, r, show, label, onPress }: { s: number; r: Rect; show: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute', left: r.x * s, top: r.y * s, width: r.w * s, height: r.h * s, borderRadius: 3 * s,
        borderWidth: show || pressed ? 1 : 0, borderStyle: 'dotted', borderColor: 'rgba(99,102,241,0.55)',
        backgroundColor: pressed ? 'rgba(99,102,241,0.25)' : show ? 'rgba(99,102,241,0.06)' : 'transparent',
      })}
    />
  );
}

/** Lista de itens (um por linha, mesmo visual do texto impresso) em que cada item é tocável. */
function ItemList({ s, x, y, size, w, h, lineHeight, items, show, onItem }: {
  s: number; x: number; y: number; size: number; w: number; h: number; lineHeight: number; items: string[]; show: boolean; onItem: (i: number) => void;
}) {
  return (
    <View style={{ position: 'absolute', left: x * s, top: (y - size * 0.8) * s, width: w * s, height: h * s, overflow: 'hidden' }}>
      {items.map((label, i) => (
        <Pressable
          key={i}
          accessibilityRole="button"
          accessibilityLabel={`Ver explicação: ${label}`}
          onPress={() => onItem(i)}
          style={({ pressed }) => ({
            borderRadius: 2 * s,
            backgroundColor: pressed ? 'rgba(99,102,241,0.28)' : show ? (i % 2 === 0 ? 'rgba(99,102,241,0.13)' : 'rgba(99,102,241,0.05)') : 'transparent',
          })}
        >
          <Text style={{ fontSize: size * s, lineHeight: size * s * lineHeight, color: INK, fontStyle: 'italic' }}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const SKILL_ORDER = [
  'acrobacia', 'arcanismo', 'atletismo', 'atuacao', 'enganacao', 'furtividade', 'historia', 'intimidacao', 'intuicao',
  'investigacao', 'adestrarAnimais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia',
];

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

/** Texto posicionado: (x, y) é a linha de base; size em pt. */
function T({ s, x, y, size = 9, align = 'l', w, h, lineHeight = 1.15, children }: {
  s: number; x: number; y: number; size?: number; align?: 'l' | 'c'; w?: number; h?: number; lineHeight?: number; children: ReactNode;
}) {
  const boxW = w ?? 200;
  const style: TextStyle = {
    position: 'absolute', top: (y - size * 0.8) * s, fontSize: size * s, lineHeight: size * s * lineHeight,
    color: INK, fontStyle: 'italic',
    ...(align === 'c'
      ? { left: (x - boxW / 2) * s, width: boxW * s, textAlign: 'center' }
      : { left: x * s, ...(w ? { width: w * s } : {}) }),
    ...(h ? { height: h * s } : {}),
  };
  return <Text style={style} numberOfLines={w ? undefined : 1}>{children}</Text>;
}

function Dot({ s, x, y, expert }: { s: number; x: number; y: number; expert?: boolean }) {
  const r = 3.6;
  return (
    <View
      style={{
        position: 'absolute', left: (x - r) * s, top: (y - r) * s, width: r * 2 * s, height: r * 2 * s,
        borderRadius: r * s, backgroundColor: INK,
        ...(expert ? { borderWidth: 1 * s, borderColor: '#fff', outlineColor: INK } : {}),
      }}
    />
  );
}

function Page({ n, width, children }: { n: 1 | 2; width: number; children: ReactNode }) {
  return (
    <View style={{ width, height: (width * 792) / 612, backgroundColor: '#fff', overflow: 'hidden' }}>
      <Image source={PAGES[n]} style={{ position: 'absolute', width, height: (width * 792) / 612 }} resizeMode="stretch" />
      {children}
    </View>
  );
}

/** Camada de áreas tocáveis: cada retângulo abre o popup explicativo da zona. */
function Zones({ page, s, show, onZone }: { page: 1 | 2; s: number; show: boolean; onZone: (z: Zone) => void }) {
  return (
    <>
      {ZONES.filter((z) => z.page === page).map((z) => (
        <Pressable
          key={z.id}
          accessibilityRole="button"
          accessibilityLabel={`Ver explicação: ${z.title}`}
          onPress={() => onZone(z)}
          style={({ pressed }) => ({
            position: 'absolute', left: z.r.x * s, top: z.r.y * s, width: z.r.w * s, height: z.r.h * s, borderRadius: 4 * s,
            borderWidth: show || pressed ? 1.5 : 0, borderStyle: 'dashed', borderColor: '#6366f1',
            backgroundColor: pressed ? 'rgba(99,102,241,0.22)' : show ? 'rgba(99,102,241,0.07)' : 'transparent',
          })}
        />
      ))}
    </>
  );
}

export function PaperSheet({ c }: { c: Character }) {
  const { width: screenW } = useWindowDimensions();
  const [zoom, setZoom] = useState(1);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [showAreas, setShowAreas] = useState(true);
  const base = screenW - 32;
  const W = base * zoom;
  const s = W / 612;

  const sheet = getSheet(c);
  const d = derivedStats(c);
  const cls = getClass(sheet.classId);
  const race = getRace(sheet.raceId);
  const subrace = race?.subraces.find((x) => x.id === sheet.subraceId);
  const sub = cls?.subclasses.find((x) => x.id === sheet.subclassId);
  const bg = getBackground(sheet.backgroundId);
  const raceLabel = race ? `${race.name}${subrace ? ` (${subrace.name})` : ''}` : c.race;
  const classLabel = `${cls?.name ?? c.class} ${c.level}`;

  const equipment = c.equipment ?? [];
  const attacks = equipment.filter((e) => (e.attack ?? 0) !== 0).map((e) => ({
    name: e.name, bonus: sign(e.attack!), damage: (c.abilities ?? []).find((a) => a.name === e.name)?.damage ?? '',
  }));
  const equipItems = [
    ...equipment.map((e) => ({ label: `${e.quantity && e.quantity > 1 ? `${e.quantity} ` : ''}${e.name}`, quantity: e.quantity, equipped: e.equipped })),
    ...(c.inventory ?? []).map((it) => ({ label: `${it.quantity > 1 ? `${it.quantity} ` : ''}${it.name}`, quantity: it.quantity, equipped: undefined as boolean | undefined })),
  ].filter((l) => l.label.trim());
  const equipLines = equipItems.map((e) => e.label);
  const featureItems: FeatureItem[] = [
    ...(cls?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, source: `Classe · ${cls?.name}`, level: f.level })),
    ...(sub?.features ?? []).filter((f) => f.level <= c.level).map((f) => ({ name: f.name, description: f.description, source: `Subclasse · ${sub?.name}`, level: f.level })),
    ...(race?.traits ?? []).map((t) => ({ name: t.name, description: t.description, source: `Raça · ${race?.name}` })),
    ...(subrace?.traits ?? []).map((t) => ({ name: t.name, description: t.description, source: `Sub-raça · ${subrace?.name}` })),
    ...(bg ? [{ name: bg.feature.name, description: bg.feature.description, source: `Antecedente · ${bg.name}` }] : []),
    ...sheet.chosenFeatures.filter((f) => f.trim()).map((f) => ({ name: f, description: '', source: 'Escolha do personagem' })),
    ...(Array.isArray(c.features) ? c.features : [])
      .filter((f) => f && typeof f === 'object' && 'name' in f)
      .map((f: { name: string; description?: string }) => ({ name: f.name, description: f.description ?? '', source: 'Característica adicional' })),
  ];
  const features = featureItems.map((f) => f.name);

  const sx = sheet as Record<string, any>;
  const languages = [...((sx.languages as string[]) ?? []), ...((sx.toolProficiencies as string[]) ?? [])].filter((l) => l.trim());
  const cm: number[] | null = Array.isArray(sx.cm) && sx.cm.length ? sx.cm : null;
  const cmTotal = cm ? cm.reduce((a, b) => a + b, 0) : null;
  const coinsData = (sx.coins ?? {}) as Record<string, number | undefined>;
  const deathSaves = (sx.deathSaves ?? { successes: 0, failures: 0 }) as { successes: number; failures: number };
  const hitDiceUsed = Number(sx.hitDiceUsed) || 0;
  const slotsUsed = sheet.spellSlotsUsed;

  const known = Array.from(new Set([...sheet.spellsKnown, ...sheet.spellsPrepared]));
  const byLevel: Record<number, { name: string; prepared: boolean; spell: Spell }[]> = {};
  for (const sid of known) {
    const sp = getSpell(sid);
    if (!sp) continue;
    (byLevel[sp.level] ??= []).push({ name: sp.name, prepared: sheet.spellsPrepared.includes(sid), spell: sp });
  }
  const coins: [number, number | undefined][] = [[607.5, coinsData.cp], [633.5, coinsData.sp], [659.6, coinsData.gp], [685, coinsData.pp]];
  const casterLabel = d.spell ? `${cls?.name ?? c.class}${sub && !cls?.spellcasting ? ` (${sub.name})` : ''}` : '';

  const ctx: ZoneCtx = {
    name: c.name, classLabel, raceLabel, background: bg?.name ?? c.background ?? '', player: c.user?.username ?? '', alignment: c.alignment ?? '',
    xp: Number(c.experience) || 0, level: c.level, pb: d.pb, ac: c.armorClass, init: d.initiative, speed: `${String(d.speed).replace('.', ',')} m`,
    hp: c.currentHitPoints, maxHp: c.maxHitPoints, tempHp: c.temporaryHitPoints,
    hitDice: `${c.level}d${cls?.hitDie ?? 8}${hitDiceUsed ? ` (${c.level - hitDiceUsed} restantes)` : ''}`,
    passive: d.passivePerception, inspiration: sx.inspiration === true, deathSaves,
    abilities: ABILITIES.map((a) => {
      const score = scoreOf(c, a.key);
      const sv = d.saves.find((v) => v.key === a.key);
      return { key: a.key, name: a.name, abbr: a.abbr, score, mod: abilityModifier(score), save: sv?.bonus ?? abilityModifier(score), saveProficient: !!sv?.proficient };
    }),
    skills: d.skills.map((k) => ({ key: k.key, name: (k as { name?: string }).name ?? k.key, bonus: k.bonus, proficient: !!k.proficient, expertise: !!k.expertise })),
    attacks, equipLines, languages, features, coins: coinsData, casterLabel, cm, cmTotal,
    slots: d.spell?.slots ?? [], slotsUsed, spellsByLevel: byLevel,
  };

  return (
    <View className="gap-3">
      <ZoneSheet detail={detail} onClose={() => setDetail(null)} />
      <View className="flex-row items-center justify-between gap-2">
        <Pressable
          accessibilityRole="button" accessibilityState={{ selected: showAreas }} onPress={() => setShowAreas((v) => !v)}
          className={`flex-row items-center gap-1.5 rounded-full border px-3 py-1 ${showAreas ? 'border-gold bg-gold/15' : 'border-line'}`}
        >
          <Text className={`text-xs ${showAreas ? 'text-gold-ink' : 'text-ink-soft'}`}>Destacar toques</Text>
        </Pressable>
        <View className="flex-row items-center gap-2">
        {[1, 1.5, 2].map((z) => (
          <Pressable
            key={z} accessibilityRole="button" accessibilityLabel={`Zoom ${z}x`} onPress={() => setZoom(z)}
            className={`rounded-full border px-3 py-1 ${zoom === z ? 'border-gold bg-gold' : 'border-line'}`}
          >
            <Text className={`text-xs ${zoom === z ? 'text-canvas' : 'text-ink-soft'}`}>{z}x</Text>
          </Pressable>
        ))}
        </View>
      </View>
      <Text className="text-center text-xs text-ink-faint">Toque em qualquer item (característica, magia, perícia, arma…) ou bloco da ficha para ver o que é e como funciona.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ gap: 16, flexDirection: 'column' }} nestedScrollEnabled>
        <Page n={1} width={W}>
          <T s={s} x={125} y={84} size={c.name.length > 22 ? 9 : 12} align="c">{c.name}</T>
          <T s={s} x={270} y={59.5}>{classLabel}</T>
          <T s={s} x={374.8} y={59.5}>{bg?.name ?? c.background ?? ''}</T>
          <T s={s} x={463.2} y={59.5}>{c.user?.username ?? ''}</T>
          <T s={s} x={270} y={86} size={raceLabel.length > 18 ? 7.5 : 9}>{raceLabel}</T>
          <T s={s} x={374.8} y={86}>{c.alignment ?? ''}</T>
          <T s={s} x={463.2} y={86}>{c.experience ? String(c.experience) : ''}</T>

          {sx.inspiration === true && <T s={s} x={108} y={mid(141, 14)} size={14} align="c">✦</T>}
          <T s={s} x={108} y={mid(177.5, 15)} size={15} align="c">{sign(d.pb)}</T>
          <T s={s} x={44} y={mid(599, 14)} size={14} align="c">{String(d.passivePerception)}</T>

          {ABILITIES.map((a, i) => (
            <View key={a.key}>
              <T s={s} x={57} y={mid(171 + 71.8 * i, 20)} size={20} align="c">{sign(abilityModifier(scoreOf(c, a.key)))}</T>
              <T s={s} x={57} y={mid(193.1 + 71.8 * i, 10)} size={10} align="c">{String(scoreOf(c, a.key))}</T>
            </View>
          ))}

          {d.saves.map((sv, i) => (
            <View key={sv.key}>
              <T s={s} x={120} y={215.4 + 13.5 * i - 1.8} align="c">{sign(sv.bonus)}</T>
              {sv.proficient && <Dot s={s} x={104.35} y={211.3 + 13.5 * i} />}
            </View>
          ))}

          {SKILL_ORDER.map((key, i) => {
            const sk = d.skills.find((k) => k.key === key);
            if (!sk) return null;
            return (
              <View key={key}>
                <T s={s} x={119} y={330.6 + 13.5 * i - 1.8} align="c">{sign(sk.bonus)}</T>
                {(sk.proficient || sk.expertise) && <Dot s={s} x={104.35} y={326.55 + 13.5 * i} expert={sk.expertise} />}
              </View>
            );
          })}

          <T s={s} x={239.5} y={mid(157, 16)} size={16} align="c">{String(c.armorClass)}</T>
          {cmTotal !== null && <T s={s} x={282} y={mid(160, 16)} size={16} align="c">{String(cmTotal)}</T>}
          <T s={s} x={325.5} y={mid(156, 16)} size={16} align="c">{sign(d.initiative)}</T>
          <T s={s} x={370.5} y={mid(157, 11)} size={11} align="c">{`${String(d.speed).replace('.', ',')} m`}</T>
          <T s={s} x={335} y={204} size={12} align="c">{`${c.currentHitPoints} / ${c.maxHitPoints}`}</T>
          {c.temporaryHitPoints > 0 && <T s={s} x={305} y={mid(277, 14)} size={14} align="c">{String(c.temporaryHitPoints)}</T>}
          <T s={s} x={271} y={326.5} size={10} align="c">{`${c.level}d${(getClass(sheet.classId)?.hitDie ?? 8)}${hitDiceUsed ? ` (${c.level - hitDiceUsed})` : ''}`}</T>
          {[0, 1, 2].map((k) => (
            <View key={k}>
              {k < deathSaves.successes && <Dot s={s} x={350 + 12.7 * k} y={326.8} />}
              {k < deathSaves.failures && <Dot s={s} x={350 + 12.7 * k} y={342.3} />}
            </View>
          ))}

          {attacks.slice(0, 9).map((a, i) => {
            const mY = 392 + 20.5 * i + 8;
            return (
              <View key={i}>
                <T s={s} x={225} y={mY - 1} size={6.5} w={66} h={15}>{a.name}</T>
                <T s={s} x={306.5} y={mY + 2.8} size={8} align="c" w={30}>{a.bonus}</T>
                <T s={s} x={329} y={mY - 1} size={7} w={64} h={15}>{a.damage}</T>
              </View>
            );
          })}

          {coins.map(([y, v], i) => !!v && <T key={i} s={s} x={244} y={mid(y, 9)} size={9} align="c" w={44}>{String(v)}</T>)}

          <Zones page={1} s={s} show={showAreas} onZone={(z) => setDetail(zoneDetail(z, ctx))} />

          {d.saves.map((sv, i) => {
            const a = ctx.abilities.find((x) => x.key === sv.key);
            return a ? <Row key={sv.key} s={s} show={showAreas} label={`Ver explicação: teste de resistência de ${a.name}`} r={{ x: 96, y: 204.5 + 13.5 * i, w: 108, h: 13.5 }} onPress={() => setDetail(saveDetail(a, d.pb))} /> : null;
          })}
          {SKILL_ORDER.map((key, i) => (
            <Row key={key} s={s} show={showAreas} label={`Ver explicação: perícia ${key}`} r={{ x: 96, y: 320 + 13.5 * i, w: 108, h: 13.5 }} onPress={() => setDetail(skillDetail(key, ctx))} />
          ))}
          {attacks.slice(0, 9).map((a, i) => (
            <Row key={i} s={s} show={showAreas} label={`Ver explicação: ataque ${a.name}`} r={{ x: 218, y: 393 + 20.5 * i, w: 176, h: 19 }} onPress={() => setDetail(attackDetail(a))} />
          ))}
          <ItemList s={s} x={272} y={602 - 7 * 0.2} size={7} w={121} h={136} lineHeight={1.25} items={equipLines} show={showAreas}
            onItem={(i) => setDetail(equipmentDetail(equipItems[i]!.label, { quantity: equipItems[i]!.quantity, equipped: equipItems[i]!.equipped }))} />
          <ItemList s={s} x={36} y={634 - 8.5 * 0.2} size={8.5} w={164} h={110} lineHeight={1.4} items={languages} show={showAreas}
            onItem={(i) => setDetail(languageDetail(languages[i]!))} />
          <ItemList s={s} x={414} y={456 - 9 * 0.2} size={8} w={165} h={285} lineHeight={1.45} items={features} show={showAreas}
            onItem={(i) => setDetail(featureDetail(featureItems[i]!))} />
        </Page>

        <Page n={2} width={W}>
          {casterLabel !== '' && <T s={s} x={52} y={81} size={10}>{casterLabel}</T>}
          {cm && [311.5, 359, 407, 455, 503].map((x, i) => cm[i] !== undefined && <T key={i} s={s} x={x} y={80} size={13} align="c" w={40}>{String(cm[i])}</T>)}
          {cmTotal !== null && <T s={s} x={554} y={80} size={13} align="c" w={40}>{String(cmTotal)}</T>}

          {Object.entries(SPELL_LAYOUT).map(([lv, L]) => {
            const level = Number(lv);
            const spells = byLevel[level] ?? [];
            const total = level > 0 ? d.spell?.slots[level - 1] ?? 0 : 0;
            const used = slotsUsed[level - 1] ?? 0;
            return (
              <View key={lv}>
                {total > 0 && <T s={s} x={L.hx} y={mid(L.hy, 14)} size={14} align="c" w={40}>{String(total)}</T>}
                {total > 0 && used > 0 && <T s={s} x={L.hx + 78} y={mid(L.hy, 14)} size={14} align="c" w={40}>{String(used)}</T>}
                {spells.slice(0, L.n).map((sp, i) => (
                  <View key={i}>
                    <T s={s} x={L.x} y={L.y0 + 14 * i - 2} size={8.5}>{sp.name}</T>
                    {level > 0 && sp.prepared && <Dot s={s} x={L.x - 8.3} y={L.y0 + 14 * i - 4.5} />}
                  </View>
                ))}
              </View>
            );
          })}
          <Zones page={2} s={s} show={showAreas} onZone={(z) => setDetail(zoneDetail(z, ctx))} />
          {Object.entries(SPELL_LAYOUT).flatMap(([lv, L]) =>
            (byLevel[Number(lv)] ?? []).slice(0, L.n).map((sp, i) => (
              <Row key={`${lv}-${i}`} s={s} show={showAreas} label={`Ver explicação: magia ${sp.name}`} r={{ x: L.x - 10, y: L.y0 + 14 * i - 12, w: 168, h: 14 }}
                onPress={() => setDetail(spellDetail(sp.spell, sp.prepared, ctx))} />
            )),
          )}
        </Page>
      </ScrollView>
    </View>
  );
}
