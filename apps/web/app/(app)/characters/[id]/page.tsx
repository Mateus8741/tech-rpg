'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCharacter, updateCharacter, type Character } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';
import { toast } from 'sonner';

export default function EditCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    const savedRole = localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER';
    if (!savedUsername) { router.push('/'); return; }
    setUsername(savedUsername);
    setUserRole(savedRole || 'PLAYER');
    loadCharacter(savedUsername);
  }, [router, params.id]);

  const loadCharacter = async (user: string) => {
    try {
      setLoading(true);
      const data = await getCharacter(params.id as string, user);
      setCharacter(data);
    } catch {
      toast.error('Erro ao carregar personagem. Verifique suas permissões.');
      router.push('/characters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (characterData: Partial<Character>) => {
    try {
      await updateCharacter(params.id as string, username, characterData);
      toast.success('Personagem salvo!');
      router.push('/characters');
    } catch {
      toast.error('Erro ao salvar personagem. Tente novamente.');
    }
  };

  const handleCombatUpdate = async () => {
    try {
      const data = await getCharacter(params.id as string, username);
      setCharacter(data);
    } catch {
      console.error('Erro ao recarregar personagem');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-[#64748b]">Carregando...</div>;
  }

  if (!character) {
    return <div className="flex items-center justify-center h-full text-[#64748b]">Personagem não encontrado</div>;
  }

  return (
    <CharacterForm
      character={character}
      onSubmit={handleSubmit}
      username={username}
      userRole={userRole}
      onCombatUpdate={handleCombatUpdate}
    />
  );
}
