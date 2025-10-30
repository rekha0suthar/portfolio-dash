'use client';
import { useState } from 'react';

interface NavbarProps {
  isFetching: boolean;
  dataUpdatedAt: number;
}

export default function Navbar({ isFetching, dataUpdatedAt }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Portfolio Dashboard</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Real-time market data</p>
            </div>
          </div>

          {/* Status and Info */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-1">
              <div className={`w-2 h-2 rounded-full ${isFetching ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {isFetching ? 'Syncing...' : 'Live'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {isFetching ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  `Updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`
                )}
              </div>
              <div className="text-xs text-gray-500">
                Yahoo + Google Finance
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className={`w-2 h-2 rounded-full ${isFetching ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isFetching ? 'Syncing...' : 'Live'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {isFetching ? 'Updating data...' : `Last updated ${new Date(dataUpdatedAt).toLocaleTimeString()}`}
              </div>
              <div className="text-xs text-gray-500">
                Data sources: Yahoo Finance + Google Finance
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
