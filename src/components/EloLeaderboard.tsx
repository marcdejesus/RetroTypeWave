
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, TrendingUp, Bot, User } from 'lucide-react';
import { AVATAR_PLACEHOLDER_URL } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  elo: number;
  isBot?: boolean;
  isCurrentUser?: boolean;
  avatarSeed: string;
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "PixelPlayerX", elo: 1850, avatarSeed: "PX" },
  { rank: 2, name: "SynthRacer", elo: 1780, avatarSeed: "SR" },
  { rank: 3, name: "You", elo: 1650, avatarSeed: "U", isCurrentUser: true },
  { rank: 4, name: "NeonNinja", elo: 1620, avatarSeed: "NN" },
  { rank: 5, name: "GridRunner", elo: 1550, avatarSeed: "GR" },
  { rank: 6, name: "BotAlpha", elo: 1500, avatarSeed: "BA", isBot: true },
  { rank: 7, name: "DataDuelist", elo: 1450, avatarSeed: "DD" },
  { rank: 8, name: "CircuitChamp", elo: 1400, avatarSeed: "CC" },
  { rank: 9, name: "BotBeta", elo: 1350, avatarSeed: "BB", isBot: true },
  { rank: 10, name: "VoltageViper", elo: 1300, avatarSeed: "VV" },
  { rank: 11, name: "ArcadeAce", elo: 1250, avatarSeed: "AA" },
  { rank: 12, name: "RetroRider", elo: 1200, avatarSeed: "RR" },
];

export function EloLeaderboard() {
  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <TrendingUp className="w-5 h-5 mr-2" />
          Elo Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2 pr-1">
          {mockLeaderboard.map((player) => (
            <li 
              key={player.rank} 
              className={cn(
                "flex items-center justify-between p-2 rounded-md transition-colors hover:bg-primary/10",
                player.isCurrentUser ? "bg-primary/20" : "bg-card/60"
              )}
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className={cn(
                  "text-sm font-semibold w-6 text-center flex-shrink-0", 
                  player.rank === 1 ? "text-accent" : player.isCurrentUser ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {player.rank === 1 ? <Crown className="w-4 h-4 inline-block text-accent" /> : player.rank}
                </span>
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={AVATAR_PLACEHOLDER_URL(player.avatarSeed, 28)} alt={player.name} data-ai-hint="person avatar"/>
                  <AvatarFallback className={player.isCurrentUser ? "bg-primary-foreground text-primary" : ""}>{player.avatarSeed.substring(0,1)}</AvatarFallback>
                </Avatar>
                <span className={cn("text-sm font-medium truncate", player.isCurrentUser ? "text-primary-foreground" : "")}>{player.name}</span>
                {player.isBot && <Bot className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                {!player.isBot && !player.isCurrentUser && <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
              </div>
              <span className={cn("text-sm font-bold flex-shrink-0", player.isCurrentUser ? "text-primary-foreground" : "text-primary")}>{player.elo}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
