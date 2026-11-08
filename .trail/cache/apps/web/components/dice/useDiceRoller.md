# apps/web/components/dice/useDiceRoller.ts

- RollMode · type · L6-L6 — type RollMode = "normal" | "advantage" | "disadvantage";
- Crit · type · L7-L7 — type Crit = "max" | "min" | null;
- DiceRoll · interface · L9-L21 — interface DiceRoll
- load · function · L31-L43 — function load()
- commit · function · L45-L53 — function commit(next: DiceRoll[])
- subscribe · function · L55-L73 — function subscribe(cb: () => void)
- onStorage · function · L58-L67 — onStorage = (e: StorageEvent)
- getSnapshot · function · L75-L78 — getSnapshot = ()
- getServerSnapshot · function · L79-L79 — getServerSnapshot = ()
- performRoll · function · L84-L111 — function performRoll(expr: string, mode: RollMode = "normal"): DiceRoll | null
- useDiceRoller · function · L113-L132 — function useDiceRoller()
