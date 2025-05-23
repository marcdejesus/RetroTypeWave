
import type { Metadata } from 'next';
import { VT323 as FontSans } from 'next/font/google'; // Changed font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/SiteHeader';
import AppProviders from '@/components/AppProviders';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400', // VT323 typically has one weight
});

export const metadata: Metadata = {
  title: 'Type Royale',
  description: 'A multiplayer typing race game with AI bots.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          fontSans.variable
        )}
      >
        <AppProviders>
          <SiteHeader />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
