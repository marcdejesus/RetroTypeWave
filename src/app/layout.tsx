
import type { Metadata } from 'next';
import { VT323 as FontSans } from 'next/font/google'; // Changed font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/SiteHeader';
import AppProviders from '@/components/AppProviders';
import { GameInstructions } from '@/components/GameInstructions'; // Changed import
import { EloLeaderboard } from '@/components/EloLeaderboard';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: '400', // VT323 typically has one weight
});

export const metadata: Metadata = {
  title: 'Retro Type Wave',
  description: 'A multiplayer typing race game with AI bots and a retro wave theme.',
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
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar (Game Instructions) - Hidden on small screens, sticky-like behavior */}
            <aside className="hidden lg:flex flex-col w-60 p-4 border-r border-border bg-background overflow-y-auto">
              <div className="sticky top-4"> {/* Content within aside can be sticky */}
                <GameInstructions /> {/* Changed component */}
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </main>

            {/* Right Sidebar (Leaderboard) - Hidden on small screens, sticky-like behavior */}
            <aside className="hidden lg:flex flex-col w-72 p-4 border-l border-border bg-background overflow-y-auto">
              <div className="sticky top-4"> {/* Content within aside can be sticky */}
                <EloLeaderboard />
              </div>
            </aside>
          </div>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
