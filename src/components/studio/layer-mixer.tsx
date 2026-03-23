"use client";

import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { AudioLayer } from "@/types";

interface LayerMixerProps {
  layers: AudioLayer[];
  onToggle: (id: string) => void;
  onVolumeChange: (id: string, volume: number) => void;
}

export function LayerMixer({ layers, onToggle, onVolumeChange }: LayerMixerProps) {
  return (
    <div className="space-y-2">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Layers
      </h3>
      <AnimatePresence>
        {layers.map((layer, i) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className={`group flex items-center gap-3 rounded-xl border p-3 transition-all ${
              layer.active
                ? "border-border bg-card/80"
                : "border-transparent bg-card/30 opacity-50"
            }`}
          >
            {/* Toggle button */}
            <button
              onClick={() => onToggle(layer.id)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
              aria-label={`${layer.active ? "Mute" : "Unmute"} ${layer.name}`}
            >
              {layer.active ? (
                <Volume2 className="size-4" style={{ color: layer.color }} />
              ) : (
                <VolumeX className="size-4 text-muted-foreground" />
              )}
            </button>

            {/* Layer info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: layer.active ? layer.color : "var(--muted)" }}
                />
                <span className="truncate text-sm font-medium">{layer.name}</span>
              </div>

              {/* Volume slider */}
              {layer.active && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <Slider
                    value={[layer.volume * 100]}
                    onValueChange={(v) => onVolumeChange(layer.id, (Array.isArray(v) ? v[0] : v) / 100)}
                    max={100}
                    step={1}
                    className="w-full"
                    aria-label={`${layer.name} volume`}
                  />
                </motion.div>
              )}
            </div>

            {/* Volume percentage */}
            <span className="w-10 text-right font-mono text-xs text-muted-foreground">
              {Math.round(layer.volume * 100)}%
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
