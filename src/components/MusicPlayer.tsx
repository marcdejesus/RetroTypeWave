
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Rewind, Music2 } from 'lucide-react';

interface Song {
  id: number;
  name: string;
  artist: string;
  duration: number; // in seconds
}

const playlist: Song[] = [
  { id: 1, name: "Neon Cruiser", artist: "SynthWave Pro", duration: 185 },
  { id: 2, name: "Pixel Paradise", artist: "8-Bit Beast", duration: 210 },
  { id: 3, name: "Sunset Drive", artist: "Retro Rewind", duration: 192 },
];

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const currentSong = playlist[currentSongIndex];
  const progressPercent = currentSong.duration > 0 ? (currentTime / currentSong.duration) * 100 : 0;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime < currentSong.duration) {
          return prevTime + 1;
        }
        // Song finished, clear interval (could also auto-skip here)
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        return currentSong.duration;
      });
    }, 1000);
  }, [currentSong.duration]);

  useEffect(() => {
    if (isPlaying) {
      startTimer();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, startTimer]);

  // Reset time when song changes
  useEffect(() => {
    setCurrentTime(0);
    if (isPlaying) { // If it was playing, restart timer for new song
        startTimer();
    }
  }, [currentSongIndex, isPlaying, startTimer]);


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    // setCurrentTime(0); // Handled by useEffect [currentSongIndex]
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (!isPlaying) { // If paused, and restart is hit, don't auto-play
      // If you want it to play on restart, set isPlaying to true:
      // setIsPlaying(true);
    } else {
      // If already playing, timer will continue from 0 due to useEffect
      startTimer();
    }
  };

  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <Music2 className="w-5 h-5 mr-2" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 p-3 text-sm text-foreground">
        <div className="text-center">
          <p className="font-semibold truncate" title={currentSong.name}>{currentSong.name}</p>
          <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
        </div>
        
        <Progress value={progressPercent} className="w-full h-2 [&>div]:bg-accent" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(currentSong.duration)}</span>
        </div>
        
        <div className="flex justify-around items-center pt-2">
          <Button variant="ghost" size="icon" onClick={handleRestart} aria-label="Restart song">
            <Rewind className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10" aria-label={isPlaying ? "Pause song" : "Play song"}>
            {isPlaying ? <Pause className="w-6 h-6 fill-primary text-primary" /> : <Play className="w-6 h-6 fill-primary text-primary" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSkip} aria-label="Skip to next song">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
