# packages/rules/src/data/equipment.ts

- Cat · type · L6-L6 — type Cat = Weapon["category"];
- Kind · type · L7-L7 — type Kind = Weapon["kind"];
- w · function · L9-L17 — w = ( category: Cat, kind: Kind, name: string, cost: string, damage: string, weight: string, properties: string[] = [], ): Weapon
- g · function · L94-L96 — g = (category: string, rows: [name: string, cost: string, weight: string][])
