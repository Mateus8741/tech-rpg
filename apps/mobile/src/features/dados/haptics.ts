import * as Haptics from 'expo-haptics';

import type { DiceRoll } from './dice';

/** Feedback tátil de uma rolagem: sucesso no 20 natural, erro no 1 natural, impacto no resto. */
export function rollHaptics(roll: DiceRoll) {
  const p =
    roll.crit === 'max'
      ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      : roll.crit === 'min'
        ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  p.catch(() => {});
}

export function tapHaptics() {
  Haptics.selectionAsync().catch(() => {});
}
