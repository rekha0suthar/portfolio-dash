'use client';
import { round } from '@/lib/math';
import PortfolioTable from '@/components/PortfolioTable';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Page() {
  const { data, isFetching, dataUpdatedAt, error, refetch, isLoading, rows, totals, bySector } = usePortfolioData();


  return (
    <div className="space-y-6">
      <header className="bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time portfolio tracking • Auto-refreshes every 15s
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isFetching ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-xs text-gray-500">
                {isFetching ? 'Syncing...' : 'Live'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {isFetching ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Refreshing…</span>
                </div>
              ) : (
                `Last updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Data: Yahoo Finance + Google Finance
            </div>
          </div>
        </div>
      </header>
        <section className="space-y-3">
          {Object.entries(bySector).map(([sector, items]) => {
            const invest = items.reduce((a, r) => a + r.investment, 0);
            const pv = items.reduce((a, r) => a + r.presentValue, 0);
            const gain = pv - invest;
            return (
              <div key={sector} className="border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="font-medium">{sector}</div>
                  <div className="text-sm text-gray-700">
                    Investment: ₹{round(invest)} · Present: ₹{round(pv)} · Gain/Loss: <span className={gain >= 0 ? 'text-emerald-600' : 'text-red-600'}>₹{round(gain)}</span>
                  </div>
                </div>
                <PortfolioTable rows={items} />
              </div>
            );
          })}
        </section>
    </div>
  );
}