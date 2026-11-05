// Evento simples para abrir a paleta de qualquer lugar.
export const OPEN_SEARCH_EVENT = 'rpg:open-search';

export function openSearch() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}
