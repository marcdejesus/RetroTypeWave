
"use client";

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { INITIAL_ELO } from '@/lib/constants';
import { getCookie, setCookie, PLAYER_ELO_COOKIE, PLAYER_HIGHEST_WPM_COOKIE, PLAYER_USERNAME_COOKIE } from '@/lib/cookies';

interface SubmissionResult {
  success: boolean;
  message: string;
}

export function useUserElo() {
  const [elo, setElo] = useState<number | null>(null);
  const [highestWpm, setHighestWpm] = useState<number | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  
  const submitToGlobalLeaderboard = async (usernameToSubmit: string, scoreElo: number, scoreWpm: number): Promise<SubmissionResult> => {
    const trimmedUsername = usernameToSubmit.trim();
    if (!trimmedUsername) {
      return { success: false, message: "Username cannot be empty." };
    }
    const normalizedUsernameId = trimmedUsername.toLowerCase(); // Use normalized username for doc ID

    const leaderboardRef = doc(db, 'leaderboardEntries', normalizedUsernameId);
    
    try {
      // Check if username already exists
      const docSnap = await getDoc(leaderboardRef);
      if (docSnap.exists()) {
        return { success: false, message: "Username already taken. Please choose another." };
      }

      // If username doesn't exist, proceed to set the document
      await setDoc(leaderboardRef, {
        username: trimmedUsername, // Store the original (non-lowercased) username for display
        elo: scoreElo,
        highestWpm: scoreWpm,
        timestamp: serverTimestamp(),
      });
      updateUserUsername(trimmedUsername); // Save submitted username locally too
      return { success: true, message: "Your score has been submitted to the leaderboard!" };
    } catch (error: any) {
      console.error("Error submitting score to global leaderboard:", error);
      if (error.code === 'permission-denied' || error.message?.includes('Missing or insufficient permissions')) {
        return { success: false, message: "Submission failed: Server permission denied. Please check Firestore rules." };
      }
      return { success: false, message: "Could not submit score. Please try again later." };
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
