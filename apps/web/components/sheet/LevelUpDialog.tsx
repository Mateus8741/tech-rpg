'use client';

import { useEffect, useMemo, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ArrowUpCircle, Check, Dices, X } from 'lucide-react';
import { ABILITIES, abilityModifier, formatModifier, getClass, rollDice, type AbilityKey } from '@repo/rules';
import { cn } from '@/lib/utils';
import { getSheet } from '@/lib/sheet';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls, selectCls } from './ui';
import { Picker } from '../wizard/SpellsStep';
import { computeLevelUp, emptyDraft, type AsiMode, type LevelUpDraft } from './levelup';

type StepId = 'resumo' | 'classe' | 'magias' | 'revisao';
const LABEL: Record<StepId, string> = { resumo: 'Resumo', classe: 'Classe', magias: 'Magias', revisao: 'Revisão' };

const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
    <span className="text-ink-soft">{k}</span><span className="text-right tabular-nums text-ink">{v}</span>
  </div>
);

const pill = (on: boolean) =>
  cn('rounded-md border px-2.5 py-1.5 text-xs transition-colors', on
    ? 'border-[#6366f1] bg-[#6366f1]/15 text-indigo-ink-soft' : 'border-line text-ink-soft hover:border-[#6366f1]/40');

export default function LevelUpDialog({ api, open, onOpenChange }: {
  api: CharacterApi; open: boolean; onOpenChange: (o: boolean) => void;
}) {
  const c = api.character;
  const [draft, setDraft] = useState<LevelUpDraft>(emptyDraft);
  const [step, setStep] = useState<StepId>('resumo');

  // Cada abertura começa do zero: cancelar nunca altera a ficha.
  useEffect(() => { if (open) { setDraft(emptyDraft()); setStep('resumo'); } }, [open]);

  const r = useMemo(() => (c ? computeLevelUp(c, draft) : null), [c, draft]);
  if (!c || !r) return null;

  const set = (p: Partial<LevelUpDraft>) => setDraft((d) => ({ ...d, ...p }));
  const setAsi = (p: Partial<LevelUpDraft['asi']>) => setDraft((d) => ({ ...d, asi: { ...d.asi, ...p } }));
  const subLabel = getClass(getSheet(c).classId)?.subclassLabel ?? 'Subclasse';
  const hasSpells = r.spell.needCantrips > 0 || r.spell.needSpells > 0 || r.spell.newSlots.join() !== r.spell.oldSlots.join();
  const steps: StepId[] = ['resumo', 'classe', ...(hasSpells ? ['magias' as const] : []), 'revisao'];
  const idx = Math.max(0, steps.indexOf(step));

  const confirm = () => {
    if (r.errors.length) return;
    api.patchSheet(r.sheet, { immediate: true, columns: r.columns });
    toast.success(`Subiu para o nível ${r.newLevel}! +${r.hpGain} PV máximos.`);
    onOpenChange(false);
  };

  const rollHp = () => {
    const res = rollDice(`1d${r.hitDie}`);
    if (res) set({ hpRoll: res.total });
  };

  // Mensagem de bloqueio do passo atual (só exibida no passo, não bloqueia voltar).
  const stepBlock: Partial<Record<StepId, string | undefined>> = {
    resumo: draft.hpMode === 'roll' && draft.hpRoll == null ? 'Role o dado de vida ou escolha a média.' : undefined,
    classe: r.errors.find((e) => /subclasse|Escolha (o|a|os|as) |Conclua/i.test(e) && !/truque|magia/i.test(e)),
    magias: r.errors.find((e) => /truque|magia/i.test(e)),
  };
  const block = stepBlock[step];

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <AlertDialog.Content
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-base shadow-2xl sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
          aria-describedby="levelup-desc"
        >
          <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <AlertDialog.Title className="flex items-center gap-2 text-lg font-semibold text-ink">
                <ArrowUpCircle className="h-5 w-5 text-gold-ink" aria-hidden /> Subir para o nível {r.newLevel}
              </AlertDialog.Title>
              <AlertDialog.Description id="levelup-desc" className="mt-0.5 text-xs text-ink-muted">
                Nada é salvo até você confirmar na revisão. Cancelar descarta tudo.
              </AlertDialog.Description>
            </div>
            <AlertDialog.Cancel aria-label="Cancelar level up" className="rounded-lg p-1.5 text-ink-muted hover:bg-ink/5 hover:text-ink">
              <X className="h-4 w-4" />
            </AlertDialog.Cancel>
          </header>

          <ol className="flex gap-1 px-5 pt-3" aria-label="Passos">
            {steps.map((s, i) => (
              <li key={s} aria-current={s === step ? 'step' : undefined}
                className={cn('flex-1 rounded-full py-1 text-center text-[10px] uppercase tracking-widest',
                  s === step ? 'bg-[#6366f1] text-white' : i < idx ? 'bg-[#6366f1]/20 text-indigo-ink-soft' : 'bg-surface-3 text-ink-muted')}>
                {LABEL[s]}
              </li>
            ))}
          </ol>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {step === 'resumo' && (
              <>
                <Panel title="Nível">
                  <Row k="Nível" v={`${c.level} → ${r.newLevel}`} />
                  <Row k="Bônus de proficiência" v={r.pbNew !== r.pbOld ? `+${r.pbOld} → +${r.pbNew}` : `+${r.pbNew} (sem mudança)`} />
                </Panel>
                <Panel title={`Pontos de vida (d${r.hitDie})`}>
                  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Como ganhar PV">
                    <button type="button" role="radio" aria-checked={draft.hpMode === 'average'} className={pill(draft.hpMode === 'average')}
                      onClick={() => set({ hpMode: 'average' })}>Média ({Math.floor(r.hitDie / 2) + 1})</button>
                    <button type="button" role="radio" aria-checked={draft.hpMode === 'roll'} className={pill(draft.hpMode === 'roll')}
                      onClick={() => set({ hpMode: 'roll' })}>Rolar d{r.hitDie}</button>
                    {draft.hpMode === 'roll' && (
                      <GhostButton onClick={rollHp} disabled={draft.hpRoll != null} aria-label={`Rolar 1d${r.hitDie}`}>
                        <Dices className="h-3.5 w-3.5" /> {draft.hpRoll != null ? `Resultado: ${draft.hpRoll}` : 'Rolar'}
                      </GhostButton>
                    )}
                  </div>
                  <div className="mt-3 border-t border-line pt-2">
                    <Row k="Dado" v={draft.hpMode === 'roll' && draft.hpRoll == null ? '—' : r.hpBase} />
                    <Row k={`Mod. de Constituição (${formatModifier(abilityModifier(r.scoresAfter.con))})`} v={formatModifier(abilityModifier(r.scoresAfter.con))} />
                    {r.hpRetro !== 0 && <Row k="Retroativo (aumento de Con)" v={formatModifier(r.hpRetro)} />}
                    <Row k="Ganho total (mín. 1 pelo dado)" v={<b className="text-gold-ink">+{r.hpGain}</b>} />
                    <Row k="PV máximos" v={`${c.maxHitPoints} → ${c.maxHitPoints + r.hpGain}`} />
                  </div>
                </Panel>
              </>
            )}

            {step === 'classe' && (
              <>
                <Panel title={`Características do nível ${r.newLevel}`}>
                  {r.features.length ? (
                    <ul className="space-y-2">
                      {r.features.map((f) => (
                        <li key={`${f.level}-${f.name}`} className="rounded-lg border border-line bg-canvas p-3">
                          <p className="text-sm font-medium text-ink">{f.name}</p>
                          <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-ink-soft">{f.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-ink-muted">Nenhuma característica nova de classe neste nível.</p>}
                </Panel>

                {r.subclassNeeded && (
                  <Panel title={subLabel}>
                    <div className="space-y-2" role="radiogroup" aria-label="Subclasse">
                      {r.subclasses.map((s) => (
                        <button key={s.id} type="button" role="radio" aria-checked={draft.subclassId === s.id}
                          onClick={() => set({ subclassId: s.id })}
                          className={cn('w-full rounded-lg border p-3 text-left', draft.subclassId === s.id ? 'border-[#6366f1] bg-[#6366f1]/10' : 'border-line hover:border-[#6366f1]/40')}>
                          <p className="text-sm font-medium text-ink">{s.name}</p>
                          <p className="mt-0.5 text-xs text-ink-soft">{s.description}</p>
                        </button>
                      ))}
                    </div>
                  </Panel>
                )}

                {r.asiAvailable && (
                  <Panel title="Aumento de atributo ou talento">
                    <div className="mb-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Tipo de melhoria">
                      {([['plus2', '+2 em um atributo'], ['plus1', '+1 em dois atributos'], ['feat', 'Talento']] as [AsiMode, string][]).map(([m, l]) => (
                        <button key={m} type="button" role="radio" aria-checked={draft.asi.mode === m} className={pill(draft.asi.mode === m)}
                          onClick={() => setAsi({ mode: m, b: '' })}>{l}</button>
                      ))}
                    </div>
                    {draft.asi.mode === 'feat' ? (
                      <input value={draft.asi.feat} onChange={(e) => setAsi({ feat: e.target.value })} className={inputCls}
                        placeholder="Nome do talento (anotado nas escolhas da ficha)" aria-label="Nome do talento" />
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {(['a', ...(draft.asi.mode === 'plus1' ? ['b'] : [])] as ('a' | 'b')[]).map((slot) => (
                          <select key={slot} className={selectCls} value={draft.asi[slot]}
                            aria-label={slot === 'a' ? 'Atributo principal' : 'Segundo atributo'}
                            onChange={(e) => setAsi({ [slot]: e.target.value as AbilityKey })}>
                            <option value="">Atributo…</option>
                            {ABILITIES.map((a) => {
                              const inc = draft.asi.mode === 'plus2' ? 2 : 1;
                              const full = r.scoresBefore[a.key] + inc > 20;
                              const taken = slot === 'b' ? draft.asi.a === a.key : draft.asi.mode === 'plus1' && draft.asi.b === a.key;
                              return <option key={a.key} value={a.key} disabled={full || taken}>{a.name} ({r.scoresBefore[a.key]}){full ? ' — máx. 20' : ''}</option>;
                            })}
                          </select>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 grid grid-cols-6 gap-1 text-center text-[11px]" aria-label="Atributos após a melhoria">
                      {ABILITIES.map((a) => {
                        const ch = r.scoresAfter[a.key] !== r.scoresBefore[a.key];
                        return (
                          <div key={a.key} className={cn('rounded-md border py-1.5', ch ? 'border-[#6366f1] text-indigo-ink-soft' : 'border-line text-ink-muted')}>
                            <div className="uppercase">{a.abbr}</div>
                            <div className="tabular-nums text-sm text-ink">{r.scoresAfter[a.key]}</div>
                            <div>{formatModifier(abilityModifier(r.scoresAfter[a.key]))}</div>
                          </div>
                        );
                      })}
                    </div>
                  </Panel>
                )}
              </>
            )}

            {step === 'magias' && (
              <>
                <Panel title="Espaços de magia">
                  {r.spell.newSlots.length ? (
                    <div className="flex flex-wrap gap-2">
                      {r.spell.newSlots.map((n, i) => {
                        const was = r.spell.oldSlots[i] ?? 0;
                        return (
                          <div key={i} className={cn('rounded-lg border px-3 py-1.5 text-center text-xs', n !== was ? 'border-[#f5c451]/60 text-gold-ink' : 'border-line text-ink-soft')}>
                            <div className="text-[10px] uppercase tracking-widest">{i + 1}º</div>
                            <div className="tabular-nums">{was !== n ? `${was} → ${n}` : n}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : <p className="text-sm text-ink-muted">Sem espaços de magia neste nível.</p>}
                </Panel>
                {r.spell.needCantrips > 0 && (
                  <Picker title={`Novos truques (+${r.spell.needCantrips})`} list={r.spell.cantripPool} selected={draft.cantrips}
                    max={r.spell.needCantrips} onChange={(cantrips) => set({ cantrips })} />
                )}
                {r.spell.needSpells > 0 && (
                  <Picker
                    title={r.spell.newPlan?.mode === 'prepared' ? `Novas magias preparadas (+${r.spell.needSpells})` : r.spell.newPlan?.mode === 'book' ? `Grimório (+${r.spell.needSpells})` : `Novas magias conhecidas (+${r.spell.needSpells})`}
                    list={r.spell.spellPool} selected={draft.spells} max={r.spell.needSpells} onChange={(spells) => set({ spells })} />
                )}
              </>
            )}

            {step === 'revisao' && (
              <Panel title="Revisão">
                <Row k="Nível" v={`${c.level} → ${r.newLevel}`} />
                <Row k="PV máximos" v={`${c.maxHitPoints} → ${c.maxHitPoints + r.hpGain} (+${r.hpGain})`} />
                {r.pbNew !== r.pbOld && <Row k="Proficiência" v={`+${r.pbOld} → +${r.pbNew}`} />}
                {ABILITIES.filter((a) => r.scoresAfter[a.key] !== r.scoresBefore[a.key]).map((a) => (
                  <Row key={a.key} k={a.name} v={`${r.scoresBefore[a.key]} → ${r.scoresAfter[a.key]}`} />
                ))}
                {draft.asi.mode === 'feat' && r.asiAvailable && <Row k="Talento" v={draft.asi.feat} />}
                {draft.subclassId && <Row k="Subclasse" v={r.subclasses.find((s) => s.id === draft.subclassId)?.name} />}
                {r.features.length > 0 && <Row k="Características" v={r.features.map((f) => f.name).join(', ')} />}
                {draft.cantrips.length > 0 && <Row k="Truques" v={`${draft.cantrips.length} novo(s)`} />}
                {draft.spells.length > 0 && <Row k="Magias" v={`${draft.spells.length} nova(s)`} />}
                {r.errors.length > 0 && (
                  <ul role="alert" className="mt-3 space-y-1 text-xs text-danger-soft">
                    {r.errors.map((e) => <li key={e}>• {e}</li>)}
                  </ul>
                )}
              </Panel>
            )}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
            <GhostButton onClick={() => idx === 0 ? onOpenChange(false) : setStep(steps[idx - 1]!)}>
              {idx === 0 ? 'Cancelar' : <><ArrowLeft className="h-3.5 w-3.5" /> Voltar</>}
            </GhostButton>
            {block && step !== 'revisao' && <span className="flex-1 text-right text-[11px] text-danger-soft">{block}</span>}
            {step === 'revisao' ? (
              <button type="button" onClick={confirm} disabled={r.errors.length > 0}
                className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[#f5c451] to-[#fb923c] px-4 py-1.5 text-sm font-semibold text-[#0a0c14] disabled:opacity-40">
                <Check className="h-4 w-4" /> Confirmar nível {r.newLevel}
              </button>
            ) : (
              <GhostButton onClick={() => setStep(steps[idx + 1]!)} disabled={!!block} className="text-indigo-ink-soft">
                Avançar <ArrowRight className="h-3.5 w-3.5" />
              </GhostButton>
            )}
          </footer>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
