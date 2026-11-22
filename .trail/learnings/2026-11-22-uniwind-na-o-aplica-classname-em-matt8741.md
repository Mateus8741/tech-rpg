---
title: "Uniwind não aplica className em Animated.View: use AnimatedView"
author: Matt8741
date: 2026-11-22
branch: main
cost: { minutes: 14, tokens: 193218 }
touches:
  - apps/mobile/src/components/motion/index.tsx
---

## Decided
- Em `apps/mobile`, qualquer `Animated.View` do Reanimated que precise de `className` deve usar `AnimatedView` (exportado de `src/components/motion/index.tsx`, `withUniwind(Animated.View)`). Sem isso o `className` é ignorado em runtime, mas o `tsc` passa: a pílula deslizante de `ModeToggle` (dados) e do seletor de tema (perfil) ficaram invisíveis.
- A ficha de papel no mobile (`features/personagens/paper/PaperSheet.tsx`) é só visualização; o editor de zonas (`PaperEditor` da web) não foi portado.
## Tried and ruled out
- Confiar só no `check-types` para validar animações/estilos: não pega o `className` ignorado; foi preciso rodar no simulador.
## Watch out
- `pod install` precisa de `LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8`, senão o CocoaPods quebra com "Unicode Normalization not appropriate for ASCII-8BIT" e o `expo run:ios` falha com "sandbox is not in sync".
- A tab bar flutuante cobre ~112pt do rodapé: listas próprias devem somar `TAB_BAR_SPACE` ao padding inferior.
