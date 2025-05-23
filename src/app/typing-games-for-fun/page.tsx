
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Gamepad2, Keyboard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TypingGamesForFunPage() {
  const benefits = [
    {
      title: "Stress Relief",
      description: "Engaging in a fun typing game can be a great way to de-stress and take a mental break. The rhythmic nature of typing can be quite relaxing.",
      icon: <Smile className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Skill Improvement in Disguise",
      description: "While you're having fun, you're also unconsciously improving your typing speed, accuracy, and muscle memory. It's learning without feeling like work!",
      icon: <Keyboard className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Competitive Excitement",
      description: "Racing against AI or friends (in games that support it) adds a thrilling competitive edge that makes practice more motivating.",
      icon: <Gamepad2 className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Variety of Themes and Challenges",
      description: "Typing games come in many themes, from retro adventures like Retro Type Wave to space themes or zombie apocalypses, keeping things fresh.",
      icon: <Smile className="h-5 w-5 mr-2 text-accent" />
    },
    {
        title: "Sense of Accomplishment",
        description: "Beating your high score, climbing a leaderboard, or simply completing a challenging typing prompt provides a satisfying sense of achievement.",
        icon: <Gamepad2 className="h-5 w-5 mr-2 text-accent" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Gamepad2 className="mr-3 h-8 w-8" /> Typing Games for Fun & Skill
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground/80">
          <p>
            Who said practicing typing has to be boring? Typing games transform a mundane task into an engaging and enjoyable experience. They are not just for kids; adults can also reap significant benefits while having a blast!
          </p>
          <p>
            Games like <Link href="/" className="text-accent hover:underline">Retro Type Wave</Link> aim to combine the thrill of gaming with the practical advantages of improving your typing proficiency. Let's explore why typing games are a fantastic way to learn and have fun:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-card/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    {benefit.icon}
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="pt-4">
            So, if you're looking for a way to sharpen your keyboard skills without the monotony of traditional drills, dive into the world of typing games. You might be surprised at how quickly you improve and how much fun you have along the way!
          </p>
          <div className="pt-6 text-center">
            <Link href="/game-lobby">
              <Button size="lg">
                Play Retro Type Wave Now! <Keyboard className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
