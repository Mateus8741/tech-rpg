'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getCharacter, updateCharacter, type Character } from '@/lib/api';
import CharacterForm from '@/components/CharacterForm';

export default function EditCharacterPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    if (!savedUsername) {
      router.push('/');
      return;
    }
    setUsername(savedUsername);
    loadCharacter(savedUsername);
  }, [router, params.id]);

  const loadCharacter = async (user: string) => {
    try {
      setLoading(true);
      const data = await getCharacter(params.id as string, user);
      setCharacter(data);
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
      alert('Erro ao carregar personagem. Você pode não ter permissão para acessá-lo.');
      router.push('/characters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (characterData: Partial<Character>) => {
    try {
      await updateCharacter(params.id as string, username, characterData);
      router.push('/characters');
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      alert('Erro ao atualizar personagem. Tente novamente.');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;
  }

  if (!character) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Personagem não encontrado</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>✏️ Editar Personagem: {character.name}</h1>
        <Link href="/characters" style={{ padding: '0.5rem 1rem', background: '#666', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>
          ← Voltar
        </Link>
      </div>
      <CharacterForm character={character} onSubmit={handleSubmit} />
    </div>
  );
}

