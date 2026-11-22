// Conteúdo dos popups por ITEM da ficha de papel (característica, magia, perícia, arma, idioma…).
// Usa os textos completos de @repo/rules; quando não há texto no livro, cai numa explicação geral.
import { ACTION_COST_LABEL, ARMOR, FEATS, SKILLS, WEAPONS, WEAPON_PROPERTIES, featureActionCost, type Spell } from '@repo/rules';

import type { IconName } from '@/components/ui';
import type { AbilityInfo, Zone, ZoneCtx } from './zones';

export type DetailSection = { label: string; lines: string[]; bullets?: boolean };

export type Detail = {
  kicker: string;
  title: string;
  icon: IconName;
  /** Frase de destaque no topo. */
  what?: string;
  /** Etiquetas curtas (ex.: "Ação bônus", "Nível 2"). */
  chips?: string[];
  sections: DetailSection[];
  /** "No seu personagem": valores reais. */
  mine?: string[];
  tip?: string;
};

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const paragraphs = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);

/** Zona (bloco) → Detail. */
export function zoneDetail(z: Zone, ctx: ZoneCtx): Detail {
  return {
    kicker: 'Ficha de papel',
    title: z.title,
    icon: z.icon,
    what: z.what,
    sections: [{ label: 'Como funciona', lines: z.how, bullets: true }],
    mine: z.mine?.(ctx),
    tip: z.tip,
  };
}

// ---------------- Características ----------------

export type FeatureItem = { name: string; description: string; source: string; level?: number };

const COST_HINT: Record<string, string> = {
  acao: 'Usa a sua ação no turno.',
  bonus: 'Usa a sua ação bônus (você só tem uma por turno).',
  reacao: 'Usa a sua reação (uma por rodada, fora do seu turno).',
  livre: 'Não gasta ação nem movimento.',
  outro: 'Costuma ser usada fora de combate ou em tempo longo.',
  passivo: 'Está sempre ativa: não precisa gastar ação.',
};

export function featureDetail(f: FeatureItem): Detail {
  const feat = FEATS.find((x) => norm(x.name) === norm(f.name));
  const description = f.description && !/^Escolha registrada/.test(f.description) ? f.description : feat?.description ?? '';
  const cost = featureActionCost(description, f.name);
  const sections: DetailSection[] = [];
  if (description) sections.push({ label: 'O que faz', lines: paragraphs(description) });
  if (feat?.benefits?.length) sections.push({ label: 'Benefícios', lines: feat.benefits, bullets: true });
  if (!sections.length) {
    sections.push({
      label: 'O que faz',
      lines: ['Esta característica foi registrada na ficha, mas não há texto de regra cadastrado para ela. Consulte o Compêndio ou pergunte ao mestre.'],
    });
  }
  sections.push({ label: 'Como usar', lines: [COST_HINT[cost] ?? ''], bullets: false });
  return {
    kicker: f.source,
    title: f.name,
    icon: 'ribbon-outline',
    what: undefined,
    chips: [ACTION_COST_LABEL[cost], ...(f.level ? [`Nível ${f.level}`] : [])],
    sections,
    tip: feat?.prerequisite ? `Pré-requisito: ${feat.prerequisite}.` : undefined,
  };
}

// ---------------- Magias ----------------

