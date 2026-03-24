"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Play, Square, RotateCcw } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { Slider } from "@/components/ui/slider";
import { InteractiveButton } from "@/components/shared/interactive-button";
import { MagneticWrapper } from "@/components/shared/magnetic-wrapper";
import type { SoundParameters, MusicalKey } from "@/types";

const KEYS: MusicalKey[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const MOOD_COLORS: Record<string, string> = {
  calm: "#87CEEB",
  energetic: "#FF6B6B",
  melancholic: "#DDA0DD",
  dreamy: "#A8E6CF",
  intense: "#FF4757",
  playful: "#FFE66D",
  mysterious: "#4ECDC4",
};

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
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePlay = () => {
    onPlay();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Transport */}
      <div className="flex items-center gap-3">
        <div className="relative">
          {showConfetti && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <ConfettiExplosion
                force={0.6}
                duration={2200}
                particleCount={80}
                colors={["#FF6B6B", "#FFE66D", "#A8E6CF", "#4ECDC4", "#DDA0DD", "#87CEEB"]}
                width={300}
              />
            </div>
          )}

          {isPlaying ? (
            <InteractiveButton
              onClick={onStop}
              color="#FF4757"
              className="flex items-center gap-2 rounded-full border-2 border-[#FF4757] bg-[#FFF0F0] px-6 py-2.5 font-bold text-[#FF4757] cartoon-shadow transition-colors hover:bg-[#FF4757] hover:text-white"
            >
              <Square className="size-4 fill-current" />
              Stop
            </InteractiveButton>
          ) : (
            <InteractiveButton
              onClick={handlePlay}
              color="#FF6B6B"
              className="flex items-center gap-2 rounded-full bg-[#FF6B6B] px-6 py-2.5 font-bold text-white cartoon-shadow-lg"
            >
              <Play className="size-4 fill-current" />
              Play
            </InteractiveButton>
          )}
        </div>

        <InteractiveButton
          onClick={() =>
            onUpdateParams({
              tempo: 72,
              key: "C",
              scale: "pentatonic",
              mood: "calm",
            })
          }
          color="#8B7E74"
          className="flex size-9 items-center justify-center rounded-xl hover:bg-secondary"
        >
          <RotateCcw className="size-4" />
        </InteractiveButton>
      </div>

      {/* Tempo */}
      <div className="rounded-2xl border-2 border-border bg-card p-4 cartoon-shadow">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tempo
          </label>
          <span className="rounded-full bg-[#FFE66D] px-3 py-0.5 font-mono text-sm font-bold text-[#2C3E50]">
            {parameters.tempo} BPM
          </span>
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
      <div className="rounded-2xl border-2 border-border bg-card p-4 cartoon-shadow">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Key
        </label>
        <div className="grid grid-cols-6 gap-1.5">
          {KEYS.map((k) => (
            <MagneticWrapper key={k} strength={8} range={1.2}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onUpdateParams({ key: k })}
                className={`w-full rounded-xl px-2 py-2 text-xs font-bold transition-all ${
                  parameters.key === k
                    ? "bg-[#FF6B6B] text-white cartoon-shadow"
                    : "bg-secondary text-muted-foreground hover:bg-[#FFE66D] hover:text-[#2C3E50]"
                }`}
              >
                {k}
              </motion.button>
            </MagneticWrapper>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="rounded-2xl border-2 border-border bg-card p-4 cartoon-shadow">
        <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Mood
        </label>
        <div className="flex flex-wrap gap-2">
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
            <MagneticWrapper key={mood} strength={10}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => onUpdateParams({ mood })}
                className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold capitalize transition-all ${
                  parameters.mood === mood
                    ? "text-white cartoon-shadow"
                    : "border-border bg-card text-muted-foreground hover:border-current"
                }`}
                style={
                  parameters.mood === mood
                    ? { backgroundColor: MOOD_COLORS[mood], borderColor: MOOD_COLORS[mood] }
                    : undefined
                }
              >
                {mood}
              </motion.button>
            </MagneticWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}
