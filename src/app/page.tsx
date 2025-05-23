
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Clock, Zap } from 'lucide-react';
import { RACE_DURATIONS } from '@/lib/constants';

export default function HomePage() {
  const [selectedDuration, setSelectedDuration] = useState<string>(RACE_DURATIONS[1].toString());
  const router = useRouter();

  const handleStartRace = () => {
    router.push(`/race?duration=${selectedDuration}`);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/retrowave-background.gif')" }} // Placeholder for your GIF
      data-ai-hint="retrowave city sunset"
    >
      {/* Adding a semi-transparent overlay to make the card more readable over the GIF */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
      
      {/* Card needs to be above the overlay */}
      <Card className="w-full max-w-md z-10 bg-card/80 backdrop-blur-md border-primary/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Zap className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to Retro Type Wave!</CardTitle>
          <CardDescription className="text-lg text-card-foreground/90">Choose your race duration and test your typing speed.</CardDescription>
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
              {RACE_DURATIONS.map((duration) => (
                <div key={duration}>
                  <RadioGroupItem value={duration.toString()} id={`duration-${duration}`} className="sr-only" />
                  <Label
                    htmlFor={`duration-${duration}`}
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover/80 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer text-popover-foreground ${selectedDuration === duration.toString() ? 'border-primary ring-2 ring-primary' : 'border-border/70'}`}
                  >
                    <span className="text-xl font-bold">{duration}</span>
                    <span className="text-xs">seconds</span>
                  </Label>
                </div>
              ))}
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
