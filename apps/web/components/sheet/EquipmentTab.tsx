'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ARMOR, WEAPONS } from '@repo/rules';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { getSheet } from '@/lib/sheet';
import type { Equipment, InventoryItem } from '@/lib/api';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls, selectCls } from './ui';
import { computeArmorClass } from './logic';
import { cn } from '@/lib/utils';

export default function EquipmentTab({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const reduce = useReducedMotion();
  const equipment: Equipment[] = c.equipment ?? [];
  const inventory: InventoryItem[] = c.inventory ?? [];
  const ac = computeArmorClass(c, sheet.classId);
  const [pick, setPick] = useState('');

  const setEq = (next: Equipment[]) => api.patch({ equipment: next });
  const setInv = (next: InventoryItem[]) => api.patch({ inventory: next });

  const addPicked = () => {
    if (!pick) return;
    const [kind, name] = [pick.slice(0, 1), pick.slice(2)];
    if (kind === 'a') setEq([...equipment, { name, defense: 0, attack: 0 }]);
    else {
      const w = WEAPONS.find((x) => x.name === name);
      setEq([...equipment, { name: w ? `${w.name} (${w.damage})` : name, defense: 0, attack: 0 }]);
    }
    setPick('');
  };

  return (
    <div className="space-y-4">
      <Panel title="Classe de Armadura" action={<span className="text-2xl font-bold text-[#e2e8f0] tabular-nums">{c.armorClass}</span>}>
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#94a3b8]">
          <Calculator className="h-4 w-4 text-[#6366f1]" />
          <span>Calculada: <strong className="text-[#e2e8f0]">{ac.total}</strong> <span className="text-[#64748b]">({ac.parts.join(' · ')})</span></span>
          <GhostButton className="ml-auto" disabled={ac.total === c.armorClass} onClick={() => api.patch({ armorClass: ac.total }, { immediate: true })}>
            Aplicar CA calculada
          </GhostButton>
        </div>
        <p className="mt-2 text-[11px] text-[#475569]">Itens com nome de armadura/escudo das regras usam a tabela oficial; os demais somam o valor de Defesa.</p>
      </Panel>

      <Panel title="Equipamento">
        <div className="mb-3 flex gap-2">
          <select value={pick} onChange={(e) => setPick(e.target.value)} className={selectCls} aria-label="Adicionar das regras">
            <option value="">Adicionar armadura ou arma das regras...</option>
            <optgroup label="Armaduras">{ARMOR.map((a) => <option key={a.name} value={`a:${a.name}`}>{a.name} ({a.ac})</option>)}</optgroup>
            <optgroup label="Armas">{WEAPONS.map((w) => <option key={w.name} value={`w:${w.name}`}>{w.name} ({w.damage})</option>)}</optgroup>
          </select>
          <GhostButton onClick={addPicked} disabled={!pick}><Plus className="h-3.5 w-3.5" />Adicionar</GhostButton>
        </div>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {equipment.map((it, i) => (
              <motion.div
                key={i} layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_64px_64px_32px] items-center gap-2"
              >
                <input className={inputCls} value={it.name} placeholder="Nome do item" onChange={(e) => setEq(equipment.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <input type="number" className={cn(inputCls, 'text-center')} title="Defesa" value={it.defense ?? 0} onChange={(e) => setEq(equipment.map((x, j) => (j === i ? { ...x, defense: Number(e.target.value) || 0 } : x)))} />
                <input type="number" className={cn(inputCls, 'text-center')} title="Ataque" value={it.attack ?? 0} onChange={(e) => setEq(equipment.map((x, j) => (j === i ? { ...x, attack: Number(e.target.value) || 0 } : x)))} />
                <button type="button" aria-label="Remover" onClick={() => setEq(equipment.filter((_, j) => j !== i))} className="text-[#475569] hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {equipment.length > 0 && <p className="grid grid-cols-[1fr_64px_64px_32px] gap-2 text-[10px] uppercase tracking-widest text-[#475569]"><span /><span className="text-center">Defesa</span><span className="text-center">Ataque</span><span /></p>}
        </div>
        <GhostButton className="mt-3 w-full border-dashed" onClick={() => setEq([...equipment, { name: '', defense: 0, attack: 0 }])}><Plus className="h-3.5 w-3.5" />Item de equipamento</GhostButton>
      </Panel>

      <Panel title="Inventário">
        <div className="space-y-2">
          {inventory.length > 0 && <p className="grid grid-cols-[1fr_72px_72px_32px] gap-2 text-[10px] uppercase tracking-widest text-[#475569]"><span>Item</span><span className="text-center">Qtd</span><span className="text-center">Máx</span><span /></p>}
          <AnimatePresence initial={false}>
            {inventory.map((it, i) => (
              <motion.div
                key={i} layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-[1fr_72px_72px_32px] items-center gap-2"
              >
                <input className={inputCls} value={it.name} placeholder="Nome do item" onChange={(e) => setInv(inventory.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <input type="number" min={0} className={cn(inputCls, 'text-center')} value={it.quantity} onChange={(e) => setInv(inventory.map((x, j) => (j === i ? { ...x, quantity: Math.max(0, Number(e.target.value) || 0) } : x)))} />
                <input type="number" min={0} className={cn(inputCls, 'text-center')} value={it.max} onChange={(e) => setInv(inventory.map((x, j) => (j === i ? { ...x, max: Math.max(0, Number(e.target.value) || 0) } : x)))} />
                <button type="button" aria-label="Remover" onClick={() => setInv(inventory.filter((_, j) => j !== i))} className="text-[#475569] hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <GhostButton className="mt-3 w-full border-dashed" onClick={() => setInv([...inventory, { name: '', quantity: 1, max: 1 }])}><Plus className="h-3.5 w-3.5" />Item de inventário</GhostButton>
      </Panel>
    </div>
  );
}
