
"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, DocumentData } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import type { LeaderboardUser, UserDocument } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, TrendingUp, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const LEADERBOARD_LIMIT = 12;

export function EloLeaderboard() {
  const { user: authedUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('elo', 'desc'), limit(LEADERBOARD_LIMIT));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers: LeaderboardUser[] = [];
        querySnapshot.forEach((doc, index) => {
          const data = doc.data() as Omit<UserDocument, 'uid' | 'createdAt' | 'lastLogin'>; // Firestore data() doesn't include id
          fetchedUsers.push({
            id: doc.id,
            rank: index + 1,
            name: data.displayName,
            elo: data.elo,
            highestWpm: data.highestWpm,
            avatarUrl: data.photoURL,
            isCurrentUser: authedUser?.uid === doc.id,
          });
        });
        setLeaderboard(fetchedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        // Handle error, maybe show a message
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [authedUser]); // Re-fetch if auth user changes to highlight them

  if (isLoading) {
    return (
      <Card className="h-full border-primary/30 shadow-md flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg text-primary">
            <TrendingUp className="w-5 h-5 mr-2" />
            Elo Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
          {[...Array(LEADERBOARD_LIMIT)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 p-2 rounded-md bg-card/60">
              <Skeleton className="h-7 w-6" />
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-12" />
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
            Elo Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-3">
            <p className="text-muted-foreground">No players on the leaderboard yet.</p>
        </CardContent>
      </Card>
    )
  }

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
          {leaderboard.map((player) => (
            <li 
              key={player.id} 
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
                  <AvatarImage src={player.avatarUrl} alt={player.name} data-ai-hint="person avatar"/>
                  <AvatarFallback className={player.isCurrentUser ? "bg-primary-foreground text-primary" : ""}>{player.name.substring(0,1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className={cn("text-sm font-medium truncate", player.isCurrentUser ? "text-primary-foreground" : "")}>{player.name}</span>
                 <User className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex flex-col items-end flex-shrink-0">
                <span className={cn("text-sm font-bold", player.isCurrentUser ? "text-primary-foreground" : "text-primary")}>
                  {player.elo}
                </span>
                <span className={cn("text-xs", player.isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  ({player.highestWpm} WPM)
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
