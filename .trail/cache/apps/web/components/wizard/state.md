# apps/web/components/wizard/state.ts

- AbilityMode · type · L3-L3 — type AbilityMode = "standard" | "pointbuy" | "roll" | "manual";
- AbMap · type · L4-L4 — type AbMap<T> = Record<AbilityKey, T>;
- StepId · type · L5-L5 — type StepId = "race" | "class" | "background" | "abilities" | "spells" | "details";
- WizardState · interface · L7-L41 — interface WizardState
- nulls · function · L43-L43 — nulls = (): AbMap<null>
- initialState · function · L45-L55 — initialState = (): WizardState
- resetClassPatch · function · L57-L59 — resetClassPatch = (): Partial<WizardState>
- resetRacePatch · function · L61-L63 — resetRacePatch = (): Partial<WizardState>
