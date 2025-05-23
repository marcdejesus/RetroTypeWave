
import type { Timestamp } from 'firebase/firestore';

export interface PlayerStats {
  id: string; // Can be 'user' or 'bot-N' or user.uid
  name: string;
  isBot: boolean;
  wpm: number;
  accuracy: number; // 0-100
  progress: number; // 0-100, percentage of prompt typed
  avatarUrl: string;
  elo?: number; // Current Elo for race calculation (bot or user)
  finalWpm?: number; // WPM at the end of the race
  finalAccuracy?: number; // Accuracy at the end of the race
  rank?: number; // Player's rank in the race
}

export type RaceStatus = 'waiting' | 'countdown' | 'racing' | 'finished';

export interface UserDocument {
  uid: string; // For client-side representation after fetching
  displayName: string;
  photoURL: string;
  elo: number;
  highestWpm: number;
  createdAt: Timestamp | Date; // Firestore serverTimestamp on write, Date on read
  lastLogin: Timestamp | Date; // Firestore serverTimestamp on write, Date on read
}

export interface LeaderboardUser {
  id: string; // User UID
  rank: number;
  name: string;
  elo: number;
  highestWpm: number;
  avatarUrl: string;
  isCurrentUser?: boolean; // To highlight in leaderboard if it's the viewing user
}
