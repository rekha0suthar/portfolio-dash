import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComputedRow, Holding, Quote } from '@/lib/types';
import { sum, groupBy } from '@/lib/math';
import holdings from '@/data/holdings.json';

function computeRows(base: Holding[], quotes: Quote[]): { rows: ComputedRow[]; totals: { invest: number; pv: number; gain: number } } {
  const byTicker = new Map(quotes.map(q => [q.ticker, q] as const));
  const investment = sum(base.map(h => h.purchasePrice * h.qty));

  const rows: ComputedRow[] = base.map(h => {
    const q = byTicker.get(h.ticker);
    const cmp = q && isFinite(q.cmp) ? q.cmp : 0;
    const invest = h.purchasePrice * h.qty;
    const pv = cmp * h.qty;
    return {
      ...h,
      cmp,
      investment: invest,
      presentValue: pv,
      gainLoss: pv - invest,
      weightPct: investment > 0 ? (invest / investment) * 100 : 0,
      peRatio: q?.peRatio ?? null,
      latestEarnings: q?.latestEarnings ?? null,
    };
  });

  // Recalculate weights after total investment is known
  for (const r of rows) {
    r.weightPct = investment > 0 ? (r.investment / investment) * 100 : 0;
  }

  const totals = {
    invest: sum(rows.map(r => r.investment)),
    pv: sum(rows.map(r => r.presentValue)),
    gain: sum(rows.map(r => r.gainLoss)),
  };

  return { rows, totals };
}

export function usePortfolioData() {
  const tickers = useMemo(() => holdings.map(h => h.ticker), []);
  const exchanges = useMemo(() => holdings.map(h => h.exchange), []);

  const query = useQuery<{ quotes: Quote[]; errors?: Record<string, string> }>({
    queryKey: ['quotes', tickers.join(',')],
    queryFn: async () => {
      const url = `/api/quotes?tickers=${encodeURIComponent(tickers.join(','))}&exchanges=${encodeURIComponent(exchanges.join(','))}`;
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) {
        const errorText = await r.text();
        throw new Error(`Failed to fetch quotes: ${r.status} ${errorText}`);
      }
      return r.json();
    },
    refetchInterval: 15000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { rows, totals } = useMemo(() => 
    computeRows(holdings as Holding[], query.data?.quotes || []), 
    [query.data]
  );

  const bySector = useMemo(() => groupBy(rows, r => r.sector), [rows]);

  return {
    ...query,
    rows,
    totals,
    bySector,
  };
}
