import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getCharacters } from '@/lib/api';

type State = { status: 'loading' } | { status: 'ok'; count: number } | { status: 'error' };

/** Quantidade de personagens do usuário (via getCharacters), recarregada ao focar a tela. */
export function useCharacterCount(username: string | undefined) {
  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async () => {
    if (!username) return;
    // Mantém o número anterior enquanto recarrega.
    setState((s) => (s.status === 'ok' ? s : { status: 'loading' }));
    try {
      const list = await getCharacters(username);
      setState({ status: 'ok', count: list?.length ?? 0 });
    } catch {
      setState({ status: 'error' });
    }
  }, [username]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return { state, reload: load };
}
