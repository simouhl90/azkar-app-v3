'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function FloatingParticles() {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  if (prefersReducedMotion.current) return null;

  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 10,
    size: 2 + Math.random() * 3,
    opacity: 0.08 + Math.random() * 0.15,
    blur: 0.5 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: 'radial-gradient(circle, rgba(197,163,86,0.8) 0%, rgba(197,163,86,0) 70%)',
            filter: `blur(${p.blur}px)`,
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, Math.sin(p.id) * 40, 0],
            opacity: [0, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Soft ambient glow orbs */}
      <div
        className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.04] dark:opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #1A5C42 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full opacity-[0.04] dark:opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #C5A356 0%, transparent 70%)' }}
      />
    </div>
  );
}
