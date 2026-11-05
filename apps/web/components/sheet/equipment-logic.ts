import { ARMOR, GEAR, WEAPONS, abilityModifier, proficiencyBonus, type ArmorItem, type ClassDef, type Weapon } from '@repo/rules';
import type { Character, Equipment } from '@/lib/api';
import type { Coins } from '@/lib/sheet';

/* ---------- Busca nas tabelas de regras ---------- */

export const normName = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s*\(.*\)\s*$/, '').trim();

/** "6,5 kg" -> 6.5; "—" -> undefined. */
export function parseKg(s: string | undefined): number | undefined {
  if (!s) return undefined;
  const m = s.match(/(\d+(?:[.,]\d+)?)\s*kg/i);
  return m ? Number(m[1]!.replace(',', '.')) : undefined;
}

export type Lookup =
  | { kind: 'armor'; armor: ArmorItem; weight?: number }
  | { kind: 'weapon'; weapon: Weapon; weight?: number }
  | { kind: 'gear'; weight?: number };

export function lookupItem(name: string): Lookup | null {
  const n = normName(name);
  if (!n) return null;
  const armor = ARMOR.find((a) => normName(a.name) === n);
  if (armor) return { kind: 'armor', armor, weight: parseKg(armor.weight) };
  const weapon = WEAPONS.find((w) => normName(w.name) === n);
  if (weapon) return { kind: 'weapon', weapon, weight: parseKg(weapon.weight) };
  const gear = GEAR.find((g) => normName(g.name) === n);
  if (gear) return { kind: 'gear', weight: parseKg(gear.weight) };
  return null;
}

export const knownItemNames = (): string[] => [
  ...ARMOR.map((a) => a.name), ...WEAPONS.map((w) => w.name), ...GEAR.map((g) => g.name),
];

export const fmtKg = (n: number) => `${(Math.round(n * 100) / 100).toLocaleString('pt-BR')} kg`;

/* ---------- Equipar ---------- */

const isBody = (it: Equipment) => {
  const l = lookupItem(it.name);
  return l?.kind === 'armor' && l.armor.category !== 'Escudo';
};
const isShield = (it: Equipment) => {
  const l = lookupItem(it.name);
  return l?.kind === 'armor' && l.armor.category === 'Escudo';
};

/**
 * Dados antigos não têm o campo `equipped`: se nenhum item o define, tudo conta como equipado.
 * Assim a CA calculada de fichas existentes não muda até o jogador usar os botões de equipar.
 */
export function isEquipped(items: Equipment[], it: Equipment): boolean {
  if (it.equipped !== undefined) return it.equipped;
  return items.every((x) => x.equipped === undefined);
}

/** Alterna `equipped` do item i; só uma armadura de corpo e um escudo por vez. */
export function toggleEquipped(items: Equipment[], i: number): Equipment[] {
  const target = items[i];
  if (!target) return items;
  const on = !isEquipped(items, target);
  return items.map((x, j) => {
    const cur = isEquipped(items, x);
    if (j === i) return { ...x, equipped: on };
    if (on && ((isBody(target) && isBody(x)) || (isShield(target) && isShield(x)))) return { ...x, equipped: false };
    return { ...x, equipped: cur };
  });
}

/* ---------- Peso ---------- */

export const carryCapacity = (str: number) => str * 7.5;
/** Regra variante (kg): sobrecarregado > For x 2,5; muito sobrecarregado > For x 5. */
export function encumbrance(total: number, str: number): { label: string; tone: 'ok' | 'warn' | 'bad' } {
  if (total > str * 5) return { label: 'Muito sobrecarregado (−6 m de deslocamento; desvantagem em testes, ataques e salvaguardas de For/Des/Con)', tone: 'bad' };
  if (total > str * 2.5) return { label: 'Sobrecarregado (−3 m de deslocamento)', tone: 'warn' };
  return { label: 'Carga normal', tone: 'ok' };
}

/** 50 moedas = 0,5 kg. */
export const coinWeight = (c: Coins) => (c.pp + c.gp + c.ep + c.sp + c.cp) / 100;

export function itemsWeight(items: { weight?: number; quantity?: number }[]) {
  return items.reduce((s, it) => s + (it.weight ?? 0) * (it.quantity ?? 1), 0);
}

/* ---------- Moedas ---------- */

export type CoinKey = keyof Coins;
export const COIN_ORDER: CoinKey[] = ['pp', 'gp', 'ep', 'sp', 'cp'];
export const COIN_LABEL: Record<CoinKey, string> = { pp: 'PL', gp: 'PO', ep: 'PE', sp: 'PP', cp: 'PC' };
export const COIN_NAME: Record<CoinKey, string> = { pp: 'Platina', gp: 'Ouro', ep: 'Electro', sp: 'Prata', cp: 'Cobre' };
const CP: Record<CoinKey, number> = { pp: 1000, gp: 100, ep: 50, sp: 10, cp: 1 };

