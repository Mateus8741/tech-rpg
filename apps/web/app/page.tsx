'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getUser, type User } from '@/lib/api';
import styles from './page.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Verifica se já existe um usuário salvo
    const savedUsername = localStorage.getItem('rpg_username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor, insira um nome de usuário');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(username.trim(), role);
      localStorage.setItem('rpg_username', username.trim());
      localStorage.setItem('rpg_role', role);
      router.push('/characters');
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>🎲 Sistema de Fichas RPG</h1>
        <p className={styles.subtitle}>Gerenciamento de Personagens D&D</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nome de Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome"
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Tipo de Usuário</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'PLAYER' | 'MASTER')}
              className={styles.select}
              disabled={loading}
            >
              <option value="PLAYER">Jogador</option>
              <option value="MASTER">Mestre</option>
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={loading || !username.trim()}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className={styles.info}>
          <p>💡 <strong>Jogador:</strong> Acessa apenas suas próprias fichas</p>
          <p>👑 <strong>Mestre:</strong> Acessa todas as fichas de todos os jogadores</p>
        </div>
      </div>
    </div>
  );
}
