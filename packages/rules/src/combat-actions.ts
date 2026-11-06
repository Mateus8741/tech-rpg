// Economia de ações em combate: ações padrão e classificação de magias/características.
import type { Spell } from "./types";

/** Custo em combate. "outro" = fora do combate/tempo longo; "passivo" = sempre ativo. */
export type ActionCost = "acao" | "bonus" | "reacao" | "livre" | "outro" | "passivo";

export const ACTION_COST_LABEL: Record<ActionCost, string> = {
  acao: "Ação",
  bonus: "Ação bônus",
  reacao: "Reação",
  livre: "Sem custo",
  outro: "Fora de combate",
  passivo: "Passivo",
};

export interface CombatAction {
  id: string;
  name: string;
  cost: ActionCost;
  summary: string;
  description: string;
}

/** Opções que qualquer personagem tem em combate (resumo próprio das regras básicas). */
export const COMBAT_ACTIONS: CombatAction[] = [
  { id: "atacar", name: "Atacar", cost: "acao", summary: "Faz um ataque corpo a corpo ou à distância.", description: "Você faz um ataque com arma ou desarmado. Algumas características, como Ataque Extra, permitem mais de um ataque com esta ação." },
  { id: "conjurar", name: "Conjurar Magia", cost: "acao", summary: "Conjura uma magia com tempo de 1 ação.", description: "Você conjura uma magia cujo tempo de conjuração seja 1 ação. Se conjurar uma magia como ação bônus no turno, a outra magia do mesmo turno só pode ser um truque de 1 ação." },
  { id: "disparada", name: "Disparada", cost: "acao", summary: "Ganha movimento extra igual ao deslocamento.", description: "Você recebe movimento adicional neste turno igual ao seu deslocamento, depois de aplicar modificadores." },
  { id: "desengajar", name: "Desengajar", cost: "acao", summary: "Seu movimento não provoca ataques de oportunidade.", description: "Até o fim do turno, o seu movimento não provoca ataques de oportunidade." },
  { id: "esquivar", name: "Esquivar", cost: "acao", summary: "Ataques contra você têm desvantagem.", description: "Até o início do seu próximo turno, ataques contra você têm desvantagem se você puder ver o atacante, e você faz salvaguardas de Destreza com vantagem. O benefício termina se você ficar incapacitado ou com deslocamento 0." },
  { id: "ajudar", name: "Ajudar", cost: "acao", summary: "Dá vantagem a um aliado em teste ou ataque.", description: "Um aliado recebe vantagem no próximo teste de habilidade para a tarefa em que você ajuda, ou no primeiro ataque contra uma criatura a até 1,5 m de você, se feito antes do seu próximo turno." },
  { id: "esconder", name: "Esconder", cost: "acao", summary: "Faz um teste de Destreza (Furtividade).", description: "Você faz um teste de Destreza (Furtividade) para tentar se esconder, seguindo as regras de ocultação. Precisa estar fora da linha de visão ou com cobertura adequada." },
  { id: "preparar", name: "Preparar", cost: "acao", summary: "Define um gatilho e reage quando ele acontece.", description: "Você define uma circunstância e a ação (ou movimento) que fará em resposta. Quando o gatilho ocorre, você usa a sua reação para executá-la. Magias preparadas gastam o espaço ao preparar e exigem concentração até serem liberadas." },
  { id: "procurar", name: "Procurar", cost: "acao", summary: "Procura algo com Percepção ou Investigação.", description: "Você dedica atenção a encontrar algo, normalmente com um teste de Sabedoria (Percepção) ou Inteligência (Investigação), conforme o mestre definir." },
  { id: "usar-objeto", name: "Usar Objeto", cost: "acao", summary: "Usa um objeto que exija atenção.", description: "Você usa um objeto que exija uma ação, ou interage com um segundo objeto no turno. A primeira interação simples com um objeto em cada turno é gratuita." },
  { id: "agarrar", name: "Agarrar", cost: "acao", summary: "Teste resistido de Atletismo para agarrar.", description: "Substitui um ataque da ação Atacar. Faça um teste de Força (Atletismo) resistido por Força (Atletismo) ou Destreza (Acrobacia) do alvo, que não pode ser mais de um tamanho maior que você. Se vencer, o alvo fica agarrado." },
  { id: "empurrar", name: "Empurrar", cost: "acao", summary: "Teste resistido para derrubar ou afastar o alvo.", description: "Substitui um ataque da ação Atacar. Faça um teste de Força (Atletismo) resistido. Se vencer, o alvo fica caído ou é empurrado 1,5 m para longe de você." },
  { id: "duas-armas", name: "Ataque com a outra mão", cost: "bonus", summary: "Ataca com a segunda arma leve.", description: "Quando você ataca com uma arma leve de corpo a corpo, pode usar a ação bônus para atacar com outra arma leve na outra mão. Não some o modificador de habilidade ao dano, a não ser que ele seja negativo." },
  { id: "ataque-de-oportunidade", name: "Ataque de Oportunidade", cost: "reacao", summary: "Ataca quem sai do seu alcance.", description: "Quando uma criatura que você pode ver sai do seu alcance, você pode usar a reação para fazer um ataque corpo a corpo contra ela, logo antes de ela sair." },
  { id: "reacao-preparada", name: "Ação Preparada", cost: "reacao", summary: "Executa o que você preparou quando o gatilho ocorrer.", description: "Se você usou a ação Preparar, gasta a reação para executar a ação quando o gatilho acontecer. Sem reação disponível, a oportunidade se perde." },
];

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Classifica uma magia pelo tempo de conjuração. */
export function spellActionCost(spell: Pick<Spell, "castingTime">): ActionCost {
  const t = norm(spell.castingTime);
  if (t.includes("bonus")) return "bonus";
  if (t.includes("reacao")) return "reacao";
  if (/\b1 acao\b/.test(t) || t === "acao") return "acao";
  return "outro";
}

