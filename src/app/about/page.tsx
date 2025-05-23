
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Zap, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Lightbulb className="mr-3 h-8 w-8" /> About Retro Type Wave
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground/80">
          <p>
            Retro Type Wave is more than just a game; it's a vibrant, engaging platform designed to transport you back to the neon-drenched era of the 80s while supercharging your typing skills. Whether you're looking to improve your typing speed for work, school, or just for fun, Retro Type Wave offers a unique and motivating experience.
          </p>
          <p>
            Our core mission is to make learning and practicing typing an enjoyable activity. We believe that with consistent practice in a fun environment, anyone can significantly boost their words per minute (WPM) and accuracy.
          </p>
          
          <h3 className="text-xl font-semibold text-accent pt-4">What We Offer:</h3>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <Zap className="inline-block h-5 w-5 mr-2 text-accent" />
              <strong>Dynamic Typing Challenges:</strong> Race against AI opponents with varying difficulty based on your skill level. Choose from different game modes including freestyle word typing, prose from literature, and even Python code snippets.
            </li>
            <li>
              <Users className="inline-block h-5 w-5 mr-2 text-accent" />
              <strong>Competitive Elo System:</strong> Track your progress with our Elo rating system. See how you rank and strive to climb the global leaderboard.
            </li>
            <li>
              <Lightbulb className="inline-block h-5 w-5 mr-2 text-accent" />
              <strong>Skill Improvement:</strong> Regular play helps build muscle memory, enhance accuracy, and naturally increase your typing speed.
            </li>
            <li>
              <strong>Retro Aesthetics:</strong> Immerse yourself in a visually stunning retrowave theme, complete with an electrifying soundtrack.
            </li>
          </ul>
          
          <p className="pt-4">
            Join the wave and transform your typing journey from a chore into an exciting challenge!
          </p>

          <div className="pt-6 text-center">
            <Link href="/game-lobby">
              <Button size="lg">
                Start Typing Now! <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
