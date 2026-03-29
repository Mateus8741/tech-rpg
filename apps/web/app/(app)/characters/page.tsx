'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, LogOut, Trash2, Pencil, Users } from 'lucide-react';
import { getCharacters, deleteCharacter, type Character } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<'PLAYER' | 'MASTER'>('PLAYER');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem('rpg_username');
    const savedRole = localStorage.getItem('rpg_role') as 'PLAYER' | 'MASTER';
    if (!savedUsername) { router.push('/'); return; }
    setUsername(savedUsername);
    setUserRole(savedRole || 'PLAYER');
    loadCharacters(savedUsername);
  }, [router]);

  const loadCharacters = async (user: string) => {
    try {
      setLoading(true);
      const data = await getCharacters(user);
      setCharacters(data);
    } catch {
      toast.error('Erro ao carregar personagens');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCharacter(deleteId, username);
      await loadCharacters(username);
      toast.success('Personagem excluído');
    } catch {
      toast.error('Erro ao excluir personagem');
    } finally {
      setDeleteId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rpg_username');
    localStorage.removeItem('rpg_role');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#64748b]">
        Carregando...
      </div>
    );
  }

  return (
    <>
      {/* Top bar */}
      <div className="h-[52px] border-b border-[#1e2035] px-6 flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-sm font-semibold text-[#e2e8f0]">Personagens</p>
          <p className="text-xs text-[#475569]">{characters.length} personagen{characters.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Sair
          </Button>
          <Link href="/characters/new">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white border-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Novo Personagem
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-16 h-16 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-[#6366f1]/60" />
            </div>
            <p className="text-[#475569]">Nenhum personagem criado ainda.</p>
            <Link href="/characters/new">
              <Button className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white border-0">
                <Plus className="w-4 h-4 mr-1.5" />
                Criar Primeiro Personagem
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                userRole={userRole}
                onDelete={() => setDeleteId(character.id)}
              />
            ))}
            {/* Add new card */}
            <Link href="/characters/new" className="group">
              <div className="h-full min-h-[160px] border-2 border-dashed border-[#1e2035] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors hover:border-[#6366f1]/40">
                <div className="w-8 h-8 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg flex items-center justify-center group-hover:bg-[#6366f1]/20 transition-colors">
                  <Plus className="w-4 h-4 text-[#6366f1]/70" />
                </div>
                <span className="text-xs text-[#475569]">Criar personagem</span>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#13151f] border-[#2d2f45]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#e2e8f0]">Excluir personagem?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#64748b]">
              Esta ação não pode ser desfeita. O personagem será excluído permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#2d2f45] text-[#94a3b8] hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CharacterCard({
  character,
  userRole,
  onDelete,
}: {
  character: Character;
  userRole: 'PLAYER' | 'MASTER';
  onDelete: () => void;
}) {
  return (
    <div className="bg-[#13151f] border border-[#1e2035] rounded-xl overflow-hidden hover:border-[#2d2f45] transition-colors">
      {/* Top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3 mt-1">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#e2e8f0] truncate">{character.name}</p>
            <p className="text-xs text-[#64748b] truncate">{character.race} • {character.class}</p>
          </div>
          <Badge
            variant="outline"
            className="ml-2 border-[#6366f1]/30 text-[#a78bfa] bg-[#6366f1]/10 text-[10px] flex-shrink-0"
          >
            Nv {character.level}
          </Badge>
        </div>

        {userRole === 'MASTER' && character.user && (
          <p className="text-[10px] text-[#475569] mb-2">
            👤 {character.user.username}
          </p>
        )}

        {/* Stats row */}
        <div className="flex gap-1.5 mb-3">
          {[
            { label: 'HP', value: `${character.currentHitPoints}`, color: 'text-[#f87171] bg-red-500/10 border-red-500/20' },
            { label: 'CA', value: `${character.armorClass}`, color: 'text-[#94a3b8] bg-white/5 border-[#1e2035]' },
            { label: 'MP', value: `${character.currentMana}`, color: 'text-[#818cf8] bg-[#818cf8]/10 border-[#818cf8]/20' },
          ].map(({ label, value, color }) => (
            <div key={label} className={cn('flex-1 rounded-lg border px-2 py-1.5 text-center', color)}>
              <p className="text-[13px] font-bold leading-none">{value}</p>
              <p className="text-[9px] uppercase tracking-wide mt-0.5 opacity-60">{label}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <Link href={`/characters/${character.id}`} className="flex-1">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-7 text-[11px] border-[#6366f1]/20 text-[#a78bfa] bg-[#6366f1]/8 hover:bg-[#6366f1]/15 hover:border-[#6366f1]/40"
            >
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="flex-1 h-7 text-[11px] border-red-500/20 text-red-400 bg-red-500/8 hover:bg-red-500/15 hover:border-red-500/40"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
