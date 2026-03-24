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
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Layers
      </h3>
      <AnimatePresence>
        {layers.map((layer, i) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
            className={`group rounded-2xl border-2 p-3 transition-all ${
              layer.active
                ? "border-border bg-card cartoon-shadow"
                : "border-transparent bg-secondary/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Toggle button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onToggle(layer.id)}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors"
                style={{
                  backgroundColor: layer.active ? `${layer.color}20` : undefined,
                }}
                aria-label={`${layer.active ? "Mute" : "Unmute"} ${layer.name}`}
              >
                {layer.active ? (
                  <Volume2 className="size-4" style={{ color: layer.color }} />
                ) : (
                  <VolumeX className="size-4 text-muted-foreground" />
                )}
              </motion.button>

              {/* Layer info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: layer.active ? layer.color : "var(--muted)" }}
                  />
                  <span className="truncate text-sm font-bold">{layer.name}</span>
                </div>
              </div>

              {/* Volume percentage */}
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold"
                style={{
                  backgroundColor: layer.active ? `${layer.color}20` : undefined,
                  color: layer.active ? layer.color : "var(--muted-foreground)",
                }}
              >
                {Math.round(layer.volume * 100)}%
              </span>
            </div>

            {/* Volume slider */}
            {layer.active && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 px-1"
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
