
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserDocument } from '@/types';
import { INITIAL_ELO, ELO_STORAGE_KEY } from '@/lib/constants';

export function useUserElo() {
  const { user, loadingAuthState } = useAuth();
  const [elo, setElo] = useState<number | null>(null);
  const [highestWpm, setHighestWpm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);


  useEffect(() => {
    if (loadingAuthState) {
      setIsLoading(true);
      setIsUserDataLoading(true);
      return;
    }

    if (user) {
      setIsLoading(true);
      setIsUserDataLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      
      const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as UserDocument;
          setElo(userData.elo);
          setHighestWpm(userData.highestWpm);
          setIsLoading(false);
          setIsUserDataLoading(false);
        } else {
          // User document might not be created yet if useAuth is still processing
          // Try to fetch once more, or rely on useAuth to create it.
          // For now, we assume useAuth handles creation. If it doesn't exist here,
          // it could mean a delay or an issue. Let's set initial values.
          // Or, better: check if useAuth's loadingUserData is false before proceeding.
          // This case should ideally be handled by useAuth creating the doc.
          // If it's still not there, it means we're in a transient state or an error occurred.
          // For safety, initialize, but this might be overwritten quickly.
          const initialUserData: UserDocument = {
            uid: user.uid,
            displayName: user.displayName || 'Retro Player',
            photoURL: user.photoURL || `https://placehold.co/40x40.png?text=${user.displayName?.[0]?.toUpperCase() || 'P'}`,
            elo: INITIAL_ELO,
            highestWpm: 0,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          };
          try {
            await setDoc(userDocRef, initialUserData);
            setElo(INITIAL_ELO);
            setHighestWpm(0);
          } catch (error) {
            console.error("Error creating user document in useUserElo:", error);
            // Fallback to local if Firestore fails critically for a logged-in user (not ideal)
            setElo(INITIAL_ELO);
            setHighestWpm(0);
          } finally {
            setIsLoading(false);
            setIsUserDataLoading(false);
          }
        }
      }, (error) => {
        console.error("Error fetching user data from Firestore:", error);
        // Fallback for logged-in user if Firestore read fails
        setElo(INITIAL_ELO); // Or some error state
        setHighestWpm(0);
        setIsLoading(false);
        setIsUserDataLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Not logged in, use localStorage
      try {
        const storedElo = localStorage.getItem(ELO_STORAGE_KEY);
        if (storedElo) {
          setElo(parseInt(storedElo, 10));
        } else {
          setElo(INITIAL_ELO);
        }
        // No highestWpm for local users for now, or could also be stored locally.
        setHighestWpm(0); // Default for non-logged-in
      } catch (error) {
        console.error("Failed to access localStorage:", error);
        setElo(INITIAL_ELO);
        setHighestWpm(0);
      } finally {
        setIsLoading(false);
        setIsUserDataLoading(false);
      }
    }
  }, [user, loadingAuthState]);

  const updateUserElo = useCallback(async (newElo: number) => {
    const clampedElo = Math.max(0, Math.round(newElo));
    setElo(clampedElo); // Optimistic update

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, { elo: clampedElo });
      } catch (error) {
        console.error("Error updating Elo in Firestore:", error);
        // Potentially revert optimistic update or show error
      }
    } else {
      try {
        localStorage.setItem(ELO_STORAGE_KEY, clampedElo.toString());
      } catch (error) {
        console.error("Failed to access localStorage for Elo:", error);
      }
    }
  }, [user]);

  const updateUserHighestWpm = useCallback(async (newHighestWpm: number) => {
    const clampedWpm = Math.max(0, Math.round(newHighestWpm));
    setHighestWpm(clampedWpm); // Optimistic update

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, { highestWpm: clampedWpm });
      } catch (error) {
        console.error("Error updating highest WPM in Firestore:", error);
      }
    }
    // Not storing highest WPM in localStorage for non-logged-in users for now
  }, [user]);

  return { elo, highestWpm, updateUserElo, updateUserHighestWpm, isLoading: isLoading || isUserDataLoading || loadingAuthState };
}
