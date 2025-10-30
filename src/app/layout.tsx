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
          <div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}