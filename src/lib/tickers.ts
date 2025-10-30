export const toYahooSymbol = (ticker: string, exchange: 'NSE' | 'BSE') => {
    if (ticker.includes('.NS') || ticker.includes('.BO')) return ticker;
    return exchange === 'NSE' ? `${ticker}.NS` : `${ticker}.BO`;
};


export const toGooglePath = (ticker: string, exchange: 'NSE' | 'BSE') => {
    // INFY -> INFY:NSE; if you pass INFY.NS remove suffix
    const clean = ticker.replace(/\.(NS|BO)$/i, '');
    const ex = exchange.toUpperCase();
    return `${clean}:${ex}`;
};