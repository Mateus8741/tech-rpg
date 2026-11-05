'use client';

import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { getSheet } from '@/lib/sheet';
import type { CharacterApi } from './useCharacter';
import { GhostButton, Panel, inputCls, selectCls } from './ui';
import { COIN_LABEL, COIN_NAME, COIN_ORDER, coinWeight, exchangeCoins, fmtKg, totalInGold, type CoinKey } from './equipment-logic';
import { cn } from '@/lib/utils';

export default function CoinsPanel({ api }: { api: CharacterApi }) {
  const c = api.character!;
  const coins = getSheet(c).coins;
  const [from, setFrom] = useState<CoinKey>('gp');
  const [to, setTo] = useState<CoinKey>('sp');
  const [amount, setAmount] = useState(10);

  const set = (k: CoinKey, v: number) => api.patchSheet({ coins: { ...coins, [k]: Math.max(0, Math.floor(v) || 0) } });

  const doExchange = () => {
    const r = exchangeCoins(coins, from, to, amount);
    if (!r) { toast.error('Troca impossível: moedas insuficientes ou valor muito baixo.'); return; }
    api.patchSheet({ coins: r.coins }, { immediate: true });
    toast.success(`${r.spent} ${COIN_LABEL[from]} → ${r.got} ${COIN_LABEL[to]}`);
  };

  return (
    <Panel
      title="Moedas"
      action={<span className="text-xs text-ink-soft">Total <strong className="text-gold-ink tabular-nums">{totalInGold(coins).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} PO</strong> · {fmtKg(coinWeight(coins))}</span>}
    >
      <div className="grid grid-cols-5 gap-2">
        {COIN_ORDER.map((k) => (
          <label key={k} className="block text-center">
            <span className="mb-1 block text-[10px] uppercase tracking-widest text-ink-muted" title={COIN_NAME[k]}>{COIN_LABEL[k]}</span>
            <input type="number" min={0} aria-label={COIN_NAME[k]} className={cn(inputCls, 'text-center tabular-nums')} value={coins[k]} onChange={(e) => set(k, Number(e.target.value))} />
          </label>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
        <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-ink" />
        <span>Trocar</span>
        <input type="number" min={1} aria-label="Quantidade a trocar" className={cn(inputCls, 'w-20 text-center')} value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} />
        <select aria-label="Moeda de origem" className={cn(selectCls, 'w-auto')} value={from} onChange={(e) => setFrom(e.target.value as CoinKey)}>
          {COIN_ORDER.map((k) => <option key={k} value={k}>{COIN_LABEL[k]}</option>)}
        </select>
        <span>por</span>
        <select aria-label="Moeda de destino" className={cn(selectCls, 'w-auto')} value={to} onChange={(e) => setTo(e.target.value as CoinKey)}>
          {COIN_ORDER.map((k) => <option key={k} value={k}>{COIN_LABEL[k]}</option>)}
        </select>
        <GhostButton onClick={doExchange} disabled={from === to}>Trocar</GhostButton>
      </div>
      <p className="mt-2 text-[11px] text-ink-faint">1 PL = 10 PO = 20 PE = 100 PP = 1000 PC. 50 moedas pesam 0,5 kg e entram na carga.</p>
    </Panel>
  );
}
