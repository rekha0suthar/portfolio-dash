'use client';
import { round } from '@/lib/math';
import PortfolioTable from '@/components/PortfolioTable';
import PortfolioChart from '@/components/PortfolioChart';
import Navbar from '@/components/Navbar';
import { SkeletonCard } from '@/components/SkeletonTable';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export default function Page() {
  const { data, isFetching, dataUpdatedAt, error, refetch, isLoading, rows, totals, bySector } = usePortfolioData();


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Responsive Navbar */}
      <Navbar isFetching={isFetching} dataUpdatedAt={dataUpdatedAt} />
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Data Fetching Error</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{error.message}</p>
                <p className="mt-1">The dashboard will retry automatically.</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => refetch()}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                >
                  Retry Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {data?.errors && Object.keys(data.errors).length > 0 && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Partial Data Available</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>Some data sources are temporarily unavailable:</p>
                <ul className="mt-1 list-disc list-inside">
                  {Object.entries(data.errors).map(([source, error]) => (
                    <li key={source}><strong>{source}:</strong> {error}</li>
                  ))}
                </ul>
                <p className="mt-1">The dashboard will continue to show available data and retry failed sources.</p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Main Content */}
      <div className="w-full px-4 py-6">
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Investment</p>
                <p className="text-2xl font-semibold text-gray-900">₹{round(totals.invest).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Value</p>
                <p className="text-2xl font-semibold text-gray-900">₹{round(totals.pv).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${totals.gain >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <svg className={`w-6 h-6 ${totals.gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gain/Loss</p>
                <p className={`text-2xl font-semibold ${totals.gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {totals.gain >= 0 ? '+' : ''}₹{round(totals.gain).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${totals.gain >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <svg className={`w-6 h-6 ${totals.gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Return %</p>
                <p className={`text-2xl font-semibold ${totals.gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {totals.invest > 0 ? `${((totals.gain / totals.invest) * 100).toFixed(2)}%` : '0.00%'}
                </p>
              </div>
            </div>
          </div>
        </div>

               {/* Main Content Grid */}
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Portfolio Tables */}
          <div className="space-y-6 xl:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio by Sector</h2>
            {isLoading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(bySector).map(([sector, items]) => {
                  const invest = items.reduce((a, r) => a + r.investment, 0);
                  const pv = items.reduce((a, r) => a + r.presentValue, 0);
                  const gain = pv - invest;
                  const gainPercent = invest > 0 ? (gain / invest) * 100 : 0;
                  
                  return (
                    <div key={sector} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{sector.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{sector}</h3>
                              <p className="text-sm text-gray-600">{items.length} stock{items.length !== 1 ? 's' : ''}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {gain >= 0 ? '+' : ''}₹{round(gain).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <PortfolioTable rows={items} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chart Section */}
          <div className="space-y-6 xl:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio Distribution</h2>
            {isLoading ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
                <div className="h-96 sm:h-[28rem] lg:h-[32rem] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !isLoading && rows.length > 0 && (
                <PortfolioChart data={rows} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}