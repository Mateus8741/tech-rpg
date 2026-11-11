'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ABILITIES, WEAPONS, getBackground, getClass, getRace, getSpell } from '@repo/rules';
import { getCharacter, type Character } from '@/lib/api';
import { derivedStats, getSheet, scoreOf } from '@/lib/sheet';
import PaperSheet from '@/components/sheet/PaperSheet';
import './print.css';

const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
const COIN_LABELS: [keyof ReturnType<typeof getSheet>['coins'], string][] = [['pp', 'PL'], ['gp', 'PO'], ['ep', 'PE'], ['sp', 'PP'], ['cp', 'PC']];

export default function PrintPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<Character | null>(null);
  const [error, setError] = useState('');
  const [layout, setLayout] = useState<'papel' | 'resumo'>('papel');

  // Marca o body para o CSS de impressão (esconde sidebar/DiceTray)
  useEffect(() => {
    document.body.classList.add('ps-print');
    return () => document.body.classList.remove('ps-print');
  }, []);

  useEffect(() => {
    const u = localStorage.getItem('rpg_username');
    if (!u) { router.push('/'); return; }
    getCharacter(id, u).then(setC).catch(() => setError('Não foi possível carregar a ficha.'));
  }, [id, router]);

  if (error) return <div className="ps-root p-8">{error}</div>;
  if (!c) return <div className="ps-root p-8">Carregando...</div>;

  return (
    <div className="ps-root">
      <div className="ps-toolbar">
        <Link href={`/characters/${c.id}`}>← Voltar à ficha</Link>
        <button type="button" onClick={() => setLayout((l) => (l === 'papel' ? 'resumo' : 'papel'))}>
          Layout: {layout === 'papel' ? 'Ficha de papel' : 'Resumo'}
        </button>
        <button type="button" className="primary" onClick={() => window.print()}>Imprimir / Salvar PDF</button>
      </div>
      {layout === 'papel' ? (
        <div className="ps-paper"><PaperSheet character={c} /></div>
      ) : <Sheet c={c} />}
    </div>
  );
}

