
export interface PlayerStats {
  id: string;
  name: string;
  isBot: boolean;
  wpm: number;
  accuracy: number; // 0-100
  progress: number; // 0-100, percentage of prompt typed
  avatarUrl: string;
  elo?: number;
  finalWpm?: number; // WPM at the end of the race
  finalAccuracy?: number; // Accuracy at the end of the race
  rank?: number; // Player's rank in the race
}

export type RaceStatus = 'waiting' | 'countdown' | 'racing' | 'finished';
