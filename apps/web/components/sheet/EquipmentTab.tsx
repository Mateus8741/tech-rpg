'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ARMOR, WEAPONS, formatModifier, getClass, rollDice } from '@repo/rules';
import { Plus, Trash2, Calculator, Swords, Shield, AlertTriangle, Weight, Info } from 'lucide-react';
import { useEntry } from '@/components/entries';
import { itemRef } from '@/components/entries/resolve';
import { toast } from 'sonner';
import { getSheet } from '@/lib/sheet';
import type { Equipment, InventoryItem } from '@/lib/api';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls, selectCls, useRoll } from './ui';
import { computeArmorClass } from './logic';
import CoinsPanel from './CoinsPanel';
import {
  carryCapacity, coinWeight, critExpr, encumbrance, equipWarnings, fmtKg, isEquipped, itemsWeight,
  knownItemNames, lookupItem, toggleEquipped, weaponAttack,
} from './equipment-logic';
import { cn } from '@/lib/utils';

const EQ_GRID = 'grid grid-cols-[28px_minmax(120px,1fr)_52px_64px_52px_52px_28px_28px] items-center gap-2 min-w-[556px]';
const INV_GRID = 'grid grid-cols-[minmax(120px,1fr)_56px_56px_64px_28px_28px] items-center gap-2 min-w-[456px]';
const hint = 'text-[10px] uppercase tracking-widest text-ink-faint';
const numKg = (v: string) => Math.max(0, Number(v.replace(',', '.')) || 0);

