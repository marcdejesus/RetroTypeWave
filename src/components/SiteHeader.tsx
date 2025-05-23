
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { Trophy, Zap } from 'lucide-react'; // Zap for WPM
import { useUserElo } from '@/hooks/useUserElo';
import { Skeleton } from '@/components/ui/skeleton';

export function SiteHeader() {
  const { elo, highestWpm, isLoading } = useUserElo();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* Replace BotMessageSquare icon with Image component */}
          <Image src="/logo.png" alt="Retro Type Wave Logo" width={24} height={24} className="text-primary" />
          <span className="font-bold sm:inline-block text-lg">
            Retro Type Wave
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-1 text-sm font-medium text-accent-foreground bg-accent px-3 py-1.5 rounded-md">
            <Trophy className="h-5 w-5" />
            {isLoading ? (
              <Skeleton className="h-5 w-12" />
            ) : (
              <span>{elo ?? '...'} Elo</span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm font-medium text-primary-foreground bg-primary/80 px-3 py-1.5 rounded-md">
            <Zap className="h-5 w-5" />
            {isLoading ? (
              <Skeleton className="h-5 w-10" />
            ) : (
              <span>{highestWpm ?? 0} WPM</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
