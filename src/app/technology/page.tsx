
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Code, Palette, Cloud } from 'lucide-react';

export default function TechnologyPage() {
  const technologies = [
    { name: 'Next.js', description: 'A React framework for building server-rendered and static web applications.', icon: <Code className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'React', description: 'A JavaScript library for building user interfaces.', icon: <Code className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'TypeScript', description: 'A typed superset of JavaScript that compiles to plain JavaScript.', icon: <Code className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'Tailwind CSS', description: 'A utility-first CSS framework for rapid UI development.', icon: <Palette className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'ShadCN UI', description: 'A collection of re-usable UI components built with Radix UI and Tailwind CSS.', icon: <Palette className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'Firebase', description: 'Used for Firestore database (leaderboard) and potentially App Hosting.', icon: <Cloud className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'Lucide React', description: 'A library of simply beautiful open-source icons.', icon: <Palette className="h-5 w-5 mr-2 text-accent" /> },
    { name: 'Vercel', description: 'Platform for hosting and deploying Next.js applications (likely deployment target).', icon: <Cloud className="h-5 w-5 mr-2 text-accent" /> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center">
            <Cpu className="mr-3 h-8 w-8" /> Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground/80">
          <p>
            Retro Type Wave is built with a modern, efficient, and scalable technology stack to provide a seamless and enjoyable user experience. Here are some of the key technologies and libraries used:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {technologies.map((tech) => (
              <Card key={tech.name} className="bg-card/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    {tech.icon}
                    {tech.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="pt-4">
            This combination of technologies allows for rapid development, excellent performance, and a high-quality user interface, making Retro Type Wave a blast to play and interact with!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
