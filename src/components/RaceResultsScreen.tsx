
"use client";

import React, { useState, useEffect } from 'react';
import type { PlayerStats, LeaderboardEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, TrendingUp, TrendingDown, Percent, Gauge, User, Bot, Home, Repeat, Star, UploadCloud, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useUserElo } from '@/hooks/useUserElo'; // To submit score
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

const LEADERBOARD_SIZE_FOR_QUALIFICATION = 10; // Check against top 10 for qualification

interface RaceResultsScreenProps {
  results: PlayerStats[];
  currentUserEloFromRace: number | null; // Elo *after* this race's change
  eloChange: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  isNewHighestWpm?: boolean;
  finalUserWpmFromRace: number | null; // Pass the user's WPM for this race
}

export function RaceResultsScreen({
  results,
  currentUserEloFromRace,
  eloChange,
  onPlayAgain,
  onGoHome,
  isNewHighestWpm = false,
  finalUserWpmFromRace,
}: RaceResultsScreenProps) {
  const sortedResults = [...results].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));
  const userResult = results.find(p => !p.isBot);

  const { username: initialUsername, updateUserUsername, submitToGlobalLeaderboard } = useUserElo();
  const [usernameInput, setUsernameInput] = useState(initialUsername || '');
  const [canSubmitToLeaderboard, setCanSubmitToLeaderboard] = useState(false);
  const [isCheckingQualification, setIsCheckingQualification] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const checkQualification = async () => {
      if (!currentUserEloFromRace || !finalUserWpmFromRace) {
        setCanSubmitToLeaderboard(false);
        setIsCheckingQualification(false);
        return;
      }
      setIsCheckingQualification(true);
      try {
        const leaderboardRef = collection(db, 'leaderboardEntries');
        const q = query(leaderboardRef, orderBy('elo', 'desc'), limit(LEADERBOARD_SIZE_FOR_QUALIFICATION));
        const snapshot = await getDocs(q);
        const leaderboardEntries: LeaderboardEntry[] = [];
        snapshot.forEach(doc => leaderboardEntries.push(doc.data() as LeaderboardEntry));

        if (leaderboardEntries.length < LEADERBOARD_SIZE_FOR_QUALIFICATION) {
          setCanSubmitToLeaderboard(true); // Can submit if leaderboard is not full
        } else {
          const lowestEloOnLeaderboard = leaderboardEntries[leaderboardEntries.length - 1]?.elo;
          if (currentUserEloFromRace > lowestEloOnLeaderboard) {
            setCanSubmitToLeaderboard(true); // Can submit if Elo is higher than lowest on full leaderboard
          } else {
            setCanSubmitToLeaderboard(false);
          }
        }
      } catch (error) {
        console.error("Error checking leaderboard qualification:", error);
        setCanSubmitToLeaderboard(false); // Default to false on error
      } finally {
        setIsCheckingQualification(false);
      }
    };

    checkQualification();
  }, [currentUserEloFromRace, finalUserWpmFromRace]);

  const handleLeaderboardSubmit = async () => {
    if (!usernameInput.trim() || !currentUserEloFromRace || !finalUserWpmFromRace) {
        toast({ title: "Error", description: "Username is required.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    const success = await submitToGlobalLeaderboard(usernameInput, currentUserEloFromRace, finalUserWpmFromRace);
    if (success) {
      updateUserUsername(usernameInput); // Save username to cookie
      toast({ title: "Success!", description: "Your score has been submitted to the leaderboard." });
      setSubmissionStatus('success');
      setCanSubmitToLeaderboard(false); // Prevent re-submission
    } else {
      toast({ title: "Submission Failed", description: "Could not submit score. Please try again.", variant: "destructive" });
      setSubmissionStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-8">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-12 h-12 text-accent" />
          </div>
          <CardTitle className="text-3xl font-bold">Race Over!</CardTitle>
          {userResult && typeof currentUserEloFromRace === 'number' && (
            <CardDescription className="text-lg pt-2">
              Your new Elo: <span className="font-semibold">{currentUserEloFromRace}</span>
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
              {isNewHighestWpm && userResult.finalWpm && (
                 <span className="text-sm text-accent mt-1 inline-flex items-center justify-center w-full">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                    New Personal Best WPM: {userResult.finalWpm}!
                 </span>
              )}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="max-h-[40vh] overflow-y-auto pr-1 mb-6">
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

          {isCheckingQualification && (
            <div className="flex items-center justify-center my-4 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Checking leaderboard qualification...
            </div>
          )}

          {!isCheckingQualification && canSubmitToLeaderboard && submissionStatus !== 'success' && (
            <div className="space-y-4 p-4 border-t border-dashed">
              <Label htmlFor="username" className="text-base font-semibold text-center block text-accent">You qualified for the Leaderboard!</Label>
              <div className="flex flex-col sm:flex-row gap-2 items-end">
                <div className="flex-grow w-full sm:w-auto">
                    <Label htmlFor="usernameInput" className="text-xs text-muted-foreground">Enter your Username</Label>
                    <Input
                    id="usernameInput"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Your cool name"
                    className="text-base"
                    maxLength={20}
                    />
                </div>
                <Button onClick={handleLeaderboardSubmit} disabled={isSubmitting || !usernameInput.trim()} className="w-full sm:w-auto">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                  Submit Score
                </Button>
              </div>
              {submissionStatus === 'error' && <p className="text-sm text-destructive text-center">Failed to submit. Please try again.</p>}
            </div>
          )}
           {submissionStatus === 'success' && (
            <p className="text-center text-green-500 font-semibold my-4">Score submitted successfully!</p>
           )}


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

