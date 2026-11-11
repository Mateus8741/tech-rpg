'use client';

// Editor da ficha de papel: adicionar, editar e apagar itens de cada caixa da ficha.
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { SPELLS, getSpell } from '@repo/rules';
import { derivedStats, getSheet, spellListClassId } from '@/lib/sheet';
import type { Ability, Equipment, InventoryItem } from '@/lib/api';
import type { CharacterApi } from './useCharacter';
import { GhostButton, inputCls, selectCls } from './ui';
import { cn } from '@/lib/utils';

export type PaperZone = 'ataques' | 'equipamentos' | 'idiomas' | 'caracteristicas' | 'magias' | 'moedas' | 'cm';

export const ZONES: { id: PaperZone; label: string }[] = [
  { id: 'ataques', label: 'Ataques' },
  { id: 'equipamentos', label: 'Equipamentos' },
  { id: 'idiomas', label: 'Idiomas e proficiências' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'magias', label: 'Magias' },
  { id: 'moedas', label: 'Moedas' },
  { id: 'cm', label: 'C.M' },
];

const numOr = (v: string, d = 0) => (Number.isFinite(Number(v.replace(',', '.'))) && v.trim() !== '' ? Number(v.replace(',', '.')) : d);
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex items-center gap-2">{children}</div>;
const Del = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-md p-1.5 text-ink-faint hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
);

/** Lista de textos (idiomas, características): editar, adicionar, apagar. */
function StringList({ items, onChange, placeholder, addLabel }: { items: string[]; onChange: (next: string[]) => void; placeholder: string; addLabel: string }) {
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-xs text-ink-muted">Nada aqui ainda.</p>}
      {items.map((it, i) => (
        <Row key={i}>
          <input className={inputCls} value={it} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
          <Del label={`Apagar ${it || 'item'}`} onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </Row>
      ))}
      <GhostButton onClick={() => onChange([...items, ''])}><Plus className="h-3.5 w-3.5" />{addLabel}</GhostButton>
    </div>
  );
}

function AttacksEditor({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const equipment: Equipment[] = c.equipment ?? [];
  const abilities: Ability[] = c.abilities ?? [];
  const rows = equipment.map((e, i) => ({ e, i })).filter(({ e }) => (e.attack ?? 0) !== 0);
  const dmg = (name: string) => abilities.find((a) => a.name === name)?.damage ?? '';

  const setDamage = (name: string, damage: string, oldName = name) => {
    const has = abilities.some((a) => a.name === oldName);
    const next = has ? abilities.map((a) => (a.name === oldName ? { ...a, name, damage } : a)) : [...abilities, { name, level: 0, cost: 0, damage }];
    return next;
  };
  const update = (i: number, p: { name?: string; attack?: number; damage?: string }) => {
    const e = equipment[i]!;
    const name = p.name ?? e.name;
    const nextEq = equipment.map((x, j) => (j === i ? { ...x, name, attack: p.attack ?? x.attack } : x));
    api.patch({ equipment: nextEq, abilities: setDamage(name, p.damage ?? dmg(e.name), e.name) });
  };
  const remove = (i: number) => {
    const e = equipment[i]!;
    api.patch({ equipment: equipment.map((x, j) => (j === i ? { ...x, attack: 0 } : x)), abilities: abilities.filter((a) => a.name !== e.name) });
  };
  const add = () => {
    let n = 'Novo ataque'; let k = 2;
    while (equipment.some((x) => x.name === n)) n = `Novo ataque ${k++}`;
    api.patch({ equipment: [...equipment, { name: n, attack: 1, defense: 0, quantity: 1, equipped: false }], abilities: [...abilities, { name: n, level: 0, cost: 0, damage: '1d6' }] });
  };
  // Itens do equipamento sem ataque podem virar ataque
  const candidates = equipment.map((e, i) => ({ e, i })).filter(({ e }) => (e.attack ?? 0) === 0 && (e.defense ?? 0) === 0);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_72px_1fr_32px] gap-2 text-[10px] uppercase tracking-widest text-ink-faint"><span>Nome</span><span>Bônus</span><span>Dano / tipo</span><span /></div>
      {rows.length === 0 && <p className="text-xs text-ink-muted">Nenhum ataque na ficha.</p>}
      {rows.map(({ e, i }) => (
        <div key={i} className="grid grid-cols-[1fr_72px_1fr_32px] items-center gap-2">
          <input className={inputCls} value={e.name} onChange={(ev) => update(i, { name: ev.target.value })} />
          <input className={inputCls} inputMode="numeric" value={e.attack ?? 0} onChange={(ev) => update(i, { attack: numOr(ev.target.value) })} />
          <input className={inputCls} value={dmg(e.name)} placeholder="1d6+3 perfurante" onChange={(ev) => update(i, { damage: ev.target.value })} />
          <Del label={`Tirar ${e.name} dos ataques`} onClick={() => remove(i)} />
        </div>
      ))}
      <Row>
        <GhostButton onClick={add}><Plus className="h-3.5 w-3.5" />Novo ataque</GhostButton>
        {candidates.length > 0 && (
          <select className={cn(selectCls, 'max-w-[240px]')} value="" onChange={(ev) => { if (ev.target.value !== '') update(Number(ev.target.value), { attack: 1 }); }}>
            <option value="">Transformar item em ataque…</option>
            {candidates.map(({ e, i }) => <option key={i} value={i}>{e.name}</option>)}
          </select>
        )}
      </Row>
      <p className="text-[11px] text-ink-faint">“Tirar” só remove da lista de ataques; o item continua no equipamento.</p>
    </div>
  );
}

