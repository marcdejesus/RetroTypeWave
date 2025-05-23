
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Award, Users, BarChart, ArrowRight, Keyboard } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 lg:py-20 bg-card/30 rounded-lg shadow-xl border border-primary/30 overflow-hidden">
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{ backgroundImage: "url('/retrowave-background.gif')" }}
            data-ai-hint="retrowave city sunset"
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <Image src="/logo.png" alt="Retro Type Wave Logo" width={180} height={180} className="mx-auto mb-6" />
          <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-4 tracking-wider">
            Welcome to Retro Type Wave!
          </h1>
          <p className="text-lg lg:text-xl text-foreground/90 max-w-2xl mx-auto mb-8">
            The ultimate retro-themed multiplayer typing race game. Sharpen your skills, climb the leaderboard, and ride the synthwave to typing mastery!
          </p>
          <Link href="/game-lobby">
            <Button size="lg" className="text-lg py-7 px-10">
              Start Typing Now! <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* What is Retro Type Wave Section */}
      <section className="py-8">
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Retro Type Wave Gameplay"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="typing game interface"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-3xl flex items-center text-primary">
                  <Keyboard className="mr-3 h-8 w-8" /> What is Retro Type Wave?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-foreground/80 mb-4">
                  Retro Type Wave is an exhilarating typing game where you race against AI opponents (and soon, friends!) in a vibrant, retro-themed environment. Type prompts accurately and quickly to leave your competitors in the dust.
                </p>
                <p className="text-foreground/80">
                  It's not just a game; it's a fun way to significantly improve your typing speed and accuracy through engaging challenges and consistent practice.
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
      </section>

      {/* Benefits Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">
          <Zap className="inline-block mr-2 h-7 w-7" />Boost Your Typing Skills!
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="mr-2 h-6 w-6 text-accent" /> Increase Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Race against the clock and opponents to naturally push your typing speed limits.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-6 w-6 text-accent" /> Enhance Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Focus on precision to earn higher scores and reduce errors in your daily typing.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-accent" /> Build Muscle Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consistent play reinforces correct finger placements, making typing effortless.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Features Section */}
      <section className="py-8">
         <Card className="overflow-hidden">
          <div className="md:flex flex-row-reverse">
            <div className="md:w-1/2">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Leaderboard and Elo"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="game leaderboard trophy"
              />
            </div>
            <div className="md:w-1/2 p-6 md:p-8">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-3xl flex items-center text-primary">
                  <Users className="mr-3 h-8 w-8" /> Social & Competitive!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-foreground/80 mb-4">
                  Track your progress with our Elo rating system. See how you stack up against others on the global leaderboard.
                </p>
                <ul className="list-disc list-inside text-foreground/80 space-y-1">
                  <li>Dynamic Elo rating that adjusts with each race.</li>
                  <li>Compete for a top spot on the global leaderboard.</li>
                  <li>Challenge yourself to beat your personal best WPM.</li>
                  <li>(Coming Soon: Race against friends in private lobbies!)</li>
                </ul>
              </CardContent>
            </div>
          </div>
        </Card>
      </section>

      <section className="text-center py-12">
         <Link href="/game-lobby">
            <Button size="lg" variant="outline" className="text-lg py-7 px-10 border-primary text-primary hover:bg-primary/10 hover:text-accent-foreground">
              Ready to Race? <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
      </section>
    </div>
  );
}
