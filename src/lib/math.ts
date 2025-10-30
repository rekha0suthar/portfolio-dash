export const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);


export const round = (n: number, d = 2) => {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
};


export function groupBy<T, K extends string | number>(items: T[], key: (t: T) => K) {
    return items.reduce((acc, item) => {
        const k = key(item);
        (acc[k] ||= []).push(item);
        return acc;
    }, {} as Record<K, T[]>);
}