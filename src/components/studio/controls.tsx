"use client";

import { motion } from "motion/react";
import { Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import type { SoundParameters, MusicalKey } from "@/types";

const KEYS: MusicalKey[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface ControlsProps {
  isPlaying: boolean;
  parameters: SoundParameters;
  onPlay: () => void;
  onStop: () => void;
  onUpdateParams: (updates: Partial<SoundParameters>) => void;
}

export function Controls({
  isPlaying,
  parameters,
  onPlay,
  onStop,
  onUpdateParams,
}: ControlsProps) {
  return (
    <div className="space-y-6">
      {/* Transport */}
      <div className="flex items-center gap-3">
        <motion.div whileTap={{ scale: 0.92 }}>
          {isPlaying ? (
            <Button
              size="lg"
              variant="outline"
              onClick={onStop}
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Square className="size-4 fill-current" />
              Stop
            </Button>
          ) : (
            <Button size="lg" onClick={onPlay} className="gap-2">
              <Play className="size-4 fill-current" />
              Play
            </Button>
          )}
        </motion.div>

        <Button
          size="icon-lg"
          variant="ghost"
          onClick={() =>
            onUpdateParams({
              tempo: 72,
              key: "C",
              scale: "pentatonic",
              mood: "calm",
            })
          }
          aria-label="Reset parameters"
        >
          <RotateCcw className="size-4" />
        </Button>

        {/* Status badge */}
        <Badge variant={isPlaying ? "default" : "secondary"} className="ml-auto">
          {isPlaying ? "Playing" : "Idle"}
        </Badge>
      </div>

      {/* Tempo */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tempo
          </label>
          <span className="font-mono text-sm">{parameters.tempo} BPM</span>
        </div>
        <Slider
          value={[parameters.tempo]}
          onValueChange={(v) => onUpdateParams({ tempo: Array.isArray(v) ? v[0] : v })}
          min={40}
          max={180}
          step={1}
          aria-label="Tempo"
        />
      </div>

      {/* Key selector */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {KEYS.map((k) => (
            <button
              key={k}
              onClick={() => onUpdateParams({ key: k })}
              className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                parameters.key === k
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Mood
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              "calm",
              "energetic",
              "melancholic",
              "dreamy",
              "intense",
              "playful",
              "mysterious",
            ] as const
          ).map((mood) => (
            <button
              key={mood}
              onClick={() => onUpdateParams({ mood })}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                parameters.mood === mood
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
