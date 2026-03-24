"use client";

import { useCallback, useEffect, useRef } from "react";

const NOTES = ["♪", "♫", "♬", "♩", "🎵", "🎶"];
const COLORS = ["#FF6B6B", "#FFE66D", "#A8E6CF", "#4ECDC4", "#DDA0DD", "#87CEEB"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  note: string;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

/**
 * Canvas-based musical note particles that float upward from cursor movements.
 * Lightweight — no heavy library needed.
 */
export function MusicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, moving: false });
  const frameRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const seedRef = useRef(42);

  // Deterministic pseudo-random
  const nextRandom = useCallback(() => {
    seedRef.current = (seedRef.current * 16807 + 0) % 2147483647;
    return seedRef.current / 2147483647;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moving = true;

      // Throttle particle spawning
      const now = Date.now();
      if (now - lastSpawnRef.current > 80) {
        lastSpawnRef.current = now;
        const noteIdx = Math.floor(nextRandom() * NOTES.length);
        const colorIdx = Math.floor(nextRandom() * COLORS.length);
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (nextRandom() - 0.5) * 2,
          vy: -1.5 - nextRandom() * 2,
          life: 0,
          maxLife: 60 + nextRandom() * 40,
          size: 14 + nextRandom() * 10,
          note: NOTES[noteIdx],
          color: COLORS[colorIdx],
          rotation: nextRandom() * Math.PI * 2,
          rotationSpeed: (nextRandom() - 0.5) * 0.1,
        });
      }
    }

    function onMouseLeave() {
      mouseRef.current.moving = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01; // slight upward drift
        p.vx *= 0.99; // drag
        p.life++;
        p.rotation += p.rotationSpeed;

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.1 ? progress * 10 : 1 - (progress - 0.1) / 0.9;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, alpha) * 0.7;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.note, 0, 0);
        ctx.restore();
      }

      // Cap particles
      if (particles.length > 50) {
        particles.splice(0, particles.length - 50);
      }

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [nextRandom]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
}
