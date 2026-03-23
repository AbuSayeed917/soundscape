"use client";

import { motion } from "motion/react";
import { Headphones, Layers, Share2, Sparkles } from "lucide-react";

const STEPS = [
  {
    icon: Sparkles,
    title: "Capture",
    desc: "Take a photo, record ambient sound, or let weather data flow in automatically.",
    accent: "from-cyan-500 to-teal-500",
  },
  {
    icon: Layers,
    title: "Generate",
    desc: "AI analyzes your inputs — colors, rhythms, mood — and maps them to musical parameters.",
    accent: "from-violet-500 to-purple-500",
  },
  {
    icon: Headphones,
    title: "Listen & Mix",
    desc: "A unique soundscape plays in real-time. Tweak layers, tempo, and effects in the mixer.",
    accent: "from-emerald-500 to-green-500",
  },
  {
    icon: Share2,
    title: "Share",
    desc: "Export your soundscape as audio or share a remix link for others to build upon.",
    accent: "from-orange-500 to-amber-500",
  },
];

export function DemoSection() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four steps from real world to soundscape.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:block" />

          <div className="space-y-16">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex items-start gap-8"
              >
                {/* Step number circle */}
                <div className="relative z-10 hidden md:block">
                  <div
                    className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} shadow-lg`}
                  >
                    <step.icon className="size-6 text-white" />
                  </div>
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md">
                  <div className="mb-3 flex items-center gap-3 md:hidden">
                    <div
                      className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.accent}`}
                    >
                      <step.icon className="size-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
