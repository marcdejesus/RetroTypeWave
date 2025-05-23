
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export function AdPlaceholder() {
  return (
    <Card className="h-full border-primary/30 shadow-md flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg text-primary">
          <Megaphone className="w-5 h-5 mr-2" />
          Advertisement
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="w-full aspect-[4/3] bg-muted/30 rounded-md flex items-center justify-center p-4 border border-dashed border-muted-foreground/50">
          <p className="text-muted-foreground text-center text-sm">
            Retro Ad Content Here!
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Your amazing product could be featured.
        </p>
      </CardContent>
    </Card>
  );
}
