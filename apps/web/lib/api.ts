const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Equipment {
  name: string;
  defense?: number;
  attack?: number;
  weight?: number;     // kg por unidade
  quantity?: number;   // padrão 1
  equipped?: boolean;  // armadura/escudo/arma em uso
}

export interface Ability {
  name: string;
  level: number;
  cost: number;
  damage: string; // Rolagem de dano, ex: "1d6+3", "2d8", "1d4"
}

export interface InventoryItem {
  name: string;
  quantity: number;
  max: number;
  weight?: number;     // kg por unidade
}

export interface CombatStatus {
  damage?: number; // Dano recebido
  debuff?: number; // Valor do debuff
  turns?: number; // Turnos restantes do debuff
  currentTurn?: number; // Turno atual do combate
}

export interface User {
  id: string;
  username: string;
  role: 'PLAYER' | 'MASTER';
  characters?: Character[];
}

export interface Character {
  id: string;
  userId: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background?: string;
  alignment?: string;
  experience: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  strengthModifier: number;
  dexterityModifier: number;
  constitutionModifier: number;
  intelligenceModifier: number;
  wisdomModifier: number;
  charismaModifier: number;
  maxHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
  maxMana: number;
  currentMana: number;
  armorClass: number;
  skills: Record<string, any>;
  proficiencies: any[];
  equipment: Equipment[];
  abilities: Ability[];
  inventory: InventoryItem[];
  combatStatus?: CombatStatus;
  spells: any[];
  features: any[];
  notes: string;
  customData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
  };
}

// Auth
export async function login(username: string, role?: 'PLAYER' | 'MASTER'): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, role }),
  });
  if (!response.ok) throw new Error('Erro ao fazer login');
  const data = await response.json();
  return data.user;
}

export async function getUser(username: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/auth?username=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error('Erro ao buscar usuário');
  const data = await response.json();
  return data.user;
}

// Characters
export async function getCharacters(username: string): Promise<Character[]> {
  const response = await fetch(`${API_URL}/api/characters?username=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error('Erro ao buscar personagens');
  const data = await response.json();
  return data.characters;
}

export async function getCharacter(id: string, username: string): Promise<Character> {
  const response = await fetch(`${API_URL}/api/characters/${id}?username=${encodeURIComponent(username)}`);
  if (!response.ok) throw new Error('Erro ao buscar personagem');
  const data = await response.json();
  return data.character;
}

export async function createCharacter(username: string, characterData: Partial<Character>): Promise<Character> {
  const response = await fetch(`${API_URL}/api/characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, ...characterData }),
  });
  if (!response.ok) throw new Error('Erro ao criar personagem');
  const data = await response.json();
  return data.character;
}

export async function updateCharacter(id: string, username: string, characterData: Partial<Character>): Promise<Character> {
  const response = await fetch(`${API_URL}/api/characters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, ...characterData }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    console.error('Erro na resposta:', errorData);
    throw new Error(errorData.error || 'Erro ao atualizar personagem');
  }
  const data = await response.json();
  return data.character;
}

export async function deleteCharacter(id: string, username: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/characters/${id}?username=${encodeURIComponent(username)}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar personagem');
}

