// Transforma uma EntryRef no conteúdo do painel. Puro: só depende de @repo/rules.
import {
  ACTION_COST_LABEL, ARMOR, BACKGROUNDS, COMBAT_ACTIONS, CONDITIONS, GEAR, RULE_SECTIONS, WEAPONS,
  featureActionCost, getBackground, getClass, getRace, getSpell,
} from '@repo/rules';
import type { EntryRef, ResolvedEntry } from './types';

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

/** Busca por nome ignorando caixa e acentos (nomes vêm digitados à mão na ficha). */
const byName = <T extends { name: string }>(list: T[], name: string) => {
  const n = norm(name);
  return list.find((x) => norm(x.name) === n);
};

/** Nomes usados nas fichas de papel para itens que têm outro nome na tabela de equipamento. */
const GEAR_ALIASES: Record<string, string> = {
  'kit do aventureiro': 'Pacote de Aventureiro',
  'corda': 'Corda de cânhamo (15 metros)',
  'racao': 'Rações de viagem (1 dia)',
  'racoes': 'Rações de viagem (1 dia)',
  'pecas de ladinagem': 'Ferramentas de ladrão',
  'ferramentas de ladinagem': 'Ferramentas de ladrão',
};

const findGear = (name: string) => byName(GEAR, GEAR_ALIASES[norm(name)] ?? name);

const costMeta = (description: string, name: string) => {
  const cost = featureActionCost(description, name);
  return cost === 'passivo' ? [] : [{ label: 'Uso', value: ACTION_COST_LABEL[cost] }];
};

