
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CheckCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HowToImproveTypingSpeedPage() {
  const tips = [
    {
      title: "Practice Consistently",
      description: "Like any skill, typing improves with regular practice. Even 15-30 minutes a day can make a significant difference. Use games like Retro Type Wave to make practice fun!",
      icon: <Zap className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Focus on Accuracy First",
      description: "It's tempting to type as fast as possible, but accuracy is key. Speed will naturally follow as you reduce errors. Slow down if you're making too many mistakes.",
      icon: <CheckCircle className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Learn Proper Touch Typing Technique",
      description: "Using all ten fingers without looking at the keyboard is the foundation of fast typing. Keep your fingers on the home row (ASDF JKL;) and use the correct finger for each key.",
      icon: <BarChart className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Maintain Good Posture",
      description: "Sit up straight, keep your wrists flat, and ensure your screen is at eye level. Good ergonomics prevent fatigue and can improve typing efficiency.",
      icon: <CheckCircle className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Use Online Typing Tutors and Games",
      description: "Platforms like Retro Type Wave, and other typing tutors, offer structured lessons and engaging exercises to help you improve progressively.",
      icon: <Zap className="h-5 w-5 mr-2 text-accent" />
    },
    {
      title: "Challenge Yourself",
      description: "Once you're comfortable, try to push your speed slightly beyond your comfort zone. Set goals and track your WPM progress over time.",
      icon: <BarChart className="h-5 w-5 mr-2 text-accent" />
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Zap className="mr-3 h-8 w-8" /> How to Improve Your Typing Speed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground/80">
          <p>
            Increasing your typing speed is a valuable skill in today's digital world. It can boost productivity, improve communication, and even make gaming more enjoyable. Here are some effective tips to help you type faster and more accurately:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <Card key={tip.title} className="bg-card/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    {tip.icon}
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="pt-4">
            Remember, improvement takes time and patience. Stay consistent with your practice, and you'll see your typing speed and accuracy soar!
          </p>
           <div className="pt-6 text-center">
            <Link href="/game-lobby">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Practice on Retro Type Wave <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
