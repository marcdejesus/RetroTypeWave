
"use client";

import type { PlayerStats } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface PlayerProgressDisplayProps {
  player: PlayerStats;
  isCurrentUser?: boolean;
}

export function PlayerProgressDisplay({ player, isCurrentUser = false }: PlayerProgressDisplayProps) {
  return (
    <div className={cn(
      "p-3 rounded-lg border transition-all duration-300 ease-in-out",
      isCurrentUser ? "bg-primary/10 border-primary" : "bg-card", // Removed shadow-md
      player.progress === 100 ? "opacity-70" : ""
    )}>
      <div className="flex items-center space-x-3 mb-2">
        <Avatar className="h-10 w-10 border-2 border-primary/50">
          <AvatarImage src={player.avatarUrl} alt={player.name} data-ai-hint="person avatar"/>
          <AvatarFallback>{player.name.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className={cn("font-semibold", isCurrentUser ? "text-primary" : "text-foreground")}>
            {player.name} {isCurrentUser && "(You)"}
          </p>
          <p className="text-xs text-muted-foreground">
            {player.isBot ? <Bot className="inline-block h-3 w-3 mr-1" /> : <User className="inline-block h-3 w-3 mr-1" />}
            {player.isBot ? `Bot ${player.elo ? `(Elo ~${player.elo})` : ''}` : `Player ${player.elo ? `(Elo ${player.elo})` : ''}`}
          </p>
        </div>
        {isCurrentUser && (
          <div className="text-right">
            <p className="text-sm font-medium text-primary">{Math.round(player.wpm)} WPM</p>
            <p className="text-xs text-muted-foreground">{Math.round(player.accuracy)}% Acc</p>
          </div>
        )}
      </div>
      <Progress value={player.progress} className="h-3 [&>div]:bg-accent" /> {/* Changed progress bar color */}
    </div>
  );
}
