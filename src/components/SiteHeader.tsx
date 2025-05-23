
"use client";

import Link from 'next/link';
import { Trophy, BotMessageSquare, Zap } from 'lucide-react'; // Zap for WPM
import { useUserElo } from '@/hooks/useUserElo';
import { Skeleton } from '@/components/ui/skeleton';

export function SiteHeader() {
  const { elo, highestWpm, isLoading } = useUserElo();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BotMessageSquare className="h-6 w-6 text-primary" />
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
