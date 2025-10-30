'use client';
import { memo } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ComputedRow } from '@/lib/types';
import { round } from '@/lib/math';


const columns: ColumnDef<ComputedRow>[] = [
    { header: 'Particulars', accessorKey: 'name' },
    { header: 'Purchase Price', cell: ({ row }) => `₹${round(row.original.purchasePrice)}` },
    { header: 'Qty', accessorKey: 'qty' },
    { header: 'Investment', cell: ({ row }) => `₹${round(row.original.investment)}` },
    { header: 'Portfolio (%)', cell: ({ row }) => `${round(row.original.weightPct)}%` },
    { header: 'NSE/BSE', accessorKey: 'exchange' },
    { header: 'CMP', cell: ({ row }) => (row.original.cmp ? `₹${round(row.original.cmp)}` : '—') },
    { header: 'Present Value', cell: ({ row }) => `₹${round(row.original.presentValue)}` },
    {
        header: 'Gain/Loss', cell: ({ row }) => {
            const v = row.original.gainLoss;
            const isPositive = v >= 0;
            return (
                <div className="flex items-center space-x-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        isPositive 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {isPositive ? (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        )}
                        ₹{round(v)}
                    </span>
                </div>
            );
        }
    },
    { header: 'P/E Ratio', cell: ({ row }) => (row.original.peRatio ?? '—') },
    { header: 'Latest Earnings', cell: ({ row }) => row.original.latestEarnings ?? '—' },
];


const PortfolioTable = memo(function PortfolioTable({ rows }: { rows: ComputedRow[] }) {
    const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

    return (
        <div className="overflow-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(hg => (
                        <tr key={hg.id} className="border-b border-gray-200">
                            {hg.headers.map(h => (
                                <th key={h.id} className="text-left px-4 py-3 font-semibold text-gray-900 whitespace-nowrap text-xs uppercase tracking-wider">
                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((r, index) => (
                        <tr key={r.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            {r.getVisibleCells().map(c => (
                                <td key={c.id} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {flexRender(c.column.columnDef.cell, c.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});

export default PortfolioTable;