/** Casos em que o texto engana o classificador (auditado contra todas as classes e subclasses). */
const FEATURE_COST_OVERRIDES: Record<string, ActionCost> = {
  "Ação Ardilosa": "bonus",
  "Esquiva Sobrenatural": "reacao",
  "Evasão": "passivo",
  "Ataque Furtivo": "passivo",
  "Mãos Mágicas Malabaristas": "bonus",
  "Mãos Rápidas": "bonus",
  "Inspiração de Bardo": "bonus",
  "Canção da Lâmina": "bonus",
  "Forma Selvagem": "acao",
  "Guia da Tempestade": "acao",
  "Canalizar Divindade: Invocar Duplicidade": "acao",
  "Campeão dos Anciões": "acao",
  "Intervenção Divina": "acao",
  "Fanfarronada": "acao",
  "Desorientação": "reacao",
  "Manobra Elegante": "bonus",
  "Hora de Ceifar": "acao",
  "Toque da Morte Ampla": "acao",
  "Explosão Solar Ardente": "acao",
  "Canalizar Divindade: Virar o Jogo": "bonus",
  "Obediência Divina": "reacao",
  "Campeão Enaltecido": "acao",
  "Ataque Extra (2)": "passivo",
  "Ataque Extra (3)": "passivo",
  "Estilo de Luta": "passivo",
  "Invocações Místicas": "passivo",
  "Dádiva do Pacto": "passivo",
  "Totem Espiritual": "passivo",
  "Surto de Magia Selvagem": "passivo",
  "Surto de Inspiração": "passivo",
};

/**
 * Classifica característica pelo texto. Reação e ação bônus têm prioridade porque costumam
 * aparecer como o custo real; frases como "ação de Ataque" não indicam custo.
 * Passe `name` para aplicar as correções manuais.
 */
export function featureActionCost(description: string, name?: string): ActionCost {
  const override = name ? FEATURE_COST_OVERRIDES[name] : undefined;
  if (override) return override;
  const t = norm(description);
  if (/(usar|use|usando|gastar|gasta) (a |sua |uma )?reacao|como (uma )?reacao|com (a |sua |uma )?reacao/.test(t)) return "reacao";
  if (/(usar|use|usando|gastar|gasta) (a |sua |uma )?acao bonus|como (uma )?acao bonus|com (a |sua |uma )?acao bonus/.test(t)) return "bonus";
  if (/(usar|use|usando|gastar) (a |sua |uma )?acao\b(?! de)|como (uma )?acao\b(?! de)|com (a |sua |uma )acao\b(?! de)/.test(t)) return "acao";
  return "passivo";
}
