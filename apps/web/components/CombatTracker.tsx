'use client';

import { useState, useEffect, useRef } from 'react';
import { type Character, type CombatStatus, updateCharacter } from '@/lib/api';
import styles from './CombatTracker.module.css';

interface CombatTrackerProps {
  character: Character;
  username: string;
  userRole: 'PLAYER' | 'MASTER';
  onUpdate: () => void;
}

export default function CombatTracker({ character, username, userRole, onUpdate }: CombatTrackerProps) {
  const [damage, setDamage] = useState<number>(character.combatStatus?.damage || 0);
  const [debuff, setDebuff] = useState<number>(character.combatStatus?.debuff || 0);
  const [turns, setTurns] = useState<number>(character.combatStatus?.turns || 0);
  const [currentTurn, setCurrentTurn] = useState<number>(character.combatStatus?.currentTurn || 1);
  
  const debuffTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const turnsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Garante que combatStatus existe
  const combatStatus = character.combatStatus || {};

  const currentHP = character.currentHitPoints;
  const defense = character.armorClass;

  // Calcula dano defensível: HP - (DANO - DEF)
  const defensiveDamage = damage > 0 ? Math.max(0, currentHP - Math.max(0, damage - defense)) : currentHP;

  // Calcula dano direto: HP - DANO
  const directDamage = damage > 0 ? Math.max(0, currentHP - damage) : currentHP;

  // Calcula dano com debuff: HP - (DANO + DEBUFF)
  const damageWithDebuff = damage > 0 && debuff > 0 
    ? Math.max(0, currentHP - (damage + debuff)) 
    : damage > 0 ? directDamage : currentHP;

  useEffect(() => {
    const status = character.combatStatus || {};
    setDamage(status.damage || 0);
    setDebuff(status.debuff || 0);
    setTurns(status.turns || 0);
    setCurrentTurn(status.currentTurn || 1);
  }, [character]);

  // Limpa timeouts quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (debuffTimeoutRef.current) {
        clearTimeout(debuffTimeoutRef.current);
      }
      if (turnsTimeoutRef.current) {
        clearTimeout(turnsTimeoutRef.current);
      }
    };
  }, []);

  const handleDamageChange = (newDamage: number) => {
    setDamage(newDamage);
    // Não salva automaticamente, apenas atualiza o estado local
    // O salvamento será feito quando aplicar o dano
  };

  const applyDefensiveDamage = async () => {
    if (damage <= 0) return;
    
    const newHP = Math.max(0, currentHP - Math.max(0, damage - defense));
    let newTurns = turns;
    let newDebuff = debuff;

    // Se recebeu dano e tem debuff ativo, diminui os turnos
    if (turns > 0) {
      newTurns = Math.max(0, turns - 1);
      if (newTurns === 0) {
        newDebuff = 0;
      }
    }

    const combatStatus: CombatStatus = {
      damage: 0, // Limpa o dano após aplicar
      debuff: newDebuff,
      turns: newTurns,
      currentTurn: currentTurn,
    };

    try {
      await updateCharacter(character.id, username, { 
        currentHitPoints: newHP,
        combatStatus 
      });
      setDamage(0);
      setTurns(newTurns);
      setDebuff(newDebuff);
      // Atualiza apenas quando o HP muda (aplicar dano)
      onUpdate();
    } catch (error) {
      console.error('Erro ao aplicar dano defensível:', error);
    }
  };

  const applyDirectDamage = async () => {
    if (damage <= 0) return;
    
    const newHP = Math.max(0, currentHP - damage);
    let newTurns = turns;
    let newDebuff = debuff;

    // Se recebeu dano e tem debuff ativo, diminui os turnos
    if (turns > 0) {
      newTurns = Math.max(0, turns - 1);
      if (newTurns === 0) {
        newDebuff = 0;
      }
    }

    const combatStatus: CombatStatus = {
      damage: 0, // Limpa o dano após aplicar
      debuff: newDebuff,
      turns: newTurns,
      currentTurn: currentTurn,
    };

    try {
      await updateCharacter(character.id, username, { 
        currentHitPoints: newHP,
        combatStatus 
      });
      setDamage(0);
      setTurns(newTurns);
      setDebuff(newDebuff);
      // Atualiza apenas quando o HP muda (aplicar dano)
      onUpdate();
    } catch (error) {
      console.error('Erro ao aplicar dano direto:', error);
    }
  };

  const applyDamageWithDebuff = async () => {
    if (damage <= 0 || debuff <= 0) return;
    
    const newHP = Math.max(0, currentHP - (damage + debuff));
    let newTurns = turns;
    let newDebuff = debuff;

    // Diminui os turnos
    if (turns > 0) {
      newTurns = Math.max(0, turns - 1);
      if (newTurns === 0) {
        newDebuff = 0;
      }
    }

    const combatStatus: CombatStatus = {
      damage: 0, // Limpa o dano após aplicar
      debuff: newDebuff,
      turns: newTurns,
      currentTurn: currentTurn,
    };

    try {
      await updateCharacter(character.id, username, { 
        currentHitPoints: newHP,
        combatStatus 
      });
      setDamage(0);
      setTurns(newTurns);
      setDebuff(newDebuff);
      // Atualiza apenas quando o HP muda (aplicar dano)
      onUpdate();
    } catch (error) {
      console.error('Erro ao aplicar dano com debuff:', error);
    }
  };

  const handleDebuffChange = (newDebuff: number) => {
    setDebuff(newDebuff);
    const newTurns = newDebuff > 0 ? (turns || 1) : 0;
    setTurns(newTurns);
    
    // Limpa timeout anterior se existir
    if (debuffTimeoutRef.current) {
      clearTimeout(debuffTimeoutRef.current);
    }
    
    // Salva após um pequeno delay para evitar muitas requisições
    debuffTimeoutRef.current = setTimeout(async () => {
      const combatStatus: CombatStatus = {
        damage,
        debuff: newDebuff,
        turns: newTurns,
        currentTurn: currentTurn,
      };

      try {
        await updateCharacter(character.id, username, { combatStatus });
        // Não chama onUpdate para evitar reload desnecessário
      } catch (error) {
        console.error('Erro ao atualizar debuff:', error);
      }
    }, 800);
  };

  const handleTurnsChange = (newTurns: number) => {
    setTurns(newTurns);
    
    // Se os turnos chegaram a 0, remove o debuff
    const newDebuff = newTurns === 0 ? 0 : debuff;
    if (newDebuff !== debuff) {
      setDebuff(newDebuff);
    }
    
    // Limpa timeout anterior se existir
    if (turnsTimeoutRef.current) {
      clearTimeout(turnsTimeoutRef.current);
    }
    
    // Salva após um pequeno delay para evitar muitas requisições
    turnsTimeoutRef.current = setTimeout(async () => {
      const combatStatus: CombatStatus = {
        damage,
        debuff: newDebuff,
        turns: newTurns,
        currentTurn: currentTurn,
      };

      try {
        await updateCharacter(character.id, username, { combatStatus });
        // Não chama onUpdate para evitar reload desnecessário
      } catch (error) {
        console.error('Erro ao atualizar turnos:', error);
      }
    }, 800);
  };

  const passTurn = async () => {
    let newTurns = turns;
    let newDebuff = debuff;
    
    // Diminui os turnos do debuff quando passa o turno
    if (turns > 0) {
      newTurns = Math.max(0, turns - 1);
      
      // Se os turnos chegaram a 0, remove o debuff
      if (newTurns === 0) {
        newDebuff = 0;
      }
    }
    
    const combatStatus: CombatStatus = {
      damage,
      debuff: newDebuff,
      turns: newTurns,
      currentTurn: currentTurn + 1,
    };

    try {
      await updateCharacter(character.id, username, { combatStatus });
      setTurns(newTurns);
      setDebuff(newDebuff);
      setCurrentTurn(currentTurn + 1);
      onUpdate();
    } catch (error) {
      console.error('Erro ao passar turno:', error);
    }
  };

  const clearCombat = async () => {
    const combatStatus: CombatStatus = {
      damage: 0,
      debuff: 0,
      turns: 0,
      currentTurn: 1,
    };

    try {
      await updateCharacter(character.id, username, { combatStatus });
      setDamage(0);
      setDebuff(0);
      setTurns(0);
      setCurrentTurn(1);
      // Atualiza o personagem localmente sem recarregar a página
      onUpdate();
    } catch (error) {
      console.error('Erro ao limpar combate:', error);
    }
  };

  return (
    <div className={styles.combatTracker}>
      <div className={styles.header}>
        <h2>⚔️ Rastreador de Combate</h2>
        <div className={styles.turnDisplay}>
          <span className={styles.turnLabel}>Turno:</span>
          <span className={styles.turnNumber}>{currentTurn}</span>
        </div>
      </div>
      <div className={styles.combatTable}>
        <div className={styles.combatRow}>
          <div className={styles.combatCell}>
            <label>HP ATUAL</label>
            <div className={styles.autoValue}>{currentHP}</div>
          </div>
          <div className={styles.combatCell}>
            <label>DEF</label>
            <div className={styles.autoValue}>{defense}</div>
          </div>
          <div className={styles.combatCell}>
            <label>DANO DEFENSIVEL</label>
            <div className={styles.calculatedValue}>{defensiveDamage}</div>
          </div>
          <div className={styles.combatCell}>
            <label>DANO DIRETO</label>
            <div className={styles.calculatedValue}>{directDamage}</div>
          </div>
          <div className={styles.combatCell}>
            <label>DEBUFF</label>
            <input
              type="number"
              value={debuff}
              onChange={(e) => handleDebuffChange(parseInt(e.target.value) || 0)}
              min="0"
              className={styles.input}
              placeholder="Ex: 5"
            />
          </div>
          <div className={styles.combatCell}>
            <label>TURNOS</label>
            <input
              type="number"
              value={turns}
              onChange={(e) => handleTurnsChange(parseInt(e.target.value) || 0)}
              min="0"
              className={styles.input}
              placeholder="Ex: 4"
            />
          </div>
        </div>
        <div className={styles.damageRow}>
          <div className={styles.combatCell}>
            <label>DANO</label>
            <input
              type="number"
              value={damage}
              onChange={(e) => handleDamageChange(parseInt(e.target.value) || 0)}
              min="0"
              className={styles.damageInput}
              placeholder="Digite o dano recebido"
            />
          </div>
          {debuff > 0 && (
            <div className={styles.combatCell}>
              <label>DANO + DEBUFF</label>
              <div className={styles.calculatedValue}>{damageWithDebuff}</div>
            </div>
          )}
        </div>
      </div>
      {damage > 0 && (
        <div className={styles.applyButtons}>
          <button 
            type="button" 
            onClick={applyDefensiveDamage} 
            className={styles.applyButton}
            title="Aplica dano defensível: HP - (DANO - DEF)"
          >
            🛡️ Aplicar Dano Defensível ({defensiveDamage} HP)
          </button>
          <button 
            type="button" 
            onClick={applyDirectDamage} 
            className={styles.applyButton}
            title="Aplica dano direto: HP - DANO"
          >
            ⚔️ Aplicar Dano Direto ({directDamage} HP)
          </button>
          {debuff > 0 && (
            <button 
              type="button" 
              onClick={applyDamageWithDebuff} 
              className={styles.applyButton}
              title="Aplica dano com debuff: HP - (DANO + DEBUFF)"
            >
              💀 Aplicar Dano + Debuff ({damageWithDebuff} HP)
            </button>
          )}
        </div>
      )}
      <div className={styles.actions}>
        {userRole === 'MASTER' && (
          <button type="button" onClick={passTurn} className={styles.passTurnButton}>
            ⏭️ Passar Turno
          </button>
        )}
        <button type="button" onClick={clearCombat} className={styles.clearButton}>
          🧹 Limpar Combate
        </button>
      </div>
      {turns > 0 && (
        <div className={styles.turnWarning}>
          ⚠️ Debuff ativo por {turns} turno{turns !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

