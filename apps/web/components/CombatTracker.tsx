'use client';

import { useState, useEffect, useRef } from 'react';
import { type Character, type CombatStatus, updateCharacter } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const currentHP = character.currentHitPoints;
  const defense = character.armorClass;
  const defensiveDamage = damage > 0 ? Math.max(0, currentHP - Math.max(0, damage - defense)) : currentHP;
  const directDamage = damage > 0 ? Math.max(0, currentHP - damage) : currentHP;
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

  useEffect(() => {
    return () => {
      if (debuffTimeoutRef.current) clearTimeout(debuffTimeoutRef.current);
      if (turnsTimeoutRef.current) clearTimeout(turnsTimeoutRef.current);
    };
  }, []);

  const applyDefensiveDamage = async () => {
    if (damage <= 0) return;
    const newHP = Math.max(0, currentHP - Math.max(0, damage - defense));
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : turns;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage: 0, debuff: newDebuff, turns: newTurns, currentTurn };
    try {
      await updateCharacter(character.id, username, { currentHitPoints: newHP, combatStatus });
      setDamage(0); setTurns(newTurns); setDebuff(newDebuff); onUpdate();
    } catch (error) { console.error('Erro ao aplicar dano defensível:', error); }
  };

  const applyDirectDamage = async () => {
    if (damage <= 0) return;
    const newHP = Math.max(0, currentHP - damage);
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : turns;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage: 0, debuff: newDebuff, turns: newTurns, currentTurn };
    try {
      await updateCharacter(character.id, username, { currentHitPoints: newHP, combatStatus });
      setDamage(0); setTurns(newTurns); setDebuff(newDebuff); onUpdate();
    } catch (error) { console.error('Erro ao aplicar dano direto:', error); }
  };

  const applyDamageWithDebuff = async () => {
    if (damage <= 0 || debuff <= 0) return;
    const newHP = Math.max(0, currentHP - (damage + debuff));
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : turns;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage: 0, debuff: newDebuff, turns: newTurns, currentTurn };
    try {
      await updateCharacter(character.id, username, { currentHitPoints: newHP, combatStatus });
      setDamage(0); setTurns(newTurns); setDebuff(newDebuff); onUpdate();
    } catch (error) { console.error('Erro ao aplicar dano com debuff:', error); }
  };

  const handleDebuffChange = (newDebuff: number) => {
    setDebuff(newDebuff);
    const newTurns = newDebuff > 0 ? (turns || 1) : 0;
    setTurns(newTurns);
    if (debuffTimeoutRef.current) clearTimeout(debuffTimeoutRef.current);
    debuffTimeoutRef.current = setTimeout(async () => {
      try {
        await updateCharacter(character.id, username, { combatStatus: { damage, debuff: newDebuff, turns: newTurns, currentTurn } });
      } catch (error) { console.error('Erro ao atualizar debuff:', error); }
    }, 800);
  };

  const handleTurnsChange = (newTurns: number) => {
    setTurns(newTurns);
    const newDebuff = newTurns === 0 ? 0 : debuff;
    if (newDebuff !== debuff) setDebuff(newDebuff);
    if (turnsTimeoutRef.current) clearTimeout(turnsTimeoutRef.current);
    turnsTimeoutRef.current = setTimeout(async () => {
      try {
        await updateCharacter(character.id, username, { combatStatus: { damage, debuff: newDebuff, turns: newTurns, currentTurn } });
      } catch (error) { console.error('Erro ao atualizar turnos:', error); }
    }, 800);
  };

  const passTurn = async () => {
    const newTurns = turns > 0 ? Math.max(0, turns - 1) : 0;
    const newDebuff = newTurns === 0 ? 0 : debuff;
    const combatStatus: CombatStatus = { damage, debuff: newDebuff, turns: newTurns, currentTurn: currentTurn + 1 };
    try {
      await updateCharacter(character.id, username, { combatStatus });
      setTurns(newTurns); setDebuff(newDebuff); setCurrentTurn(currentTurn + 1); onUpdate();
    } catch (error) { console.error('Erro ao passar turno:', error); }
  };

  const clearCombat = async () => {
    const combatStatus: CombatStatus = { damage: 0, debuff: 0, turns: 0, currentTurn: 1 };
    try {
      await updateCharacter(character.id, username, { combatStatus });
      setDamage(0); setDebuff(0); setTurns(0); setCurrentTurn(1); onUpdate();
    } catch (error) { console.error('Erro ao limpar combate:', error); }
  };

  return (
    <div className="space-y-4">
      {/* Turn badge */}
      {turns > 0 && (
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-lg px-4 py-2.5">
          <span className="text-amber-400 font-semibold text-sm">⚡ Turno {currentTurn}</span>
          <span className="text-amber-600 text-xs">— Debuff ativo por {turns} turno{turns !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Damage calculator */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-widest mb-4">Calculadora de Dano</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <CombatInput label="Dano" value={damage} onChange={(v) => setDamage(v)} colorClass="border-red-500/40 text-danger" />
          <CombatInput label="Debuff" value={debuff} onChange={handleDebuffChange} colorClass="border-line-strong text-ink-soft" />
          <CombatInput label="Turnos" value={turns} onChange={handleTurnsChange} colorClass="border-line-strong text-ink-soft" />
        </div>

        {/* Calculated results */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Defensivo', value: defensiveDamage, formula: 'HP − (dmg − def)', color: 'text-violet-ink border-[#6366f1]/20' },
            { label: 'Direto', value: directDamage, formula: 'HP − dmg', color: 'text-violet-ink border-[#6366f1]/20' },
            { label: 'c/ Debuff', value: damageWithDebuff, formula: 'HP − (dmg + deb)', color: 'text-danger border-red-500/20' },
          ].map(({ label, value, formula, color }) => (
            <div key={label} className={cn('bg-canvas border rounded-lg p-3 text-center', color)}>
              <p className="text-ink-faint text-[10px] mb-1.5">{label}</p>
              <p className={cn('text-lg font-bold', color.split(' ')[0])}>{value}</p>
              <p className="text-ink-faint text-[9px] mt-1">{formula}</p>
            </div>
          ))}
        </div>

        {/* Apply buttons */}
        {damage > 0 && (
          <div className="flex gap-2">
            <Button type="button" onClick={applyDefensiveDamage} variant="outline" size="sm" className="flex-1 border-[#6366f1]/25 text-violet-ink hover:bg-[#6366f1]/10">
              Aplicar Defensivo
            </Button>
            <Button type="button" onClick={applyDirectDamage} variant="outline" size="sm" className="flex-1 border-[#6366f1]/25 text-violet-ink hover:bg-[#6366f1]/10">
              Aplicar Direto
            </Button>
            {debuff > 0 && (
              <Button type="button" onClick={applyDamageWithDebuff} variant="outline" size="sm" className="flex-1 border-red-500/25 text-danger hover:bg-red-500/10">
                Aplicar c/ Debuff
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-surface border border-line rounded-xl p-5">
        <p className="text-[10px] font-semibold text-ink-faint uppercase tracking-widest mb-3">Ações</p>
        <div className="flex gap-2">
          {userRole === 'MASTER' && (
            <Button type="button" onClick={passTurn} variant="outline" className="flex-1 border-[#6366f1]/20 text-violet-ink hover:bg-[#6366f1]/10">
              ⚡ Passar Turno
            </Button>
          )}
          <Button type="button" onClick={clearCombat} variant="outline" className="flex-1 border-line text-ink-muted hover:bg-ink/5">
            Limpar Combate
          </Button>
        </div>
      </div>
    </div>
  );
}

function CombatInput({ label, value, onChange, colorClass }: { label: string; value: number; onChange: (v: number) => void; colorClass: string }) {
  return (
    <div>
      <p className="text-ink-faint text-[10px] uppercase tracking-wide mb-1.5">{label}</p>
      <input
        type="number"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min="0"
        className={cn(
          'w-full bg-canvas border rounded-lg text-center text-xl font-bold py-2 outline-none focus:ring-1 focus:ring-[#6366f1] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          colorClass
        )}
      />
    </div>
  );
}
