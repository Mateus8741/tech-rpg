import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { login as apiLogin } from './api';

export type Role = 'PLAYER' | 'MASTER';

export interface Session {
  username: string;
  role: Role;
}

interface SessionContextValue {
  session: Session | null;
  /** true enquanto a sessão salva ainda está sendo lida do armazenamento. */
  loading: boolean;
  /** Último nome usado, para pré-preencher o login. */
  lastUsername: string;
  signIn: (username: string, role: Role) => Promise<void>;
  signOut: () => Promise<void>;
}

const KEY_USERNAME = 'rpg_username';
const KEY_ROLE = 'rpg_role';
const KEY_ACTIVE = 'rpg_active';

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [lastUsername, setLastUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [[, username], [, role], [, active]] = await AsyncStorage.multiGet([KEY_USERNAME, KEY_ROLE, KEY_ACTIVE]);
        if (username) setLastUsername(username);
        if (username && active === '1') setSession({ username, role: role === 'MASTER' ? 'MASTER' : 'PLAYER' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (username: string, role: Role) => {
    const user = await apiLogin(username, role);
    const next: Session = { username: user.username, role: user.role };
    await AsyncStorage.multiSet([
      [KEY_USERNAME, next.username],
      [KEY_ROLE, next.role],
      [KEY_ACTIVE, '1'],
    ]);
    setLastUsername(next.username);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.setItem(KEY_ACTIVE, '0');
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, loading, lastUsername, signIn, signOut }),
    [session, loading, lastUsername, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>');
  return ctx;
}

/** Para telas dentro de (tabs): a sessão já foi garantida pelo layout. */
export function useRequiredSession(): Session {
  const { session } = useSession();
  if (!session) throw new Error('Sessão ausente');
  return session;
}
