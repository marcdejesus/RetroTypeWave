
"use client";

import { useState, useEffect, useCallback } from 'react';
import { INITIAL_ELO, ELO_STORAGE_KEY } from '@/lib/constants';

export function useUserElo() {
  const [elo, setElo] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedElo = localStorage.getItem(ELO_STORAGE_KEY);
      if (storedElo) {
        setElo(parseInt(storedElo, 10));
      } else {
        setElo(INITIAL_ELO);
        localStorage.setItem(ELO_STORAGE_KEY, INITIAL_ELO.toString());
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      setElo(INITIAL_ELO); // Fallback if localStorage is unavailable
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserElo = useCallback((newElo: number) => {
    const clampedElo = Math.max(0, Math.round(newElo)); // Elo cannot be negative and should be integer
    setElo(clampedElo);
    try {
      localStorage.setItem(ELO_STORAGE_KEY, clampedElo.toString());
    } catch (error) {
      console.error("Failed to access localStorage:", error);
    }
  }, []);

  return { elo, updateUserElo, isLoading };
}
