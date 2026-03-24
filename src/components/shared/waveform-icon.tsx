"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

const BAR_COLORS = ["#FF6B6B", "#FFE66D", "#4ECDC4", "#A8E6CF", "#DDA0DD"];

interface WaveformIconProps {
  className?: string;
  animate?: boolean;
  bars?: number;
}

export function WaveformIcon({ className = "", animate = true, bars = 5 }: WaveformIconProps) {
  const barData = useMemo(
    () =>
      Array.from({ length: bars }, (_, i) => ({
        peakHeight: 18 + ((i * 7 + 3) % 10),
        duration: 0.6 + ((i * 3 + 2) % 5) * 0.08,
        color: BAR_COLORS[i % BAR_COLORS.length],
      })),
    [bars],
  );

  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {barData.map((bar, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            backgroundColor: bar.color,
          }}
          initial={{ height: 8 }}
          animate={
            animate
              ? { height: [8, bar.peakHeight, 8] }
              : { height: 8 }
          }
          transition={
            animate
              ? {
                  duration: bar.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.08,
                  ease: "easeInOut",
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
