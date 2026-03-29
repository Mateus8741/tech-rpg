'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type Character, type Ability, type Equipment, type InventoryItem } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import CombatTracker from '@/components/CombatTracker';

interface CharacterFormProps {
  character?: Character;
  onSubmit: (data: Partial<Character>) => Promise<void>;
  // Required on edit page for the Combate tab:
  username?: string;
  userRole?: 'PLAYER' | 'MASTER';
  onCombatUpdate?: () => void;
}

export default function CharacterForm({ character, onSubmit, username, userRole, onCombatUpdate }: CharacterFormProps) {
  const [formData, setFormData] = useState({
    name: character?.name || '',
    race: character?.race || 'Humano',
    class: character?.class || 'Guerreiro',
    level: character?.level || 1,
    background: character?.background || '',
    alignment: character?.alignment || '',
    experience: character?.experience || 0,
    strength: character?.strength || 10,
    dexterity: character?.dexterity || 10,
    constitution: character?.constitution || 10,
    intelligence: character?.intelligence || 10,
    wisdom: character?.wisdom || 10,
    charisma: character?.charisma || 10,
    maxHitPoints: character?.maxHitPoints || 8,
    currentHitPoints: character?.currentHitPoints || 8,
    temporaryHitPoints: character?.temporaryHitPoints || 0,
    maxMana: character?.maxMana || 0,
    currentMana: character?.currentMana || 0,
    armorClass: character?.armorClass || 10,
    notes: character?.notes || '',
  });

  const [abilities, setAbilities] = useState<Ability[]>(character?.abilities || []);
  const [equipment, setEquipment] = useState<Equipment[]>(character?.equipment || []);
  const [inventory, setInventory] = useState<InventoryItem[]>(character?.inventory || []);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const router = useRouter();

  const calculateModifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };

  const inputClass = "bg-[#0f1117] border-[#2d2f45] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#6366f1]";

  useEffect(() => {
    if (character) {
      setAbilities(character.abilities || []);
      setEquipment(character.equipment || []);
      setInventory(character.inventory || []);
    }
  }, [character]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('HitPoints') || name.includes('Mana') || name.includes('armorClass') || name.includes('level') || name.includes('experience')
        ? parseInt(value) || 0
        : name.includes('strength') || name.includes('dexterity') || name.includes('constitution') ||
          name.includes('intelligence') || name.includes('wisdom') || name.includes('charisma')
        ? parseInt(value) || 10
        : value,
    }));
  };

  const handleAbilityChange = (index: number, field: keyof Ability, value: string | number) => {
    setAbilities(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value } as Ability;
      return updated;
    });
  };

  const addAbility = () => {
    setAbilities(prev => [...prev, { name: '', level: 1, cost: 0, damage: '' }]);
  };

  const removeAbility = (index: number) => {
    setAbilities(prev => prev.filter((_, i) => i !== index));
  };

  const handleEquipmentChange = (index: number, field: keyof Equipment, value: string | number) => {
    setEquipment(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value } as Equipment;
      return updated;
    });
  };

  const addEquipment = () => {
    setEquipment(prev => [...prev, { name: '', defense: 0, attack: 0 }]);
  };

  const removeEquipment = (index: number) => {
    setEquipment(prev => prev.filter((_, i) => i !== index));
  };

  const handleInventoryChange = (index: number, field: keyof InventoryItem, value: string | number) => {
    setInventory(prev => {
      const updated = [...prev];
      const newValue = field === 'name' ? value : (typeof value === 'string' ? parseInt(value) || 0 : value);

      // Se estiver atualizando o campo, aplica o novo valor temporariamente
      if (field === 'quantity') {
        const quantityValue = typeof value === 'string' ? parseInt(value) || 0 : value;
        const currentMax = updated[index]!.max;
        // Garante que quantidade não seja maior que máximo
        updated[index] = {
          ...updated[index]!,
          quantity: Math.min(quantityValue, currentMax),
          max: currentMax
        };
      } else if (field === 'max') {
        const maxValue = typeof value === 'string' ? parseInt(value) || 0 : value;
        const currentQuantity = updated[index]!.quantity;
        // Se o novo máximo for menor que a quantidade atual, ajusta a quantidade
        updated[index] = {
          ...updated[index]!,
          max: maxValue,
          quantity: Math.min(currentQuantity, maxValue)
        };
      } else {
        updated[index] = { ...updated[index], [field]: newValue } as InventoryItem;
      }

      return updated;
    });
  };

  const addInventoryItem = () => {
    setInventory(prev => [...prev, { name: '', quantity: 0, max: 0 }]);
  };

  const removeInventoryItem = (index: number) => {
    setInventory(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...formData, abilities, equipment, inventory });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-[#0a0c14] border-b border-[#1e2035] px-6 pb-0 pt-4">
        {/* Name + back + save row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/characters')}
              className="text-[#64748b] hover:text-[#e2e8f0] text-xs flex items-center gap-1 transition-colors"
            >
              ← Voltar
            </button>
            <div>
              <p className="text-base font-bold text-[#e2e8f0] leading-none">
                {formData.name || 'Novo Personagem'}
              </p>
              {character && (
                <p className="text-xs text-[#64748b] mt-0.5">
                  {formData.race} • {formData.class} • Nível {formData.level}
                </p>
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={saving}
            size="sm"
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-0 font-semibold"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        {/* Stat pills */}
        {character && (
          <div className="flex gap-2 mb-3 flex-wrap">
            <StatPill label="HP" value={`${formData.currentHitPoints} / ${formData.maxHitPoints}`} colorClass="text-[#f87171] bg-red-500/10 border-red-500/20" />
            <StatPill label="CA" value={`${formData.armorClass}`} colorClass="text-[#94a3b8] bg-white/5 border-[#1e2035]" />
            <StatPill label="Mana" value={`${formData.currentMana} / ${formData.maxMana}`} colorClass="text-[#818cf8] bg-[#818cf8]/10 border-[#818cf8]/20" />
            <StatPill label="XP" value={`${formData.experience}`} colorClass="text-[#fbbf24] bg-amber-500/10 border-amber-500/20" />
          </div>
        )}

        {/* Tab bar */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b-0 gap-0 h-auto p-0 rounded-none">
            {[
              { value: 'info', label: 'Info' },
              { value: 'atributos', label: 'Atributos' },
              { value: 'habilidades', label: 'Habilidades' },
              { value: 'inventario', label: 'Inventário' },
              ...(character ? [{ value: 'combate', label: 'Combate' }] : []),
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'rounded-none border-b-2 border-transparent px-4 py-2.5 text-xs font-medium transition-colors data-[state=active]:border-[#8b5cf6] data-[state=active]:text-[#a78bfa] data-[state=inactive]:text-[#64748b] hover:text-[#94a3b8] bg-transparent shadow-none',
                  tab.value === 'combate' && 'data-[state=active]:border-red-500 data-[state=active]:text-red-400'
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab content lives in the scrollable area below */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <TabsContent value="info" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Nome do Personagem">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Ex: Thorin Ferropunho"
                  />
                </FormField>
                <FormField label="Raça">
                  <Select name="race" value={formData.race} onValueChange={(v) => setFormData(p => ({ ...p, race: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#13151f] border-[#2d2f45]">
                      {['Humano','Elfo','Anão','Halfling','Meio-Elfo','Meio-Orc','Tiefling','Dragonborn','Gnomo'].map(r => (
                        <SelectItem key={r} value={r} className="text-[#e2e8f0] focus:bg-[#6366f1]/20">{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Classe">
                  <Select name="class" value={formData.class} onValueChange={(v) => setFormData(p => ({ ...p, class: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#13151f] border-[#2d2f45]">
                      {['Guerreiro','Mago','Ladino','Clérigo','Ranger','Paladino','Bárbaro','Bardo','Druida','Monge','Bruxo','Feiticeiro'].map(c => (
                        <SelectItem key={c} value={c} className="text-[#e2e8f0] focus:bg-[#6366f1]/20">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Nível">
                  <Input type="number" name="level" value={formData.level} onChange={handleChange} min="1" max="20" className={inputClass} />
                </FormField>
                <FormField label="Antecedente">
                  <Input name="background" value={formData.background} onChange={handleChange} placeholder="Ex: Soldado, Erudito..." className={inputClass} />
                </FormField>
                <FormField label="Alinhamento">
                  <Select name="alignment" value={formData.alignment || ''} onValueChange={(v) => setFormData(p => ({ ...p, alignment: v }))}>
                    <SelectTrigger className={inputClass}><SelectValue placeholder="-" /></SelectTrigger>
                    <SelectContent className="bg-[#13151f] border-[#2d2f45]">
                      {['Leal e Bom','Neutro e Bom','Caótico e Bom','Leal e Neutro','Neutro','Caótico e Neutro','Leal e Mau','Neutro e Mau','Caótico e Mau'].map(a => (
                        <SelectItem key={a} value={a} className="text-[#e2e8f0] focus:bg-[#6366f1]/20">{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Experiência">
                  <Input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" className={inputClass} />
                </FormField>
              </div>
            </TabsContent>
            <TabsContent value="atributos" className="mt-0 space-y-4">
              {/* Attribute grid */}
              <SectionCard title="Atributos">
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { key: 'strength', abbr: 'FOR' },
                    { key: 'dexterity', abbr: 'DES' },
                    { key: 'constitution', abbr: 'CON' },
                    { key: 'intelligence', abbr: 'INT' },
                    { key: 'wisdom', abbr: 'SAB' },
                    { key: 'charisma', abbr: 'CAR' },
                  ].map(({ key, abbr }) => {
                    const val = formData[key as keyof typeof formData] as number;
                    const mod = calculateModifier(val);
                    const modColor = mod > 0 ? 'text-[#a78bfa] bg-[#6366f1]/15' : mod < 0 ? 'text-[#f87171] bg-red-500/10' : 'text-[#64748b] bg-white/5';
                    return (
                      <div key={key} className="bg-[#0f1117] border border-[#2d2f45] rounded-xl p-3 text-center">
                        <p className="text-[9px] font-semibold text-[#475569] uppercase tracking-widest mb-2">{abbr}</p>
                        <input
                          type="number"
                          name={key}
                          value={val}
                          onChange={handleChange}
                          min="1"
                          max="30"
                          className="bg-transparent w-full text-center text-lg font-bold text-[#e2e8f0] outline-none border-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className={cn('mt-2 rounded-full py-0.5 text-xs font-semibold', modColor)}>
                          {mod >= 0 ? '+' : ''}{mod}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              {/* HP + Mana */}
              <div className="grid grid-cols-2 gap-4">
                <SectionCard title="Pontos de Vida">
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Máximo">
                      <Input type="number" name="maxHitPoints" value={formData.maxHitPoints} onChange={handleChange} min="1" className={inputClass} />
                    </FormField>
                    <FormField label="Atual">
                      <Input type="number" name="currentHitPoints" value={formData.currentHitPoints} onChange={handleChange} min="0" className="bg-[#0f1117] border-red-500/30 text-[#f87171] focus-visible:ring-red-500" />
                    </FormField>
                    <FormField label="Temporário">
                      <Input type="number" name="temporaryHitPoints" value={formData.temporaryHitPoints} onChange={handleChange} min="0" className={inputClass} />
                    </FormField>
                  </div>
                </SectionCard>
                <SectionCard title="Mana + Armadura">
                  <div className="grid grid-cols-3 gap-3">
                    <FormField label="Mana Máx">
                      <Input type="number" name="maxMana" value={formData.maxMana} onChange={handleChange} min="0" className={inputClass} />
                    </FormField>
                    <FormField label="Mana Atual">
                      <Input type="number" name="currentMana" value={formData.currentMana} onChange={handleChange} min="0" className="bg-[#0f1117] border-[#818cf8]/30 text-[#818cf8] focus-visible:ring-[#818cf8]" />
                    </FormField>
                    <FormField label="CA">
                      <Input type="number" name="armorClass" value={formData.armorClass} onChange={handleChange} min="0" className={inputClass} />
                    </FormField>
                  </div>
                </SectionCard>
              </div>
            </TabsContent>
            <TabsContent value="habilidades" className="mt-0">
              <SectionCard title="Habilidades">
                <div className="space-y-3 mb-4">
                  {abilities.map((ability, index) => (
                    <div key={index} className="bg-[#0f1117] border border-[#2d2f45] rounded-xl p-4">
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="col-span-2">
                          <FormField label="Nome da Habilidade">
                            <Input
                              value={ability.name}
                              onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                              placeholder="Ex: Bola de Fogo"
                              className={inputClass}
                            />
                          </FormField>
                        </div>
                        <FormField label="Nível">
                          <Input type="number" value={ability.level} onChange={(e) => handleAbilityChange(index, 'level', parseInt(e.target.value) || 1)} min="1" max="20" className={inputClass} />
                        </FormField>
                        <FormField label="Custo Mana">
                          <Input type="number" value={ability.cost} onChange={(e) => handleAbilityChange(index, 'cost', parseInt(e.target.value) || 0)} min="0" className={inputClass} />
                        </FormField>
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <FormField label="Rolagem de Dano">
                            <Input value={ability.damage} onChange={(e) => handleAbilityChange(index, 'damage', e.target.value)} placeholder="Ex: 1d6+3, 2d8" className={inputClass} />
                          </FormField>
                        </div>
                        <Button type="button" onClick={() => removeAbility(index)} variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-9">
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={addAbility} variant="outline" className="w-full border-dashed border-[#2d2f45] text-[#64748b] hover:text-[#a78bfa] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5">
                  + Adicionar Habilidade
                </Button>
              </SectionCard>
            </TabsContent>
            <TabsContent value="inventario" className="mt-0 space-y-4">
              {/* Equipment */}
              <SectionCard title="Equipamentos">
                <div className="space-y-3 mb-4">
                  {equipment.map((item, index) => (
                    <div key={index} className="bg-[#0f1117] border border-[#2d2f45] rounded-xl p-4">
                      <div className="grid grid-cols-4 gap-3 items-end">
                        <div className="col-span-2">
                          <FormField label="Nome do Item">
                            <Input value={item.name} onChange={(e) => handleEquipmentChange(index, 'name', e.target.value)} placeholder="Ex: Espada Longa" className={inputClass} />
                          </FormField>
                        </div>
                        <FormField label="Defesa">
                          <Input type="number" value={item.defense ?? 0} onChange={(e) => handleEquipmentChange(index, 'defense', parseInt(e.target.value) || 0)} min="0" className={inputClass} />
                        </FormField>
                        <FormField label="Ataque">
                          <Input type="number" value={item.attack ?? 0} onChange={(e) => handleEquipmentChange(index, 'attack', parseInt(e.target.value) || 0)} min="0" className={inputClass} />
                        </FormField>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button type="button" onClick={() => removeEquipment(index)} variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={addEquipment} variant="outline" className="w-full border-dashed border-[#2d2f45] text-[#64748b] hover:text-[#a78bfa] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5">
                  + Adicionar Equipamento
                </Button>
              </SectionCard>

              {/* Inventory table */}
              <SectionCard title="Inventário">
                {inventory.length > 0 && (
                  <table className="w-full mb-4 text-sm">
                    <thead>
                      <tr className="border-b border-[#1e2035]">
                        <th className="text-left py-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Item</th>
                        <th className="text-center py-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest w-20">Qtd</th>
                        <th className="text-center py-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest w-20">Máx</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item, index) => (
                        <tr key={index} className="border-b border-[#1e2035]/50">
                          <td className="py-2 pr-3">
                            <Input value={item.name} onChange={(e) => handleInventoryChange(index, 'name', e.target.value)} placeholder="Nome do item" className={cn(inputClass, 'h-8 text-sm')} />
                          </td>
                          <td className="py-2 px-1">
                            <Input type="number" value={item.quantity} onChange={(e) => handleInventoryChange(index, 'quantity', e.target.value)} min="0" max={item.max} className={cn(inputClass, 'h-8 text-sm text-center')} />
                          </td>
                          <td className="py-2 px-1">
                            <Input type="number" value={item.max} onChange={(e) => handleInventoryChange(index, 'max', e.target.value)} min="0" className={cn(inputClass, 'h-8 text-sm text-center')} />
                          </td>
                          <td className="py-2 pl-1">
                            <Button type="button" onClick={() => removeInventoryItem(index)} variant="ghost" size="sm" className="h-8 w-8 p-0 text-[#475569] hover:text-red-400 hover:bg-red-500/10">
                              ×
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <Button type="button" onClick={addInventoryItem} variant="outline" className="w-full border-dashed border-[#2d2f45] text-[#64748b] hover:text-[#a78bfa] hover:border-[#6366f1]/40 hover:bg-[#6366f1]/5">
                  + Adicionar Item
                </Button>
              </SectionCard>

              {/* Notes */}
              <SectionCard title="Anotações">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Anotações sobre o personagem, história, características especiais..."
                  className={cn(inputClass, 'w-full rounded-md border px-3 py-2 text-sm resize-none')}
                />
              </SectionCard>
            </TabsContent>
            {character && (
              <TabsContent value="combate" className="mt-0">
                {/* Combate tab — filled in Task 9 */}
                <div className="text-[#64748b] text-sm">Combate tab (Task 9)</div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </form>
  );
}

function StatPill({ label, value, colorClass }: { label: string; value: string; colorClass: string }) {
  return (
    <div className={cn('flex items-center gap-2 border rounded-lg px-3 py-1.5', colorClass)}>
      <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#13151f] border border-[#1e2035] rounded-xl p-5">
      <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-4">{title}</p>
      {children}
    </div>
  );
}
