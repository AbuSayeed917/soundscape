"use client";

import { motion } from "motion/react";
import { Headphones, Layers, Share2, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Capture",
    desc: "Take a photo, record ambient sound, or let weather data flow in automatically.",
    color: "#FF6B6B",
    bg: "bg-[#FFF0F0]",
    num: "01",
  },
  {
    icon: Layers,
    title: "Generate",
    desc: "AI analyzes your inputs — colors, rhythms, mood — and maps them to musical parameters.",
    color: "#4ECDC4",
    bg: "bg-[#EAFAF8]",
    num: "02",
  },
  {
    icon: Headphones,
    title: "Listen & Mix",
    desc: "A unique soundscape plays in real-time. Tweak layers, tempo, and effects in the mixer.",
    color: "#FFE66D",
    bg: "bg-[#FFFDE6]",
    num: "03",
  },
  {
    icon: Share2,
    title: "Share",
    desc: "Export your soundscape as audio or share a remix link for others to build upon.",
    color: "#DDA0DD",
    bg: "bg-[#F8F0F8]",
    num: "04",
  },
];

export function DemoSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-20 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-[#FFE66D] px-4 py-1 text-sm font-bold text-[#2C3E50]">
            How it works
          </span>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Four steps to <span className="candy-text">magic</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From real world to soundscape in seconds.
          </p>
        </motion.div>

        {/* Step cards grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className={`group relative overflow-hidden rounded-3xl border-2 border-border ${step.bg} p-8 cartoon-shadow transition-transform hover:scale-[1.02]`}
            >
              {/* Step number watermark */}
              <span
                className="absolute -right-2 -top-4 text-8xl font-black opacity-[0.07]"
                style={{ color: step.color }}
              >
                {step.num}
              </span>

              <div className="relative flex items-start gap-5">
                {/* Icon */}
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white cartoon-shadow"
                  style={{ backgroundColor: step.color }}
                >
                  <step.icon className="size-6" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