function Sheet({ c }: { c: Character }) {
  const sheet = getSheet(c);
  const d = derivedStats(c);
  const cls = getClass(sheet.classId);
  const race = getRace(sheet.raceId);
  const sub = cls?.subclasses.find((s) => s.id === sheet.subclassId);
  const subrace = race?.subraces.find((s) => s.id === sheet.subraceId);
  const bg = getBackground(sheet.backgroundId);

  const equipment = c.equipment ?? [];
  const attacks = equipment.filter((e) => (e.attack ?? 0) !== 0 || WEAPONS.some((w) => e.name.startsWith(w.name)));
  const features = [
    ...(cls?.features ?? []).filter((f) => f.level <= c.level).map((f) => `${f.name} (Nv ${f.level})`),
    ...(sub?.features ?? []).filter((f) => f.level <= c.level).map((f) => `${f.name} (${sub!.name}, Nv ${f.level})`),
    ...(race?.traits ?? []).map((t) => t.name),
    ...(subrace?.traits ?? []).map((t) => t.name),
    ...(bg ? [bg.feature.name] : []),
    ...sheet.chosenFeatures,
    ...(Array.isArray(c.features) ? c.features : []).filter((f) => f && typeof f === 'object' && 'name' in f).map((f: { name: string }) => f.name),
  ];

  // Magias agrupadas por nível
  const known = Array.from(new Set([...sheet.spellsKnown, ...sheet.spellsPrepared]));
  const byLevel = new Map<number, { name: string; prepared: boolean }[]>();
  for (const sid of known) {
    const s = getSpell(sid);
    if (!s) continue;
    const arr = byLevel.get(s.level) ?? [];
    arr.push({ name: s.name, prepared: sheet.spellsPrepared.includes(sid) });
    byLevel.set(s.level, arr);
  }
  const levels = [...byLevel.keys()].sort((a, b) => a - b);
  const spellAbility = d.spell ? ABILITIES.find((a) => a.key === d.spell!.ability) : null;

  return (
    <>
      <div className="ps-page">
        <div className="ps-head">
          <div>
            <h1 className="ps-h1">{c.name}</h1>
            <span className="ps-muted">{race?.name ?? c.race}{subrace ? ` (${subrace.name})` : ''} · {cls?.name ?? c.class}{sub ? ` — ${sub.name}` : ''} · Nível {c.level}</span>
          </div>
          <div className="ps-meta">
            <div><b>Antecedente</b>{bg?.name ?? c.background ?? '—'}</div>
            <div><b>Tendência</b>{c.alignment || '—'}</div>
            <div><b>Experiência</b>{c.experience}</div>
          </div>
        </div>

        <div className="ps-stats">
          <Stat label="Classe de Armadura" v={c.armorClass} />
          <Stat label="Iniciativa" v={sign(d.initiative)} />
          <Stat label="Deslocamento" v={`${d.speed} m`} />
          <Stat label="Bônus de Proficiência" v={sign(d.pb)} />
          <Stat label="Pontos de Vida" v={`${c.currentHitPoints}/${c.maxHitPoints}`} />
          <Stat label="PV Temporários" v={c.temporaryHitPoints || 0} />
          <Stat label="Dado de Vida" v={`${c.level - sheet.hitDiceUsed}d${d.hitDie}`} />
          <Stat label="Percepção Passiva" v={d.passivePerception} />
        </div>

        <div className="ps-grid ps-cols3">
          <div>
            {ABILITIES.map((a) => (
              <div key={a.key} className="ps-ability">
                <div><span className="ps-label">{a.name}</span><span className="sc">{scoreOf(c, a.key)}</span></div>
                <span className="mod">{sign(Math.floor((scoreOf(c, a.key) - 10) / 2))}</span>
              </div>
            ))}
            <div className="ps-box">
              <h3>Salvaguardas</h3>
              {d.saves.map((s) => (
                <div key={s.key} className="ps-row"><span className={`ps-dot ${s.proficient ? 'on' : ''}`} /><span className="ps-val">{sign(s.bonus)}</span>{s.name}</div>
              ))}
            </div>
          </div>

          <div className="ps-box">
            <h3>Perícias</h3>
            {d.skills.map((s) => (
              <div key={s.key} className="ps-row">
                <span className={`ps-dot ${s.expertise ? 'ex' : s.proficient ? 'on' : ''}`} /><span className="ps-val">{sign(s.bonus)}</span>
                {s.name} <span className="ps-muted">({ABILITIES.find((a) => a.key === s.ability)?.abbr})</span>
              </div>
            ))}
          </div>

          <div className="ps-grid" style={{ alignContent: 'start' }}>
            <div className="ps-box">
              <h3>Ataques e Habilidades</h3>
              {attacks.length === 0 && (c.abilities ?? []).length === 0 && <span className="ps-muted">—</span>}
              <table className="ps-table"><tbody>
                {attacks.map((e, i) => <tr key={`a${i}`}><td>{e.name}</td><td>{(e.attack ?? 0) ? `${sign(e.attack!)} atq` : ''}</td></tr>)}
                {(c.abilities ?? []).map((a, i) => <tr key={`b${i}`}><td>{a.name}</td><td>{a.damage}</td></tr>)}
              </tbody></table>
            </div>
            <div className="ps-box">
              <h3>Equipamento</h3>
              <div className="ps-chips">
                {equipment.map((e, i) => <span key={i}>{e.equipped ? '▣' : '▢'} {e.name}{e.quantity && e.quantity > 1 ? ` ×${e.quantity}` : ''}</span>)}
                {(c.inventory ?? []).map((it, i) => <span key={`i${i}`}>• {it.name} ×{it.quantity}</span>)}
                {equipment.length + (c.inventory ?? []).length === 0 && <span className="ps-muted">—</span>}
              </div>
              <div className="ps-row" style={{ marginTop: 5, gap: 10 }}>
                {COIN_LABELS.map(([k, l]) => <span key={k}><b>{sheet.coins[k]}</b> {l}</span>)}
              </div>
            </div>
            <div className="ps-box">
              <h3>Idiomas e Proficiências</h3>
              <p className="ps-p"><b>Idiomas:</b> {sheet.languages.join(', ') || '—'}</p>
              <p className="ps-p"><b>Ferramentas:</b> {sheet.toolProficiencies.join(', ') || '—'}</p>
            </div>
          </div>
        </div>

        <div className="ps-box" style={{ marginTop: 8 }}>
          <h3>Características e Traços</h3>
          <div className="ps-chips">{features.length ? features.map((f, i) => <span key={i}>• {f}</span>) : <span className="ps-muted">—</span>}</div>
        </div>
      </div>

      <div className="ps-page ps-pagebreak">
        {d.spell && (
          <div className="ps-box">
            <h3>Magias</h3>
            <div className="ps-row" style={{ gap: 18, marginBottom: 4 }}>
              <span><b>Atributo:</b> {spellAbility?.name}</span>
              <span><b>CD:</b> {d.spell.dc}</span>
              <span><b>Ataque:</b> {sign(d.spell.attack)}</span>
            </div>
            {d.spell.slots.length > 0 && (
              <div className="ps-chips" style={{ marginBottom: 4 }}>
                {d.spell.slots.map((n, i) => n > 0 && (
                  <span key={i}>Nv {i + 1}: {Array.from({ length: n }, (_, k) => <span key={k} className={`ps-dot ${k < (sheet.spellSlotsUsed[i] ?? 0) ? 'on' : ''}`} style={{ display: 'inline-block', marginRight: 2 }} />)}</span>
                ))}
              </div>
            )}
            {levels.length === 0 && <span className="ps-muted">Nenhuma magia registrada.</span>}
            {levels.map((lv) => (
              <p key={lv} className="ps-p"><b>{lv === 0 ? 'Truques' : `Nível ${lv}`}:</b> {byLevel.get(lv)!.map((s) => (s.prepared && lv > 0 ? `${s.name}*` : s.name)).join(', ')}</p>
            ))}
            {levels.some((l) => l > 0) && <span className="ps-muted">* preparada</span>}
          </div>
        )}

        <div className="ps-grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 8 }}>
          <Text title="Traços de Personalidade" t={sheet.personality.traits} />
          <Text title="Ideais" t={sheet.personality.ideals} />
          <Text title="Vínculos" t={sheet.personality.bonds} />
          <Text title="Defeitos" t={sheet.personality.flaws} />
        </div>
        <div className="ps-grid" style={{ marginTop: 8 }}>
          <Text title="Aparência" t={sheet.appearance} />
          <Text title="História" t={sheet.backstory} />
          <Text title="Anotações" t={c.notes} />
        </div>
      </div>
    </>
  );
}

const Stat = ({ label, v }: { label: string; v: string | number }) => (
  <div className="ps-stat"><div className="v">{v}</div><span className="ps-label">{label}</span></div>
);
const Text = ({ title, t }: { title: string; t?: string }) => (
  <div className="ps-box"><h3>{title}</h3><p className="ps-p">{t?.trim() || '—'}</p></div>
);