export function spellDetail(sp: Spell, prepared: boolean, ctx: ZoneCtx): Detail {
  const comps = [sp.components.v && 'V (verbal)', sp.components.s && 'S (gestual)', sp.components.m && `M (${sp.components.m})`].filter(Boolean) as string[];
  const lines = [
    `Tempo de conjuração: ${sp.castingTime}`,
    `Alcance: ${sp.range}`,
    `Componentes: ${comps.join(', ') || '—'}`,
    `Duração: ${sp.duration}${sp.concentration ? ' (exige concentração)' : ''}`,
  ];
  const sections: DetailSection[] = [{ label: 'Resumo', lines }, { label: 'Descrição', lines: paragraphs(sp.description) }];
  if (sp.atHigherLevels) sections.push({ label: 'Em níveis superiores', lines: paragraphs(sp.atHigherLevels) });
  const mine: string[] = [];
  if (sp.level > 0) {
    mine.push(`Espaços de ${sp.level}º nível: ${ctx.slots[sp.level - 1] ?? 0} no total, ${ctx.slotsUsed[sp.level - 1] ?? 0} usados.`);
    mine.push(prepared ? 'Esta magia está preparada (●).' : 'Esta magia está conhecida, mas não preparada.');
  } else mine.push('Truque: pode ser lançado à vontade, sem gastar espaço.');
  if (ctx.cmTotal !== null) mine.push(`CD de resistência das suas magias: ${ctx.cmTotal}.`);
  return {
    kicker: `${sp.level === 0 ? 'Truque' : `${sp.level}º nível`} · ${sp.school}`,
    title: sp.name,
    icon: 'color-wand-outline',
    chips: [sp.castingTime, sp.range, ...(sp.concentration ? ['Concentração'] : []), ...(sp.ritual ? ['Ritual'] : [])],
    sections,
    mine,
    tip: sp.ritual ? 'Rituais podem ser lançados sem gastar espaço de magia, levando 10 minutos a mais.' : undefined,
  };
}

// ---------------- Perícias e testes de resistência ----------------

const SKILL_TEXT: Record<string, { what: string; uses: string[] }> = {
  acrobacia: { what: 'Equilíbrio e agilidade acrobática.', uses: ['Ficar de pé em superfícies instáveis, fazer piruetas e cambalhotas.', 'Escapar de agarrões usando contorcionismo (resistido por Atletismo ou Acrobacia).', 'Cair ou pular de forma controlada.'] },
  adestrarAnimais: { what: 'Acalmar, controlar e entender animais.', uses: ['Acalmar um animal assustado ou domar uma montaria.', 'Guiar um animal a fazer o que você quer.', 'Intuir as intenções de um animal.'] },
  arcanismo: { what: 'Conhecimento sobre magia, criaturas e planos mágicos.', uses: ['Identificar magias, itens mágicos e símbolos arcanos.', 'Lembrar tradições sobre planos de existência e criaturas sobrenaturais.'] },
  atletismo: { what: 'Força física em escalada, natação e saltos.', uses: ['Escalar paredes, nadar em águas agitadas, saltar grandes distâncias.', 'Agarrar e empurrar criaturas (testes resistidos).'] },
  atuacao: { what: 'Entreter uma plateia com música, dança, atuação ou narração.', uses: ['Apresentações para ganhar dinheiro, atenção ou favores.', 'Distrair uma multidão enquanto os aliados agem.'] },
  enganacao: { what: 'Esconder a verdade com palavras ou atitudes.', uses: ['Mentir convincentemente, disfarçar intenções e aplicar golpes.', 'Manter um disfarce ou identidade falsa.'] },
  furtividade: { what: 'Mover-se sem ser notado ou ouvido.', uses: ['Esconder-se (ação Esconder) e esgueirar-se por guardas.', 'Ataques à traição: quem está escondido ataca com vantagem.'] },
  historia: { what: 'Conhecimento sobre eventos, lugares e civilizações passadas.', uses: ['Lembrar guerras, reinos, lendas e pessoas importantes.', 'Reconhecer a origem de ruínas e artefatos.'] },
  intimidacao: { what: 'Influenciar pela ameaça, hostilidade ou presença assustadora.', uses: ['Forçar um inimigo a ceder ou revelar informação.', 'Impor respeito a uma multidão.'] },
  intuicao: { what: 'Perceber as verdadeiras intenções e o humor de outras pessoas.', uses: ['Detectar mentiras e sinais de nervosismo.', 'Prever o próximo movimento de um adversário.'] },
  investigacao: { what: 'Procurar pistas e deduzir a partir delas.', uses: ['Encontrar objetos escondidos, armadilhas e passagens secretas.', 'Examinar um cadáver ou cena para entender o que ocorreu.'] },
  medicina: { what: 'Cuidar de feridos e doentes.', uses: ['Estabilizar uma criatura com 0 PV (CD 10).', 'Diagnosticar doenças e venenos.'] },
  natureza: { what: 'Conhecimento sobre terreno, plantas, animais e clima.', uses: ['Identificar plantas e criaturas da natureza.', 'Prever o clima e reconhecer perigos naturais.'] },
  percepcao: { what: 'Notar o ambiente com os sentidos: ver, ouvir, cheirar.', uses: ['Perceber uma emboscada, uma porta secreta ou uma voz distante.', 'Combina com Sabedoria passiva quando você não está procurando ativamente.'] },
  persuasao: { what: 'Convencer com tato, boa vontade e argumentos.', uses: ['Negociar, pedir ajuda ou conquistar a simpatia de alguém.', 'Funciona melhor quando você é honesto e respeitoso.'] },
  prestidigitacao: { what: 'Truques manuais, furtos e agilidade das mãos.', uses: ['Bater carteiras, plantar objetos, esconder algo no corpo.', 'Abrir fechaduras simples usando ferramentas apropriadas é uma tarefa vizinha.'] },
  religiao: { what: 'Conhecimento sobre deuses, ritos, símbolos e ordens religiosas.', uses: ['Reconhecer símbolos sagrados e rituais.', 'Lembrar mitos, hierarquias e tradições de cultos.'] },
  sobrevivencia: { what: 'Viver em ambientes selvagens.', uses: ['Seguir rastros, caçar, achar caminho e evitar perigos naturais.', 'Prever o tempo e orientar-se pelos astros.'] },
};

