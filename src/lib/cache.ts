import { LRUCache } from 'lru-cache';


export const cmpCache = new LRUCache<string, { price: number; asOf: string }>({
    max: 500,
    ttl: 15 * 1000, // 15s for CMP
});


export const peCache = new LRUCache<string, { pe: number | null; earnings: string | null; asOf: string }>({
    max: 500,
    ttl: 2 * 60 * 60 * 1000, // 2h for P/E and earnings data
});


// ultra-light circuit breaker for Google scraping
let consecutiveGoogleFailures = 0;
let googleBlockedUntil = 0; // epoch ms


export function googleBreakerOk() {
    const now = Date.now();
    return now >= googleBlockedUntil;
}


export function googleBreakerReport(success: boolean) {
    if (success) {
        consecutiveGoogleFailures = 0;
        return;
    }
    consecutiveGoogleFailures++;
    if (consecutiveGoogleFailures >= 5) {
        // back off for 10 minutes
        googleBlockedUntil = Date.now() + 10 * 60 * 1000;
        consecutiveGoogleFailures = 0;
    }
}