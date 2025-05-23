
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Github, Linkedin, UserCircle } from 'lucide-react'; // Added UserCircle as a generic icon

interface SocialLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  ariaLabel: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon: Icon, label, ariaLabel }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={ariaLabel}
    className="w-full"
  >
    <Button variant="outline" className="w-full justify-start text-sm py-3 h-auto border-primary/30 hover:bg-primary/10">
      <Icon className="w-4 h-4 mr-3 text-accent" />
      {label}
    </Button>
  </a>
);

export function SocialMediaLinks() {
  // Replace with your actual social media links
  const socialLinks: SocialLinkProps[] = [
    { href: "https://twitter.com/yourprofile", icon: Twitter, label: "Twitter / X", ariaLabel: "Follow on Twitter" },
    { href: "https://instagram.com/yourprofile", icon: Instagram, label: "Instagram", ariaLabel: "Follow on Instagram" },
    { href: "https://github.com/yourprofile", icon: Github, label: "GitHub", ariaLabel: "Check out GitHub" },
    { href: "https://linkedin.com/in/yourprofile", icon: Linkedin, label: "LinkedIn", ariaLabel: "Connect on LinkedIn" },
  ];

  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <UserCircle className="w-5 h-5 mr-2" /> {/* Using UserCircle for "Follow Me" */}
          Connect With Me
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-2 p-3 text-sm text-foreground">
        {socialLinks.map((link) => (
          <SocialLink key={link.label} {...link} />
        ))}
         <p className="text-xs text-muted-foreground pt-2 text-center">
            Let's connect and build cool things together!
        </p>
      </CardContent>
    </Card>
  );
}