export function skillDetail(key: string, ctx: ZoneCtx): Detail {
  const def = SKILLS.find((s) => s.key === key);
  const sk = ctx.skills.find((s) => s.key === key);
  const text = SKILL_TEXT[key];
  const ab = ctx.abilities.find((a) => a.key === def?.ability);
  const mine: string[] = [];
  if (sk && ab) {
    const prof = sk.expertise ? ctx.pb * 2 : sk.proficient ? ctx.pb : 0;
    mine.push(`Bônus total: ${sign(sk.bonus)}.`);
    mine.push(`Composição: ${ab.name} ${sign(ab.mod)}${prof ? ` + proficiência ${sign(prof)}${sk.expertise ? ' (especialização: dobro)' : ''}` : ' (sem proficiência)'}.`);
  }
  return {
    kicker: `Perícia · ${ab?.name ?? ''}`,
    title: def?.name ?? key,
    icon: 'hammer-outline',
    what: text?.what,
    chips: [sk?.expertise ? 'Especialista' : sk?.proficient ? 'Proficiente' : 'Sem proficiência'],
    sections: [
      { label: 'Quando usar', lines: text?.uses ?? [], bullets: true },
      { label: 'Como rolar', lines: ['Role 1d20 e some o bônus da perícia. O mestre define a CD (dificuldade) e você precisa igualar ou superar.', 'Vantagem: role 2d20 e fique com o maior. Desvantagem: fique com o menor.'], bullets: true },
    ],
    mine,
  };
}

