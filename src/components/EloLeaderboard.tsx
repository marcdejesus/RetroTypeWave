
"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, DocumentData } from 'firebase/firestore';
import type { LeaderboardEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, TrendingUp, User, Zap } from 'lucide-react'; // Added Zap for WPM
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const LEADERBOARD_LIMIT = 10; // Let's keep it to top 10

export function EloLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const leaderboardRef = collection(db, 'leaderboardEntries');
    const q = query(leaderboardRef, orderBy('elo', 'desc'), limit(LEADERBOARD_LIMIT));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedEntries: LeaderboardEntry[] = [];
      querySnapshot.forEach((doc, index) => {
        const data = doc.data() as Omit<LeaderboardEntry, 'id'>;
        fetchedEntries.push({
          id: doc.id, // Username is the id
          rank: index + 1,
          username: data.username,
          elo: data.elo,
          highestWpm: data.highestWpm,
          // No avatarUrl or isCurrentUser concept here for anonymous leaderboard
        });
      });
      setLeaderboard(fetchedEntries);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setIsLoading(false);
      // Handle error, maybe show a message
    });

    return () => unsubscribe(); // Clean up listener on component unmount
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
        <CardTitle className="flex items-center text-lg text-primary">
          <TrendingUp className="w-5 h-5 mr-2" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1 pr-1">
          {leaderboard.map((entry) => (
            <li 
              key={entry.id} 
              className="flex items-center justify-between p-2 rounded-md bg-card/60 hover:bg-primary/10 transition-colors text-sm"
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className={cn(
                  "font-semibold w-6 text-center flex-shrink-0", 
                  entry.rank === 1 ? "text-accent" : "text-muted-foreground"
                )}>
                  {entry.rank === 1 ? <Crown className="w-4 h-4 inline-block text-accent" /> : entry.rank}
                </span>
                <User className="w-4 h-4 text-muted-foreground flex-shrink-0" /> {/* Generic user icon */}
                <span className="font-medium truncate" title={entry.username}>{entry.username}</span>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <span className="font-bold text-primary text-right w-12">
                  {entry.elo}
                </span>
                <span className="text-muted-foreground text-xs text-right w-16">
                  ({entry.highestWpm} WPM)
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
