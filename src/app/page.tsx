
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import next/image
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock, Zap } from 'lucide-react';
import { RACE_DURATIONS } from '@/lib/constants';

export default function HomePage() {
  // Default to the middle option (3 minutes / 180 seconds)
  const [selectedDuration, setSelectedDuration] = useState<string>(RACE_DURATIONS[1].toString());
  const router = useRouter();

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

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/retrowave-background.gif')" }}
      data-ai-hint="retrowave city sunset"
    >
      <Card className="w-full max-w-md z-10 bg-card/80 border-primary/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {/* Replace Zap icon with Image component */}
            <Image src="/logo.png" alt="Retro Type Wave Logo" width={64} height={64} className="text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Retro Type Wave!</CardTitle>
          <CardDescription className="text-lg text-card-foreground/90">
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
