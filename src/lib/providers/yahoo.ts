import yahooFinance from 'yahoo-finance2';
import { cmpCache } from '@/lib/cache';
const yf = new yahooFinance();

export type YahooBasics = { price?: number; trailingPE?: number | null; earningsEpoch?: number | null };

export async function getYahooBasics(tickers: string[]) {
    const out: Record<string, YahooBasics> = {};
    const toFetch: string[] = [];

    for (const t of tickers) {
        const c = cmpCache.get(t);
        if (c) out[t] = { ...(out[t] || {}), price: c.price };
        else toFetch.push(t);
    }

    if (!toFetch.length) return out;

    try {
        const quotes = await yf.quote(toFetch);
        const arr = Array.isArray(quotes) ? quotes : [quotes];
        for (const q of arr) {
            const symbol = q.symbol as string;
            const price = (q.regularMarketPrice ?? q.postMarketPrice ?? q.preMarketPrice) as number | undefined;
            const trailingPE = (q.trailingPE as number | undefined) ?? null;
            const earningsEpoch = (q.earningsTimestamp as number | undefined) ?? null;
            const val: YahooBasics = { trailingPE, earningsEpoch };
            if (symbol && typeof price === 'number') {
                val.price = price;
                cmpCache.set(symbol, { price, asOf: new Date().toISOString() });
            }
            out[symbol] = { ...(out[symbol] || {}), ...val };
        }
    } catch {
        // don’t throw — partials are fine
    }

    return out;
}
