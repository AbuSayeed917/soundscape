"use client";

import { motion } from "motion/react";

interface WaveformIconProps {
  className?: string;
  animate?: boolean;
  bars?: number;
}

export function WaveformIcon({ className = "", animate = true, bars = 5 }: WaveformIconProps) {
  return (
    <div className={`flex items-end gap-[2px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary"
          initial={{ height: 8 }}
          animate={
            animate
              ? {
                  height: [8, 20 + Math.random() * 12, 8],
                }
              : { height: 8 }
          }
          transition={
            animate
              ? {
                  duration: 0.8 + Math.random() * 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1,
                  ease: "easeInOut",
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
