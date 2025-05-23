
"use client";

import type { PlayerStats } from '@/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface RaceTrackDisplayProps {
  players: PlayerStats[];
  userPlayerId: string | null;
}

const carRepresentations = [
  // Simple ASCII-like or basic SVG paths could go here for more "car" like shapes
  // For now, using colored blocks with icons.
  { icon: '🚗', color: 'bg-pink-500' }, // Example, consider actual SVG or better icons
  { icon: '🚕', color: 'bg-cyan-400' },
  { icon: '🚓', color: 'bg-green-400' },
  { icon: '🏎️', color: 'bg-yellow-400' },
];

// A more distinct SVG car shape
const CarSvg = ({ colorFill }: { colorFill: string }) => (
  <svg width="40" height="20" viewBox="0 0 50 25" className="transform -rotate-90" fill={colorFill} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V12.5C10 11.1193 11.1193 10 12.5 10H17.5L20 5H30L32.5 10H37.5C38.8807 10 40 11.1193 40 12.5V20H10Z" />
    <circle cx="15" cy="20" r="4" fill="hsl(var(--foreground))" stroke="hsl(var(--background))" strokeWidth="1"/>
    <circle cx="35" cy="20" r="4" fill="hsl(var(--foreground))" stroke="hsl(var(--background))" strokeWidth="1"/>
  </svg>
);


export function RaceTrackDisplay({ players, userPlayerId }: RaceTrackDisplayProps) {
  if (!players || players.length === 0) {
    return null;
  }

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.id === userPlayerId) return -1;
    if (b.id === userPlayerId) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <Card className="bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden border-primary/30">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xl text-center text-primary tracking-wider">R A C E</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2 relative">
        {/* Finish Line Graphic */}
        <div className="absolute right-[calc(5%)] md:right-[calc(10%-10px)] top-0 bottom-0 flex flex-col justify-center items-center z-0">
            <div className="h-full w-1 bg-gradient-to-b from-transparent via-accent to-transparent animate-pulse"></div>
            <span className="text-accent font-bold text-xs transform -rotate-90 origin-center absolute right-[-16px] whitespace-nowrap tracking-widest">FINISH</span>
        </div>

        {sortedPlayers.map((player, index) => {
          const carColor = player.id === userPlayerId ? 'hsl(var(--primary))' : `hsl(var(--chart-${(index % 5) + 1}))`;
          return (
            <div key={player.id} className="relative h-14 bg-background/30 rounded-md p-2 shadow-inner border border-border/50 overflow-hidden">
              {/* Lane background lines (retrowave) */}
              <div className="absolute inset-0 z-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute h-full w-[1px] bg-primary/20" style={{left: `${i * 25}%`}}></div>
                ))}
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-primary/30"></div>
              </div>
              
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear z-10"
                // Car stops ~40px before full width to not go off-screen
                style={{ left: `calc(${Math.min(player.progress, 100)}% - ${Math.min(player.progress, 100) > 0 ? '40px' : '0px'})` }}
              >
                <div className={cn(
                  "flex items-center justify-center",
                  player.id === userPlayerId ? 'scale-105' : ''
                )}>
                   <CarSvg colorFill={carColor} />
                </div>
              </div>
              
              <div className="relative z-20 flex items-center justify-between h-full">
                  <div className="flex items-center pl-2">
                      {player.isBot ? <Bot className="w-3 h-3 mr-1.5 text-muted-foreground flex-shrink-0" /> : <User className="w-3 h-3 mr-1.5 text-primary flex-shrink-0" />}
                      <span className={cn(
                          "font-semibold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]",
                          player.id === userPlayerId ? "text-primary" : "text-foreground"
                      )}>
                          {player.name}
                      </span>
                  </div>
                  <span className="text-xs font-mono text-accent pr-[calc(10%+25px)] md:pr-[calc(10%+30px)]">
                    {Math.round(player.wpm)} WPM
                  </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

    