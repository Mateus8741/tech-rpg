'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Swords } from 'lucide-react';
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

export default function Home() {
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
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#13151f] border border-[#1e2035] rounded-2xl p-8 shadow-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-2xl flex items-center justify-center mb-4">
            <Swords className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#e2e8f0]">Sistema de Fichas RPG</h1>
          <p className="text-sm text-[#64748b] mt-1">Gerenciamento de Personagens D&D</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
              Nome de Usuário
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome"
              disabled={loading}
              className="bg-[#0f1117] border-[#2d2f45] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#6366f1]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
              Tipo de Usuário
            </label>
            <Select value={role} onValueChange={(v) => setRole(v as 'PLAYER' | 'MASTER')} disabled={loading}>
              <SelectTrigger className="bg-[#0f1117] border-[#2d2f45] text-[#e2e8f0] focus:ring-[#6366f1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#13151f] border-[#2d2f45]">
                <SelectItem value="PLAYER" className="text-[#e2e8f0] focus:bg-[#6366f1]/20">Jogador</SelectItem>
                <SelectItem value="MASTER" className="text-[#e2e8f0] focus:bg-[#6366f1]/20">Mestre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-0 font-semibold mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#1e2035] space-y-1.5">
          <p className="text-xs text-[#475569]">
            <span className="text-[#94a3b8] font-medium">Jogador</span> — acessa apenas suas próprias fichas
          </p>
          <p className="text-xs text-[#475569]">
            <span className="text-[#94a3b8] font-medium">Mestre</span> — acessa todas as fichas dos jogadores
          </p>
        </div>
      </div>
    </div>
  );
}
