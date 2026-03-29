'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter, type Character } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';
import { toast } from 'sonner';

export default function NewCharacterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rpg_username');
    if (!saved) { router.push('/'); return; }
    setUsername(saved);
  }, [router]);

  const handleSubmit = async (characterData: Partial<Character>) => {
    try {
      await createCharacter(username, characterData);
      toast.success('Personagem criado!');
      router.push('/characters');
    } catch {
      toast.error('Erro ao criar personagem. Tente novamente.');
    }
  };

  if (!username) return null;

  return <CharacterForm onSubmit={handleSubmit} />;
}
