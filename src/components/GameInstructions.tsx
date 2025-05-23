
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Zap, Trophy, Info, Link as LinkIcon } from 'lucide-react'; // Added Info and LinkIcon

export function GameInstructions() {
  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <Info className="w-5 h-5 mr-2" /> {/* Changed icon */}
          How to Play
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 p-3 text-sm text-foreground">
        <div className="space-y-1">
          <p className="font-semibold flex items-center">
            <Zap className="w-4 h-4 mr-1.5 text-accent" />
            Start the Race:
          </p>
          <p className="text-xs text-muted-foreground pl-1">
            Choose a race duration on the main screen and click "Start Race" to enter the track.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold flex items-center">
            <ListChecks className="w-4 h-4 mr-1.5 text-accent" />
            Type the Prompt:
          </p>
          <p className="text-xs text-muted-foreground pl-1">
            Once the countdown finishes, start typing the displayed prompt as accurately and quickly as possible.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold flex items-center">
            <Trophy className="w-4 h-4 mr-1.5 text-accent" />
            Elo & Leaderboard:
          </p>
          <p className="text-xs text-muted-foreground pl-1">
            Your Elo (skill rating) will change based on your performance against simulated opponents. Achieve a high score to get a chance to appear on the global leaderboard!
          </p>
        </div>
         <div className="space-y-1">
          <p className="font-semibold flex items-center">
            <Zap className="w-4 h-4 mr-1.5 text-accent" />
            Track Your Stats:
          </p>
          <p className="text-xs text-muted-foreground pl-1">
            Keep an eye on your WPM (Words Per Minute) and Elo displayed at the top of the screen.
          </p>
        </div>
        <p className="text-xs text-muted-foreground pt-2 text-center">
          Good luck, and type fast!
        </p>

        <div className="mt-auto pt-4 text-center text-xs text-muted-foreground border-t border-border/50">
          <p>
            Developed by{' '}
            <a
              href="https://marcdejesusdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent underline"
            >
              Marc De Jesus
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
