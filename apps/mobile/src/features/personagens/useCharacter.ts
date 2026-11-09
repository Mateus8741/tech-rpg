import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

import { getCharacter, updateCharacter, type Character } from '@/lib/api';
import { useRequiredSession } from '@/lib/session';

const DEBOUNCE_MS = 600;

/**
 * Carrega um personagem e aplica edições de forma otimista.
 * As alterações aparecem na hora, são enviadas em lote (debounce) e, se o servidor
 * recusar, a tela volta para o último estado confirmado.
 */
export function useCharacter(id: string) {
  const { username, role } = useRequiredSession();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentRef = useRef<Character | null>(null);
  const confirmedRef = useRef<Character | null>(null);
  const pendingRef = useRef<Partial<Character>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chainRef = useRef<Promise<void>>(Promise.resolve());

  const apply = useCallback((c: Character | null) => {
    currentRef.current = c;
    setCharacter(c);
  }, []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const c = await getCharacter(id, username);
      confirmedRef.current = c;
      apply(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar ficha');
    } finally {
      setLoading(false);
    }
  }, [id, username, apply]);

  useEffect(() => {
    void load();
  }, [load]);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const payload = pendingRef.current;
    if (Object.keys(payload).length === 0) return chainRef.current;
    pendingRef.current = {};
    setSaving(true);
    chainRef.current = chainRef.current.then(async () => {
      try {
        await updateCharacter(id, username, payload);
        if (confirmedRef.current) confirmedRef.current = { ...confirmedRef.current, ...payload };
      } catch (e) {
        // Desfaz tudo o que não foi confirmado (inclusive alterações ainda pendentes).
        pendingRef.current = {};
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        apply(confirmedRef.current);
        Alert.alert('Não foi possível salvar', e instanceof Error ? e.message : 'Tente novamente.');
      } finally {
        if (Object.keys(pendingRef.current).length === 0) setSaving(false);
      }
    });
    return chainRef.current;
  }, [id, username, apply]);

  /** Aplica na tela e agenda o envio. `immediate` envia já (sem debounce). */
  const patch = useCallback(
    (partial: Partial<Character> | ((c: Character) => Partial<Character>), opts: { immediate?: boolean } = {}) => {
      const cur = currentRef.current;
      if (!cur) return;
      const p = typeof partial === 'function' ? partial(cur) : partial;
      apply({ ...cur, ...p });
      pendingRef.current = { ...pendingRef.current, ...p };
      if (opts.immediate) {
        void flush();
        return;
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => void flush(), DEBOUNCE_MS);
    },
    [apply, flush],
  );

  // Ao sair da tela, envia o que estiver pendente.
  useEffect(() => () => void flush(), [flush]);

  return { character, loading, error, saving, username, role, patch, reload: load, flush };
}

export type CharacterApi = ReturnType<typeof useCharacter>;
