"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaveformIcon } from "@/components/shared/waveform-icon";

interface StudioHeaderProps {
  isPlaying: boolean;
}

export function StudioHeader({ isPlaying }: StudioHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card/40 px-4 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link href="/" aria-label="Back to home">
          <Button size="icon-sm" variant="ghost">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <WaveformIcon bars={4} animate={isPlaying} className="h-4" />
          <span className="text-sm font-semibold">SoundScape Studio</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground sm:block">
          {isPlaying ? "Generating soundscape..." : "Ready to create"}
        </span>
      </div>
    </header>
  );
}