function ItemsEditor({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const equipment: Equipment[] = c.equipment ?? [];
  const inventory: InventoryItem[] = c.inventory ?? [];
  const updEq = (i: number, p: Partial<Equipment>) => api.patch({ equipment: equipment.map((x, j) => (j === i ? { ...x, ...p } : x)) });
  const updInv = (i: number, p: Partial<InventoryItem>) => api.patch({ inventory: inventory.map((x, j) => (j === i ? { ...x, ...p } : x)) });
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_64px_32px] gap-2 text-[10px] uppercase tracking-widest text-ink-faint"><span>Item</span><span>Qtd.</span><span /></div>
      {equipment.map((e, i) => (
        <div key={`e${i}`} className="grid grid-cols-[1fr_64px_32px] items-center gap-2">
          <input className={inputCls} value={e.name} onChange={(ev) => updEq(i, { name: ev.target.value })} />
          <input className={inputCls} inputMode="numeric" value={e.quantity ?? 1} onChange={(ev) => updEq(i, { quantity: Math.max(0, numOr(ev.target.value, 1)) })} />
          <Del label={`Apagar ${e.name}`} onClick={() => api.patch({ equipment: equipment.filter((_, j) => j !== i) })} />
        </div>
      ))}
      {inventory.map((it, i) => (
        <div key={`i${i}`} className="grid grid-cols-[1fr_64px_32px] items-center gap-2">
          <input className={inputCls} value={it.name} onChange={(ev) => updInv(i, { name: ev.target.value })} />
          <input className={inputCls} inputMode="numeric" value={it.quantity} onChange={(ev) => { const q = Math.max(0, numOr(ev.target.value, 1)); updInv(i, { quantity: q, max: Math.max(it.max, q) }); }} />
          <Del label={`Apagar ${it.name}`} onClick={() => api.patch({ inventory: inventory.filter((_, j) => j !== i) })} />
        </div>
      ))}
      {equipment.length + inventory.length === 0 && <p className="text-xs text-ink-muted">Nenhum item.</p>}
      <GhostButton onClick={() => api.patch({ inventory: [...inventory, { name: '', quantity: 1, max: 1 }] })}><Plus className="h-3.5 w-3.5" />Novo item</GhostButton>
    </div>
  );
}

