# apps/web/components/wizard/equipment.ts

- EquipLine · interface · L3-L7 — interface EquipLine
- Item · interface · L9-L9 — interface Item
- norm · function · L11-L12 — norm = (s: string)
- parseEquipLine · function · L14-L22 — function parseEquipLine(line: string): EquipLine
- WeaponSlot · interface · L26-L26 — interface WeaponSlot
- weaponSlot · function · L28-L33 — function weaponSlot(text: string): WeaponSlot | null
- weaponsForSlot · function · L35-L36 — weaponsForSlot = (slot: WeaponSlot)
- applyWeapon · function · L38-L40 — function applyWeapon(text: string, weaponName: string): string
- cap · function · L46-L46 — cap = (s: string)
- toItems · function · L48-L62 — function toItems(text: string, splitAnd = true): Item[]
- matchArmor · function · L64-L70 — function matchArmor(name: string): ArmorItem | undefined
- matchWeapon · function · L72-L78 — function matchWeapon(name: string): Weapon | undefined
