// Monta os documentos da busca a partir de @repo/rules. O pacote é recebido por parâmetro para
// continuar sendo carregado sob demanda (ele é grande).
import type { ActionCost } from '@repo/rules';
import {
  createIndex, damageIn, healsIn, norm, prepareDoc,
  type DocInput, type SearchDoc, type SearchIndex, type SearchVocab,
} from './engine';

export * from './engine';

type Rules = typeof import('@repo/rules');

const COST_TAGS: Partial<Record<ActionCost, string[]>> = {
  acao: ['ação'], bonus: ['ação bônus'], reacao: ['reação'],
};

const DAMAGE_TAGS: Record<string, string> = {
  flamejante: 'fogo flamejante', congelante: 'gelo frio congelante', venenoso: 'veneno venenoso', acido: 'ácido',
  eletrico: 'raio elétrico', trovejante: 'trovão trovejante', necrotico: 'necrótico', radiante: 'radiante',
  psiquico: 'psíquico', forca: 'força energia', cortante: 'cortante', perfurante: 'perfurante', concussao: 'concussão',
};

function textFacets(text: string) {
  const n = norm(text);
  const damage = damageIn(n);
  const heals = healsIn(n);
  return {
    damage, heals, dealsDamage: damage.length > 0 || /\bdano\b/.test(n),
    tags: [...damage.map((d) => DAMAGE_TAGS[d] ?? d), ...(heals ? ['cura'] : [])],
  };
}

