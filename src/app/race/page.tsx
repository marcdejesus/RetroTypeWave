
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
import { RaceResultsScreen } from '@/components/RaceResultsScreen'; // Changed import
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
  const [resultsCalculated, setResultsCalculated] = useState(false); // New state

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const raceStartTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typedCharsCorrectRef = useRef(0);
  const totalTypedCharsRef = useRef(0);

  // Initialize players
  useEffect(() => {
    if (eloLoading || currentUserElo === null) return;

    const user: PlayerStats = {
      id: 'user',
      name: 'You',
      isBot: false,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL('U'),
      elo: currentUserElo, // Already checked for null
    };
    setUserPlayerId(user.id);

    const initialBots: PlayerStats[] = BOT_NAMES.map((name, index) => ({
      id: `bot-${index}`,
      name,
      isBot: true,
      wpm: 0,
      accuracy: 95,
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL(name),
      elo: Math.max(500, currentUserElo + Math.floor(Math.random() * 200) - 100),
    }));

    setPlayers([user, ...initialBots]);
    setRaceStatus('waiting');
    setResultsCalculated(false); // Reset for a new race
  }, [eloLoading, currentUserElo, raceDuration]);


  const startCountdown = useCallback(() => {
    if (players.length === 0 || raceStatus !== 'waiting' || currentUserElo === null) return;
    setRaceStatus('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    inputRef.current?.focus();

    players.filter(p => p.isBot).forEach(async bot => {
      try {
        const aiInput: SimulateBotSpeedInput = {
          userWpm: players.find(p => !p.isBot)?.wpm || 40, 
          userElo: currentUserElo,
          raceDuration: raceDuration,
        };
        const response = await simulateBotSpeed(aiInput);
        setPlayers(prev => prev.map(p => p.id === bot.id ? { ...p, wpm: response.botWpm, elo: Math.round(response.botWpm * 15 + Math.random() * 100) } : p));
      } catch (error) {
        console.error(`Failed to simulate speed for ${bot.name}:`, error);
        toast({ title: "AI Error", description: `Could not simulate speed for ${bot.name}. Using default.`, variant: "destructive" });
        setPlayers(prev => prev.map(p => p.id === bot.id ? { ...p, wpm: 30 + Math.random() * 20 } : p));
      }
    });
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
        const elapsedTimeSeconds = (Date.now() - (raceStartTimeRef.current ?? Date.now())) / 1000;
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
            const botTypedChars = charsPerSecond * elapsedTimeSeconds;
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
    if (raceStatus !== 'racing') return;
    const value = e.target.value;
    
    totalTypedCharsRef.current++;

    const currentPromptWord = promptWords.current[currentWordIndex];
    const lastCharIsSpace = value.endsWith(' ');
    const typedWord = lastCharIsSpace ? value.slice(0, -1) : value;

    if (lastCharIsSpace) {
      if (typedWord === currentPromptWord) {
        typedCharsCorrectRef.current += typedWord.length + 1;
      }
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');

      if (currentWordIndex + 1 >= promptWords.current.length) {
        const userPlayer = players.find(p => p.id === userPlayerId);
        if (userPlayer && userPlayer.progress < 100) {
           setPlayers(prev => prev.map(p => p.id === userPlayerId ? {...p, progress: 100} : p));
        }
      }
    } else {
      setUserInput(value);
    }
    
    const userTypedChars = typedCharsCorrectRef.current + (value.length - (value.split(' ').length -1));
    const elapsedTimeSeconds = (Date.now() - (raceStartTimeRef.current ?? Date.now())) / 1000;

    if (elapsedTimeSeconds > 0) {
      const wordsTyped = userTypedChars / 5;
      const wpm = Math.round((wordsTyped / elapsedTimeSeconds) * 60);
      const accuracy = totalTypedCharsRef.current > 0 ? Math.round((typedCharsCorrectRef.current / totalTypedCharsRef.current) * 100) : 0;
      
      setPlayers(prev => prev.map(p => {
        if (p.id === userPlayerId) {
          const progress = (userTypedChars / PROMPT_TEXT.length) * 100;
          return { ...p, wpm, accuracy: Math.max(0, Math.min(100, accuracy)), progress: Math.min(100, progress) };
        }
        return p;
      }));

      if (currentWordIndex >= promptWords.current.length -1 && value.trim() === promptWords.current[promptWords.current.length -1] ) {
        setRaceStatus('finished'); 
      }
    }
  };

  // Handle race finish: Calculate ranks and ELO
  useEffect(() => {
    if (raceStatus === 'finished' && !resultsCalculated && currentUserElo !== null && players.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      setPlayers(currentPlayers => {
        const userPlayerForEloCalc = currentPlayers.find(p => !p.isBot);
        // Use the Elo the user had at the start of *this* race for calculation
        const userEloForThisRace = userPlayerForEloCalc?.elo ?? currentUserElo ?? INITIAL_ELO;

        const finalPlayersState = currentPlayers.map(p => {
          const finalWpm = p.isBot ? p.wpm : Math.round(p.wpm); 
          const finalAccuracy = p.isBot ? (p.accuracy || 95) : Math.max(0, Math.min(100, Math.round(p.accuracy)));
          return { ...p, finalWpm, finalAccuracy };
        });
        
        const rankedPlayers = [...finalPlayersState].sort((a, b) => {
          if ((b.finalWpm ?? 0) !== (a.finalWpm ?? 0)) {
            return (b.finalWpm ?? 0) - (a.finalWpm ?? 0);
          }
          return (b.finalAccuracy ?? 0) - (a.finalAccuracy ?? 0);
        }).map((player, index) => ({ ...player, rank: index + 1 }));

        const userResult = rankedPlayers.find(p => !p.isBot);
        const bots = rankedPlayers.filter(p => p.isBot);
        
        let calculatedEloChange = 0;
        if (userResult) {
          let totalEloChange = 0;
          bots.forEach(bot => {
            const expectedScore = 1 / (1 + Math.pow(10, ((bot.elo ?? INITIAL_ELO) - userEloForThisRace) / 400));
            let actualScore = 0;
            if ((userResult.finalWpm ?? 0) > (bot.finalWpm ?? 0)) actualScore = 1;
            else if ((userResult.finalWpm ?? 0) === (bot.finalWpm ?? 0)) actualScore = 0.5;
            
            // Accuracy factor: 0.8 for 0% accuracy, 1.0 for 50% accuracy, 1.2 for 100% accuracy
            const accuracyFactor = 0.8 + ((userResult.finalAccuracy ?? 0) / 100) * 0.4; 
            actualScore *= accuracyFactor;

            totalEloChange += ELO_K_FACTOR * (actualScore - expectedScore);
          });
          calculatedEloChange = bots.length > 0 ? Math.round(totalEloChange / bots.length) : Math.round(totalEloChange);
        }
        
        setEloChange(calculatedEloChange);
        updateUserElo(userEloForThisRace + calculatedEloChange); // Update global Elo
        setResultsCalculated(true); // Mark results as calculated
        return rankedPlayers; // Return the updated players array for the state
      });
    }
  }, [raceStatus, resultsCalculated, currentUserElo, players, updateUserElo]);


  
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
              idx === userInput.length ? 'border-b-2 border-primary animate-pulse' : '' 
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
    // Resetting states and navigating to home will re-initialize everything for a new race
    router.push('/'); 
  };

  const handleGoHome = () => {
    router.push('/');
  };

  // Loading states
  if (eloLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  // Initializing players can take a moment after elo loads
  if (raceStatus === 'waiting' && players.length === 0 && currentUserElo !== null) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Initializing Race...</div>;
  }
  // If currentUserElo is still null after loading, something is wrong (should be caught by player init)
  if (currentUserElo === null && raceStatus !== 'finished') {
     return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)] text-destructive">Error loading user data. Please refresh.</div>;
  }


  // Race Finished Screen
  if (raceStatus === 'finished') {
    if (!resultsCalculated || players.length === 0 || !players.find(p => p.id === userPlayerId)?.rank) { // Ensure ranks are set
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
    return (
      <RaceResultsScreen
        results={players}
        currentUserElo={currentUserElo} // This is the NEW Elo after the race
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
              <div className="text-6xl font-bold text-primary text-center animate-pulse">{countdown}</div>
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
