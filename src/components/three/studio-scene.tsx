"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshWobbleMaterial, Torus } from "@react-three/drei";
import * as THREE from "three";

/** Deterministic pseudo-random from seed */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const PARTICLE_COLORS = ["#FF6B6B", "#FFE66D", "#A8E6CF", "#4ECDC4", "#DDA0DD", "#87CEEB"];

/** Pulsing orb that reacts to audio playback */
function PulsingOrb({ isPlaying, color = "#FF6B6B" }: { isPlaying: boolean; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const base = isPlaying ? 1.2 : 1;
    const pulse = isPlaying ? Math.sin(state.clock.elapsedTime * 4) * 0.15 : 0;
    const s = base + pulse;
    ref.current.scale.set(s, s, s);
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={ref} args={[0.8, 32, 32]}>
        <MeshWobbleMaterial
          color={color}
          factor={isPlaying ? 0.6 : 0.2}
          speed={isPlaying ? 3 : 1}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

/** Animated rings around the orb */
function Rings({ isPlaying }: { isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * (isPlaying ? 0.5 : 0.15);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });

  const colors = ["#FFE66D", "#4ECDC4", "#A8E6CF", "#DDA0DD"];

  return (
    <group ref={groupRef}>
      {colors.map((color, i) => (
        <Torus
          key={i}
          args={[1.2 + i * 0.25, 0.025, 8, 48]}
          rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}
        >
          <meshToonMaterial color={color} transparent opacity={isPlaying ? 0.6 : 0.25} />
        </Torus>
      ))}
    </group>
  );
}

/** Pre-computed particle data */
const PARTICLE_DATA = Array.from({ length: 25 }, (_, i) => ({
  size: 0.03 + seededRandom(i * 13) * 0.05,
  position: [
    (seededRandom(i * 5) - 0.5) * 5,
    (seededRandom(i * 5 + 1) - 0.5) * 3,
    (seededRandom(i * 5 + 2) - 0.5) * 3,
  ] as [number, number, number],
  color: PARTICLE_COLORS[i % 6],
}));

/** Small floating particles */
function Particles({ isPlaying }: { isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const t = state.clock.elapsedTime + i;
      const speed = isPlaying ? 2 : 0.5;
      child.position.y += Math.sin(t * speed) * 0.003;
      child.position.x += Math.cos(t * speed * 0.7) * 0.002;
    });
  });

  return (
    <group ref={groupRef}>
      {PARTICLE_DATA.map((p, i) => (
        <Sphere key={i} args={[p.size, 8, 8]} position={p.position}>
          <meshToonMaterial color={p.color} transparent opacity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

interface StudioSceneProps {
  isPlaying: boolean;
}

export function StudioScene({ isPlaying }: StudioSceneProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={0.8} color="#FF6B6B" />
        <pointLight position={[-3, -2, 2]} intensity={0.6} color="#4ECDC4" />

        <PulsingOrb isPlaying={isPlaying} color="#FF6B6B" />
        <Rings isPlaying={isPlaying} />
        <Particles isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
}
