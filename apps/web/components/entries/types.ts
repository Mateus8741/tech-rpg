// Referência a qualquer coisa do jogo que possa abrir no painel de detalhes.
export type EntryRef =
  | { kind: 'spell'; id: string }
  | { kind: 'class'; id: string }
  | { kind: 'subclass'; classId: string; id: string }
  | { kind: 'feature'; classId: string; subclassId?: string; name: string }
  | { kind: 'race'; id: string }
  | { kind: 'subrace'; raceId: string; id: string }
  | { kind: 'trait'; raceId: string; subraceId?: string; name: string }
  | { kind: 'background'; id: string }
  | { kind: 'condition'; id: string }
  | { kind: 'weapon'; name: string }
  | { kind: 'armor'; name: string }
  | { kind: 'gear'; name: string }
  | { kind: 'action'; id: string }
  | { kind: 'rule'; id: string }
  /** Texto livre: característica digitada à mão, item sem correspondência etc. */
  | { kind: 'custom'; title: string; body: string; tag?: string };

export interface ResolvedEntry {
  title: string;
  /** Rótulo curto do tipo: "Característica de Ladino", "Condição"... */
  tag: string;
  /** Pares exibidos em grade no topo. */
  meta: { label: string; value: string }[];
  body: string;
  /** Quando definido, o painel usa o detalhe completo de magia. */
  spellId?: string;
  /** Página do compêndio para ver mais. */
  href?: string;
}
