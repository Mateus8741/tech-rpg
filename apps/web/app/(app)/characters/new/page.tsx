'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterWizard from '@/components/wizard/CharacterWizard';

export default function NewCharacterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rpg_username');
    if (!saved) { router.push('/'); return; }
    setUsername(saved);
  }, [router]);

  if (!username) return null;

  return <CharacterWizard username={username} />;
}
