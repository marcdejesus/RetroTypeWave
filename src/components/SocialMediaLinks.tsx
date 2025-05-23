
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Instagram, Github, Linkedin, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button'; // For styling the anchor like a button

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string; // Still useful for aria-label
}

const socialLinks: SocialLinkProps[] = [
  { href: "https://x.com/marcdejesusdev", icon: Twitter, label: "Twitter / X" },
  { href: "https://www.instagram.com/marcdejesusdev/", icon: Instagram, label: "Instagram" },
  { href: "https://github.com/marcdejesus", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/marc-de-jes%C3%BAs-075185252/", icon: Linkedin, label: "LinkedIn" },
];

export function SocialMediaLinks() {
  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <UserCircle className="w-5 h-5 mr-2" />
          Connect With Me
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center p-3 text-sm text-foreground">
        <div className="flex space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow on ${link.label}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'rounded-full border border-primary/30 hover:bg-primary/10 hover:border-primary text-accent'
              )}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Let's connect and build cool things together!
        </p>
      </CardContent>
    </Card>
  );
}
