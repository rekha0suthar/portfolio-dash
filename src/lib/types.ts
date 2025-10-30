export type Exchange = 'NSE' | 'BSE';


export type Holding = {
    ticker: string; // e.g., INFY.NS or TCS.BO
    name: string;
    sector: string; // e.g., Technology
    exchange: Exchange; // NSE/BSE for display
    purchasePrice: number;
    qty: number;
};


export type Quote = {
    ticker: string;
    cmp: number; // Yahoo
    peRatio?: number | null; // Google
    latestEarnings?: string | null; // Google — free text or ISO date
    asOf: string; // ISO timestamp of when we fetched
};


export type ComputedRow = Holding & {
    investment: number;
    weightPct: number;
    cmp: number;
    presentValue: number;
    gainLoss: number;
    peRatio?: number | null;
    latestEarnings?: string | null;
};