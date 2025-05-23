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
      <div className="container max-w-7xl mx-auto flex h-20 items-center px-4 justify-between">
        {/* Left Group: Logo + Title - Takes natural width */}
        <div className="flex items-center h-12">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="Retro Type Wave Logo" width={56} height={56} className="text-primary" />
            <span className="font-bold sm:inline-block text-lg hidden md:block">
              Retro Type Wave
            </span>
          </Link>
        </div>

        {/* Middle Group: Nav Links - Expands and centers its content */}
        <nav className="flex items-center space-x-6 md:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <link.icon className="h-5 w-5 mr-0 md:mr-2" />
              <span className="hidden md:block">{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Group: Stats - Takes natural width */}
        <div className="flex items-center h-12">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-1 text-xs md:text-sm font-medium text-accent-foreground bg-accent px-3 py-2 rounded-md">
              <Trophy className="h-4 w-4 md:h-5 md:w-5" />
              {isLoading ? (
                <Skeleton className="h-4 w-10 md:h-5 md:w-12" />
              ) : (
                <span>{elo ?? '...'} Elo</span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs md:text-sm font-medium text-primary-foreground bg-primary/80 px-3 py-2 rounded-md">
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
