
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Clock, Zap, Cog } from 'lucide-react';
import { RACE_DURATIONS } from '@/lib/constants';
import { useUserElo } from '@/hooks/useUserElo'; // Import useUserElo
import { useToast } from "@/hooks/use-toast"; // Import useToast

export default function GameLobbyPage() {
  const [selectedDuration, setSelectedDuration] = useState<string>(RACE_DURATIONS[1].toString());
  const router = useRouter();
  const { username: currentUsername, updateUserUsername, isLoading: eloLoading } = useUserElo(); // Get username and update function
  const { toast } = useToast();

  const [usernameInput, setUsernameInput] = useState(currentUsername || '');
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  useEffect(() => {
    // Update input field if username changes from hook (e.g. after initial load)
    if (currentUsername !== undefined) {
      setUsernameInput(currentUsername);
    }
  }, [currentUsername]);

  const handleStartRace = () => {
    router.push(`/race?duration=${selectedDuration}`);
  };

  const formatDurationForDisplay = (durationInSeconds: number): { value: string; unit: string } => {
    const minutes = durationInSeconds / 60;
    return {
      value: minutes.toString(),
      unit: minutes === 1 ? "minute" : "minutes",
    };
  };

  const handleSaveUsername = () => {
    if (usernameInput.trim() === "") {
        toast({
            title: "Username Required",
            description: "Please enter a username.",
            variant: "destructive",
        });
        return;
    }
    updateUserUsername(usernameInput.trim());
    toast({
        title: "Username Saved",
        description: `Your username has been set to: ${usernameInput.trim()}`,
    });
    setIsSettingsDialogOpen(false); // Close the dialog
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/retrowave-background.gif')" }}
      data-ai-hint="retrowave city sunset"
    >
      <Card className="w-full max-w-md z-10 bg-card/80 border-primary/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/logo.png" alt="Retro Type Wave Logo" width={320} height={320} className="text-primary" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <CardTitle className="text-3xl font-bold">Start a New Race!</CardTitle>
            <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary hover:text-accent">
                  <Cog className="w-6 h-6" />
                  <span className="sr-only">Player Settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Player Settings</DialogTitle>
                  <DialogDescription>
                    Set your username. This will be saved in your browser and used if you qualify for the leaderboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="col-span-3"
                      maxLength={20}
                      placeholder={eloLoading ? "Loading..." : "Your Name"}
                      disabled={eloLoading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSaveUsername}>Save Username</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="text-lg text-card-foreground/90 mt-2">
            Choose your race duration and test your typing speed. Consistent practice will help increase your speed over time through muscle memory!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-base font-semibold flex items-center text-card-foreground">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Race Duration
            </Label>
            <RadioGroup
              id="duration"
              value={selectedDuration}
              onValueChange={setSelectedDuration}
              className="grid grid-cols-3 gap-4"
            >
              {RACE_DURATIONS.map((duration) => {
                const display = formatDurationForDisplay(duration);
                return (
                  <div key={duration}>
                    <RadioGroupItem value={duration.toString()} id={`duration-${duration}`} className="sr-only" />
                    <Label
                      htmlFor={`duration-${duration}`}
                      className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover/80 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer text-popover-foreground ${selectedDuration === duration.toString() ? 'border-primary ring-2 ring-primary' : 'border-border/70'}`}
                    >
                      <span className="text-xl font-bold">{display.value}</span>
                      <span className="text-xs">{display.unit}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartRace} className="w-full text-lg py-6" size="lg">
            <Zap className="mr-2 h-5 w-5" />
            Start Race
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

