# Artes das cartas de ação

Coloque aqui uma imagem para usar como arte de uma carta na aba **Ações**.
Ordem: arte própria nesta pasta → ícone pintado de `painterly/` (veja `painterly/CREDITS.md`)
→ ícone de silhueta.

- Formatos: `.webp` (preferido), `.png` ou `.jpg`, testados nessa ordem.
- Proporção: 4:3 (ex.: 800×600). A imagem é cortada para preencher (`object-cover`).
- Use só arte que você pode distribuir: feita por você, gerada por IA ou com licença.
  O repositório é público.

## Nome do arquivo

| Carta | Nome | Exemplo |
|---|---|---|
| Magia ou truque | id da magia (`packages/rules/src/data`) | `ilusao-menor.webp` |
| Ação básica | id em `COMBAT_ACTIONS` | `atacar.webp`, `disparada.webp` |
| Arma, característica, traço | nome sem acento, minúsculo, com hífens | `machado-grande.webp`, `arma-de-sopro.webp` |

Ações básicas: `atacar`, `conjurar`, `disparada`, `desengajar`, `esquivar`, `ajudar`,
`esconder`, `preparar`, `procurar`, `usar-objeto`, `agarrar`, `empurrar`, `duas-armas`,
`ataque-de-oportunidade`, `reacao-preparada`.

A regra está em `artKey()` em `apps/web/components/sheet/GameCard.tsx`.

## Prompts prontos

Há um prompt de imagem para cada magia e ação básica, já com o nome de arquivo certo, em
`docs/card-art/PROMPTS.md` (e `prompts.csv` para gerar em lote).