function ruleDocs(r: Rules): DocInput[] {
  const out: DocInput[] = [];
  const className = (id: string) => r.CLASSES.find((c) => c.id === id)?.name ?? id;

  for (const s of r.SPELLS) {
    const cost = r.spellActionCost(s);
    const t = textFacets(`${s.description} ${s.atHigherLevels ?? ''}`);
    const levelLabel = s.level === 0 ? 'Truque' : `${s.level}º círculo`;
    out.push({
      key: `spell:${s.id}`, group: 'Magias', title: s.name,
      sub: `${levelLabel} · ${s.school} · ${s.castingTime}`,
      aliases: r.SPELL_ALIASES[s.id],
      tags: [
        levelLabel, s.school, ...s.classes.map(className), ...(COST_TAGS[cost] ?? []),
        ...(s.concentration ? ['concentração'] : []), ...(s.ritual ? ['ritual'] : []), ...t.tags,
      ],
      body: s.atHigherLevels ? `${s.description}\n${s.atHigherLevels}` : s.description,
      facets: {
        spellLevel: s.level, classes: s.classes, school: s.school, cost,
        concentration: s.concentration, ritual: s.ritual,
        damage: t.damage, heals: t.heals, dealsDamage: t.dealsDamage,
      },
      target: { entry: { kind: 'spell', id: s.id } },
    });
  }

  for (const c of r.CLASSES) {
    out.push({
      key: `class:${c.id}`, group: 'Classes', title: c.name, sub: `Classe · d${c.hitDie}`,
      tags: ['classe', c.subclassLabel], body: c.summary,
      facets: { classes: [c.id] },
      target: { entry: { kind: 'class', id: c.id } },
    });
    for (const f of c.features) {
      const cost = r.featureActionCost(f.description);
      const t = textFacets(f.description);
      out.push({
        key: `feature:${c.id}:${f.level}:${f.name}`, group: 'Características', title: f.name,
        sub: `${c.name} · Nível ${f.level}`,
        tags: [c.name, 'característica', ...(COST_TAGS[cost] ?? []), ...t.tags], body: f.description,
        facets: { classes: [c.id], cost, featureLevel: f.level, damage: t.damage, heals: t.heals, dealsDamage: t.dealsDamage },
        target: { entry: { kind: 'feature', classId: c.id, name: f.name } },
      });
    }
    for (const s of c.subclasses) {
      out.push({
        key: `subclass:${c.id}:${s.id}`, group: 'Classes', title: s.name, sub: `${c.subclassLabel} · ${c.name}`,
        tags: [c.name, c.subclassLabel, 'subclasse'], body: s.description,
        facets: { classes: [c.id] },
        target: { entry: { kind: 'subclass', classId: c.id, id: s.id } },
      });
      for (const f of s.features) {
        const cost = r.featureActionCost(f.description);
        const t = textFacets(f.description);
        out.push({
          key: `feature:${c.id}:${s.id}:${f.level}:${f.name}`, group: 'Características', title: f.name,
          sub: `${s.name} (${c.name}) · Nível ${f.level}`,
          tags: [c.name, s.name, 'característica', ...(COST_TAGS[cost] ?? []), ...t.tags], body: f.description,
          facets: { classes: [c.id], cost, featureLevel: f.level, damage: t.damage, heals: t.heals, dealsDamage: t.dealsDamage },
          target: { entry: { kind: 'feature', classId: c.id, subclassId: s.id, name: f.name } },
        });
      }
    }
  }

  for (const x of r.RACES) {
    out.push({
      key: `race:${x.id}`, group: 'Raças', title: x.name, sub: 'Raça',
      tags: ['raça', x.size, ...x.languages], body: x.summary,
      target: { entry: { kind: 'race', id: x.id } },
    });
    const addTraits = (traits: { name: string; description: string }[], owner: string, subraceId?: string) => {
      for (const t of traits) {
        const cost = r.featureActionCost(t.description);
        const f = textFacets(t.description);
        out.push({
          key: `trait:${x.id}:${subraceId ?? ''}:${t.name}`, group: 'Características', title: t.name, sub: `Traço · ${owner}`,
          tags: [owner, x.name, 'traço', ...(COST_TAGS[cost] ?? []), ...f.tags], body: t.description,
          facets: { cost, damage: f.damage, heals: f.heals, dealsDamage: f.dealsDamage },
          target: { entry: { kind: 'trait', raceId: x.id, subraceId, name: t.name } },
        });
      }
    };
    addTraits(x.traits, x.name);
    for (const s of x.subraces) {
      out.push({
        key: `subrace:${x.id}:${s.id}`, group: 'Raças', title: s.name, sub: `Sub-raça · ${x.name}`,
        tags: [x.name, 'sub-raça'], body: s.traits.map((t) => t.name).join(', '),
        target: { entry: { kind: 'subrace', raceId: x.id, id: s.id } },
      });
      addTraits(s.traits, s.name, s.id);
    }
  }

  for (const x of r.BACKGROUNDS) {
    out.push({
      key: `background:${x.id}`, group: 'Antecedentes', title: x.name, sub: `Antecedente · ${x.feature.name}`,
      aliases: [x.feature.name], tags: ['antecedente', ...x.tools], body: `${x.summary}\n${x.feature.description}`,
      target: { entry: { kind: 'background', id: x.id } },
    });
  }

  for (const w of r.WEAPONS) {
    const t = textFacets(`dano ${w.damage}`);
    out.push({
      key: `weapon:${w.name}`, group: 'Equipamento', title: w.name, sub: `Arma ${w.category.toLowerCase()} · ${w.damage}`,
      tags: ['arma', w.category, w.kind, w.damage, ...w.properties], body: w.properties.join(', '),
      facets: { damage: t.damage, dealsDamage: true },
      target: { entry: { kind: 'weapon', name: w.name } },
    });
  }
  for (const a of r.ARMOR) {
    out.push({
      key: `armor:${a.name}`, group: 'Equipamento', title: a.name, sub: `Armadura ${a.category.toLowerCase()} · CA ${a.ac}`,
      tags: ['armadura', a.category],
      target: { entry: { kind: 'armor', name: a.name } },
    });
  }
  for (const g of r.GEAR) {
    out.push({
      key: `gear:${g.name}`, group: 'Equipamento', title: g.name, sub: `${g.category} · ${g.cost}`,
      tags: ['equipamento', 'item', g.category],
      target: { entry: { kind: 'gear', name: g.name } },
    });
  }

  for (const a of r.COMBAT_ACTIONS) {
    out.push({
      key: `action:${a.id}`, group: 'Regras', title: a.name, sub: `${r.ACTION_COST_LABEL[a.cost]} · ${a.summary}`,
      tags: ['combate', ...(COST_TAGS[a.cost] ?? [])], body: a.description,
      facets: { cost: a.cost },
      target: { entry: { kind: 'action', id: a.id } },
    });
  }
  for (const c of r.CONDITIONS) {
    out.push({
      key: `condition:${c.id}`, group: 'Regras', title: c.name, sub: 'Condição',
      tags: ['condição'], body: c.description.join('\n'),
      target: { entry: { kind: 'condition', id: c.id } },
    });
  }
  for (const s of r.RULE_SECTIONS) {
    out.push({
      key: `rule:${s.id}`, group: 'Regras', title: s.title, sub: 'Seção de regras',
      tags: ['regra'], body: s.body.join('\n'),
      target: { entry: { kind: 'rule', id: s.id } },
    });
  }
  return out;
}

export interface RulesCorpus {
  docs: SearchDoc[];
  vocab: SearchVocab;
}

/** Trabalho pesado da busca: roda uma vez, ao abrir a paleta pela primeira vez. */
export function buildRulesCorpus(r: Rules): RulesCorpus {
  const classes: SearchVocab['classes'] = new Map(r.CLASSES.map((c) => [norm(c.name), { id: c.id, label: c.name }]));
  const guardiao = r.CLASSES.find((c) => c.id === 'guardiao');
  if (guardiao) classes.set('patrulheiro', { id: guardiao.id, label: guardiao.name });
  return { docs: ruleDocs(r).map(prepareDoc), vocab: { classes } };
}

/** Junta páginas e fichas do usuário ao acervo de regras. */
export const composeIndex = (corpus: RulesCorpus | null, extra: SearchDoc[]): SearchIndex =>
  createIndex([...extra, ...(corpus?.docs ?? [])], corpus?.vocab ?? { classes: new Map() });
