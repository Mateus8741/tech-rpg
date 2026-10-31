'use client';

import { useParams } from 'next/navigation';
import CharacterSheet from '@/components/sheet/CharacterSheet';

export default function CharacterPage() {
  const params = useParams<{ id: string }>();
  return <CharacterSheet id={params.id} />;
}
