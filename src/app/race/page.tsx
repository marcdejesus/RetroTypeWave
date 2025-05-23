
"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserElo } from '@/hooks/useUserElo';
import { simulateBotSpeed, type SimulateBotSpeedInput } from '@/ai/flows/bot-speed-simulation';
import { PROMPT_TEXT, BOT_NAMES, AVATAR_PLACEHOLDER_URL, COUNTDOWN_SECONDS, ELO_K_FACTOR, INITIAL_ELO } from '@/lib/constants';
import type { PlayerStats, RaceStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlayerProgressDisplay } from '@/components/PlayerProgressDisplay';
import { RaceResultsScreen } from '@/components/RaceResultsScreen';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, TimerIcon, Zap, Percent, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';

function RacePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { elo: currentUserElo, updateUserElo, isLoading: eloLoading } = useUserElo();

  const raceDuration = parseInt(searchParams?.get('duration') || '60', 10);

  const [raceStatus, setRaceStatus] = useState<RaceStatus>('waiting');
  const [timeLeft, setTimeLeft] = useState(raceDuration);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  
  const [userInput, setUserInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const promptWords = useRef<string[]>(PROMPT_TEXT.split(' '));
  
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [userPlayerId, setUserPlayerId] = useState<string | null>(null);

  const [eloChange, setEloChange] = useState(0);
  const [resultsCalculated, setResultsCalculated] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const raceStartTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typedCharsCorrectRef = useRef(0);
  const totalTypedCharsRef = useRef(0);

  // Ref to track if initialization has been done for the current raceDuration
  const initializedForDurationRef = useRef<number | null>(null);

  // Initialize or re-initialize players and race state
  useEffect(() => {
    if (eloLoading || currentUserElo === null) return;

    // If raceDuration hasn't changed, we're already initialized for it,
    // and the race is past 'waiting', an Elo update shouldn't reset the whole UI.
    // It mainly prevents the results screen from disappearing if Elo updates.
    if (initializedForDurationRef.current === raceDuration && raceStatus !== 'waiting') {
        // Optionally, update player's Elo in the local 'players' state if it has changed
        // This might be useful if displaying Elo directly from 'players' array during the race
        setPlayers(prevPlayers => prevPlayers.map(p => {
            if (p.id === userPlayerId && p.elo !== currentUserElo) {
                return { ...p, elo: currentUserElo };
            }
            return p;
        }));
        return; // Skip full re-initialization
    }

    // Full initialization / reset for a new race setup or first load
    const user: PlayerStats = {
      id: 'user',
      name: 'You',
      isBot: false,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL('U'),
      elo: currentUserElo, // Elo at the start of this race
    };
    setUserPlayerId(user.id);

    const initialBots: PlayerStats[] = BOT_NAMES.map((name, index) => ({
      id: `bot-${index}`,
      name,
      isBot: true,
      wpm: 0, // AI will set this
      accuracy: 95, // Default bot accuracy
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL(name),
      elo: Math.max(500, currentUserElo + Math.floor(Math.random() * 200) - 100),
    }));

    setPlayers([user, ...initialBots]);
    
    // Reset all relevant states for a new race
    setRaceStatus('waiting');
    setUserInput('');
    setCurrentWordIndex(0);
    promptWords.current = PROMPT_TEXT.split(' '); // Ensure prompt is reset if it could change
    typedCharsCorrectRef.current = 0;
    totalTypedCharsRef.current = 0;
    setTimeLeft(raceDuration);
    setCountdown(COUNTDOWN_SECONDS);
    setEloChange(0);
    setResultsCalculated(false);
    raceStartTimeRef.current = null;
    if(timerRef.current) clearInterval(timerRef.current);

    initializedForDurationRef.current = raceDuration; // Mark initialization as done for this duration

  }, [eloLoading, currentUserElo, raceDuration, userPlayerId]); // Dependencies for (re)-initialization


  const startCountdown = useCallback(async () => {
    if (players.length === 0 || raceStatus !== 'waiting' || currentUserElo === null) return;
    setRaceStatus('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    inputRef.current?.focus();

    // Filter out the current user before mapping to avoid mutating user's WPM with AI.
    const botPlayers = players.filter(p => p.isBot);
    const userWpmForBotSim = players.find(p => !p.isBot)?.wpm || 40; // User's current WPM or a default

    try {
        const botSpeedPromises = botPlayers.map(bot =>
            simulateBotSpeed({
                userWpm: userWpmForBotSim,
                userElo: currentUserElo,
                raceDuration: raceDuration,
            }).then(response => ({ botId: bot.id, botWpm: response.botWpm }))
            .catch(error => {
                console.error(`Failed to simulate speed for ${bot.name}:`, error);
                toast({ title: "AI Error", description: `Could not simulate speed for ${bot.name}. Using default.`, variant: "destructive" });
                return { botId: bot.id, botWpm: 30 + Math.random() * 20 }; // Fallback WPM
            })
        );

        const botSpeeds = await Promise.all(botSpeedPromises);

        setPlayers(prev => {
            const updatedPlayers = prev.map(p => {
                if (p.isBot) {
                    const speedData = botSpeeds.find(bs => bs.botId === p.id);
                    if (speedData) {
                        return { ...p, wpm: speedData.botWpm, elo: Math.round(speedData.botWpm * 15 + Math.random() * 100) };
                    }
                }
                return p;
            });
            return updatedPlayers;
        });

    } catch (error) {
        console.error("Error during bot speed simulation setup:", error);
        // General fallback if Promise.all itself fails or other logic error
        setPlayers(prev => prev.map(p => p.isBot ? { ...p, wpm: 30 + Math.random() * 20 } : p));
    }
  }, [players, raceStatus, currentUserElo, raceDuration, toast]);

  useEffect(() => {
    if (raceStatus === 'countdown') {
      if (countdown > 0) {
        timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setRaceStatus('racing');
        raceStartTimeRef.current = Date.now();
        setTimeLeft(raceDuration);
        inputRef.current?.focus();
      }
      return () => timerRef.current && clearTimeout(timerRef.current);
    }
  }, [raceStatus, countdown, raceDuration]);

  useEffect(() => {
    if (raceStatus === 'racing') {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const startTime = raceStartTimeRef.current ?? now;
        const elapsedTimeSeconds = (now - startTime) / 1000;
        
        setTimeLeft(prevTime => {
          const newTimeLeft = raceDuration - elapsedTimeSeconds;
          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current!);
            setRaceStatus('finished');
            return 0;
          }
          return newTimeLeft;
        });

        setPlayers(prevPlayers => prevPlayers.map(p => {
          if (p.isBot && p.progress < 100) {
            const charsToType = p.wpm * 5; 
            const charsPerSecond = charsToType / 60;
            const botTypedChars = charsPerSecond * elapsedTimeSeconds; // Total chars bot should have typed by now
            const progress = Math.min(100, (botTypedChars / PROMPT_TEXT.length) * 100);
            return { ...p, progress };
          }
          return p;
        }));
      }, 100); 
      return () => timerRef.current && clearInterval(timerRef.current);
    }
  }, [raceStatus, raceDuration]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (raceStatus !== 'racing' || currentWordIndex >= promptWords.current.length) return;
    const value = e.target.value;
    
    totalTypedCharsRef.current++; // Increment for every char typed, including spaces and backspaces (simplified)

    const currentPromptWord = promptWords.current[currentWordIndex];
    const lastCharIsSpace = value.endsWith(' ');
    const typedWord = lastCharIsSpace ? value.slice(0, -1) : value;

    if (lastCharIsSpace) {
      if (typedWord === currentPromptWord) {
        typedCharsCorrectRef.current += typedWord.length + 1; // +1 for the space
      } else {
        // If word is incorrect, no points for it, but space still typed.
        // Accuracy will handle this.
      }
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');

      if (currentWordIndex + 1 >= promptWords.current.length) {
        // User finished typing the whole prompt
        setRaceStatus('finished');
        // Ensure progress is 100% if they finish early
        setPlayers(prev => prev.map(p => p.id === userPlayerId ? {...p, progress: 100, wpm: calculateCurrentWpm(true), accuracy: calculateCurrentAccuracy()} : p));
        return;
      }
    } else {
      setUserInput(value);
    }
    
    // Update stats continuously
    setPlayers(prev => prev.map(p => {
      if (p.id === userPlayerId) {
        const wpm = calculateCurrentWpm();
        const accuracy = calculateCurrentAccuracy();
        const currentTypedChars = typedCharsCorrectRef.current + (userInput.startsWith(currentPromptWord.substring(0, userInput.length)) ? userInput.length : 0)
        const progress = (currentTypedChars / PROMPT_TEXT.length) * 100;
        return { ...p, wpm, accuracy: Math.max(0, Math.min(100, accuracy)), progress: Math.min(100, progress) };
      }
      return p;
    }));
  };
  
  const calculateCurrentWpm = (finishedRace = false) => {
    const elapsedTimeSeconds = (Date.now() - (raceStartTimeRef.current ?? Date.now())) / 1000;
    if (elapsedTimeSeconds <= 0) return 0;
    
    // Correct characters considered for WPM are based on completed words + current correctly typed prefix
    let correctCharsForWpm = typedCharsCorrectRef.current;
    if (!finishedRace && currentWordIndex < promptWords.current.length) {
        const currentPromptWord = promptWords.current[currentWordIndex];
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentPromptWord[i]) {
                correctCharsForWpm++;
            } else {
                break; 
            }
        }
    }

    const wordsTyped = correctCharsForWpm / 5;
    return Math.round((wordsTyped / elapsedTimeSeconds) * 60);
  };

  const calculateCurrentAccuracy = () => {
    if (totalTypedCharsRef.current === 0) return 100;
    // A more accurate calculation would be based on typed words vs prompt words
    // This is a simplified char-based accuracy.
    let correctCharsForAccuracy = typedCharsCorrectRef.current; // Already includes spaces for correct words
     if (currentWordIndex < promptWords.current.length) {
        const currentPromptWord = promptWords.current[currentWordIndex];
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentPromptWord[i]) {
                // This part is tricky, as typedCharsCorrectRef already counts fully correct words.
                // This is a rough approximation for live accuracy.
            }
        }
    }
    // For simplicity now, accuracy is based on correctly typed words.
    // totalTypedCharsRef counts every keystroke, which isn't ideal for word-based accuracy.
    // Let's use a simpler proxy: correct characters in completed words / (all characters in completed words + errors)
    // This is still complex. Let's stick to a character-based measure for now.
    const effectiveTypedChars = typedCharsCorrectRef.current + (userInput.length - userInput.split(' ').length + 1) * (currentWordIndex +1) ; // rough
    // A simpler accuracy: number of fully correct words so far vs words attempted
    const wordsAttempted = currentWordIndex + (userInput.length > 0 ? 1 : 0);
    if (wordsAttempted === 0) return 100;
    const correctWords = typedCharsCorrectRef.current > 0 ? currentWordIndex : 0; // Simplified

    // Let's use the existing typedCharsCorrectRef.current and totalTypedCharsRef.current
    // This means accuracy is penalized for any mistyped char, backspace etc.
    return Math.round((typedCharsCorrectRef.current / totalTypedCharsRef.current) * 100);

  };


  // Handle race finish: Calculate ranks and ELO
  useEffect(() => {
    if (raceStatus === 'finished' && !resultsCalculated && currentUserElo !== null && players.length > 0 && userPlayerId) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      setPlayers(currentPlayers => {
        // Finalize user's WPM and Accuracy one last time
        const finalUserWpm = calculateCurrentWpm(true);
        const finalUserAccuracy = calculateCurrentAccuracy();

        const finalPlayersState = currentPlayers.map(p => {
          if (p.id === userPlayerId) {
            return { ...p, finalWpm: finalUserWpm, finalAccuracy: finalUserAccuracy, wpm: finalUserWpm, accuracy: finalUserAccuracy, progress: Math.max(p.progress, (typedCharsCorrectRef.current/PROMPT_TEXT.length)*100) };
          }
          // For bots, their 'wpm' is their target, so use that as finalWPM. Progress should be final too.
          return { ...p, finalWpm: p.wpm, finalAccuracy: p.accuracy };
        });
        
        const rankedPlayers = [...finalPlayersState].sort((a, b) => {
          const aScore = (a.finalWpm ?? 0) * ((a.finalAccuracy ?? 0) / 100);
          const bScore = (b.finalWpm ?? 0) * ((b.finalAccuracy ?? 0) / 100);
          if (b.progress === 100 && a.progress < 100) return 1; // b finished, a did not
          if (a.progress === 100 && b.progress < 100) return -1; // a finished, b did not
          if (bScore !== aScore) return bScore - aScore;
          return (b.finalAccuracy ?? 0) - (a.finalAccuracy ?? 0); // Tie-break with accuracy
        }).map((player, index) => ({ ...player, rank: index + 1 }));

        const userResult = rankedPlayers.find(p => !p.isBot);
        const botsInRace = rankedPlayers.filter(p => p.isBot);
        
        let calculatedEloChange = 0;
        if (userResult) {
          const userEloForThisRace = userResult.elo ?? INITIAL_ELO; // Elo user started this race with
          let totalEloChangeThisRace = 0;

          botsInRace.forEach(bot => {
            const botElo = bot.elo ?? INITIAL_ELO;
            const expectedScore = 1 / (1 + Math.pow(10, (botElo - userEloForThisRace) / 400));
            
            let actualScore = 0;
            // Score based on rank: if user rank is better than bot rank
            if (userResult.rank! < bot.rank!) actualScore = 1; // User won against this bot
            else if (userResult.rank! > bot.rank!) actualScore = 0; // User lost against this bot
            else actualScore = 0.5; // Draw (same rank, unlikely with WPM*Acc sort but possible)
            
            totalEloChangeThisRace += ELO_K_FACTOR * (actualScore - expectedScore);
          });
          calculatedEloChange = botsInRace.length > 0 ? Math.round(totalEloChangeThisRace / botsInRace.length) : Math.round(totalEloChangeThisRace);
        }
        
        setEloChange(calculatedEloChange);
        const userCurrentEloBeforeUpdate = userResult?.elo ?? currentUserElo; // Elo before this race
        updateUserElo(userCurrentEloBeforeUpdate + calculatedEloChange); 
        setResultsCalculated(true);
        return rankedPlayers;
      });
    }
  }, [raceStatus, resultsCalculated, currentUserElo, players, updateUserElo, userPlayerId, raceDuration]);

  
  const getHighlightedPrompt = () => {
    if (currentWordIndex >= promptWords.current.length) {
        return <span className="text-accent">Prompt completed!</span>;
    }
    let completedText = promptWords.current.slice(0, currentWordIndex).join(' ') + (currentWordIndex > 0 ? ' ' : '');
    let currentWordText = promptWords.current[currentWordIndex] || '';
    let futureText = promptWords.current.slice(currentWordIndex + 1).join(' ');

    return (
      <>
        <span className="text-accent">{completedText}</span>
        {currentWordText.split('').map((char, idx) => (
          <span
            key={idx}
            className={cn(
              idx < userInput.length
                ? userInput[idx] === char
                  ? 'text-primary' 
                  : 'text-destructive bg-destructive/20' 
                : 'text-foreground', 
              idx === userInput.length && raceStatus === 'racing' ? 'border-b-2 border-primary animate-pulse' : '' 
            )}
          >
            {char}
          </span>
        ))}
        {currentWordText && <span className="text-foreground">&nbsp;</span>}
        <span className="text-muted-foreground">{futureText}</span>
      </>
    );
  };

  const handlePlayAgain = () => {
    router.push('/'); 
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Loading states
  if (eloLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (raceStatus === 'waiting' && players.length === 0 && currentUserElo !== null) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Initializing Race...</div>;
  }
  if (currentUserElo === null && (raceStatus !== 'finished' || !resultsCalculated) ) { // If elo is null and not already on results screen
     return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)] text-destructive">Error loading user data. Please refresh.</div>;
  }

  // Race Finished Screen
  if (raceStatus === 'finished') {
    if (!resultsCalculated || players.length === 0 || !players.find(p => p.id === userPlayerId)?.rank) { 
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <Alert className="max-w-md shadow-lg">
            <Zap className="h-4 w-4" />
            <AlertTitle className="text-xl">Race Finished!</AlertTitle>
            <AlertDescription className="text-base mt-1">
              Calculating results...
              <Loader2 className="h-4 w-4 animate-spin inline ml-2" />
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    // currentUserElo passed here is the *updated* Elo from useUserElo hook
    return (
      <RaceResultsScreen
        results={players}
        currentUserElo={currentUserElo} 
        eloChange={eloChange}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  // Racing or Countdown UI
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl flex items-center">
            <Keyboard className="w-7 h-7 mr-3 text-primary" /> Type The Prompt
          </CardTitle>
          <div className="flex items-center space-x-4 text-lg">
            <div className="flex items-center text-accent-foreground bg-accent px-3 py-1 rounded-md">
              <TimerIcon className="w-5 h-5 mr-2" />
              <span>{Math.ceil(timeLeft)}s</span>
            </div>
             {raceStatus === 'racing' && userPlayerId && players.find(p=>p.id === userPlayerId) && 
              <>
                <div className="flex items-center text-primary">
                  <Zap className="w-5 h-5 mr-1" /> {Math.round(players.find(p=>p.id === userPlayerId)!.wpm)} WPM
                </div>
                <div className="flex items-center text-primary">
                  <Percent className="w-5 h-5 mr-1" /> {Math.round(players.find(p=>p.id === userPlayerId)!.accuracy)}%
                </div>
              </>
             }
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl p-4 border rounded-md min-h-[120px] bg-background leading-relaxed shadow-inner select-none whitespace-pre-wrap font-mono">
            {raceStatus === 'countdown' ? (
              <div className="text-6xl font-bold text-primary text-center animate-pulse">{countdown > 0 ? countdown : "Go!"}</div>
            ) : (
              getHighlightedPrompt()
            )}
          </div>
          <Textarea
            ref={inputRef}
            value={userInput}
            onChange={handleUserInputChange}
            placeholder={raceStatus === 'racing' ? "Start typing here..." : raceStatus === 'countdown' ? "Get ready..." : "Click Start Race to begin..."}
            className="mt-4 text-lg p-3 font-mono"
            disabled={raceStatus !== 'racing' || currentWordIndex >= promptWords.current.length}
            rows={2}
            autoFocus={raceStatus === 'racing'}
          />
        </CardContent>
      </Card>

      {raceStatus === 'waiting' && (
        <Button onClick={startCountdown} size="lg" className="w-full py-6 text-xl" disabled={eloLoading || currentUserElo === null || players.length === 0}>
          <Zap className="mr-2 h-6 w-6" /> Start Race
        </Button>
      )}

      {(raceStatus === 'racing' || raceStatus === 'finished' || raceStatus === 'countdown') && players.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map(player => (
            <PlayerProgressDisplay key={player.id} player={player} isCurrentUser={player.id === userPlayerId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RacePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Loading race...</div>}>
      <RacePageContent />
    </Suspense>
  );
}