export function saveDetail(a: AbilityInfo, pb: number): Detail {
  const when: Record<string, string> = {
    str: 'Resistir a ser empurrado, agarrado ou arrastado por forças físicas.',
    dex: 'Esquivar de explosões, ondas de choque e armadilhas (ex.: Bola de Fogo).',
    con: 'Aguentar veneno, doença e manter a concentração quando leva dano.',
    int: 'Resistir a ilusões e ataques mentais que atacam a mente racional.',
    wis: 'Resistir a encantamentos, medo e controle da mente.',
    cha: 'Resistir a efeitos que ameaçam sua personalidade, como banimento.',
  };
  return {
    kicker: 'Teste de resistência',
    title: a.name,
    icon: 'shield-checkmark-outline',
    what: when[a.key],
    chips: [a.saveProficient ? 'Proficiente' : 'Sem proficiência'],
    sections: [
      { label: 'Como funciona', lines: ['Role 1d20 e some o bônus. Contra a CD do efeito: igualar ou superar significa sucesso (geralmente reduz ou anula o efeito).', 'Cada classe é proficiente em dois testes de resistência, indicados pela bolinha preenchida.'], bullets: true },
    ],
    mine: [`Seu bônus: ${sign(a.save)}.`, `Composição: modificador de ${a.name} ${sign(a.mod)}${a.saveProficient ? ` + proficiência ${sign(pb)}` : ''}.`],
  };
}

// ---------------- Armas, equipamento, idiomas ----------------

function propertyHelp(prop: string): string {
  const base = norm(prop.replace(/\(.*\)/, ''));
  const hit = WEAPON_PROPERTIES.find((p) => norm(p.name) === base);
  return hit ? `${prop}: ${hit.description}` : prop;
}

const stripQty = (line: string) => line.replace(/^\d+\s+/, '').trim();

function findWeapon(name: string) {
  const n = norm(stripQty(name));
  return WEAPONS.find((w) => norm(w.name) === n) ?? WEAPONS.find((w) => n.startsWith(norm(w.name)));
}

function findArmor(name: string) {
  const n = norm(stripQty(name));
  return ARMOR.find((a) => norm(a.name) === n) ?? ARMOR.find((a) => n.startsWith(norm(a.name)));
}

export function attackDetail(a: { name: string; bonus: string; damage: string }): Detail {
  const w = findWeapon(a.name);
  const sections: DetailSection[] = [];
  if (w) {
    sections.push({ label: 'A arma', lines: [`${w.category} · ${w.kind}`, `Dano: ${w.damage}`, `Custo ${w.cost} · Peso ${w.weight}`] });
    if (w.properties.length) sections.push({ label: 'Propriedades', lines: w.properties.map(propertyHelp), bullets: true });
  }
  sections.push({
    label: 'Como atacar',
    lines: ['Role 1d20 e some o bônus de ataque. Se igualar ou superar a CA do alvo, você acerta e rola o dano.', 'Em um 20 natural o acerto é crítico: role os dados de dano em dobro.'],
    bullets: true,
  });
  return {
    kicker: 'Ataque',
    title: a.name,
    icon: 'flash-outline',
    chips: [`Ataque ${a.bonus}`, ...(a.damage ? [a.damage] : [])],
    sections,
    mine: [`Bônus de ataque: ${a.bonus}${a.damage ? ` · dano ${a.damage}` : ''}.`],
  };
}

export function equipmentDetail(line: string, opts: { equipped?: boolean; quantity?: number }): Detail {
  const w = findWeapon(line);
  const ar = findArmor(line);
  const name = stripQty(line);
  const sections: DetailSection[] = [];
  let what: string;
  let icon: IconName = 'bag-handle-outline';
  const chips: string[] = [];
  if (w) {
    icon = 'flash-outline';
    what = `Arma ${w.category.toLowerCase()} de ${w.kind.toLowerCase()}.`;
    sections.push({ label: 'Estatísticas', lines: [`Dano: ${w.damage}`, `Custo ${w.cost} · Peso ${w.weight}`] });
    if (w.properties.length) sections.push({ label: 'Propriedades', lines: w.properties.map(propertyHelp), bullets: true });
    chips.push(w.category, w.kind);
  } else if (ar) {
    icon = 'shield-outline';
    what = `Armadura ou escudo (${ar.category.toLowerCase()}).`;
    sections.push({
      label: 'Estatísticas',
      lines: [`CA: ${ar.ac}`, ar.strengthReq ? `Exige Força ${ar.strengthReq}` : 'Sem exigência de Força', ar.stealthDisadvantage ? 'Desvantagem em Furtividade' : 'Sem penalidade em Furtividade', `Custo ${ar.cost} · Peso ${ar.weight}`],
    });
    chips.push(ar.category);
  } else {
    what = 'Item de aventura ou equipamento.';
    sections.push({
      label: 'Sobre',
      lines: ['Este item faz parte do seu equipamento. Itens comuns de aventura (cordas, rações, tochas, kits) têm uso descrito pelo mestre ou no Capítulo de Equipamento do Livro do Jogador.', 'O que você carrega tem peso: carregar demais pode reduzir o deslocamento.'],
      bullets: true,
    });
  }
  const mine: string[] = [];
  if (opts.quantity && opts.quantity > 1) mine.push(`Quantidade: ${opts.quantity}.`);
  if (opts.equipped) mine.push('Está equipado (em uso).');
  return { kicker: 'Equipamento', title: name, icon, what, chips, sections, mine: mine.length ? mine : undefined };
}

