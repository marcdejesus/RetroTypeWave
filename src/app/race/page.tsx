
"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserElo } from '@/hooks/useUserElo';
import { simulateBotSpeed, type SimulateBotSpeedInput } from '@/ai/flows/bot-speed-simulation';
import { generateRandomPrompt, BOT_NAMES, AVATAR_PLACEHOLDER_URL, COUNTDOWN_SECONDS, ELO_K_FACTOR, INITIAL_ELO } from '@/lib/constants';
import type { PlayerStats, RaceStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlayerProgressDisplay } from '@/components/PlayerProgressDisplay';
import { RaceResultsScreen } from '@/components/RaceResultsScreen';
import { RaceTrackDisplay } from '@/components/RaceTrackDisplay'; // Added import
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
  const [currentRacePrompt, setCurrentRacePrompt] = useState('');
  const promptWords = useRef<string[]>([]);
  
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [userPlayerId, setUserPlayerId] = useState<string | null>(null);

  const [eloChange, setEloChange] = useState(0);
  const [resultsCalculated, setResultsCalculated] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const raceStartTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typedCharsCorrectRef = useRef(0);
  const totalTypedCharsRef = useRef(0);

  const initializedForDurationRef = useRef<number | null>(null);

  useEffect(() => {
    if (eloLoading || currentUserElo === null) return;

    // Prevent re-initialization if race is ongoing/finished and elo updates
    if (initializedForDurationRef.current === raceDuration && raceStatus !== 'waiting') {
        setPlayers(prevPlayers => prevPlayers.map(p => {
            if (p.id === userPlayerId && p.elo !== currentUserElo) {
                return { ...p, elo: currentUserElo };
            }
            return p;
        }));
        return; 
    }

    const newPrompt = generateRandomPrompt();
    setCurrentRacePrompt(newPrompt);
    promptWords.current = newPrompt.split(' ');

    const user: PlayerStats = {
      id: 'user',
      name: 'You',
      isBot: false,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL('U'),
      elo: currentUserElo, 
    };
    setUserPlayerId(user.id);

    const initialBots: PlayerStats[] = BOT_NAMES.map((name, index) => ({
      id: `bot-${index}`,
      name,
      isBot: true,
      wpm: 0, // Base WPM will be set after simulation
      accuracy: 90 + Math.floor(Math.random() * 10), // Randomize bot accuracy slightly
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL(name),
      elo: Math.max(500, currentUserElo + Math.floor(Math.random() * 200) - 100), // Bot ELO relative to user
    }));

    setPlayers([user, ...initialBots]);
    
    // Reset all race-specific states
    setRaceStatus('waiting');
    setUserInput('');
    setCurrentWordIndex(0);
    typedCharsCorrectRef.current = 0;
    totalTypedCharsRef.current = 0;
    setTimeLeft(raceDuration);
    setCountdown(COUNTDOWN_SECONDS);
    setEloChange(0);
    setResultsCalculated(false);
    raceStartTimeRef.current = null;
    if(timerRef.current) clearInterval(timerRef.current);

    initializedForDurationRef.current = raceDuration;

  }, [eloLoading, currentUserElo, raceDuration]);


  const startCountdown = useCallback(async () => {
    if (players.length === 0 || raceStatus !== 'waiting' || currentUserElo === null || currentRacePrompt.length === 0) return;
    setRaceStatus('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    if (inputRef.current) {
        inputRef.current.focus();
    }


    const botPlayers = players.filter(p => p.isBot);
    const userWpmForBotSim = players.find(p => !p.isBot)?.wpm || 40; // Use a baseline if user WPM is 0

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
                return { botId: bot.id, botWpm: 30 + Math.random() * 20 }; 
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
        setPlayers(prev => prev.map(p => p.isBot ? { ...p, wpm: 30 + Math.random() * 20 } : p));
    }
  }, [players, raceStatus, currentUserElo, raceDuration, toast, currentRacePrompt]);

  useEffect(() => {
    if (raceStatus === 'countdown') {
      if (countdown > 0) {
        timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setRaceStatus('racing');
        raceStartTimeRef.current = Date.now();
        setTimeLeft(raceDuration);
        if (inputRef.current) { // Ensure focus after countdown
            inputRef.current.focus();
        }
      }
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    }
  }, [raceStatus, countdown, raceDuration]);

  useEffect(() => {
    if (raceStatus === 'racing' && currentRacePrompt.length > 0) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const startTime = raceStartTimeRef.current ?? now;
        const elapsedTimeSeconds = (now - startTime) / 1000;
        
        setTimeLeft(prevTime => {
          const newTimeLeft = raceDuration - elapsedTimeSeconds;
          if (newTimeLeft <= 0) {
            if(timerRef.current) clearInterval(timerRef.current);
            setRaceStatus('finished');
            return 0;
          }
          return newTimeLeft;
        });

        setPlayers(prevPlayers => prevPlayers.map(p => {
          if (p.isBot && p.progress < 100) {
            const charsToTypePerMinute = (p.wpm || 30) * 5; 
            const charsPerSecond = charsToTypePerMinute / 60;
            const botTypedChars = charsPerSecond * elapsedTimeSeconds;
            const progress = Math.min(100, (botTypedChars / currentRacePrompt.length) * 100);
            return { ...p, progress };
          }
          return p;
        }));
      }, 100); 
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  }, [raceStatus, raceDuration, currentRacePrompt]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (raceStatus !== 'racing' || currentWordIndex >= promptWords.current.length || currentRacePrompt.length === 0) return;
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
        setRaceStatus('finished');
        setPlayers(prev => prev.map(p => p.id === userPlayerId ? {...p, progress: 100, wpm: calculateCurrentWpm(true), accuracy: calculateCurrentAccuracy()} : p));
        return;
      }
    } else {
      setUserInput(value);
    }
    
    setPlayers(prev => prev.map(p => {
      if (p.id === userPlayerId) {
        const wpm = calculateCurrentWpm();
        const accuracy = calculateCurrentAccuracy();
        const completedChars = promptWords.current.slice(0, currentWordIndex).join(' ').length + (currentWordIndex > 0 ? 1 : 0);
        let currentWordProgressChars = 0;
        if (currentWordIndex < promptWords.current.length) {
            const currentWordVal = promptWords.current[currentWordIndex];
            for(let i=0; i < userInput.length; i++) {
                if (userInput[i] === currentWordVal[i]) {
                    currentWordProgressChars++;
                } else {
                    break;
                }
            }
        }
        const currentTypedCharsTotal = completedChars + currentWordProgressChars;
        const progress = (currentTypedCharsTotal / currentRacePrompt.length) * 100;
        return { ...p, wpm, accuracy: Math.max(0, Math.min(100, accuracy)), progress: Math.min(100, progress) };
      }
      return p;
    }));
  };
  
  const calculateCurrentWpm = (finishedRace = false) => {
    const elapsedTimeSeconds = (Date.now() - (raceStartTimeRef.current ?? Date.now())) / 1000;
    if (elapsedTimeSeconds <= 0) return 0;
    
    let correctCharsForWpm = typedCharsCorrectRef.current;
    if (!finishedRace && currentWordIndex < promptWords.current.length) {
        const currentPromptWordVal = promptWords.current[currentWordIndex];
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentPromptWordVal[i]) {
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
    let correctChars = 0;
    let totalCharsAttempted = 0;

    // Count correct characters from completed words
    for (let i = 0; i < currentWordIndex; i++) {
        correctChars += promptWords.current[i].length + 1; // +1 for space
        totalCharsAttempted += promptWords.current[i].length + 1;
    }

    // Count correct characters from the current word being typed
    if (currentWordIndex < promptWords.current.length) {
        const currentWordVal = promptWords.current[currentWordIndex];
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i] === currentWordVal[i]) {
                correctChars++;
            }
            totalCharsAttempted++;
        }
        if (userInput.length > currentWordVal.length) { // User typed more than the word
            totalCharsAttempted += (userInput.length - currentWordVal.length);
        }
    }
    
    if (totalTypedCharsRef.current === 0 && totalCharsAttempted === 0) return 100; // Avoid division by zero if no input yet
    // Use total key presses as a denominator for a more "raw" accuracy, 
    // or totalCharsAttempted for a more "standard" one.
    // Let's use totalTypedCharsRef for a stricter accuracy.
    const accuracy = Math.round((correctChars / Math.max(totalTypedCharsRef.current, totalCharsAttempted, 1)) * 100);
    return Math.max(0, Math.min(100, accuracy));
  };


  useEffect(() => {
    if (raceStatus === 'finished' && !resultsCalculated && currentUserElo !== null && players.length > 0 && userPlayerId && currentRacePrompt.length > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      
      setPlayers(currentPlayers => {
        const finalUserWpm = calculateCurrentWpm(true);
        const finalUserAccuracy = calculateCurrentAccuracy();

        const finalPlayersState = currentPlayers.map(p => {
          if (p.id === userPlayerId) {
            const userCompletedPrompt = currentWordIndex >= promptWords.current.length;
            const finalProgress = userCompletedPrompt ? 100 : p.progress;
            return { ...p, finalWpm: finalUserWpm, finalAccuracy: finalUserAccuracy, wpm: finalUserWpm, accuracy: finalUserAccuracy, progress: finalProgress };
          }
          return { ...p, finalWpm: p.wpm, finalAccuracy: p.accuracy, progress: Math.min(100, p.progress) };
        });
        
        const rankedPlayers = [...finalPlayersState].sort((a, b) => {
          if (b.progress !== a.progress) return (b.progress ?? 0) - (a.progress ?? 0);
          const aWpm = a.finalWpm ?? a.wpm ?? 0;
          const bWpm = b.finalWpm ?? b.wpm ?? 0;
          if (bWpm !== aWpm) return bWpm - aWpm;
          const aAcc = a.finalAccuracy ?? a.accuracy ?? 0;
          const bAcc = b.finalAccuracy ?? b.accuracy ?? 0;
          return bAcc - aAcc;
        }).map((player, index) => ({ ...player, rank: index + 1 }));

        const userResult = rankedPlayers.find(p => !p.isBot);
        const botsInRace = rankedPlayers.filter(p => p.isBot);
        
        let calculatedEloChange = 0;
        if (userResult) {
          const userEloForThisRace = userResult.elo ?? INITIAL_ELO; 
          let totalEloChangeThisRace = 0;

          botsInRace.forEach(bot => {
            const botElo = bot.elo ?? INITIAL_ELO;
            const expectedScore = 1 / (1 + Math.pow(10, (botElo - userEloForThisRace) / 400));
            
            let actualScore = 0;
            if (userResult.rank! < bot.rank!) actualScore = 1; 
            else if (userResult.rank! > bot.rank!) actualScore = 0; 
            else actualScore = 0.5; 
            
            totalEloChangeThisRace += ELO_K_FACTOR * (actualScore - expectedScore);
          });
          calculatedEloChange = botsInRace.length > 0 ? Math.round(totalEloChangeThisRace / botsInRace.length) : Math.round(totalEloChangeThisRace);
        }
        
        setEloChange(calculatedEloChange);
        const userCurrentEloBeforeUpdate = userResult?.elo ?? currentUserElo; 
        updateUserElo(userCurrentEloBeforeUpdate + calculatedEloChange); 
        setResultsCalculated(true);
        return rankedPlayers;
      });
    }
  }, [raceStatus, resultsCalculated, currentUserElo, players, updateUserElo, userPlayerId, raceDuration, currentRacePrompt, currentWordIndex]);

  
  const getHighlightedPrompt = () => {
    if (currentRacePrompt.length === 0) return "Loading prompt...";
    if (currentWordIndex >= promptWords.current.length && raceStatus === 'racing') { // If prompt is finished during race
        setRaceStatus('finished'); // Trigger end of race immediately
        return <span className="text-accent">Prompt completed!</span>;
    }
    if (currentWordIndex >= promptWords.current.length ) {
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
        {currentWordText && <span className="text-foreground">&nbsp;</span>} {/* Ensure space after current word if it's not the last */}
        <span className="text-muted-foreground">{futureText}</span>
      </>
    );
  };

  const handlePlayAgain = () => {
    initializedForDurationRef.current = null; 
    router.push(`/race?duration=${raceDuration}&refresh=${Math.random()}`); 
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (eloLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (raceStatus === 'waiting' && (players.length === 0 || currentRacePrompt.length === 0) && currentUserElo !== null) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Initializing Race...</div>;
  }
  if (currentUserElo === null && (raceStatus !== 'finished' || !resultsCalculated) ) { 
     return <div className="flex justify-center items-center min-h-[calc(100vh-12rem)] text-destructive">Error loading user data. Please refresh.</div>;
  }

  if (raceStatus === 'finished') {
    if (!resultsCalculated || players.length === 0 || !players.find(p => p.id === userPlayerId)?.rank || currentRacePrompt.length === 0) { 
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
        currentUserElo={currentUserElo} 
        eloChange={eloChange}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
          <CardTitle className="text-xl sm:text-2xl flex items-center">
            <Keyboard className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-3 text-primary" /> Type The Prompt
          </CardTitle>
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-lg">
            <div className="flex items-center text-accent-foreground bg-accent px-2 sm:px-3 py-1 rounded-md">
              <TimerIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span>{Math.ceil(timeLeft)}s</span>
            </div>
             {raceStatus === 'racing' && userPlayerId && players.find(p=>p.id === userPlayerId) && 
              <>
                <div className="flex items-center text-primary">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-0.5 sm:mr-1" /> {Math.round(players.find(p=>p.id === userPlayerId)!.wpm)} WPM
                </div>
                <div className="flex items-center text-primary">
                  <Percent className="w-4 h-4 sm:w-5 sm:h-5 mr-0.5 sm:mr-1" /> {Math.round(players.find(p=>p.id === userPlayerId)!.accuracy)}%
                </div>
              </>
             }
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-lg sm:text-xl p-3 sm:p-4 border rounded-md min-h-[100px] sm:min-h-[120px] bg-background leading-relaxed shadow-inner select-none whitespace-pre-wrap font-mono">
            {raceStatus === 'countdown' ? (
              <div className="text-5xl sm:text-6xl font-bold text-primary text-center animate-pulse">{countdown > 0 ? countdown : "Go!"}</div>
            ) : (
              getHighlightedPrompt()
            )}
          </div>
          <Textarea
            ref={inputRef}
            value={userInput}
            onChange={handleUserInputChange}
            placeholder={raceStatus === 'racing' ? "Start typing here..." : raceStatus === 'countdown' ? "Get ready..." : "Click Start Race to begin..."}
            className="mt-4 text-base sm:text-lg p-2 sm:p-3 font-mono"
            disabled={raceStatus !== 'racing' || currentWordIndex >= promptWords.current.length || currentRacePrompt.length === 0}
            rows={2}
            autoFocus={raceStatus === 'racing' || raceStatus === 'countdown'}
          />
        </CardContent>
      </Card>

      {raceStatus === 'waiting' && (
        <Button onClick={startCountdown} size="lg" className="w-full py-5 sm:py-6 text-lg sm:text-xl" disabled={eloLoading || currentUserElo === null || players.length === 0 || currentRacePrompt.length === 0}>
          <Zap className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Start Race
        </Button>
      )}

      {(raceStatus === 'racing' || raceStatus === 'countdown' || (raceStatus === 'finished' && !resultsCalculated)) && players.length > 0 && (
        <RaceTrackDisplay players={players} userPlayerId={userPlayerId} />
      )}
      
      {/* Detailed Player Progress Cards are hidden by default, can be enabled for debugging or different UI */}
      {/* {(raceStatus === 'racing' || raceStatus === 'finished' || raceStatus === 'countdown') && players.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {players.map(player => (
            <PlayerProgressDisplay key={player.id} player={player} isCurrentUser={player.id === userPlayerId} />
          ))}
        </div>
      )} */}
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


    