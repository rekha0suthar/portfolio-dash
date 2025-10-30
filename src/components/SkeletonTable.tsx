'use client';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export default function SkeletonTable({ rows = 4, columns = 11 }: SkeletonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr className="border-b border-gray-200">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="text-left px-6 py-4 font-bold text-gray-900 whitespace-nowrap text-sm uppercase tracking-wider">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <SkeletonTable rows={3} columns={11} />
    </div>
  );
}

export function SkeletonHeader() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
