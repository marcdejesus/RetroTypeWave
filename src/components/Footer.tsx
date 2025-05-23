
"use client";

import { Twitter, Instagram, Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface SocialLinkItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const socialLinks: SocialLinkItem[] = [
  { href: "https://x.com/marcdejesusdev", icon: Twitter, label: "Twitter / X" },
  { href: "https://www.instagram.com/marcdejesusdev/", icon: Instagram, label: "Instagram" },
  { href: "https://github.com/marcdejesus", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/marc-de-jes%C3%BAs-075185252/", icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear}{' '}
            <a
              href="https://marcdejesusdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent hover:underline"
            >
              Marc De Jesus
            </a>
            . All rights reserved.
          </p>
          <div className="flex space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow on ${link.label}`}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'icon' }),
                  'rounded-full h-8 w-8 border border-primary/30 hover:bg-primary/10 hover:border-primary text-accent'
                )}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
