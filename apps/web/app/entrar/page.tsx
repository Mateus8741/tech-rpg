'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { login } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Partículas determinísticas (evita divergência de hidratação)
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 2 + (i % 3),
  delay: (i % 7) * 0.7,
  duration: 6 + (i % 5) * 1.5,
}));

function D20({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      <path d="M32 4 56 18v28L32 60 8 46V18z" />
      <path d="M32 4 20 36h24zM8 18l12 18M56 18 44 36M20 36 32 60l12-24M8 46l12-10M56 46 44 36" />
    </svg>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('rpg_username');
    if (saved) setUsername(saved);
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
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas p-4">
      {/* Fundo: gradientes à deriva, grade e partículas */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="animate-drift absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-indigo/20 blur-[110px]" />
        <div className="animate-drift absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full bg-violet/20 blur-[120px] [animation-delay:-6s]" />
        <div className="animate-drift absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/10 blur-[110px] [animation-delay:-11s]" />
        {!reduce &&
          PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-gold/70"
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -40, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rune-border relative w-full max-w-sm p-8 shadow-2xl shadow-black/50"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="animate-float relative mb-4">
            <div aria-hidden className="absolute inset-0 rounded-full bg-gold/30 blur-xl" />
            <D20 className="relative h-16 w-16 text-gold" />
          </div>
          <h1 className="font-display text-gold-gradient glow-text text-center text-2xl font-bold">
            Sistema de Fichas RPG
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">Gerenciamento de Personagens D&amp;D</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Nome de Usuário
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome"
              disabled={loading}
              className="border-line-strong bg-canvas text-ink placeholder:text-ink-faint focus-visible:ring-indigo"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role" className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Tipo de Usuário
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as 'PLAYER' | 'MASTER')} disabled={loading}>
              <SelectTrigger id="role" className="border-line-strong bg-canvas text-ink focus:ring-indigo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-line-strong bg-surface">
                <SelectItem value="PLAYER" className="text-ink focus:bg-indigo/20">Jogador</SelectItem>
                <SelectItem value="MASTER" className="text-ink focus:bg-indigo/20">Mestre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !username.trim()}
            className="bg-brand-gradient mt-2 w-full border-0 font-semibold text-white shadow-[0_8px_24px_-8px_rgb(99_102_241/0.7)] hover:brightness-110"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="rune-divider mt-6 text-[10px]" aria-hidden>◆</div>
        <div className="mt-4 space-y-1.5">
          <p className="text-xs text-ink-faint">
            <span className="font-medium text-ink-soft">Jogador</span> — acessa apenas suas próprias fichas
          </p>
          <p className="text-xs text-ink-faint">
            <span className="font-medium text-ink-soft">Mestre</span> — acessa todas as fichas dos jogadores
          </p>
        </div>
      </motion.div>
    </div>
  );
}
