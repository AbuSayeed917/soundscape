"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshWobbleMaterial,
  RoundedBox,
  Sphere,
  Torus,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";

/** Deterministic pseudo-random from seed */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** Cartoon headphones floating in the scene */
function Headphones({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={position} scale={1}>
        {/* Headband */}
        <mesh position={[0, 0.9, 0]}>
          <torusGeometry args={[0.7, 0.08, 16, 32, Math.PI]} />
          <meshToonMaterial color="#FF6B6B" />
        </mesh>
        {/* Left ear cup */}
        <group position={[-0.7, 0.2, 0]}>
          <RoundedBox args={[0.45, 0.55, 0.3]} radius={0.12} smoothness={4}>
            <meshToonMaterial color="#FF6B6B" />
          </RoundedBox>
          <RoundedBox args={[0.35, 0.45, 0.1]} radius={0.08} smoothness={4} position={[0, 0, 0.18]}>
            <meshToonMaterial color="#FFE66D" />
          </RoundedBox>
        </group>
        {/* Right ear cup */}
        <group position={[0.7, 0.2, 0]}>
          <RoundedBox args={[0.45, 0.55, 0.3]} radius={0.12} smoothness={4}>
            <meshToonMaterial color="#FF6B6B" />
          </RoundedBox>
          <RoundedBox args={[0.35, 0.45, 0.1]} radius={0.08} smoothness={4} position={[0, 0, 0.18]}>
            <meshToonMaterial color="#FFE66D" />
          </RoundedBox>
        </group>
      </group>
    </Float>
  );
}

/** Cartoon music note */
function MusicNote({
  position = [0, 0, 0] as [number, number, number],
  color = "#A8E6CF",
  scale = 1,
}) {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1.2}>
      <group position={position} scale={scale}>
        {/* Stem */}
        <mesh position={[0.15, 0.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshToonMaterial color={color} />
        </mesh>
        {/* Note head */}
        <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <MeshWobbleMaterial color={color} factor={0.3} speed={2} />
        </mesh>
        {/* Flag */}
        <mesh position={[0.15, 0.65, 0.05]} rotation={[0, 0, -0.3]}>
          <planeGeometry args={[0.2, 0.25]} />
          <meshToonMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </Float>
  );
}

/** Cartoon speaker / boombox */
function Speaker({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.03;
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={ref} position={position}>
        {/* Body */}
        <RoundedBox args={[1.2, 0.8, 0.5]} radius={0.15} smoothness={4}>
          <meshToonMaterial color="#4ECDC4" />
        </RoundedBox>
        {/* Speaker cone left */}
        <Sphere args={[0.22, 16, 16]} position={[-0.3, 0, 0.26]}>
          <meshToonMaterial color="#2C3E50" />
        </Sphere>
        <Torus args={[0.22, 0.03, 8, 16]} position={[-0.3, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <meshToonMaterial color="#FFE66D" />
        </Torus>
        {/* Speaker cone right */}
        <Sphere args={[0.22, 16, 16]} position={[0.3, 0, 0.26]}>
          <meshToonMaterial color="#2C3E50" />
        </Sphere>
        <Torus args={[0.22, 0.03, 8, 16]} position={[0.3, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <meshToonMaterial color="#FFE66D" />
        </Torus>
      </group>
    </Float>
  );
}

const BUBBLE_COLORS = ["#FF6B6B", "#FFE66D", "#A8E6CF", "#4ECDC4", "#DDA0DD", "#87CEEB"];

/** Pre-computed bubble positions using seeded random */
const BUBBLE_DATA = Array.from({ length: 20 }, (_, i) => ({
  position: [
    (seededRandom(i * 3) - 0.5) * 10,
    (seededRandom(i * 3 + 1) - 0.5) * 6,
    (seededRandom(i * 3 + 2) - 0.5) * 5 - 2,
  ] as [number, number, number],
  scale: 0.1 + seededRandom(i * 7) * 0.25,
  speed: 0.5 + seededRandom(i * 11) * 2,
  color: BUBBLE_COLORS[i % 6],
}));

/** Floating bubbles / orbs */
function Bubbles() {
  return (
    <>
      {BUBBLE_DATA.map((b, i) => (
        <Float key={i} speed={b.speed} rotationIntensity={0.2} floatIntensity={1.5}>
          <Sphere args={[b.scale, 16, 16]} position={b.position}>
            <MeshWobbleMaterial
              color={b.color}
              transparent
              opacity={0.5}
              factor={0.4}
              speed={1}
            />
          </Sphere>
        </Float>
      ))}
    </>
  );
}

/** Sound wave rings */
function SoundWaves({ position = [0, 0, 0] as [number, number, number] }) {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringsRef.current) return;
    ringsRef.current.children.forEach((ring, i) => {
      const t = state.clock.elapsedTime + i * 0.5;
      const scale = 1 + Math.sin(t * 2) * 0.15;
      ring.scale.set(scale, scale, scale);
      const mat = (ring as THREE.Mesh).material as THREE.MeshToonMaterial;
      mat.opacity = 0.3 + Math.sin(t * 2) * 0.2;
    });
  });

  return (
    <group ref={ringsRef} position={position}>
      {[0.8, 1.1, 1.4, 1.7].map((radius, i) => (
        <Torus
          key={i}
          args={[radius, 0.02, 8, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshToonMaterial
            color={["#FF6B6B", "#FFE66D", "#A8E6CF", "#4ECDC4"][i]}
            transparent
            opacity={0.4}
          />
        </Torus>
      ))}
    </group>
  );
}

export function CartoonScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#fff" />
        <pointLight position={[-3, 2, 2]} intensity={0.6} color="#FF6B6B" />
        <pointLight position={[3, -2, 2]} intensity={0.6} color="#4ECDC4" />

        <Headphones position={[0, 0.8, 0]} />
        <Speaker position={[-2.5, -1, -1]} />
        <MusicNote position={[2.2, 1.2, -0.5]} color="#FFE66D" scale={0.8} />
        <MusicNote position={[-1.8, 1.8, -1]} color="#A8E6CF" scale={0.6} />
        <MusicNote position={[2.8, -0.5, -1.5]} color="#DDA0DD" scale={0.7} />
        <SoundWaves position={[0, -0.5, -2]} />
        <Bubbles />

        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
