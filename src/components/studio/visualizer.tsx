"use client";

import { useEffect, useRef } from "react";

interface VisualizerProps {
  analyserData: Float32Array | null;
  isPlaying: boolean;
  accentColor?: string;
}

export function Visualizer({
  analyserData,
  isPlaying,
  accentColor = "#22d3ee",
}: VisualizerProps) {
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

      // Clear
      ctx.clearRect(0, 0, w, h);

      if (!isPlaying && !analyserData) {
        // Idle state — gentle sine wave
        ctx.beginPath();
        ctx.strokeStyle = `${accentColor}33`;
        ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * 0.02 + t) * 15 + Math.sin(x * 0.01 + t * 0.5) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const barCount = 64;
      const barWidth = w / barCount - 1;
      const data = analyserData;

      for (let i = 0; i < barCount; i++) {
        let amplitude: number;
        if (data && data.length > 0) {
          const idx = Math.floor((i / barCount) * data.length);
          // Convert dB (-100 to 0) to 0-1
          amplitude = Math.max(0, (data[idx] + 100) / 100);
        } else {
          amplitude = 0.2 + Math.sin(t + i * 0.3) * 0.15;
        }

        const barHeight = amplitude * h * 0.8;
        const x = i * (barWidth + 1);
        const y = h - barHeight;

        // Gradient per bar
        const gradient = ctx.createLinearGradient(x, h, x, y);
        gradient.addColorStop(0, `${accentColor}15`);
        gradient.addColorStop(0.5, `${accentColor}60`);
        gradient.addColorStop(1, accentColor);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();

        // Glow on top
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = 8;
        ctx.fillStyle = accentColor;
        ctx.fillRect(x, y, barWidth, 2);
        ctx.shadowBlur = 0;
      }

      // Waveform overlay
      ctx.beginPath();
      ctx.strokeStyle = `${accentColor}40`;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x++) {
        const dataIdx = data ? Math.floor((x / w) * data.length) : 0;
        const val = data ? (data[dataIdx] + 100) / 100 : 0.5;
        const y = h / 2 + (val - 0.5) * h * 0.6 + Math.sin(x * 0.03 + t * 2) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [analyserData, isPlaying, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-xl"
      aria-label="Audio visualizer"
    />
  );
}
