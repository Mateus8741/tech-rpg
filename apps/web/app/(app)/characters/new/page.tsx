'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter, type Character } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';

export default function NewCharacterPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    if (!savedUsername) {
      router.push('/');
      return;
    }
    setUsername(savedUsername);
  }, [router]);

  const handleSubmit = async (characterData: Partial<Character>) => {
    try {
      await createCharacter(username, characterData);
      router.push('/characters');
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      alert('Erro ao criar personagem. Tente novamente.');
    }
  };

  if (!username) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>➕ Criar Novo Personagem</h1>
      <CharacterForm onSubmit={handleSubmit} />
    </div>
  );
}

