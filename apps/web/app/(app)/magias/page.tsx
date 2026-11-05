import { Suspense } from "react";
import { SpellBrowser } from "./SpellBrowser";

export const metadata = { title: "Grimório de Magias" };

export default function MagiasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-ink-muted">Abrindo o grimório…</div>}>
      <SpellBrowser />
    </Suspense>
  );
}
