# apps/web/components/wizard/ui.tsx

- StepTitle · function · L8-L15 — function StepTitle({ title, hint }: { title: string; hint?: string })
- Panel · function · L17-L29 — function Panel({ title, children, className, aside }: { title?: string; children: ReactNode; className?: string; aside?: ReactNode })
- OptionCard · function · L31-L59 — function OptionCard({ selected, onClick, title, subtitle, children, disabled, }: { selected: boolean; onClick: () => void; title: string; subtitle?: string; children?: ReactNode; disabled?: boolean })
- Chip · function · L61-L80 — function Chip({ selected, disabled, onClick, children, title, }: { selected: boolean; disabled?: boolean; onClick: () => void; children: ReactNode; title?: string })
- Tag · function · L82-L95 — function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "gold" | "indigo" })
- TraitList · function · L97-L108 — function TraitList({ traits }: { traits: { name: string; description: string }[] })
- Field · function · L115-L123 — function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string })
- Counter · function · L125-L131 — function Counter({ value, max }: { value: number; max: number })
- NumberField · function · L135-L156 — function NumberField({ value, onCommit, min, max, className, label }: { value: number; onCommit: (n: number) => void; min: number; max: number; className?: string; label: string; })
- commit · function · L139-L142 — commit = (raw: string)
- toggleIn · function · L158-L161 — function toggleIn<T>(list: T[], item: T, max: number): T[]
