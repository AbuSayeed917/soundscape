"use client";

import { motion } from "motion/react";
import { Camera, Mic, Cloud, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WaveformIcon } from "@/components/shared/waveform-icon";

const FEATURES = [
  {
    icon: Camera,
    label: "Snap a photo",
    desc: "Colors & mood map to instruments and tempo",
  },
  {
    icon: Mic,
    label: "Record ambient sound",
    desc: "Background noise becomes rhythm & texture",
  },
  {
    icon: Cloud,
    label: "Weather & time",
    desc: "Rain, sun, night — atmospheric layers shift",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-24">
      {/* Top badge */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md">
          <WaveformIcon bars={3} className="h-3" />
          <span>AI-Powered Generative Music</span>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="max-w-3xl text-center text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
      >
        Turn your{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
          world
        </span>{" "}
        into music
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={2}
        className="mt-6 max-w-xl text-center text-lg text-muted-foreground"
      >
        Capture photos, ambient sound, and weather to create unique generative soundscapes.
        No musical skill required.
      </motion.p>

      {/* CTA */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="mt-10 flex items-center gap-4"
      >
        <Link href="/studio">
          <Button size="lg">
            Open Studio
            <ArrowRight className="ml-1 size-4" data-icon="inline-end" />
          </Button>
        </Link>
        <a href="#how-it-works">
          <Button variant="outline" size="lg">
            See how it works
          </Button>
        </a>
      </motion.div>

      {/* Feature cards */}
      <div
        id="how-it-works"
        className="mt-28 grid w-full max-w-4xl gap-4 sm:grid-cols-3"
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={i}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md transition-colors hover:border-primary/30"
          >
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <f.icon className="size-5" />
            </div>
            <h3 className="mb-1 text-sm font-semibold">{f.label}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>

            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute -bottom-12 -right-12 size-40 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="size-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center"
        >
          <div className="size-1.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
