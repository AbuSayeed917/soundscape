"use client";

import { useEffect, useRef } from "react";

export function AnimatedGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!ctx || !canvas) return;
      time += 0.003;

      const w = canvas.width;
      const h = canvas.height;

      // Deep dark base
      ctx.fillStyle = "rgb(8, 8, 18)";
      ctx.fillRect(0, 0, w, h);

      // Flowing gradient orbs
      const orbs = [
        {
          x: w * 0.3 + Math.sin(time * 0.7) * w * 0.15,
          y: h * 0.4 + Math.cos(time * 0.5) * h * 0.1,
          r: Math.min(w, h) * 0.4,
          color: "rgba(34, 211, 238, 0.06)",
        },
        {
          x: w * 0.7 + Math.cos(time * 0.6) * w * 0.1,
          y: h * 0.6 + Math.sin(time * 0.4) * h * 0.15,
          r: Math.min(w, h) * 0.35,
          color: "rgba(167, 139, 250, 0.04)",
        },
        {
          x: w * 0.5 + Math.sin(time * 0.8) * w * 0.2,
          y: h * 0.3 + Math.cos(time * 0.3) * h * 0.2,
          r: Math.min(w, h) * 0.3,
          color: "rgba(52, 211, 153, 0.03)",
        },
      ];

      for (const orb of orbs) {
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle noise grain
      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 8;
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
      ctx.putImageData(imageData, 0, 0);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
