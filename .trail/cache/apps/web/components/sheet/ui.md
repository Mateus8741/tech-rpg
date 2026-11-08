# apps/web/components/sheet/ui.tsx

- Panel · function · L11-L25 — function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; })
- Field · function · L32-L39 — function Field({ label, children, className }: { label: string; children: ReactNode; className?: string })
- GhostButton · function · L41-L52 — function GhostButton({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>)
- Collapsible · function · L55-L87 — function Collapsible({ title, subtitle, badge, children, defaultOpen = false }: { title: string; subtitle?: string; badge?: ReactNode; children: ReactNode; defaultOpen?: boolean; })
- RollResult · interface · L91-L100 — interface RollResult
- RollFn · type · L102-L102 — type RollFn = (label: string, bonus: number, ev?: { shiftKey?: boolean; altKey?: boolean }) => RollResult | null;
- useRoll · function · L104-L104 — useRoll = ()
- RollProvider · function · L106-L199 — function RollProvider({ children }: { children: ReactNode })
- RollButton · function · L201-L215 — function RollButton({ label, bonus, className, children }: { label: string; bonus: number; className?: string; children: ReactNode; })
