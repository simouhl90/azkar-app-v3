'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function FloatingParticles() {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  if (prefersReducedMotion.current) return null;

  const orbs = [
    {
      id: 'orb-green-1',
      size: 420,
      color: 'rgba(13, 59, 46, 0.08)',
      x: ['5%', '15%', '10%', '8%'],
      y: ['10%', '25%', '15%', '10%'],
      duration: 22,
    },
    {
      id: 'orb-gold-1',
      size: 380,
      color: 'rgba(197, 163, 86, 0.06)',
      x: ['70%', '80%', '65%', '75%'],
      y: ['5%', '20%', '30%', '10%'],
      duration: 26,
    },
    {
      id: 'orb-teal-1',
      size: 340,
      color: 'rgba(45, 139, 102, 0.05)',
      x: ['30%', '45%', '25%', '35%'],
      y: ['50%', '60%', '45%', '55%'],
      duration: 20,
    },
    {
      id: 'orb-green-2',
      size: 300,
      color: 'rgba(13, 59, 46, 0.04)',
      x: ['60%', '50%', '55%', '65%'],
      y: ['65%', '75%', '55%', '70%'],
      duration: 24,
    },
  ];

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 8,
    size: 1.5 + Math.random() * 2,
    opacity: 0.06 + Math.random() * 0.12,
    blur: 0.5 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Immersive gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
          }}
          animate={{
            x: orb.x,
            y: orb.y,
            scale: [1, 1.1, 0.95, 1.05],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle floating particles */}
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
            y: [0, -100, 0],
            x: [0, Math.sin(p.id * 1.5) * 50, 0],
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

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
    </div>
  );
}
