"use client";

import Link from "next/link";
import { ArrowLeft, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformIcon } from "@/components/shared/waveform-icon";

interface StudioHeaderProps {
  isPlaying: boolean;
}

export function StudioHeader({ isPlaying }: StudioHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b-2 border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Back to home">
          <Button
            size="icon-sm"
            variant="ghost"
            className="rounded-xl hover:bg-secondary"
          >
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[#FF6B6B] cartoon-shadow">
            <Music className="size-4 text-white" />
          </div>
          <span className="text-sm font-black">SoundScape Studio</span>
          <WaveformIcon bars={4} animate={isPlaying} className="h-4 [&>div]:bg-[#FF6B6B]" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isPlaying && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A8E6CF] px-3 py-1 text-xs font-bold text-[#2C3E50]">
            <span className="size-2 animate-pulse rounded-full bg-[#4ECDC4]" />
            Playing
          </span>
        )}
        {!isPlaying && (
          <span className="text-xs font-medium text-muted-foreground">
            Ready to jam!
          </span>
        )}
      </div>
    </header>
  );
}
