import { NextRequest } from 'next/server';
import { fetchQuotesSafe } from '@/lib/providers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('tickers') || '';
    const exch = searchParams.get('exchanges') || '';

    const tickers = raw.split(',').map(s => s.trim()).filter(Boolean);
    if (tickers.length === 0) {
        return new Response(JSON.stringify({ quotes: [], meta: { error: 'No tickers provided' } }), { status: 400 });
    }

    const exchanges = exch.split(',').map(s => s.trim().toUpperCase()).filter(Boolean) as ('NSE' | 'BSE')[];
    const pairs = tickers.map((t, i) => ({ ticker: t, exchange: exchanges[i] || (t.endsWith('.NS') ? 'NSE' : 'BSE') }));

    const { quotes, errors } = await fetchQuotesSafe(pairs);   // <— never throws
    if (Object.keys(errors).length) {
        // helpful on dev console; harmless in prod
        console.error('[quotes] provider errors:', errors);
    }

    return new Response(JSON.stringify({
        quotes,
        meta: { source: { cmp: 'yahoo', peEarnings: 'google' }, errors }
    }), { headers: { 'content-type': 'application/json' } });
}
