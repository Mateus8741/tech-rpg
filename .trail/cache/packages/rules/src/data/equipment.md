# packages/rules/src/data/equipment.ts

- Cat · type · L5-L5 — type Cat = Weapon["category"];
- Kind · type · L6-L6 — type Kind = Weapon["kind"];
- w · function · L8-L16 — w = ( category: Cat, kind: Kind, name: string, cost: string, damage: string, weight: string, properties: string[] = [], ): Weapon
- g · function · L93-L95 — g = (category: string, rows: [name: string, cost: string, weight: string][])
