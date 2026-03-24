"use client";

import { useEffect, useRef } from "react";

interface VisualizerProps {
  analyserData: Float32Array | null;
  isPlaying: boolean;
}

const BAR_COLORS = ["#FF6B6B", "#FFE66D", "#A8E6CF", "#4ECDC4", "#DDA0DD", "#87CEEB"];

export function Visualizer({ analyserData, isPlaying }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx || !canvas) return;
      timeRef.current += 0.02;
      const t = timeRef.current;

      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      // Clear with slight background
      ctx.clearRect(0, 0, w, h);

      const barCount = 48;
      const gap = 4;
      const barWidth = (w - gap * barCount) / barCount;
      const data = analyserData;

      for (let i = 0; i < barCount; i++) {
        let amplitude: number;
        if (data && data.length > 0 && isPlaying) {
          const idx = Math.floor((i / barCount) * data.length);
          amplitude = Math.max(0, (data[idx] + 100) / 100);
        } else {
          // Idle bouncy wave
          amplitude = 0.15 + Math.sin(t * 1.5 + i * 0.2) * 0.1 + Math.sin(t * 0.8 + i * 0.4) * 0.05;
        }

        const barHeight = amplitude * h * 0.75;
        const x = i * (barWidth + gap) + gap / 2;
        const y = h - barHeight;
        const color = BAR_COLORS[i % BAR_COLORS.length];

        // Rounded bars with cartoon colors
        const radius = Math.min(barWidth / 2, 8);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        // Cute dot on top
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x + barWidth / 2, y + 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Wavy line on top
      ctx.beginPath();
      ctx.strokeStyle = "#FF6B6B";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      for (let x = 0; x < w; x += 2) {
        const yWave =
          h * 0.3 +
          Math.sin(x * 0.02 + t * 2) * 20 +
          Math.sin(x * 0.01 + t) * 15;
        if (x === 0) ctx.moveTo(x, yWave);
        else ctx.lineTo(x, yWave);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [analyserData, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-2xl"
      aria-label="Audio visualizer"
    />
  );
}
