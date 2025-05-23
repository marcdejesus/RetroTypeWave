
"use client";

import type { PlayerStats } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, TrendingUp, TrendingDown, Percent, Gauge, User, Bot, Home, Repeat } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'; // Corrected path

interface RaceResultsScreenProps {
  results: PlayerStats[];
  currentUserElo: number | null; // This will be the new Elo after the race
  eloChange: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function RaceResultsScreen({
  results,
  currentUserElo,
  eloChange,
  onPlayAgain,
  onGoHome,
}: RaceResultsScreenProps) {
  // Sort by finalWPM then finalAccuracy to ensure consistent ranking display
  // The ranking should ideally be done before passing to this component.
  // However, if it's not, we can sort here for display consistency.
  const sortedResults = [...results].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  
  const userResult = results.find(p => !p.isBot);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-12 h-12 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold">Race Over!</CardTitle>
          {userResult && typeof currentUserElo === 'number' && (
            <CardDescription className="text-lg pt-2">
              Your new Elo: <span className="font-semibold">{currentUserElo}</span>
              {eloChange !== 0 && (
                eloChange > 0 ? (
                  <TrendingUp className="inline-block w-5 h-5 ml-2 text-green-500" />
                ) : (
                  <TrendingDown className="inline-block w-5 h-5 ml-2 text-red-500" />
                )
              )}
              <span className={`ml-1 font-semibold ${eloChange > 0 ? 'text-green-500' : eloChange < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                ({eloChange >= 0 ? '+' : ''}{eloChange})
              </span>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="max-h-[50vh] overflow-y-auto pr-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
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
                    <TableCell className="font-medium text-lg text-center">
                      {player.rank === 1 && <Trophy className="inline-block h-5 w-5 text-accent mr-1" />}
                      {player.rank ?? '-'}
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
                    <TableCell className="text-right font-mono">{Math.round(player.finalWpm ?? player.wpm)}</TableCell>
                    <TableCell className="text-right font-mono">{Math.round(player.finalAccuracy ?? player.accuracy)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Button variant="outline" onClick={onGoHome} size="lg" className="w-full sm:w-auto">
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Button>
          <Button onClick={onPlayAgain} size="lg" className="w-full sm:w-auto">
            <Repeat className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
