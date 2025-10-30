// import { load } from 'cheerio'; // Currently using regex instead of cheerio
import { fetch } from 'undici';
import { peCache, googleBreakerOk, googleBreakerReport } from '../cache';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';


async function scrapeGoogleOne(googlePath: string) {
    // googlePath format: INFY:NSE
    const cached = peCache.get(googlePath);
    if (cached) return cached;


    if (!googleBreakerOk()) {
        // serve stale/null if circuit tripped
        return { pe: null, earnings: null, asOf: new Date().toISOString() };
    }


    try {
        const url = `https://www.google.com/finance/quote/${encodeURIComponent(googlePath)}`;
        const res = await fetch(url, {
            headers: {
                'user-agent': UA,
                'accept-language': 'en-US,en;q=0.9',
            },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        // const $ = load(html); // Currently using regex instead of cheerio


        // The P/E ratio label and value are in separate divs
        // Pattern: P/E ratio</div>...tooltip...</div></span><div class="P6K39c">22.01</div>
        const peMatch = html.match(/P\/E ratio<\/div>.*?<div class="P6K39c">(\d+\.?\d*)<\/div>/i);
        const peText = peMatch ? peMatch[1] : null;
        
        // Look for earnings date in a different way - search for "Reported on" pattern
        const findEarningsDate = (): string | null => {
            const reportedOnMatch = html.match(/Reported on (\d{1,2}\/\d{1,2}\/\d{2,4})/i);
            if (reportedOnMatch) return reportedOnMatch[1];
            
            const fiscalMatch = html.match(/Fiscal Q\d+ \d{4} ended (\d{1,2}\/\d{1,2}\/\d{2,4})/i);
            if (fiscalMatch) return fiscalMatch[1];
            
            return null;
        };
        
        const earningsText = findEarningsDate();


        const pe = peText ? parseFloat(peText.replace(/[^\d.]/g, '')) : null;
        const earnings = earningsText ? earningsText : null; // keep human text, don’t over-normalize


        const payload = { pe: isFinite(pe as number) ? (pe as number) : null, earnings, asOf: new Date().toISOString() };
        peCache.set(googlePath, payload);
        googleBreakerReport(true);
        return payload;
    } catch {
        // don't blow up the caller; report failure for breaker logic
        googleBreakerReport(false);
        return { pe: null, earnings: null, asOf: new Date().toISOString() };
    }
}


export async function getGooglePeAndEarnings(googlePaths: string[]) {
    const out: Record<string, { pe: number | null; earnings: string | null }> = {};
    for (const p of googlePaths) {
        const v = await scrapeGoogleOne(p);
        out[p] = { pe: v.pe, earnings: v.earnings };
    }
    return out;
}