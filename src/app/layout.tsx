import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Changed font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/SiteHeader';
import AppProviders from '@/components/AppProviders';
import { GameInstructions } from '@/components/GameInstructions';
import { EloLeaderboard } from '@/components/EloLeaderboard';
import { MusicPlayer } from '@/components/MusicPlayer'; // Import MusicPlayer
import { SocialMediaLinks } from '@/components/SocialMediaLinks'; // Import SocialMediaLinks
import { Footer } from '@/components/Footer'; // Import Footer

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  // weight: '400', // Inter supports multiple weights, can be omitted or specified
});

export const metadata: Metadata = {
  title: 'Retro Type Wave - Fun Multiplayer Typing Game',
  description: 'Improve your typing speed and accuracy with Retro Type Wave - a retro-themed multiplayer typing race game. Challenge AI opponents, track your progress with Elo ratings, and climb the global leaderboard!',
  keywords: 'typing game, typing practice, typing speed, WPM, multiplayer typing, retro wave, typing test, keyboard practice, typing skills, typing competition',
  authors: [{ name: 'Marc De Jesus', url: 'https://marcdejesusdev.com' }],
  creator: 'Marc De Jesus',
  publisher: 'Marc De Jesus',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://retrotypewave.com',
    siteName: 'Retro Type Wave',
    title: 'Retro Type Wave - Fun Multiplayer Typing Game',
    description: 'Improve your typing speed and accuracy with Retro Type Wave - a retro-themed multiplayer typing race game. Challenge AI opponents, track your progress with Elo ratings, and climb the global leaderboard!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Retro Type Wave - Multiplayer Typing Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retro Type Wave - Fun Multiplayer Typing Game',
    description: 'Improve your typing speed and accuracy with Retro Type Wave - a retro-themed multiplayer typing race game. Challenge AI opponents and climb the global leaderboard!',
    images: ['/og-image.png'],
    creator: '@marcdejesusdev',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-site-verification-code', // You'll need to add this
  },
  alternates: {
    canonical: 'https://retrotypewave.com',
  },
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
            {/* Left Sidebar (Game Instructions & Music Player) - Hidden on small screens, sticky-like behavior */}
            <aside className="hidden lg:flex flex-col w-64 p-4 border-r border-border bg-background overflow-y-auto"> {/* Changed w-60 to w-64 */}
              <div className="sticky top-4 flex flex-col space-y-4"> {/* Ensures content sticks and has spacing */}
                <GameInstructions />
                <MusicPlayer />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 py-8">
                {children}
              </div>
            </main>

            {/* Right Sidebar (Leaderboard & Social Media) - Hidden on small screens, sticky-like behavior */}
            <aside className="hidden lg:flex flex-col w-64 p-4 border-l border-border bg-background overflow-y-auto"> {/* Changed w-72 to w-64 */}
              <div className="sticky top-4 flex flex-col space-y-4"> {/* Ensures content sticks and has spacing */}
                <EloLeaderboard />
                <SocialMediaLinks /> {/* Add SocialMediaLinks here */}
              </div>
            </aside>
          </div>
          <Footer /> {/* Add Footer here */}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
