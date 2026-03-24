"use client";

import { motion } from "motion/react";
import { Camera, Mic, Cloud, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Tilt from "react-parallax-tilt";
import { Button } from "@/components/ui/button";
import { MagneticWrapper } from "@/components/shared/magnetic-wrapper";
import { WaveformIcon } from "@/components/shared/waveform-icon";

const CartoonScene = dynamic(
  () => import("@/components/three/cartoon-scene").then((m) => m.CartoonScene),
  { ssr: false },
);

const FEATURES = [
  {
    icon: Camera,
    label: "Snap a photo",
    desc: "Colors & mood become instruments and tempo",
    color: "#FF6B6B",
    bg: "bg-[#FFF0F0]",
    tiltColor: "rgba(255, 107, 107, 0.15)",
  },
  {
    icon: Mic,
    label: "Record ambient sound",
    desc: "Background noise becomes rhythm & texture",
    color: "#4ECDC4",
    bg: "bg-[#EAFAF8]",
    tiltColor: "rgba(78, 205, 196, 0.15)",
  },
  {
    icon: Cloud,
    label: "Weather & time",
    desc: "Rain, sun, night — atmospheric layers shift",
    color: "#FFE66D",
    bg: "bg-[#FFFDE6]",
    tiltColor: "rgba(255, 230, 109, 0.15)",
  },
];

const bounceIn = {
  hidden: { opacity: 0, scale: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
    },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* 3D Background */}
      <CartoonScene />

      {/* Top badge */}
      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        custom={0}
        className="z-10 mb-6"
      >
        <MagneticWrapper strength={10}>
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#FFE66D] bg-[#FFFDE6] px-5 py-2 text-sm font-bold text-[#2C3E50] cartoon-shadow">
            <Sparkles className="size-4 text-[#FFE66D]" />
            <span>AI-Powered Generative Music</span>
            <WaveformIcon bars={3} className="h-3" />
          </div>
        </MagneticWrapper>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        custom={1}
        className="z-10 max-w-3xl text-center text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
      >
        Turn your{" "}
        <span className="candy-text">world</span>{" "}
        into music
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        custom={2}
        className="z-10 mt-6 max-w-xl text-center text-lg font-medium text-muted-foreground"
      >
        Capture photos, ambient sound, and weather to create unique generative soundscapes.
        No musical skill required!
      </motion.p>

      {/* CTA buttons with magnetic effect */}
      <motion.div
        variants={bounceIn}
        initial="hidden"
        animate="visible"
        custom={3}
        className="z-10 mt-10 flex items-center gap-4"
      >
        <MagneticWrapper strength={20}>
          <Link href="/studio">
            <Button
              size="lg"
              className="gap-2 rounded-full bg-[#FF6B6B] px-8 py-6 text-base font-bold text-white cartoon-shadow-lg transition-transform hover:bg-[#FF5252] active:scale-95"
            >
              Open Studio
              <ArrowRight className="size-5" />
            </Button>
          </Link>
        </MagneticWrapper>

        <MagneticWrapper strength={15}>
          <a href="#how-it-works">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-[#4ECDC4] px-8 py-6 text-base font-bold text-[#4ECDC4] cartoon-shadow transition-transform hover:bg-[#4ECDC4] hover:text-white active:scale-95"
            >
              How it works
            </Button>
          </a>
        </MagneticWrapper>
      </motion.div>

      {/* Feature cards with 3D parallax tilt */}
      <div
        id="how-it-works"
        className="z-10 mt-32 grid w-full max-w-4xl gap-6 sm:grid-cols-3"
      >
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.label}
            variants={bounceIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={i}
          >
            <Tilt
              tiltMaxAngleX={12}
              tiltMaxAngleY={12}
              glareEnable
              glareMaxOpacity={0.2}
              glareColor={f.tiltColor}
              glareBorderRadius="1.5rem"
              transitionSpeed={400}
              scale={1.03}
            >
              <div
                className={`group relative overflow-hidden rounded-3xl border-2 border-border ${f.bg} p-6 cartoon-shadow`}
              >
                <div
                  className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl text-white cartoon-shadow"
                  style={{ backgroundColor: f.color }}
                >
                  <f.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-base font-bold">{f.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </div>

      {/* Bouncing scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <MagneticWrapper strength={25}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex size-10 items-center justify-center rounded-full border-2 border-[#FF6B6B] bg-white cartoon-shadow"
          >
            <div className="size-2 rounded-full bg-[#FF6B6B]" />
          </motion.div>
        </MagneticWrapper>
      </motion.div>
    </section>
  );
}
