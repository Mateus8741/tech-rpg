import { Redirect } from 'expo-router';

import { useSession } from '@/lib/session';

/** Rota inicial "/": manda para as abas se logado, senão para o login. */
export default function Index() {
  const { session } = useSession();
  return <Redirect href={session ? '/personagens' : '/login'} />;
}
