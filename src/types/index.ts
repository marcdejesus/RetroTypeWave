import type { Timestamp } from 'firebase/firestore';

export interface PlayerStats {
  id: string; 
  name: string;
  isBot: boolean;
  wpm: number;
  accuracy: number; // 0-100
  progress: number; // 0-100, percentage of prompt typed
  avatarUrl: string;
  elo?: number; 
  finalWpm?: number; 
  finalAccuracy?: number; 
  rank?: number; 
}

export type RaceStatus = 'waiting' | 'countdown' | 'racing' | 'finished';

// This type is primarily for the leaderboard entries in Firestore
export interface LeaderboardEntry {
  id?: string; // Firestore document ID, optional on client before save
  username: string;
  elo: number;
  highestWpm: number;
  timestamp?: Timestamp | Date; // To know when the score was set
  rank?: number; // Optional rank property for display purposes
}

// This type is for local player data, potentially stored in cookies or state
export interface LocalPlayerData {
  elo: number;
  highestWpm: number;
  username?: string; // Optional username chosen by the player
}
