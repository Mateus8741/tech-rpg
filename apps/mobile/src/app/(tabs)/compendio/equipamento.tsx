import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { ARMOR, GEAR, WEAPONS } from '@repo/rules';

import { Badge, Body, Card, Heading, Muted, ScrollScreen, SearchBar } from '@/components/ui';
import { Reveal, RevealItem } from '@/components/motion';
import { NoResults, Segmented } from '@/features/compendio/components';
import { matches } from '@/features/compendio/utils';

type Tab = 'armas' | 'armaduras' | 'itens';

export default function EquipmentScreen() {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Tab>('armas');
  const tabs: Tab[] = ['armas', 'armaduras', ...(GEAR.length ? (['itens'] as const) : [])];
  const labels: Record<Tab, string> = {
    armas: `Armas (${WEAPONS.length})`,
    armaduras: `Armaduras (${ARMOR.length})`,
    itens: `Equipamento (${GEAR.length})`,
  };
  return (
    <ScrollScreen>
      <Reveal>
        <Text className="font-display text-[30px] leading-9 text-gold-ink">Arsenal</Text>
        <Muted>Armas, armaduras e itens de aventura.</Muted>
      </Reveal>
      <SearchBar value={q} onChangeText={setQ} placeholder="Buscar equipamento…" />
      <Segmented options={tabs} value={tab} onChange={setTab} labels={labels} />
      {tab === 'armas' && <Weapons q={q} />}
      {tab === 'armaduras' && <Armors q={q} />}
      {tab === 'itens' && <Gear q={q} />}
    </ScrollScreen>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View className="min-w-[64px] gap-0.5">
      <Muted className="text-[11px]">{label}</Muted>
      <Text className={accent ? 'font-display text-lg text-gold-ink' : 'text-sm text-ink-body'}>{value}</Text>
    </View>
  );
}

const WEAPON_CATS = ['Todas', 'Simples', 'Marcial'] as const;
const WEAPON_KINDS = ['Todas', 'Corpo a corpo', 'À distância'] as const;

function Weapons({ q }: { q: string }) {
  const [cat, setCat] = useState<(typeof WEAPON_CATS)[number]>('Todas');
  const [kind, setKind] = useState<(typeof WEAPON_KINDS)[number]>('Todas');
  const list = useMemo(
    () =>
      WEAPONS.filter(
        (w) => (cat === 'Todas' || w.category === cat) && (kind === 'Todas' || w.kind === kind) && matches(q, w.name, w.damage, ...w.properties),
      ),
    [q, cat, kind],
  );
  return (
    <View className="gap-3">
      <Segmented options={WEAPON_CATS} value={cat} onChange={setCat} />
      <Segmented options={WEAPON_KINDS} value={kind} onChange={setKind} />
      {list.length === 0 ? (
        <NoResults text="Nenhuma arma encontrada." />
      ) : (
        list.map((w, i) => (
          <RevealItem key={w.name} index={i}>
          <Card className="gap-3 rounded-3xl">
            <View className="flex-row items-start justify-between gap-2">
              <Heading className="flex-1">{w.name}</Heading>
              <Badge tone={w.category === 'Marcial' ? 'violet' : 'neutral'}>{`${w.category} · ${w.kind}`}</Badge>
            </View>
            <View className="flex-row flex-wrap gap-x-5 gap-y-2">
              <Stat label="Dano" value={w.damage} accent />
              <Stat label="Custo" value={w.cost} />
              <Stat label="Peso" value={w.weight} />
            </View>
            {w.properties.length > 0 && (
              <View className="flex-row flex-wrap gap-1.5">
                {w.properties.map((p) => (
                  <Badge key={p}>{p}</Badge>
                ))}
              </View>
            )}
          </Card>
          </RevealItem>
        ))
      )}
    </View>
  );
}

const ARMOR_CATS = ['Todas', 'Leve', 'Média', 'Pesada', 'Escudo'] as const;

function Armors({ q }: { q: string }) {
  const [cat, setCat] = useState<(typeof ARMOR_CATS)[number]>('Todas');
  const list = useMemo(() => ARMOR.filter((a) => (cat === 'Todas' || a.category === cat) && matches(q, a.name, a.category)), [q, cat]);
  return (
    <View className="gap-3">
      <Segmented options={ARMOR_CATS} value={cat} onChange={setCat} />
      {list.length === 0 ? (
        <NoResults text="Nenhuma armadura encontrada." />
      ) : (
        list.map((a, i) => (
          <RevealItem key={a.name} index={i}>
          <Card className="gap-3 rounded-3xl">
            <View className="flex-row items-start justify-between gap-2">
              <Heading className="flex-1">{a.name}</Heading>
              <Badge tone="indigo">{a.category}</Badge>
            </View>
            <Stat label="Classe de Armadura" value={a.ac} accent />
            <View className="flex-row flex-wrap gap-x-5 gap-y-2">
              <Stat label="Força" value={a.strengthReq ? `For ${a.strengthReq}` : '—'} />
              <Stat label="Furtividade" value={a.stealthDisadvantage ? 'Desvantagem' : '—'} />
              <Stat label="Custo" value={a.cost} />
              <Stat label="Peso" value={a.weight} />
            </View>
          </Card>
          </RevealItem>
        ))
      )}
    </View>
  );
}

function Gear({ q }: { q: string }) {
  const cats = useMemo(() => ['Todas', ...Array.from(new Set(GEAR.map((g) => g.category)))], []);
  const [cat, setCat] = useState('Todas');
  const list = useMemo(() => GEAR.filter((g) => (cat === 'Todas' || g.category === cat) && matches(q, g.name, g.category, (g as { description?: string }).description)), [q, cat]);
  return (
    <View className="gap-3">
      {cats.length > 2 && <Segmented options={cats} value={cat} onChange={setCat} />}
      {list.length === 0 ? (
        <NoResults text="Nenhum item encontrado." />
      ) : (
        list.map((g, i) => (
          <RevealItem key={g.name} index={i}>
          <Card className="gap-2 rounded-3xl">
            <View className="flex-row items-start justify-between gap-2">
              <Heading className="flex-1">{g.name}</Heading>
              <Badge>{g.category}</Badge>
            </View>
            <View className="flex-row flex-wrap gap-x-5 gap-y-2">
              <Stat label="Custo" value={g.cost} />
              <Stat label="Peso" value={g.weight} />
            </View>
            {(g as { description?: string }).description ? (
              <Body className="text-ink-body">{(g as { description?: string }).description}</Body>
            ) : null}
          </Card>
          </RevealItem>
        ))
      )}
    </View>
  );
}
