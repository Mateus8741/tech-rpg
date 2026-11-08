# apps/web/components/sheet/useCharacter.ts

- SaveState · type · L8-L8 — type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';
- PatchOpts · interface · L10-L13 — interface PatchOpts
- HistoryEntry · interface · L21-L25 — interface HistoryEntry
- isEditable · function · L27-L30 — isEditable = (el: EventTarget | null)
- useCharacter · function · L36-L215 — function useCharacter(id: string)
- onHide · function · L182-L182 — onHide = ()
- onUnload · function · L183-L188 — onUnload = (e: BeforeUnloadEvent)
- onKey · function · L200-L205 — onKey = (e: KeyboardEvent)
- CharacterApi · type · L217-L217 — type CharacterApi = ReturnType<typeof useCharacter>;
