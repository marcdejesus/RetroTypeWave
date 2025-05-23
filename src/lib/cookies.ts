
// src/lib/cookies.ts

/**
 * Sets a cookie.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param days - The number of days until the cookie expires.
 */
export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  if (typeof document !== 'undefined') {
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
  }
}

/**
 * Gets a cookie by name.
 * @param name - The name of the cookie.
 * @returns The cookie value or null if not found.
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Deletes a cookie by name.
 * @param name - The name of the cookie.
 */
export function deleteCookie(name: string) {
  if (typeof document !== 'undefined') {
    document.cookie = name + '=; Max-Age=-99999999; path=/; SameSite=Lax';
  }
}

export const PLAYER_ELO_COOKIE = 'retroTypeWavePlayerElo';
export const PLAYER_HIGHEST_WPM_COOKIE = 'retroTypeWavePlayerHighestWpm';
export const PLAYER_USERNAME_COOKIE = 'retroTypeWavePlayerUsername'; // For pre-filling username input
