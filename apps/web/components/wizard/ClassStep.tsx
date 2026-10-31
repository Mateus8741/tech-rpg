"use client";

import { CLASSES, SKILLS, type SkillKey } from "@repo/rules";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Chip, Counter, OptionCard, Panel, StepTitle, Tag, TraitList, inputCls, selectCls, toggleIn } from "./ui";
import {
  ABILITY_NAME, classEquipmentLines, classOf, skillsTakenOutside, subclassLevel, subclassOf, subclassRequired,
} from "./build";
import { parseEquipLine, weaponsForSlot } from "./equipment";
import { resetClassPatch, type WizardState } from "./state";

interface Props { state: WizardState; update: (p: Partial<WizardState>) => void }

export default function ClassStep({ state, update }: Props) {
  const cls = classOf(state);
  const sub = subclassOf(state);
  const subLv = subclassLevel(cls);
  const taken = skillsTakenOutside(state, "class");
  const pool: SkillKey[] = cls ? (cls.skillChoices.from === "any" ? SKILLS.map((s) => s.key) : cls.skillChoices.from) : [];
  const lines = classEquipmentLines(state);

  return (
    <div>
      <StepTitle title="Escolha sua classe" hint="A classe define dado de vida, proficiências, perícias e características." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CLASSES.map((c) => (
          <OptionCard key={c.id} selected={c.id === state.classId}
            onClick={() => c.id !== state.classId && update({ classId: c.id, ...resetClassPatch() })}
            title={c.name} subtitle={`d${c.hitDie} · ${c.primaryAbilities.map((k) => ABILITY_NAME[k]).join(" / ")}`}>
            <span className="line-clamp-3">{c.summary}</span>
          </OptionCard>
        ))}
      </div>

      {cls && (
        <div className="mt-6 space-y-4">
          <Panel title={`${cls.name} — resumo`}>
            <p className="text-sm leading-relaxed text-[#94a3b8]">{cls.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag tone="gold">Dado de vida: d{cls.hitDie}</Tag>
              <Tag tone="indigo">Salvaguardas: {cls.savingThrows.map((k) => ABILITY_NAME[k]).join(", ")}</Tag>
              {cls.armorProficiencies.length > 0 && <Tag>Armaduras: {cls.armorProficiencies.join(", ")}</Tag>}
              {cls.weaponProficiencies.length > 0 && <Tag>Armas: {cls.weaponProficiencies.join(", ")}</Tag>}
              {cls.toolProficiencies.length > 0 && <Tag>Ferramentas: {cls.toolProficiencies.join(", ")}</Tag>}
              {cls.spellcasting && <Tag tone="indigo">Conjurador ({ABILITY_NAME[cls.spellcasting.ability]})</Tag>}
            </div>
          </Panel>

          <Panel title="Nível inicial">
            <div className="flex flex-wrap items-center gap-3">
              <Input type="number" min={1} max={20} value={state.level}
                onChange={(e) => {
                  const lv = Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1));
                  update({ level: lv, ...(subLv !== undefined && lv < subLv ? { subclassId: "" } : {}), cantrips: [], spells: [], prepared: [] });
                }}
                className={`w-24 ${inputCls}`} aria-label="Nível inicial" />
              <span className="text-xs text-[#64748b]">1 a 20 · XP inicial: o mínimo do nível</span>
            </div>
            {state.level > 1 && (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-[#f5c451]/30 bg-[#f5c451]/5 p-3 text-xs text-[#f5c451]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Começar acima do nível 1 aplica todas as características até o nível {state.level}, com PV pela média do dado de vida. Combine com seu Mestre.
              </p>
            )}
          </Panel>

          <Panel title="Perícias de classe" aside={<Counter value={state.classSkills.length} max={cls.skillChoices.count} />}>
            <div className="flex flex-wrap gap-2">
              {pool.map((k) => {
                const name = SKILLS.find((s) => s.key === k)!.name;
                const t = taken.includes(k);
                return (
                  <Chip key={k} selected={state.classSkills.includes(k)} title={t ? "Já concedida por raça ou antecedente" : undefined}
                    disabled={t || state.classSkills.length >= cls.skillChoices.count}
                    onClick={() => update({ classSkills: toggleIn(state.classSkills, k, cls.skillChoices.count) })}>{name}</Chip>
                );
              })}
            </div>
          </Panel>

          {subLv !== undefined && (
            <Panel title={cls.subclassLabel}>
              {!subclassRequired(state) ? (
                <p className="text-sm text-[#64748b]">
                  {cls.name} escolhe {cls.subclassLabel.toLowerCase()} no nível {subLv}. Com nível inicial {state.level}, ainda não se aplica — você poderá escolher ao subir de nível.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {cls.subclasses.map((s) => (
                    <OptionCard key={s.id} selected={s.id === state.subclassId}
                      onClick={() => update({ subclassId: s.id, cantrips: [], spells: [], prepared: [] })} title={s.name} subtitle={`Nível ${s.level}`}>
                      <span className="line-clamp-4">{s.description}</span>
                    </OptionCard>
                  ))}
                </div>
              )}
              {sub && subclassRequired(state) && (
                <div className="mt-3"><TraitList traits={sub.features.filter((f) => f.level <= state.level)} /></div>
              )}
            </Panel>
          )}

          <Panel title="Equipamento inicial">
            <div className="space-y-4">
              {cls.startingEquipment.map((raw, i) => {
                const p = parseEquipLine(raw);
                const line = lines[i];
                const slotText = line?.slot ? line : null;
                return (
                  <div key={i} className="space-y-2">
                    {p.options ? (
                      <div className="flex flex-wrap gap-2">
                        {p.options.map((o, oi) => (
                          <Chip key={oi} selected={(state.equipChoices[i] ?? 0) === oi}
                            onClick={() => update({ equipChoices: { ...state.equipChoices, [i]: oi } })}>
                            {String.fromCharCode(97 + oi)}) {o}
                          </Chip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#94a3b8]">• {p.fixed}</p>
                    )}
                    {slotText?.slot && (
                      <select className={selectCls} aria-label="Escolha a arma"
                        value={state.equipWeapons[i] ?? weaponsForSlot(slotText.slot)[0]?.name}
                        onChange={(e) => update({ equipWeapons: { ...state.equipWeapons, [i]: e.target.value } })}>
                        {weaponsForSlot(slotText.slot).map((w) => (
                          <option key={w.name} value={w.name}>{w.name} ({w.damage})</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
