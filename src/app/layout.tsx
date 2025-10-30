import './globals.css';
import Providers from './providers';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Portfolio Dashboard',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="max-w-6xl mx-auto p-4">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}