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
              {/* Info tab — filled in Task 7 */}
              <div className="text-[#64748b] text-sm">Info tab (Task 7)</div>
            </TabsContent>
            <TabsContent value="atributos" className="mt-0">
              {/* Atributos tab — filled in Task 7 */}
              <div className="text-[#64748b] text-sm">Atributos tab (Task 7)</div>
            </TabsContent>
            <TabsContent value="habilidades" className="mt-0">
              {/* Habilidades tab — filled in Task 8 */}
              <div className="text-[#64748b] text-sm">Habilidades tab (Task 8)</div>
            </TabsContent>
            <TabsContent value="inventario" className="mt-0">
              {/* Inventário tab — filled in Task 8 */}
              <div className="text-[#64748b] text-sm">Inventário tab (Task 8)</div>
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
