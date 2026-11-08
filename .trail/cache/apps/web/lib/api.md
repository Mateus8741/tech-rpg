# apps/web/lib/api.ts

- Equipment · interface · L3-L10 — interface Equipment
- Ability · interface · L12-L17 — interface Ability
- InventoryItem · interface · L19-L24 — interface InventoryItem
- CombatStatus · interface · L26-L31 — interface CombatStatus
- User · interface · L33-L38 — interface User
- Character · interface · L40-L84 — interface Character
- login · function · L87-L96 — async function login(username: string, role?: 'PLAYER' | 'MASTER'): Promise<User>
- getUser · function · L98-L103 — async function getUser(username: string): Promise<User>
- getCharacters · function · L106-L111 — async function getCharacters(username: string): Promise<Character[]>
- getCharacter · function · L113-L118 — async function getCharacter(id: string, username: string): Promise<Character>
- createCharacter · function · L120-L129 — async function createCharacter(username: string, characterData: Partial<Character>): Promise<Character>
- updateCharacter · function · L131-L144 — async function updateCharacter(id: string, username: string, characterData: Partial<Character>): Promise<Character>
- deleteCharacter · function · L146-L151 — async function deleteCharacter(id: string, username: string): Promise<void>
