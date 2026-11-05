"use client";

import { RACES, ABILITIES, SKILLS, type AbilityKey, type SkillKey } from "@repo/rules";
import { Chip, Counter, OptionCard, Panel, StepTitle, Tag, TraitList, toggleIn } from "./ui";
import { LANGUAGES, bonusText, extraLanguageCount, raceOf, raceSkillPickCount, skillsTakenOutside, subraceOf } from "./build";
import { resetRacePatch, type WizardState } from "./state";

interface Props { state: WizardState; update: (p: Partial<WizardState>) => void }

export default function RaceStep({ state, update }: Props) {
  const race = raceOf(state);
  const sub = subraceOf(state);
  const choice = race?.abilityChoice;
  const extraLang = extraLanguageCount(race, sub);
  const skillPicks = raceSkillPickCount(race);
  const taken = skillsTakenOutside(state, "race");

  return (
    <div>
      <StepTitle title="Escolha sua raça" hint="A raça define bônus de atributo, deslocamento, idiomas e traços especiais." />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {RACES.map((r) => (
          <OptionCard
            key={r.id}
            selected={r.id === state.raceId}
            onClick={() => r.id !== state.raceId && update({ raceId: r.id, ...resetRacePatch() })}
            title={r.name}
            subtitle={bonusText(r.abilityBonuses) + (r.abilityChoice ? ` +${r.abilityChoice.amount}×${r.abilityChoice.count}` : "")}
          >
            <span className="line-clamp-3">{r.summary}</span>
          </OptionCard>
        ))}
      </div>

      {race && (
        <div className="mt-6 space-y-4">
          <Panel title={`${race.name} — resumo`}>
            <p className="text-sm leading-relaxed text-ink-soft">{race.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag tone="gold">{bonusText({ ...race.abilityBonuses, ...(sub?.abilityBonuses ?? {}) }) || "Sem bônus fixo"}</Tag>
              <Tag>Tamanho: {race.size}</Tag>
              <Tag>Deslocamento: {sub?.speed ?? race.speed} m</Tag>
              <Tag>Idiomas: {race.languages.join(", ")}</Tag>
            </div>
          </Panel>

          {race.subraces.length > 0 && (
            <Panel title="Sub-raça">
              <div className="grid gap-3 sm:grid-cols-2">
                {race.subraces.map((s) => (
                  <OptionCard key={s.id} selected={s.id === state.subraceId} onClick={() => update({ subraceId: s.id, raceLanguages: [] })}
                    title={s.name} subtitle={bonusText(s.abilityBonuses)}>
                    {s.traits.map((t) => t.name).join(" · ")}
                  </OptionCard>
                ))}
              </div>
            </Panel>
          )}

          {choice && (
            <Panel title={`Bônus de atributo à escolha (+${choice.amount} em ${choice.count})`} aside={<Counter value={state.racialPicks.length} max={choice.count} />}>
              <div className="flex flex-wrap gap-2">
                {ABILITIES.filter((a) => !choice.exclude?.includes(a.key)).map((a) => (
                  <Chip key={a.key} selected={state.racialPicks.includes(a.key)}
                    disabled={state.racialPicks.length >= choice.count}
                    onClick={() => update({ racialPicks: toggleIn<AbilityKey>(state.racialPicks, a.key, choice.count) })}>
                    {a.name} +{choice.amount}
                  </Chip>
                ))}
              </div>
            </Panel>
          )}

          {extraLang > 0 && (
            <Panel title="Idioma extra" aside={<Counter value={state.raceLanguages.length} max={extraLang} />}>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.filter((l) => !race.languages.includes(l)).map((l) => (
                  <Chip key={l} selected={state.raceLanguages.includes(l)} disabled={state.raceLanguages.length >= extraLang}
                    onClick={() => update({ raceLanguages: toggleIn(state.raceLanguages, l, extraLang) })}>{l}</Chip>
                ))}
              </div>
            </Panel>
          )}

          {skillPicks > 0 && (
            <Panel title="Versatilidade em Perícia" aside={<Counter value={state.raceSkills.length} max={skillPicks} />}>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((k) => (
                  <Chip key={k.key} selected={state.raceSkills.includes(k.key)}
                    disabled={taken.includes(k.key) || state.raceSkills.length >= skillPicks}
                    onClick={() => update({ raceSkills: toggleIn<SkillKey>(state.raceSkills, k.key, skillPicks) })}>{k.name}</Chip>
                ))}
              </div>
            </Panel>
          )}

          <Panel title="Traços raciais">
            <TraitList traits={[...race.traits, ...(sub?.traits ?? [])]} />
          </Panel>
        </div>
      )}
    </div>
  );
}
