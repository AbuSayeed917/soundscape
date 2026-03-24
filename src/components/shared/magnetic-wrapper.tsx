"use client";

import { type ReactNode, useCallback, useRef } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface MagneticWrapperProps {
  children: ReactNode;
  className?: string;
  /** How far the element pulls toward cursor (px). Default 15 */
  strength?: number;
  /** How far away the magnet activates (multiplier). Default 1.5 */
  range?: number;
}

/**
 * Wraps any element with a magnetic pull-toward-cursor effect.
 * The element stretches toward the cursor when it enters the range,
 * then snaps back with a spring when the cursor leaves.
 */
export function MagneticWrapper({
  children,
  className = "",
  strength = 15,
  range = 1.5,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 250, damping: 15, mass: 0.5 });
  const y = useSpring(0, { stiffness: 250, damping: 15, mass: 0.5 });
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(y, [-strength, strength], [3, -3]);
  const rotateY = useTransform(x, [-strength, strength], [-3, 3]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;

      const maxDist = Math.max(rect.width, rect.height) * range;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < maxDist) {
        const factor = 1 - dist / maxDist;
        x.set(distX * factor * (strength / 30));
        y.set(distY * factor * (strength / 30));
        scale.set(1 + factor * 0.08);
      }
    },
    [x, y, scale, strength, range],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [x, y, scale]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x,
        y,
        scale,
        rotateX,
        rotateY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
