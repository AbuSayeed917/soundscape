"use client";

import { type ReactNode, useCallback, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  color?: string;
  disabled?: boolean;
}

/**
 * A physically interactive button with:
 * - Spring-based press/release
 * - Tilt toward cursor on hover
 * - Ripple effect on click
 * - Scale bounce on press
 */
export function InteractiveButton({
  children,
  onClick,
  className = "",
  color = "#FF6B6B",
  disabled = false,
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleCounter = useRef(0);

  // Spring-animated values for 3D tilt
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  const scale = useSpring(1, { stiffness: 400, damping: 15 });

  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || disabled) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px);
      y.set(py);
    },
    [x, y, disabled],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [x, y, scale]);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;
    scale.set(0.92);
  }, [scale, disabled]);

  const handleMouseUp = useCallback(() => {
    scale.set(1.05);
    // Bounce back
    setTimeout(() => scale.set(1), 150);
  }, [scale]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.();

      // Spawn ripple
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const rippleX = e.clientX - rect.left;
        const rippleY = e.clientY - rect.top;
        const id = ++rippleCounter.current;
        setRipples((prev) => [...prev, { id, x: rippleX, y: rippleY }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
    },
    [onClick, disabled],
  );

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        scale,
        rotateX,
        rotateY,
        transformPerspective: 600,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      disabled={disabled}
      whileFocus={{ boxShadow: `0 0 0 3px ${color}40` }}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            backgroundColor: `${color}30`,
          }}
          initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.8 }}
          animate={{
            width: 200,
            height: 200,
            x: -100,
            y: -100,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
}
