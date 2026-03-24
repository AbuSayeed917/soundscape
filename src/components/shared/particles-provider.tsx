"use client";

import dynamic from "next/dynamic";

const MusicParticles = dynamic(
  () => import("@/components/shared/music-particles").then((m) => m.MusicParticles),
  { ssr: false },
);

export function ParticlesProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MusicParticles />
      {children}
    </>
  );
}
