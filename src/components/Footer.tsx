
"use client";

import { Twitter, Instagram, Github, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link'; // Import Next.js Link

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

interface FooterLinkItem {
  href: string;
  label: string;
}

const footerLinks: FooterLinkItem[] = [
  { href: "/about", label: "About Retro Type Wave" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/technology", label: "Technology Used" },
  { href: "/how-to-improve-typing-speed", label: "Improve Typing Speed" },
  { href: "/typing-games-for-fun", label: "Typing Games for Fun" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Column 1: Copyright and Social Links */}
          <div className="space-y-4">
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

          {/* Column 2: SEO Links */}
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-foreground">Explore</h4>
            <ul className="space-y-1">
              {footerLinks.slice(0, 3).map((link) => ( // First 3 links
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 3: More SEO Links */}
          <div className="space-y-2 md:pt-7"> {/* md:pt-7 to align with Explore if needed or remove for natural flow */}
             <ul className="space-y-1">
              {footerLinks.slice(3).map((link) => ( // Remaining links
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
