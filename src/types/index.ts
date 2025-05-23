
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
