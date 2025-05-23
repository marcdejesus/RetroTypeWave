"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, DocumentData } from 'firebase/firestore';
import type { LeaderboardEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, TrendingUp, User, Zap } from 'lucide-react'; // Added Zap for WPM
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const LEADERBOARD_LIMIT = 10;

export function EloLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    
    setIsLoading(true);
    const leaderboardRef = collection(db, 'leaderboardEntries');
    // Query to get top 20 entries, sorted by WPM in descending order
    const q = query(
      leaderboardRef, 
      orderBy('highestWpm', 'desc'),
      limit(LEADERBOARD_LIMIT)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedEntries: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const index = fetchedEntries.length;
        fetchedEntries.push({
          id: doc.id,
          username: data.username,
          elo: data.elo,
          highestWpm: data.highestWpm,
          timestamp: data.timestamp,
          rank: index + 1
        });
      });
      setLeaderboard(fetchedEntries);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Card className="h-full border-primary/30 shadow-md flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg text-primary">
            <TrendingUp className="w-5 h-5 mr-2" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
          {[...Array(LEADERBOARD_LIMIT)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 p-2 rounded-md bg-card/60 h-10">
              <Skeleton className="h-5 w-6" /> {/* Rank */}
              <Skeleton className="h-5 flex-1" /> {/* Username */}
              <Skeleton className="h-5 w-12" /> {/* Elo */}
              <Skeleton className="h-5 w-10" /> {/* WPM */}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (!leaderboard.length && !isLoading) {
    return (
       <Card className="h-full border-primary/30 shadow-md flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg text-primary">
            <TrendingUp className="w-5 h-5 mr-2" />
            Global Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-3">
            <p className="text-muted-foreground">Leaderboard is empty. Be the first!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-center text-lg text-primary">
          <TrendingUp className="w-5 h-5 mr-2" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1 pr-1">
          {leaderboard.map((entry) => {
            const rankDisplay = entry.rank === 1
              ? <Crown className="w-4 h-4 inline-block text-accent" />
              : (Number.isFinite(entry.rank) ? entry.rank : '-');

            const displayName = entry.username || 'Anonymous';

            return (
              <li 
                key={entry.id} 
                className="flex flex-col p-2 rounded-md bg-card/60 hover:bg-primary/10 transition-colors text-sm"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "font-semibold w-6 text-center flex-shrink-0", 
                      entry.rank === 1 ? "text-accent" : "text-muted-foreground"
                    )}>
                      {rankDisplay}
                    </span>
                    <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-primary truncate" title={displayName}>
                      {displayName}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-4 mt-1 pr-2">
                  <span className="font-bold text-accent text-right">
                    {Number.isFinite(entry.highestWpm) ? `${entry.highestWpm} WPM` : 'N/A'}
                  </span>
                  <span className="text-muted-foreground text-xs text-right w-12">
                    {Number.isFinite(entry.elo) ? entry.elo : 'N/A'}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
