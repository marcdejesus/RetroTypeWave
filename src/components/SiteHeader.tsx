"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Trophy, Zap, HomeIcon, Gamepad2Icon } from 'lucide-react';
import { useUserElo } from '@/hooks/useUserElo';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const { elo, highestWpm, isLoading } = useUserElo();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Game', href: '/game-lobby', icon: Gamepad2Icon },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container max-w-7xl mx-auto flex h-16 items-center px-4 justify-between">
        {/* Left Group: Logo + Title */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Retro Type Wave Logo" width={48} height={48} className="text-primary" />
            <span className="font-bold sm:inline-block text-lg hidden md:block">
              Retro Type Wave
            </span>
          </Link>
        </div>

        {/* Middle Group: Nav Links */}
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <HomeIcon className="h-5 w-5 mr-0 md:mr-2" />
            <span className="hidden md:block">Home</span>
          </Link>
          <Link
            href="/game-lobby"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/game-lobby" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <Gamepad2Icon className="h-5 w-5 mr-0 md:mr-2" />
            <span className="hidden md:block">Game</span>
          </Link>
        </nav>

        {/* Right Group: Stats */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-1 text-xs md:text-sm font-medium text-accent-foreground bg-accent px-2 py-1 md:px-3 md:py-1.5 rounded-md">
              <Trophy className="h-4 w-4 md:h-5 md:w-5" />
              {isLoading ? (
                <Skeleton className="h-4 w-10 md:h-5 md:w-12" />
              ) : (
                <span>{elo ?? '...'} Elo</span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs md:text-sm font-medium text-accent-foreground bg-accent px-2 py-1 md:px-3 md:py-1.5 rounded-md">
              <Zap className="h-4 w-4 md:h-5 md:w-5" />
              {isLoading ? (
                <Skeleton className="h-4 w-8 md:h-5 md:w-10" />
              ) : (
                <span>{highestWpm ?? 0} WPM</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
