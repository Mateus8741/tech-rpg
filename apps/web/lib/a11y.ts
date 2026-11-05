import type { KeyboardEvent } from 'react';

/**
 * Navegação por setas/Home/End em um role="tablist" (ativação automática).
 * Use em onKeyDown do elemento com role="tablist"; as abas precisam ter role="tab"
 * e tabIndex roving (0 na ativa, -1 nas demais).
 */
export function tablistKeyDown(e: KeyboardEvent<HTMLElement>) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(e.key)) return;
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
  if (tabs.length === 0) return;
  const cur = tabs.findIndex((t) => t === document.activeElement);
  let next = cur < 0 ? 0 : cur;
  if (e.key === 'ArrowRight') next = (cur + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') next = (cur - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = tabs.length - 1;
  e.preventDefault();
  tabs[next]?.focus();
  tabs[next]?.click();
}
