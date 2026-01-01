'use client';

import { useState, useEffect } from 'react';
import { type Character, type Ability, type Equipment, type InventoryItem } from '@/lib/api';
import styles from './CharacterForm.module.css';

interface CharacterFormProps {
  character?: Character;
  onSubmit: (data: Partial<Character>) => Promise<void>;
}

export default function CharacterForm({ character, onSubmit }: CharacterFormProps) {
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
      updated[index] = { ...updated[index], [field]: value };
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
      updated[index] = { ...updated[index], [field]: value };
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
        const currentMax = updated[index].max;
        // Garante que quantidade não seja maior que máximo
        updated[index] = { 
          ...updated[index], 
          quantity: Math.min(quantityValue, currentMax),
          max: currentMax
        };
      } else if (field === 'max') {
        const maxValue = typeof value === 'string' ? parseInt(value) || 0 : value;
        const currentQuantity = updated[index].quantity;
        // Se o novo máximo for menor que a quantidade atual, ajusta a quantidade
        updated[index] = { 
          ...updated[index], 
          max: maxValue,
          quantity: Math.min(currentQuantity, maxValue)
        };
      } else {
        updated[index] = { ...updated[index], [field]: newValue };
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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.section}>
        <h2>📋 Informações Básicas</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Nome do Personagem *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Raça</label>
            <select name="race" value={formData.race} onChange={handleChange}>
              <option>Humano</option>
              <option>Elfo</option>
              <option>Anão</option>
              <option>Halfling</option>
              <option>Meio-Elfo</option>
              <option>Meio-Orc</option>
              <option>Tiefling</option>
              <option>Dragonborn</option>
              <option>Gnomo</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Classe</label>
            <select name="class" value={formData.class} onChange={handleChange}>
              <option>Guerreiro</option>
              <option>Mago</option>
              <option>Ladino</option>
              <option>Clérigo</option>
              <option>Ranger</option>
              <option>Paladino</option>
              <option>Bárbaro</option>
              <option>Bardo</option>
              <option>Druida</option>
              <option>Monge</option>
              <option>Bruxo</option>
              <option>Feiticeiro</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Nível</label>
            <input
              type="number"
              name="level"
              value={formData.level}
              onChange={handleChange}
              min="1"
              max="20"
            />
          </div>
          <div className={styles.field}>
            <label>Antecedente</label>
            <input
              type="text"
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="Ex: Soldado, Erudito..."
            />
          </div>
          <div className={styles.field}>
            <label>Alinhamento</label>
            <select name="alignment" value={formData.alignment} onChange={handleChange}>
              <option value="">-</option>
              <option>Leal e Bom</option>
              <option>Neutro e Bom</option>
              <option>Caótico e Bom</option>
              <option>Leal e Neutro</option>
              <option>Neutro</option>
              <option>Caótico e Neutro</option>
              <option>Leal e Mau</option>
              <option>Neutro e Mau</option>
              <option>Caótico e Mau</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Experiência</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>💪 Atributos</h2>
        <div className={styles.attributesGrid}>
          {[
            { key: 'strength', label: 'Força', abbr: 'FOR' },
            { key: 'dexterity', label: 'Destreza', abbr: 'DES' },
            { key: 'constitution', label: 'Constituição', abbr: 'CON' },
            { key: 'intelligence', label: 'Inteligência', abbr: 'INT' },
            { key: 'wisdom', label: 'Sabedoria', abbr: 'SAB' },
            { key: 'charisma', label: 'Carisma', abbr: 'CAR' },
          ].map((attr) => (
            <div key={attr.key} className={styles.attribute}>
              <label>{attr.label} ({attr.abbr})</label>
              <input
                type="number"
                name={attr.key}
                value={formData[attr.key as keyof typeof formData] as number}
                onChange={handleChange}
                min="1"
                max="30"
              />
              <div className={styles.modifier}>
                Mod: {calculateModifier(formData[attr.key as keyof typeof formData] as number) >= 0 ? '+' : ''}
                {calculateModifier(formData[attr.key as keyof typeof formData] as number)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>❤️ Pontos de Vida e Armadura</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>PV Máximo</label>
            <input
              type="number"
              name="maxHitPoints"
              value={formData.maxHitPoints}
              onChange={handleChange}
              min="1"
            />
          </div>
          <div className={styles.field}>
            <label>PV Atuais</label>
            <input
              type="number"
              name="currentHitPoints"
              value={formData.currentHitPoints}
              onChange={handleChange}
              min="0"
              max={formData.maxHitPoints}
            />
          </div>
          <div className={styles.field}>
            <label>PV Temporários</label>
            <input
              type="number"
              name="temporaryHitPoints"
              value={formData.temporaryHitPoints}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className={styles.field}>
            <label>Classe de Armadura (CA)</label>
            <input
              type="number"
              name="armorClass"
              value={formData.armorClass}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🔮 Pontos de Mana</h2>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label>Mana Máxima</label>
            <input
              type="number"
              name="maxMana"
              value={formData.maxMana}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className={styles.field}>
            <label>Mana Atual</label>
            <input
              type="number"
              name="currentMana"
              value={formData.currentMana}
              onChange={handleChange}
              min="0"
              max={formData.maxMana}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>⚔️ Habilidades</h2>
        <div className={styles.listContainer}>
          {abilities.map((ability, index) => (
            <div key={index} className={styles.listItem}>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>Nome da Habilidade</label>
                  <input
                    type="text"
                    value={ability.name}
                    onChange={(e) => handleAbilityChange(index, 'name', e.target.value)}
                    placeholder="Ex: Bola de Fogo"
                  />
                </div>
                <div className={styles.field}>
                  <label>Nível</label>
                  <input
                    type="number"
                    value={ability.level}
                    onChange={(e) => handleAbilityChange(index, 'level', parseInt(e.target.value) || 1)}
                    min="1"
                    max="20"
                  />
                </div>
                <div className={styles.field}>
                  <label>Custo de Mana</label>
                  <input
                    type="number"
                    value={ability.cost}
                    onChange={(e) => handleAbilityChange(index, 'cost', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className={styles.field}>
                  <label>Rolagem de Dano</label>
                  <input
                    type="text"
                    value={ability.damage}
                    onChange={(e) => handleAbilityChange(index, 'damage', e.target.value)}
                    placeholder="Ex: 1d6+3, 2d8, 1d4"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAbility(index)}
                className={styles.removeButton}
              >
                🗑️ Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addAbility} className={styles.addButton}>
            ➕ Adicionar Habilidade
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🛡️ Equipamentos</h2>
        <div className={styles.listContainer}>
          {equipment.map((item, index) => (
            <div key={index} className={styles.listItem}>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>Nome do Item</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleEquipmentChange(index, 'name', e.target.value)}
                    placeholder="Ex: Espada Longa"
                  />
                </div>
                <div className={styles.field}>
                  <label>Defesa</label>
                  <input
                    type="number"
                    value={item.defense || 0}
                    onChange={(e) => handleEquipmentChange(index, 'defense', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className={styles.field}>
                  <label>Ataque</label>
                  <input
                    type="number"
                    value={item.attack || 0}
                    onChange={(e) => handleEquipmentChange(index, 'attack', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeEquipment(index)}
                className={styles.removeButton}
              >
                🗑️ Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addEquipment} className={styles.addButton}>
            ➕ Adicionar Equipamento
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>🎒 Inventário</h2>
        <div className={styles.inventoryContainer}>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>QUANT</th>
                <th>MAX</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleInventoryChange(index, 'name', e.target.value)}
                      placeholder="Nome do item"
                      className={styles.inventoryInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleInventoryChange(index, 'quantity', e.target.value)}
                      min="0"
                      max={item.max}
                      className={styles.inventoryInput}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.max}
                      onChange={(e) => handleInventoryChange(index, 'max', e.target.value)}
                      min="0"
                      className={styles.inventoryInput}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => removeInventoryItem(index)}
                      className={styles.removeButton}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addInventoryItem} className={styles.addButton}>
            ➕ Adicionar Item ao Inventário
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>📝 Anotações</h2>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={8}
          placeholder="Anotações sobre o personagem, história, características especiais..."
          className={styles.textarea}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" disabled={saving} className={styles.saveButton}>
          {saving ? 'Salvando...' : '💾 Salvar Personagem'}
        </button>
      </div>
    </form>
  );
}

