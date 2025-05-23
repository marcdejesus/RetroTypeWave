
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Rewind, Music2, Loader2 } from 'lucide-react';

interface Song {
  id: number;
  name: string;
  artist: string;
  src: string; // Path to the audio file in /public (e.g., /music/your-song.mp3)
  durationSeconds?: number; // Will be fetched from audio metadata
}

// IMPORTANT: Ensure these src paths correctly point to your audio files
// located in the `public/music/` directory.
// For example, if your file is at `public/music/neon-cruiser.mp3`,
// the src path should be `/music/neon-cruiser.mp3`.
const initialPlaylist: Song[] = [
  { id: 1, name: "Neon Cruiser", artist: "SynthWave Pro", src: "/music/neon-cruiser.mp3" },
  { id: 2, name: "Pixel Paradise", artist: "8-Bit Beast", src: "/music/pixel-paradise.mp3" },
  { id: 3, name: "Sunset Drive", artist: "Retro Rewind", src: "/music/sunset-drive.mp3" },
];

// Helper to format time from seconds to MM:SS
const formatTime = (timeInSeconds: number = 0): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export function MusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>(initialPlaylist);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSongDuration, setCurrentSongDuration] = useState(0);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = playlist[currentSongIndex];

  const progressPercent = currentSongDuration > 0 ? (currentTime / currentSongDuration) * 100 : 0;

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setCurrentSongDuration(audioRef.current.duration);
      setPlaylist(prev => prev.map((song, index) => 
        index === currentSongIndex ? { ...song, durationSeconds: audioRef.current?.duration } : song
      ));
      setIsLoadingMetadata(false);
    }
  }, [currentSongIndex]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleSongEnd = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  }, [playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleSongEnd);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleSongEnd);
      };
    }
  }, [handleLoadedMetadata, handleTimeUpdate, handleSongEnd]);


  useEffect(() => {
    if (audioRef.current && currentSong?.src) { // Check if currentSong and src exist
      setIsLoadingMetadata(true);
      audioRef.current.src = currentSong.src;
      audioRef.current.load(); 
      setCurrentTime(0); 

      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error attempting to play audio:", error);
          // Autoplay might be blocked, or media not ready.
          // User might need to click play manually.
          setIsPlaying(false); // Set isPlaying to false if play fails
        });
      }
    }
  }, [currentSong?.src, isPlaying]); // Depend on currentSong.src

  const handlePlayPause = () => {
    if (!audioRef.current || !currentSong?.src) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio on user action:", error);
        // Optionally, provide user feedback here if play fails
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = () => {
    if (!currentSong?.src) return; // Don't skip if no current song
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handleRestart = () => {
    if (audioRef.current && currentSong?.src) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (isPlaying) {
         audioRef.current.play().catch(error => console.error("Error restarting and playing audio:", error));
      }
    }
  };

  if (!currentSong) { // Handle case where playlist might be empty or currentSong is undefined
    return (
      <Card className="h-full border-primary/30 shadow-md flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg text-primary">
            <Music2 className="w-5 h-5 mr-2" />
            Music Player
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-3">
          <p className="text-muted-foreground">No songs in playlist.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <audio ref={audioRef} />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <Music2 className="w-5 h-5 mr-2" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 p-3 text-sm text-foreground">
        <div className="text-center">
          <p className="font-semibold truncate" title={currentSong.name}>
            {currentSong.name}
          </p>
          <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
        </div>
        
        <Progress value={progressPercent} className="w-full h-2 [&>div]:bg-accent" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          {isLoadingMetadata ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <span>{formatTime(currentSongDuration)}</span>
          )}
        </div>
        
        <div className="flex justify-around items-center pt-2">
          <Button variant="ghost" size="icon" onClick={handleRestart} aria-label="Restart song" disabled={isLoadingMetadata}>
            <Rewind className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePlayPause} className="w-10 h-10" aria-label={isPlaying ? "Pause song" : "Play song"} disabled={isLoadingMetadata}>
            {isPlaying ? <Pause className="w-6 h-6 fill-primary text-primary" /> : <Play className="w-6 h-6 fill-primary text-primary" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSkip} aria-label="Skip to next song" disabled={isLoadingMetadata}>
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
