
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Keep for leaderboard submission
import { INITIAL_ELO } from '@/lib/constants';
import { getCookie, setCookie, PLAYER_ELO_COOKIE, PLAYER_HIGHEST_WPM_COOKIE, PLAYER_USERNAME_COOKIE } from '@/lib/cookies';

export function useUserElo() {
  const [elo, setElo] = useState<number | null>(null);
  const [highestWpm, setHighestWpm] = useState<number | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from cookies on mount
    try {
      const storedElo = getCookie(PLAYER_ELO_COOKIE);
      const storedHighestWpm = getCookie(PLAYER_HIGHEST_WPM_COOKIE);
      const storedUsername = getCookie(PLAYER_USERNAME_COOKIE);

      setElo(storedElo ? parseInt(storedElo, 10) : INITIAL_ELO);
      setHighestWpm(storedHighestWpm ? parseInt(storedHighestWpm, 10) : 0);
      setUsername(storedUsername || undefined);
    } catch (error) {
      console.error("Error reading player data from cookies:", error);
      setElo(INITIAL_ELO);
      setHighestWpm(0);
      setUsername(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserElo = useCallback((newElo: number) => {
    const clampedElo = Math.max(0, Math.round(newElo));
    setElo(clampedElo);
    try {
      setCookie(PLAYER_ELO_COOKIE, clampedElo.toString(), 365);
    } catch (error) {
      console.error("Error saving Elo to cookie:", error);
    }
  }, []);

  const updateUserHighestWpm = useCallback((newWpm: number) => {
    const clampedWpm = Math.max(0, Math.round(newWpm));
    if (highestWpm === null || clampedWpm > highestWpm) {
      setHighestWpm(clampedWpm);
      try {
        setCookie(PLAYER_HIGHEST_WPM_COOKIE, clampedWpm.toString(), 365);
      } catch (error) {
        console.error("Error saving highest WPM to cookie:", error);
      }
    }
  }, [highestWpm]);

  const updateUserUsername = useCallback((newUsername: string) => {
    const trimmedUsername = newUsername.trim();
    setUsername(trimmedUsername);
    try {
      setCookie(PLAYER_USERNAME_COOKIE, trimmedUsername, 365);
    } catch (error) {
      console.error("Error saving username to cookie:", error);
    }
  }, []);
  
  // This function is now specifically for submitting a score to the global leaderboard
  const submitToGlobalLeaderboard = async (usernameToSubmit: string, scoreElo: number, scoreWpm: number) => {
    if (!usernameToSubmit.trim()) {
      console.error("Username cannot be empty for leaderboard submission.");
      return false;
    }
    // We can use the username as the document ID if we want one score per username,
    // or generate a new ID for each submission. For simplicity, let's use username as ID,
    // which means new scores from the same username overwrite old ones.
    // A more robust system might allow multiple scores or check if a user wants to update.
    const leaderboardRef = doc(db, 'leaderboardEntries', usernameToSubmit.trim().toLowerCase()); // Normalize username for ID
    try {
      await setDoc(leaderboardRef, {
        username: usernameToSubmit.trim(),
        elo: scoreElo,
        highestWpm: scoreWpm,
        timestamp: serverTimestamp(),
      }, { merge: true }); // Use merge if you want to update if doc exists, or just setDoc to overwrite
      updateUserUsername(usernameToSubmit.trim()); // Save submitted username locally too
      return true;
    } catch (error) {
      console.error("Error submitting score to global leaderboard:", error);
      return false;
    }
  };


  return { 
    elo, 
    highestWpm, 
    username,
    updateUserElo, 
    updateUserHighestWpm, 
    updateUserUsername,
    submitToGlobalLeaderboard,
    isLoading 
  };
}