export const totalInGold = (c: Coins) => COIN_ORDER.reduce((s, k) => s + c[k] * CP[k], 0) / 100;

/** Troca `amount` moedas de `from` pelo máximo possível de `to`. */
export function exchangeCoins(c: Coins, from: CoinKey, to: CoinKey, amount: number): { coins: Coins; got: number; spent: number } | null {
  if (from === to) return null;
  const amt = Math.min(Math.max(0, Math.floor(amount)), c[from]);
  const got = Math.floor((amt * CP[from]) / CP[to]);
  const spent = Math.ceil((got * CP[to]) / CP[from]);
  if (got <= 0) return null;
  return { coins: { ...c, [from]: c[from] - spent, [to]: c[to] + got }, got, spent };
}

/* ---------- Proficiência e requisitos ---------- */

const singular = (s: string) => normName(s).split(/\s+/).map((w) => (w.length > 3 ? w.replace(/s$/, '') : w)).join(' ');

export function armorProficient(cls: ClassDef | undefined, a: ArmorItem): boolean {
  if (!cls) return true;
  const p = cls.armorProficiencies.map(normName).join(' | ');
  if (/todas as armaduras/.test(p)) return true;
  if (a.category === 'Escudo') return /escudo/.test(p);
  const key = a.category === 'Leve' ? 'leve' : a.category === 'Média' ? 'media' : 'pesada';
  return p.includes(key);
}

export function weaponProficient(cls: ClassDef | undefined, w: Weapon): boolean {
  if (!cls) return true;
  const list = cls.weaponProficiencies.map(normName);
  const cat = w.category === 'Simples' ? 'simples' : 'marciais';
  if (list.some((p) => (p.includes('armas') || p.includes('todas')) && (p.includes(cat) || (cat === 'marciais' && p.includes('marcial'))))) return true;
  const name = singular(w.name);
  return list.some((p) => singular(p) === name);
}

/* ---------- Ataques ---------- */

export interface AttackInfo {
  name: string;
  attackBonus: number;
  /** Expressão rolável (ex.: "1d8+3") ou null quando a arma não é da tabela. */
  damageExpr: string | null;
  damageLabel: string;
  proficient: boolean;
  ability: 'For' | 'Des' | null;
  properties: string[];
}

export function weaponAttack(c: Character, cls: ClassDef | undefined, it: Equipment): AttackInfo | null {
  const l = lookupItem(it.name);
  const magic = it.attack ?? 0;
  if (l?.kind !== 'weapon') {
    if (!magic) return null;
    return { name: it.name || 'Ataque', attackBonus: magic, damageExpr: null, damageLabel: '', proficient: false, ability: null, properties: [] };
  }
  const w = l.weapon;
  const str = abilityModifier(c.strength), dex = abilityModifier(c.dexterity);
  const finesse = w.properties.includes('Acuidade');
  const ability: 'For' | 'Des' = w.kind === 'À distância' ? 'Des' : finesse && dex > str ? 'Des' : 'For';
  const mod = ability === 'Des' ? dex : str;
  const proficient = weaponProficient(cls, w);
  const dm = w.damage.match(/^(\d*d\d+|\d+)\s*(.*)$/);
  const dice = dm?.[1];
  const bonus = mod + magic;
  const damageExpr = dice && /d/.test(dice) ? `${dice}${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ''}` : null;
  return {
    name: w.name,
    attackBonus: mod + (proficient ? proficiencyBonus(c.level) : 0) + magic,
    damageExpr,
    damageLabel: dm?.[2] ?? '',
    proficient,
    ability,
    properties: w.properties,
  };
}

/** Dobra os dados (crítico) mantendo o bônus fixo. */
export function critExpr(expr: string): string {
  return expr.replace(/^(\d*)d/, (_, n) => `${(Number(n || 1)) * 2}d`);
}

/* ---------- Avisos do equipamento em uso ---------- */

export function equipWarnings(c: Character, cls: ClassDef | undefined, items: Equipment[]): string[] {
  const out: string[] = [];
  for (const it of items) {
    if (!isEquipped(items, it)) continue;
    const l = lookupItem(it.name);
    if (l?.kind === 'armor') {
      if (!armorProficient(cls, l.armor)) out.push(`Sem proficiência com ${l.armor.name}: desvantagem em testes/ataques/salvaguardas de For e Des e não pode conjurar.`);
      if (l.armor.strengthReq && c.strength < l.armor.strengthReq) out.push(`${l.armor.name} exige For ${l.armor.strengthReq}: −3 m de deslocamento.`);
      if (l.armor.stealthDisadvantage) out.push(`${l.armor.name}: desvantagem em Furtividade.`);
    } else if (l?.kind === 'weapon' && !weaponProficient(cls, l.weapon)) {
      out.push(`Sem proficiência com ${l.weapon.name}: sem bônus de proficiência no ataque.`);
    }
  }
  return out;
}
