
"use client";

import type { PlayerStats } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, TrendingUp, TrendingDown, Percent, Gauge, User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface RaceResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  results: PlayerStats[];
  currentUserElo?: number | null;
  eloChange?: number;
  onPlayAgain: () => void;
}

export function RaceResultsDialog({
  isOpen,
  onClose,
  results,
  currentUserElo,
  eloChange,
  onPlayAgain,
}: RaceResultsDialogProps) {
  const sortedResults = [...results].sort((a, b) => (b.finalWpm ?? 0) - (a.finalWpm ?? 0) || (b.finalAccuracy ?? 0) - (a.finalAccuracy ?? 0) );
  
  // Assign ranks
  sortedResults.forEach((player, index) => {
    player.rank = index + 1;
  });

  const userResult = results.find(p => !p.isBot);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <Trophy className="w-7 h-7 mr-2 text-accent" />
            Race Results
          </DialogTitle>
          {userResult && typeof currentUserElo === 'number' && typeof eloChange === 'number' && (
            <DialogDescription className="flex items-center text-base">
              Your new Elo: {currentUserElo + eloChange}
              {eloChange !== 0 && (
                eloChange > 0 ? (
                  <TrendingUp className="w-5 h-5 ml-2 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 ml-2 text-red-500" />
                )
              )}
              <span className={eloChange > 0 ? 'text-green-500' : eloChange < 0 ? 'text-red-500' : 'text-muted-foreground'}>
                ({eloChange > 0 ? '+' : ''}{eloChange})
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">
                  <Gauge className="inline-block h-4 w-4 mr-1" /> WPM
                </TableHead>
                <TableHead className="text-right">
                  <Percent className="inline-block h-4 w-4 mr-1" /> Accuracy
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedResults.map((player) => (
                <TableRow key={player.id} className={!player.isBot ? "bg-primary/10" : ""}>
                  <TableCell className="font-medium text-lg">
                    {player.rank === 1 && <Trophy className="inline-block h-5 w-5 text-accent mr-1" />}
                    {player.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatarUrl} alt={player.name} data-ai-hint="person avatar" />
                        <AvatarFallback>{player.name.substring(0,1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{player.name}</span>
                        {player.isBot ? <Bot className="inline-block h-3 w-3 ml-1 text-muted-foreground" /> : <User className="inline-block h-3 w-3 ml-1 text-muted-foreground" />}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{Math.round(player.finalWpm ?? 0)}</TableCell>
                  <TableCell className="text-right font-mono">{Math.round(player.finalAccuracy ?? 0)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Close
          </Button>
          <Button onClick={onPlayAgain}>
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
