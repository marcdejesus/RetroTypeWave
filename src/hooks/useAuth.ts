
"use client";

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import type { UserDocument } from '@/types';
import { INITIAL_ELO } from '@/lib/constants';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false); // For async user data creation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoadingAuthState(true);
      if (currentUser) {
        setUser(currentUser);
        // Check if user document exists in Firestore, create if not
        setLoadingUserData(true);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newUserDoc: Omit<UserDocument, 'uid'> = { // uid will be doc id
            displayName: currentUser.displayName || 'Retro Player',
            photoURL: currentUser.photoURL || AVATAR_PLACEHOLDER_URL(currentUser.displayName || 'P'),
            elo: INITIAL_ELO,
            highestWpm: 0,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          };
          try {
            await setDoc(userRef, newUserDoc);
          } catch (error) {
            console.error("Error creating user document:", error);
          }
        } else {
          // Optionally update lastLogin timestamp
          try {
            await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
          } catch (error) {
            console.error("Error updating last login:", error);
          }
        }
        setLoadingUserData(false);
      } else {
        setUser(null);
        setLoadingUserData(false);
      }
      setLoadingAuthState(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoadingAuthState(true);
      await signInWithPopup(auth, googleAuthProvider);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoadingAuthState(false); // Ensure loading state is reset on error
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { user, loadingAuthState, loadingUserData, signInWithGoogle, signOutUser };
}

// Need a placeholder for AVATAR_PLACEHOLDER_URL if user has no photoURL
const AVATAR_PLACEHOLDER_URL = (seed: string, size = 40) => `https://placehold.co/${size}x${size}.png?text=${seed?.[0]?.toUpperCase() || 'P'}`;
