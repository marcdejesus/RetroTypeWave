
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
import { RaceResultsDialog } from '@/components/RaceResultsDialog';
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

  const [showResults, setShowResults] = useState(false);
  const [eloChange, setEloChange] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const raceStartTimeRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const typedCharsCorrectRef = useRef(0);
  const totalTypedCharsRef = useRef(0);

  // Initialize players
  useEffect(() => {
    if (eloLoading || !currentUserElo) return;

    const user: PlayerStats = {
      id: 'user',
      name: 'You',
      isBot: false,
      wpm: 0,
      accuracy: 0,
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL('U'),
      elo: currentUserElo ?? INITIAL_ELO,
    };
    setUserPlayerId(user.id);

    const initialBots: PlayerStats[] = BOT_NAMES.map((name, index) => ({
      id: `bot-${index}`,
      name,
      isBot: true,
      wpm: 0, // Will be set by AI
      accuracy: 95, // Bots have fixed high accuracy
      progress: 0,
      avatarUrl: AVATAR_PLACEHOLDER_URL(name),
      elo: Math.max(500, (currentUserElo ?? INITIAL_ELO) + Math.floor(Math.random() * 200) - 100), // Approximate bot Elo for simulation
    }));

    setPlayers([user, ...initialBots]);
    setRaceStatus('waiting'); // Ready to start countdown
  }, [eloLoading, currentUserElo, raceDuration]);


  const startCountdown = useCallback(() => {
    if (players.length === 0 || raceStatus !== 'waiting') return;
    setRaceStatus('countdown');
    setCountdown(COUNTDOWN_SECONDS);
    inputRef.current?.focus();

    // Fetch bot speeds
    players.filter(p => p.isBot).forEach(async bot => {
      try {
        const aiInput: SimulateBotSpeedInput = {
          userWpm: players.find(p => !p.isBot)?.wpm || 40, // Use user's last WPM or average
          userElo: currentUserElo ?? INITIAL_ELO,
          raceDuration: raceDuration,
        };
        const response = await simulateBotSpeed(aiInput);
        setPlayers(prev => prev.map(p => p.id === bot.id ? { ...p, wpm: response.botWpm, elo: Math.round(response.botWpm * 15 + Math.random() * 100) } : p));
      } catch (error) {
        console.error(`Failed to simulate speed for ${bot.name}:`, error);
        toast({ title: "AI Error", description: `Could not simulate speed for ${bot.name}. Using default.`, variant: "destructive" });
        setPlayers(prev => prev.map(p => p.id === bot.id ? { ...p, wpm: 30 + Math.random() * 20 } : p)); // Fallback WPM
      }
    });
  }, [players, raceStatus, currentUserElo, raceDuration, toast]);

  // Countdown timer
  useEffect(() => {
    if (raceStatus === 'countdown') {
      if (countdown > 0) {
        timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
      } else {
        setRaceStatus('racing');
        raceStartTimeRef.current = Date.now();
        setTimeLeft(raceDuration);
      }
      return () => timerRef.current && clearTimeout(timerRef.current);
    }
  }, [raceStatus, countdown, raceDuration]);

  // Race timer and bot progress
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

        // Update bot progress
        setPlayers(prevPlayers => prevPlayers.map(p => {
          if (p.isBot && p.progress < 100) {
            const charsToType = p.wpm * 5; // Chars per minute
            const charsPerSecond = charsToType / 60;
            const botTypedChars = charsPerSecond * elapsedTimeSeconds;
            const progress = Math.min(100, (botTypedChars / PROMPT_TEXT.length) * 100);
            return { ...p, progress };
          }
          return p;
        }));
      }, 100); // Update more frequently for smoother bot progress
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

    if (typedWord === currentPromptWord.substring(0, typedWord.length)) {
       // Correctly typing current word
    }

    if (lastCharIsSpace) {
      if (typedWord === currentPromptWord) {
        typedCharsCorrectRef.current += typedWord.length + 1; // +1 for space
        setCurrentWordIndex(prev => prev + 1);
        setUserInput('');

        if (currentWordIndex + 1 === promptWords.current.length) {
          setRaceStatus('finished'); // User finished the prompt
        }
      } else {
        // Incorrect word, still count space
        typedCharsCorrectRef.current += value.split('').filter((char, i) => char === (currentPromptWord + ' ')[i]).length;
        setCurrentWordIndex(prev => prev + 1); // Move to next word even if incorrect, for simplicity. Could be more strict.
        setUserInput('');
      }
    } else {
      setUserInput(value);
    }

    // Update WPM and Accuracy for user
    const elapsedTimeSeconds = (Date.now() - (raceStartTimeRef.current ?? Date.now())) / 1000;
    if (elapsedTimeSeconds > 0) {
      const wordsTyped = typedCharsCorrectRef.current / 5;
      const wpm = Math.round((wordsTyped / elapsedTimeSeconds) * 60);
      const accuracy = totalTypedCharsRef.current > 0 ? Math.round((typedCharsCorrectRef.current / totalTypedCharsRef.current) * 100) : 0;
      
      setPlayers(prev => prev.map(p => {
        if (p.id === userPlayerId) {
          const progress = (typedCharsCorrectRef.current / PROMPT_TEXT.length) * 100;
          return { ...p, wpm, accuracy: Math.max(0, Math.min(100, accuracy)), progress: Math.min(100, progress) };
        }
        return p;
      }));
    }
  };

  // Handle race finish
  useEffect(() => {
    if (raceStatus === 'finished') {
      if (timerRef.current) clearInterval(timerRef.current);
      
      const finalPlayersState = players.map(p => {
        const finalWpm = p.isBot ? p.wpm : Math.round(p.wpm); // Bots WPM is fixed, user's is calculated
        const finalAccuracy = p.isBot ? 95 + Math.floor(Math.random()*5) : Math.round(p.accuracy); // User's accuracy is calculated
        return { ...p, finalWpm, finalAccuracy };
      });
      setPlayers(finalPlayersState);

      // Calculate Elo change
      const user = finalPlayersState.find(p => !p.isBot);
      const bots = finalPlayersState.filter(p => p.isBot);
      
      if (user && currentUserElo) {
        let totalEloChange = 0;
        bots.forEach(bot => {
          const expectedScore = 1 / (1 + Math.pow(10, ((bot.elo ?? INITIAL_ELO) - currentUserElo) / 400));
          let actualScore = 0;
          if ((user.finalWpm ?? 0) > (bot.finalWpm ?? 0)) actualScore = 1;
          else if ((user.finalWpm ?? 0) === (bot.finalWpm ?? 0)) actualScore = 0.5;
          
          // Factor in accuracy for score adjustment (e.g. 0.8 to 1.2 multiplier)
          const accuracyFactor = 0.8 + (user.finalAccuracy ?? 0) / 100 * 0.4;
          actualScore *= accuracyFactor;

          totalEloChange += ELO_K_FACTOR * (actualScore - expectedScore);
        });
        
        const finalEloChange = Math.round(totalEloChange / bots.length); // Average change
        setEloChange(finalEloChange);
        updateUserElo(currentUserElo + finalEloChange);
      }
      setShowResults(true);
    }
  }, [raceStatus, players, currentUserElo, updateUserElo]);


  const currentTypedChars = userInput.length + promptWords.current.slice(0, currentWordIndex).join(' ').length + (currentWordIndex > 0 ? 1 : 0);
  
  const getHighlightedPrompt = () => {
    let completedText = promptWords.current.slice(0, currentWordIndex).join(' ') + (currentWordIndex > 0 ? ' ' : '');
    let currentWordText = promptWords.current[currentWordIndex] || '';
    let futureText = promptWords.current.slice(currentWordIndex + 1).join(' ');

    return (
      <>
        <span className="text-green-500">{completedText}</span>
        {currentWordText.split('').map((char, idx) => (
          <span
            key={idx}
            className={cn(
              idx < userInput.length
                ? userInput[idx] === char
                  ? 'text-blue-500' // Correctly typed char in current word
                  : 'text-red-500 bg-red-100' // Incorrectly typed char
                : 'text-foreground', // Not yet typed char in current word
              idx === userInput.length ? 'border-b-2 border-primary animate-pulse' : '' // Caret position
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
    setShowResults(false);
    router.push('/');
  };

  if (eloLoading || players.length === 0) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl flex items-center">
            <Keyboard className="w-7 h-7 mr-3 text-primary" /> Type The Prompt
          </CardTitle>
          <div className="flex items-center space-x-4 text-lg">
            <div className="flex items-center text-accent-foreground bg-accent px-3 py-1 rounded-md shadow-sm">
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
          <div className="text-xl p-4 border rounded-md min-h-[120px] bg-background leading-relaxed shadow-inner select-none whitespace-pre-wrap">
            {raceStatus === 'countdown' ? (
              <div className="text-6xl font-bold text-primary text-center animate-ping">{countdown}</div>
            ) : (
              getHighlightedPrompt()
            )}
          </div>
          <Textarea
            ref={inputRef}
            value={userInput}
            onChange={handleUserInputChange}
            placeholder={raceStatus === 'racing' ? "Start typing here..." : "Waiting for race to start..."}
            className="mt-4 text-lg p-3"
            disabled={raceStatus !== 'racing'}
            rows={2}
            // autoFocus - focus is handled by startCountdown
          />
        </CardContent>
      </Card>

      {raceStatus === 'waiting' && (
        <Button onClick={startCountdown} size="lg" className="w-full py-6 text-xl">
          <Zap className="mr-2 h-6 w-6" /> Start Race
        </Button>
      )}

      {(raceStatus === 'racing' || raceStatus === 'finished' || raceStatus === 'countdown') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map(player => (
            <PlayerProgressDisplay key={player.id} player={player} isCurrentUser={player.id === userPlayerId} />
          ))}
        </div>
      )}
      
      {raceStatus === 'finished' && showResults && (
        <RaceResultsDialog
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          results={players}
          currentUserElo={currentUserElo}
          eloChange={eloChange}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {raceStatus === 'finished' && !showResults && (
         <Alert className="mt-4">
            <Zap className="h-4 w-4" />
            <AlertTitle>Race Finished!</AlertTitle>
            <AlertDescription>
              Calculating results...
              <Loader2 className="h-4 w-4 animate-spin inline ml-2" />
            </AlertDescription>
          </Alert>
      )}
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function RacePage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /> Loading race...</div>}>
      <RacePageContent />
    </Suspense>
  );
}