export function resolveEntry(ref: EntryRef): ResolvedEntry | null {
  switch (ref.kind) {
    case 'spell': {
      const s = getSpell(ref.id);
      return s ? { title: s.name, tag: 'Magia', meta: [], body: s.description, spellId: s.id } : null;
    }
    case 'class': {
      const c = getClass(ref.id);
      if (!c) return null;
      return {
        title: c.name, tag: 'Classe', body: c.summary, href: `/compendio/classes/${c.id}`,
        meta: [{ label: 'Dado de vida', value: `d${c.hitDie}` }, { label: c.subclassLabel, value: c.subclasses.map((s) => s.name).join(', ') || '—' }],
      };
    }
    case 'subclass': {
      const c = getClass(ref.classId);
      const s = c?.subclasses.find((x) => x.id === ref.id);
      if (!c || !s) return null;
      return {
        title: s.name, tag: `${c.subclassLabel} de ${c.name}`, href: `/compendio/classes/${c.id}`,
        meta: [{ label: 'A partir do nível', value: String(s.level) }],
        body: [s.description, ...s.features.map((f) => `${f.name} (nível ${f.level})\n${f.description}`)].join('\n\n'),
      };
    }
    case 'feature': {
      const c = getClass(ref.classId);
      const sub = c?.subclasses.find((x) => x.id === ref.subclassId);
      const f = (sub?.features ?? c?.features ?? []).find((x) => x.name === ref.name);
      if (!c || !f) return null;
      return {
        title: f.name, tag: `Característica de ${sub?.name ?? c.name}`, body: f.description, href: `/compendio/classes/${c.id}`,
        meta: [{ label: 'Nível', value: String(f.level) }, ...costMeta(f.description, f.name)],
      };
    }
    case 'race': {
      const r = getRace(ref.id);
      if (!r) return null;
      return {
        title: r.name, tag: 'Raça', href: `/compendio/racas/${r.id}`,
        meta: [{ label: 'Tamanho', value: r.size }, { label: 'Deslocamento', value: `${r.speed} m` }, { label: 'Idiomas', value: r.languages.join(', ') }],
        body: [r.summary, ...r.traits.map((t) => `${t.name}\n${t.description}`)].join('\n\n'),
      };
    }
    case 'subrace': {
      const r = getRace(ref.raceId);
      const s = r?.subraces.find((x) => x.id === ref.id);
      if (!r || !s) return null;
      return {
        title: s.name, tag: `Sub-raça de ${r.name}`, meta: [], href: `/compendio/racas/${r.id}`,
        body: s.traits.map((t) => `${t.name}\n${t.description}`).join('\n\n'),
      };
    }
    case 'trait': {
      const r = getRace(ref.raceId);
      const sub = r?.subraces.find((x) => x.id === ref.subraceId);
      const t = [...(sub?.traits ?? []), ...(r?.traits ?? [])].find((x) => x.name === ref.name);
      if (!r || !t) return null;
      return { title: t.name, tag: `Traço de ${sub?.name ?? r.name}`, body: t.description, meta: costMeta(t.description, t.name), href: `/compendio/racas/${r.id}` };
    }
    case 'background': {
      const b = getBackground(ref.id) ?? BACKGROUNDS.find((x) => x.feature.name === ref.id);
      if (!b) return null;
      return {
        title: b.feature.name, tag: `Antecedente · ${b.name}`, href: `/compendio/antecedentes/${b.id}`,
        meta: b.tools.length ? [{ label: 'Ferramentas', value: b.tools.join(', ') }] : [],
        body: [b.summary, b.feature.description].join('\n\n'),
      };
    }
    case 'condition': {
      const c = CONDITIONS.find((x) => x.id === ref.id);
      return c ? { title: c.name, tag: 'Condição', meta: [], body: c.description.join('\n\n'), href: '/regras' } : null;
    }
    case 'weapon': {
      const w = byName(WEAPONS, ref.name);
      if (!w) return null;
      return {
        title: w.name, tag: `Arma ${w.category.toLowerCase()} · ${w.kind.toLowerCase()}`, body: w.properties.join(' · ') || 'Sem propriedades especiais.',
        meta: [{ label: 'Dano', value: w.damage }, { label: 'Custo', value: w.cost }, { label: 'Peso', value: w.weight }],
        href: '/compendio/equipamento',
      };
    }
    case 'armor': {
      const a = byName(ARMOR, ref.name);
      if (!a) return null;
      return {
        title: a.name, tag: `Armadura ${a.category.toLowerCase()}`, href: '/compendio/equipamento',
        body: a.stealthDisadvantage ? 'Desvantagem em testes de Destreza (Furtividade).' : 'Sem penalidade em Furtividade.',
        meta: [{ label: 'CA', value: a.ac }, { label: 'Custo', value: a.cost }, { label: 'Peso', value: a.weight }, ...(a.strengthReq ? [{ label: 'Força mínima', value: String(a.strengthReq) }] : [])],
      };
    }
    case 'gear': {
      const g = findGear(ref.name);
      if (!g) return null;
      return {
        title: g.name, tag: g.category, body: '', href: '/compendio/equipamento',
        meta: [{ label: 'Custo', value: g.cost }, { label: 'Peso', value: g.weight }],
      };
    }
    case 'action': {
      const a = COMBAT_ACTIONS.find((x) => x.id === ref.id);
      return a ? { title: a.name, tag: ACTION_COST_LABEL[a.cost], meta: [], body: a.description, href: '/regras' } : null;
    }
    case 'rule': {
      const r = RULE_SECTIONS.find((x) => x.id === ref.id);
      return r ? { title: r.title, tag: 'Regra', meta: [], body: r.body.join('\n\n'), href: '/regras' } : null;
    }
    case 'custom':
      return { title: ref.title, tag: ref.tag ?? 'Anotação', meta: [], body: ref.body };
  }
}

/** Ref para um item digitado na ficha: tenta arma, armadura e equipamento, nessa ordem. */
export function itemRef(name: string, fallbackBody = 'Item sem correspondência no compêndio.'): EntryRef {
  if (byName(WEAPONS, name)) return { kind: 'weapon', name };
  if (byName(ARMOR, name)) return { kind: 'armor', name };
  if (findGear(name)) return { kind: 'gear', name };
  return { kind: 'custom', title: name, body: fallbackBody, tag: 'Item' };
}