const KNOWN_TEXT: Record<string, string> = {
  comum: 'O idioma mais falado no mundo: usado por quase todos os povos para comércio e conversa cotidiana.',
  halfling: 'A língua dos halflings: suave e cheia de ditados. Usa o alfabeto Comum.',
  elfico: 'A língua dos elfos: fluida, com entonação sutil e uma escrita elegante.',
  anao: 'A língua dos anões: rígida, com consoantes duras, escrita em runas.',
  gnomico: 'A língua dos gnomos: técnica e cheia de termos de engenharia e invenção.',
  draconico: 'A língua dos dragões: usada em textos de magia e por povos descendentes de dragões.',
  orc: 'A língua dos orcs: áspera e gutural.',
  goblin: 'A língua dos goblinoides.',
  infernal: 'A língua dos Nove Infernos, usada por diabos e conjuradores de pactos.',
  celestial: 'A língua dos seres celestiais.',
  abissal: 'A língua do Abismo, usada por demônios.',
  silvestre: 'A língua das criaturas feéricas e da natureza.',
  subcomum: 'Língua comum do Subterrâneo, usada por drows e criaturas das profundezas.',
  'girias de ladrao': 'Um código secreto de palavras, gestos e sinais usado por ladrões para trocar mensagens sem que outros entendam. Permite deixar marcas e símbolos que só iniciados leem.',
  'ferramentas de ladrao': 'Kit com lima, gazuas, espelhinho, tesoura e alicate. Proficiência permite somar o bônus de proficiência ao abrir fechaduras e desarmar armadilhas.',
  'kit de disfarce': 'Cosméticos, tintas para cabelo, adereços e roupas. Proficiência soma bônus de proficiência ao criar disfarces convincentes.',
  'kit de falsificacao': 'Tintas, papéis, selos e ferramentas de escrita. Proficiência soma bônus ao produzir documentos falsos ou copiar a letra de outra pessoa.',
  'instrumento musical': 'Cada instrumento (alaúde, flauta, tambor…) é uma proficiência separada. Soma bônus ao tocá-lo e é foco de conjuração para bardos.',
};

export function languageDetail(name: string): Detail {
  const text = KNOWN_TEXT[norm(name)];
  const isTool = /kit|ferramenta|instrumento|jogo|veículo|veiculo|suprimentos/i.test(name);
  return {
    kicker: isTool ? 'Proficiência em ferramenta' : 'Idioma ou proficiência',
    title: name,
    icon: isTool ? 'construct-outline' : 'language-outline',
    what: text,
    sections: [
      {
        label: 'Como funciona',
        lines: isTool
          ? ['Ser proficiente permite somar o bônus de proficiência a testes feitos com essa ferramenta.', 'O mestre define a CD e se a tarefa pode falhar ou apenas demorar.']
          : ['Idiomas permitem falar, ler e escrever naquela língua com quem a conhece.', 'Proficiências em armas e armaduras permitem usar o equipamento sem penalidade e somar o bônus de proficiência.'],
        bullets: true,
      },
    ],
  };
}
