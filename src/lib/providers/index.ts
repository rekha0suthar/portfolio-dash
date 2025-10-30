import { toGooglePath } from '@/lib/tickers';
import { getYahooBasics } from './yahoo';                 // <- see step 4
import { getGooglePeAndEarnings } from './google';

type Pair = { ticker: string; exchange: 'NSE' | 'BSE' };

export async function fetchQuotesSafe(pairs: Pair[]) {
    const symbols = [...new Set(pairs.map(p => p.ticker))];
    const googlePaths = pairs.map(p => toGooglePath(p.ticker, p.exchange));

    // Start both requests in parallel
    const yahooPromise = getYahooBasics(symbols);
    const googlePromise = getGooglePeAndEarnings(googlePaths);

    // Wait for Yahoo first (faster), then Google
    const yRes = await Promise.allSettled([yahooPromise]);
    const yMap = yRes[0].status === 'fulfilled' ? yRes[0].value : {};

    // Get Google data (may be slower)
    const gRes = await Promise.allSettled([googlePromise]);
    const gMap = gRes[0].status === 'fulfilled' ? gRes[0].value : {};

    const errors: Record<string, string> = {};
    if (yRes[0].status === 'rejected') errors.yahoo = yRes[0].reason?.message || 'yahoo failed';
    if (gRes[0].status === 'rejected') errors.google = gRes[0].reason?.message || 'google failed';

    const quotes = pairs.map(p => {
        const y: Record<string, unknown> = (yMap as Record<string, unknown>)[p.ticker] || Object.create(null);
        const g: Record<string, unknown> = (gMap as Record<string, unknown>)[toGooglePath(p.ticker, p.exchange)] || Object.create(null);
        const pe = (g.pe ?? null) ?? (typeof y.trailingPE === 'number' ? y.trailingPE : null);
        const earnings = g.earnings ?? (typeof y.earningsEpoch === 'number'
            ? new Date(y.earningsEpoch * 1000).toISOString().slice(0, 10)
            : null);
        return {
            ticker: p.ticker,
            cmp: typeof y.price === 'number' ? y.price : NaN,
            peRatio: pe,
            latestEarnings: earnings,
            asOf: new Date().toISOString(),
        };
    });

    return { quotes, errors };
}
