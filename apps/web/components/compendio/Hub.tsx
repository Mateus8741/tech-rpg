"use client";

import { Backpack, BookOpen, Scroll, Shield, Users } from "lucide-react";
import { BACKGROUNDS, CLASSES, RACES, WEAPONS, ARMOR, GEAR } from "@repo/rules";
import { CardGrid, Header, LiftCard, Page } from "./kit";

export default function Hub() {
  const items = [
    { href: "/compendio/racas", title: "Raças", desc: "Povos de Faerûn, seus traços e sub-raças.", n: RACES.length, Icon: Users },
    { href: "/compendio/classes", title: "Classes", desc: "Progressão, características e subclasses.", n: CLASSES.length, Icon: Shield },
    { href: "/compendio/antecedentes", title: "Antecedentes", desc: "Origens, perícias e traços de personalidade.", n: BACKGROUNDS.length, Icon: Scroll },
    { href: "/compendio/equipamento", title: "Equipamento", desc: "Armas, armaduras e itens de aventura.", n: WEAPONS.length + ARMOR.length + GEAR.length, Icon: Backpack },
    { href: "/regras", title: "Regras e Condições", desc: "Regras-chave e condições do jogo.", n: null, Icon: BookOpen },
  ];
  return (
    <Page>
      <Header eyebrow="Compêndio" title="Livro de Referência" subtitle="Consulte raças, classes, antecedentes e equipamento de D&D 5e em português." />
      <CardGrid>
        {items.map(({ href, title, desc, n, Icon }) => (
          <LiftCard key={href} href={href}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1]/25 to-[#8b5cf6]/10 text-[#a78bfa]">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-[#e2e8f0]">{title}</h2>
            <p className="mt-1 text-sm text-[#64748b]">{desc}</p>
            {n !== null && <p className="mt-4 text-xs font-semibold text-[#f5c451]">{n} entradas</p>}
          </LiftCard>
        ))}
      </CardGrid>
    </Page>
  );
}
