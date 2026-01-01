'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCharacters, deleteCharacter, type Character, type User } from '@/lib/api';
import styles from './page.module.css';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    const savedRole = localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER';

    if (!savedUsername) {
      router.push('/');
      return;
    }

    setUsername(savedUsername);
    setUserRole(savedRole || 'PLAYER');
    loadCharacters(savedUsername);
  }, [router]);

  const loadCharacters = async (user: string) => {
    try {
      setLoading(true);
      const data = await getCharacters(user);
      setCharacters(data);
    } catch (err) {
      setError('Erro ao carregar personagens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este personagem?')) return;

    try {
      await deleteCharacter(id, username);
      await loadCharacters(username);
    } catch (err) {
      setError('Erro ao deletar personagem');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rpg_username');
    localStorage.removeItem('rpg_role');
    router.push('/');
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>📜 Meus Personagens</h1>
          <p className={styles.userInfo}>
            Usuário: <strong>{username}</strong> | 
            Tipo: <strong>{userRole === 'MASTER' ? '👑 Mestre' : '🎲 Jogador'}</strong>
          </p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/characters/new" className={styles.button}>
            ➕ Novo Personagem
          </Link>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {characters.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum personagem criado ainda.</p>
          <Link href="/characters/new" className={styles.button}>
            Criar Primeiro Personagem
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {characters.map((character) => (
            <div key={character.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{character.name}</h2>
                {userRole === 'MASTER' && character.user && (
                  <span className={styles.owner}>👤 {character.user.username}</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <p><strong>Raça:</strong> {character.race}</p>
                <p><strong>Classe:</strong> {character.class}</p>
                <p><strong>Nível:</strong> {character.level}</p>
                <p><strong>PV:</strong> {character.currentHitPoints}/{character.maxHitPoints}</p>
                <p><strong>CA:</strong> {character.armorClass}</p>
              </div>
              <div className={styles.cardActions}>
                <Link href={`/characters/${character.id}`} className={styles.editButton}>
                  ✏️ Editar
                </Link>
                <button
                  onClick={() => handleDelete(character.id)}
                  className={styles.deleteButton}
                >
                  🗑️ Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