export default function EquipmentTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const cls = getClass(sheet.classId);
  const reduce = useReducedMotion();
  const roll = useRoll();
  const openEntry = useEntry();
  const equipment: Equipment[] = c.equipment ?? [];
  const inventory: InventoryItem[] = c.inventory ?? [];
  const ac = computeArmorClass(c, sheet.classId);
  const [pick, setPick] = useState('');

  // Preferência (por ficha, só neste navegador): sincronizar CA ao equipar/desequipar.
  const syncKey = `rpg:acsync:${c.id}`;
  const [autoSync, setAutoSync] = useState(false);
  useEffect(() => {
    try { setAutoSync(localStorage.getItem(syncKey) === '1'); } catch { /* sem storage */ }
  }, [syncKey]);
  const toggleSync = (v: boolean) => {
    setAutoSync(v);
    try { localStorage.setItem(syncKey, v ? '1' : '0'); } catch { /* sem storage */ }
    if (v && ac.total !== c.armorClass) api.patch({ armorClass: ac.total }, { immediate: true });
  };

  const setEq = (next: Equipment[]) => api.patch({ equipment: next });
  const setInv = (next: InventoryItem[]) => api.patch({ inventory: next });
  const updEq = (i: number, p: Partial<Equipment>) => setEq(equipment.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const updInv = (i: number, p: Partial<InventoryItem>) => setInv(inventory.map((x, j) => (j === i ? { ...x, ...p } : x)));

  /** Ao digitar um nome que casa com a tabela, preenche o peso se ainda vazio. */
  const renameEq = (i: number, name: string) => {
    const w = equipment[i]?.weight === undefined ? lookupItem(name)?.weight : undefined;
    updEq(i, w !== undefined ? { name, weight: w } : { name });
  };
  const renameInv = (i: number, name: string) => {
    const w = inventory[i]?.weight === undefined ? lookupItem(name)?.weight : undefined;
    updInv(i, w !== undefined ? { name, weight: w } : { name });
  };

  const equip = (i: number) => {
    const next = toggleEquipped(equipment, i);
    if (autoSync) {
      const total = computeArmorClass({ ...c, equipment: next }, sheet.classId).total;
      api.patch({ equipment: next, armorClass: total }, { immediate: true });
    } else {
      setEq(next);
    }
  };

  const addPicked = () => {
    if (!pick) return;
    const name = pick.slice(2);
    setEq([...equipment, { name, defense: 0, attack: 0, weight: lookupItem(name)?.weight, quantity: 1, equipped: false }]);
    setPick('');
  };

  /* Peso total */
  const str = c.strength;
  const wEquip = itemsWeight(equipment);
  const wInv = itemsWeight(inventory);
  const wCoins = coinWeight(sheet.coins);
  const total = wEquip + wInv + wCoins;
  const cap = carryCapacity(str);
  const enc = encumbrance(total, str);
  const pct = Math.min(100, cap > 0 ? (total / cap) * 100 : 100);

  const warnings = equipWarnings(c, cls, equipment);
  const attacks = equipment
    .map((it, i) => ({ it, i, a: isEquipped(equipment, it) ? weaponAttack(c, cls, it) : null }))
    .filter((x) => x.a);

  const rollDamage = (label: string, expr: string, crit: boolean) => {
    const e = crit ? critExpr(expr) : expr;
    const r = rollDice(e);
    if (!r) return;
    toast(`${label}${crit ? ' (crítico)' : ''}: ${r.total}`, { description: `${e} → [${r.rolls.join(', ')}]${r.bonus ? ` ${formatModifier(r.bonus)}` : ''}`, duration: 5000 });
  };

  return (
    <div className="space-y-4">
      <datalist id="known-items">{knownItemNames().map((n) => <option key={n} value={n} />)}</datalist>

      <Panel title="Classe de Armadura" action={<span className="text-2xl font-bold text-ink tabular-nums">{c.armorClass}</span>}>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-ink-soft">
          <Calculator className="h-4 w-4 text-indigo-ink" />
          <span>Calculada: <strong className="text-ink">{ac.total}</strong> <span className="text-ink-muted">({ac.parts.join(' · ')})</span></span>
          <GhostButton className="ml-auto" disabled={ac.total === c.armorClass} onClick={() => api.patch({ armorClass: ac.total }, { immediate: true })}>
            Aplicar CA calculada
          </GhostButton>
        </div>
        <label className="mt-2 flex items-center gap-2 text-[12px] text-ink-soft">
          <input type="checkbox" checked={autoSync} onChange={(e) => toggleSync(e.target.checked)} className="accent-[#6366f1]" />
          Sincronizar a CA automaticamente ao equipar/desequipar
        </label>
        <p className="mt-1 text-[11px] text-ink-faint">Só itens equipados contam. Armadura/escudo com nome das regras usam a tabela oficial; os demais somam o valor de Defesa. Sem armadura: Defesa sem Armadura de bárbaro/monge.</p>
        {warnings.length > 0 && (
          <ul className="mt-2 space-y-1">
            {warnings.map((w) => (
              <li key={w} className="flex items-start gap-1.5 text-[12px] text-gold-ink"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{w}</li>
            ))}
          </ul>
        )}
      </Panel>

      {attacks.length > 0 && (
        <Panel title="Ataques">
          <div className="space-y-2">
            {attacks.map(({ it, i, a }) => a && (
              <div key={i} className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-base/60 px-3 py-2">
                <Swords className="h-4 w-4 text-indigo-ink" />
                <div className="min-w-[120px] flex-1">
                  <button type="button" aria-haspopup="dialog" onClick={() => openEntry(itemRef(it.name))} className="rounded text-sm font-medium text-ink underline decoration-dotted decoration-ink-faint underline-offset-2 outline-none hover:text-indigo-ink focus-visible:ring-2 focus-visible:ring-indigo/70">{a.name}</button>
                  <p className="text-[11px] text-ink-muted">
                    {a.ability ? `${a.ability}${a.proficient ? ' + prof.' : ' (sem prof.)'}` : 'bônus manual'}
                    {a.damageExpr ? ` · ${a.damageExpr} ${a.damageLabel}` : ''}
                    {a.properties.length ? ` · ${a.properties.join(', ')}` : ''}
                  </p>
                </div>
                <GhostButton onClick={(e) => roll(`Ataque: ${a.name}`, a.attackBonus, e)} title="Atacar (Shift: vantagem, Alt: desvantagem)">
                  Atacar <strong className="tabular-nums text-ink">{formatModifier(a.attackBonus)}</strong>
                </GhostButton>
                <GhostButton onClick={(e) => roll(`Ataque: ${a.name}`, a.attackBonus, { ...e, shiftKey: true, altKey: false })}>Vant.</GhostButton>
                <GhostButton onClick={(e) => roll(`Ataque: ${a.name}`, a.attackBonus, { ...e, shiftKey: false, altKey: true })}>Desv.</GhostButton>
                {a.damageExpr && (
                  <>
                    <GhostButton onClick={() => rollDamage(`Dano: ${a.name}`, a.damageExpr!, false)}>Dano</GhostButton>
                    <GhostButton onClick={() => rollDamage(`Dano: ${a.name}`, a.damageExpr!, true)}>Crítico</GhostButton>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-ink-faint">Bônus = mod. de For (ou Des para Acuidade/distância) + proficiência da classe + bônus de Ataque do item. O dano soma o mesmo modificador.</p>
        </Panel>
      )}

      <Panel
        title="Carga"
        action={<span className="inline-flex items-center gap-1.5 text-xs text-ink-soft"><Weight className="h-3.5 w-3.5" /><strong className="text-ink tabular-nums">{fmtKg(total)}</strong> / {fmtKg(cap)}</span>}
      >
        <div className="h-2 overflow-hidden rounded-full bg-surface-3">
          <div className={cn('h-full rounded-full transition-all', enc.tone === 'bad' ? 'bg-red-500' : enc.tone === 'warn' ? 'bg-[#f5c451]' : 'bg-[#6366f1]')} style={{ width: `${pct}%` }} />
        </div>
        <p className={cn('mt-2 text-[12px]', enc.tone === 'bad' ? 'text-red-400' : enc.tone === 'warn' ? 'text-gold-ink' : 'text-ink-soft')}>
          {enc.label}
        </p>
        <p className="mt-1 text-[11px] text-ink-faint">
          Equipamento {fmtKg(wEquip)} · Inventário {fmtKg(wInv)} · Moedas {fmtKg(wCoins)}. Capacidade = For × 7,5 kg; regra variante: sobrecarregado acima de For × 2,5 kg e muito sobrecarregado acima de For × 5 kg.
        </p>
      </Panel>

      <CoinsPanel api={api} />

      <Panel title="Equipamento">
        <div className="mb-3 flex gap-2">
          <select value={pick} onChange={(e) => setPick(e.target.value)} className={selectCls} aria-label="Adicionar das regras">
            <option value="">Adicionar armadura ou arma das regras...</option>
            <optgroup label="Armaduras">{ARMOR.map((a) => <option key={a.name} value={`a:${a.name}`}>{a.name} ({a.ac})</option>)}</optgroup>
            <optgroup label="Armas">{WEAPONS.map((w) => <option key={w.name} value={`w:${w.name}`}>{w.name} ({w.damage})</option>)}</optgroup>
          </select>
          <GhostButton onClick={addPicked} disabled={!pick}><Plus className="h-3.5 w-3.5" />Adicionar</GhostButton>
        </div>
        <div className="overflow-x-auto">
          <div className="space-y-2">
            {equipment.length > 0 && (
              <p className={cn(EQ_GRID, hint)}>
                <span title="Equipado"><Shield className="mx-auto h-3 w-3" /></span><span>Item</span>
                <span className="text-center">Qtd</span><span className="text-center">Peso kg</span>
                <span className="text-center">Defesa</span><span className="text-center">Ataque</span><span /><span />
              </p>
            )}
            <AnimatePresence initial={false}>
              {equipment.map((it, i) => (
                <motion.div
                  key={i} layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  className={EQ_GRID}
                >
                  <input type="checkbox" aria-label={`Equipar ${it.name || 'item'}`} title="Equipado" className="mx-auto h-4 w-4 accent-[#6366f1]" checked={isEquipped(equipment, it)} onChange={() => equip(i)} />
                  <input aria-label="Nome do item" className={inputCls} list="known-items" value={it.name} placeholder="Nome do item" onChange={(e) => renameEq(i, e.target.value)} />
                  <input type="number" min={0} className={cn(inputCls, 'text-center')} title="Quantidade" aria-label="Quantidade" value={it.quantity ?? 1} onChange={(e) => updEq(i, { quantity: Math.max(0, Number(e.target.value) || 0) })} />
                  <input type="number" min={0} step={0.1} className={cn(inputCls, 'text-center')} title="Peso por unidade (kg)" aria-label="Peso por unidade (kg)" value={it.weight ?? ''} placeholder="—" onChange={(e) => updEq(i, { weight: e.target.value === '' ? undefined : numKg(e.target.value) })} />
                  <input type="number" className={cn(inputCls, 'text-center')} title="Defesa (bônus fixo de CA)" aria-label="Defesa (bônus fixo de CA)" value={it.defense ?? 0} onChange={(e) => updEq(i, { defense: Number(e.target.value) || 0 })} />
                  <input type="number" className={cn(inputCls, 'text-center')} title="Ataque (bônus mágico/manual)" aria-label="Ataque (bônus mágico/manual)" value={it.attack ?? 0} onChange={(e) => updEq(i, { attack: Number(e.target.value) || 0 })} />
                  <button type="button" aria-label={`Detalhes de ${it.name || 'item'}`} aria-haspopup="dialog" disabled={!it.name.trim()} onClick={() => openEntry(itemRef(it.name))} className="text-ink-faint hover:text-indigo-ink disabled:opacity-30 disabled:hover:text-ink-faint"><Info className="h-4 w-4" /></button>
                  <button type="button" aria-label="Remover" onClick={() => setEq(equipment.filter((_, j) => j !== i))} className="text-ink-faint hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <GhostButton className="mt-3 w-full border-dashed" onClick={() => setEq([...equipment, { name: '', defense: 0, attack: 0, quantity: 1, equipped: false }])}><Plus className="h-3.5 w-3.5" />Item de equipamento</GhostButton>
      </Panel>

      <Panel title="Inventário" action={<span className="text-xs text-ink-muted">{fmtKg(wInv)}</span>}>
        <div className="overflow-x-auto">
          <div className="space-y-2">
            {inventory.length > 0 && <p className={cn(INV_GRID, hint)}><span>Item</span><span className="text-center">Qtd</span><span className="text-center">Máx</span><span className="text-center">Peso kg</span><span /><span /></p>}
            <AnimatePresence initial={false}>
              {inventory.map((it, i) => (
                <motion.div
                  key={i} layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  className={INV_GRID}
                >
                  <input aria-label="Nome do item" className={inputCls} list="known-items" value={it.name} placeholder="Nome do item" onChange={(e) => renameInv(i, e.target.value)} />
                  <input type="number" aria-label="Quantidade" min={0} className={cn(inputCls, 'text-center')} value={it.quantity} onChange={(e) => updInv(i, { quantity: Math.max(0, Number(e.target.value) || 0) })} />
                  <input type="number" aria-label="Máximo" min={0} className={cn(inputCls, 'text-center')} value={it.max} onChange={(e) => updInv(i, { max: Math.max(0, Number(e.target.value) || 0) })} />
                  <input type="number" min={0} step={0.1} className={cn(inputCls, 'text-center')} title="Peso por unidade (kg)" aria-label="Peso por unidade (kg)" value={it.weight ?? ''} placeholder="—" onChange={(e) => updInv(i, { weight: e.target.value === '' ? undefined : numKg(e.target.value) })} />
                  <button type="button" aria-label={`Detalhes de ${it.name || 'item'}`} aria-haspopup="dialog" disabled={!it.name.trim()} onClick={() => openEntry(itemRef(it.name))} className="text-ink-faint hover:text-indigo-ink disabled:opacity-30 disabled:hover:text-ink-faint"><Info className="h-4 w-4" /></button>
                  <button type="button" aria-label="Remover" onClick={() => setInv(inventory.filter((_, j) => j !== i))} className="text-ink-faint hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <GhostButton className="mt-3 w-full border-dashed" onClick={() => setInv([...inventory, { name: '', quantity: 1, max: 1 }])}><Plus className="h-3.5 w-3.5" />Item de inventário</GhostButton>
        <p className="mt-2 text-[11px] text-ink-faint">O peso é por unidade e preenchido sozinho quando o nome casa com a tabela de equipamento; a carga usa a quantidade atual.</p>
      </Panel>
    </div>
  );
}
