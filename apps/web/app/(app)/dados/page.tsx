import { Dices } from "lucide-react";
import { DicePanel } from "@/components/dice";

export const metadata = { title: "Dados" };

export default function DadosPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 p-4 sm:p-8">
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
          <Dices className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#e2e8f0]">Dados</h1>
          <p className="text-sm text-[#64748b]">Role d4 a d100 ou digite uma expressão como 2d6+3.</p>
        </div>
      </header>
      <div className="rounded-2xl border border-[#1e2035] bg-[#0a0c14] p-5">
        <DicePanel />
      </div>
    </div>
  );
}
