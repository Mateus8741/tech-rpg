'use client';

import { useState, useEffect } from 'react';
import { type Character } from '@/lib/api';
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
    armorClass: character?.armorClass || 10,
    notes: character?.notes || '',
  });

  const [saving, setSaving] = useState(false);

  const calculateModifier = (value: number) => {
    return Math.floor((value - 10) / 2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('HitPoints') || name.includes('armorClass') || name.includes('level') || name.includes('experience') 
        ? parseInt(value) || 0 
        : name.includes('strength') || name.includes('dexterity') || name.includes('constitution') || 
          name.includes('intelligence') || name.includes('wisdom') || name.includes('charisma')
        ? parseInt(value) || 10
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
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