function SpellsEditor({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const maxLevel = d.spell ? d.spell.slots.filter((n) => n > 0).length : 0;
  const listId = spellListClassId(sheet);
  const known = Array.from(new Set([...sheet.spellsKnown, ...sheet.spellsPrepared]));
  const [lv, setLv] = useState(0);
  const remove = (id: string) => api.patchSheet({ spellsKnown: sheet.spellsKnown.filter((x) => x !== id), spellsPrepared: sheet.spellsPrepared.filter((x) => x !== id), spellsFavorite: sheet.spellsFavorite.filter((x) => x !== id) });
  const add = (id: string) => { if (id && !sheet.spellsKnown.includes(id)) api.patchSheet({ spellsKnown: [...sheet.spellsKnown, id] }); };
  const togglePrepared = (id: string) => api.patchSheet({ spellsPrepared: sheet.spellsPrepared.includes(id) ? sheet.spellsPrepared.filter((x) => x !== id) : [...sheet.spellsPrepared, id] });
  const setUsed = (level: number, v: number) => { const used = [...sheet.spellSlotsUsed]; while (used.length < level) used.push(0); used[level - 1] = v; api.patchSheet({ spellSlotsUsed: used }, { immediate: true }); };
  if (!d.spell) return <p className="text-xs text-ink-muted">Este personagem não conjura magias.</p>;
  const options = SPELLS.filter((s) => s.level === lv && s.classes.includes(listId) && !known.includes(s.id)).sort((a, b) => a.name.localeCompare(b.name, 'pt'));
  return (
    <div className="space-y-4">
      {Array.from({ length: maxLevel + 1 }, (_, level) => {
        const list = known.map((id) => getSpell(id)).filter((s): s is NonNullable<typeof s> => !!s && s.level === level);
        const total = level > 0 ? d.spell!.slots[level - 1] ?? 0 : 0;
        return (
          <div key={level}>
            <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-ink-muted">
              <span>{level === 0 ? 'Truques' : `Nível ${level}`}</span>
              {total > 0 && (
                <span className="flex items-center gap-1.5 normal-case tracking-normal">
                  Espaços usados
                  <input className={cn(inputCls, 'w-14 py-0.5')} inputMode="numeric" value={sheet.spellSlotsUsed[level - 1] ?? 0} onChange={(e) => setUsed(level, Math.min(total, Math.max(0, numOr(e.target.value))))} />
                  / {total}
                </span>
              )}
            </div>
            {list.length === 0 && <p className="text-xs text-ink-faint">Nenhuma.</p>}
            {list.map((s) => (
              <Row key={s.id}>
                <span className="flex-1 py-1 text-sm text-ink">{s.name}</span>
                {level > 0 && (
                  <label className="flex items-center gap-1 text-xs text-ink-muted"><input type="checkbox" checked={sheet.spellsPrepared.includes(s.id)} onChange={() => togglePrepared(s.id)} />preparada</label>
                )}
                <Del label={`Apagar ${s.name}`} onClick={() => remove(s.id)} />
              </Row>
            ))}
          </div>
        );
      })}
      <Row>
        <select className={cn(selectCls, 'w-28')} value={lv} onChange={(e) => setLv(Number(e.target.value))} aria-label="Nível da magia a adicionar">
          {Array.from({ length: maxLevel + 1 }, (_, l) => <option key={l} value={l}>{l === 0 ? 'Truque' : `Nível ${l}`}</option>)}
        </select>
        <select className={selectCls} value="" onChange={(e) => add(e.target.value)} aria-label="Adicionar magia">
          <option value="">Adicionar magia…</option>
          {options.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </Row>
    </div>
  );
}

export default function PaperEditor({ api, zone, onZone }: { api: CharacterApi; zone: PaperZone; onZone: (z: PaperZone) => void }) {
  const sheet = getSheet(api.character!);
  const cm = sheet.cm ?? [];
  const setCm = (next: number[]) => api.patchSheet({ cm: next.length ? next : undefined });
  const coinLabels: [keyof typeof sheet.coins, string][] = [['cp', 'Cobre (PC)'], ['sp', 'Prata (PP)'], ['ep', 'Electro (PE)'], ['gp', 'Ouro (PO)'], ['pp', 'Platina (PL)']];
  return (
    <section className="rounded-lg border border-line bg-surface p-3 sm:p-4" aria-label="Editar ficha de papel">
      <div role="tablist" aria-label="Caixa da ficha" className="mb-3 flex flex-wrap gap-1.5">
        {ZONES.map((z) => (
          <button key={z.id} role="tab" aria-selected={zone === z.id} type="button" onClick={() => onZone(z.id)}
            className={cn('rounded-md border px-2.5 py-1 text-xs transition-colors', zone === z.id ? 'border-[#6366f1]/60 bg-[#6366f1]/15 text-ink' : 'border-line text-ink-muted hover:text-ink-soft')}>{z.label}</button>
        ))}
      </div>
      {zone === 'ataques' && <AttacksEditor api={api} />}
      {zone === 'equipamentos' && <ItemsEditor api={api} />}
      {zone === 'idiomas' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div><p className="mb-1.5 text-[11px] uppercase tracking-widest text-ink-muted">Idiomas</p><StringList items={sheet.languages} onChange={(languages) => api.patchSheet({ languages })} placeholder="Ex.: Comum" addLabel="Novo idioma" /></div>
          <div><p className="mb-1.5 text-[11px] uppercase tracking-widest text-ink-muted">Ferramentas e outras proficiências</p><StringList items={sheet.toolProficiencies} onChange={(toolProficiencies) => api.patchSheet({ toolProficiencies })} placeholder="Ex.: Ferramentas de ladrão" addLabel="Nova proficiência" /></div>
        </div>
      )}
      {zone === 'caracteristicas' && (
        <div>
          <StringList items={sheet.chosenFeatures} onChange={(chosenFeatures) => api.patchSheet({ chosenFeatures })} placeholder="Nome da característica ou talento" addLabel="Nova característica" />
          <p className="mt-2 text-[11px] text-ink-faint">As características de classe, raça e antecedente entram sozinhas; aqui ficam as suas (talentos, escolhas, anotações).</p>
        </div>
      )}
      {zone === 'magias' && <SpellsEditor api={api} />}
      {zone === 'moedas' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {coinLabels.map(([k, label]) => (
            <label key={k} className="block"><span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-muted">{label}</span>
              <input className={inputCls} inputMode="numeric" value={sheet.coins[k]} onChange={(e) => api.patchSheet({ coins: { ...sheet.coins, [k]: Math.max(0, Math.floor(numOr(e.target.value))) } })} /></label>
          ))}
        </div>
      )}
      {zone === 'cm' && (
        <div className="space-y-2">
          <p className="text-xs text-ink-muted">C.M = soma das parcelas (até 5). Total: <b className="text-ink">{cm.reduce((a, b) => a + b, 0)}</b></p>
          <div className="flex flex-wrap items-center gap-2">
            {cm.map((v, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-ink-muted">+</span>}
                <input className={cn(inputCls, 'w-16')} inputMode="numeric" value={v} onChange={(e) => setCm(cm.map((x, j) => (j === i ? numOr(e.target.value) : x)))} aria-label={`Parcela ${i + 1}`} />
                <Del label={`Apagar parcela ${i + 1}`} onClick={() => setCm(cm.filter((_, j) => j !== i))} />
              </div>
            ))}
            {cm.length < 5 && <GhostButton onClick={() => setCm([...cm, 0])}><Plus className="h-3.5 w-3.5" />Parcela</GhostButton>}
          </div>
        </div>
      )}
    </section>
  );
}
